import Sentry from "@sentry/nextjs";
import { payload } from "../../shared/payload/utils/payload";

export async function getProduct() {
  try {
    return await payload.find({
      collection: "products",
      depth: 0,
      limit: 10_000,
    });
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        collection: "products",
        operation: "getProduct",
      },
    });

    throw error;
  }
}
