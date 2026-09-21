export const InventoryErrorCode = {
  INVENTORY_NOT_FOUND: "INVENTORY_NOT_FOUND",
  INVENTORY_UPDATE_FAILED: "INVENTORY_UPDATE_FAILED",
} as const;

export type InventoryErrorCode =
  (typeof InventoryErrorCode)[keyof typeof InventoryErrorCode];

export const InventoryErrorMessage: Record<InventoryErrorCode, string> = {
  INVENTORY_NOT_FOUND: "Inventory could not be found.",
  INVENTORY_UPDATE_FAILED: "Inventory could not be updated.",
};

export interface InventoryErrorResponse {
  code: InventoryErrorCode;
  message: string;
}

export function inventoryServerActionError(
  code: InventoryErrorCode
): InventoryErrorResponse {
  return {
    code,
    message: InventoryErrorMessage[code],
  };
}

export class InventoryError extends Error {
  readonly code: InventoryErrorCode;

  constructor(code: InventoryErrorCode, message: string) {
    super(message);
    this.name = "InventoryError";
    this.code = code;
  }
}

export class InventoryNotFoundError extends InventoryError {
  constructor() {
    super(
      InventoryErrorCode.INVENTORY_NOT_FOUND,
      InventoryErrorMessage.INVENTORY_NOT_FOUND
    );
  }
}

export class InventoryUpdateFailedError extends InventoryError {
  constructor() {
    super(
      InventoryErrorCode.INVENTORY_UPDATE_FAILED,
      InventoryErrorMessage.INVENTORY_UPDATE_FAILED
    );
  }
}
