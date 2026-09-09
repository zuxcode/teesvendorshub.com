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
import { useProductImageActions } from "@/stores/product-image-store";
import {
  useHasSelectedIdSimCard,
  useSimCardActions,
  useSimCardSelectedId,
} from "@/stores/sim-card-store";
import { AddToCartButton } from "../cart/add-to-cart";

export function SimCardProductDetailDialog() {
  const selectedProductId = useSimCardSelectedId();
  const hasSelectedProduct = useHasSelectedIdSimCard();
  const { setSelectedSimcardId, getSimCardById } = useSimCardActions();
  const { getImageById } = useProductImageActions();

  const handleCloseDialog = useCallback(
    (open: boolean) => {
      if (!open) {
        setSelectedSimcardId(null);
      }
    },
    [setSelectedSimcardId]
  );

  if (!selectedProductId) {
    return null;
  }
  const selectedProduct = getSimCardById(selectedProductId);

  const imageId =
    typeof selectedProduct?.productImage === "object"
      ? selectedProduct?.productImage.id
      : selectedProduct?.productImage;

  const image = imageId ? getImageById(imageId) : undefined;

  const SIM_TYPE = selectedProduct?.type.replace("_", " ");

  return (
    <Dialog onOpenChange={handleCloseDialog} open={hasSelectedProduct}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        {selectedProduct && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">
                {selectedProduct.name}
              </DialogTitle>

              <DialogDescription>
                Complete product information and specifications.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 sm:grid-cols-[220px_1fr]">
              <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
                {image?.sizes?.card?.url ? (
                  <Image
                    alt={image.alt}
                    className="object-cover"
                    fill
                    src={image.sizes?.card?.url}
                  />
                ) : (
                  <ImagePlaceholder />
                )}
              </div>

              <div className="space-y-5">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Badge className="capitalize">{SIM_TYPE}</Badge>
                    <Badge variant="secondary">{selectedProduct.country}</Badge>
                  </div>

                  <p className="text-muted-foreground text-sm leading-6">
                    {selectedProduct.description}
                  </p>
                </div>

                <div className="rounded-xl border bg-muted/30 p-4">
                  <h3 className="mb-3 font-semibold text-sm">
                    Product details
                  </h3>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Country</p>
                      <p className="mt-1 font-medium">
                        {selectedProduct.country}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground text-xs">SIM type</p>
                      <p className="mt-1 font-medium">{SIM_TYPE}</p>
                    </div>

                    <div>
                      <p className="text-muted-foreground text-xs">Network</p>
                      <p className="mt-1 font-medium">N/A</p>
                    </div>

                    <div>
                      <p className="text-muted-foreground text-xs">
                        Activation
                      </p>
                      <p className="mt-1 font-medium">Manual</p>
                    </div>

                    <div>
                      <p className="text-muted-foreground text-xs">Coverage</p>
                      <p className="mt-1 font-medium">N/A</p>
                    </div>

                    <div>
                      <p className="text-muted-foreground text-xs">price</p>
                      <p className="mt-1 font-semibold text-primary">
                        {formatCurrency(selectedProduct.price)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h3 className="mb-3 font-semibold text-sm">Features</h3>

                  <ul className="grid gap-2 text-sm sm:grid-cols-2">
                    <li className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-primary" />
                      Manual delivery
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-primary" />
                      Easy to setup
                    </li>
                  </ul>
                </div>

                <div className="flex items-center justify-between gap-4 border-t pt-5">
                  <div>
                    <p className="text-muted-foreground text-xs">Price</p>

                    <p className="font-bold text-2xl">
                      {formatCurrency(selectedProduct.price)}
                    </p>
                  </div>

                  <AddToCartButton productId={selectedProduct.id} />
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
