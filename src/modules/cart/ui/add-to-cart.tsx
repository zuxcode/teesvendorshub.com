/**
 * biome-ignore-all lint/performance/noJsxPropsBind: JSX prop binding has no meaningful optimization benefit for these small event handlers.
 */

"use client";

import { Minus, Plus, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  type CartItemIdentifier,
  useCartActions,
  useCartItemQuantity,
} from "@/modules/cart/store/cart-store";

interface AddToCartButtonProps extends CartItemIdentifier {
  disabled?: boolean;
}

export function AddToCartButton({
  disabled = false,
  ...item
}: AddToCartButtonProps) {
  const quantity = useCartItemQuantity(item);
  const { addItem, incrementItem, decrementItem } = useCartActions();

  if (quantity === 0) {
    return (
      <Button
        className="gap-2"
        disabled={disabled}
        onClick={() => addItem(item)}
        size="sm"
        type="button"
      >
        <ShoppingCart className="size-4" />
        Add to cart
      </Button>
    );
  }

  return (
    <fieldset
      aria-label="Cart quantity"
      className="flex h-9 items-center overflow-hidden rounded-md border"
    >
      <Button
        aria-label="Decrease quantity"
        className="size-9 rounded-none"
        disabled={disabled}
        onClick={() => decrementItem(item)}
        size="icon"
        type="button"
        variant="ghost"
      >
        <Minus className="size-4" />
      </Button>

      <span className="flex min-w-9 items-center justify-center px-2 font-medium text-sm">
        {quantity}
      </span>

      <Button
        aria-label="Increase quantity"
        className="size-9 rounded-none"
        disabled={disabled}
        onClick={() => incrementItem(item)}
        size="icon"
        type="button"
        variant="ghost"
      >
        <Plus className="size-4" />
      </Button>
    </fieldset>
  );
}
