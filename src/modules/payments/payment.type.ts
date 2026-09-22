import type { Currency } from "../order/order.constants";
import type {
  PaymentProviderName,
  PaymentVerificationStatus,
} from "./payment.constants";

export interface PaymentAdaptor {
  initialize: (
    input: PaymentInitializeInput
  ) => Promise<PaymentInitializeResult>;

  parseWebhook: (input: unknown) => PaymentWebhookData;

  verifyPayment: (reference: string) => Promise<PaymentVerificationResult>;
}

export interface HandleWebhookInput {
  body: unknown;
  provider: PaymentProviderName;
}

export interface PaymentInitializeInput {
  amount: number;
  currency: Currency;
  customerCountry: string;
  description: string;
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  redirectUrl: string;
  reference: string;
}

export interface PaymentInitializeResult {
  checkoutUrl: string;
  reference: string;
}

export interface PaymentWebhookData {
  orderReference: string;
}

export interface PaymentVerificationResult {
  amount: number;
  currency: Currency;
  fee: number;
  orderReference: string;
  paymentReference: string;
  status: PaymentVerificationStatus;
  totalAmountCharged: number;
}
