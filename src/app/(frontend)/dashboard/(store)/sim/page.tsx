import { Suspense } from "react";
import { ProductDetailDialog } from "@/features/products/product-detail-dialog";
import { ProductGridSkeleton } from "@/features/products/product-grid-skeleton";
import { ProductsContent } from "@/features/products/products-content";

export default async function ProductsPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <ProductsContent />
      <ProductDetailDialog />
    </Suspense>
  );
}
