/** biome-ignore-all lint/performance/noJsxPropsBind: unnecessary optimization */

"use client";

import Image from "next/image";

import { ImagePlaceholder } from "@/components/tees-ui/image-placeholder";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format-currency";
import { getRelationshipId } from "@/lib/get-relationship-id";
import { getProductInventoryState } from "@/lib/products/inventory";
import type { DocumentId } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useCategory } from "@/stores/category-store";
import { useProductImage } from "@/stores/product-image-store";
import {
  useProduct,
  useProductActions,
  useSelectedProductId,
} from "@/stores/product-store";
import { AddToCartButton } from "../cart/add-to-cart";

interface ProductCardProps {
  id: DocumentId;
}

export function ProductCard({ id }: ProductCardProps) {
  const product = useProduct(id);
  const selectedProductId = useSelectedProductId();
  const { setSelectedProductId } = useProductActions();

  const isSelected = selectedProductId === id;

  const productImageId = getRelationshipId(product?.productImage);
  const productImage = useProductImage(productImageId);

  const categoryId = getRelationshipId(product?.category);
  const category = useCategory(categoryId);

  if (!product) {
    return null;
  }

  const inventoryState = getProductInventoryState(product.stock);

  const handleProductSelect = () => {
    setSelectedProductId(isSelected ? null : id);
  };

  const productImageUrl = productImage?.sizes?.card?.url;

  return (
    <Card
      className={cn(
        "group overflow-hidden border bg-background shadow-none transition-shadow hover:shadow-md",
        isSelected && "ring-2 ring-primary ring-offset-2"
      )}
    >
      <button
        aria-label={`View details for ${product.name}`}
        aria-pressed={isSelected}
        className="block w-full cursor-pointer text-left"
        onClick={handleProductSelect}
        type="button"
      >
        <div className="relative aspect-square overflow-hidden bg-muted">
          {productImageUrl ? (
            <Image
              alt={productImage?.alt || product.name}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              fill
              sizes="
                (max-width: 640px) 50vw,
                (max-width: 1024px) 33vw,
                25vw
              "
              src={productImageUrl}
            />
          ) : (
            <ImagePlaceholder />
          )}

          {/* Product badges */}
          {product.badges?.length ? (
            <div className="absolute top-3 left-3 flex max-w-[70%] flex-col items-start gap-2">
              {product.badges.map((badge) => (
                <Badge
                  className="capitalize shadow-sm"
                  key={badge}
                  variant="secondary"
                >
                  {badge.replaceAll("_", " ")}
                </Badge>
              ))}
            </div>
          ) : null}

          {inventoryState.isLowStock === true && (
            <Badge
              aria-label="Low stock"
              className="absolute top-3 right-3 bg-yellow-600 text-yellow-100 shadow-sm"
            >
              Low stock
            </Badge>
          )}
        </div>

        <CardContent className="space-y-2 p-4">
          <h2 className="line-clamp-1 font-semibold text-base tracking-tight">
            {product.name}
          </h2>

          {product.description ? (
            <p className="line-clamp-2 text-muted-foreground text-sm leading-5">
              {product.description}
            </p>
          ) : (
            <p className="text-muted-foreground text-sm">
              View product details
            </p>
          )}
        </CardContent>
      </button>

      {/* Product information / cart actions */}
      <CardFooter className="flex flex-col items-stretch gap-4 border-border/60 border-t p-4">
        {/* Category + stock status */}
        <div className="flex min-h-5 items-center justify-between gap-3 text-xs">
          {category ? (
            <span className="truncate font-medium text-muted-foreground">
              {category.name}
            </span>
          ) : (
            <span />
          )}

          {inventoryState.isOutOfStock === true && (
            <Badge className="shrink-0" variant="destructive">
              Out of stock
            </Badge>
          )}
        </div>

        {/* Price + cart */}
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <span className="text-muted-foreground text-xs">Price</span>

            <div className="font-bold text-lg tracking-tight">
              {formatCurrency(product.price)}
            </div>
          </div>

          <AddToCartButton
            disabled={inventoryState.isOutOfStock}
            productId={product.id}
          />
        </div>
      </CardFooter>
    </Card>
  );
}
