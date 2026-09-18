"use client";

import Image from "next/image";
import { useCallback } from "react";

import { ImagePlaceholder } from "@/components/tees-ui/image-placeholder";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { formatCurrency } from "@/lib/format-currency";
import { getRelationshipId } from "@/lib/get-relationship-id";
import { getProductInventoryState } from "@/lib/products/inventory";

import { useCategory } from "@/stores/category-store";
import { useProductImageActions } from "@/stores/product-image-store";
import {
  useHasSelectedProduct,
  useProductActions,
  useSelectedProduct,
} from "@/stores/product-store";

import { AddToCartButton } from "../cart/add-to-cart";

export function ProductDetailDialog() {
  const selectedProduct = useSelectedProduct();
  const hasSelectedProduct = useHasSelectedProduct();

  const { setSelectedProductId } = useProductActions();
  const { getImageById } = useProductImageActions();

  const categoryId = getRelationshipId(selectedProduct?.category);
  const category = useCategory(categoryId);

  const handleCloseDialog = useCallback(
    (open: boolean) => {
      if (!open) {
        setSelectedProductId(null);
      }
    },
    [setSelectedProductId]
  );

  if (!selectedProduct) {
    return null;
  }

  const imageId = getRelationshipId(selectedProduct.productImage);
  const image = imageId ? getImageById(imageId) : undefined;

  const inventoryState = getProductInventoryState(selectedProduct.stock);

  const productType = selectedProduct.productType
    ?.replaceAll("_", " ")
    .toLowerCase();

  const categoryName = category?.name ?? "Uncategorized";

  return (
    <Dialog onOpenChange={handleCloseDialog} open={hasSelectedProduct}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{selectedProduct.name}</DialogTitle>

          <DialogDescription>
            Complete product information and specifications.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 sm:grid-cols-[220px_1fr]">
          {/* Product image */}
          <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
            {image?.sizes?.card?.url ? (
              <Image
                alt={image.alt || selectedProduct.name}
                className="object-cover"
                fill
                sizes="220px"
                src={image.sizes.card.url}
              />
            ) : (
              <ImagePlaceholder />
            )}
          </div>

          {/* Product information */}
          <div className="space-y-5">
            {/* Summary */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{categoryName}</Badge>

                {productType && (
                  <Badge className="capitalize" variant="outline">
                    {productType}
                  </Badge>
                )}

                {inventoryState.isOutOfStock === true && (
                  <Badge variant="destructive">Out of stock</Badge>
                )}

                {inventoryState.isLowStock && !inventoryState.isOutOfStock && (
                  <Badge className="bg-yellow-600 text-yellow-100">
                    Low stock
                  </Badge>
                )}
              </div>

              {selectedProduct.description?.trim() && (
                <p className="text-muted-foreground text-sm leading-6">
                  {selectedProduct.description}
                </p>
              )}
            </div>

            {/* Product details */}
            <div className="rounded-xl border bg-muted/30 p-4">
              <h3 className="mb-4 font-semibold text-sm">Product details</h3>

              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                {selectedProduct.country?.trim() && (
                  <div>
                    <dt className="text-muted-foreground text-xs">Country</dt>

                    <dd className="mt-1 font-medium">
                      {selectedProduct.country}
                    </dd>
                  </div>
                )}

                <div>
                  <dt className="text-muted-foreground text-xs">Category</dt>

                  <dd className="mt-1 font-medium">{categoryName}</dd>
                </div>

                {productType && (
                  <div>
                    <dt className="text-muted-foreground text-xs">
                      Product type
                    </dt>

                    <dd className="mt-1 font-medium capitalize">
                      {productType}
                    </dd>
                  </div>
                )}

                <div>
                  <dt className="text-muted-foreground text-xs">
                    Availability
                  </dt>

                  <dd className="mt-1 font-medium">
                    {inventoryState.isOutOfStock
                      ? "Out of stock"
                      : // biome-ignore lint/style/noNestedTernary: <Reasonable>
                        inventoryState.isLowStock
                        ? "Low stock"
                        : "In stock"}
                  </dd>
                </div>

                <div>
                  <dt className="text-muted-foreground text-xs">Price</dt>

                  <dd className="mt-1 font-semibold text-primary">
                    {formatCurrency(selectedProduct.price)}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex items-center justify-between gap-4 pt-5">
              <div>
                <p className="text-muted-foreground text-xs">Price</p>

                <p className="font-bold text-2xl tracking-tight">
                  {formatCurrency(selectedProduct.price)}
                </p>
              </div>

              <AddToCartButton
                disabled={inventoryState.isOutOfStock}
                productId={selectedProduct.id}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
