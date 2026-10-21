import { PackageOpen } from "lucide-react";
import Link from "next/link";

export function OrderedItemsEmpty() {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed px-6 py-12 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <PackageOpen
          aria-hidden="true"
          className="size-6 text-muted-foreground"
        />
      </div>

      <h2 className="mt-4 font-semibold text-base">No items in this order</h2>

      <p className="mt-2 max-w-xs text-muted-foreground text-sm">
        This order doesn't have any items yet.
      </p>

      <Link
        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 font-medium text-primary-foreground text-sm transition-opacity hover:opacity-90"
        href="/orders"
      >
        Back to orders
      </Link>
    </div>
  );
}
