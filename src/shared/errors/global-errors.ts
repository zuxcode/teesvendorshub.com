export const GlobalErrorCode = {
  ACCESS_DENIED: "ACCESS_DENIED",
  SERVER_ERROR: "SERVER_ERROR",
  SERVER_TIMEOUT: "SERVER_TIMEOUT",
  SERVER_UNAVAILABLE: "SERVER_UNAVAILABLE",
} as const;

export type GlobalErrorCode =
  (typeof GlobalErrorCode)[keyof typeof GlobalErrorCode];

export const GlobalErrorMessageMap = {
  ACCESS_DENIED: "You do not have permission to perform this action.",
  SERVER_ERROR: "Something went wrong on our end.",
  SERVER_TIMEOUT: "The request took too long. Please try again.",
  SERVER_UNAVAILABLE: "Service is temporarily unavailable.",
} satisfies Record<GlobalErrorCode, string>;

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

  constructor({
    code,
    message = GlobalErrorMessageMap[code],
    options,
  }: {
    code: GlobalErrorCode;
    message?: string;
    options?: ErrorOptions;
  }) {
    super(message, options);

    this.name = new.target.name;
    this.code = code;
  }
}
export class ServerError extends GlobalError {
  constructor() {
    super({
      code: "SERVER_ERROR",
    });
  }
}
