import { useGiftById } from "@/modules/gift/store/gift-store";
import { useProduct } from "@/modules/products/stores/product-store";
import { getRelationshipId } from "@/shared/utils/get-relationship-id";
import { type CartItemIdentifier, useCartItem } from "../store/cart-store";

export const useLinkedItem = (identifier: CartItemIdentifier) => {
  const item = useCartItem(identifier);

  const gift = useGiftById(item?.id);
  const product = useProduct(item?.id);

  const getLinkedItem = () => {
    if (!item) {
      return;
    }

    switch (item.relationTo) {
      case "gift":
        return {
          ...gift,
          imageId: getRelationshipId(gift?.giftImage),
        };
      case "product":
        return { ...product, imageId: getRelationshipId(gift?.giftImage) };
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
