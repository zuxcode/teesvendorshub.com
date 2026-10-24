import type { BasePayload } from "payload";

import { PaymentEnqueueFailed, PaymentNotFoundError } from "../payment.errors";
import type { HandleWebhookInput } from "../payment.type";
import { paymentRegistry } from "../provider/provider.registry";
import { PaymentRepository } from "../repository/payment.repository";

export class PaymentWebhookService {
  private readonly paymentRepository: PaymentRepository;
  private readonly payload: BasePayload;

  constructor(payload: BasePayload) {
    this.paymentRepository = new PaymentRepository(payload);
    this.payload = payload;
  }

  async handle(input: HandleWebhookInput): Promise<void> {
    const parsedWebhookInput = paymentRegistry.parseWebhookInput(input);

    const paymentRecord = await this.paymentRepository.findByOrderReference(
      parsedWebhookInput.orderReference
    );

    if (!paymentRecord) {
      throw new PaymentNotFoundError();
    }

    try {
      await this.payload.jobs.queue({
        input: {
          orderReference: paymentRecord.orderReference,
          paymentProvider: input.provider,
        },
        queue: "processPaymentWebhook",
        workflow: "processPaymentWebhook",
      });
    } catch (error) {
      // biome-ignore lint/style/useErrorCause: <Error passed as param>
      throw new PaymentEnqueueFailed(error);
    }
  }

  static handleWebhook(
    payload: BasePayload,
    input: HandleWebhookInput
  ): Promise<void> {
    return new PaymentWebhookService(payload).handle(input);
  }
}
