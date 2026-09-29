export const GlobalErrorCode = {
  ACCESS_DENIED: "ACCESS_DENIED",
  AUTH_ACCOUNT_REQUIRED: "AUTH_ACCOUNT_REQUIRED",
  SERVER_ERROR: "SERVER_ERROR",
  SERVER_TIMEOUT: "SERVER_TIMEOUT",
  SERVER_UNAVAILABLE: "SERVER_UNAVAILABLE",
} as const;

export type GlobalErrorCode =
  (typeof GlobalErrorCode)[keyof typeof GlobalErrorCode];

export const GlobalErrorMessageMap: Record<GlobalErrorCode, string> = {
  ACCESS_DENIED: "You do not have permission to perform this action.",
  AUTH_ACCOUNT_REQUIRED: "Authentication is required",
  SERVER_ERROR: "Something went wrong on our end.",
  SERVER_TIMEOUT: "The request took too long. Please try again.",
  SERVER_UNAVAILABLE: "Service is temporarily unavailable.",
};

export interface GlobalErrorResponse {
  code: GlobalErrorCode;
  message: string;
}

export function globalServerActionError(
  code: GlobalErrorCode
): GlobalErrorResponse {
  return {
    code,
    message: GlobalErrorMessageMap[code],
  };
}

export class GlobalError extends Error {
  readonly code: GlobalErrorCode;

  constructor({ code, message }: { code: GlobalErrorCode; message: string }) {
    super(message);
    this.name = "GlobalError";
    this.code = code;
  }
}
