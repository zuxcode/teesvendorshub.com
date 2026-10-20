import type { Payload } from "payload";
import type { Payment } from "@/payload-types";
import type {
  DatabaseTransactionId,
  WithoutPersistenceFields,
} from "@/shared/types";
import { PAYMENT_STATUS, type PaymentStatus } from "./payment.constants";

export class PaymentRepository {
  private readonly payload: Payload;
  constructor(payload: Payload) {
    this.payload = payload;
  }

  create(
    input: WithoutPersistenceFields<Payment>,
    transactionID?: DatabaseTransactionId
  ) {
    return this.payload.create({
      collection: "payments",
      data: input,
      depth: 0,
      req: { transactionID },
    });
  }

  findById(id: string, transactionID?: DatabaseTransactionId) {
    return this.payload.findByID({
      collection: "payments",
      depth: 0,
      id,
      req: { transactionID },
    });
  }

  async findByOrderId(orderId: string, transactionID?: DatabaseTransactionId) {
    const result = await this.payload.find({
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

    return result.docs?.[0] || null;
  }

  async findByOrderReference(
    reference: string,
    transactionID?: DatabaseTransactionId
  ) {
    const result = await this.payload.find({
      collection: "payments",
      depth: 0,
      limit: 1,
      req: { transactionID },
      where: {
        orderReference: {
          equals: reference,
        },
      },
    });

    return result.docs?.[0] || null;
  }

  private async updateStatus(
    id: string,
    expectedStatus: PaymentStatus,
    nextStatus: PaymentStatus,
    transactionID?: DatabaseTransactionId
  ) {
    const result = await this.payload.update({
      collection: "payments",
      data: {
        ...(nextStatus === PAYMENT_STATUS.SUCCESSFUL
          ? { paidAt: new Date().toISOString() }
          : {}),
        status: nextStatus,
      },
      depth: 0,
      req: { transactionID },
      where: {
        id: {
          equals: id,
        },
        status: {
          equals: expectedStatus,
        },
      },
    });
    return result.docs?.[0] || null;
  }

  markAsFailed(id: string, transactionID?: DatabaseTransactionId) {
    return this.updateStatus(
      id,
      PAYMENT_STATUS.PENDING,
      PAYMENT_STATUS.FAILED,
      transactionID
    );
  }

  markAsSuccessful(id: string, transactionID?: DatabaseTransactionId) {
    return this.updateStatus(
      id,
      PAYMENT_STATUS.PENDING,
      PAYMENT_STATUS.SUCCESSFUL,
      transactionID
    );
  }

  markAsRefunded(id: string, transactionID?: DatabaseTransactionId) {
    return this.updateStatus(
      id,
      PAYMENT_STATUS.SUCCESSFUL,
      PAYMENT_STATUS.REFUNDED,
      transactionID
    );
  }

  update(
    id: string,
    input: Partial<Payment>,
    transactionID?: DatabaseTransactionId
  ) {
    return this.payload.update({
      collection: "payments",
      data: input,
      depth: 0,
      id,
      req: { transactionID },
    });
  }
}
