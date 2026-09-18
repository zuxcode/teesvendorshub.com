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
// PRODUCT
// -----------------------------------------------------------------------------

export const PRODUCT_STATUS = {
  ACTIVE: "active",
  ARCHIVED: "archived",
  DRAFT: "draft",
  INACTIVE: "inactive",
} as const;

export type ProductStatus =
  (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];

export const PRODUCT_TYPE = {
  DIGITAL: "digital",
  PHYSICAL: "physical",
} as const;

export type ProductType = (typeof PRODUCT_TYPE)[keyof typeof PRODUCT_TYPE];

// -----------------------------------------------------------------------------
// PRODUCT BADGES
// -----------------------------------------------------------------------------

export const PRODUCT_BADGE = {
  BEST_SELLER: "best_seller",
  COMING_SOON: "coming_soon",
  FEATURED: "featured",
  NEW: "new",
  TRENDING: "trending",
} as const;

export type ProductBadge = (typeof PRODUCT_BADGE)[keyof typeof PRODUCT_BADGE];

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

export const INVENTORY_MOVEMENT = {
  ADJUSTMENT: "adjustment",
  DAMAGED: "damaged",
  EXPIRED: "expired",
  RESTOCK: "restock",
  RETURN: "return",
  SALE: "sale",
} as const;

export type InventoryMovement =
  (typeof INVENTORY_MOVEMENT)[keyof typeof INVENTORY_MOVEMENT];

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

export const PAYMENT_PROVIDER = {
  MANUAL: "manual",
  TRANSACTPAY: "transactpay",
} as const;

export type PaymentProvider =
  (typeof PAYMENT_PROVIDER)[keyof typeof PAYMENT_PROVIDER];

export const CURRENCY = {
  NGN: "NGN",
} as const;

export type Currency = (typeof CURRENCY)[keyof typeof CURRENCY];

export const CATEGORY_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type CategoryStatus =
  (typeof CATEGORY_STATUS)[keyof typeof CATEGORY_STATUS];

export const ORDER_FULFILLMENT_STATUS = {
  CANCELLED: "cancelled",
  FAILED: "failed",
  FULFILLED: "fulfilled",
  PENDING: "pending",
  PROCESSING: "processing",
} as const;
