export type ResourceId = string | number;

export type WithoutPersistenceFields<T> = Omit<
  T,
  "id" | "createdAt" | "updatedAt"
>;
