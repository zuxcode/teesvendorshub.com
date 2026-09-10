import { env } from "@/env";
import { TRANSACTPAY_BASE_URL } from "@/lib/config/app-config";
import { encryptForge } from "@/lib/secure/transactpay-encrypt";
import { payload } from "@/lib/services/payload";

export const GET = async (_request: Request) => {
  await payload.db.count({ collection: "media" });

  const data = {
    customer: {
      country: "NG",
      email: "email@transactpay.ai",
      firstname: "transact",
      lastname: "pay",
      mobile: "+2348134543421",
    },
    order: {
      amount: 100,
      currency: "NGN",
      description: "Pay",
      reference: "",
    },
    payment: {
      RedirectUrl: "https://www.hi.com",
    },
  };

  const encryptedData = encryptForge(data, env.TRANSACT_PAY_ENCRYPTION_KEY);

  console.log(encryptedData);

  const config = {
    body: encryptedData,

    headers: {
      "api-key": env.TRANSACT_PAY_API_KEY,
      "Content-Type": "application/json",
    },
    maxBodyLength: Number.POSITIVE_INFINITY,
    method: "post",
    // url: "https://payment-api-service.transactpay.ai/payment/order/create",
  } as RequestInit;

  const res = await fetch(
    `${TRANSACTPAY_BASE_URL}/payment/checkout/yourReference`,
    // `${TRANSACTPAY_BASE_URL}/payment/order/create`,
    config
  );

  const resJson = await res.json();

  console.log(resJson);

  return Response.json({
    message: resJson.message,
  });
};
