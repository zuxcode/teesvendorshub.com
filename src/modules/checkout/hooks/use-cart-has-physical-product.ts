import { useProductActions } from "@/modules/products/stores/product-store";
import { useCartItemIds } from "../store/cart-store";

/**
 * Physical products require a shipping address.
 * Digital products require an email address.
 *
 * The user's email address is used by default,
 * otherwise the provider email address is used.
 */
export function useCartHasPhysicalProduct() {
  const productIds = useCartItemIds();

  const { getProductById } = useProductActions();

  const cartHasPhysicalProduct = productIds.some((productId) => {
    const product = getProductById(productId);

    return product?.productType === "physical";
  });

  return {
    cartHasPhysicalProduct,
  };
}
