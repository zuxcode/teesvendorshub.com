/** biome-ignore-all lint/performance/noJsxPropsBind: <Soft> */

"use client";

import { Minus, Plus, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { DocumentId } from "@/lib/types";

import {
  useCartActions,
  useCartItemQuantity,
} from "@/modules/checkout/store/cart-store";

interface AddToCartButtonProps {
  disabled?: boolean;
  productId: DocumentId;
}

export function AddToCartButton({
  productId,
  disabled = false,
}: AddToCartButtonProps) {
  const quantity = useCartItemQuantity(productId);

  const { addItem, incrementItem, decrementItem } = useCartActions();

  const handleAdd = () => {
    if (disabled) {
      return;
    }

    addItem(productId);
  };

  const handleIncrement = () => {
    if (disabled) {
      return;
    }

    incrementItem(productId);
  };

  const handleDecrement = () => {
    if (disabled) {
      return;
    }

    decrementItem(productId);
  };

  if (quantity === 0) {
    return (
      <Button
        className="gap-2"
        disabled={disabled}
        onClick={handleAdd}
        size="sm"
        type="button"
      >
        <ShoppingCart className="size-4" />
        Add to cart
      </Button>
    );
  }

  return (
    // biome-ignore lint/a11y/useSemanticElements: <Accessibility>
    <div
      aria-label="Cart quantity"
      className="flex h-9 items-center overflow-hidden rounded-md border"
      role="group"
    >
      <Button
        aria-label="Decrease quantity"
        className="size-9 rounded-none"
        disabled={disabled}
        onClick={handleDecrement}
        size="icon"
        type="button"
        variant="ghost"
      >
        <Minus className="size-4" />
      </Button>

      <span
        aria-atomic="true"
        aria-live="polite"
        className="flex min-w-9 items-center justify-center px-2 font-medium text-sm"
      >
        {quantity}
      </span>

      <Button
        aria-label="Increase quantity"
        className="size-9 rounded-none"
        disabled={disabled}
        onClick={handleIncrement}
        size="icon"
        type="button"
        variant="ghost"
      >
        <Plus className="size-4" />
      </Button>
    </div>
  );
}
