import type { CollectionBeforeChangeHook, TypeWithID } from "payload";

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
    const updatedData = {
      ...(data ?? {}),
    } as Record<string, unknown>;

    if (operation === "create") {
      updatedData[createdBy] = req.user?.id;
    }

    updatedData[updatedBy] = req.user?.id;

    return updatedData;
  };
}
