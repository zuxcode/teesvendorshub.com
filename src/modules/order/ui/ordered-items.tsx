"use client";

import { useOrderItems } from "@/modules/order/store/order-store";
import { OrderedItemCard } from "./ordered-item-card";
import { OrderedItemsEmpty } from "./ordered-items-empty";

export function OrderedItems() {
  const items = useOrderItems();

  if (items.length === 0) {
    return <OrderedItemsEmpty />;
  }

  return (
    <section aria-label="Ordered items" className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-base">Items</h2>
        <span className="text-muted-foreground text-sm">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
        {items.map((item) => (
          <OrderedItemCard {...item} key={item.id} />
        ))}
      </div>
    </section>
  );
}
