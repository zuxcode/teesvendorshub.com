import { payload } from "./payload";

export async function getSimCardsProduct() {
  const result = await payload.find({
    collection: "sim-cards",
    depth: 0,
    limit: 10_000,
  });

  return result;
}
