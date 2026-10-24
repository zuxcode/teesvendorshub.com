import { useCartItems } from "@/modules/cart/store/cart-store";
import { SIM_TYPE } from "@/modules/sim/constant";
import { useSimsById } from "@/modules/sim/store/sim-store";

export function useShippingAddressVisibility() {
  const cartItems = useCartItems();
  const simById = useSimsById();

  const hasGiftItem = cartItems.some((item) => item.relationTo === "gift");

  const hasPhysicalSim = cartItems.some((item) => {
    if (item.relationTo !== "sim") {
      return false;
    }

    return simById[item.id]?.simType === SIM_TYPE.PHYSICAL;
  });

  return {
    hasGiftItem,
    hasPhysicalSim,
    requiresShippingAddress: hasGiftItem || hasPhysicalSim,
  };
}
