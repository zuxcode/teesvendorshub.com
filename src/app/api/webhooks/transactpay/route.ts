/**
 *                          TransactPay
 *                               │
 *                               │ POST webhook
 *                               ▼
 *                   /api/webhooks/transactpay
 *                               │
 *                     ┌─────────┴─────────┐
 *                     │                   │
 *               Parse payload      Verify transaction
 *                     │             with TransactPay
 *                     │                   │
 *                     └─────────┬─────────┘
 *                               ▼
 *                    paymentService
 *                    .handleWebhook()
 *                               │
 *                  ┌────────────┼────────────┐
 *                  │            │            │
 *             Find payment   Validate     Validate
 *                            amount       currency
 *                  │            │            │
 *                  └────────────┼────────────┘
 *                               ▼
 *                       Check payment status
 *                               │
 *                     ┌─────────┴─────────┐
 *                     │                   │
 *                Already final          Pending
 *                     │                   │
 *                   Ignore          Mark successful
 *                                         │
 *                                         ▼
 *                               createSaleMovement()
 *                                         │
 *                                         ▼
 *                                   Confirm order
 */

import { captureException } from "@sentry/nextjs";
import { NextResponse } from "next/server";
import { PAYMENT_PROVIDER_NAME } from "@/modules/payments/payment.constants";
import { PaymentError } from "@/modules/payments/payment.errors";
import { webhookManger } from "@/modules/webhook";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ received: false }, { status: 400 });
  }

  const provider = PAYMENT_PROVIDER_NAME.TRANSACTPAY;

  try {
    await webhookManger.handle({
      body,
      provider,
    });
  } catch (error) {
    if (error instanceof PaymentError) {
      captureException(error, {
        tags: {
          actionName: "POST",
          flow: "Webhook",
          provider,
          type: "payment webhook",
        },
      });

      return NextResponse.json({ received: false }, { status: 400 });
    }

    captureException(error, {
      tags: {
        actionName: "POST",
        flow: "Webhook",
        provider,
        type: "payment webhook",
      },
    });

    return NextResponse.json({ received: false }, { status: 500 }); // transient → provider retries
  }
}
