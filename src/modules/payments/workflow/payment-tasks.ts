import type { Field, TaskConfig, WorkflowConfig } from "payload";
import { ORDER_STATUS } from "@/modules/order/order.constants";
import { OrderFulfillmentService } from "@/modules/order/service/order-fulfillment.service";
import { OrderValidationService } from "@/modules/order/service/order-validation.service";
import { PAYMENT_STATUS } from "@/modules/payments/payment.constants";
import type {
  TaskDeliverOrder,
  TaskValidateOrder,
  TaskVerifyPayment,
  WorkflowProcessPaymentWebhook,
} from "@/payload-types";
import { PaymentVerificationService } from "../service/payment-verification.service";

type WorkflowProcessPaymentWebhookInput =
  WorkflowProcessPaymentWebhook["input"];

const paymentResultFields: Field[] = [
  {
    name: "status",
    options: [
      { label: "Failed", value: PAYMENT_STATUS.FAILED },
      { label: "Refunded", value: PAYMENT_STATUS.REFUNDED },
      { label: "Successful", value: PAYMENT_STATUS.SUCCESSFUL },
      { label: "Pending", value: PAYMENT_STATUS.PENDING },
    ],
    required: true,
    type: "select",
  },
  {
    name: "order",
    relationTo: "orders",
    required: true,
    type: "relationship",
  },
];

const orderResultFields: Field[] = [
  {
    name: "status",
    options: [
      { label: "Processing", value: ORDER_STATUS.PROCESSING },
      { label: "Completed", value: ORDER_STATUS.COMPLETED },
      { label: "Pending", value: ORDER_STATUS.PENDING },
      { label: "Cancelled", value: ORDER_STATUS.CANCELLED },
      { label: "Refunded", value: ORDER_STATUS.REFUNDED },
    ],
    required: true,
    type: "select",
  },
  {
    name: "orderId",
    required: true,
    type: "text",
  },
];

export const verifyPayment: TaskConfig<TaskVerifyPayment> = {
  handler: PaymentVerificationService.verifyPayment,
  inputSchema: [
    { name: "paymentProvider", required: true, type: "text" },
    { name: "orderReference", required: true, type: "text" },
  ],
  outputSchema: paymentResultFields,
  slug: "verifyPayment",
};

export const validateOrder: TaskConfig<TaskValidateOrder> = {
  handler: OrderValidationService.validateOrder,
  inputSchema: paymentResultFields,
  outputSchema: orderResultFields,
  slug: "validateOrder",
};

export const deliverOrder: TaskConfig<TaskDeliverOrder> = {
  handler: OrderFulfillmentService.fulfillOrder,
  inputSchema: orderResultFields,
  outputSchema: orderResultFields,
  slug: "deliverOrder",
};

export const processPaymentWebhook: WorkflowConfig<WorkflowProcessPaymentWebhookInput> =
  {
    concurrency: {
      exclusive: true,
      key: ({ input, queue }) =>
        `${queue}:${input.paymentProvider}:${input.orderReference}`,
    },
    handler: async ({ job, tasks }) => {
      const paymentResult = await tasks.verifyPayment("verify-payment", {
        input: {
          orderReference: job.input.orderReference,
          paymentProvider: job.input.paymentProvider,
        },
      });

      if (paymentResult.status !== PAYMENT_STATUS.SUCCESSFUL) {
        return;
      }

      const orderResult = await tasks.validateOrder("validate-order", {
        input: paymentResult,
      });

      await tasks.deliverOrder("deliver-order", {
        input: orderResult,
      });
    },
    inputSchema: [
      { name: "paymentProvider", required: true, type: "text" },
      { name: "orderReference", required: true, type: "text" },
    ],
    label: "Process Payment Webhook",
    queue: "processPaymentQueue",
    retries: 10,
    slug: "processPaymentWebhook",
  };

export const paymentTasks = [
  verifyPayment,
  deliverOrder,
  validateOrder,
] as const;
