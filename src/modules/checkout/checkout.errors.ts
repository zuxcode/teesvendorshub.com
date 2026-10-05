export const CheckoutErrorCode = {
  CHECKOUT_PERSIST_FAILED: "CHECKOUT_PERSIST_FAILED",
  PAYMENT_INIT_FAILED: "PAYMENT_INIT_FAILED",
  TRANSACTION_FAILED: "TRANSACTION_FAILED",
} as const;

export type CheckoutErrorCode =
  (typeof CheckoutErrorCode)[keyof typeof CheckoutErrorCode];

export const CheckoutErrorMessage: Record<CheckoutErrorCode, string> = {
  CHECKOUT_PERSIST_FAILED: "We couldn't place your order. Please try again.",
  PAYMENT_INIT_FAILED: "Payment could not be started. Please try again.",
  TRANSACTION_FAILED: "A temporary error occurred. Please try again.",
};

export interface CheckoutErrorResponse {
  code: CheckoutErrorCode;
  message: string;
}

export function checkoutError(code: CheckoutErrorCode): CheckoutErrorResponse {
  return { code, message: CheckoutErrorMessage[code] };
}

export class CheckoutError extends Error {
  readonly name = "CheckoutError";

  constructor(code: CheckoutErrorCode, message?: string) {
    super(message ?? CheckoutErrorMessage[code]);
  }
}
