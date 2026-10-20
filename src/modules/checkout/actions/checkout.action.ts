"use server";

import { captureException } from "@sentry/nextjs";
import { redirect } from "next/navigation";
import { returnServerError, returnValidationErrors } from "next-safe-action";
import z from "zod";
import { OrderRepository } from "@/modules/order/repository/order.repository";
import { OrderItemRepository } from "@/modules/order/repository/order-item.repository";
import {
  PaymentError,
  paymentServerActionError,
} from "@/modules/payments/payment.errors";
import { PaymentRepository } from "@/modules/payments/payment.repository";
import { paymentService } from "@/modules/payments/payment.service";
import {
  ProductError,
  productServerActionError,
} from "@/modules/products/product.error";
import { productService } from "@/modules/products/product.service";
import { globalServerActionError } from "@/shared/errors/global-errors";
import { payload } from "@/shared/payload/utils/payload";
import { authenticatedActionClient } from "@/shared/utils/server-action";
import { type CheckoutResult, CheckoutService } from "../checkout.service";
import {
  createDigitalCheckoutSchema,
  createPhysicalCheckoutSchema,
} from "../lib/check-out-schema";

export const checkOutAction = authenticatedActionClient
  .inputSchema(createDigitalCheckoutSchema)
  .action(async ({ parsedInput, clientInput, ctx }) => {
    let result: CheckoutResult;

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

const orderItemRepository = new OrderItemRepository(payload);
const paymentRepository = new PaymentRepository(payload);
const orderRepository = new OrderRepository(payload);

const checkoutService = new CheckoutService(
  productService,
  orderRepository,
  paymentRepository,
  paymentService,
  orderItemRepository,
  payload.db
);
