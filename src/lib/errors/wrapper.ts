import { randomUUID } from "node:crypto";
import type { BasePayload } from "payload";
import { mapPayloadError } from "./map-payload-error";
import { AppError } from "./response";

export function withErrorHandling(
  handler: (req: unknown) => Promise<Response>,
  payload?: BasePayload
) {
  return async (req: unknown) => {
    const requestId = randomUUID();
    try {
      return await handler(req);
    } catch (err) {
      const appError = err instanceof AppError ? err : mapPayloadError(err);

      if (payload) {
        payload.logger.error({
          cause: appError.cause,
          code: appError.code,
          message: appError.message,
          rawError: err,
          requestId,
          stack: appError.stack,
        });
      }

      if (!payload) {
        console.error(
          {
            cause: appError.cause,
            code: appError.code,
            message: appError.message,
            requestId,
            stack: appError.stack,
          },
          err
        );
      }

      return Response.json(appError.toResponse(requestId), {
        status: appError.status,
      });
    }
  };
}
