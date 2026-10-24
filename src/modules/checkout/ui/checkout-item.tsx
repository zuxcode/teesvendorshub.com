"use client";

import Image from "next/image";
import { ImagePlaceholder } from "@/components/tees-ui/image-placeholder";
import { useLinkedItem } from "@/modules/cart/hooks/use-link-item";
import {
  type CartItemIdentifier,
  useCartItemQuantity,
} from "@/modules/cart/store/cart-store";
import { useCategory } from "@/modules/category/stores/category-store";
import { useProductImage } from "@/modules/media/stores/product-image-store";
import { getLineTotal } from "@/modules/products/libs/inventory";
import { formatCurrency } from "@/shared/utils/format-currency";
import { getRelationshipId } from "@/shared/utils/get-relationship-id";

export function CheckoutItem(identifier: CartItemIdentifier) {
  const { linkedItem } = useLinkedItem(identifier);
  const quantity = useCartItemQuantity(identifier);

  const image = useProductImage(getRelationshipId(linkedItem?.productImage));
  const category = useCategory(getRelationshipId(linkedItem?.category));

  if (!linkedItem || quantity <= 0) {
    return null;
  }

  const lineTotal = getLineTotal(linkedItem.priceKobo, quantity);
  const imageUrl = image?.sizes?.card?.url;

  return (
    <div className="flex gap-4">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
        {imageUrl ? (
          <Image
            alt={image.alt ?? linkedItem.name}
            className="object-cover"
            fill
            sizes="64px"
            src={imageUrl}
          />
        ) : (
          <ImagePlaceholder />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-1 font-medium text-sm">{linkedItem.name}</h3>

        <p className="mt-1 text-muted-foreground text-xs">
          {category?.name ? `${category.name} · ` : ""}
          Qty {quantity}
        </p>
      </div>

      <div className="shrink-0 text-right">
        <p className="font-medium text-sm">{formatCurrency(lineTotal)}</p>

        {quantity > 1 && (
          <p className="mt-1 text-muted-foreground text-xs">
            {formatCurrency(linkedItem.priceKobo)} each
          </p>
        )}
      </div>
    </div>
  );
}
