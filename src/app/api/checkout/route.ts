// import { env } from "@/env";
// import { encryptForge } from "@/lib/secure/transactpay-encrypt";

import { API_ERRORS, errorResponse } from "@/lib/errors/api-error";
import { checkOutSchema } from "@/modules/checkout/lib/check-out-schema";

export const POST = async (request: Request) => {
  let jsonBody: unknown = null;

  try {
    jsonBody = await request.json();
  } catch {
    return errorResponse(API_ERRORS.INVALID_JSON_BODY);
  }

  const parsedBody = checkOutSchema.safeParse(jsonBody);

  if (!parsedBody.success) {
    return errorResponse(API_ERRORS.INVALID_REQUEST_BODY);
  }
};

/**
 * 
 
  const test = {
    customer: {
      country: "NG",
      email: "test@email.com",
      firstname: "Transact",
      lastname: "Pay",
      mobile: "09150691727",
    },
    order: {
      amount: 100,
      currency: "NGN",
      description: "Pay",
      reference: "yourReferencegaddw",
    },
    payment: {
      RedirectUrl: "https://www.yourredirecturl.com",
    },
  };

  const encryptedData = encryptForge(test, env.TRANSACT_PAY_ENCRYPTION_KEY);
  const config = {
    body: JSON.stringify({
      data: encryptedData,
    }),

    headers: {
      "api-key": env.TRANSACT_PAY_API_KEY,
      "Content-Type": "application/json",
    },
    maxBodyLength: Number.POSITIVE_INFINITY,
    method: "post",
    // url: "https://payment-api-service.transactpay.ai/payment/order/create",
  } as RequestInit;

  const res = await fetch(
    // `${TRANSACTPAY_BASE_URL}/payment/order/create`,
    "https://payment-api-service.transactpay.ai/payment/create",
    config
  );

  const resJson = await res.json();

  console.log(resJson);

  return Response.json({
    message: resJson.message,
  });
 */
