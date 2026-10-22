import type { BaseDatabaseAdapter } from "payload";

export type DatabaseTransactionId = NonNullable<
  Awaited<ReturnType<DatabaseTransaction["beginTransaction"]>>
>;

export type WithoutPersistenceFields<T> = Omit<
  T,
  "id" | "createdAt" | "updatedAt"
>;

export type DatabaseTransaction = Pick<
  BaseDatabaseAdapter,
  "beginTransaction" | "commitTransaction" | "rollbackTransaction"
>;

export interface AppErrorConstruct<T extends string> {
  code: T;
  message?: string;
  options?: ErrorOptions;
}
