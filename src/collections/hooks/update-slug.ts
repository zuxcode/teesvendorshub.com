import { APIError, type FieldHook, type TypeWithID } from "payload";
import { slugify } from "payload/shared";

import { ErrorCode, ErrorMessageMap, ErrorStatusMap } from "@/lib/errors/codes";

type SourceField = "title" | (string & {});
type SlugField = "slug" | (string & {});

interface SlugHookOptions {
  slugField?: SlugField;
  sourceField?: SourceField;
}

export function updateSlugHook<T extends TypeWithID>({
  sourceField = "title",
  slugField = "slug",
}: SlugHookOptions = {}): FieldHook<T> {
  return ({ data, req, operation, originalDoc }) => {
    if (!req.user) {
      throw new APIError(
        ErrorMessageMap.AUTH_FORBIDDEN,
        ErrorStatusMap.AUTH_FORBIDDEN,
        { code: ErrorCode.AUTH_FORBIDDEN },
        true
      );
    }

    if (!data) {
      return data;
    }

    const sourceValue = data[sourceField as keyof typeof data];

    if (typeof sourceValue !== "string") {
      return data;
    }

    const source = sourceValue.trim();

    if (!source) {
      return data;
    }

    const currentSlug = data[slugField as keyof typeof data];

    if (operation === "create" && !currentSlug) {
      data[slugField as keyof typeof data] = slugify(source) as never;

      return data;
    }

    if (operation === "update") {
      const originalValue =
        originalDoc?.[sourceField as keyof typeof originalDoc];

      const sourceChanged = source !== originalValue;
      const slugMissing = !currentSlug;

      if (sourceChanged || slugMissing) {
        data[slugField as keyof typeof data] = slugify(source) as never;
      }
    }

    return data;
  };
}
