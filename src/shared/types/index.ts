import type { BaseDatabaseAdapter } from "payload";

export type ResourceId = string;

// export type ResourceId = string | number;
export type DatabaseTransactionId = NonNullable<
  Awaited<ReturnType<DatabaseTransaction["beginTransaction"]>>
>;

export type WithoutPersistenceFields<T> = Omit<
  T,
  "id" | "createdAt" | "updatedAt"
>;

export type StoreStatus = "idle" | "loading" | "ready" | "error";

export type DatabaseTransaction = Pick<
  BaseDatabaseAdapter,
  "beginTransaction" | "commitTransaction" | "rollbackTransaction"
>;
