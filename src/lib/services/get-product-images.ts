import { payload } from "./payload";

export async function getProductImages() {
  const result = await payload.find({
    collection: "product-library",
    depth: 0,
    limit: 10_000,
  });

  return result;
}
