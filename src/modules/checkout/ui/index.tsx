"use client";

import { useHasCartItems } from "@/modules/cart/store/cart-store";

import { useShippingAddressVisibility } from "../hooks/use-shipping-address-visibility";
import { EmptyCheckout } from "./checkout-empty";
import { CheckoutForm } from "./checkout-form";

export function CheckOutContent() {
  const hasCartItem = useHasCartItems();
  const { requiresShippingAddress } = useShippingAddressVisibility();

  if (!hasCartItem) {
    return <EmptyCheckout />;
  }

  return (
    <CheckoutForm key={requiresShippingAddress ? "physical" : "digital"} />
  );
}
