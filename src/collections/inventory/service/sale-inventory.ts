import "server-only";

import { INVENTORY_MOVEMENT } from "@/lib/config/collection-config";
import { ErrorMessageMap } from "@/lib/errors/codes";
import { payload } from "@/lib/services/payload";
import type { DocumentId } from "@/lib/types";

interface ReserveInventoryItem {
  product: DocumentId;
  quantity: number;
}

interface ReserveInventoryArgs {
  createdBy: number;
  items: ReserveInventoryItem[];
  reference: string;
  transactionID: DocumentId;
}

export async function saleInventory({
  items,
  reference,
  transactionID,
  createdBy,
}: ReserveInventoryArgs) {
  await Promise.all(
    items.map(async (item) => {
      const productId = Number(item.product);

      if (Number.isNaN(productId)) {
        throw new Error(
          `productId from reserveInventory is not a number: productId= ${item.product}`
        );
      }

      const product = await payload.findByID({
        collection: "products",
        depth: 0,
        id: item.product,
        req: {
          transactionID,
        },
      });

      if (product.stock < item.quantity) {
        throw new Error(ErrorMessageMap.INSUFFICIENT_STOCK);
      }

      const quantityBefore = product.stock;
      const quantityAfter = quantityBefore - item.quantity;

      await payload.create({
        collection: "inventory",
        data: {
          createdBy,
          notes: `Product sale ${product.name}`,
          product: productId,
          quantity: -item.quantity,
          quantityAfter,
          quantityBefore,
          reference,
          type: INVENTORY_MOVEMENT.SALE,
        },
        overrideAccess: true,
        req: {
          transactionID,
        },
      });
    })
  );
}
