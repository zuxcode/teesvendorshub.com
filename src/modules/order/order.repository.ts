import "server-only";

import type { Order, OrderItem } from "@/payload-types";

import { payload } from "@/shared/payload/utils/payload";

import type { ResourceId, WithoutPersistenceFields } from "@/shared/types";

export interface OrderRepository {
  create: (
    input: WithoutPersistenceFields<Order>,
    transactionID?: ResourceId
  ) => Promise<Order>;

  createOrderItem: (
    input: WithoutPersistenceFields<OrderItem>,
    transactionID?: ResourceId
  ) => Promise<OrderItem>;
}

/**
 * Internal persistence repository.
 *
 * Not publicly callable.
 * Used by internal application flows such as checkout.
 */
export const orderRepository: OrderRepository = {
  create: async (input, transactionID) =>
    payload.create({
      collection: "orders",
      data: input,
      depth: 0,
      overrideAccess: true,
      req: {
        transactionID,
      },
    }),

  createOrderItem: async (input, transactionID) =>
    payload.create({
      collection: "order-items",
      data: input,
      depth: 0,
      overrideAccess: true,
      req: {
        transactionID,
      },
    }),
};
