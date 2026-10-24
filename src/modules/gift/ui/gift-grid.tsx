"use client";

import type { Gift } from "@/payload-types";
import { ProductGrid } from "@/shared/ui/product/product-grid";
import {
  useGiftActions,
  useGifts,
  useSelectedGiftId,
} from "../store/gift-store";

export function GiftGrid() {
  const giffs = useGifts();
  const selectedGiftId = useSelectedGiftId();
  const { setSelectedGiftId } = useGiftActions();

  return (
    <ProductGrid<Gift>
      dataList={giffs}
      relationTo="gift"
      selectedId={selectedGiftId}
      setSelectedId={setSelectedGiftId}
    />
  );
}
