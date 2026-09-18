"use client";

import Image from "next/image";
import { formatCurrency } from "@/lib/format-currency";
import { getRelationshipId } from "@/lib/get-relationship-id";
import { getLineTotal } from "@/lib/products/inventory";
import type { DocumentId } from "@/lib/types";
import { useCartItemQuantity } from "@/stores/cart-store";
import { useProductImage } from "@/stores/product-image-store";
import { useProduct } from "@/stores/product-store";

export function CheckoutItem({ productId }: { productId: DocumentId }) {
  const product = useProduct(productId);
  const quantity = useCartItemQuantity(productId);

  const imageId = getRelationshipId(product?.productImage);
  const image = useProductImage(imageId);

  if (!product || quantity <= 0) {
    return null;
  }

  const lineTotal = getLineTotal(product.price, quantity);

  return (
    <div className="flex gap-4">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
        {image?.sizes?.card?.url ? (
          <Image
            alt={image.alt ?? product.name}
            className="object-cover"
            fill
            sizes="64px"
            src={image.sizes.card.url}
          />
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-1 font-medium text-sm">{product.name}</h3>

        <p className="mt-1 text-muted-foreground text-xs">
          {product.country} · Qty {quantity}
        </p>
      </div>

      <div className="shrink-0 text-right">
        <p className="font-medium text-sm">{formatCurrency(lineTotal)}</p>

        {quantity > 1 && (
          <p className="mt-1 text-muted-foreground text-xs">
            {formatCurrency(product.price)} each
          </p>
        )}
      </div>
    </div>
  );
}
