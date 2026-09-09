"use client";

import { EmptyFilter } from "@/features/sim-card/empty-filter";
import { EmptyProductStore } from "@/features/sim-card/empty-store";
import { SimCardProductCard } from "@/features/sim-card/simcard-product-card";
import { useFilteredSimCardIds, useHasSimCards } from "@/stores/sim-card-store";

export default function ProductsPage() {
  const hasSimCards = useHasSimCards();

  const productIds = useFilteredSimCardIds();

  if (!hasSimCards) {
    return <EmptyProductStore />;
  }

  if (productIds.length === 0) {
    return <EmptyFilter />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {productIds.map((productId) => (
        <SimCardProductCard key={productId} productId={productId} />
      ))}
    </div>
  );
}
