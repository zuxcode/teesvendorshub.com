import { captureException } from "@sentry/nextjs";
import type { OrderRepository } from "@/modules/order/order.repository";
import { PAYMENT_PROVIDER_NAME } from "@/modules/payments/payment.constants";
import { PaymentError } from "@/modules/payments/payment.errors";
import type { PaymentRepository } from "@/modules/payments/payment.repository";
import type { PaymentService } from "@/modules/payments/payment.service";
import {
  InsufficientStockError,
  ProductNotFoundError,
  ProductOutOfStockError,
} from "@/modules/products/product.error";
import type { ProductService } from "@/modules/products/product.service";
import { TRANSACTION_TYPE } from "@/modules/transaction/constants/constant";
import type { TransactionRepository } from "@/modules/transaction/transaction.repository";
import type {
  Order,
  Payment,
  Product,
  ProductLibrary,
  Transaction,
  User,
} from "@/payload-types";
import { PAYMENT_CHECKOUT_REDIRECT_URL } from "@/shared/config/app-config";
import type { ResourceId } from "@/shared/types";
import { env } from "@/shared/utils/env";
import { generateUniqueReference } from "@/shared/utils/generate-unique-ref";
import { splitFullName } from "@/shared/utils/split-full-name";
import type { OrderStatus } from "../order/order.constants";
import type { ProductType } from "../products/product.contants";
import { CheckoutError } from "./checkout.errors";
import {
  type CartItemsSchemaValues,
  createPhysicalCheckoutSchema,
} from "./lib/check-out-schema";

type CheckoutUser = Pick<User, "id" | "fullName" | "phone">;

export interface CheckoutResult {
  checkoutUrl: string;
  order: Order;
}

interface CheckoutOrderItem {
  lineTotal: number;
  orderStatus: OrderStatus;
  product: Product;
  productImage: number | ProductLibrary;
  productName: string;
  productType: ProductType;
  quantity: number;
  unitPrice: number;
}

export class CheckoutService {
  private readonly productService: ProductService;
  private readonly orderRepository: OrderRepository;
  private readonly paymentRepository: PaymentRepository;
  private readonly transactionRepository: TransactionRepository;
  private readonly paymentService: PaymentService;
  private readonly beginTransaction: () => Promise<null | number | string>;
  private readonly commit: (
    id: number | Promise<number | string> | string
  ) => Promise<void>;
  private readonly rollback: (
    id: number | Promise<number | string> | string
  ) => Promise<void>;
  constructor(
    productService: ProductService,
    orderRepository: OrderRepository,
    paymentRepository: PaymentRepository,
    transactionRepository: TransactionRepository,
    paymentService: PaymentService,
    beginTransaction: () => Promise<null | number | string>,
    commit: (id: number | Promise<number | string> | string) => Promise<void>,
    rollback: (id: number | Promise<number | string> | string) => Promise<void>
  ) {
    this.productService = productService;
    this.orderRepository = orderRepository;
    this.paymentRepository = paymentRepository;
    this.transactionRepository = transactionRepository;
    this.paymentService = paymentService;
    this.beginTransaction = beginTransaction;
    this.commit = commit;
    this.rollback = rollback;
  }

  async checkout(args: {
    user: CheckoutUser;
    email: string;
    items: CartItemsSchemaValues;
    rawInput: unknown;
  }): Promise<CheckoutResult> {
    const { user, email } = args;

    /**
     * Aggregate quantities by product ID.
     *
     * This prevents a client from bypassing stock validation by
     * submitting the same product multiple times.
     */
    const quantities = new Map<string, number>();
    for (const item of args.items) {
      const id = String(item.productId);
      quantities.set(id, (quantities.get(id) ?? 0) + item.quantity);
    }

    const products = await this.productService.findByIds([
      ...quantities.keys(),
    ]);

    const productsById = new Map(products.map((p) => [String(p.id), p]));

    const hasPhysical = products.some((p) => p.productType === "physical");

    const shipping = hasPhysical
      ? createPhysicalCheckoutSchema.parse(args.rawInput)
      : undefined;

    const fullName = shipping?.fullName ?? user.fullName;

    if (!fullName) {
      throw new CheckoutError("PAYMENT_INIT_FAILED");
    }

    const { firstname, lastname } = splitFullName(fullName);

    const orderItems: CheckoutOrderItem[] = [];
    let subtotal = 0;

    for (const [productId, quantity] of quantities) {
      const product = productsById.get(productId);
      if (!product) {
        throw new ProductNotFoundError();
      }
      if (product.virtualStock === 0) {
        throw new ProductOutOfStockError();
      }
      if (product.virtualStock < quantity) {
        throw new InsufficientStockError();
      }

      const lineTotal = product.price * quantity;

      orderItems.push({
        lineTotal,
        orderStatus: "pending" as const,
        product,
        productImage: product.productImage,
        productName: product.name,
        productType: product.productType,
        quantity,
        unitPrice: product.price,
      });
      subtotal += lineTotal;
    }

    const total = subtotal;
    const orderNumber = generateUniqueReference("ORD");

    const transactionID = await this.beginTransaction();
    if (!transactionID) {
      captureException(new Error("Failed to begin database transaction"), {
        tags: { layer: "database", operation: "beginTransaction" },
      });
      throw new CheckoutError("TRANSACTION_FAILED");
    }

    let order: Order;
    let payment: Payment;
    let transaction: Transaction;

    try {
      order = await this.orderRepository.create(
        {
          buyer: user.id,
          currency: "NGN",
          deliveryInstructions: shipping?.deliveryInstructions,
          email,
          orderNumber,
          orderStatus: "pending",
          phone: shipping?.phone || user.phone,
          ...(shipping
            ? {
                shippingAddress: {
                  addressLine1: shipping.addressLine1,
                  addressLine2: shipping.addressLine2,
                  city: shipping.city,
                  country: shipping.country,
                  fullName,
                  postalCode: shipping.postalCode,
                  state: shipping.state,
                },
              }
            : {}),
          subtotal,
          total,
        },
        transactionID
      );

      for (const item of orderItems) {
        // biome-ignore lint/performance/noAwaitInLoops: <Sequential writes are intentional>
        await this.orderRepository.createOrderItem(
          {
            lineTotal: item.lineTotal,
            order: order.id,
            orderStatus: item.orderStatus,
            product: item.product.id,
            productImage: item.productImage,
            productName: item.productName,
            productType: item.productType,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          },
          transactionID
        );
      }

      payment = await this.paymentRepository.create(
        {
          amount: total,
          buyer: user.id,
          currency: "NGN",
          order: order.id,
          orderReference: orderNumber,
          provider: PAYMENT_PROVIDER_NAME.TRANSACTPAY,
          status: "pending",
        },
        transactionID
      );

      transaction = await this.transactionRepository.create(
        {
          amount: total,
          currency: "NGN",
          customer: user.id,
          description: "purchase",
          order: order.id,
          provider: PAYMENT_PROVIDER_NAME.TRANSACTPAY,
          reference: orderNumber,
          status: "pending",
          type: TRANSACTION_TYPE.PAYMENT,
        },
        transactionID
      );

      await this.commit(transactionID);
    } catch (error) {
      await this.rollback(transactionID);
      captureException(error, {
        tags: {
          actionName: "checkOutAction",
          flow: "Create checkout transaction",
        },
      });
      // biome-ignore lint/style/useErrorCause: <supress cause> --- IGNORE ---
      throw new CheckoutError("CHECKOUT_PERSIST_FAILED");
    }

    // ── 6. Provider — only after commit ──
    try {
      const result = await this.paymentService.initializePayment({
        input: {
          amount: total,
          currency: "NGN",
          customerCountry: shipping?.country,
          description: "purchase",
          email,
          firstname,
          lastname,
          phone: shipping?.phone,
          redirectUrl: new URL(
            PAYMENT_CHECKOUT_REDIRECT_URL,
            env.NEXT_PUBLIC_APP_URL
          ).toString(),
          reference: orderNumber,
        },
        paymentId: payment.id,
      });
      return { checkoutUrl: result.checkoutUrl, order };
    } catch (error) {
      if (error instanceof PaymentError) {
        await this.markFailed(transaction, payment, error); // new tx, both updates atomic
        throw error;
      }
      captureException(error, {
        tags: { actionName: "checkOutAction", flow: "Initialize payment" },
      });
      // biome-ignore lint/style/useErrorCause: <supress cause> --- IGNORE ---
      throw new CheckoutError("PAYMENT_INIT_FAILED");
    }
  }

  private async markFailed(
    transaction: Transaction,
    payment: { id: ResourceId },
    error: PaymentError
  ): Promise<void> {
    const id = await this.beginTransaction();
    if (!id) {
      return;
    }
    try {
      await this.transactionRepository.update(
        transaction.id,
        {
          failureCode: error.code,
          failureMessage: error.message,
          status: "failed",
        },
        id
      );
      await this.paymentRepository.update(payment.id, { status: "failed" }, id);
      await this.commit(id);
    } catch (err) {
      await this.rollback(id);
      captureException(err, {
        tags: { actionName: "checkOutAction", flow: "Mark payment failed" },
      });
    }
  }
}
