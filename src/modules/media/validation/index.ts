import type { Validate } from "payload";

import type { ProductLibrary } from "@/payload-types";

/**
 * Alt text is required for image uploads.
 *
 * Payload passes validator options as the second argument,
 * with the current document available through `data`.
 *
 * `mimeType` may be unavailable during partial updates,
 * so validation falls back gracefully.
 */
export const validateAltText: Validate<string, ProductLibrary> = (
  value,
  { data }
): true | string => {
  const mimeType = typeof data?.mimeType === "string" ? data.mimeType : "";

  const isImage = mimeType.startsWith("image/");

  if (typeof value !== "string") {
    if (isImage && (value === undefined || value === null)) {
      return "Alt text is required for image files (accessibility).";
    }

    if (value !== undefined && value !== null) {
      return "Alt text must be a string.";
    }

    return true;
  }

  const alt = value.trim();

  if (isImage && !alt) {
    return "Alt text is required for image files (accessibility).";
  }

  if (alt.length > 250) {
    return "Alt text must be 250 characters or less.";
  }

  return true;
};
