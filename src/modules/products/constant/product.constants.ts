export const SECRET_STATUS = {
  AVAILABLE: "available",
  SOLD: "sold",
} as const;

export type SecretStatus = (typeof SECRET_STATUS)[keyof typeof SECRET_STATUS];
