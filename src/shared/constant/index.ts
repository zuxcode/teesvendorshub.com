export const PRODUCT_BADGE = {
  BEST_SELLER: "best_seller",
  FEATURED: "featured",
  NEW: "new",
  TRENDING: "trending",
} as const;

export type ProductBadge = (typeof PRODUCT_BADGE)[keyof typeof PRODUCT_BADGE];

export const PRODUCT_STATUS = {
  ACTIVE: "active",
  ARCHIVED: "archived",
  DRAFT: "draft",
  INACTIVE: "inactive",
} as const;

export type ProductStatus =
  (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];

export const CURRENCY = {
  NGN: "NGN",
} as const;

export type Currency = (typeof CURRENCY)[keyof typeof CURRENCY];

export const RELATION_TO = {
  GIFT: "gift",
  PRODUCT: "product",
  SIM: "sim",
} as const;

export const RELATION_TO_VALUES = Object.values(RELATION_TO);

export type RelationTo = (typeof RELATION_TO)[keyof typeof RELATION_TO];
