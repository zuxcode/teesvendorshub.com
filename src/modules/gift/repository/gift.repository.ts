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
}
