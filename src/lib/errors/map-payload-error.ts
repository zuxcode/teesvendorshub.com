import {
  APIError,
  AuthenticationError,
  Forbidden,
  Locked,
  NotFound,
  ValidationError,
} from "payload";

import { ErrorCode } from "./codes";
import { AppError } from "./response";

export function mapPayloadError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof ValidationError) {
    const fields: Record<string, string> = {};

    for (const validationError of error.data?.errors ?? []) {
      const path = validationError.path ?? "unknown";

      fields[path] = validationError.message;
    }

    return new AppError(ErrorCode.VALIDATION_FAILED, {
      cause: error,
      fields,
    });
  }

  if (error instanceof AuthenticationError) {
    return new AppError(ErrorCode.AUTH_INVALID_CREDENTIALS, {
      cause: error,
    });
  }

  if (error instanceof Forbidden) {
    return new AppError(ErrorCode.AUTH_FORBIDDEN, {
      cause: error,
    });
  }

  if (error instanceof NotFound) {
    return new AppError(ErrorCode.RESOURCE_NOT_FOUND, {
      cause: error,
    });
  }

  if (error instanceof Locked) {
    return new AppError(ErrorCode.RESOURCE_LOCKED, {
      cause: error,
    });
  }

  if (error instanceof APIError) {
    return new AppError(ErrorCode.SERVER_ERROR, {
      cause: error,
    });
  }

  return new AppError(ErrorCode.SERVER_ERROR, {
    cause: error,
  });
}
