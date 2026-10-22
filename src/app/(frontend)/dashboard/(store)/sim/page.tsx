import { Suspense } from "react";
import { SimFilterPanelWrapper } from "@/modules/sim/ui/filters/sim-filter-panel-wrapper";
import { SimDetailsDialog } from "@/modules/sim/ui/sim-details-dialog";
import { SimGrid } from "@/modules/sim/ui/sim-grid";
import { SimStoreHeader } from "@/modules/sim/ui/sim-header";
import { Simserver } from "@/modules/sim/ui/sim-server";

export default async function ProductsPage() {
  return (
    <div>
      <SimStoreHeader />
      <div className="page-container">
        <SimFilterPanelWrapper />
        <SimGrid />
      </div>
      <SimDetailsDialog />
      <Suspense fallback={null}>
        <Simserver />
      </Suspense>
    </div>
  );
}
