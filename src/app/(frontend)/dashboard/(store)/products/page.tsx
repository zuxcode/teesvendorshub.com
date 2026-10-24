import { Suspense } from "react";
import { ProductGridSkeleton } from "@/modules/products/ui/product-grid-skeleton";
import { ProductStoreHeader } from "@/modules/products/ui/product-header";
import { Products } from "@/modules/products/ui/products";
import { ProductServer } from "@/modules/products/ui/products-server";

export default function ProductsPage() {
  return (
    <>
      <ProductStoreHeader />
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductServer />
      </Suspense>
      <div className="page-container">
        <Products />
      </div>
    </>
  );
}
