/** biome-ignore-all lint/performance/noJsxPropsBind: <Soft> */
"use client";

import { Minus, Plus, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { DocumentId } from "@/lib/types";
import { useCartActions, useCartItemQuantity } from "@/stores/cart-store";

interface AddToCartButtonProps {
  productId: DocumentId;
}

export function AddToCartButton({ productId }: AddToCartButtonProps) {
  const quantity = useCartItemQuantity(productId);

  const { addItem, incrementItem, decrementItem } = useCartActions();

  if (quantity === 0) {
    return (
      <Button className="gap-2" onClick={() => addItem(productId)} size="sm">
        <ShoppingCart className="size-4" />
        Add to cart
      </Button>
    );
  }

  return (
    <div className="flex h-9 items-center overflow-hidden rounded-md border">
      <Button
        aria-label="Decrease quantity"
        className="size-9 rounded-none"
        onClick={() => decrementItem(productId)}
        size="icon"
        type="button"
        variant="ghost"
      >
        <Minus className="size-4" />
      </Button>

      <span
        aria-live="polite"
        className="flex min-w-9 items-center justify-center px-2 font-medium text-sm"
      >
        {quantity}
      </span>

      <Button
        aria-label="Increase quantity"
        className="size-9 rounded-none"
        onClick={() => incrementItem(productId)}
        size="icon"
        type="button"
        variant="ghost"
      >
        <Plus className="size-4" />
      </Button>
    </div>
  );
}
