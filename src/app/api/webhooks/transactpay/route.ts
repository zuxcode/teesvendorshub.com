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

import { paymentService } from "@/modules/payments/payment.service";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();

    await paymentService.handleTransactPayWebhook(rawBody);

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
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
