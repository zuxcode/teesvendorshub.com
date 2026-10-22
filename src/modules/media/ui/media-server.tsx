import { payload } from "@/shared/payload/utils/payload";
import { MediaRepository } from "../repository/media.repository";
import { HydrateMediaStore } from "./hydrate-media";

const mediaRepository = new MediaRepository(payload);

export async function MediaServer() {
  const productMedia = await mediaRepository.findAll();

  return <HydrateMediaStore media={productMedia} />;
}
