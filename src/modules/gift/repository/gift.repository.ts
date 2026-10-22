import type { BasePayload } from "payload";
import { PRODUCT_STATUS } from "@/shared/constant";

export class GiftRepository {
  private readonly payload: BasePayload;

  constructor(payload: BasePayload) {
    this.payload = payload;
  }

  async findAllActive() {
    const { docs } = await this.payload.find({
      collection: "gifts",
      depth: 0,
      where: {
        status: {
          equals: PRODUCT_STATUS.ACTIVE,
        },
      },
    });

    return docs;
  }

  async findByIds(ids: string[]) {
    if (ids.length === 0) {
      return [];
    }

    const result = await this.payload.find({
      collection: "gifts",
      depth: 0,
      limit: ids.length,
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
