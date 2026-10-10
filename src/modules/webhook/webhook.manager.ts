import type { BasePayload } from "payload";
import { PaymentError } from "../payments/payment.errors";
import type { HandleInput, Parse } from "./webhook.type";

export class WebhookManger {
  private readonly parse: Parse;
  private readonly job: BasePayload["jobs"];

  constructor(parse: Parse, job: BasePayload["jobs"]) {
    this.parse = parse;
    this.job = job;
  }

  async handle({ body, provider }: HandleInput) {
    // biome-ignore lint/suspicious/noEqualsToNull: <sately skip>
    if (!provider || body == null) {
      throw new PaymentError(
        "PAYMENT_VERIFICATION_FAILED",
        "Invalid webhook input"
      );
    }

    const { orderReference } = this.parse({ body, provider });

    await this.job.queue({
      input: {
        orderReference,
        paymentProvider: provider,
      },
      workflow: "processPaymentWebhook",
    });
  }
}
