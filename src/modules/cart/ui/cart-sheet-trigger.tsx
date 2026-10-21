"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SheetTrigger } from "@/components/ui/sheet";
import { useCartItemCount } from "../store/cart-store";

export function CartSheetTrigger() {
  const cartItemCount = useCartItemCount();
  const cartCount = cartItemCount > 99 ? "99+" : cartItemCount;

  return (
    <SheetTrigger
      aria-label={
        cartItemCount > 0
          ? `Shopping cart, ${cartItemCount} items`
          : "Shopping cart"
      }
      render={<Button className="relative" size="icon" variant="ghost" />}
    >
      <ShoppingCart className="size-4" />

      {cartItemCount > 0 && (
        <span className="absolute top-0.5 right-0.5 flex min-w-4 items-center justify-center rounded-full bg-primary px-1 font-medium text-[10px] text-primary-foreground">
          {cartCount}
        </span>
      )}
    </SheetTrigger>
  );
}
