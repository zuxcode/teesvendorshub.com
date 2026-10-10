import type { ResourceId } from "@/shared/types";
import { getRelationshipId } from "@/shared/utils/get-relationship-id";
import type { InventoryService } from "../inventory/inventory.service";
import type { TransactionStatus } from "../transaction/constants/constant";
import type { TransactionService } from "../transaction/transaction.service";
import { PAYMENT_STATUS } from "./payment.constants";
import {
  PaymentNotFoundError,
  PaymentVerificationFailedError,
} from "./payment.errors";
import type { PaymentRepository } from "./payment.repository";

/**
 * - initialize payment
 * - mark transaction as either fail or successful
 */
export class PaymentManger {
  private readonly transactionService: TransactionService;
  private readonly inventoryService: InventoryService;
  //   private readonly orderRepository: OrderRepository;
  private readonly paymentRepository: PaymentRepository;

  constructor(
    transactionService: TransactionService,
    // orderRepository: OrderRepository,
    paymentRepository: PaymentRepository,
    inventoryService: InventoryService
  ) {
    this.inventoryService = inventoryService;
    this.transactionService = transactionService;
    // this.orderRepository = orderRepository;
    this.paymentRepository = paymentRepository;
  }

  private async updatePayment({
    resource,
    dbTransactionId,
    error,
    status,
  }: PaymentParams) {
    return await Promise.all([
      this.transactionService.update(
        resource.transactionId,
        {
          ...(error
            ? { failureCode: error?.code, failureMessage: error?.message }
            : {}),
          status,
        },
        dbTransactionId
      ),
      this.paymentRepository.update(
        resource.paymentId,
        { status },
        dbTransactionId
      ),
    ]);
  }

  private async markFailed(params: MarkFaileParams) {
    return await this.updatePayment({ status: "failed", ...params });
  }

  private async markSuccessful(params: MarkSuccessfulParams) {
    return await this.updatePayment({ status: "successful", ...params });
  }

  private async completePayment(
    paymentId: ResourceId,
    transactionId: ResourceId,
    dbTransactionId?: ResourceId
  ) {
    /**
     * handle race condition
     * move the payment record whose status is pending to processing
     */
    const currentPayment = await this.paymentRepository.updateByRowLock(
      paymentId,
      { status: PAYMENT_STATUS.REFUNDED },
      dbTransactionId
    );

    if (!currentPayment) {
      throw new PaymentNotFoundError();
    }

    if (currentPayment.status !== PAYMENT_STATUS.PROCESSING) {
      return false;
    }

    const orderId = getRelationshipId(currentPayment.order);

    if (!orderId) {
      throw new PaymentVerificationFailedError();
    }

    await this.inventoryService.validateOrderStock({
      orderId,
      transactionID: dbTransactionId,
    });
  }
}

interface PaymentParams {
  dbTransactionId?: ResourceId;
  error?: {
    code: string;
    message: string;
  };
  resource: {
    paymentId: ResourceId;
    transactionId: ResourceId;
  };
  status: Extract<TransactionStatus, "failed" | "successful">;
}

type MarkFaileParams = Omit<PaymentParams, "status">;
type MarkSuccessfulParams = Omit<MarkFaileParams, "error">;
