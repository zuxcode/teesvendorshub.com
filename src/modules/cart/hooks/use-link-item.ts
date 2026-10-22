import { useGiftById } from "@/modules/gift/store/gift-store";
import { useProduct } from "@/modules/products/store/product-store";
import { useSim } from "@/modules/sim/store/sim-store";
import { type CartItemIdentifier, useCartItem } from "../store/cart-store";

export const useLinkedItem = (identifier: CartItemIdentifier) => {
  const item = useCartItem(identifier);

  const gift = useGiftById(item?.id);
  const product = useProduct(item?.id);
  const sim = useSim(item?.id);

  const getLinkedItem = () => {
    if (!item) {
      return;
    }

    switch (item.relationTo) {
      case "gift":
        return gift;

      case "product":
        return product;

      case "sim":
        return sim;

      default:
        return;
    }
  };

  const linkedItem = getLinkedItem();

  return {
    item,
    linkedItem,
  };
};
