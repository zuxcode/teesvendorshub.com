export const PaymentErrorCode = {
  PAYMENT_ALREADY_COMPLETED: "PAYMENT_ALREADY_COMPLETED",
  PAYMENT_ALREADY_FAILED: "PAYMENT_ALREADY_FAILED",
  PAYMENT_ALREADY_REFUNDED: "PAYMENT_ALREADY_REFUNDED",
  PAYMENT_AMOUNT_MISMATCH: "PAYMENT_AMOUNT_MISMATCH",
  PAYMENT_CAPTURE_FAILED: "PAYMENT_CAPTURE_FAILED",
  PAYMENT_CURRENCY_MISMATCH: "PAYMENT_CURRENCY_MISMATCH",
  PAYMENT_INITIALIZATION_FAILED: "PAYMENT_INITIALIZATION_FAILED",
  PAYMENT_NOT_FOUND: "PAYMENT_NOT_FOUND",
  PAYMENT_PROVIDER_ERROR: "PAYMENT_PROVIDER_ERROR",
  PAYMENT_PROVIDER_UNAVAILABLE: "PAYMENT_PROVIDER_UNAVAILABLE",
  PAYMENT_PROVIDER_UNSUPPORTED: "PAYMENT_PROVIDER_UNSUPPORTED",
  PAYMENT_REFUND_FAILED: "PAYMENT_REFUND_FAILED",
  PAYMENT_STATUS_INVALID: "PAYMENT_STATUS_INVALID",
  PAYMENT_VERIFICATION_FAILED: "PAYMENT_VERIFICATION_FAILED",
} as const;

export type PaymentErrorCode =
  (typeof PaymentErrorCode)[keyof typeof PaymentErrorCode];

export const PaymentErrorMessage: Record<PaymentErrorCode, string> = {
  PAYMENT_ALREADY_COMPLETED: "Payment has already been completed.",
  PAYMENT_ALREADY_FAILED: "Payment has already failed.",
  PAYMENT_ALREADY_REFUNDED: "Payment has already been refunded.",
  PAYMENT_AMOUNT_MISMATCH: "Payment amount does not match the expected amount.",
  PAYMENT_CAPTURE_FAILED: "Payment could not be captured.",
  PAYMENT_CURRENCY_MISMATCH:
    "Payment currency does not match the expected currency.",
  PAYMENT_INITIALIZATION_FAILED: "Payment could not be initialized.",
  PAYMENT_NOT_FOUND: "Payment could not be found.",
  PAYMENT_PROVIDER_ERROR: "The payment provider could not process the request.",
  PAYMENT_PROVIDER_UNAVAILABLE:
    "The payment provider is temporarily unavailable.",
  PAYMENT_PROVIDER_UNSUPPORTED:
    "The selected payment provider is not supported.",
  PAYMENT_REFUND_FAILED: "Payment could not be refunded.",
  PAYMENT_STATUS_INVALID: "Payment status does not allow this operation.",
  PAYMENT_VERIFICATION_FAILED: "Payment could not be verified.",
};

export class PaymentError extends Error {
  readonly code: PaymentErrorCode;

  constructor(code: PaymentErrorCode, message: string) {
    super(message);
    this.name = "PaymentError";
    this.code = code;
  }
}

export class PaymentNotFoundError extends PaymentError {
  constructor() {
    super(
      PaymentErrorCode.PAYMENT_NOT_FOUND,
      PaymentErrorMessage.PAYMENT_NOT_FOUND
    );
  }
}

export class PaymentStatusInvalidError extends PaymentError {
  constructor() {
    super(
      PaymentErrorCode.PAYMENT_STATUS_INVALID,
      PaymentErrorMessage.PAYMENT_STATUS_INVALID
    );
  }
}

export class PaymentAmountMismatchError extends PaymentError {
  constructor() {
    super(
      PaymentErrorCode.PAYMENT_AMOUNT_MISMATCH,
      PaymentErrorMessage.PAYMENT_AMOUNT_MISMATCH
    );
  }
}

export class PaymentVerificationFailedError extends PaymentError {
  constructor() {
    super(
      PaymentErrorCode.PAYMENT_VERIFICATION_FAILED,
      PaymentErrorMessage.PAYMENT_VERIFICATION_FAILED
    );
  }
}

export class PaymentRefundFailedError extends PaymentError {
  constructor() {
    super(
      PaymentErrorCode.PAYMENT_REFUND_FAILED,
      PaymentErrorMessage.PAYMENT_REFUND_FAILED
    );
  }
}

export class PaymentProviderError extends PaymentError {
  constructor(message = PaymentErrorMessage.PAYMENT_PROVIDER_ERROR) {
    super(PaymentErrorCode.PAYMENT_PROVIDER_ERROR, message);
  }
}

export class PaymentProviderUnavailableError extends PaymentError {
  constructor() {
    super(
      PaymentErrorCode.PAYMENT_PROVIDER_UNAVAILABLE,
      PaymentErrorMessage.PAYMENT_PROVIDER_UNAVAILABLE
    );
  }
}

export class PaymentInitializationFailedError extends PaymentError {
  constructor() {
    super(
      PaymentErrorCode.PAYMENT_INITIALIZATION_FAILED,
      PaymentErrorMessage.PAYMENT_INITIALIZATION_FAILED
    );
  }
}

export class PaymentProviderUnsupportedError extends PaymentError {
  constructor() {
    super(
      PaymentErrorCode.PAYMENT_PROVIDER_UNSUPPORTED,
      PaymentErrorMessage.PAYMENT_PROVIDER_UNSUPPORTED
    );
  }
}

export interface PaymentErrorResponse {
  code: PaymentErrorCode;
  message: string;
}

export function paymentServerActionError(
  code: PaymentErrorCode
): PaymentErrorResponse {
  return {
    code,
    message: PaymentErrorMessage[code],
  };
}
