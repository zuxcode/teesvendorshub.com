import type { Payload } from "payload";
import type { Transaction } from "@/payload-types";
import type { ResourceId } from "@/shared/types";
import type { TransactionInsertData } from "./types/transactions.type";

export class TransactionRepository {
  private readonly payload: Payload;

  constructor(payload: Payload) {
    this.payload = payload;
  }

  async findById(
    id: ResourceId,
    transactionID?: ResourceId
  ): Promise<Transaction | null> {
    const found = await this.payload.findByID({
      collection: "transactions",
      depth: 0,
      id,
      req: { transactionID },
    });
    return found ?? null;
  }

  create(
    transactionData: TransactionInsertData,
    transactionID?: ResourceId
  ): Promise<Transaction> {
    return this.payload.create({
      collection: "transactions",
      data: transactionData,
      req: { transactionID },
    });
  }

  update(
    id: ResourceId,
    updateData: Partial<TransactionInsertData>,
    transactionID?: ResourceId
  ): Promise<Transaction> {
    return this.payload.update({
      collection: "transactions",
      data: updateData,
      id,
      req: { transactionID },
    });
  }
}
