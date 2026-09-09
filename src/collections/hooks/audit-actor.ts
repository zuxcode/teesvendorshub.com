import type { CollectionBeforeChangeHook, TypeWithID } from "payload";
import { APIError } from "payload";
import { ErrorCode, ErrorMessageMap, ErrorStatusMap } from "@/lib/errors/codes";

type CreatedBy = "createdBy" | (string & {});
type UpdatedBy = "updatedBy" | (string & {});

interface AuditActorHookOptions {
  createdBy?: CreatedBy;
  updatedBy?: UpdatedBy;
}

export function createAuditActorHook<T extends TypeWithID>({
  createdBy = "createdBy",
  updatedBy = "updatedBy",
}: AuditActorHookOptions = {}): CollectionBeforeChangeHook<T> {
  return ({ data, req, operation }) => {
    if (!req.user) {
      throw new APIError(
        ErrorMessageMap.AUTH_FORBIDDEN,
        ErrorStatusMap.AUTH_FORBIDDEN,
        { code: ErrorCode.AUTH_FORBIDDEN },
        true
      );
    }

    const updatedData = {
      ...(data ?? {}),
    } as Record<string, unknown>;

    if (operation === "create") {
      updatedData[createdBy] = req.user.id;
    }

    updatedData[updatedBy] = req.user.id;

    return updatedData;
  };
}
