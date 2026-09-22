import "server-only";

import type { ResourceId } from "@/shared/types";
import { completePayment } from "./helpers/payment.helper";
import { PAYMENT_STATUS } from "./payment.constants";
import {
  PaymentAmountMismatchError,
  PaymentCurrencyMismatchError,
  PaymentNotFoundError,
  PaymentStatusInvalidError,
  PaymentVerificationFailedError,
} from "./payment.errors";
import { paymentRepository } from "./payment.repository";
import type {
  HandleWebhookInput,
  PaymentInitializeInput,
  PaymentInitializeResult,
} from "./payment.type";
import { paymentRegistry } from "./provider/provider.registry";

export interface InitializeParam {
  input: PaymentInitializeInput;
  paymentId: ResourceId;
}

export interface PaymentService {
  handleWebhook: (input: HandleWebhookInput) => Promise<void>;
  initializePayment: (
    args: InitializeParam
  ) => Promise<PaymentInitializeResult>;
}

export const paymentService: PaymentService = {
  handleWebhook: async (input) => {
    const webhook = paymentRegistry.parseWebhook(input);
    const payment = await paymentRepository.findByOrderReference(
      webhook.orderReference
    );

    if (!payment) {
      throw new PaymentVerificationFailedError();
    }

    /*
     * Idempotency.
     *
     * TransactPay may send the same webhook more than once.
     */
    if (payment.status === PAYMENT_STATUS.SUCCESSFUL) {
      return;
    }

    if (payment.status !== PAYMENT_STATUS.PENDING) {
      throw new PaymentStatusInvalidError();
    }

    const verification = await paymentRegistry.verifyPayment(
      payment.provider,
      webhook.orderReference
    );

    /*
     * Validate the provider response against our
     * own payment record.
     */
    if (verification.orderReference !== webhook.orderReference) {
      throw new PaymentVerificationFailedError();
    }

    if (verification.amount !== payment.amount) {
      throw new PaymentAmountMismatchError();
    }

    if (verification.currency !== payment.currency) {
      throw new PaymentCurrencyMismatchError();
    }

    /*
     * The provider has not completed the payment yet.
     *
     * Do not change our payment state.
     */
    if (verification.status === PAYMENT_STATUS.PENDING) {
      throw new PaymentStatusInvalidError();
    }

    /*
     * The provider has definitively failed the payment.
     */
    if (verification.status === PAYMENT_STATUS.FAILED) {
      await paymentRepository.update(payment.id, {
        status: PAYMENT_STATUS.FAILED,
      });

      return;
    }

    /*
     * Only a successfully verified payment can proceed
     * to order/inventory completion.
     *
     * The expensive completion work is delegated to a job
     * so the webhook endpoint can acknowledge the provider
     * quickly.
     */
    if (verification.status === PAYMENT_STATUS.SUCCESSFUL) {
      await completePayment({
        payment,
        verification,
      });
      return;
    }

    throw new PaymentVerificationFailedError();
  },

  async initializePayment({ paymentId, input }) {
    const payment = await paymentRepository.findById(paymentId);

    if (!payment) {
      throw new PaymentNotFoundError();
    }

    const result = await paymentRegistry.initialize({
      ...input,
      provider: payment.provider,
    });

    await paymentRepository.update(paymentId, {
      checkoutUrl: result.checkoutUrl,
      providerReference: result.reference,
    });

    return result;
  },
};
