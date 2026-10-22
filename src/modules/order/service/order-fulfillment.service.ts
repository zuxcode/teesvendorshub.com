/** biome-ignore-all lint/performance/noAwaitInLoops: <Intentional sequential Operation> */

import { type BasePayload, JobCancelledError, type TaskHandler } from "payload";
import { DatabaseTransactionBase } from "@/modules/database/database-transaction-basemodel";
import { InventoryRepository } from "@/modules/inventory/inventory.repository";
import { ProductRepository } from "@/modules/products/repository/product.repository";
import { ProductSecretRepository } from "@/modules/products/repository/product-secret.repository";
import type {
  OrderItem,
  Product,
  ProductSecret,
  TaskDeliverOrder,
} from "@/payload-types";
import type { DatabaseTransactionId } from "@/shared/types";
import { getRelationshipId } from "@/shared/utils/get-relationship-id";
import { ORDER_STATUS } from "../order.constants";
import { OrderErrorMessage } from "../order.error";
import { OrderRepository } from "../repository/order.repository";
import { OrderItemRepository } from "../repository/order-item.repository";

type ProductsById = Map<string, Product>;
type QuantitiesByProductId = Map<string, number>;

type RequestedQuantitiesByProductId = QuantitiesByProductId;
type DeliverableQuantitiesByProductId = QuantitiesByProductId;
type ProductSecretsByProductId = Map<string, ProductSecret[]>;

type DeliverableOrderItems = Pick<
  StockAvailabilityResult,
  "deliverableOrderItems"
>;

interface StockAvailabilityProps {
  orderedItems: OrderItem[];
  productsById: ProductsById;
  requestedQuantitiesByProductId: RequestedQuantitiesByProductId;
}

interface StockAvailabilityResult {
  deliverableOrderItems: OrderItem[];
  unavailableOrderItems: OrderItem[];
}

interface CreateSaleMovementProps extends DeliverableOrderItems {
  productsById: ProductsById;
  reference: string;
  transactionId?: DatabaseTransactionId;
}

interface DeliverableOrderItemsProps
  extends Omit<CreateSaleMovementProps, "transactionId"> {
  orderId: string;
}

export class OrderFulfillmentService {
  private readonly databaseTransactionBase: DatabaseTransactionBase;

  private readonly orderRepository: OrderRepository;
  private readonly orderItemRepository: OrderItemRepository;
  private readonly productSecretRepository: ProductSecretRepository;
  private readonly inventoryRepository: InventoryRepository;
  private readonly productRepository: ProductRepository;

  constructor(payload: BasePayload) {
    this.orderRepository = new OrderRepository(payload);
    this.orderItemRepository = new OrderItemRepository(payload);
    this.inventoryRepository = new InventoryRepository(payload);
    this.productSecretRepository = new ProductSecretRepository(payload);
    this.databaseTransactionBase = new DatabaseTransactionBase(payload.db);
    this.productRepository = new ProductRepository(payload);
  }

  static readonly fulfillOrder: TaskHandler<TaskDeliverOrder> = async ({
    input,
    req,
  }) => {
    const service = new OrderFulfillmentService(req.payload);

    return {
      output: await service.fulfill(input),
    };
  };

  async fulfill(input: TaskDeliverOrder["input"]) {
    const order = await this.loadOrderById(input.orderId);

    if (order.status !== ORDER_STATUS.PENDING) {
      return {
        orderId: order.id,
        status: order.status,
      };
    }

    const orderedItems = await this.loadOrderItems(order.id);

    const { productsById, requestedQuantitiesByProductId } =
      await this.loadOrderProductDetails(orderedItems);

    const { deliverableOrderItems } = this.checkStockAvailability({
      orderedItems,
      productsById,
      requestedQuantitiesByProductId,
    });

    const result = await this.deliverOrderWithTransaction({
      deliverableOrderItems,
      orderId: order.id,
      productsById,
      reference: order.reference,
    });

    if (!result?.length) {
      return {
        orderId: order.id,
        status: ORDER_STATUS.PENDING,
      };
    }

    return {
      orderId: order.id,
      status: ORDER_STATUS.COMPLETED,
    };
  }

  private async loadOrderById(id: string) {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new JobCancelledError(OrderErrorMessage.ORDER_NOT_FOUND);
    }

    return order;
  }

  private async loadOrderItems(orderId: string) {
    const orderedItems = await this.orderItemRepository.findByOrderId(orderId);

    if (orderedItems.length === 0) {
      throw new JobCancelledError(OrderErrorMessage.ORDER_NOT_FOUND);
    }
    return orderedItems;
  }

  private async loadOrderProductDetails(orderedItems: OrderItem[]) {
    const requestedQuantitiesByProductId =
      this.groupRequestedQuantitiesByProductId(orderedItems);

    const productIds = [...requestedQuantitiesByProductId.keys()];

    const products = await this.productRepository.findByIds(productIds);

    const productsById = new Map(
      products.map((product) => [product.id, product])
    );

    return { productsById, requestedQuantitiesByProductId };
  }

  private groupRequestedQuantitiesByProductId(
    orderedItems: OrderItem[]
  ): RequestedQuantitiesByProductId {
    const requestedQuantitiesByProductId: RequestedQuantitiesByProductId =
      new Map();

    for (const orderedItem of orderedItems) {
      const productId = getRelationshipId(orderedItem.product);

      if (!productId) {
        throw new JobCancelledError("Ordered item product ID is missing");
      }

      const currentQuantity =
        requestedQuantitiesByProductId.get(productId) ?? 0;

      requestedQuantitiesByProductId.set(
        productId,
        currentQuantity + orderedItem.quantity
      );
    }

    return requestedQuantitiesByProductId;
  }

  private checkStockAvailability({
    productsById,
    requestedQuantitiesByProductId,
    orderedItems,
  }: StockAvailabilityProps): StockAvailabilityResult {
    const unavailableProductIds = new Set<string>();

    for (const [
      productId,
      requestedQuantity,
    ] of requestedQuantitiesByProductId) {
      const product = productsById.get(productId);

      if (!product || requestedQuantity > product.stock) {
        unavailableProductIds.add(productId);
      }
    }

    const deliverableOrderItems: OrderItem[] = [];
    const unavailableOrderItems: OrderItem[] = [];

    for (const orderItem of orderedItems) {
      const productId = getRelationshipId(orderItem.product);

      if (!productId || unavailableProductIds.has(productId)) {
        unavailableOrderItems.push(orderItem);
        continue;
      }

      deliverableOrderItems.push(orderItem);
    }

    return {
      deliverableOrderItems,
      unavailableOrderItems,
    };
  }

  private deliverOrderWithTransaction({
    deliverableOrderItems,
    productsById,
    reference,
    orderId,
  }: DeliverableOrderItemsProps): Promise<OrderItem[] | null> | [] {
    if (deliverableOrderItems.length === 0) {
      return [];
    }

    const deliverableQuantitiesByProductId =
      this.groupDeliverableQuantitiesByProductId(deliverableOrderItems);

    return this.databaseTransactionBase.withDatabaseTransaction(
      async (transactionId) => {
        const claimedSecrets: ProductSecret[] = [];

        for (const [productId, quantity] of deliverableQuantitiesByProductId) {
          const secrets =
            await this.productSecretRepository.updateAvailableSecret(
              { productId, quantity },
              transactionId
            );

          if (secrets.length !== quantity) {
            throw new JobCancelledError(
              `Insufficient available secrets for product ${productId}`
            );
          }

          claimedSecrets.push(...secrets);
        }

        const secretsByProductId =
          this.groupProductSecretsByProductId(claimedSecrets);

        const updatedOrderItems: OrderItem[] = [];

        for (const item of deliverableOrderItems) {
          const productId = getRelationshipId(item.product);

          if (!productId) {
            throw new JobCancelledError("Ordered item product ID is missing");
          }

          const productSecrets = secretsByProductId.get(productId) ?? [];

          if (productSecrets.length < item.quantity) {
            throw new JobCancelledError(
              `Insufficient claimed secrets for order item ${item.id}`
            );
          }

          const assignedSecrets = productSecrets.splice(0, item.quantity);

          const updatedOrderItem =
            await this.orderItemRepository.updatePendingAsCompleted(
              item.id,
              assignedSecrets.map(({ secret }) => secret),
              transactionId
            );

          if (!updatedOrderItem) {
            // Another worker already transitioned this item.
            // The transaction wrapper rolls back all claims.
            return null;
          }

          updatedOrderItems.push(updatedOrderItem);
        }

        await this.createSaleMovement({
          deliverableOrderItems,
          productsById,
          reference,
          transactionId,
        });

        await this.orderRepository.updatePendingAsCompleted(
          orderId,
          transactionId
        );

        return updatedOrderItems;
      }
    );
  }

  private groupDeliverableQuantitiesByProductId(
    deliverableOrderItems: OrderItem[]
  ): DeliverableQuantitiesByProductId {
    const deliverableQuantitiesByProductId: DeliverableQuantitiesByProductId =
      new Map();

    for (const deliverableOrderItem of deliverableOrderItems) {
      const productId = getRelationshipId(deliverableOrderItem.product);

      if (!productId) {
        throw new JobCancelledError("Ordered item product ID is missing");
      }

      const currentQuantity =
        deliverableQuantitiesByProductId.get(productId) ?? 0;

      deliverableQuantitiesByProductId.set(
        productId,
        currentQuantity + deliverableOrderItem.quantity
      );
    }

    return deliverableQuantitiesByProductId;
  }

  private groupProductSecretsByProductId(
    productSecrets: ProductSecret[]
  ): ProductSecretsByProductId {
    const productSecretsByProductId: ProductSecretsByProductId = new Map();

    for (const productSecret of productSecrets) {
      const productId = getRelationshipId(productSecret.product);

      if (!productId) {
        throw new JobCancelledError("Product secret product ID is missing");
      }

      const currentSecrets = productSecretsByProductId.get(productId) ?? [];

      currentSecrets.push(productSecret);
      productSecretsByProductId.set(productId, currentSecrets);
    }

    return productSecretsByProductId;
  }

  private async createSaleMovement({
    deliverableOrderItems,
    reference,
    productsById,
    transactionId,
  }: CreateSaleMovementProps) {
    const deliverableQuantitiesByProductId =
      this.groupDeliverableQuantitiesByProductId(deliverableOrderItems);

    for (const [productId, quantity] of deliverableQuantitiesByProductId) {
      const product = productsById.get(productId);

      if (!product) {
        throw new JobCancelledError(
          `Insufficient available secrets for product ${productId}`
        );
      }

      await this.inventoryRepository.createSaleMovement(
        {
          notes: `Product sale ${product.name}`,
          product: productId,
          quantity: -quantity,
          quantityAfter: product.stock - quantity,
          quantityBefore: product.stock,
          reference,
        },
        transactionId
      );
    }
  }
}
