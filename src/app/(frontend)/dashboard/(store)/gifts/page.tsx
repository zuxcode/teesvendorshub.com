import { Suspense } from "react";
import { GiftDetailDialog } from "@/modules/gift/ui/gift-detail-dialog";
import { GiftGrid } from "@/modules/gift/ui/gift-grid";
import { GiftStoreHeader } from "@/modules/gift/ui/gift-header";
import { GiftServer } from "@/modules/gift/ui/gift-server";

export default function GiftStorePage() {
  return (
    <div>
      <GiftStoreHeader />
      <div className="page-container">
        <GiftGrid />
      </div>
      <GiftDetailDialog />
      <Suspense fallback={null}>
        <GiftServer />
      </Suspense>
    </div>
  );
}
