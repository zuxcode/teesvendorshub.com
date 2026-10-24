import { useGiftById } from "@/modules/gift/store/gift-store";
import { useProductById } from "@/modules/products/store/product-store";
import { useSimsById } from "@/modules/sim/store/sim-store";
import { useCartItems } from "../store/cart-store";

export const useTotalPrice = () => {
  const cartItems = useCartItems();
  const simsById = useSimsById();
  const giftsById = useGiftById();
  const productsById = useProductById();

  const total = cartItems.reduce((cumulativeTotal, item) => {
    let price = 0;

    switch (item.relationTo) {
      case "sim":
        price = simsById[item.id]?.priceKobo ?? 0;
        break;
      case "product":
        price = productsById[item.id]?.priceKobo ?? 0;
        break;
      case "gift":
        price = giftsById[item.id]?.priceKobo ?? 0;
        break;

      default:
        price = 0;
    }

    return cumulativeTotal + price * item.quantity;
  }, 0);

  return { total };
};
