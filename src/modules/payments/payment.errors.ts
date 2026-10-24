export const PaymentErrorCode = {
  PAYMENT_ALREADY_FAILED: "PAYMENT_ALREADY_FAILED",
  PAYMENT_ALREADY_PROCESSED: "PAYMENT_ALREADY_PROCESSED",
  PAYMENT_ALREADY_REFUNDED: "PAYMENT_ALREADY_REFUNDED",
  PAYMENT_AMOUNT_MISMATCH: "PAYMENT_AMOUNT_MISMATCH",
  PAYMENT_CURRENCY_MISMATCH: "PAYMENT_CURRENCY_MISMATCH",
  PAYMENT_ENQUEUE_FAILED: "PAYMENT_ENQUEUE_FAILED",
  PAYMENT_NOT_FOUND: "PAYMENT_NOT_FOUND",
  PAYMENT_PROVIDER_ERROR: "PAYMENT_PROVIDER_ERROR",
  PAYMENT_PROVIDER_UNSUPPORTED: "PAYMENT_PROVIDER_UNSUPPORTED",
  PAYMENT_REFUND_FAILED: "PAYMENT_REFUND_FAILED",
  PAYMENT_STATUS_INVALID: "PAYMENT_STATUS_INVALID",
  PAYMENT_VERIFICATION_FAILED: "PAYMENT_VERIFICATION_FAILED",
} as const;

export type PaymentErrorCode =
  (typeof PaymentErrorCode)[keyof typeof PaymentErrorCode];

export const PaymentErrorMessage: Record<PaymentErrorCode, string> = {
  PAYMENT_ALREADY_FAILED: "Payment has already failed.",
  PAYMENT_ALREADY_PROCESSED: "Payment already processed.",
  PAYMENT_ALREADY_REFUNDED: "Payment has already been refunded.",
  PAYMENT_AMOUNT_MISMATCH: "Payment amount does not match the expected amount.",
  PAYMENT_CURRENCY_MISMATCH:
    "Payment currency does not match the expected currency.",
  PAYMENT_ENQUEUE_FAILED: "Failed to queue payment for processing.",
  PAYMENT_NOT_FOUND: "Payment could not be found.",
  PAYMENT_PROVIDER_ERROR: "The payment provider could not process the request.",
  PAYMENT_PROVIDER_UNSUPPORTED:
    "The selected payment provider is not supported.",
  PAYMENT_REFUND_FAILED: "Payment could not be refunded.",
  PAYMENT_STATUS_INVALID: "Payment status does not allow this operation.",
  PAYMENT_VERIFICATION_FAILED: "Payment could not be verified.",
};

export class PaymentError extends Error {
  readonly code: PaymentErrorCode;
  constructor(
    code: PaymentErrorCode,
    message: string = PaymentErrorMessage[code],
    options?: ErrorOptions
  ) {
    super(message, options);
    this.name = new.target.name;
    this.code = code;
  }
}

export class PaymentAlreadyProcessedError extends PaymentError {
  constructor() {
    super("PAYMENT_ALREADY_PROCESSED");
  }
}

export class PaymentNotFoundError extends PaymentError {
  constructor() {
    super("PAYMENT_NOT_FOUND");
  }
}

export class PaymentStatusInvalidError extends PaymentError {
  constructor() {
    super("PAYMENT_STATUS_INVALID");
  }
}

export class PaymentAmountMismatchError extends PaymentError {
  constructor() {
    super("PAYMENT_AMOUNT_MISMATCH");
  }
}

export class PaymentVerificationFailedError extends PaymentError {
  constructor(cause?: unknown) {
    super("PAYMENT_VERIFICATION_FAILED", undefined, { cause });
  }
}

export class PaymentProviderError extends PaymentError {
  constructor(cause?: unknown) {
    super("PAYMENT_PROVIDER_ERROR", undefined, { cause });
  }
}

export class PaymentEnqueueFailed extends PaymentError {
  constructor(cause?: unknown) {
    super("PAYMENT_ENQUEUE_FAILED", undefined, { cause });
  }
}

export class PaymentProviderUnsupportedError extends PaymentError {
  constructor() {
    super("PAYMENT_PROVIDER_UNSUPPORTED");
  }
}

export interface PaymentErrorResponse {
  code: PaymentErrorCode;
  message: string;
}

export function paymentServerActionError(
  code: PaymentErrorCode,
  message?: string
): PaymentErrorResponse {
  return {
    code,
    message: message ?? PaymentErrorMessage[code],
  };
}
