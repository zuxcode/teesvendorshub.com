export const PAYMENT_PROVIDER_NAME = {
  TRANSACTPAY: "transactpay",
} as const;

export type PaymentProviderName =
  (typeof PAYMENT_PROVIDER_NAME)[keyof typeof PAYMENT_PROVIDER_NAME];

export const PAYMENT_STATUS = {
  FAILED: "failed",
  PARTIALLY_PAID: "partially-paid",
  PARTIALLY_REFUNDED: "partially-refunded",
  PENDING: "pending",
  REFUNDED: "refunded",
  SUCCESSFUL: "successful",
} as const;

export const PAYMENT_VERIFICATION_STATUS = {
  FAILED: "failed",
  PENDING: "pending",
  SUCCESSFUL: "successful",
} as const;

export type PaymentVerificationStatus =
  (typeof PAYMENT_VERIFICATION_STATUS)[keyof typeof PAYMENT_VERIFICATION_STATUS];
