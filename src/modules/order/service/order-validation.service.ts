import { type BasePayload, JobCancelledError, type TaskHandler } from "payload";
import { PAYMENT_STATUS } from "@/modules/payments/payment.constants";
import { ProductRepository } from "@/modules/products/repository/product.repository";
import { SIM_TYPE } from "@/modules/sim/constant";
import { SimRepository } from "@/modules/sim/repository/sim.repository";
import type {
  OrderItem,
  Product,
  Sim,
  TaskValidateOrder,
} from "@/payload-types";
import { RELATION_TO, type RelationTo } from "@/shared/constant";
import { getRelationshipId } from "@/shared/utils/get-relationship-id";
import { ORDER_STATUS, type OrderStatus } from "../order.constants";
import { OrderErrorMessage } from "../order.error";
import { OrderRepository } from "../repository/order.repository";
import { OrderItemRepository } from "../repository/order-item.repository";

type ProductType = Exclude<RelationTo, typeof RELATION_TO.GIFT>;
export type QuantitiesById = Map<string, number>;
export type QuantitiesByProductType = Map<ProductType, QuantitiesById>;
export type SystemDeliverableItems = Map<ProductType, OrderItem[]>;

interface LoadedProducts {
  productsById: Map<string, Product>;
}

interface LoadedSims {
  simsById: Map<string, Sim>;
}

interface LoadedOrderItemDetails extends LoadedProducts, LoadedSims {}

export interface StockAvailabilityProps extends LoadedOrderItemDetails {
  quantitiesByProductType: QuantitiesByProductType;
}

export interface StockAvailabilityResult {
  unavailableProductIds: Set<string>;
  unavailableSimIds: Set<string>;
}

interface OrderValidationResult {
  orderId: string;
  status: OrderStatus;
}

export class OrderValidationService {
  protected readonly orderRepository: OrderRepository;
  protected readonly orderItemRepository: OrderItemRepository;
  protected readonly productRepository: ProductRepository;
  protected readonly simRepository: SimRepository;

  constructor(payload: BasePayload) {
    this.orderRepository = new OrderRepository(payload);
    this.orderItemRepository = new OrderItemRepository(payload);
    this.productRepository = new ProductRepository(payload);
    this.simRepository = new SimRepository(payload);
  }

  protected groupSystemDeliverableItems(
    orderedItems: OrderItem[]
  ): SystemDeliverableItems {
    const itemsByType: SystemDeliverableItems = new Map();

    for (const item of orderedItems) {
      if (
        item.productType !== RELATION_TO.PRODUCT &&
        item.productType !== RELATION_TO.SIM
      ) {
        continue;
      }

      if (
        item.productType === RELATION_TO.SIM &&
        item.simType !== SIM_TYPE.ESIM
      ) {
        continue;
      }

      const items = itemsByType.get(item.productType) ?? [];
      items.push(item);
      itemsByType.set(item.productType, items);
    }

    return itemsByType;
  }

  protected aggregateSystemDeliverableQuantities(
    systemDeliverableItems: SystemDeliverableItems
  ): QuantitiesByProductType {
    const quantitiesByProductType: QuantitiesByProductType = new Map();

    for (const [productType, orderItems] of systemDeliverableItems) {
      const quantitiesById: QuantitiesById = new Map();

      for (const item of orderItems) {
        const itemId = getRelationshipId(
          productType === RELATION_TO.PRODUCT ? item.product : item.sim
        );

        if (!itemId) {
          throw new JobCancelledError(
            `Missing ${productType} relationship for order item ${item.id}.`
          );
        }

        quantitiesById.set(
          itemId,
          (quantitiesById.get(itemId) ?? 0) + item.quantity
        );
      }

      quantitiesByProductType.set(productType, quantitiesById);
    }

    return quantitiesByProductType;
  }

  protected async loadOrderById(id: string) {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new JobCancelledError(OrderErrorMessage.ORDER_NOT_FOUND);
    }

    return order;
  }

  protected async loadOrderItems(orderId: string): Promise<OrderItem[]> {
    const orderedItems = await this.orderItemRepository.findByOrderId(orderId);

    if (orderedItems.length === 0) {
      throw new JobCancelledError(OrderErrorMessage.ORDER_HAS_NO_ITEMS);
    }

    return orderedItems;
  }

  private async loadSims(ids: string[]): Promise<LoadedSims> {
    if (ids.length === 0) {
      return { simsById: new Map() };
    }

    const sims = await this.simRepository.findByIds(ids);

    return {
      simsById: new Map(sims.map((sim) => [sim.id, sim])),
    };
  }

  private async loadProducts(ids: string[]): Promise<LoadedProducts> {
    if (ids.length === 0) {
      return { productsById: new Map() };
    }

    const products = await this.productRepository.findByIds(ids);

    return {
      productsById: new Map(products.map((product) => [product.id, product])),
    };
  }

  protected async loadOrderItemDetails(
    systemDeliverableItems: SystemDeliverableItems
  ): Promise<LoadedOrderItemDetails> {
    const productItems = systemDeliverableItems.get(RELATION_TO.PRODUCT) ?? [];
    const simItems = systemDeliverableItems.get(RELATION_TO.SIM) ?? [];

    const productIds = [
      ...new Set(
        productItems.map((item) => {
          const id = getRelationshipId(item.product);

          if (!id) {
            throw new JobCancelledError(
              `Missing product relationship for order item ${item.id}.`
            );
          }

          return id;
        })
      ),
    ];

    const simIds = [
      ...new Set(
        simItems.map((item) => {
          const id = getRelationshipId(item.sim);

          if (!id) {
            throw new JobCancelledError(
              `Missing SIM relationship for order item ${item.id}.`
            );
          }

          return id;
        })
      ),
    ];

    const [products, sims] = await Promise.all([
      this.loadProducts(productIds),
      this.loadSims(simIds),
    ]);

    return {
      productsById: products.productsById,
      simsById: sims.simsById,
    };
  }

  private findUnavailableItemIds({
    productsById,
    simsById,
    quantitiesByProductType,
  }: StockAvailabilityProps): StockAvailabilityResult {
    const unavailableProductIds = new Set<string>();
    const unavailableSimIds = new Set<string>();

    for (const [productType, quantitiesById] of quantitiesByProductType) {
      for (const [itemId, requestedQuantity] of quantitiesById) {
        if (productType === RELATION_TO.PRODUCT) {
          const product = productsById.get(itemId);

          if (!product || requestedQuantity > product.stock) {
            unavailableProductIds.add(itemId);
          }

          continue;
        }

        if (productType === RELATION_TO.SIM) {
          const sim = simsById.get(itemId);

          if (!sim || requestedQuantity > sim.stock) {
            unavailableSimIds.add(itemId);
          }
        }
      }
    }

    return {
      unavailableProductIds,
      unavailableSimIds,
    };
  }

  private async validatePendingOrder(
    orderId: string
  ): Promise<OrderValidationResult> {
    const order = await this.loadOrderById(orderId);

    if (order.status !== ORDER_STATUS.PENDING) {
      return {
        orderId: order.id,
        status: order.status,
      };
    }

    const orderedItems = await this.loadOrderItems(orderId);
    const systemDeliverableItems =
      this.groupSystemDeliverableItems(orderedItems);

    const quantitiesByProductType = this.aggregateSystemDeliverableQuantities(
      systemDeliverableItems
    );

    const { productsById, simsById } = await this.loadOrderItemDetails(
      systemDeliverableItems
    );

    const { unavailableProductIds, unavailableSimIds } =
      this.findUnavailableItemIds({
        productsById,
        quantitiesByProductType,
        simsById,
      });

    if (unavailableProductIds.size > 0 || unavailableSimIds.size > 0) {
      throw new JobCancelledError(OrderErrorMessage.ORDER_ITEMS_UNAVAILABLE);
    }

    return {
      orderId: order.id,
      status: order.status,
    };
  }

  private async validate(
    input: TaskValidateOrder["input"]
  ): Promise<OrderValidationResult> {
    if (input.status !== PAYMENT_STATUS.SUCCESSFUL) {
      throw new JobCancelledError("Payment status is invalid");
    }

    const orderId = getRelationshipId(input.order);

    if (!orderId) {
      throw new JobCancelledError(OrderErrorMessage.ORDER_NOT_FOUND);
    }

    return await this.validatePendingOrder(orderId);
  }

  static readonly validateOrder: TaskHandler<TaskValidateOrder> = async ({
    input,
    req,
  }) => {
    const service = new OrderValidationService(req.payload);

    return {
      output: await service.validate(input),
    };
  };
}
