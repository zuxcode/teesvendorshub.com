import { captureException } from "@sentry/nextjs";
import type { OrderRepository } from "@/modules/order/repository/order.repository";
import {
  PAYMENT_PROVIDER_NAME,
  PAYMENT_STATUS,
} from "@/modules/payments/payment.constants";
import type { PaymentRepository } from "@/modules/payments/payment.repository";
import type { PaymentService } from "@/modules/payments/payment.service";
import {
  InsufficientStockError,
  ProductNotFoundError,
  ProductOutOfStockError,
} from "@/modules/products/product.error";
import type { ProductService } from "@/modules/products/product.service";
import type {
  Order,
  Payment,
  Product,
  ProductLibrary,
  User,
} from "@/payload-types";
import { PAYMENT_CHECKOUT_REDIRECT_URL } from "@/shared/config/app-config";
import { ServerError } from "@/shared/errors/global-errors";
import type { DatabaseTransaction } from "@/shared/types";
import { env } from "@/shared/utils/env";
import { generateUniqueReference } from "@/shared/utils/generate-unique-ref";
import { splitFullName } from "@/shared/utils/split-full-name";
import { ORDER_STATUS } from "../order/order.constants";
import type { OrderItemRepository } from "../order/repository/order-item.repository";
import type { ProductType } from "../products/constant/product.constants";
import { CheckoutError, CheckoutErrorCode } from "./checkout.errors";
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
  product: Product;
  productImage: string | ProductLibrary;
  productName: string;
  productType: ProductType;
  quantity: number;
  unitPrice: number;
}

export class CheckoutService {
  private readonly productService: ProductService;
  private readonly orderRepository: OrderRepository;
  private readonly orderItemRepository: OrderItemRepository;
  private readonly paymentRepository: PaymentRepository;
  private readonly paymentService: PaymentService;
  private readonly databaseTransaction: DatabaseTransaction;

  constructor(
    productService: ProductService,
    orderRepository: OrderRepository,
    paymentRepository: PaymentRepository,
    paymentService: PaymentService,
    orderItemRepository: OrderItemRepository,
    databaseTransaction: DatabaseTransaction
  ) {
    this.productService = productService;
    this.orderRepository = orderRepository;
    this.paymentRepository = paymentRepository;
    this.paymentService = paymentService;
    this.orderItemRepository = orderItemRepository;
    this.databaseTransaction = databaseTransaction;
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
      const id = item.productId;
      quantities.set(id, (quantities.get(id) ?? 0) + item.quantity);
    }

    const products = await this.productService.findByIds([
      ...quantities.keys(),
    ]);

    const productsById = new Map(products.map((p) => [p.id, p]));

    const hasPhysical = products.some((p) => p.productType === "physical");

    const shipping = hasPhysical
      ? createPhysicalCheckoutSchema.parse(args.rawInput)
      : undefined;

    const fullName = shipping?.fullName ?? user.fullName;
    const phoneNumber = shipping?.phone ?? user.phone ?? undefined;

    if (!fullName) {
      throw new CheckoutError(CheckoutErrorCode.PAYMENT_INIT_FAILED);
    }

    const { firstname, lastname } = splitFullName(fullName);

    const orderItems: CheckoutOrderItem[] = [];
    let total = 0;

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
        product,
        productImage: product.productImage,
        productName: product.name,
        productType: product.productType,
        quantity,
        unitPrice: product.price,
      });
      total += lineTotal;
    }

    const reference = generateUniqueReference("ORD");

    const transactionID = await this.databaseTransaction.beginTransaction();
    if (!transactionID) {
      captureException(new Error("Failed to begin database transaction"), {
        tags: { layer: "database", operation: "beginTransaction" },
      });
      throw new ServerError();
    }

    let order: Order;
    let payment: Payment;

    try {
      order = await this.orderRepository.create(
        {
          buyer: user.id,
          currency: "NGN",
          deliveryInstructions: shipping?.deliveryInstructions,
          email,
          phone: phoneNumber,
          reference,
          status: ORDER_STATUS.PENDING,
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
          subtotal: total,
          total,
        },
        transactionID
      );

      for (const item of orderItems) {
        // biome-ignore lint/performance/noAwaitInLoops: <Sequential writes are intentional>
        await this.orderItemRepository.create(
          {
            fulfillmentStatus: ORDER_STATUS.PENDING,
            lineTotal: item.lineTotal,
            order: order.id,
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
          orderReference: reference,
          provider: PAYMENT_PROVIDER_NAME.TRANSACTPAY,
          status: PAYMENT_STATUS.PENDING,
        },
        transactionID
      );

      await this.databaseTransaction.commitTransaction(transactionID);
    } catch (error) {
      await this.databaseTransaction.rollbackTransaction(transactionID);
      captureException(error, {
        tags: {
          actionName: "checkOutAction",
          flow: "Create checkout transaction",
        },
      });
      // biome-ignore lint/style/useErrorCause: <supress cause>
      throw new ServerError();
    }

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
          phone: phoneNumber,
          redirectUrl: new URL(
            PAYMENT_CHECKOUT_REDIRECT_URL,
            env.NEXT_PUBLIC_APP_URL
          ).toString(),
          reference,
        },
        paymentId: payment.id,
      });
      return { checkoutUrl: result.checkoutUrl, order };
    } catch (error) {
      captureException(error, {
        tags: { actionName: "checkOutAction", flow: "Initialize payment" },
      });
      // biome-ignore lint/style/useErrorCause: <supress cause>
      throw new CheckoutError("PAYMENT_INIT_FAILED");
    }
  }
}
