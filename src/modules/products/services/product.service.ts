import type { Product } from "@/payload-types";
import { payload } from "@/shared/payload/utils/payload";
import { ProductNotFoundError } from "../product.error";
import { ProductRepository } from "../repository/product.repository";

export const productRepository = new ProductRepository(payload);

export interface ProductService {
  findByIds: (ids: string[]) => Promise<Product[]>;
}

export const productService: ProductService = {
  findByIds: async (ids) => {
    if (ids.length === 0) {
      return [];
    }

    const products = await productRepository.findByIds(ids);

    const foundIds = new Set(products.map((product) => product.id));

    if (ids.some((id) => !foundIds.has(id))) {
      throw new ProductNotFoundError();
    }

    return products;
  },
};
