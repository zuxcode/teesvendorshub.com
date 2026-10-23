import type { Payload } from "payload";
import type { DatabaseTransactionId } from "@/shared/types";
import { SECRET_STATUS } from "../constant/product.constants";

interface MarkAvailableSimSecretAsSoldData {
  quantity: number;
  simId: string;
}

export class SimSecretRepository {
  private readonly payload: Payload;

  constructor(payload: Payload) {
    this.payload = payload;
  }

  async findAvailableBySimIds(simIds: string[]) {
    if (simIds.length === 0) {
      return [];
    }

    const result = await this.payload.find({
      collection: "sim-secrets",
      depth: 0,
      pagination: false,
      where: {
        and: [
          {
            sim: {
              in: simIds,
            },
          },
          {
            status: {
              equals: SECRET_STATUS.AVAILABLE,
            },
          },
        ],
      },
    });

    return result.docs;
  }

  async markAvailableSecretAsSold(
    { simId, quantity }: MarkAvailableSimSecretAsSoldData,
    transactionId: DatabaseTransactionId
  ) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error("Secret quantity must be a positive integer.");
    }

    const { docs, errors } = await this.payload.update({
      collection: "sim-secrets",
      data: {
        soldAt: new Date().toISOString(),
        status: SECRET_STATUS.SOLD,
      },
      depth: 0,
      limit: quantity,
      req: {
        transactionID: transactionId,
      },
      where: {
        and: [
          {
            sim: {
              equals: simId,
            },
          },
          {
            status: {
              equals: SECRET_STATUS.AVAILABLE,
            },
          },
        ],
      },
    });

    if (errors) {
      throw errors;
    }
    return docs;
  }
}
