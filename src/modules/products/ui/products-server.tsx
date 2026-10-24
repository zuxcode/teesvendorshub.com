import { payload } from "@/shared/payload/utils/payload";
import { ProductRepository } from "../repository/product.repository";
import { HydrateProductsStore } from "./hydrate-products-store";

const productRepository = new ProductRepository(payload);

export async function ProductServer() {
  const products = await productRepository.findAllActive();

  return <HydrateProductsStore products={products} />;
}
