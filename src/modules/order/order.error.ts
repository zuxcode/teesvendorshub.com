export const OrderErrorCode = {
  ORDER_ALREADY_CANCELLED: "ORDER_ALREADY_CANCELLED",
  ORDER_CANCELLATION_FAILED: "ORDER_CANCELLATION_FAILED",
  ORDER_CREATION_FAILED: "ORDER_CREATION_FAILED",
  ORDER_HAS_NO_ITEMS: "ORDER_HAS_NO_ITEMS",
  ORDER_ITEM_PRODUCT_ID_MISSING: "ORDER_ITEM_PRODUCT_ID_MISSING",
  ORDER_ITEMS_UNAVAILABLE: "ORDER_ITEMS_UNAVAILABLE",
  ORDER_NOT_FOUND: "ORDER_NOT_FOUND",
  ORDER_STATUS_INVALID: "ORDER_STATUS_INVALID",
} as const;

export type OrderErrorCode =
  (typeof OrderErrorCode)[keyof typeof OrderErrorCode];

export const OrderErrorMessage: Record<OrderErrorCode, string> = {
  ORDER_ALREADY_CANCELLED: "Order has already been cancelled.",
  ORDER_CANCELLATION_FAILED: "Order could not be cancelled.",
  ORDER_CREATION_FAILED: "Order could not be created.",
  ORDER_HAS_NO_ITEMS: "Order Item is empty",
  ORDER_ITEM_PRODUCT_ID_MISSING:
    "Order item is missing its product relationship.",
  ORDER_ITEMS_UNAVAILABLE: "One or two order item is unavailable",
  ORDER_NOT_FOUND: "Order could not be found.",
  ORDER_STATUS_INVALID: "Order status does not allow this operation.",
};

export interface OrderErrorResponse {
  code: OrderErrorCode;
  message: string;
}

export function orderServerActionError(
  code: OrderErrorCode
): OrderErrorResponse {
  return {
    code,
    message: OrderErrorMessage[code],
  };
}

export class OrderError extends Error {
  readonly code: OrderErrorCode;
  readonly retryable: boolean;

  constructor(code: OrderErrorCode, message: string, retryable = false) {
    super(message);
    this.name = "OrderError";
    this.code = code;
    this.retryable = retryable;
  }
}

export class OrderNotFoundError extends OrderError {
  constructor() {
    super(OrderErrorCode.ORDER_NOT_FOUND, OrderErrorMessage.ORDER_NOT_FOUND);
  }
}

export class OrderAlreadyCancelledError extends OrderError {
  constructor() {
    super(
      OrderErrorCode.ORDER_ALREADY_CANCELLED,
      OrderErrorMessage.ORDER_ALREADY_CANCELLED
    );
  }
}

export class OrderStatusInvalidError extends OrderError {
  constructor() {
    super(
      OrderErrorCode.ORDER_STATUS_INVALID,
      OrderErrorMessage.ORDER_STATUS_INVALID
    );
  }
}

export class OrderCancellationFailedError extends OrderError {
  constructor() {
    super(
      OrderErrorCode.ORDER_CANCELLATION_FAILED,
      OrderErrorMessage.ORDER_CANCELLATION_FAILED
    );
  }
}

export class OrderCreationFailedError extends OrderError {
  constructor() {
    super(
      OrderErrorCode.ORDER_CREATION_FAILED,
      OrderErrorMessage.ORDER_CREATION_FAILED
    );
  }
}
