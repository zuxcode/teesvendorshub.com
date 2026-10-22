/**
 * biome-ignore-all lint/performance/noJsxPropsBind: JSX prop binding has no meaningful optimization benefit for these small event handlers.
 */

"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { ImagePlaceholder } from "@/components/tees-ui/image-placeholder";
import { Button } from "@/components/ui/button";
import {
  type CartItemIdentifier,
  useCartActions,
  useCartItemQuantity,
} from "@/modules/cart/store/cart-store";
import { useProductImage } from "@/modules/media/stores/product-image-store";
import { getRelationshipId } from "@/shared/utils/get-relationship-id";
import { useLinkedItem } from "../hooks/use-link-item";

export function CartItem(identifier: CartItemIdentifier) {
  const { linkedItem } = useLinkedItem(identifier);
  const quantity = useCartItemQuantity(identifier);
  const image = useProductImage(getRelationshipId(linkedItem?.productImage));

  const { incrementItem, decrementItem, removeItem } = useCartActions();

  const imageUrl = image?.sizes?.card?.url;

  if (!linkedItem) {
    return null;
  }

  return (
    <div className="flex gap-4 border-b py-4">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-muted">
        {imageUrl ? (
          <Image
            alt={image.alt ?? linkedItem.name}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            fill
            src={imageUrl}
          />
        ) : (
          <ImagePlaceholder />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-medium">{linkedItem.name}</h3>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex h-8 items-center overflow-hidden rounded-md border">
            <Button
              className="size-8 rounded-none"
              onClick={() => decrementItem(identifier)}
              size="icon"
              type="button"
              variant="ghost"
            >
              <Minus className="size-3.5" />
              <span className="sr-only">Decrease quantity</span>
            </Button>

            <span className="min-w-8 text-center font-medium text-sm">
              {quantity}
            </span>

            <Button
              className="size-8 rounded-none"
              onClick={() => incrementItem(identifier)}
              size="icon"
              type="button"
              variant="ghost"
            >
              <Plus className="size-3.5" />
              <span className="sr-only">Increase quantity</span>
            </Button>
          </div>

          {/* Remove */}
          <Button
            className="size-8 text-muted-foreground hover:text-destructive"
            onClick={() => removeItem(identifier)}
            size="icon"
            type="button"
            variant="destructive"
          >
            <Trash2 className="size-4" />
            <span className="sr-only">Remove {linkedItem.name}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
