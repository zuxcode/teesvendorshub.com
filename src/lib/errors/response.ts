import { ErrorCode, ErrorMessageMap, ErrorStatusMap } from "./codes";

export interface ApiError {
  code: ErrorCode;
  message: string;
  status: number;
}

export const API_ERRORS = Object.fromEntries(
  Object.values(ErrorCode).map((code) => [
    code,
    {
      code,
      message: ErrorMessageMap[code],
      status: ErrorStatusMap[code],
    },
  ])
) as Record<ErrorCode, ApiError>;

export interface AppErrorOptions {
  cause?: unknown;
  fields?: Record<string, string>;
  message?: string;
}

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly fields?: Record<string, string>;

  constructor(code: ErrorCode, options?: AppErrorOptions) {
    const error = API_ERRORS[code];

    super(options?.message ?? error.message, {
      cause: options?.cause,
    });

    this.name = "AppError";
    this.code = code;
    this.status = error.status;
    this.fields = options?.fields;
  }

  toResponse(requestId?: string) {
    return {
      error: {
        code: this.code,
        message: this.message,
        ...(this.fields && {
          fields: this.fields,
        }),
        ...(requestId && {
          requestId,
        }),
      },
    };
  }
}

export function httpErrorResponse(errorCode: ErrorCode) {
  const error = API_ERRORS[errorCode];

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

export function serverActionError(errorCode: ErrorCode) {
  const error = API_ERRORS[errorCode];

  return {
    code: error.code,
    message: error.message,
    status: error.status,
  };
}
