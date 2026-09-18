import type { FieldHook } from "payload";
import type { Inventory } from "@/payload-types";

export const syncProductQuantitySnapshot: FieldHook<Inventory> = async ({
  operation,
  req,
  value,
}) => {
  if (operation !== "create" || value === null) {
    return value;
  }

  const { payload } = req;

  const productId =
    typeof req.data?.product === "object"
      ? req.data.product.id
      : req.data?.product;

  if (!productId) {
    return value;
  }

  await payload.update({
    collection: "products",
    data: {
      stock: value,
    },
    id: productId,
    req,
  });

  return value;
};
