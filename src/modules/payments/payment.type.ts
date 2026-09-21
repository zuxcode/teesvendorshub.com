import type { Currency } from "../order/order.constants";

export interface PaymentAdaptor {
  initialize: (
    input: PaymentInitializeInput
  ) => Promise<PaymentInitializeResult>;
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

// export interface PaymentProviderVerifyResult {
//   amount: number;
//   currency: string;
//   reference: string;
//   status: "successful" | "failed" | "pending";
// }

// export interface PaymentProviderRefundInput {
//   amount: number;
//   reference: string;
// }

// export interface PaymentProviderRefundResult {
//   reference: string;
//   status: "successful" | "failed";
// }
