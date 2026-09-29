import type { Payload } from "payload";
import type { ResourceId } from "@/shared/types";

export class AuthenticationRepository {
  private readonly payload: Payload;

  private readonly dbTransactionId: ResourceId | undefined;

  constructor(payload: Payload, dbTransactionId?: ResourceId) {
    this.payload = payload;
    this.dbTransactionId = dbTransactionId;
  }
}
