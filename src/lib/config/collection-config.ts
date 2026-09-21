export const VIDEO_MIME_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
] as const;

export type VideoMimeType = (typeof VIDEO_MIME_TYPES)[number];

export const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
] as const;

export type ImageMimeType = (typeof IMAGE_MIME_TYPES)[number];

export const DOC_MIME_TYPES = ["application/pdf"] as const;

export type DocMimeType = (typeof DOC_MIME_TYPES)[number];

export const ACCEPTED_MIME_TYPES = [
  ...VIDEO_MIME_TYPES,
  ...IMAGE_MIME_TYPES,
  ...DOC_MIME_TYPES,
] as const;

export type AcceptedMimeType = (typeof ACCEPTED_MIME_TYPES)[number];

// -----------------------------------------------------------------------------
// SIM CARD
// -----------------------------------------------------------------------------

export const SIM_TYPE = {
  ESIM: "esim",
  PHYSICAL: "physical_sim",
} as const;

export type SimType = (typeof SIM_TYPE)[keyof typeof SIM_TYPE];

// -----------------------------------------------------------------------------
// INVENTORY
// -----------------------------------------------------------------------------

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

// export const PAYMENT_PROVIDER_NAME = {
//   MANUAL: "manual",
//   TRANSACTPAY: "transactpay",
// } as const;

// export type PaymentProvider =
//   (typeof PAYMENT_PROVIDER_NAME)[keyof typeof PAYMENT_PROVIDER_NAME];

export const CATEGORY_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type CategoryStatus =
  (typeof CATEGORY_STATUS)[keyof typeof CATEGORY_STATUS];
