import { Suspense } from "react";

import { GiftStoreHeader } from "@/modules/gift/gift-header";
import { GiftDetailDialog } from "@/modules/gift/ui/gift-detail-dialog";
import { GiftGrid } from "@/modules/gift/ui/gift-grid";
import { GiftServer } from "@/modules/gift/ui/gift-server";

export default function GiftStorePage() {
  return (
    <div className="space-y-5">
      <GiftStoreHeader />
      <GiftGrid />
      <GiftDetailDialog />
      <Suspense fallback={null}>
        <GiftServer />
      </Suspense>
    </div>
  );
}
