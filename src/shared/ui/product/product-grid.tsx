"use client";

import { ProductCard } from "./product-card";
import type { ProductCardData, ProductCardProps } from "./product-card.types";

interface ProductGridProps<T extends ProductCardData>
  extends Omit<ProductCardProps<T>, "data"> {
  dataList: T[];
}

export function ProductGrid<T extends ProductCardData>({
  dataList,
  relationTo,
  selectedId,
  setSelectedId,
}: ProductGridProps<T>) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {dataList.map((data) => (
        <ProductCard
          data={data}
          key={data.id}
          relationTo={relationTo}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
        />
      ))}
    </div>
  );
}
