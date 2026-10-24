import type { BasePayload } from "payload";
import { CATEGORY_STATUS } from "../constants/constant";

export class CategoryRepository {
  private readonly payload: BasePayload;

  constructor(payload: BasePayload) {
    this.payload = payload;
  }

  async findAllActive() {
    const { docs } = await this.payload.find({
      collection: "categories",
      depth: 0,
      where: {
        status: {
          equals: CATEGORY_STATUS.ACTIVE,
        },
      },
    });

    return docs;
  }
}
