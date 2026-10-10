export const CURRENCY = {
  NGN: "NGN",
} as const;

export type Currency = (typeof CURRENCY)[keyof typeof CURRENCY];

export const ORDER_STATUS = {
  CANCELLED: "cancelled",
  COMPLETED: "completed",
  PENDING: "pending",
  PROCESSING: "processing",
  REFUNDED: "refunded",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
