export const GlobalErrorCode = {
  AUTH_ACCOUNT_REQUIRED: "AUTH_ACCOUNT_REQUIRED",
  SERVER_ERROR: "SERVER_ERROR",
  SERVER_TIMEOUT: "SERVER_TIMEOUT",
  SERVER_UNAVAILABLE: "SERVER_UNAVAILABLE",
} as const;

export type GlobalErrorCode =
  (typeof GlobalErrorCode)[keyof typeof GlobalErrorCode];

export const GlobalErrorMessageMap: Record<GlobalErrorCode, string> = {
  AUTH_ACCOUNT_REQUIRED: "Authentication is required",
  SERVER_ERROR: "Something went wrong on our end.",
  SERVER_TIMEOUT: "The request took too long. Please try again.",
  SERVER_UNAVAILABLE: "Service is temporarily unavailable.",
};

export interface GlobalError {
  code: GlobalErrorCode;
  message: string;
}

export function globalServerActionError(code: GlobalErrorCode): GlobalError {
  return {
    code,
    message: GlobalErrorMessageMap[code],
  };
}
