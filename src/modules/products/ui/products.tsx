"use client";

import {
  useProductActions,
  useProducts,
  useSelectedProduct,
  useSelectedProductId,
} from "@/modules/products/store/product-store";
import type { Product } from "@/payload-types";
import { ProductDialog } from "@/shared/ui/product/product-dialog";
import { ProductGrid } from "@/shared/ui/product/product-grid";
import { ProductStoreEmpty } from "./empty-product";

export function Products() {
  const products = useProducts();
  const selectedId = useSelectedProductId();
  const selectedData = useSelectedProduct();
  const { setSelectedProductId } = useProductActions();

  if (!products.length) {
    return <ProductStoreEmpty />;
  }

  return (
    <>
      <ProductGrid<Product>
        dataList={products}
        relationTo="product"
        selectedId={selectedId}
        setSelectedId={setSelectedProductId}
      />
      <ProductDialog data={selectedData} setSelectedId={setSelectedProductId} />
    </>
  );
}
