export const ErrorCode = {
  // ── Authentication ─────────────────────────────

  AUTH_ACCOUNT_LOCKED: "AUTH_ACCOUNT_LOCKED",
  // AUTH_ACCOUNT_REQUIRED: "AUTH_ACCOUNT_REQUIRED",
  AUTH_FORBIDDEN: "AUTH_FORBIDDEN",
  AUTH_INVALID_CREDENTIALS: "AUTH_INVALID_CREDENTIALS",
  AUTH_SESSION_EXPIRED: "AUTH_SESSION_EXPIRED",
  AUTH_TOKEN_EXPIRED: "AUTH_TOKEN_EXPIRED",
  AUTH_TOKEN_INVALID: "AUTH_TOKEN_INVALID",
  AUTH_UNVERIFIED_EMAIL: "AUTH_UNVERIFIED_EMAIL",

  // ── Request ────────────────────────────────────

  BAD_REQUEST: "BAD_REQUEST",

  // ── Media ──────────────────────────────────────

  MEDIA_FILE_TOO_LARGE: "MEDIA_FILE_TOO_LARGE",
  MEDIA_INVALID_MIME_TYPE: "MEDIA_INVALID_MIME_TYPE",
  MEDIA_UPLOAD_FAILED: "MEDIA_UPLOAD_FAILED",

  // ── Orders ──────────────────────────────────────
  ORDER_ALREADY_CANCELLED: "ORDER_ALREADY_CANCELLED",
  ORDER_CANCELLATION_FAILED: "ORDER_CANCELLATION_FAILED",
  ORDER_CREATION_FAILED: "ORDER_CREATION_FAILED",
  ORDER_NOT_FOUND: "ORDER_NOT_FOUND",
  ORDER_STATUS_INVALID: "ORDER_STATUS_INVALID",

  // ── Rate limiting ──────────────────────────────

  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  RATE_LIMIT_LOGIN_ATTEMPTS: "RATE_LIMIT_LOGIN_ATTEMPTS",

  // ── Resources ──────────────────────────────────

  RESOURCE_ALREADY_EXISTS: "RESOURCE_ALREADY_EXISTS",
  RESOURCE_LOCKED: "RESOURCE_LOCKED",
  RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",
  RESOURCE_VERSION_CONFLICT: "RESOURCE_VERSION_CONFLICT",

  // ── Server ─────────────────────────────────────

  SERVER_ERROR: "SERVER_ERROR",
  SERVER_TIMEOUT: "SERVER_TIMEOUT",
  SERVER_UNAVAILABLE: "SERVER_UNAVAILABLE",

  // ── Validation ─────────────────────────────────

  VALIDATION_FAILED: "VALIDATION_FAILED",
  VALIDATION_INVALID_FORMAT: "VALIDATION_INVALID_FORMAT",
  VALIDATION_REQUIRED_FIELD: "VALIDATION_REQUIRED_FIELD",
  VALIDATION_UNIQUE_CONSTRAINT: "VALIDATION_UNIQUE_CONSTRAINT",
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

export const ErrorStatusMap: Record<ErrorCode, number> = {
  AUTH_ACCOUNT_LOCKED: 423,
  // AUTH_ACCOUNT_REQUIRED: 401,
  AUTH_FORBIDDEN: 403,
  AUTH_INVALID_CREDENTIALS: 401,
  AUTH_SESSION_EXPIRED: 401,
  AUTH_TOKEN_EXPIRED: 401,
  AUTH_TOKEN_INVALID: 401,
  AUTH_UNVERIFIED_EMAIL: 403,

  BAD_REQUEST: 400,

  MEDIA_FILE_TOO_LARGE: 413,
  MEDIA_INVALID_MIME_TYPE: 400,
  MEDIA_UPLOAD_FAILED: 500,

  ORDER_ALREADY_CANCELLED: 409,
  ORDER_CANCELLATION_FAILED: 500,
  ORDER_CREATION_FAILED: 500,
  ORDER_NOT_FOUND: 404,
  ORDER_STATUS_INVALID: 409,

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
  AUTH_FORBIDDEN: "You don't have permission to do that.",
  AUTH_INVALID_CREDENTIALS: "Incorrect email or password.",
  AUTH_SESSION_EXPIRED: "Your session has ended. Please log in again.",
  AUTH_TOKEN_EXPIRED: "Your session has expired. Please log in again.",
  AUTH_TOKEN_INVALID: "Invalid authentication token.",
  AUTH_UNVERIFIED_EMAIL: "Please verify your email before continuing.",

  BAD_REQUEST: "The request is invalid.",

  MEDIA_FILE_TOO_LARGE: "This file is too large to upload.",
  MEDIA_INVALID_MIME_TYPE: "This file type isn't supported.",
  MEDIA_UPLOAD_FAILED: "Upload failed. Please try again.",

  ORDER_ALREADY_CANCELLED: "This order has already been cancelled.",
  ORDER_CANCELLATION_FAILED: "We couldn't cancel your order. Please try again.",
  ORDER_CREATION_FAILED: "We couldn't create your order. Please try again.",
  ORDER_NOT_FOUND: "We couldn't find your order.",
  ORDER_STATUS_INVALID: "This order cannot be changed from its current status.",

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
