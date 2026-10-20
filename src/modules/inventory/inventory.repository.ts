import type { Payload } from "payload";
import type { Inventory } from "@/payload-types";
import type {
  DatabaseTransactionId,
  WithoutPersistenceFields,
} from "@/shared/types";
import { INVENTORY_MOVEMENT } from "./inventory.constants";

export class InventoryRepository {
  private readonly payload: Payload;

  constructor(payload: Payload) {
    this.payload = payload;
  }

  create(
    input: WithoutPersistenceFields<Inventory>,
    transactionId?: DatabaseTransactionId
  ) {
    return this.payload.create({
      collection: "inventory",
      data: input,
      depth: 0,
      overrideAccess: true,
      req: {
        transactionID: transactionId,
      },
    });
  }

  createSaleMovement(
    input: Omit<WithoutPersistenceFields<Inventory>, "type">,
    transactionId?: DatabaseTransactionId
  ) {
    return this.create(
      {
        ...input,
        type: INVENTORY_MOVEMENT.SALE,
      },
      transactionId
    );
  }
}
