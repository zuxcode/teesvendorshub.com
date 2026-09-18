import { APIError, type CollectionBeforeDeleteHook } from "payload";

export const preventCategoryDelete: CollectionBeforeDeleteHook = async ({
  id,
  req,
}) => {
  const products = await req.payload.find({
    collection: "products",
    depth: 0,
    limit: 1,
    pagination: false,
    req,
    where: {
      category: {
        equals: id,
      },
    },
  });

  if (products.totalDocs > 0) {
    throw new APIError(
      "This category cannot be deleted because one or more products are assigned to it."
    );
  }

  // ------------------------------------------------------------
  // Prevent deletion when child categories exist
  // ------------------------------------------------------------

  const childCategories = await req.payload.find({
    collection: "categories",
    depth: 0,
    limit: 1,
    pagination: false,
    where: {
      parent: {
        equals: id,
      },
    },
  });

  if (childCategories.totalDocs > 0) {
    throw new APIError(
      "This category cannot be deleted because it has child categories."
    );
  }
};
