import { APIError, type FieldHook } from "payload";

import type { Category } from "@/payload-types";

import { getRelationshipId } from "@/shared/utils/get-relationship-id";

export const preventCategoryCycle: FieldHook<Category> = async ({
  data,
  originalDoc,
  req,
}) => {
  const categoryId = originalDoc?.id ?? data?.id;
  const parentId = data?.parent;

  if (!(parentId && categoryId)) {
    return parentId;
  }

  const parentIdValue = getRelationshipId(parentId);
  const categoryIdString = String(categoryId);
  const parentIdString = String(parentIdValue);

  if (parentIdString === categoryIdString) {
    throw new APIError("A category cannot be its own parent.");
  }

  const visited = new Set<string>();
  let currentParentId = parentIdValue;

  // Parent traversal is intentionally sequential because each
  // parent ID is obtained from the previously loaded category.
  while (currentParentId) {
    const currentParentIdString = String(currentParentId);

    if (visited.has(currentParentIdString)) {
      throw new APIError("Circular category relationship detected.");
    }

    visited.add(currentParentIdString);

    if (currentParentIdString === categoryIdString) {
      throw new APIError(
        "Invalid category hierarchy. A category cannot be an ancestor of itself."
      );
    }

    // biome-ignore lint/performance/noAwaitInLoops: <Supress known warning>
    const parentCategory = await req.payload.findByID({
      collection: "categories",
      depth: 0,
      id: currentParentId,
      overrideAccess: true,
      req,
    });

    currentParentId = parentCategory.parent
      ? getRelationshipId(parentCategory.parent)
      : null;
  }

  return parentId;
};
