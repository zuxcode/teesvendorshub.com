"use server";

import "server-only";

import { returnServerError } from "next-safe-action";
import { saleInventory } from "@/collections/inventory/service/sale-inventory";
import { ErrorMessageMap } from "@/lib/errors/codes";
import { generateUniqueReference } from "@/lib/generate-unique-ref";
import { authenticatedActionClient } from "@/lib/safe-action";
import { initializeTransactPay } from "@/lib/services/initialize-transactpay";
import { payload } from "@/lib/services/payload";
import type { DocumentId } from "@/lib/types";
import { createCheckoutSchema } from "../lib/check-out-schema";

/**
 * CHECKOUT FLOW
 *
 * CHECKOUT PAGE
 *      │
 *      ▼
 * SERVER ACTION
 *      │
 *      ├── Validate input
 *      ├── Authenticate
 *      ├── Load products
 *      ├── Validate products
 *      ├── Validate stock
 *      ├── Calculate total
 *      │
 *      ▼
 * BEGIN TRANSACTION
 *      │
 *      ├── Reserve stock
 *      ├── Create order
 *      ├── Create order items
 *      ├── Create payment
 *      │
 *      ▼
 * COMMIT
 *      │
 *      ▼
 * INITIALIZE TRANSACTPAY
 *      │
 *      ▼
 * RETURN PAYMENT URL
 *      │
 *      ▼
 * CUSTOMER → TRANSACTPAY
 *                  │
 *          ┌───────┴───────┐
 *          │               │
 *       RETURN          WEBHOOK
 *          │               │
 *          ▼               ▼
 *    SUCCESS PAGE    VERIFY SIGNATURE
 *                          │
 *                          ▼
 *                   VERIFY AMOUNT
 *                          │
 *                          ▼
 *                   VERIFY REFERENCE
 *                          │
 *                          ▼
 *                  IDEMPOTENCY CHECK
 *                          │
 *                          ▼
 *                    PAYMENT = PAID
 *                          │
 *                          ▼
 *                    ORDER = CONFIRMED
 *                          │
 *                          ▼
 *                      FULFILLMENT
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
 * - Fulfillment occurs only after verified payment.
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
    const products = await payload.find({
      collection: "products",
      depth: 0,
      limit: productIds.length,
      where: {
        id: {
          in: productIds,
        },
      },
    });

    const productsById = new Map(
      products.docs.map((product) => [String(product.id), product])
    );

    /**
     * Calculate the order entirely from server-side data.
     */
    const orderItems: OrderItem[] = [];

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
        return returnServerError(ErrorMessageMap.RESOURCE_NOT_FOUND);
      }

      if (product.stock < quantity) {
        return returnServerError(ErrorMessageMap.INSUFFICIENT_STOCK);
      }

      const lineTotal = product.price * quantity;

      orderItems.push({
        lineTotal,
        product: product.id,
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
     */
    const transactionID = await payload.db.beginTransaction();

    if (!transactionID) {
      return returnServerError(ErrorMessageMap.SERVER_ERROR);
    }

    try {
      /**
       * Create order.
       */
      const order = await payload.create({
        collection: "orders",

        data: {
          buyer: user.id,

          createdBy: user.id,

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

        req: {
          transactionID,
        },
      });

      /**
       * Create order items.
       *
       * These are snapshots of the purchased product at checkout time.
       */
      await Promise.all(
        orderItems.map(async (item) => {
          const product = productsById.get(String(item.product));

          if (!product) {
            return returnServerError(ErrorMessageMap.RESOURCE_NOT_FOUND);
          }

          await payload.create({
            collection: "order-items",

            data: {
              fulfillmentStatus: "pending",

              lineTotal: item.lineTotal,

              order: order.id,

              product: product.id,

              productImage: product.productImage,

              productName: product.name,

              productType: product.productType,

              quantity: item.quantity,

              unitPrice: item.unitPrice,
            },
            overrideAccess: true,

            req: {
              transactionID,
            },
          });
        })
      );

      /**
       * Create the logical payment.
       *
       * Gateway-specific transaction references belong to
       * payment-transactions, not payments.
       */
      await payload.create({
        collection: "payments",

        data: {
          amount: total,

          buyer: user.id,

          createdBy: user.id,

          currency: "NGN",

          order: order.id,

          paymentReference: orderNumber,

          provider: "transactpay",

          status: "pending",
        },

        req: {
          transactionID,
        },
      });

      /**
       * Inventory mutation belongs inside this transaction.
       *
       * This should be implemented with a concurrency-safe
       * reservation/decrement operation.
       */
      await saleInventory({
        createdBy: user.id,
        items: orderItems,
        reference: orderNumber,
        transactionID,
      });

      /**
       * Commit BEFORE making the external TransactPay request.
       */
      await payload.db.commitTransaction(transactionID);

      /**
       * Initialize TransactPay AFTER the database transaction commits.
       *
       * The payment amount and reference are server-generated.
       */

      const payment = await initializeTransactPay({
        amount: total,
        description: "purchase",
        email: parsedInput.email,
        fullName: parsedInput.fullName,
        phone: parsedInput.phone,
        redirectUrl: "",
        reference: orderNumber,
      });

      console.log("payload");

      /**
       * Return the payment URL to the checkout page.
       */
      return {
        orderId: order.id,
        orderNumber,
        paymentUrl: payment,
      };
    } catch (error) {
      await payload.db.rollbackTransaction(transactionID);

      throw error;
    }
  });

interface OrderItem {
  lineTotal: number;
  product: DocumentId;
  quantity: number;
  unitPrice: number;
}
