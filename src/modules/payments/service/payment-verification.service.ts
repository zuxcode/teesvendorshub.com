import { type BasePayload, JobCancelledError, type TaskHandler } from "payload";
import { DatabaseTransactionBase } from "@/modules/database/database-transaction-basemodel";
import {
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
} from "@/modules/transaction/constants/constant";
import { TransactionRepository } from "@/modules/transaction/transaction.repository";
import type { Payment, TaskVerifyPayment } from "@/payload-types";
import { generateUniqueReference } from "@/shared/utils/generate-unique-ref";
import { PAYMENT_STATUS } from "../payment.constants";
import { PaymentError, PaymentErrorMessage } from "../payment.errors";
import { PaymentRepository } from "../payment.repository";
import type { PaymentVerificationResult } from "../payment.type";
import { paymentRegistry } from "../provider/provider.registry";

type TaskVerifyPaymentOutput = Pick<TaskVerifyPayment, "output">;

export class PaymentVerificationService {
  private readonly paymentRepository: PaymentRepository;
  private readonly databaseTransactionBase: DatabaseTransactionBase;
  private readonly transactionRepository: TransactionRepository;

  constructor(payload: BasePayload) {
    this.paymentRepository = new PaymentRepository(payload);
    this.databaseTransactionBase = new DatabaseTransactionBase(payload.db);
    this.transactionRepository = new TransactionRepository(payload);
  }

  private async loadPaymentByReference(orderReference: string) {
    const payment =
      await this.paymentRepository.findByOrderReference(orderReference);

    if (!payment) {
      throw new JobCancelledError(PaymentErrorMessage.PAYMENT_NOT_FOUND);
    }

    return payment;
  }

  private verifyWithProvider(payment: Payment) {
    return paymentRegistry.verifyPayment(
      payment.provider,
      payment.orderReference
    );
  }

  private validateProviderResult(
    payment: Payment,
    verifiedPayment: PaymentVerificationResult
  ): void {
    if (verifiedPayment.amount !== payment.amount) {
      throw new JobCancelledError(PaymentErrorMessage.PAYMENT_AMOUNT_MISMATCH);
    }

    if (verifiedPayment.currency !== payment.currency) {
      throw new JobCancelledError(
        PaymentErrorMessage.PAYMENT_CURRENCY_MISMATCH
      );
    }
  }

  private async loadCurrentPaymentAfterConflict(
    paymentId: string
  ): Promise<Payment> {
    const payment = await this.paymentRepository.findById(paymentId);

    if (!payment) {
      throw new JobCancelledError(PaymentErrorMessage.PAYMENT_NOT_FOUND);
    }

    if (payment.status === PAYMENT_STATUS.PENDING) {
      throw new PaymentError(
        "PAYMENT_VERIFICATION_FAILED",
        `Payment ${paymentId} could not be transitioned`
      );
    }

    return payment;
  }

  private async markAsFailed(
    payment: Payment,
    verifiedPayment: PaymentVerificationResult
  ): Promise<TaskVerifyPaymentOutput> {
    const result = await this.databaseTransactionBase.withDatabaseTransaction(
      async (transactionId) => {
        const updatedPayment = await this.paymentRepository.markAsFailed(
          payment.id,
          transactionId
        );

        // Another worker may already have processed this payment.
        if (!updatedPayment) {
          return null;
        }

        await this.transactionRepository.create(
          {
            amount: updatedPayment.amount,
            currency: updatedPayment.currency,
            customer: updatedPayment.buyer,
            idempotencyKey: `${TRANSACTION_TYPE.PAYMENT}:${updatedPayment.id}:${TRANSACTION_STATUS.FAILED}`,
            order: updatedPayment.order,
            payment: updatedPayment.id,
            provider: updatedPayment.provider,
            providerReference: verifiedPayment.paymentReference,
            reference: generateUniqueReference("TXN"),
            status: TRANSACTION_STATUS.FAILED,
            type: TRANSACTION_TYPE.PAYMENT,
          },
          transactionId
        );

        return {
          order: payment.order,
          status: PAYMENT_STATUS.FAILED,
        };
      }
    );

    if (result) {
      return {
        output: {
          order: result.order,
          status: result.status,
        },
      };
    }

    const currentPayment = await this.loadCurrentPaymentAfterConflict(
      payment.id
    );

    return {
      output: {
        order: currentPayment.order,
        status: currentPayment.status,
      },
    };
  }

  private async markAsSuccessful(
    payment: Payment,
    verifiedPayment: PaymentVerificationResult
  ): Promise<TaskVerifyPaymentOutput> {
    const result = await this.databaseTransactionBase.withDatabaseTransaction(
      async (transactionId) => {
        const updatedPayment = await this.paymentRepository.markAsSuccessful(
          payment.id,
          transactionId
        );

        if (!updatedPayment) {
          return null;
        }

        await this.transactionRepository.create(
          {
            amount: verifiedPayment.amount,
            currency: verifiedPayment.currency,
            customer: updatedPayment.buyer,
            description: "Payment received for order",
            idempotencyKey: `${TRANSACTION_TYPE.PAYMENT}:${updatedPayment.id}:${TRANSACTION_STATUS.SUCCESSFUL}`,
            order: updatedPayment.order,
            payment: updatedPayment.id,
            provider: updatedPayment.provider,
            providerReference: verifiedPayment.paymentReference,
            reference: generateUniqueReference("TXN"),
            status: TRANSACTION_STATUS.SUCCESSFUL,
            type: TRANSACTION_TYPE.PAYMENT,
          },
          transactionId
        );

        return {
          order: payment.order,
          status: PAYMENT_STATUS.SUCCESSFUL,
        };
      }
    );

    if (result) {
      return {
        output: result,
      };
    }

    const currentPayment = await this.loadCurrentPaymentAfterConflict(
      payment.id
    );

    return {
      output: {
        order: currentPayment.order,
        status: currentPayment.status,
      },
    };
  }

  private applyVerifiedOutcome(
    payment: Payment,
    verifiedPayment: PaymentVerificationResult
  ) {
    switch (verifiedPayment.status) {
      case PAYMENT_STATUS.SUCCESSFUL:
        return this.markAsSuccessful(payment, verifiedPayment);

      case PAYMENT_STATUS.FAILED:
        return this.markAsFailed(payment, verifiedPayment);

      case PAYMENT_STATUS.PENDING:
        throw new PaymentError(
          "PAYMENT_VERIFICATION_FAILED",
          "Payment has not been confirmed yet"
        );

      default:
        throw new JobCancelledError(
          "Provider returned an unsupported payment status"
        );
    }
  }

  async verify(input: TaskVerifyPayment["input"]) {
    const payment = await this.loadPaymentByReference(input.orderReference);

    if (payment.status !== PAYMENT_STATUS.PENDING) {
      return {
        output: {
          order: payment.order,
          status: payment.status,
        },
      };
    }

    const verifiedPayment = await this.verifyWithProvider(payment);
    this.validateProviderResult(payment, verifiedPayment);
    return this.applyVerifiedOutcome(payment, verifiedPayment);
  }

  static readonly verifyPayment: TaskHandler<TaskVerifyPayment> = ({
    input,
    req,
  }) => {
    const service = new PaymentVerificationService(req.payload);

    return service.verify(input);
  };
}
