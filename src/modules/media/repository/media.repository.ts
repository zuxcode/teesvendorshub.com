import type { BasePayload } from "payload";

export class MediaRepository {
  private readonly payload: BasePayload;

  constructor(payload: BasePayload) {
    this.payload = payload;
  }

  async findAll() {
    const { docs } = await this.payload.find({
      collection: "product-library",
      depth: 0,
    });

    return docs;
  }
}
