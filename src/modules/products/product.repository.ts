import "server-only";

import type { Product } from "@/payload-types";

import { payload } from "@/shared/payload/utils/payload";
import type { ResourceId } from "@/shared/types";

export interface ProductRepository {
  findById: (id: ResourceId, transactionID?: ResourceId) => Promise<Product>;
  findByIds: (
    ids: ResourceId[],
    transactionID?: ResourceId
  ) => Promise<Product[]>;
}

export const productRepository: ProductRepository = {
  findById: (id, transactionID) =>
    payload.findByID({
      collection: "products",
      depth: 0,
      id,
      req: {
        transactionID,
      },
    }),

  findByIds: async (ids, transactionID) => {
    if (ids.length === 0) {
      return [];
    }

    const result = await payload.find({
      collection: "products",
      depth: 0,
      limit: ids.length,
      req: {
        transactionID,
      },
      where: {
        id: {
          in: ids,
        },
      },
    });

    return result.docs;
  },
};
