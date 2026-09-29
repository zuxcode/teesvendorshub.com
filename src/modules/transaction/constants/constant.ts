export const TRANSACTION_TYPE = {
  CHARGEBACK: "chargeback",
  PAYMENT: "payment",
  REFUND: "refund",
} as const;

export type TransactionType =
  (typeof TRANSACTION_TYPE)[keyof typeof TRANSACTION_TYPE];

export const TRANSACTION_STATUS = {
  CANCELLED: "cancelled",
  FAILED: "failed",
  PENDING: "pending",
  SUCCESSFUL: "successful",
} as const;

export type TransactionStatus =
  (typeof TRANSACTION_STATUS)[keyof typeof TRANSACTION_STATUS];
