import "server-only";

import type { Inventory } from "@/payload-types";
import type { ResourceId } from "@/shared/types";
import { getRelationshipId } from "@/shared/utils/get-relationship-id";
import { orderRepository } from "../order/order.repository";
import {
  InsufficientStockError,
  ProductNotFoundError,
  ProductOutOfStockError,
} from "../products/product.error";
import { productRepository } from "../products/product.repository";
import { INVENTORY_MOVEMENT } from "./inventory.constants";
import { InventoryNotFoundError } from "./inventory.error";
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

export interface ValidateOrderStockInput {
  orderId: ResourceId;
  transactionID?: ResourceId;
}

export interface InventoryService {
  createSaleMovement: (input: InventoryMovementInput) => Promise<Inventory[]>;
  validateOrderStock: (input: ValidateOrderStockInput) => Promise<void>;
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

  async validateOrderStock({ orderId, transactionID }) {
    const orderItems = await orderRepository.findItemsByOrderId(
      orderId,
      transactionID
    );

    if (orderItems.length === 0) {
      throw new InventoryNotFoundError();
    }

    const productIds = orderItems.map((item) => String(item.product));

    const products = await productRepository.findByIds(
      productIds,
      transactionID
    );

    const productsById = new Map(
      products.map((product) => [String(product.id), product])
    );

    for (const item of orderItems) {
      const product = productsById.get(String(item.product));

      if (!product) {
        throw new InventoryNotFoundError();
      }

      if (product.stock < item.quantity) {
        throw new InsufficientStockError();
      }
    }
  },
};
