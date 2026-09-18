import Sentry from "@sentry/nextjs";
import { payload } from "./payload";

export async function getCategories() {
  try {
    return await payload.find({
      collection: "categories",
      depth: 0,
      limit: 10_000,
    });
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        collection: "categories",
        operation: "getCategories",
      },
    });

    throw error;
  }
}
