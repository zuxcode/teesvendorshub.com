"use client";

import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCartItemCount, useCartItemIds } from "@/stores/cart-store";
import { CartItem } from "./cart-item";

export function CartSheet() {
  const cartItemCount = useCartItemCount();
  const cartItemIds = useCartItemIds();

  const cartCount = cartItemCount > 99 ? "99+" : cartItemCount;

  const IsCartEmpty = cartItemCount <= 0;

  return (
    <Sheet>
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

      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>

          <SheetDescription>
            Review your items before checkout.
          </SheetDescription>
        </SheetHeader>

        {IsCartEmpty && (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <ShoppingCart className="mx-auto mb-3 size-10 text-muted-foreground" />

              <p className="font-medium">Your cart is empty</p>

              <p className="mt-1 text-muted-foreground text-sm">
                Add some products to get started.
              </p>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6">
          {cartItemIds.map((productId) => (
            <CartItem key={productId} productId={productId} />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
