import "server-only";

import {
  PAYMENT_PROVIDER_NAME,
  type PaymentProviderName,
} from "../payment.constants";
import { PaymentProviderUnsupportedError } from "../payment.errors";
import type {
  HandleWebhookInput,
  PaymentInitializeInput,
  PaymentInitializeResult,
  PaymentVerificationResult,
  PaymentWebhookData,
} from "../payment.type";
import { transactPayAdaptor } from "./transactpay/transactpay";

export interface InitializeParam extends PaymentInitializeInput {
  provider: PaymentProviderName;
}

export interface PaymentRegistry {
  initialize: (input: InitializeParam) => Promise<PaymentInitializeResult>;
  parseWebhook: (input: HandleWebhookInput) => PaymentWebhookData;
  verifyPayment: (
    provider: PaymentProviderName,
    reference: string
  ) => Promise<PaymentVerificationResult>;
}

export const paymentRegistry: PaymentRegistry = {
  initialize({ provider, ...input }) {
    if (provider === PAYMENT_PROVIDER_NAME.TRANSACTPAY) {
      return transactPayAdaptor.initialize(input);
    }

    throw new PaymentProviderUnsupportedError();
  },

  parseWebhook({provider, body}) {
    if (provider === PAYMENT_PROVIDER_NAME.TRANSACTPAY) {
      return transactPayAdaptor.parseWebhook(body);
    }

    throw new PaymentProviderUnsupportedError();
  },

  verifyPayment(provider, reference) {
    if (provider === PAYMENT_PROVIDER_NAME.TRANSACTPAY) {
      return transactPayAdaptor.verifyPayment(reference);
    }

    throw new PaymentProviderUnsupportedError();
  },
};
