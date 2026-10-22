import { PackageCheck, ShieldCheck, ShoppingBag, Truck } from "lucide-react";

export function ProductStoreHeader() {
  return (
    <section
      aria-labelledby="product-store-heading"
      className="overflow-hidden bg-card"
    >
      <div className="space-y-6 p-5 sm:p-7">
        <div className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShoppingBag aria-hidden="true" className="size-5" />
          </div>

          <div className="min-w-0">
            <p className="font-semibold">The Product Store</p>
            <p className="text-muted-foreground text-sm">
              Discover something useful
            </p>
          </div>
        </div>

        <div className="max-w-2xl space-y-2">
          <h1
            className="font-bold text-2xl tracking-tight sm:text-3xl"
            id="product-store-heading"
          >
            Find your next essential.
          </h1>

          <p className="max-w-xl text-muted-foreground text-sm leading-6 sm:text-base">
            Explore our collection of products, compare options, and find what
            works for you.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex items-start gap-3 rounded-xl border bg-background p-3.5">
            <PackageCheck
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-primary"
            />
            <div className="space-y-1">
              <p className="font-medium text-sm">Quality picks</p>
              <p className="text-muted-foreground text-xs">Curated products</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border bg-background p-3.5">
            <ShieldCheck
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-primary"
            />
            <div className="space-y-1">
              <p className="font-medium text-sm">Secure checkout</p>
              <p className="text-muted-foreground text-xs">Shop confidently</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border bg-background p-3.5">
            <Truck
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-primary"
            />
            <div className="space-y-1">
              <p className="font-medium text-sm">Easy ordering</p>
              <p className="text-muted-foreground text-xs">
                Simple purchase flow
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
