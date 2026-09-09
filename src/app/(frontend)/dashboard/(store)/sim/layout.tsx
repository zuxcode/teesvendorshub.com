import type { ReactNode } from "react";
import { SimCardProductHeader } from "@/features/sim-card/head";
import { ProductCountDisplay } from "@/features/sim-card/product-count-display";
import { SimCardHeaderFilter } from "@/features/sim-card/product-filter";
import { SimCardStoreHydrator } from "@/features/sim-card/sim-card-store-hydrator";
import { getSimCardsProduct } from "@/lib/services/get-sim-cards-product";

export default async function SimCardProductLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { docs } = await getSimCardsProduct();

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <SimCardProductHeader />
        <SimCardHeaderFilter />
      </div>
      <ProductCountDisplay />
      <SimCardStoreHydrator simCards={docs} />
      {children}
    </div>
  );
}
