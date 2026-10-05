"use server";

import { captureException } from "@sentry/nextjs";
import { redirect } from "next/navigation";
import { returnServerError, returnValidationErrors } from "next-safe-action";
import z from "zod";
import { orderRepository } from "@/modules/order/order.repository";
import {
  PaymentError,
  paymentServerActionError,
} from "@/modules/payments/payment.errors";
import { paymentRepository } from "@/modules/payments/payment.repository";
import { paymentService } from "@/modules/payments/payment.service";
import {
  ProductError,
  productServerActionError,
} from "@/modules/products/product.error";
import { productService } from "@/modules/products/product.service";
import { TransactionRepository } from "@/modules/transaction/transaction.repository";
import { globalServerActionError } from "@/shared/errors/global-errors";
import { payload } from "@/shared/payload/utils/payload";
import { authenticatedActionClient } from "@/shared/utils/server-action";
import { CheckoutService } from "../checkout.service";
import {
  createDigitalCheckoutSchema,
  createPhysicalCheckoutSchema,
} from "../lib/check-out-schema";

/**
 * CHECKOUT FLOW
 *
 * CHECKOUT
 *    │
 *    ├── Validate products
 *    ├── Validate current stock
 *    ├── Calculate total
 *    │
 *    ▼
 * BEGIN TRANSACTION
 *    │
 *    ├── Create order
 *    ├── Create order items
 *    ├── Create payment (pending)
 *    │
 *    ▼
 * COMMIT
 *    │
 *    ▼
 * INITIALIZE TRANSACTPAY
 *    │
 *    ▼
 * CUSTOMER PAYS
 *    │
 *    ▼
 * PAYMENT WEBHOOK
 *    │
 *    ├── Verify signature
 *    ├── Verify reference
 *    ├── Verify amount
 *    ├── Verify currency
 *    ├── Check idempotency
 *    │
 *    ▼
 * MARK PAYMENT SUCCESSFUL
 *    │
 *    ▼
 * createSaleMovement()
 *    │
 *    ▼
 * DECREMENT STOCK
 *    │
 *    ▼
 * CONFIRM ORDER
 *
 * SECURITY
 *
 * - Client provides intent; server determines truth.
 * - Product data and prices come from Payload.
 * - Stock is validated server-side.
 * - Order totals are calculated server-side.
 * - Payment amount comes from the server-calculated total.
 * - Customer redirect does not confirm payment.
 * - Webhook confirmation must be verified and idempotent.
 * - Inventory is decremented only after payment is verified.
 * - Payment verification performs the final stock check.
 * - Fulfillment occurs only after verified payment and successful inventory update.
 */

export const checkOutAction = authenticatedActionClient
  .inputSchema(createDigitalCheckoutSchema)
  .action(async ({ parsedInput, clientInput, ctx }) => {
    let result: Awaited<ReturnType<CheckoutService["checkout"]>>;

    try {
      result = await checkoutService.checkout({
        email: parsedInput.email,
        items: parsedInput.items,
        rawInput: clientInput,
        user: ctx.user,
      });
    } catch (error) {
      if (error instanceof ProductError) {
        return returnServerError(productServerActionError(error.code));
      }
      if (error instanceof PaymentError) {
        return returnServerError(
          paymentServerActionError(error.code, error.message)
        );
      }
      if (error instanceof z.ZodError) {
        // physical schema validation — treeify once, map once
        const treeified = z.treeifyError(error);
        const fields: Record<string, unknown> = {};

        if ("properties" in treeified && treeified.properties) {
          for (const [field, { errors }] of Object.entries(
            treeified.properties
          )) {
            fields[field] = { _errors: errors };
          }
        }
        return returnValidationErrors(createPhysicalCheckoutSchema, fields);
      }
      captureException(error, {
        tags: { actionName: "checkOutAction", type: "server action" },
      });
      return returnServerError(globalServerActionError("SERVER_ERROR"));
    }

    // redirect throws NEXT_REDIRECT — must stay outside the try/catch
    redirect(result.checkoutUrl);
  });

  
const transactionRepository = new TransactionRepository(payload);

const checkoutService = new CheckoutService(
  productService,
  orderRepository,
  paymentRepository,
  transactionRepository,
  paymentService,
  () => payload.db.beginTransaction(),
  (id) => payload.db.commitTransaction(id),
  (id) => payload.db.rollbackTransaction(id)
);
