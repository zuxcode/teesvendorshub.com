import "server-only";

import type { Inventory } from "@/payload-types";
import type { ResourceId } from "@/shared/types";
import { getRelationshipId } from "@/shared/utils/get-relationship-id";
import {
  InsufficientStockError,
  ProductNotFoundError,
  ProductOutOfStockError,
} from "../products/product.error";
import { productRepository } from "../products/product.repository";
import { INVENTORY_MOVEMENT } from "./inventory.constants";
import { inventoryRepository } from "./inventory.repository";

export interface InventoryItem {
  product: ResourceId;
  quantity: number;
}

export interface InventoryMovementInput {
  items: InventoryItem[];
  reference: string;
  transactionID?: ResourceId;
}

export interface InventoryService {
  createSaleMovement: (input: InventoryMovementInput) => Promise<Inventory[]>;
}

export const inventoryService: InventoryService = {
  createSaleMovement: async ({ items, reference, transactionID }) => {
    const movements = await Promise.all(
      items.map(async (item) => {
        const productId = getRelationshipId(item.product);

        if (!productId) {
          throw new ProductNotFoundError();
        }
        const product = await productRepository.findById(
          productId,
          transactionID
        );

        if (!product) {
          throw new ProductNotFoundError();
        }

        if (product.stock === 0) {
          throw new ProductOutOfStockError();
        }

        if (product.stock < item.quantity) {
          throw new InsufficientStockError();
        }

        return inventoryRepository.createMovement(
          {
            notes: `Product sale ${product.name}`,
            product: product.id,
            quantity: -item.quantity,
            quantityAfter: product.stock - item.quantity,
            quantityBefore: product.stock,
            reference,
            type: INVENTORY_MOVEMENT.SALE,
          },
          transactionID
        );
      })
    );

    return movements;
  },
};
