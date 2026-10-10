import type { PayloadLogger } from "payload";
import type { ResourceId } from "@/shared/types";
import { PAYMENT_STATUS } from "./payment.constants";
import {
  PaymentAmountMismatchError,
  PaymentStatusInvalidError,
} from "./payment.errors";
import type { PaymentRepository } from "./payment.repository";
import type { HandleWebhookInput } from "./payment.type";
import type { PaymentRegistry } from "./provider/provider.registry";

export class PaymentWebhookHandler {
  private readonly paymentRepository: PaymentRepository;
  private readonly registry: PaymentRegistry;
  private readonly logger: PayloadLogger;
  private readonly enqueueCompletePayment: (
    paymentId: ResourceId
  ) => Promise<void>;

  constructor(
    paymentRepository: PaymentRepository,
    registry: PaymentRegistry,
    logger: PayloadLogger,
    enqueueCompletePayment: (paymentId: ResourceId) => Promise<void>
  ) {
    this.enqueueCompletePayment = enqueueCompletePayment;
    this.registry = registry;
    this.paymentRepository = paymentRepository;
    this.logger = logger;
  }

  async handle(input: HandleWebhookInput): Promise<void> {
    const { orderReference } = this.registry.parseWebhook(input);

    const payment =
      await this.paymentRepository.findByOrderReference(orderReference);

    if (!payment) {
      // unknown reference — log, ack quietly, NO throw (retry storm)
      this.logger.info(`Unknown orderReference = ${orderReference} not found`);
      return;
    }

    if (payment.status !== PAYMENT_STATUS.PENDING) {
      return; // duplicate or terminal — ack quietly
    }

    const verification = await this.registry.verifyPayment(
      payment.provider,
      orderReference
    );

    if (
      verification.amount !== payment.amount ||
      verification.currency !== payment.currency
    ) {
      throw new PaymentAmountMismatchError(); // alert-worthy, but see below
    }

    if (verification.status === PAYMENT_STATUS.PENDING) {
      throw new PaymentStatusInvalidError(); // transient — 500, provider retries
    }

    if (verification.status === PAYMENT_STATUS.FAILED) {
      await this.paymentRepository.update(payment.id, {
        status: PAYMENT_STATUS.FAILED,
      });
      return;
    }

    if (verification.status === PAYMENT_STATUS.SUCCESSFUL) {
      // claim PENDING → PROCESSING (committed), then hand off
      await this.claimProcessing(payment.id);
      await this.enqueueCompletePayment(payment.id);
    }
  }
}
