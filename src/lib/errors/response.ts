import { type ErrorCode, ErrorMessageMap, ErrorStatusMap } from "./codes";

export interface ApiErrorResponse {
  error: {
    code: ErrorCode;
    message: string;
    fields?: Record<string, string>; // for VALIDATION_FAILED
    requestId?: string; // correlate with server logs
  };
}

export class AppError extends Error {
  code: ErrorCode;
  status: number;
  fields?: Record<string, string>;

  constructor(
    code: ErrorCode,
    opts?: { fields?: Record<string, string>; message?: string }
  ) {
    super(opts?.message ?? ErrorMessageMap[code]);
    this.code = code;
    this.status = ErrorStatusMap[code];
    this.fields = opts?.fields;
  }

  toResponse(requestId?: string): ApiErrorResponse {
    return {
      error: {
        code: this.code,
        fields: this.fields,
        message: this.message,
        requestId,
      },
    };
  }
}
