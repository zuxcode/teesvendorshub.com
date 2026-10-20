import {
  PAYMENT_PROVIDER_NAME,
  type PaymentProviderName,
} from "../payment.constants";
import { PaymentProviderUnsupportedError } from "../payment.errors";
import type {
  HandleWebhookInput,
  PaymentInitializeInput,
} from "../payment.type";
import { transactPayAdaptor } from "./transactpay/transactpay";

export interface InitializeParam extends PaymentInitializeInput {
  provider: PaymentProviderName;
}

export const paymentRegistry = {
  initialize({ provider, ...input }: InitializeParam) {
    if (provider === PAYMENT_PROVIDER_NAME.TRANSACTPAY) {
      return transactPayAdaptor.initialize(input);
    }

    throw new PaymentProviderUnsupportedError();
  },

  parseWebhookInput({ provider, body }: HandleWebhookInput) {
    if (provider === PAYMENT_PROVIDER_NAME.TRANSACTPAY) {
      return transactPayAdaptor.parseWebhook(body);
    }

    throw new PaymentProviderUnsupportedError();
  },

  verifyPayment(provider: PaymentProviderName, reference: string) {
    if (provider === PAYMENT_PROVIDER_NAME.TRANSACTPAY) {
      return transactPayAdaptor.verifyPayment(reference);
    }

    throw new PaymentProviderUnsupportedError();
  },
};
