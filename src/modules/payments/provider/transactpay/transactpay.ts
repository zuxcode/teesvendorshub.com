import "server-only";

import { env } from "@/env";
import { TRANSACTPAY_BASE_URL } from "@/shared/config/app-config";
import { PaymentProviderError } from "../../payment.errors";
import type { PaymentAdaptor } from "../../payment.type";
import { encryptForge } from "./helper/transactpay-encrypt";

export const transactPayAdaptor: PaymentAdaptor = {
  async initialize(input) {
    const clientPayload = {
      customer: {
        country: input.customerCountry,
        email: input.email,
        firstname: input.firstname,
        lastname: input.lastname,
        mobile: input.phone,
      },
      order: {
        amount: input.amount,
        currency: input.currency,
        description: input.description,
        reference: input.reference,
      },
      payment: {
        RedirectUrl: input.redirectUrl,
      },
    };

    const encryptedData = encryptForge(
      clientPayload,
      env.TRANSACT_PAY_ENCRYPTION_KEY
    );

    const response = await fetch(`${TRANSACTPAY_BASE_URL}/payment/create`, {
      body: JSON.stringify({ data: encryptedData }),
      headers: {
        accept: "application/json",
        "api-key": env.TRANSACT_PAY_API_KEY,
        "Content-Type": "application/json",
      },
      method: "POST",
      signal: AbortSignal.timeout(30_000),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new PaymentProviderError(`TransactPay failure: ${error.message}.`);
    }

    const data = (await response.json()) as CreateOrderResponse;

    if (!(data.redirectUrl && data.orderId)) {
      throw new PaymentProviderError(
        "TransactPay returned an invalid payment response."
      );
    }

    return {
      checkoutUrl: data.redirectUrl,
      reference: input.reference,
    };
  },
};

interface CreateOrderResponse {
  isSuccess: boolean;
  message: string;
  orderId: number;
  redirectUrl: string;
}
