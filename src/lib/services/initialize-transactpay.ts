/** biome-ignore-all lint/style/useErrorCause: <Silent> */
import "server-only";

import { env } from "@/env";
import { TRANSACTPAY_BASE_URL } from "../config/app-config";
import { ErrorMessageMap } from "../errors/codes";
import { encryptForge } from "../secure/transactpay-encrypt";

interface InitializeTransactPayArgs {
  amount: number;
  description: string;
  email: string;
  fullName: string;
  phone: string;
  redirectUrl: string;
  reference: string;
}

interface TransactPayOrderResponse {
  data?: {
    order?: {
      reference: string;
      processorReference: string;
      amount: number;
      currency: string;
      statusId: number;
      status: string;
    };
  };
  message: string;
  status: string;
  statusCode: string;
}

export async function initializeTransactPay({
  amount,
  description,
  email,
  fullName,
  phone,
  reference,
  redirectUrl,
}: InitializeTransactPayArgs) {
  // biome-ignore lint/performance/useTopLevelRegex: split whitespace
  const [firstname, ...lastNameParts] = fullName.trim().split(/\s+/);
  const lastname = lastNameParts.join(" ") || firstname;

  const clientPayload = {
    customer: {
      country: "NG",
      email,
      firstname,
      lastname,
      mobile: phone,
    },
    order: {
      amount,
      currency: "NGN",
      description,
      reference,
    },
    payment: {
      RedirectUrl: redirectUrl,
    },
  };

  const encryptedData = encryptForge(
    clientPayload,
    env.TRANSACT_PAY_ENCRYPTION_KEY
  );

  let response: Response;

  try {
    response = await fetch(`${TRANSACTPAY_BASE_URL}/payment/order/create`, {
      body: JSON.stringify({
        data: encryptedData,
      }),
      headers: {
        accept: "application/json",
        "api-key": env.TRANSACT_PAY_API_KEY,
        "content-type": "application/json",
      },
      method: "POST",
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    throw new Error(ErrorMessageMap.PAYMENT_GATEWAY_ERROR);
  }

  let result: TransactPayOrderResponse | null = null;

  try {
    result = (await response.json()) as TransactPayOrderResponse;
  } catch {
    throw new Error(ErrorMessageMap.PAYMENT_GATEWAY_ERROR);
  }

  if (!response.ok || result.status !== "success") {
    throw new Error(result.message || ErrorMessageMap.PAYMENT_GATEWAY_ERROR);
  }

  const order = result.data?.order;

  if (!order) {
    throw new Error(ErrorMessageMap.PAYMENT_GATEWAY_ERROR);
  }

  return order;
}
