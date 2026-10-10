import type { ResourceId } from "@/shared/types";
import type { PaymentProviderName } from "../payments/payment.constants";

export interface HandleInput {
  body: unknown;
  provider: PaymentProviderName;
}

export interface ParsedData {
  orderReference: string;
}

export interface EnqueueParams extends Pick<HandleInput, "provider"> {
  orderReference: string;
  paymentId: ResourceId;
}

export type Parse = (input: HandleInput) => ParsedData;
