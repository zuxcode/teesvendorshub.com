"use client";

import { cn } from "@/lib/utils";
import { useProductIds } from "@/stores/product-store";
import { ProductCard } from "./product-card";

export function ProductGrid() {
  const productIds = useProductIds();

  return (
    <div>
      <div className="mb-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="font-bold text-3xl tracking-tight">Products</h1>

            <p className="mt-2 max-w-xl text-muted-foreground">
              Browse our collection and find the products that are right for
              you.
            </p>
          </div>
        </div>
      </div>

      <div className="grids gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <section>
          <div
            className={cn(
              "grid gap-4",
              "grid-cols-2",
              "md:grid-cols-3",
              "xl:grid-cols-4"
            )}
          >
            {productIds.map((id) => (
              <ProductCard id={id} key={id} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
