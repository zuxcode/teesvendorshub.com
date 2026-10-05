import type { Transaction } from "@/payload-types";
import type { ResourceId } from "@/shared/types";
import type { TransactionRepository } from "./transaction.repository";
import type { TransactionInsertData } from "./types/transactions.type";

export class TransactionService {
  private readonly transactionRepository: TransactionRepository;

  constructor(transactionRepository: TransactionRepository) {
    this.transactionRepository = transactionRepository;
  }

  findById(id: ResourceId): Promise<Transaction | null> {
    return this.transactionRepository.findById(id);
  }

  create(transactionData: TransactionInsertData): Promise<Transaction> {
    return this.transactionRepository.create(transactionData);
  }

  update(
    id: ResourceId,
    updateData: Partial<TransactionInsertData>
  ): Promise<Transaction> {
    return this.transactionRepository.update(id, updateData);
  }
}
