import "server-only";

import type { Payment } from "@/payload-types";
import { payload } from "@/shared/payload/utils/payload";
import type { ResourceId, WithoutPersistenceFields } from "@/shared/types";

export interface PaymentRepository {
  create: (
    input: WithoutPersistenceFields<Payment>,
    transactionID?: ResourceId
  ) => Promise<Payment>;

  findById: (id: ResourceId, transactionID?: ResourceId) => Promise<Payment | null>;

  findByOrderId: (
    orderId: ResourceId,
    transactionID?: ResourceId
  ) => Promise<Payment | null>;

  findByReference: (
    reference: ResourceId,
    transactionID?: ResourceId
  ) => Promise<Payment | null>;

  update: (
    id: ResourceId,
    input: Partial<Payment>,
    transactionID?: ResourceId
  ) => Promise<Payment>;
}

export const paymentRepository: PaymentRepository = {
  create: async (input, transactionID) =>
    payload.create({
      collection: "payments",
      data: input,
      depth: 0,
      req: { transactionID },
    }),

  findById: async (id, transactionID) =>
    payload.findByID({
      collection: "payments",
      depth: 0,
      id,
      req: { transactionID },
    }),

  findByOrderId: async (orderId, transactionID) => {
    const result = await payload.find({
      collection: "payments",
      depth: 0,
      limit: 1,
      req: { transactionID },
      where: {
        order: {
          equals: orderId,
        },
      },
    });

    return result.docs[0] ?? null;
  },

  findByReference: async (reference, transactionID) => {
    const result = await payload.find({
      collection: "payments",
      depth: 0,
      limit: 1,
      req: { transactionID },
      where: {
        paymentReference: {
          equals: reference,
        },
      },
    });

    return result.docs[0] ?? null;
  },

  update: async (id, input, transactionID) =>
    payload.update({
      collection: "payments",
      data: input,
      depth: 0,
      id,
      req: { transactionID },
    }),
};
