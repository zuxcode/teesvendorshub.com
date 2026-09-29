"use client";

import { ArrowRight, ShoppingCart } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  useCartActions,
  useCartItemCount,
  useCartItemIds,
  useIsOpen,
} from "@/modules/checkout/store/cart-store";

import { CartItem } from "./cart-item";

export function CartSheet() {
  const cartItemCount = useCartItemCount();
  const cartItemIds = useCartItemIds();
  const isOpen = useIsOpen();
  const { setIsOpen } = useCartActions();

  const cartCount = cartItemCount > 99 ? "99+" : cartItemCount;
  const isCartEmpty = cartItemCount <= 0;

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
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

      <SheetContent className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="px-6 pt-6">
          <SheetTitle>Shopping Cart</SheetTitle>

          <SheetDescription>
            Review your items before checkout.
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-6">
          {isCartEmpty ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="mx-auto mb-3 size-10 text-muted-foreground" />

                <p className="font-medium">Your cart is empty</p>

                <p className="mt-1 text-muted-foreground text-sm">
                  Add some products to get started.
                </p>
              </div>
            </div>
          ) : (
            cartItemIds.map((productId) => (
              <CartItem key={productId} productId={productId} />
            ))
          )}
        </div>

        <div className="shrink-0 border-t bg-background px-6 py-4">
          <Button
            className="w-full"
            disabled={isCartEmpty}
            render={
              isCartEmpty ? undefined : (
                <Link
                  className="flex place-items-center gap-1.5"
                  href="/dashboard/checkout"
                  // biome-ignore lint/performance/noJsxPropsBind: <surpress optimization>
                  onClick={() => setIsOpen(false)}
                />
              )
            }
            size="lg"
          >
            Checkout
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
