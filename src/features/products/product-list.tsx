"use client";

import { useHasProducts, useProductStatus } from "@/stores/product-store";
import { ProductStoreEmpty } from "./empty-product";
import { ProductStoreError } from "./product-error";
import { ProductGrid } from "./product-grid";
import { ProductGridSkeleton } from "./product-grid-skeleton";

export function ProductListing() {
  const status = useProductStatus();
  const hasProduct = useHasProducts();

  if (status === "idle" || status === "loading") {
    return <ProductGridSkeleton />;
  }

  if (status === "error") {
    return <ProductStoreError />;
  }

  if (!hasProduct) {
    return <ProductStoreEmpty />;
  }

  return <ProductGrid />;
}
