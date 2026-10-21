import { payload } from "@/shared/payload/utils/payload";
import { PaymentNotFoundError } from "./payment.errors";
import { PaymentRepository } from "./payment.repository";
import type {
  PaymentInitializeInput,
  PaymentInitializeResult,
} from "./payment.type";
import { paymentRegistry } from "./provider/provider.registry";

export interface InitializeParam {
  input: PaymentInitializeInput;
  paymentId: string;
}

export interface PaymentService {
  initializePayment: (
    args: InitializeParam
  ) => Promise<PaymentInitializeResult>;
}

const paymentRepository = new PaymentRepository(payload);

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

    const { totalAmountCharged, paymentReference, fee } =
      await paymentRegistry.verifyPayment(
        payment.provider,
        payment.orderReference
      );

    await paymentRepository.update(paymentId, {
      checkoutUrl: result.checkoutUrl,
      providerFee: fee,
      providerReference: paymentReference,
      totalAmountCharged,
    });

    return result;
  },
};
