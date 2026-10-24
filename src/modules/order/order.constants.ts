export const ORDER_STATUS = {
  CANCELLED: "cancelled",
  COMPLETED: "completed",
  PENDING: "pending",
  PROCESSING: "processing",
  REFUNDED: "refunded",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const ORDER_FULFILLMENT_STATUS = {
  CANCELLED: "cancelled",
  COMPLETED: "completed",
  PARTIAL: "partial",
  PENDING: "pending",
} as const;

export type OrderFulfillmentStatus =
  (typeof ORDER_FULFILLMENT_STATUS)[keyof typeof ORDER_FULFILLMENT_STATUS];
