import { type BasePayload, JobCancelledError, type TaskHandler } from "payload";

import { PAYMENT_STATUS } from "@/modules/payments/payment.constants";
import { ProductRepository } from "@/modules/products/repository/product.repository";
import type { OrderItem, Product, TaskValidateOrder } from "@/payload-types";
import { getRelationshipId } from "@/shared/utils/get-relationship-id";
import { ORDER_STATUS } from "../order.constants";
import { OrderErrorMessage } from "../order.error";
import { OrderRepository } from "../repository/order.repository";
import { OrderItemRepository } from "../repository/order-item.repository";

type RequestedQuantitiesByProductId = Map<string, number>;

interface StockAvailabilityProps {
  orderedItems: OrderItem[];
  productsById: Map<string, Product>;
  requestedQuantitiesByProductId: RequestedQuantitiesByProductId;
}

export class OrderValidationService {
  private readonly orderRepository: OrderRepository;
  private readonly orderItemRepository: OrderItemRepository;
  private readonly productRepository: ProductRepository;

  constructor(payload: BasePayload) {
    this.orderRepository = new OrderRepository(payload);
    this.orderItemRepository = new OrderItemRepository(payload);
    this.productRepository = new ProductRepository(payload);
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
      throw new JobCancelledError(OrderErrorMessage.ORDER_HAS_NO_ITEMS);
    }

    return orderedItems;
  }

  private groupRequestedQuantitiesByProductId(
    orderedItems: OrderItem[]
  ): RequestedQuantitiesByProductId {
    const quantities: RequestedQuantitiesByProductId = new Map();

    for (const item of orderedItems) {
      const productId = getRelationshipId(item.product);

      if (!productId) {
        throw new JobCancelledError(
          OrderErrorMessage.ORDER_ITEM_PRODUCT_ID_MISSING
        );
      }

      quantities.set(
        productId,
        (quantities.get(productId) ?? 0) + item.quantity
      );
    }

    return quantities;
  }

  private async loadOrderProductDetails(orderedItems: OrderItem[]) {
    const requestedQuantitiesByProductId =
      this.groupRequestedQuantitiesByProductId(orderedItems);

    const products = await this.productRepository.findByIds([
      ...requestedQuantitiesByProductId.keys(),
    ]);

    const productsById = new Map(
      products.map((product) => [product.id, product])
    );

    return { productsById, requestedQuantitiesByProductId };
  }

  private findUnavailableOrderItems({
    orderedItems,
    productsById,
    requestedQuantitiesByProductId,
  }: StockAvailabilityProps): OrderItem[] {
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

    return orderedItems.filter((item) => {
      const productId = getRelationshipId(item.product);

      return !productId || unavailableProductIds.has(productId);
    });
  }

  private async validatePendingOrder(orderId: string) {
    const order = await this.loadOrderById(orderId);

    if (order.status !== ORDER_STATUS.PENDING) {
      return {
        orderId: order.id,
        status: order.status,
      };
    }

    const orderedItems = await this.loadOrderItems(orderId);

    const { productsById, requestedQuantitiesByProductId } =
      await this.loadOrderProductDetails(orderedItems);

    const unavailableOrderItems = this.findUnavailableOrderItems({
      orderedItems,
      productsById,
      requestedQuantitiesByProductId,
    });

    if (unavailableOrderItems.length > 0) {
      throw new JobCancelledError(OrderErrorMessage.ORDER_ITEMS_UNAVAILABLE);
    }

    return {
      orderId: order.id,
      status: order.status,
    };
  }

  private validate(input: TaskValidateOrder["input"]) {
    if (input.status !== PAYMENT_STATUS.SUCCESSFUL) {
      throw new JobCancelledError("Payment status is invalid");
    }

    const orderId = getRelationshipId(input.order);

    if (!orderId) {
      throw new JobCancelledError(OrderErrorMessage.ORDER_NOT_FOUND);
    }

    return this.validatePendingOrder(orderId);
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
