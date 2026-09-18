import { getCategories } from "@/lib/services/get-categories";
import { getProduct } from "@/lib/services/get-product";
import { ProductListing } from "./product-list";
import { ProductsStoreBoundary } from "./products-store-boundary";

export async function ProductsContent() {
  const [{ docs: products }, { docs: categories }] = await Promise.all([
    getProduct(),
    getCategories(),
  ]);

  return (
    <ProductsStoreBoundary categories={categories} products={products}>
      <ProductListing />
    </ProductsStoreBoundary>
  );
}
