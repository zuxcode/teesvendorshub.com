import type { Currency } from "@/modules/order/order.constants";
import type {
  PaymentVerificationResult,
  PaymentWebhookData,
} from "@/modules/payments/payment.type";

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isCreateOrderResponse(
  value: unknown
): value is CreateOrderResponse {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.isSuccess === "boolean" &&
    typeof value.message === "string" &&
    typeof value.orderId === "number" &&
    typeof value.redirectUrl === "string"
  );
}

export function isPaymentWebhookData(
  value: unknown
): value is PaymentWebhookData {
  if (!isRecord(value)) {
    return false;
  }

  return typeof value.orderReference === "string";
}

export function isVerifyPaymentData(
  value: unknown
): value is VerifyPaymentData {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.fee === "number" &&
    typeof value.orderAmount === "number" &&
    typeof value.orderReference === "string" &&
    typeof value.paymentReference === "string" &&
    typeof value.totalAmountCharged === "number" &&
    typeof value.currencyName === "string" &&
    typeof value.status === "string"
  );
}

export function normalizePaymentStatus(
  status: string
): PaymentVerificationResult["status"] {
  switch (status.toLowerCase()) {
    case "successful":
      return "successful";

    case "failed":
      return "failed";

    default:
      return "pending";
  }
}

export async function getTransactPayErrorMessage(
  response: Response,
  fallback: string
): Promise<string> {
  try {
    const error: unknown = await response.json();

    if (isRecord(error) && typeof error.message === "string") {
      return `TransactPay failure: ${error.message}`;
    }
  } catch {
    // Ignore invalid error response body.
  }

  return fallback;
}

interface CreateOrderResponse {
  isSuccess: boolean;
  message: string;
  orderId: number;
  redirectUrl: string;
}

interface VerifyPaymentData {
  currencyName: Currency;
  fee: number;
  orderAmount: number;
  orderReference: string;
  paymentReference: string;
  status: string;
  totalAmountCharged: number;
}
