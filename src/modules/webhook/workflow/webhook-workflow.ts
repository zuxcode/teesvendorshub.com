import type { WorkflowConfig } from "payload";
import type { WorkflowProcessPaymentWebhook } from "@/payload-types";

export const processPaymentWebhook: WorkflowConfig<WorkflowProcessPaymentWebhook> =
  {
    concurrency: {
      exclusive: true,
      key: ({ input, queue }) => `${queue}:${input.input.orderReference}`,
      supersedes: true, // Only latest job runs
    },
    handler: ({ tasks, job }) => {
      tasks.verifyPayment();
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
