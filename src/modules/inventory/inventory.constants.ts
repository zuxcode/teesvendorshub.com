export const INVENTORY_MOVEMENT = {
  ADJUSTMENT: "adjustment",
  DAMAGED: "damaged",
  EXPIRED: "expired",
  RESTOCK: "restock",
  RETURN: "return",
  SALE: "sale",
} as const;

export type InventoryMovement =
  (typeof INVENTORY_MOVEMENT)[keyof typeof INVENTORY_MOVEMENT];
