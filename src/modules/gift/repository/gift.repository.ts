import type { BasePayload } from "payload";

export class GiftRepository {
  private readonly payload: BasePayload;

  constructor(payload: BasePayload) {
    this.payload = payload;
  }

  async find() {
    const { docs } = await this.payload.find({ collection: "gifts", depth: 0 });

    return docs;
  }
}
