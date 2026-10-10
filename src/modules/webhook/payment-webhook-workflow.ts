import {
  type BaseDatabaseAdapter,
  JobCancelledError,
  type TaskHandler,
} from "payload";
import type { TaskDeliverProduct, TaskVerifyPayment } from "@/payload-types";
import { ServerError } from "@/shared/errors/global-errors";
import { generateUniqueReference } from "@/shared/utils/generate-unique-ref";
import { getRelationshipId } from "@/shared/utils/get-relationship-id";
import type { InventoryService } from "../inventory/inventory.service";
import { ORDER_STATUS } from "../order/order.constants";
import { OrderErrorMessage, OrderNotFoundError } from "../order/order.error";
import type { OrderRepository } from "../order/order.repository";
import { PAYMENT_STATUS } from "../payments/payment.constants";
import { PaymentError, PaymentErrorMessage } from "../payments/payment.errors";
import type { PaymentRepository } from "../payments/payment.repository";
import type { PaymentRegistry } from "../payments/provider/provider.registry";
import { ProductErrorMessage } from "../products/product.error";
import {
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
} from "../transaction/constants/constant";
import type { TransactionRepository } from "../transaction/transaction.repository";

type DbTransactionAction = Pick<
  BaseDatabaseAdapter,
  "beginTransaction" | "commitTransaction" | "rollbackTransaction"
>;

export class PaymentWebhookWorkflow {
  private readonly paymentRepository: PaymentRepository;
  private readonly paymentRegistry: PaymentRegistry;
  private readonly inventoryService: InventoryService;
  private readonly orderRepository: OrderRepository;
  private readonly transactionRepository: TransactionRepository;
  private readonly dbTransactionAction: DbTransactionAction;

  constructor(
    paymentRepository: PaymentRepository,
    inventoryService: InventoryService,
    paymentRegistry: PaymentRegistry,
    transactionRepository: TransactionRepository,
    orderRepository: OrderRepository,
    dbTransactionAction: DbTransactionAction
  ) {
    this.inventoryService = inventoryService;
    this.paymentRepository = paymentRepository;
    this.paymentRegistry = paymentRegistry;
    this.orderRepository = orderRepository;
    this.transactionRepository = transactionRepository;
    this.dbTransactionAction = dbTransactionAction;
  }

  verifyPayment: TaskHandler<TaskVerifyPayment> = async ({ input }) => {
    const payment = await this.paymentRepository.findByOrderReference(
      input.orderReference
    );

    if (!payment) {
      throw new JobCancelledError(PaymentErrorMessage.PAYMENT_NOT_FOUND);
    }

    if (payment.status === PAYMENT_STATUS.SUCCESSFUL) {
      return {
        output: {
          payment,
          success: true,
        },
      };
    }

    if (payment.status !== PAYMENT_STATUS.PENDING) {
      throw new JobCancelledError(
        PaymentErrorMessage.PAYMENT_ALREADY_PROCESSED
      );
    }

    const verification = await this.paymentRegistry.verifyPayment(
      payment.provider,
      input.orderReference
    );

    if (verification.amount !== payment.amount) {
      throw new JobCancelledError(PaymentErrorMessage.PAYMENT_AMOUNT_MISMATCH);
    }

    if (verification.currency !== payment.currency) {
      throw new JobCancelledError(
        PaymentErrorMessage.PAYMENT_CURRENCY_MISMATCH
      );
    }

    if (verification.status === PAYMENT_STATUS.FAILED) {
      await this.paymentRepository.updateByRowLock(payment.id, {
        status: PAYMENT_STATUS.FAILED,
      });
      throw new JobCancelledError(PaymentErrorMessage.PAYMENT_ALREADY_FAILED);
    }

    if (verification.status === PAYMENT_STATUS.REFUNDED) {
      await this.paymentRepository.updateByRowLock(payment.id, {
        status: PAYMENT_STATUS.REFUNDED,
      });
      throw new JobCancelledError("Payment Already Reversed");
    }

    if (verification.status !== PAYMENT_STATUS.SUCCESSFUL) {
      // TODO: fix PAYMENT_VERIFICATION_FAILED
      throw new PaymentError(
        "PAYMENT_VERIFICATION_FAILED",
        "Payment has not been confirmed yet"
      );
    }

    const transactionId = await this.dbTransactionAction.beginTransaction();

    if (!transactionId) {
      throw new ServerError();
    }

    try {
      const updatedPayment = await this.paymentRepository.updateByRowLock(
        payment.id,
        {
          paidAt: new Date().toISOString(),
          providerFee: verification.fee,
          providerReference: verification.paymentReference,
          status: PAYMENT_STATUS.SUCCESSFUL,
          totalAmountCharged: verification.totalAmountCharged,
        },
        transactionId
      );

      if (!updatedPayment) {
        await this.dbTransactionAction.rollbackTransaction(transactionId);

        const currentPayment = await this.paymentRepository.findById(
          payment.id
        );

        if (currentPayment?.status === PAYMENT_STATUS.SUCCESSFUL) {
          return {
            output: {
              payment: currentPayment,
              success: true,
            },
          };
        }

        throw new PaymentError(
          "PAYMENT_VERIFICATION_FAILED",
          "Payment could not be transitioned to successful"
        );
      }

      await this.transactionRepository.create(
        {
          amount: verification.amount,
          currency: verification.currency,
          customer: payment.buyer,
          description: "precurement record",
          order: payment.order,
          provider: payment.provider,
          providerReference: verification.paymentReference,
          reference: generateUniqueReference("TXN"),
          status: TRANSACTION_STATUS.SUCCESSFUL,
          type: TRANSACTION_TYPE.PAYMENT,
        },
        transactionId
      );

      await this.dbTransactionAction.commitTransaction(transactionId);

      return {
        output: {
          payment: updatedPayment,
          success: true,
        },
      };
    } catch (error) {
      await this.dbTransactionAction.rollbackTransaction(transactionId);
      throw error;
    }
  };

  deliverProduct: TaskHandler<TaskDeliverProduct> = async ({ input }) => {
    const paymentId = getRelationshipId(input.payment);

    if (!paymentId) {
      throw new JobCancelledError(PaymentErrorMessage.PAYMENT_NOT_FOUND);
    }

    const payment = await this.paymentRepository.findById(paymentId);

    if (!payment) {
      throw new JobCancelledError(PaymentErrorMessage.PAYMENT_NOT_FOUND);
    }

    if (payment.status === PAYMENT_STATUS.PENDING) {
      // TODO: fix PAYMENT_VERIFICATION_FAILED
      throw new PaymentError(
        "PAYMENT_VERIFICATION_FAILED",
        "Payment has not been confirmed yet"
      );
    }

    if (payment.status === PAYMENT_STATUS.REFUNDED) {
      throw new JobCancelledError(PaymentErrorMessage.PAYMENT_ALREADY_REFUNDED);
    }

    if (payment.status === PAYMENT_STATUS.FAILED) {
      throw new JobCancelledError(PaymentErrorMessage.PAYMENT_ALREADY_FAILED);
    }

    if (payment.status !== PAYMENT_STATUS.SUCCESSFUL) {
      throw new JobCancelledError(PaymentErrorMessage.PAYMENT_ALREADY_FAILED);
    }

    const orderId = getRelationshipId(payment.order);

    if (!orderId) {
      throw new OrderNotFoundError();
    }

    const order = await this.orderRepository.findById(orderId);

    if (order.status === ORDER_STATUS.COMPLETED) {
      throw new JobCancelledError(OrderErrorMessage.ORDER_ALREADY_CANCELLED);
    }

    if (order.status !== ORDER_STATUS.PENDING) {
      throw new JobCancelledError("Order is either cancelled or refunded");
    }

    const { actualStock, virtualStock } =
      await this.inventoryService.validateOrderStock({
        orderId,
      });

    const orderItems = await this.orderRepository.findItemsByOrderId(orderId);

    const items = orderItems.map((item) => {
      const productId = getRelationshipId(item.product);

      if (!productId) {
        throw new JobCancelledError(ProductErrorMessage.PRODUCT_NOT_FOUND);
      }

      return {
        product: productId,
        quantity: item.quantity,
      };
    });

    const transactionId = await this.dbTransactionAction.beginTransaction();

    if (!transactionId) {
      throw new ServerError();
    }

    try {
      await this.inventoryService.createSaleMovement({
        items,
        reference: payment.orderReference,
        transactionID: transactionId,
      });

      await this.orderRepository.update(
        orderId,
        {
          status: ORDER_STATUS.PROCESSING,
        },
        transactionId
      );
      this.dbTransactionAction.commitTransaction(transactionId);
    } catch (error) {
      this.dbTransactionAction.rollbackTransaction(transactionId);
      throw error;
    }

    return {
      output: {
        success: true,
      },
    };
  };
}
