import type { BasePayload } from "payload";
import { PRODUCT_STATUS } from "@/shared/constant";
import type { DatabaseTransactionId } from "@/shared/types";

export class ProductRepository {
  private readonly payload: BasePayload;

  constructor(payload: BasePayload) {
    this.payload = payload;
  }

  async updateQuantity(
    newQuantity: number,
    id: string,
    transactionId?: DatabaseTransactionId
  ) {
    const { docs } = await this.payload.update({
      collection: "products",
      data: {
        stock: newQuantity,
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
          equals: PRODUCT_STATUS.ACTIVE,
        },
      },
    });

    return docs;
  }

  async findAllActive() {
    const { docs } = await this.payload.find({
      collection: "products",
      depth: 0,
      where: {
        status: {
          equals: PRODUCT_STATUS.ACTIVE,
        },
      },
    });

    return docs;
  }

  findById(id: string, transactionID?: DatabaseTransactionId) {
    return this.payload.findByID({
      collection: "products",
      depth: 0,
      id,
      req: {
        transactionID,
      },
    });
  }

  async findByIds(ids: string[], transactionID?: DatabaseTransactionId) {
    if (ids.length === 0) {
      return [];
    }

    const result = await this.payload.find({
      collection: "products",
      depth: 0,
      limit: ids.length,
      req: {
        transactionID,
      },
      where: {
        id: {
          in: ids,
        },
        status: {
          equals: PRODUCT_STATUS.ACTIVE,
        },
      },
    });

    return result.docs;
  }
}
