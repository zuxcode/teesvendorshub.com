import { captureException } from "@sentry/nextjs";
import { payload } from "../../shared/payload/utils/payload";

export async function getProductImages() {
  try {
    return await payload.find({
      collection: "product-library",
      depth: 0,
      limit: 10_000,
    });
  } catch (error) {
    captureException(error, {
      tags: {
        collection: "product-library",
        operation: "getProductImages",
      },
    });

    throw error;
  }
}
