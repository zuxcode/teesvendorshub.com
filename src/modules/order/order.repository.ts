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

  findById: (id: ResourceId, transactionID?: ResourceId) => Promise<Order>;

  findItemsByOrderId: (
    orderId: ResourceId,
    transactionID?: ResourceId
  ) => Promise<OrderItem[]>;

  update: (
    id: ResourceId,
    input: Partial<Order>,
    transactionID?: ResourceId
  ) => Promise<Order>;
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

  findById: (id, transactionID) =>
    payload.findByID({
      collection: "orders",
      depth: 0,
      id,
      overrideAccess: true,
      req: {
        transactionID,
      },
    }),

  findItemsByOrderId: async (orderId, transactionID) => {
    const result = await payload.find({
      collection: "order-items",
      depth: 0,
      limit: 10_000,
      overrideAccess: true,
      req: {
        transactionID,
      },
      where: {
        order: {
          equals: orderId,
        },
      },
    });

    return result.docs;
  },

  update: async (id, input, transactionID) =>
    payload.update({
      collection: "orders",
      data: input,
      depth: 0,
      id,
      overrideAccess: true,
      req: {
        transactionID,
      },
    }),
};
