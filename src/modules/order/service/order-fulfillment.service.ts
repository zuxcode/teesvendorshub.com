/** biome-ignore-all lint/performance/noAwaitInLoops: Intentional sequential transactional operations */

import { type BasePayload, JobCancelledError, type TaskHandler } from "payload";
import { DatabaseTransactionBase } from "@/modules/database/database-transaction-basemodel";
import { ProductSecretRepository } from "@/modules/products/repository/product-secret.repository";
import type {
  OrderItem,
  Product,
  ProductSecret,
  TaskDeliverOrder,
} from "@/payload-types";
import { RELATION_TO } from "@/shared/constant";
import type { DatabaseTransactionId } from "@/shared/types";
import { getRelationshipId } from "@/shared/utils/get-relationship-id";
import { ORDER_STATUS } from "../order.constants";
import {
  OrderValidationService,
  type StockAvailabilityProps,
  type StockAvailabilityResult,
} from "./order-validation.service";

interface FulfillmentStockAvailabilityResult extends StockAvailabilityResult {
  deliverableProductQuantities: Map<string, number>;
}

interface DeliverableOrderItemsProps {
  orderId: string;
  productOrderItems: OrderItem[];
  productsById: Map<string, Product>;
  stockAvailability: StockAvailabilityProps;
}

interface DeliverProductProps {
  deliverableProductQuantities: Map<string, number>;
  productOrderItems: OrderItem[];
  productsById: Map<string, Product>;
  transactionId: DatabaseTransactionId;
}

type ProductSecretsByProductId = Map<string, ProductSecret[]>;

export class OrderFulfillmentService extends OrderValidationService {
  private readonly databaseTransactionBase: DatabaseTransactionBase;
  private readonly productSecretRepository: ProductSecretRepository;

  constructor(payload: BasePayload) {
    super(payload);

    this.databaseTransactionBase = new DatabaseTransactionBase(payload.db);
    this.productSecretRepository = new ProductSecretRepository(payload);
  }

  private getStockAvailability(
    stockAvailability: StockAvailabilityProps
  ): FulfillmentStockAvailabilityResult {
    const { productsById, quantitiesByProductType } = stockAvailability;

    const unavailableProductIds = new Set<string>();
    const deliverableProductQuantities = new Map<string, number>();

    for (const [productType, quantitiesById] of quantitiesByProductType) {
      for (const [itemId, requestedQuantity] of quantitiesById) {
        if (productType === RELATION_TO.PRODUCT) {
          const product = productsById.get(itemId);

          if (!product || requestedQuantity > product.stock) {
            unavailableProductIds.add(itemId);
            continue;
          }

          deliverableProductQuantities.set(itemId, requestedQuantity);
        }
      }
    }

    return {
      deliverableProductQuantities,
      unavailableProductIds,
    };
  }

  private validateStockAvailability(
    result: FulfillmentStockAvailabilityResult
  ): void {
    if (result.unavailableProductIds.size > 0) {
      throw new JobCancelledError(
        "Some order items are no longer available for fulfillment"
      );
    }
  }

  private groupProductSecretsByProductId(
    productSecrets: ProductSecret[]
  ): ProductSecretsByProductId {
    const secretsByProductId: ProductSecretsByProductId = new Map();

    for (const productSecret of productSecrets) {
      const productId = getRelationshipId(productSecret.product);

      if (!productId) {
        throw new JobCancelledError("Product secret product ID is missing");
      }

      const secrets = secretsByProductId.get(productId) ?? [];
      secrets.push(productSecret);
      secretsByProductId.set(productId, secrets);
    }

    return secretsByProductId;
  }

  private async claimProductSecrets(
    deliverableProductQuantities: Map<string, number>,
    transactionId: DatabaseTransactionId
  ): Promise<ProductSecretsByProductId> {
    const claimedSecrets: ProductSecret[] = [];

    for (const [productId, quantity] of deliverableProductQuantities) {
      const secrets =
        await this.productSecretRepository.markAvailableSecretAsSold(
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

    return this.groupProductSecretsByProductId(claimedSecrets);
  }

  private async deliverProduct({
    productOrderItems,
    deliverableProductQuantities,
    productsById,
    transactionId,
  }: DeliverProductProps): Promise<OrderItem[]> {
    const secretsByProductId = await this.claimProductSecrets(
      deliverableProductQuantities,
      transactionId
    );

    const updatedOrderItems: OrderItem[] = [];

    for (const item of productOrderItems) {
      if (item.productType !== RELATION_TO.PRODUCT) {
        throw new JobCancelledError(
          `Unsupported product type for order item ${item.id}`
        );
      }

      const productId = getRelationshipId(item.product);

      if (!productId) {
        throw new JobCancelledError(
          `Product ID is missing for order item ${item.id}`
        );
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
        throw new JobCancelledError(
          `Order item ${item.id} has already been transitioned`
        );
      }

      updatedOrderItems.push(updatedOrderItem);
    }

    for (const [productId, quantity] of deliverableProductQuantities) {
      const product = productsById.get(productId);

      if (!product) {
        throw new JobCancelledError(
          `Product ${productId} was not found during fulfillment`
        );
      }

      const updatedProduct = await this.productRepository.updateQuantity(
        product.stock - quantity,
        productId,
        transactionId
      );

      if (!updatedProduct) {
        throw new JobCancelledError(
          `Failed to update stock for product ${productId}`
        );
      }
    }

    return updatedOrderItems;
  }

  private async deliverOrderWithTransaction({
    productOrderItems,
    stockAvailability,
    productsById,
    orderId,
  }: DeliverableOrderItemsProps): Promise<OrderItem[] | null> {
    if (productOrderItems.length === 0) {
      throw new JobCancelledError(
        `Order ${orderId} has no system-deliverable items`
      );
    }
    const deliverableOrderLength = productOrderItems.length;

    const stockResult = this.getStockAvailability(stockAvailability);

    this.validateStockAvailability(stockResult);

    const { deliverableProductQuantities } = stockResult;

    return await this.databaseTransactionBase.withDatabaseTransaction(
      async (transactionId) => {
        const updatedOrderItems: OrderItem[] = [];

        if (productOrderItems.length > 0) {
          updatedOrderItems.push(
            ...(await this.deliverProduct({
              deliverableProductQuantities,
              productOrderItems,
              productsById,
              transactionId,
            }))
          );
        }

        if (updatedOrderItems.length !== deliverableOrderLength) {
          throw new JobCancelledError(
            `Not all order items were fulfilled for order ${orderId}`
          );
        }

        const updatedOrder =
          await this.orderRepository.updatePendingAsCompleted(
            orderId,
            transactionId
          );

        if (!updatedOrder) {
          throw new JobCancelledError(
            `Order ${orderId} has already been transitioned`
          );
        }

        return updatedOrderItems;
      }
    );
  }

  async fulfill(input: TaskDeliverOrder["input"]) {
    const order = await this.loadOrderById(input.orderId);

    if (order.status !== ORDER_STATUS.PENDING) {
      return {
        orderId: order.id,
        status: order.status,
      };
    }

    const orderedItems = await this.loadOrderItems(order.id);
    const systemDeliverableItems =
      this.groupSystemDeliverableItems(orderedItems);

    const productOrderItems = systemDeliverableItems.get("product") ?? [];
    console.log(productOrderItems);

    if (productOrderItems.length === 0) {
      throw new JobCancelledError(
        `Order ${order.id} has no system-deliverable items`
      );
    }

    const quantitiesByProductType = this.aggregateSystemDeliverableQuantities(
      systemDeliverableItems
    );

    const { productsById } = await this.loadOrderItemDetails(
      systemDeliverableItems
    );

    const stockAvailability: StockAvailabilityProps = {
      productsById,
      quantitiesByProductType,
    };

    const result = await this.deliverOrderWithTransaction({
      orderId: order.id,
      productOrderItems,
      productsById,
      stockAvailability,
    });

    return {
      orderId: order.id,
      status:
        result?.length ===  productOrderItems.length
          ? ORDER_STATUS.COMPLETED
          : ORDER_STATUS.PENDING,
    };
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
}
