import type { Transaction } from "@/payload-types";

export type TransactionInsertData = Omit<
  Transaction,
  "createdAt" | "id" | "updatedAt"
>;
