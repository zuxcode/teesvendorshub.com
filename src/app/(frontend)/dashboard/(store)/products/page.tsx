import { Suspense } from "react";
import { ProductDetailDialog } from "@/modules/products/ui/product-detail-dialog";
import { ProductGridSkeleton } from "@/modules/products/ui/product-grid-skeleton";
import { ProductsContent } from "@/modules/products/ui/products-content";

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <ProductsContent />
      <ProductDetailDialog />
    </Suspense>
  );
}
