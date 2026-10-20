import { ServerError } from "@/shared/errors/global-errors";
import type {
  DatabaseTransaction,
  DatabaseTransactionId,
} from "@/shared/types";

export class DatabaseTransactionBase {
  private readonly databaseTransaction: DatabaseTransaction;

  constructor(databaseTransaction: DatabaseTransaction) {
    this.databaseTransaction = databaseTransaction;
  }

  async withDatabaseTransaction<T>(
    operation: (transactionId: DatabaseTransactionId) => Promise<T | null>
  ): Promise<T | null> {
    const transactionId = await this.databaseTransaction.beginTransaction();

    if (!transactionId) {
      throw new ServerError();
    }

    let transactionActive = true;

    try {
      const result = await operation(transactionId);

      // A null result means the operation should not be committed.
      if (result === null) {
        await this.databaseTransaction.rollbackTransaction(transactionId);
        transactionActive = false;

        return null;
      }

      await this.databaseTransaction.commitTransaction(transactionId);
      transactionActive = false;

      return result;
    } catch (error) {
      if (transactionActive) {
        transactionActive = false;

        try {
          await this.databaseTransaction.rollbackTransaction(transactionId);
        } catch (rollbackError) {
          // biome-ignore lint/style/useErrorCause: Preserve both failures.
          throw new AggregateError(
            [error, rollbackError],
            "Database operation failed and rollback also failed",
            { cause: error }
          );
        }
      }

      throw error;
    }
  }
}
