import { captureException } from "@sentry/nextjs";
import { inventoryService } from "@/modules/inventory/inventory.service";
import { orderRepository } from "@/modules/order/order.repository";
import { orderService } from "@/modules/order/order.service";
import type { Payment } from "@/payload-types";
import { payload } from "@/shared/payload/utils/payload";
import { getRelationshipId } from "@/shared/utils/get-relationship-id";
import { PAYMENT_STATUS } from "../payment.constants";
import {
  PaymentStatusInvalidError,
  PaymentVerificationFailedError,
} from "../payment.errors";
import { paymentRepository } from "../payment.repository";
import type { PaymentVerificationResult } from "../payment.type";

interface CompletePaymentInput {
  payment: Payment;
  verification: PaymentVerificationResult;
}

export async function completePayment({
  payment,
  verification,
}: CompletePaymentInput): Promise<void> {
  const transactionID = await payload.db.beginTransaction();

  if (!transactionID) {
    captureException(new Error("Failed to begin database transaction"), {
      tags: {
        layer: "database",
        operation: "beginTransaction",
      },
    });

    throw new PaymentVerificationFailedError();
  }

  try {
    const currentPayment = await paymentRepository.findById(
      payment.id,
      transactionID
    );

    if (!currentPayment) {
      throw new PaymentVerificationFailedError();
    }

    if (currentPayment.status === PAYMENT_STATUS.SUCCESSFUL) {
      await payload.db.rollbackTransaction(transactionID);
      return;
    }

    if (currentPayment.status !== PAYMENT_STATUS.PENDING) {
      throw new PaymentStatusInvalidError();
    }

    const orderId = getRelationshipId(currentPayment.order);

    if (!orderId) {
      throw new PaymentVerificationFailedError();
    }

    await inventoryService.validateOrderStock({
      orderId,
      transactionID,
    });

    const orderItems = await orderRepository.findItemsByOrderId(
      orderId,
      transactionID
    );

    const items = orderItems.map((item) => {
      const productId = getRelationshipId(item.product);

      if (!productId) {
        throw new PaymentVerificationFailedError();
      }

      return {
        product: productId,
        quantity: item.quantity,
      };
    });

    await inventoryService.createSaleMovement({
      items,
      reference: payment.orderReference,
      transactionID,
    });

    await paymentRepository.update(
      currentPayment.id,
      {
        paidAt: new Date().toISOString(),
        providerFee: verification.fee,
        providerReference: verification.paymentReference,
        status: PAYMENT_STATUS.SUCCESSFUL,
        totalAmountCharged: verification.totalAmountCharged,
      },
      transactionID
    );

    await orderService.confirmOrder(orderId, transactionID);

    await payload.db.commitTransaction(transactionID);
  } catch (error) {
    await payload.db.rollbackTransaction(transactionID);

    throw error;
  }
}
