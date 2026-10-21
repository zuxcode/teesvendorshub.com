interface OrderedItemsSkeletonProps {
  count?: number;
}

export function OrderedItemsSkeleton({ count = 3 }: OrderedItemsSkeletonProps) {
  return (
    <section
      aria-busy="true"
      aria-label="Loading ordered items"
      className="space-y-3"
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          className="animate-pulse rounded-xl border bg-card p-4"
          key={index}
        >
          <div className="flex gap-3">
            <div className="size-20 shrink-0 rounded-lg bg-muted" />

            <div className="flex-1 space-y-3 py-1">
              <div className="h-4 w-3/4 rounded bg-muted" />
              <div className="h-3 w-1/2 rounded bg-muted" />
              <div className="h-3 w-2/5 rounded bg-muted" />
            </div>
          </div>

          <div className="mt-4 flex justify-between border-t pt-3">
            <div className="space-y-2">
              <div className="h-3 w-12 rounded bg-muted" />
              <div className="h-4 w-6 rounded bg-muted" />
            </div>
            <div className="space-y-2">
              <div className="ml-auto h-3 w-16 rounded bg-muted" />
              <div className="ml-auto h-4 w-20 rounded bg-muted" />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
