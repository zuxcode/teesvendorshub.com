export const OrderErrorCode = {
  ORDER_ALREADY_CANCELLED: "ORDER_ALREADY_CANCELLED",
  ORDER_CANCELLATION_FAILED: "ORDER_CANCELLATION_FAILED",
  ORDER_CREATION_FAILED: "ORDER_CREATION_FAILED",
  ORDER_NOT_FOUND: "ORDER_NOT_FOUND",
  ORDER_STATUS_INVALID: "ORDER_STATUS_INVALID",
} as const;

export type OrderErrorCode =
  (typeof OrderErrorCode)[keyof typeof OrderErrorCode];

export const OrderErrorMessage: Record<OrderErrorCode, string> = {
  ORDER_ALREADY_CANCELLED: "Order has already been cancelled.",
  ORDER_CANCELLATION_FAILED: "Order could not be cancelled.",
  ORDER_CREATION_FAILED: "Order could not be created.",
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

  constructor(code: OrderErrorCode, message: string) {
    super(message);
    this.name = "OrderError";
    this.code = code;
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
