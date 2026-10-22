import type { Payload } from "payload";
import type { DatabaseTransactionId } from "@/shared/types";
import { PRODUCT_SECRET_STATUS } from "./constant/product.constants";

interface UpdateAvailableSecretData {
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
              equals: PRODUCT_SECRET_STATUS.AVAILABLE,
            },
          },
        ],
      },
    });

    return result.docs;
  }

  async updateAvailableSecret(
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
        status: PRODUCT_SECRET_STATUS.SOLD,
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
              equals: PRODUCT_SECRET_STATUS.AVAILABLE,
            },
          },
        ],
      },
    });

    return result.docs;
  }

  async claimAvailableSecret(productId: string) {
    const result = await this.payload.db.drizzle.execute(`
      WITH candidate AS (
        SELECT id
        FROM product_secrets
        WHERE product_id = ${productId}
          AND status = ${PRODUCT_SECRET_STATUS.AVAILABLE}
        ORDER BY id
        FOR UPDATE SKIP LOCKED
        LIMIT 1
      )
      UPDATE product_secrets AS secret
      SET
        status = ${PRODUCT_SECRET_STATUS.SOLD},
        sold_at = NOW(),
        updated_at = NOW()
      FROM candidate
      WHERE secret.id = candidate.id
        AND secret.status = ${PRODUCT_SECRET_STATUS.AVAILABLE}
      RETURNING
        secret.id,
        secret.product_id AS "productId",
        secret.secret,
        secret.status,
        secret.sold_at AS "soldAt"
    `);

    return result.rows[0] ?? null;
  }
}
