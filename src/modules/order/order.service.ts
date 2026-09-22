import "server-only";

import type { ResourceId } from "@/shared/types";

import { ORDER_PAYMENT_STATUS, ORDER_STATUS } from "./order.constants";
import { OrderStatusInvalidError } from "./order.error";
import { orderRepository } from "./order.repository";

export interface OrderService {
  confirmOrder: (
    orderId: ResourceId,
    transactionID?: ResourceId
  ) => Promise<void>;
}

export const orderService: OrderService = {
  async confirmOrder(orderId, transactionID) {
    const order = await orderRepository.findById(orderId, transactionID);

    if (order.orderStatus === ORDER_STATUS.COMPLETED) {
      return;
    }

    if (
      order.orderStatus !== ORDER_STATUS.PENDING ||
      order.paymentStatus !== ORDER_PAYMENT_STATUS.PENDING
    ) {
      throw new OrderStatusInvalidError();
    }

    await orderRepository.update(
      orderId,
      {
        orderStatus: ORDER_STATUS.PROCESSING,
        paymentStatus: ORDER_PAYMENT_STATUS.PAID,
      },
      transactionID
    );
  },
};
