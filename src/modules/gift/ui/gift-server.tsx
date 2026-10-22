import { payload } from "@/shared/payload/utils/payload";
import { GiftRepository } from "../repository/gift.repository";
import { HydrateGiftStore } from "./hydrate-store";

const giftRepository = new GiftRepository(payload);

export async function GiftServer() {
  const gifts = await giftRepository.findAllActive();

  return <HydrateGiftStore gifts={gifts} />;
}
