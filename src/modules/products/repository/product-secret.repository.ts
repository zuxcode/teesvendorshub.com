import type { Payload } from "payload";
import type { DatabaseTransactionId } from "@/shared/types";
import { SECRET_STATUS } from "../constant/product.constants";

export interface UpdateAvailableSecretData {
  productId: string;
  quantity: number;
}

export class ProductSecretRepository {
  private readonly payload: Payload;

  constructor(payload: Payload) {
    this.payload = payload;
  }
  async findAvailableByProductIds(productIds: string[]) {
    if (productIds.length === 0) {
      return [];
    }

    const result = await this.payload.find({
      collection: "product-secrets",
      depth: 0,
      limit: 1000,
      pagination: false,
      where: {
        and: [
          {
            product: {
              in: productIds,
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
    { productId, quantity }: UpdateAvailableSecretData,
    transactionId: DatabaseTransactionId
  ) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error("Secret quantity must be a positive integer.");
    }

    const result = await this.payload.update({
      collection: "product-secrets",
      data: {
        soldAt: new Date().toISOString(),
        status: SECRET_STATUS.SOLD,
      },
      depth: 0,
      limit: quantity,
      req: { transactionID: transactionId },
      where: {
        and: [
          {
            product: {
              equals: productId,
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
}
