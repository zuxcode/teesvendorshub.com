import { Skeleton } from "@/components/ui/skeleton";

export function ProductGridSkeleton() {
  return (
    <section className="space-y-8">
      <section
        aria-busy="true"
        aria-label="Loading products"
        className="grid min-w-0 grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4"
      >
        {Array.from({ length: 8 }, (_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <index>
          <ProductCardSkeleton key={index} />
        ))}
      </section>
    </section>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      <Skeleton className="aspect-square w-full rounded-none" />

      <div className="space-y-3 p-4">
        <Skeleton className="h-5 w-4/5" />

        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>

      <div className="space-y-4 border-t p-4">
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-20" />
        </div>

        <div className="flex items-end justify-between gap-3">
          <div className="space-y-2">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-6 w-24" />
          </div>

          <Skeleton className="h-9 w-28" />
        </div>
      </div>
    </div>
  );
}
