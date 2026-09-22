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
import { paymentService } from "@/modules/payments/payment.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    await paymentService.handleWebhook({
      body,
      provider: PAYMENT_PROVIDER_NAME.TRANSACTPAY,
    });

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.log(error);

    captureException(error, {
      tags: {
        actionName: "POST",
        flow: "Webhook",
        provider: "TransactPay",
        type: "payment webhook",
      },
    });

    return NextResponse.json({ received: false }, { status: 500 });
  }
}
