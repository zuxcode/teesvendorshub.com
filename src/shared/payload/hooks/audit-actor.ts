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

    const { user } = req;

    if (operation === "create") {
      updatedData[createdBy] = user?.id;
    }

    updatedData[updatedBy] = user?.id;

    return updatedData;
  };
}
