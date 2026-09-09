"use client";

import { useSimCardIds } from "@/stores/sim-card-store";

export function ProductCountDisplay() {
  const simCards = useSimCardIds();
  return (
    <div className="mb-4 flex items-center justify-between">
      <p className="text-muted-foreground text-sm">
        Showing{" "}
        <span className="font-medium text-foreground">{simCards.length}</span>{" "}
        {simCards.length === 1 ? "product" : "products"}
      </p>
    </div>
  );
}
