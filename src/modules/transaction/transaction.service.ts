import type { Transaction } from "@/payload-types";
import type { TransactionRepository } from "./transaction.repository";
import type { TransactionInsertData } from "./types/transactions.type";

export class TransactionService {
  private readonly transactionRepository: TransactionRepository;

  constructor(transactionRepository: TransactionRepository) {
    this.transactionRepository = transactionRepository;
  }

  findById(id: string): Promise<Transaction | null> {
    return this.transactionRepository.findById(id);
  }

  create(
    transactionData: TransactionInsertData,
    transactionID?: string
  ): Promise<Transaction> {
    return this.transactionRepository.create(transactionData, transactionID);
  }
}
