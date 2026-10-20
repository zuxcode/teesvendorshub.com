import type { Payload } from "payload";
import type { Order } from "@/payload-types";
import type {
  DatabaseTransactionId,
  WithoutPersistenceFields,
} from "@/shared/types";
import { ORDER_STATUS } from "../order.constants";

export class OrderRepository {
  private readonly payload: Payload;

  constructor(payload: Payload) {
    this.payload = payload;
  }

  create(
    input: WithoutPersistenceFields<Order>,
    transactionID?: DatabaseTransactionId
  ) {
    return this.payload.create({
      collection: "orders",
      data: input,
      depth: 0,
      // overrideAccess: true,
      req: {
        transactionID,
      },
    });
  }

  findById(id: string, transactionID?: DatabaseTransactionId) {
    return this.payload.findByID({
      collection: "orders",
      depth: 0,
      id,
      // overrideAccess: true,
      req: {
        transactionID,
      },
    });
  }

  update(
    id: string,
    input: Partial<Order>,
    transactionID?: DatabaseTransactionId
  ) {
    return this.payload.update({
      collection: "orders",
      data: input,
      depth: 0,
      id,
      // overrideAccess: true,
      req: {
        transactionID,
      },
    });
  }
  updatePendingAsCompleted(id: string, transactionId?: DatabaseTransactionId) {
    return this.payload.update({
      collection: "orders",
      data: {
        status: ORDER_STATUS.COMPLETED,
      },
      depth: 0,
      overrideAccess: true,
      req: {
        transactionID: transactionId,
      },
      where: {
        id: {
          equals: id,
        },
        status: {
          equals: ORDER_STATUS.PENDING,
        },
      },
    });
  }
}
