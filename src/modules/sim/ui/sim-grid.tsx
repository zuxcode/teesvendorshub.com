"use client";

import type { Sim } from "@/payload-types";
import { ProductGrid } from "@/shared/ui/product/product-grid";
import { useSelectedSimId, useSimActions, useSims } from "../store/sim-store";

export function SimGrid() {
  const sims = useSims();
  const selectedId = useSelectedSimId();
  const { setSelectedSimId } = useSimActions();

  return (
    <ProductGrid<Sim>
      dataList={sims}
      relationTo="sim"
      selectedId={selectedId}
      setSelectedId={setSelectedSimId}
    />
  );
}
