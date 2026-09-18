import { captureException } from "@sentry/nextjs";
import { payload } from "./payload";

export async function getSimCardsProduct() {
  try {
    return await payload.find({
      collection: "sim-cards",
      depth: 0,
      limit: 10_000,
    });
  } catch (error) {
    captureException(error, {
      tags: {
        collection: "sim-cards",
        operation: "getSimCardsProduct",
      },
    });

    throw error;
  }
}
