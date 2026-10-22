export const PRODUCT_SECRET_STATUS = {
  AVAILABLE: "available",
  SOLD: "sold",
} as const;

export type ProductSecretStatus =
  (typeof PRODUCT_SECRET_STATUS)[keyof typeof PRODUCT_SECRET_STATUS];
