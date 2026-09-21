/** biome-ignore-all lint/complexity/noExcessiveCognitiveComplexity: <Silent complexity warning> */

"use server";

import { captureException } from "@sentry/nextjs";
import { redirect } from "next/navigation";
import { returnServerError } from "next-safe-action";
import { env } from "@/env";
import type { OrderFulfillmentStatus } from "@/modules/order/order.constants";
import { orderRepository } from "@/modules/order/order.repository";
import { PAYMENT_PROVIDER_NAME } from "@/modules/payments/payment.constants";
import {
  PaymentError,
  paymentServerActionError,
} from "@/modules/payments/payment.errors";
import { paymentRepository } from "@/modules/payments/payment.repository";
import { paymentService } from "@/modules/payments/payment.service";
import type { PaymentInitializeResult } from "@/modules/payments/payment.type";
import type { ProductType } from "@/modules/products/product.contants";
import {
  ProductError,
  productServerActionError,
} from "@/modules/products/product.error";
import { productService } from "@/modules/products/product.service";
import type { Order, Payment, Product, ProductLibrary } from "@/payload-types";
import { PAYMENT_CHECKOUT_REDIRECT_URL } from "@/shared/config/app-config";
import { globalServerActionError } from "@/shared/errors/global-errors";
import { payload } from "@/shared/payload/utils/payload";
import { generateUniqueReference } from "@/shared/utils/generate-unique-ref";
import { authenticatedActionClient } from "@/shared/utils/server-action";
import { createCheckoutSchema } from "../lib/check-out-schema";

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
  .inputSchema(createCheckoutSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { user } = ctx;

    /**
     * Aggregate quantities by product ID.
     *
     * This prevents a client from bypassing stock validation by
     * submitting the same product multiple times.
     */
    const quantities = new Map<string, number>();

    for (const item of parsedInput.items) {
      const productId = String(item.productId);

      quantities.set(
        productId,
        (quantities.get(productId) ?? 0) + item.quantity
      );
    }

    const productIds = [...quantities.keys()];

    /**
     * Load authoritative product data from Payload.
     */
    let products: Product[];

    try {
      products = await productService.findByIds(productIds);
    } catch (error) {
      if (error instanceof ProductError) {
        return returnServerError(productServerActionError(error.code));
      }

      captureException(error, {
        tags: {
          actionName: "checkOutAction",
          collection: "products",
          flow: "Read products by IDs",
          type: "server action",
        },
      });

      return returnServerError(globalServerActionError("SERVER_ERROR"));
    }

    const productsById = new Map(
      products.map((product) => [String(product.id), product])
    );

    /**
     * Calculate the order entirely from server-side data.
     */
    const orderItems: CheckoutOrderItem[] = [];

    let subtotal = 0;

    // Calculate server-side when shipping applies.
    const shippingAmount = 0;

    // Calculate server-side when discounts apply.
    const discountAmount = 0;

    // Calculate server-side when tax applies.
    const taxAmount = 0;

    for (const [productId, quantity] of quantities) {
      const product = productsById.get(productId);

      if (!product) {
        return returnServerError(productServerActionError("PRODUCT_NOT_FOUND"));
      }

      if (product.stock === 0) {
        return returnServerError(
          productServerActionError("PRODUCT_OUT_OF_STOCK")
        );
      }

      if (product.stock < quantity) {
        return returnServerError(
          productServerActionError("INSUFFICIENT_STOCK")
        );
      }

      const lineTotal = product.price * quantity;

      orderItems.push({
        fulfillmentStatus: "pending",
        lineTotal,
        product,
        productImage: product.productImage,
        productName: product.name,
        productType: product.productType,
        quantity,
        unitPrice: product.price,
      });

      subtotal += lineTotal;
    }

    const total = subtotal + shippingAmount + taxAmount - discountAmount;

    /**
     * Generate application-level identifiers.
     *
     * Payload's document ID remains separate from these identifiers.
     */
    const orderNumber = generateUniqueReference("ORD");

    /**
     * Begin the database transaction.
     *
     * No inventory movement is created here.
     *
     * Inventory is decremented only after payment has been
     * successfully verified.
     */
    const transactionID = await payload.db.beginTransaction();

    if (!transactionID) {
      captureException(new Error("Failed to begin database transaction"), {
        tags: {
          layer: "database",
          operation: "beginTransaction",
        },
      });

      return returnServerError(globalServerActionError("SERVER_ERROR"));
    }

    let order: Order;
    let payment: Payment;

    try {
      order = await orderRepository.create(
        {
          buyer: user.id,
          currency: "NGN",
          deliveryInstructions: parsedInput.deliveryInstructions,
          email: parsedInput.email,
          fulfillmentStatus: "pending",
          orderNumber,
          orderStatus: "pending",
          paymentStatus: "pending",
          phone: parsedInput.phone,
          shippingAddress: {
            addressLine1: parsedInput.addressLine1,
            addressLine2: parsedInput.addressLine2,
            city: parsedInput.city,
            country: parsedInput.country,
            fullName: parsedInput.fullName,
            postalCode: parsedInput.postalCode,
            state: parsedInput.state,
          },
          shippingAmount,
          subtotal,
          taxAmount,
          total,
        },
        transactionID
      );

      /**
       * Create order items.
       *
       * These are snapshots of the purchased product at checkout time.
       */
      for (const item of orderItems) {
        // biome-ignore lint/performance/noAwaitInLoops: <Sequential writes are intentional>
        await orderRepository.createOrderItem(
          {
            fulfillmentStatus: item.fulfillmentStatus,
            lineTotal: item.lineTotal,
            order: order.id,
            product: item.product.id,
            productImage: item.productImage,
            productName: item.productName,
            productType: item.productType,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          },
          transactionID
        );
      }

      payment = await paymentRepository.create(
        {
          amount: total,
          buyer: user.id,
          currency: "NGN",
          order: order.id,
          paymentReference: orderNumber,
          provider: PAYMENT_PROVIDER_NAME.TRANSACTPAY,
          status: "pending",
        },
        transactionID
      );

      await payload.db.commitTransaction(transactionID);
    } catch (error) {
      await payload.db.rollbackTransaction(transactionID);

      captureException(error, {
        tags: {
          actionName: "checkOutAction",
          flow: "Create checkout transaction",
          type: "server action",
        },
      });

      return returnServerError(globalServerActionError("SERVER_ERROR"));
    }

    /**
     * Initialize the external payment provider only after
     * the database transaction has committed.
     */
    let result: PaymentInitializeResult;
    try {
      const [firstname, ...lastNameParts] = parsedInput.fullName
        .trim()
        // biome-ignore lint/performance/useTopLevelRegex: <Silent regex error>
        .split(/\s+/);

      const lastname = lastNameParts.join(" ") || firstname;

      result = await paymentService.initializePayment({
        input: {
          amount: total,
          currency: "NGN",
          customerCountry: parsedInput.country,
          description: "purchase",
          email: parsedInput.email,
          firstname,
          lastname,
          phone: parsedInput.phone,
          redirectUrl: new URL(
            PAYMENT_CHECKOUT_REDIRECT_URL,
            env.NEXT_PUBLIC_APP_URL
          ).toString(),
          reference: orderNumber,
        },
        paymentId: payment.id,
      });
    } catch (error) {
      if (error instanceof PaymentError) {
        return returnServerError(paymentServerActionError(error.code));
      }

      console.log(error);

      /**
       * The transaction has already committed.
       *
       * Do not attempt to roll it back.
       * The payment remains pending and can be retried/reconciled.
       */
      captureException(error, {
        tags: {
          actionName: "checkOutAction",
          flow: "Initialize payment",
          type: "server action",
        },
      });

      return returnServerError(globalServerActionError("SERVER_ERROR"));
    }

    redirect(result.checkoutUrl);
  });

interface CheckoutOrderItem {
  fulfillmentStatus: OrderFulfillmentStatus;
  lineTotal: number;
  product: Product;
  productImage: number | ProductLibrary;
  productName: string;
  productType: ProductType;
  quantity: number;
  unitPrice: number;
}
