"use server";

import { captureException } from "@sentry/nextjs";
import { redirect } from "next/navigation";
import { returnServerError, returnValidationErrors } from "next-safe-action";
import z from "zod";
import { PAYMENT_PROVIDER_NAME } from "@/modules/payments/payment.constants";
import {
  PaymentError,
  paymentServerActionError,
} from "@/modules/payments/payment.errors";
import {
  ProductError,
  productServerActionError,
} from "@/modules/products/product.error";
import { globalServerActionError } from "@/shared/errors/global-errors";
import { authenticatedActionClient } from "@/shared/utils/server-action";
import {
  createDigitalCheckoutSchema,
  createPhysicalCheckoutSchema,
} from "../lib/check-out-schema";
import { checkoutService } from "../services/checkout";

export const checkOutAction = authenticatedActionClient
  .inputSchema(createDigitalCheckoutSchema)
  .action(async ({ parsedInput, clientInput, ctx }) => {
    let checkoutUrl: string;

    try {
      checkoutUrl = await checkoutService.checkout({
        email: parsedInput.email,
        items: parsedInput.items,
        provider: PAYMENT_PROVIDER_NAME.TRANSACTPAY,
        rawInput: clientInput,
        user: ctx.user,
      });
    } catch (error) {
      console.log(error);

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
    redirect(checkoutUrl);
  });
