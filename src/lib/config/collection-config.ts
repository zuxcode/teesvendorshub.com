export const VIDEO_MIME_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
] as const;

export const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
] as const;

export const DOC_MIME_TYPES = ["application/pdf"] as const;

export const ACCEPTED_MIME_TYPES = [
  ...VIDEO_MIME_TYPES,
  ...IMAGE_MIME_TYPES,
  ...DOC_MIME_TYPES,
] as const;

export const PRODUCT_STATUS = {
  AVAILABLE: "available",
  DELIVERED: "delivered",
  LOW_STOCK: "low_stock",
  OUT_OF_STOCK: "out_of_stock",
  PENDING: "Pending",
  SOLD: "sold",
};
