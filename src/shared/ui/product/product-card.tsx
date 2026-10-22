/** biome-ignore-all lint/performance/noJsxPropsBind: unnecessary optimization */

"use client";

import Image from "next/image";

import { ImagePlaceholder } from "@/components/tees-ui/image-placeholder";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AddToCartButton } from "@/modules/cart/ui/add-to-cart";
import { useCategory } from "@/modules/category/stores/category-store";
import { useProductImage } from "@/modules/media/stores/product-image-store";
import { formatCurrency } from "@/shared/utils/format-currency";
import type { ProductCardData, ProductCardProps } from "./product-card.types";

export function ProductCard<T extends ProductCardData>({
  data,
  setSelectedId,
  selectedId,
  relationTo,
}: ProductCardProps<T>) {
  const isSelected = selectedId === data.id;

  const productImage = useProductImage(data.productImage as string);
  const category = useCategory(data.category as string);

  const imageUrl = productImage?.sizes?.card?.url;
  const isOutOfStock = data.stock <= 0;
  const isLowStock = !isOutOfStock && data.stock <= 10;

  const handleSimSelect = () => {
    setSelectedId(isSelected ? null : data.id);
  };

  return (
    <Card
      className={cn(
        "group overflow-hidden border bg-background shadow-none transition-shadow hover:shadow-md",
        isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-primary"
      )}
    >
      <button
        aria-label={`View details for ${data.name}`}
        aria-pressed={isSelected}
        className="block w-full cursor-pointer text-left"
        onClick={handleSimSelect}
        type="button"
      >
        <div className="relative h-44 w-96 overflow-hidden bg-muted">
          {imageUrl ? (
            <Image
              alt={productImage?.alt || data.name}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              src={imageUrl}
            />
          ) : (
            <ImagePlaceholder />
          )}

          {isLowStock ? (
            <Badge
              aria-label="Low stock"
              className="absolute top-3 right-3 bg-yellow-600 text-yellow-100 shadow-sm"
            >
              Low stock
            </Badge>
          ) : null}
        </div>

        <CardContent className="space-y-2 p-4">
          <h2 className="line-clamp-1 font-semibold text-base capitalize tracking-tight">
            {data.name}
          </h2>

          {data.description ? (
            <p className="line-clamp-2 text-muted-foreground text-sm leading-5">
              {data.description}
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
            <span className="truncate font-medium text-muted-foreground">
              {category.name}
            </span>
          ) : (
            <span />
          )}

          {isOutOfStock && (
            <Badge className="shrink-0" variant="destructive">
              Out of stock
            </Badge>
          )}

          {!isOutOfStock && (
            <Badge className="shrink-0" variant="secondary">
              {data.stock} in stock
            </Badge>
          )}
        </div>

        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <span className="text-muted-foreground text-xs">Price</span>
            <div className="font-bold text-lg tracking-tight">
              {formatCurrency(data.priceKobo)}
            </div>
          </div>

          <AddToCartButton
            disabled={data.status !== "active" || isOutOfStock}
            id={data.id}
            relationTo={relationTo}
          />
        </div>
      </CardFooter>
    </Card>
  );
}
