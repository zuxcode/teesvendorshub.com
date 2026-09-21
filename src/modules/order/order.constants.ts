export const ORDER_FULFILLMENT_STATUS = {
  CANCELLED: "cancelled",
  FAILED: "failed",
  FULFILLED: "fulfilled",
  PENDING: "pending",
  PROCESSING: "processing",
} as const;

export const CURRENCY = {
  NGN: "NGN",
} as const;

export type Currency = (typeof CURRENCY)[keyof typeof CURRENCY];
export type OrderFulfillmentStatus =
  (typeof ORDER_FULFILLMENT_STATUS)[keyof typeof ORDER_FULFILLMENT_STATUS];
