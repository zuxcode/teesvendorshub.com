import type { InventoryMovement } from "@/lib/config/collection-config";
import { payload } from "@/lib/services/payload";
import type { DocumentId } from "@/lib/types";

interface CreateInventoryMovementInput {
  notes?: string;
  productId: string;
  quantity: number;
  reference?: string;
  type: InventoryMovement;
  userId: DocumentId;
}

export async function createInventoryMovement({
  productId,
  type,
  quantity,
  reference,
  notes,
  userId,
}: CreateInventoryMovementInput) {
  if (!Number.isInteger(quantity)) {
    throw new Error("Inventory quantity must be an integer.");
  }

  if (quantity === 0) {
    throw new Error("Inventory quantity cannot be zero.");
  }

  const product = await payload.findByID({
    collection: "products",
    depth: 0,
    id: productId,
  });

  const quantityBefore = product.stock ?? 0;
  const quantityAfter = quantityBefore + quantity;

  if (quantityAfter < 0) {
    throw new Error(
      `Insufficient inventory. Available: ${quantityBefore}, requested: ${Math.abs(quantity)}.`
    );
  }

  const inventory = await payload.create({
    collection: "inventory",
    data: {
      createdBy: userId,
      notes,
      product: productId,
      quantity,
      quantityAfter,
      quantityBefore,
      reference,
      type,
    },
  });

  await payload.update({
    collection: "products",
    data: {
      stock: quantityAfter,
    },
    id: productId,
  });

  return inventory;
}
