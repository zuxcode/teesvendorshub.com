import "server-only";

import type { ResourceId } from "@/shared/types";
import { PaymentNotFoundError } from "./payment.errors";
import { paymentRepository } from "./payment.repository";
import type {
  PaymentInitializeInput,
  PaymentInitializeResult,
} from "./payment.type";
import { paymentRegistry } from "./provider/provider.registry";

export interface InitializeParam {
  input: PaymentInitializeInput;
  paymentId: ResourceId;
}

export interface PaymentService {
  initializePayment: (
    args: InitializeParam
  ) => Promise<PaymentInitializeResult>;
}

export const paymentService: PaymentService = {
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
