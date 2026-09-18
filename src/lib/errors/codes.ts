export const ErrorCode = {
  AUTH_ACCOUNT_LOCKED: "AUTH_ACCOUNT_LOCKED",
  AUTH_ACCOUNT_REQUIRED: "AUTH_ACCOUNT_REQUIRED", // No authentication
  AUTH_FORBIDDEN: "AUTH_FORBIDDEN", // authenticated but lacks access
  // ── Auth (401/403) ──────────────────────────────
  AUTH_INVALID_CREDENTIALS: "AUTH_INVALID_CREDENTIALS",
  AUTH_SESSION_EXPIRED: "AUTH_SESSION_EXPIRED",
  AUTH_TOKEN_EXPIRED: "AUTH_TOKEN_EXPIRED",
  AUTH_TOKEN_INVALID: "AUTH_TOKEN_INVALID",
  AUTH_UNVERIFIED_EMAIL: "AUTH_UNVERIFIED_EMAIL",

  // __ Request / Post (400)
  BAD_REQUEST: "BAD_REQUEST",
  INSUFFICIENT_STOCK: "INSUFFICIENT_STOCK",

  // ── Media / uploads (400/413) ───────────────────
  MEDIA_FILE_TOO_LARGE: "MEDIA_FILE_TOO_LARGE",
  MEDIA_INVALID_MIME_TYPE: "MEDIA_INVALID_MIME_TYPE",
  MEDIA_UPLOAD_FAILED: "MEDIA_UPLOAD_FAILED",
  PAYMENT_ALREADY_PROCESSED: "PAYMENT_ALREADY_PROCESSED",

  // ── Payments (if applicable) ────────────────────
  PAYMENT_DECLINED: "PAYMENT_DECLINED",
  PAYMENT_GATEWAY_ERROR: "PAYMENT_GATEWAY_ERROR",
  PAYMENT_WEBHOOK_INVALID: "PAYMENT_WEBHOOK_INVALID",

  // ── Rate limiting / abuse (429) ─────────────────
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  RATE_LIMIT_LOGIN_ATTEMPTS: "RATE_LIMIT_LOGIN_ATTEMPTS",
  RESOURCE_ALREADY_EXISTS: "RESOURCE_ALREADY_EXISTS",
  RESOURCE_LOCKED: "RESOURCE_LOCKED", // Payload document locking

  // ── Resource (404/409) ──────────────────────────
  RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",
  RESOURCE_VERSION_CONFLICT: "RESOURCE_VERSION_CONFLICT", // optimistic locking / drafts

  // ── Server (500/503) ────────────────────────────
  SERVER_ERROR: "SERVER_ERROR", // catch-all, never expose details
  SERVER_TIMEOUT: "SERVER_TIMEOUT",
  SERVER_UNAVAILABLE: "SERVER_UNAVAILABLE", // DB down, dependency down

  // ── Validation (400) ────────────────────────────
  VALIDATION_FAILED: "VALIDATION_FAILED", // generic, use with `fields` payload
  VALIDATION_INVALID_FORMAT: "VALIDATION_INVALID_FORMAT",
  VALIDATION_REQUIRED_FIELD: "VALIDATION_REQUIRED_FIELD",
  VALIDATION_UNIQUE_CONSTRAINT: "VALIDATION_UNIQUE_CONSTRAINT", // e.g. duplicate email/slug
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

/** HTTP status mapping — single source of truth */
export const ErrorStatusMap: Record<ErrorCode, number> = {
  AUTH_ACCOUNT_LOCKED: 423,
  AUTH_ACCOUNT_REQUIRED: 401,
  AUTH_FORBIDDEN: 403,
  AUTH_INVALID_CREDENTIALS: 401,
  AUTH_SESSION_EXPIRED: 401,
  AUTH_TOKEN_EXPIRED: 401,
  AUTH_TOKEN_INVALID: 401,
  AUTH_UNVERIFIED_EMAIL: 403,

  BAD_REQUEST: 400,
  INSUFFICIENT_STOCK: 404,

  MEDIA_FILE_TOO_LARGE: 413,
  MEDIA_INVALID_MIME_TYPE: 400,
  MEDIA_UPLOAD_FAILED: 500,
  PAYMENT_ALREADY_PROCESSED: 409,

  PAYMENT_DECLINED: 402,
  PAYMENT_GATEWAY_ERROR: 502,
  PAYMENT_WEBHOOK_INVALID: 400,

  RATE_LIMIT_EXCEEDED: 429,
  RATE_LIMIT_LOGIN_ATTEMPTS: 429,
  RESOURCE_ALREADY_EXISTS: 409,
  RESOURCE_LOCKED: 423,

  RESOURCE_NOT_FOUND: 404,
  RESOURCE_VERSION_CONFLICT: 409,

  SERVER_ERROR: 500,
  SERVER_TIMEOUT: 504,
  SERVER_UNAVAILABLE: 503,

  VALIDATION_FAILED: 422,
  VALIDATION_INVALID_FORMAT: 400,
  VALIDATION_REQUIRED_FIELD: 400,
  VALIDATION_UNIQUE_CONSTRAINT: 409,
};

export const ErrorMessageMap: Record<ErrorCode, string> = {
  AUTH_ACCOUNT_LOCKED: "This account is temporarily locked. Try again later.",
  AUTH_ACCOUNT_REQUIRED: "Authentication is required to access this resource.",
  AUTH_FORBIDDEN: "You don't have permission to do that.",
  AUTH_INVALID_CREDENTIALS: "Incorrect email or password.",
  AUTH_SESSION_EXPIRED: "Your session has ended. Please log in again.",
  AUTH_TOKEN_EXPIRED: "Your session has expired. Please log in again.",
  AUTH_TOKEN_INVALID: "Invalid authentication token.",
  AUTH_UNVERIFIED_EMAIL: "Please verify your email before continuing.",

  BAD_REQUEST: "Invalid JSON payload",
  INSUFFICIENT_STOCK:
    "One or more products are no longer available in the requested quantity.",

  MEDIA_FILE_TOO_LARGE: "This file is too large to upload.",
  MEDIA_INVALID_MIME_TYPE: "This file type isn't supported.",
  MEDIA_UPLOAD_FAILED: "Upload failed. Please try again.",
  PAYMENT_ALREADY_PROCESSED: "This payment has already been processed.",

  PAYMENT_DECLINED: "Your payment was declined.",
  PAYMENT_GATEWAY_ERROR: "The payment service is currently unavailable.",
  PAYMENT_WEBHOOK_INVALID: "Invalid payment webhook.",

  RATE_LIMIT_EXCEEDED: "Too many requests. Please slow down.",
  RATE_LIMIT_LOGIN_ATTEMPTS: "Too many login attempts. Try again shortly.",
  RESOURCE_ALREADY_EXISTS: "This already exists.",
  RESOURCE_LOCKED: "This is currently being edited by someone else.",

  RESOURCE_NOT_FOUND: "We couldn't find what you're looking for.",
  RESOURCE_VERSION_CONFLICT: "This was updated elsewhere. Please refresh.",

  SERVER_ERROR: "Something went wrong on our end.",
  SERVER_TIMEOUT: "The request took too long. Please try again.",
  SERVER_UNAVAILABLE: "Service is temporarily unavailable.",

  VALIDATION_FAILED: "Some fields need your attention.",
  VALIDATION_INVALID_FORMAT: "This value isn't in the right format.",
  VALIDATION_REQUIRED_FIELD: "This field is required.",
  VALIDATION_UNIQUE_CONSTRAINT: "This value is already in use.",
};
