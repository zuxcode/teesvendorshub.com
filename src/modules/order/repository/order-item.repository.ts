import type { Payload } from "payload";
import type { OrderItem } from "@/payload-types";
import type {
  DatabaseTransactionId,
  WithoutPersistenceFields,
} from "@/shared/types";
import { ORDER_FULFILLMENT_STATUS } from "../order.constants";

export class OrderItemRepository {
  private readonly payload: Payload;

  constructor(payload: Payload) {
    this.payload = payload;
  }

  create(
    input: WithoutPersistenceFields<OrderItem>,
    transactionID?: DatabaseTransactionId
  ) {
    return this.payload.create({
      collection: "order-items",
      data: input,
      depth: 0,
      overrideAccess: true,
      req: {
        transactionID,
      },
    });
  }

  private async updatePending(
    id: string,
    data: Partial<OrderItem>,
    transactionId?: DatabaseTransactionId
  ) {
    const { docs } = await this.payload.update({
      collection: "order-items",
      data,
      depth: 0,
      limit: 1,
      overrideAccess: true,
      req: {
        transactionID: transactionId,
      },
      where: {
        fulfillmentStatus: {
          equals: ORDER_FULFILLMENT_STATUS.PENDING,
        },
        id: {
          equals: id,
        },
      },
    });

    return docs.at(0);
  }

  async updatePendingAsCompleted(
    id: string,
    secrets: string[],
    transactionId?: DatabaseTransactionId
  ) {
    return await this.updatePending(
      id,
      {
        fulfillmentStatus: ORDER_FULFILLMENT_STATUS.COMPLETED,
        secrets: secrets.map((s) => ({ secret: s })),
      },
      transactionId
    );
  }

  async findByOrderId(orderId: string, transactionID?: DatabaseTransactionId) {
    const result = await this.payload.find({
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
  }
}
