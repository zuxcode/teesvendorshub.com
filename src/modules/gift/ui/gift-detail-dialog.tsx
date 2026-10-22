/** biome-ignore-all lint/style/noNestedTernary: <Intentional> */
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
import { AddToCartButton } from "@/modules/cart/ui/add-to-cart";
import { useCategory } from "@/modules/category/stores/category-store";
import { useProductImage } from "@/modules/media/stores/product-image-store";
import { PRODUCT_STATUS } from "@/shared/constant";
import { formatCurrency } from "@/shared/utils/format-currency";
import { getRelationshipId } from "@/shared/utils/get-relationship-id";
import { useGiftActions, useSelectedGift } from "../store/gift-store";

export function GiftDetailDialog() {
  const selectedGift = useSelectedGift();
  const { setSelectedGiftId } = useGiftActions();

  const category = useCategory(getRelationshipId(selectedGift?.category));
  const productImage = useProductImage(
    getRelationshipId(selectedGift?.productImage)
  );

  const handleCloseDialog = useCallback(
    (open: boolean) => {
      if (!open) {
        setSelectedGiftId(null);
      }
    },
    [setSelectedGiftId]
  );

  if (!selectedGift) {
    return null;
  }

  const categoryName = category?.name ?? "Uncategorized";
  const giftImageUrl = productImage?.sizes?.card?.url;
  const isOutOfStock = selectedGift.stock === 0;
  const isLowStock = selectedGift.stock > 0 && selectedGift.stock <= 10;
  const isActive = selectedGift.status === PRODUCT_STATUS.ACTIVE;
  const isPurchaseDisabled = !isActive || isOutOfStock;

  const availabilityLabel = isOutOfStock
    ? "Out of stock"
    : isLowStock
      ? "Low stock"
      : "In stock";

  return (
    <Dialog onOpenChange={handleCloseDialog} open>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{selectedGift.name}</DialogTitle>
          <DialogDescription>
            Gift details, pricing, and availability.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 sm:grid-cols-[220px_1fr]">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
            {giftImageUrl ? (
              <Image
                alt={productImage?.alt || selectedGift.name}
                className="object-cover"
                fill
                sizes="(max-width: 640px) 100vw, 220px"
                src={giftImageUrl}
              />
            ) : (
              <ImagePlaceholder />
            )}
          </div>

          <div className="space-y-5">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{categoryName}</Badge>

                <Badge variant={isActive ? "outline" : "secondary"}>
                  {selectedGift.status}
                </Badge>

                <Badge
                  variant={
                    isOutOfStock
                      ? "destructive"
                      : isLowStock
                        ? "outline"
                        : "secondary"
                  }
                >
                  {availabilityLabel}
                </Badge>
              </div>

              {selectedGift.description.trim() && (
                <p className="text-muted-foreground text-sm leading-6">
                  {selectedGift.description}
                </p>
              )}
            </div>

            <div className="rounded-xl border bg-muted/30 p-4">
              <h3 className="mb-4 font-semibold text-sm">Gift details</h3>

              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <div>
                  <dt className="text-muted-foreground text-xs">Category</dt>
                  <dd className="mt-1 font-medium">{categoryName}</dd>
                </div>

                <div>
                  <dt className="text-muted-foreground text-xs">
                    Availability
                  </dt>
                  <dd className="mt-1 font-medium">{availabilityLabel}</dd>
                </div>

                <div>
                  <dt className="text-muted-foreground text-xs">
                    Available quantity
                  </dt>
                  <dd className="mt-1 font-medium">{selectedGift.stock}</dd>
                </div>

                <div>
                  <dt className="text-muted-foreground text-xs">Currency</dt>
                  <dd className="mt-1 font-medium">{selectedGift.currency}</dd>
                </div>
              </dl>
            </div>

            <div className="flex items-center justify-between gap-4 border-t pt-5">
              <div>
                <p className="text-muted-foreground text-xs">Price</p>
                <p className="font-bold text-2xl tracking-tight">
                  {formatCurrency(selectedGift.priceKobo)}
                </p>
              </div>

              <AddToCartButton
                disabled={isPurchaseDisabled}
                id={selectedGift.id}
                relationTo="gift"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
