import { captureException } from "@sentry/nextjs";
import { NextResponse } from "next/server";

import { PAYMENT_PROVIDER_NAME } from "@/modules/payments/payment.constants";
import {
  PaymentError,
  PaymentErrorCode,
} from "@/modules/payments/payment.errors";
import { PaymentWebhookService } from "@/modules/payments/service/payment-webhook.service";
import { payload } from "@/shared/payload/utils/payload";

const provider = PAYMENT_PROVIDER_NAME.TRANSACTPAY;
const actionName = "POST";
const flow = "Webhook";
const type = "payment webhook";

const tags = {
  actionName,
  flow,
  provider,
  type,
};

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch (error) {
    captureException(error, {
      tags: {
        ...tags,
        reason: "invalid_json_body",
      },
    });

    return NextResponse.json({ received: true }, { status: 400 });
  }

  try {
    await PaymentWebhookService.handleWebhook(payload, {
      body,
      provider,
    });

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    captureException(error, {
      tags: {
        ...tags,
        errorCode: error instanceof PaymentError ? error.code : "UNKNOWN_ERROR",
      },
    });

    if (
      error instanceof PaymentError &&
      error.code === PaymentErrorCode.PAYMENT_NOT_FOUND
    ) {
      return NextResponse.json({ received: true }, { status: 400 });
    }

    return NextResponse.json({ received: true }, { status: 500 });
  }
}
