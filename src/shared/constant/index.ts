export const PRODUCT_BADGE = {
  BEST_SELLER: "best_seller",
  COMING_SOON: "coming_soon",
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
