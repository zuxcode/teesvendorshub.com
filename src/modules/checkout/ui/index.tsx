"use client";

import { useHasCartItems } from "@/modules/checkout/store/cart-store";

import { useCartHasPhysicalProduct } from "../hooks/use-cart-has-physical-product";
import { EmptyCheckout } from "./checkout-empty";
import { CheckoutForm } from "./checkout-form";

export function CheckOutContent() {
  const hasCartItem = useHasCartItems();
  const { cartHasPhysicalProduct } = useCartHasPhysicalProduct();

  if (!hasCartItem) {
    return <EmptyCheckout />;
  }

  return <CheckoutForm key={cartHasPhysicalProduct ? "physical" : "digital"} />;
}
