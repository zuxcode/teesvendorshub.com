import "server-only";

import {
  PAYMENT_PROVIDER_NAME,
  type PaymentProviderName,
} from "../payment.constants";
import { PaymentProviderUnsupportedError } from "../payment.errors";
import type {
  PaymentInitializeInput,
  PaymentInitializeResult,
} from "../payment.type";
import { transactPayAdaptor } from "./transactpay/transactpay";

export interface InitializeParam extends PaymentInitializeInput {
  provider: PaymentProviderName;
}

export interface PaymentRegistry {
  initialize: (input: InitializeParam) => Promise<PaymentInitializeResult>;
}

export const paymentRegistry: PaymentRegistry = {
  initialize({ provider, ...input }) {
    if (provider === PAYMENT_PROVIDER_NAME.TRANSACTPAY) {
      return transactPayAdaptor.initialize(input);
    }

    throw new PaymentProviderUnsupportedError();
  },
};
