export interface ApiError {
  code: string;
  message: string;
  status: number;
}

export const API_ERRORS = {
  AUTH_ACCOUNT_LOCKED: {
    code: "AUTH_ACCOUNT_LOCKED",
    message: "This account is temporarily locked. Try again later.",
    status: 423,
  },

  AUTH_ACCOUNT_REQUIRED: {
    code: "AUTH_ACCOUNT_REQUIRED",
    message: "Authentication is required to access this resource.",
    status: 401,
  },

  AUTH_FORBIDDEN: {
    code: "AUTH_FORBIDDEN",
    message: "You don't have permission to do that.",
    status: 403,
  },

  AUTH_INVALID_CREDENTIALS: {
    code: "AUTH_INVALID_CREDENTIALS",
    message: "Incorrect email or password.",
    status: 401,
  },

  AUTH_SESSION_EXPIRED: {
    code: "AUTH_SESSION_EXPIRED",
    message: "Your session has ended. Please log in again.",
    status: 401,
  },

  AUTH_TOKEN_EXPIRED: {
    code: "AUTH_TOKEN_EXPIRED",
    message: "Your session has expired. Please log in again.",
    status: 401,
  },

  AUTH_TOKEN_INVALID: {
    code: "AUTH_TOKEN_INVALID",
    message: "Invalid authentication token.",
    status: 401,
  },

  AUTH_UNVERIFIED_EMAIL: {
    code: "AUTH_UNVERIFIED_EMAIL",
    message: "Please verify your email before continuing.",
    status: 403,
  },

  BAD_REQUEST: {
    code: "BAD_REQUEST",
    message: "The request could not be processed.",
    status: 400,
  },

  INVALID_JSON_BODY: {
    code: "INVALID_JSON_BODY",
    message: "The request body contains invalid JSON.",
    status: 400,
  },

  INVALID_REQUEST_BODY: {
    code: "INVALID_REQUEST_BODY",
    message: "The request body is invalid.",
    status: 400,
  },

  MEDIA_FILE_TOO_LARGE: {
    code: "MEDIA_FILE_TOO_LARGE",
    message: "This file is too large to upload.",
    status: 413,
  },

  MEDIA_INVALID_MIME_TYPE: {
    code: "MEDIA_INVALID_MIME_TYPE",
    message: "This file type isn't supported.",
    status: 400,
  },

  MEDIA_UPLOAD_FAILED: {
    code: "MEDIA_UPLOAD_FAILED",
    message: "Upload failed. Please try again.",
    status: 500,
  },

  PAYMENT_ALREADY_PROCESSED: {
    code: "PAYMENT_ALREADY_PROCESSED",
    message: "This payment has already been processed.",
    status: 409,
  },

  PAYMENT_DECLINED: {
    code: "PAYMENT_DECLINED",
    message: "Your payment was declined.",
    status: 402,
  },

  PAYMENT_GATEWAY_ERROR: {
    code: "PAYMENT_GATEWAY_ERROR",
    message: "The payment service is currently unavailable.",
    status: 502,
  },

  PAYMENT_GATEWAY_TIMEOUT: {
    code: "PAYMENT_GATEWAY_TIMEOUT",
    message: "The payment service took too long to respond.",
    status: 504,
  },

  PAYMENT_WEBHOOK_INVALID: {
    code: "PAYMENT_WEBHOOK_INVALID",
    message: "The payment notification could not be verified.",
    status: 400,
  },

  RATE_LIMIT_EXCEEDED: {
    code: "RATE_LIMIT_EXCEEDED",
    message: "Too many requests. Please try again later.",
    status: 429,
  },

  RATE_LIMIT_LOGIN_ATTEMPTS: {
    code: "RATE_LIMIT_LOGIN_ATTEMPTS",
    message: "Too many login attempts. Try again shortly.",
    status: 429,
  },

  RESOURCE_ALREADY_EXISTS: {
    code: "RESOURCE_ALREADY_EXISTS",
    message: "This already exists.",
    status: 409,
  },

  RESOURCE_LOCKED: {
    code: "RESOURCE_LOCKED",
    message: "This is currently being edited by someone else.",
    status: 423,
  },

  RESOURCE_NOT_FOUND: {
    code: "RESOURCE_NOT_FOUND",
    message: "We couldn't find what you're looking for.",
    status: 404,
  },

  RESOURCE_VERSION_CONFLICT: {
    code: "RESOURCE_VERSION_CONFLICT",
    message: "This was updated elsewhere. Please refresh.",
    status: 409,
  },

  SERVER_ERROR: {
    code: "SERVER_ERROR",
    message: "Something went wrong on our end.",
    status: 500,
  },

  SERVER_TIMEOUT: {
    code: "SERVER_TIMEOUT",
    message: "The request took too long. Please try again.",
    status: 504,
  },

  SERVER_UNAVAILABLE: {
    code: "SERVER_UNAVAILABLE",
    message: "Service is temporarily unavailable.",
    status: 503,
  },

  VALIDATION_FAILED: {
    code: "VALIDATION_FAILED",
    message: "Some fields need your attention.",
    status: 422,
  },

  VALIDATION_INVALID_FORMAT: {
    code: "VALIDATION_INVALID_FORMAT",
    message: "This value isn't in the right format.",
    status: 422,
  },

  VALIDATION_REQUIRED_FIELD: {
    code: "VALIDATION_REQUIRED_FIELD",
    message: "This field is required.",
    status: 422,
  },

  VALIDATION_UNIQUE_CONSTRAINT: {
    code: "VALIDATION_UNIQUE_CONSTRAINT",
    message: "This value is already in use.",
    status: 409,
  },
} satisfies Record<string, ApiError>;

export type ErrorCode = keyof typeof API_ERRORS;

export function errorResponse(error: ApiError) {
  return Response.json(
    {
      code: error.code,
      message: error.message,
    },
    {
      status: error.status,
    }
  );
}
