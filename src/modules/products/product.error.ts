export const ProductErrorCode = {
  INSUFFICIENT_STOCK: "INSUFFICIENT_STOCK",
  PRODUCT_NOT_FOUND: "PRODUCT_NOT_FOUND",
  PRODUCT_OUT_OF_STOCK: "PRODUCT_OUT_OF_STOCK",
} as const;

export type ProductErrorCode =
  (typeof ProductErrorCode)[keyof typeof ProductErrorCode];

export const ProductErrorMessage: Record<ProductErrorCode, string> = {
  INSUFFICIENT_STOCK:
    "One or more products are no longer available in the requested quantity.",
  PRODUCT_NOT_FOUND: "One or more products could not be found.",
  PRODUCT_OUT_OF_STOCK: "One or more products are out of stock.",
};

export interface ProductErrorResponse {
  code: ProductErrorCode;
  message: string;
}

export function productServerActionError(
  code: ProductErrorCode
): ProductErrorResponse {
  return {
    code,
    message: ProductErrorMessage[code],
  };
}

export class ProductError extends Error {
  readonly code: ProductErrorCode;

  constructor(code: ProductErrorCode, message: string) {
    super(message);
    this.name = "ProductError";
    this.code = code;
  }
}

export class ProductNotFoundError extends ProductError {
  constructor() {
    super(
      ProductErrorCode.PRODUCT_NOT_FOUND,
      ProductErrorMessage.PRODUCT_NOT_FOUND
    );
  }
}

export class ProductOutOfStockError extends ProductError {
  constructor() {
    super(
      ProductErrorCode.PRODUCT_OUT_OF_STOCK,
      ProductErrorMessage.PRODUCT_OUT_OF_STOCK
    );
  }
}

export class InsufficientStockError extends ProductError {
  constructor() {
    super(
      ProductErrorCode.INSUFFICIENT_STOCK,
      ProductErrorMessage.INSUFFICIENT_STOCK
    );
  }
}
