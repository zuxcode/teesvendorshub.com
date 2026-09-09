import {
  APIError,
  AuthenticationError,
  Forbidden,
  Locked,
  NotFound,
  ValidationError,
} from "payload";
import { payload } from "../services/payload";
import { ErrorCode } from "./codes";
import { AppError } from "./response";

export function mapPayloadError(err: unknown): AppError {
  if (err instanceof ValidationError) {
    const fields: Record<string, string> = {};
    for (const d of err.data?.errors ?? []) {
      fields[d.path ?? "unknown"] = d.message;
    }
    return new AppError(ErrorCode.VALIDATION_FAILED, { fields });
  }
  if (err instanceof AuthenticationError) {
    return new AppError(ErrorCode.AUTH_INVALID_CREDENTIALS);
  }
  if (err instanceof Forbidden) {
    return new AppError(ErrorCode.AUTH_FORBIDDEN);
  }
  if (err instanceof NotFound) {
    return new AppError(ErrorCode.RESOURCE_NOT_FOUND);
  }
  if (err instanceof Locked) {
    return new AppError(ErrorCode.RESOURCE_LOCKED);
  }
  if (err instanceof APIError) {
    return new AppError(ErrorCode.SERVER_ERROR);
  }

  // Unknown error — never leak details to client, but log server-side
  payload.logger.error(err, "[unmapped error]");
  return new AppError(ErrorCode.SERVER_ERROR);
}
