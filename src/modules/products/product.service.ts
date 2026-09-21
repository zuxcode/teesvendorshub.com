import type { Product } from "@/payload-types";

import { ProductNotFoundError } from "./product.error";
import { productRepository } from "./product.repository";

export interface ProductService {
  findByIds: (ids: string[]) => Promise<Product[]>;
}

export const productService: ProductService = {
  findByIds: async (ids) => {
    if (ids.length === 0) {
      return [];
    }

    const products = await productRepository.findByIds(ids);

    const foundIds = new Set(products.map((product) => String(product.id)));

    if (ids.some((id) => !foundIds.has(id))) {
      throw new ProductNotFoundError();
    }

    return products;
  },
};
