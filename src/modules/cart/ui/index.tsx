/**
 * biome-ignore-all lint/performance/noJsxPropsBind: JSX prop binding has no meaningful optimization benefit for these small event handlers.
 */

"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  useCartActions,
  useCartItemCount,
  useCartItems,
  useIsOpen,
} from "@/modules/cart/store/cart-store";
import { CartEmpty } from "./cart-empty";
import { CartItem } from "./cart-item";
import { CartSheetTrigger } from "./cart-sheet-trigger";

export function CartSheet() {
  const cartItemCount = useCartItemCount();
  const cartItems = useCartItems();
  const isOpen = useIsOpen();
  const { setIsOpen } = useCartActions();

  const isCartEmpty = cartItemCount <= 0;

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <CartSheetTrigger />

      <SheetContent className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="px-6 pt-6">
          <SheetTitle>Shopping Cart</SheetTitle>

          <SheetDescription>
            Review your items before checkout.
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-6">
          {isCartEmpty ? (
            <CartEmpty />
          ) : (
            cartItems.map((identifier) => (
              <CartItem {...identifier} key={identifier.id} />
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
