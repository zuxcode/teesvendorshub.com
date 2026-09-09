import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <section className="container py-8">
      <div className="mb-8 space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>

      <div className="mb-8 flex flex-wrap gap-3">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <fix>
          <SimCardProductSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}

function SimCardProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border">
      <Skeleton className="aspect-4/3 w-full" />

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        <Skeleton className="h-6 w-24" />

        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
