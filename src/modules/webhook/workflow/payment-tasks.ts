import type { TaskConfig } from "payload";
import type { TaskDeliverProduct, TaskVerifyPayment } from "@/payload-types";
import { PaymentWebhookWorkflow } from "../payment-webhook-workflow";

const paymentWebhookWorkflow = new PaymentWebhookWorkflow();

export const verifyPayment: TaskConfig<TaskVerifyPayment> = {
  handler: paymentWebhookWorkflow.verifyPayment,
  inputSchema: [
    { name: "paymentProvider", required: true, type: "text" },
    { name: "orderReference", required: true, type: "text" },
  ],
  outputSchema: [
    { name: "success", required: true, type: "checkbox" },
    {
      name: "payment",
      relationTo: "payments",
      required: true,
      type: "relationship",
    },
  ],
  slug: "verifyPayment",
};

export const deliverProduct: TaskConfig<TaskDeliverProduct> = {
  handler: paymentWebhookWorkflow.deliverProduct,
  inputSchema: [
    {
      name: "payment",
      relationTo: "payments",
      required: true,
      type: "relationship",
    },
  ],
  outputSchema: [{ name: "success", required: true, type: "checkbox" }],
  slug: "deliverProduct",
};
