import type { FieldHook, TypeWithID } from "payload";
import { slugify } from "@/lib/slugify";

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
  return ({ data, operation, originalDoc }) => {
    if (!data) {
      return;
    }

    const sourceValue = data[sourceField as keyof typeof data];

    if (typeof sourceValue !== "string") {
      return;
    }

    const source = sourceValue.trim();

    if (!source) {
      return;
    }

    const currentSlug = data[slugField as keyof typeof data];

    if (operation === "create" && !currentSlug) {
      data[slugField as keyof typeof data] = slugify(source) as never;
      return;
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
  };
}
