import "server-only";

import type { Inventory } from "@/payload-types";

import { payload } from "@/shared/payload/utils/payload";
import type { ResourceId, WithoutPersistenceFields } from "@/shared/types";

export interface InventoryRepository {
  createMovement: (
    input: WithoutPersistenceFields<Inventory>,
    transactionID?: ResourceId
  ) => Promise<Inventory>;
}

export const inventoryRepository: InventoryRepository = {
  createMovement: async (input, transactionID) =>
    payload.create({
      collection: "inventory",
      data: input,
      depth: 0,
      overrideAccess: true,
      req: {
        transactionID,
      },
    }),
};
