export const GIFT_STATUS = {
  ACTIVE: "active",
  ARCHIVED: "archived",
  DRAFT: "draft",
  INACTIVE: "inactive",
} as const;

export type ProductStatus = (typeof GIFT_STATUS)[keyof typeof GIFT_STATUS];
