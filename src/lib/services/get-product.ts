import { payload } from "./payload";

export async function getProduct() {
  const result = await payload.find({
    collection: "products",
    depth: 0,
    limit: 10_000,
  });

  return result;
}
