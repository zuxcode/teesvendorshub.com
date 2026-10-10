export const PAYMENT_PROVIDER_NAME = {
  TRANSACTPAY: "transactpay",
} as const;

export type PaymentProviderName =
  (typeof PAYMENT_PROVIDER_NAME)[keyof typeof PAYMENT_PROVIDER_NAME];

export const PAYMENT_STATUS = {
  FAILED: "failed",
  PENDING: "pending",
  REFUNDED: "refunded",
  SUCCESSFUL: "successful",
} as const;

export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];
