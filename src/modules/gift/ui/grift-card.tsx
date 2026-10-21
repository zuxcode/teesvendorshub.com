/** biome-ignore-all lint/performance/noJsxPropsBind: unnecessary optimization */

"use client";

import Image from "next/image";

import { ImagePlaceholder } from "@/components/tees-ui/image-placeholder";
import { Badge } from "@/components/ui/badge";
// import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AddToCartButton } from "@/modules/cart/add-to-cart";
// import { AddToCartButton } from "@/modules/cart/add-to-cart";
import { useCategory } from "@/modules/category/stores/category-store";
import { useProductImage } from "@/modules/media/stores/product-image-store";
import { formatCurrency } from "@/shared/utils/format-currency";
import { getRelationshipId } from "@/shared/utils/get-relationship-id";
import {
  useGiftActions,
  useGiftById,
  useSelectedGiftId,
} from "../store/gift-store";

interface GiftCardProps {
  id: string;
}

export function GiftCard({ id }: GiftCardProps) {
  const giftRecord = useGiftById(id);
  const selectedGiftId = useSelectedGiftId();
  const { setSelectedGiftId } = useGiftActions();

  const isSelected = selectedGiftId === id;

  const giftImage = useProductImage(getRelationshipId(giftRecord?.giftImage));
  const category = useCategory(getRelationshipId(giftRecord?.category));

  if (!giftRecord) {
    return null;
  }

  const handleGiftSelect = () => {
    setSelectedGiftId(isSelected ? null : id);
  };

  const giftImageUrl = giftImage?.sizes?.card?.url;
  const isOutOfStock = giftRecord.stock <= 0;
  const isLowStock = giftRecord.stock <= 10;

  return (
    <Card
      className={cn(
        "group overflow-hidden border bg-background shadow-none transition-shadow hover:shadow-md",
        isSelected && "ring-2 ring-primary ring-offset-2"
      )}
    >
      <button
        aria-label={`View details for ${giftRecord.name}`}
        aria-pressed={isSelected}
        className="block w-full cursor-pointer text-left"
        onClick={handleGiftSelect}
        type="button"
      >
        <div className="relative aspect-square overflow-hidden bg-muted">
          {giftImageUrl ? (
            <Image
              alt={giftImage?.alt || giftRecord.name}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              fill
              loading="eager"
              sizes="
                (max-width: 640px) 50vw,
                (max-width: 1024px) 33vw,
                25vw
              "
              src={giftImageUrl}
            />
          ) : (
            <ImagePlaceholder />
          )}

          {isLowStock === true && (
            <Badge
              aria-label="Low stock"
              className="absolute top-3 right-3 bg-yellow-600 text-yellow-100 shadow-sm"
            >
              Low stock
            </Badge>
          )}
        </div>

        <CardContent className="space-y-2 p-4">
          <h2 className="line-clamp-1 font-semibold text-base capitalize tracking-tight">
            {giftRecord.name}
          </h2>

          {giftRecord.description ? (
            <p className="line-clamp-2 text-muted-foreground text-sm capitalize leading-5">
              {giftRecord.description}
            </p>
          ) : (
            <p className="text-muted-foreground text-sm">
              View product details
            </p>
          )}
        </CardContent>
      </button>

      <CardFooter className="flex flex-col items-stretch gap-4 border-border/60 border-t p-4">
        <div className="flex min-h-5 items-center justify-between gap-3 text-xs">
          {category ? (
            <span className="truncate font-medium text-muted-foreground capitalize">
              {category.name}
            </span>
          ) : (
            <span />
          )}

          {isOutOfStock === true && (
            <Badge className="shrink-0" variant="destructive">
              Out of stock
            </Badge>
          )}

          <Badge className="shrink-0">{giftRecord.stock}</Badge>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <span className="text-muted-foreground text-xs">Price</span>

            <div className="font-bold text-lg tracking-tight">
              {formatCurrency(giftRecord.price)}
            </div>
          </div>

          <AddToCartButton
            disabled={giftRecord.status !== "active" || isOutOfStock}
            productId={giftRecord.id}
          />
        </div>
      </CardFooter>
    </Card>
  );
}
