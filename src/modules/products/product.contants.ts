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

export const PRODUCT_BADGE = {
  BEST_SELLER: "best_seller",
  COMING_SOON: "coming_soon",
  FEATURED: "featured",
  NEW: "new",
  TRENDING: "trending",
} as const;

export type ProductBadge = (typeof PRODUCT_BADGE)[keyof typeof PRODUCT_BADGE];
