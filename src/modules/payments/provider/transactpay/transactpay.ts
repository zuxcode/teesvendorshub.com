import "server-only";

import { env } from "@/env";
import { TRANSACTPAY_BASE_URL } from "@/shared/config/app-config";

import { PaymentProviderError } from "../../payment.errors";
import type { PaymentAdaptor } from "../../payment.type";

import {
  getTransactPayErrorMessage,
  isCreateOrderResponse,
  isPaymentWebhookData,
  isRecord,
  isVerifyPaymentData,
  normalizePaymentStatus,
} from "./helper/helpers";

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
      body: JSON.stringify({
        data: encryptedData,
      }),

      headers: {
        accept: "application/json",
        "api-key": env.TRANSACT_PAY_API_KEY,
        "Content-Type": "application/json",
      },

      method: "POST",

      signal: AbortSignal.timeout(30_000),
    });

    if (!response.ok) {
      throw new PaymentProviderError(
        await getTransactPayErrorMessage(
          response,
          "TransactPay payment initialization failed."
        )
      );
    }

    const data: unknown = await response.json();

    if (!isCreateOrderResponse(data)) {
      throw new PaymentProviderError(
        "TransactPay returned an invalid payment initialization response."
      );
    }

    if (!(data.isSuccess && data.redirectUrl)) {
      throw new PaymentProviderError(
        data.message || "TransactPay failed to initialize payment."
      );
    }

    return {
      checkoutUrl: data.redirectUrl,
      reference: "",
    };
  },

  parseWebhook(input) {
    if (!isRecord(input)) {
      throw new PaymentProviderError("Invalid TransactPay webhook payload.");
    }

    if (input.status !== "success") {
      throw new PaymentProviderError(
        "TransactPay webhook indicates an unsuccessful payment."
      );
    }

    if (!isPaymentWebhookData(input.data)) {
      throw new PaymentProviderError(
        "TransactPay webhook is missing the order reference."
      );
    }

    return {
      orderReference: input.data.orderReference,
    };
  },

  async verifyPayment(reference) {
    const response = await fetch(
      `${TRANSACTPAY_BASE_URL}/payment/order/verify`,
      {
        body: JSON.stringify({
          reference,
        }),

        headers: {
          accept: "application/json",
          "api-key": env.TRANSACT_PAY_SECRET_KEY,
          "Content-Type": "application/json",
        },

        method: "POST",

        signal: AbortSignal.timeout(30_000),
      }
    );

    if (!response.ok) {
      throw new PaymentProviderError(
        await getTransactPayErrorMessage(
          response,
          "TransactPay payment verification failed."
        )
      );
    }

    const { data } = (await response.json()) as { data: unknown };

    if (!isRecord(data)) {
      throw new PaymentProviderError(
        "TransactPay returned an invalid payment verification response."
      );
    }

    if (!isVerifyPaymentData(data)) {
      console.log(data);

      throw new PaymentProviderError(
        "TransactPay returned an invalid payment verification response."
      );
    }

    return {
      amount: data.orderAmount,
      currency: data.currencyName,
      fee: data.fee,
      orderReference: data.orderReference,
      paymentReference: data.paymentReference,
      status: normalizePaymentStatus(data.status),
      totalAmountCharged: data.totalAmountCharged,
    };
  },
};
