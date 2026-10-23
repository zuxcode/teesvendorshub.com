/** biome-ignore-all lint/style/useDestructuring: Reduce noise. */
/** biome-ignore-all lint/suspicious/noEqualsToNull: <intentionally turn off for null and undefine check> */

import { captureException } from "@sentry/nextjs";
import type { DatabaseTransactionBase } from "@/modules/database/database-transaction-basemodel";
import type { GiftRepository } from "@/modules/gift/repository/gift.repository";
import {
  ORDER_FULFILLMENT_STATUS,
  ORDER_STATUS,
} from "@/modules/order/order.constants";
import type { OrderRepository } from "@/modules/order/repository/order.repository";
import type { OrderItemRepository } from "@/modules/order/repository/order-item.repository";
import {
  PAYMENT_STATUS,
  type PaymentProviderName,
} from "@/modules/payments/payment.constants";
import type { PaymentRepository } from "@/modules/payments/repository/payment.repository";
import type { PaymentService } from "@/modules/payments/service/payment.service";
import {
  InsufficientStockError,
  ProductNotFoundError,
  ProductOutOfStockError,
} from "@/modules/products/product.error";
import type { ProductRepository } from "@/modules/products/repository/product.repository";
import { SIM_TYPE } from "@/modules/sim/constant";
import type { SimRepository } from "@/modules/sim/repository/sim.repository";
import type {
  Gift,
  Order,
  OrderItem,
  Payment,
  Product,
  Sim,
  User,
} from "@/payload-types";
import { PAYMENT_CHECKOUT_REDIRECT_URL } from "@/shared/config/app-config";
import { RELATION_TO, type RelationTo } from "@/shared/constant";
import { env } from "@/shared/utils/env";
import { generateUniqueReference } from "@/shared/utils/generate-unique-ref";
import { splitFullName } from "@/shared/utils/split-full-name";
import {
  type CartItemsSchemaValues,
  type CreatePhysicalCheckoutSchemaValues,
  createPhysicalCheckoutSchema,
} from "../lib/check-out-schema";

type CheckoutUser = Pick<User, "id" | "fullName" | "phone">;

interface CheckOutProps {
  email: string;
  items: CartItemsSchemaValues;
  provider: PaymentProviderName;
  rawInput: unknown;
  user: CheckoutUser;
}

interface CheckoutServiceDependencies {
  databaseTransactionBase: DatabaseTransactionBase;
  giftRepository: GiftRepository;
  orderItemRepository: OrderItemRepository;
  orderRepository: OrderRepository;
  paymentRepository: PaymentRepository;
  paymentService: PaymentService;
  productRepository: ProductRepository;
  simRepository: SimRepository;
}

interface LoadedProducts {
  products: Product[];
  productsById: Map<string, Product>;
}

interface LoadedGifts {
  gifts: Gift[];
  giftsById: Map<string, Gift>;
}

interface LoadedSims {
  sims: Sim[];
  simsById: Map<string, Sim>;
}

interface InventoryItem {
  id: string;
  name: string;
  priceKobo: number;
  productImage: Product["productImage"];
  stock: number;
}

interface ValidatedCheckoutItems {
  gifts: Gift[];
  giftsById: Map<string, Gift>;
  products: Product[];
  productsById: Map<string, Product>;
  sims: Sim[];
  simsById: Map<string, Sim>;
}

interface CreateOrderProps {
  email: string;
  fullName: string;
  orderItems: Partial<OrderItem>[];
  phone: string | undefined;
  provider: PaymentProviderName;
  reference: string;
  shippingDetails?: CreatePhysicalCheckoutSchemaValues;
  totalKobo: number;
  user: CheckoutUser;
}

type QuantitiesById = Map<string, number>;

export class CheckoutService {
  private readonly databaseTransactionBase: DatabaseTransactionBase;
  private readonly giftRepository: GiftRepository;
  private readonly orderItemRepository: OrderItemRepository;
  private readonly orderRepository: OrderRepository;
  private readonly paymentRepository: PaymentRepository;
  private readonly paymentService: PaymentService;
  private readonly productRepository: ProductRepository;
  private readonly simRepository: SimRepository;

  constructor({
    databaseTransactionBase,
    giftRepository,
    orderItemRepository,
    orderRepository,
    paymentRepository,
    paymentService,
    productRepository,
    simRepository,
  }: CheckoutServiceDependencies) {
    this.databaseTransactionBase = databaseTransactionBase;
    this.giftRepository = giftRepository;
    this.orderItemRepository = orderItemRepository;
    this.orderRepository = orderRepository;
    this.paymentRepository = paymentRepository;
    this.paymentService = paymentService;
    this.productRepository = productRepository;
    this.simRepository = simRepository;
  }

  private aggregateCartQuantities(
    cartItems: CartItemsSchemaValues
  ): Map<RelationTo, QuantitiesById> {
    const quantitiesByRelation = new Map<RelationTo, QuantitiesById>();

    for (const item of cartItems) {
      let quantitiesById = quantitiesByRelation.get(item.relationTo);

      if (!quantitiesById) {
        quantitiesById = new Map<string, number>();
        quantitiesByRelation.set(item.relationTo, quantitiesById);
      }

      const quantity = quantitiesById.get(item.id) ?? 0;
      quantitiesById.set(item.id, quantity + item.quantity);
    }

    return quantitiesByRelation;
  }

  private async loadProducts(
    quantitiesById: QuantitiesById
  ): Promise<LoadedProducts> {
    const products = quantitiesById.size
      ? await this.productRepository.findByIds([...quantitiesById.keys()])
      : [];

    return {
      products,
      productsById: new Map(products.map((product) => [product.id, product])),
    };
  }

  private async loadGifts(
    quantitiesById: QuantitiesById
  ): Promise<LoadedGifts> {
    const gifts = quantitiesById.size
      ? await this.giftRepository.findByIds([...quantitiesById.keys()])
      : [];

    return {
      gifts,
      giftsById: new Map(gifts.map((gift) => [gift.id, gift])),
    };
  }

  private async loadSims(quantitiesById: QuantitiesById): Promise<LoadedSims> {
    const sims = quantitiesById.size
      ? await this.simRepository.findByIds([...quantitiesById.keys()])
      : [];

    return {
      sims,
      simsById: new Map(sims.map((sim) => [sim.id, sim])),
    };
  }

  private requireAllItemsExist(
    quantitiesByRelation: Map<RelationTo, QuantitiesById>,
    loadedItems: Pick<
      ValidatedCheckoutItems,
      "productsById" | "giftsById" | "simsById"
    >
  ): void {
    for (const [relation, quantitiesById] of quantitiesByRelation) {
      for (const id of quantitiesById.keys()) {
        let exists: boolean;

        switch (relation) {
          case RELATION_TO.PRODUCT:
            exists = loadedItems.productsById.has(id);
            break;
          case RELATION_TO.GIFT:
            exists = loadedItems.giftsById.has(id);
            break;
          case RELATION_TO.SIM:
            exists = loadedItems.simsById.has(id);
            break;
          default:
            throw new Error(`Unsupported cart item type: ${relation}`);
        }

        if (!exists) {
          throw new ProductNotFoundError();
        }
      }
    }
  }

  private validateQuantities<T extends InventoryItem>(
    quantitiesById: QuantitiesById,
    entitiesById: Map<string, T>
  ): void {
    for (const [id, quantity] of quantitiesById) {
      const entity = entitiesById.get(id);

      if (!entity) {
        throw new ProductNotFoundError();
      }

      if (!Number.isSafeInteger(quantity) || quantity < 1) {
        throw new Error("Item quantity must be a positive integer.");
      }

      if (!Number.isSafeInteger(entity.stock) || entity.stock < 0) {
        throw new Error(`Invalid inventory stock for item ${id}.`);
      }

      if (entity.stock === 0) {
        throw new ProductOutOfStockError();
      }

      if (entity.stock < quantity) {
        throw new InsufficientStockError();
      }

      if (!Number.isSafeInteger(entity.priceKobo) || entity.priceKobo < 0) {
        throw new Error(`Invalid price for item ${id}.`);
      }
    }
  }

  private validateAllQuantities(
    quantitiesByRelation: Map<RelationTo, QuantitiesById>,
    loadedItems: ValidatedCheckoutItems
  ): void {
    for (const [relation, quantitiesById] of quantitiesByRelation) {
      switch (relation) {
        case RELATION_TO.PRODUCT:
          this.validateQuantities(quantitiesById, loadedItems.productsById);
          break;
        case RELATION_TO.GIFT:
          this.validateQuantities(quantitiesById, loadedItems.giftsById);
          break;
        case RELATION_TO.SIM:
          this.validateQuantities(quantitiesById, loadedItems.simsById);
          break;
        default:
          throw new Error(`Unsupported cart item type: ${relation}`);
      }
    }
  }

  private requiresShippingAddress(hasGift: boolean, sims: Sim[]): boolean {
    return hasGift || sims.some((sim) => sim.simType === SIM_TYPE.PHYSICAL);
  }

  private validateShippingAddress(
    rawInput: unknown
  ): CreatePhysicalCheckoutSchemaValues {
    return createPhysicalCheckoutSchema.parse(rawInput);
  }

  private buildProductOrderItems(
    quantitiesById: QuantitiesById,
    productsById: Map<string, Product>
  ): Partial<OrderItem>[] {
    const orderItems: Partial<OrderItem>[] = [];

    for (const [id, quantity] of quantitiesById) {
      const product = productsById.get(id);

      if (!product) {
        throw new ProductNotFoundError();
      }

      orderItems.push({
        lineTotal: product.priceKobo * quantity,
        product: product.id,
        productImage: product.productImage,
        productName: product.name,
        productType: RELATION_TO.PRODUCT,
        quantity,
        unitPrice: product.priceKobo,
      });
    }

    return orderItems;
  }

  private buildGiftOrderItems(
    quantitiesById: QuantitiesById,
    giftsById: Map<string, Gift>
  ): Partial<OrderItem>[] {
    const orderItems: Partial<OrderItem>[] = [];

    for (const [id, quantity] of quantitiesById) {
      const gift = giftsById.get(id);

      if (!gift) {
        throw new ProductNotFoundError();
      }

      orderItems.push({
        gift: gift.id,
        lineTotal: gift.priceKobo * quantity,
        productImage: gift.productImage,
        productName: gift.name,
        productType: RELATION_TO.GIFT,
        quantity,
        unitPrice: gift.priceKobo,
      });
    }

    return orderItems;
  }

  private buildSimOrderItems(
    quantitiesById: QuantitiesById,
    simsById: Map<string, Sim>
  ): Partial<OrderItem>[] {
    const orderItems: Partial<OrderItem>[] = [];

    for (const [id, quantity] of quantitiesById) {
      const sim = simsById.get(id);

      if (!sim) {
        throw new ProductNotFoundError();
      }

      if (sim.simType !== SIM_TYPE.ESIM && sim.simType !== SIM_TYPE.PHYSICAL) {
        throw new Error(`SIM ${id} has an invalid SIM type.`);
      }

      orderItems.push({
        lineTotal: sim.priceKobo * quantity,
        productImage: sim.productImage,
        productName: sim.name,
        productType: RELATION_TO.SIM,
        quantity,
        sim: sim.id,
        simType: sim.simType,
        unitPrice: sim.priceKobo,
      });
    }

    return orderItems;
  }

  private buildOrderItems(
    quantitiesByRelation: Map<RelationTo, QuantitiesById>,
    loadedItems: ValidatedCheckoutItems
  ): Partial<OrderItem>[] {
    const orderItems: Partial<OrderItem>[] = [];

    for (const [relation, quantitiesById] of quantitiesByRelation) {
      switch (relation) {
        case RELATION_TO.PRODUCT:
          orderItems.push(
            ...this.buildProductOrderItems(
              quantitiesById,
              loadedItems.productsById
            )
          );
          break;
        case RELATION_TO.GIFT:
          orderItems.push(
            ...this.buildGiftOrderItems(quantitiesById, loadedItems.giftsById)
          );
          break;
        case RELATION_TO.SIM:
          orderItems.push(
            ...this.buildSimOrderItems(quantitiesById, loadedItems.simsById)
          );
          break;
        default:
          throw new Error(`Unsupported cart item type: ${relation}`);
      }
    }

    return orderItems;
  }

  private async createOrder({
    email,
    fullName,
    orderItems,
    phone,
    reference,
    shippingDetails,
    totalKobo,
    user,
    provider,
  }: CreateOrderProps): Promise<{ order: Order; payment: Payment }> {
    const result = await this.databaseTransactionBase.withDatabaseTransaction(
      async (transactionId) => {
        const order = await this.orderRepository.create(
          {
            buyer: user.id,
            currency: "NGN",
            deliveryInstructions: shippingDetails?.deliveryInstructions,
            email,
            phone,
            reference,
            status: ORDER_STATUS.PENDING,
            ...(shippingDetails
              ? {
                  shippingAddress: {
                    addressLine1: shippingDetails.addressLine1,
                    addressLine2: shippingDetails.addressLine2,
                    city: shippingDetails.city,
                    country: shippingDetails.country,
                    fullName,
                    postalCode: shippingDetails.postalCode,
                    state: shippingDetails.state,
                  },
                }
              : {}),
            subtotal: totalKobo,
            total: totalKobo,
          },
          transactionId
        );

        for (const item of orderItems) {
          if (
            !(item.productType && item.quantity && item.productName) ||
            item.unitPrice == null ||
            item.lineTotal == null
          ) {
            throw new Error("Invalid order item.");
          }

          // biome-ignore lint/performance/noAwaitInLoops: <Sequential writes are intentional>
          await this.orderItemRepository.create(
            {
              fulfillmentStatus: ORDER_FULFILLMENT_STATUS.PENDING,
              gift: item.gift,
              lineTotal: item.lineTotal,
              order: order.id,
              product: item.product,
              productImage: item.productImage,
              productName: item.productName,
              productType: item.productType,
              quantity: item.quantity,
              sim: item.sim,
              simType: item.simType,
              unitPrice: item.unitPrice,
            },
            transactionId
          );
        }

        const payment = await this.paymentRepository.create(
          {
            amount: totalKobo,
            buyer: user.id,
            currency: "NGN",
            order: order.id,
            orderReference: reference,
            provider,
            status: PAYMENT_STATUS.PENDING,
          },
          transactionId
        );

        return { order, payment };
      }
    );

    if (!result) {
      throw new Error("Order creation was rolled back.");
    }

    return result;
  }

  async checkout({
    items,
    email,
    rawInput,
    user,
    provider,
  }: CheckOutProps): Promise<string> {
    if (items.length === 0) {
      throw new Error("Cannot checkout with an empty cart.");
    }

    const quantitiesByRelation = this.aggregateCartQuantities(items);

    const productQuantities =
      quantitiesByRelation.get(RELATION_TO.PRODUCT) ??
      new Map<string, number>();
    const giftQuantities =
      quantitiesByRelation.get(RELATION_TO.GIFT) ?? new Map<string, number>();
    const simQuantities =
      quantitiesByRelation.get(RELATION_TO.SIM) ?? new Map<string, number>();

    const [loadedProducts, loadedGifts, loadedSims] = await Promise.all([
      this.loadProducts(productQuantities),
      this.loadGifts(giftQuantities),
      this.loadSims(simQuantities),
    ]);

    const loadedItems: ValidatedCheckoutItems = {
      gifts: loadedGifts.gifts,
      giftsById: loadedGifts.giftsById,
      products: loadedProducts.products,
      productsById: loadedProducts.productsById,
      sims: loadedSims.sims,
      simsById: loadedSims.simsById,
    };

    this.requireAllItemsExist(quantitiesByRelation, loadedItems);
    this.validateAllQuantities(quantitiesByRelation, loadedItems);

    const requiresShippingAddress = this.requiresShippingAddress(
      giftQuantities.size > 0,
      loadedItems.sims
    );

    let fullName = user.fullName;
    let phone = user.phone ?? undefined;
    let shippingDetails: CreatePhysicalCheckoutSchemaValues | undefined;

    if (requiresShippingAddress) {
      shippingDetails = this.validateShippingAddress(rawInput);
      fullName = shippingDetails.fullName;
      phone = shippingDetails.phone;
    }

    if (!fullName?.trim()) {
      throw new Error("A full name is required to checkout.");
    }

    const orderItems = this.buildOrderItems(quantitiesByRelation, loadedItems);

    const totalKobo = orderItems.reduce(
      (total, item) => total + (item.lineTotal ?? 0),
      0
    );

    if (!Number.isSafeInteger(totalKobo) || totalKobo <= 0) {
      throw new Error("Unable to calculate a valid checkout total.");
    }

    const reference = generateUniqueReference("ORD");

    const { order, payment } = await this.createOrder({
      email,
      fullName,
      orderItems,
      phone,
      provider,
      reference,
      shippingDetails,
      totalKobo,
      user,
    });

    const { firstname, lastname } = splitFullName(fullName);

    try {
      const { checkoutUrl } = await this.paymentService.initializePayment({
        input: {
          amount: totalKobo,
          currency: "NGN",
          customerCountry: shippingDetails?.country,
          description: "Purchase",
          email,
          firstname,
          lastname,
          phone,
          redirectUrl: new URL(
            PAYMENT_CHECKOUT_REDIRECT_URL,
            env.NEXT_PUBLIC_APP_URL
          ).toString(),
          reference,
        },
        paymentId: payment.id,
      });

      return checkoutUrl;
    } catch (error) {
      captureException(error, {
        extra: {
          orderId: order.id,
          paymentId: payment.id,
          reference,
        },
        tags: {
          actionName: "checkOutAction",
          flow: "Initialize payment",
        },
      });

      throw new Error("Payment initialization failed.", { cause: error });
    }
  }
}
