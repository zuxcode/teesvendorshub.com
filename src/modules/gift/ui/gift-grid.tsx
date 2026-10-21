"use client";

import { cn } from "@/lib/utils";
import { useGiftIds } from "../store/gift-store";
import { GiftCard } from "./grift-card";

export function GiftGrid() {
  const giftIds = useGiftIds();

  return (
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
          {giftIds.map((id) => (
            <GiftCard id={id} key={id} />
          ))}
        </div>
      </section>
    </div>
  );
}
