/** biome-ignore-all lint/performance/noJsxPropsBind: <Surpress> */
"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { ImagePlaceholder } from "@/components/tees-ui/image-placeholder";
import { Button } from "@/components/ui/button";
import { getRelationshipId } from "@/lib/get-relationship-id";
import type { DocumentId } from "@/lib/types";
import { useCartActions, useCartItemQuantity } from "@/stores/cart-store";
import { useProductImageActions } from "@/stores/product-image-store";
import { useProduct } from "@/stores/product-store";

interface CartItemProps {
  productId: DocumentId;
}

export function CartItem({ productId }: CartItemProps) {
  const product = useProduct(productId);
  const quantity = useCartItemQuantity(productId);
  const { getImageById } = useProductImageActions();

  const imageId = getRelationshipId(product?.productImage);

  const { incrementItem, decrementItem, removeItem } = useCartActions();

  if (!product || quantity <= 0) {
    return null;
  }

  const image = imageId ? getImageById(imageId) : undefined;

  return (
    <div className="flex gap-4 border-b py-4">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-muted">
        {image?.sizes?.card?.url ? (
          <Image
            alt={image.alt ?? product.name}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            fill
            src={image?.sizes?.card?.url}
          />
        ) : (
          <ImagePlaceholder />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-medium">{product.name}</h3>

        {product.country ? (
          <p className="mt-1 text-muted-foreground text-sm">
            {product.country}
          </p>
        ) : null}

        <div className="mt-3 flex items-center justify-between gap-3">
          {/* Quantity */}
          <div className="flex h-8 items-center overflow-hidden rounded-md border">
            <Button
              className="size-8 rounded-none"
              onClick={() => decrementItem(productId)}
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
              onClick={() => incrementItem(productId)}
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
            onClick={() => removeItem(productId)}
            size="icon"
            type="button"
            variant="destructive"
          >
            <Trash2 className="size-4" />
            <span className="sr-only">Remove {product.name}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
