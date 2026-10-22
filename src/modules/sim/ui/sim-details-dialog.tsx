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
import { getProductInventoryState } from "@/modules/products/libs/inventory";
import { PRODUCT_STATUS } from "@/shared/constant";
import { formatCurrency } from "@/shared/utils/format-currency";
import { getRelationshipId } from "@/shared/utils/get-relationship-id";
import { SIM_TYPE } from "../constant";
import { useCountry } from "../store/country-store";
import { useSelectedSim, useSimActions } from "../store/sim-store";

export function SimDetailsDialog() {
  const selectedSim = useSelectedSim();
  const { setSelectedSimId } = useSimActions();

  const image = useProductImage(getRelationshipId(selectedSim?.productImage));
  const country = useCountry(getRelationshipId(selectedSim?.country));
  const category = useCategory(getRelationshipId(selectedSim?.category));

  const handleCloseDialog = useCallback(
    (open: boolean) => {
      if (!open) {
        setSelectedSimId(null);
      }
    },
    [setSelectedSimId]
  );

  if (!selectedSim) {
    return null;
  }

  const inventoryState = getProductInventoryState(selectedSim.stock);
  const categoryName = category?.name ?? "Uncategorized";
  const isPurchaseDisabled =
    selectedSim.status !== PRODUCT_STATUS.ACTIVE || inventoryState.isOutOfStock;

  const simTypeLabel =
    selectedSim.simType === SIM_TYPE.ESIM ? "eSIM" : "Physical SIM";

  const availabilityLabel = inventoryState.isOutOfStock
    ? "Out of stock"
    : // biome-ignore lint/style/noNestedTernary: <intentional>
      inventoryState.isLowStock
      ? "Low stock"
      : "In stock";

  return (
    <Dialog onOpenChange={handleCloseDialog} open={Boolean(selectedSim)}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{selectedSim.name}</DialogTitle>
          <DialogDescription>
            Product information and SIM specifications.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 sm:grid-cols-[220px_1fr]">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
            {image?.sizes?.card?.url ? (
              <Image
                alt={image.alt || selectedSim.name}
                className="object-cover"
                fill
                sizes="(max-width: 640px) 100vw, 220px"
                src={image.sizes.card.url}
              />
            ) : (
              <ImagePlaceholder />
            )}
          </div>

          <div className="space-y-5">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{categoryName}</Badge>

                <Badge className="capitalize" variant="outline">
                  {simTypeLabel}
                </Badge>

                {selectedSim.badges?.map((badge) => (
                  <Badge className="capitalize" key={badge} variant="outline">
                    {badge.replaceAll("_", " ")}
                  </Badge>
                ))}

                {inventoryState.isOutOfStock ? (
                  <Badge variant="destructive">Out of stock</Badge>
                ) : null}

                {!inventoryState.isOutOfStock && inventoryState.isLowStock && (
                  <Badge className="bg-yellow-600 text-yellow-100">
                    Low stock
                  </Badge>
                )}

                {selectedSim.status !== PRODUCT_STATUS.ACTIVE && (
                  <Badge variant="secondary">{selectedSim.status}</Badge>
                )}
              </div>

              {selectedSim.description.trim() && (
                <p className="text-muted-foreground text-sm leading-6">
                  {selectedSim.description}
                </p>
              )}
            </div>

            <div className="rounded-xl border bg-muted/30 p-4">
              <h3 className="mb-4 font-semibold text-sm">Product details</h3>

              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <div>
                  <dt className="text-muted-foreground text-xs">Country</dt>
                  <dd className="mt-1 font-medium">
                    {country?.name ?? "Unavailable"}
                  </dd>
                </div>

                <div>
                  <dt className="text-muted-foreground text-xs">Category</dt>
                  <dd className="mt-1 font-medium">{categoryName}</dd>
                </div>

                <div>
                  <dt className="text-muted-foreground text-xs">SIM type</dt>
                  <dd className="mt-1 font-medium">{simTypeLabel}</dd>
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
                  <dd className="mt-1 font-medium">{selectedSim.stock}</dd>
                </div>

                <div>
                  <dt className="text-muted-foreground text-xs">Currency</dt>
                  <dd className="mt-1 font-medium">{selectedSim.currency}</dd>
                </div>
              </dl>
            </div>

            <div className="flex items-center justify-between gap-4 border-t pt-5">
              <div>
                <p className="text-muted-foreground text-xs">Price</p>
                <p className="font-bold text-2xl tracking-tight">
                  {formatCurrency(selectedSim.priceKobo)}
                </p>
              </div>

              <AddToCartButton
                disabled={isPurchaseDisabled}
                id={selectedSim.id}
                relationTo="sim"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
