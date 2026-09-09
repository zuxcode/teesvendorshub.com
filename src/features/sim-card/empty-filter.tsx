import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyFilter() {
  return (
    <div className="flex min-h-75 flex-col items-center justify-center rounded-xl border border-dashed">
      <div className="rounded-full bg-muted p-3">
        <Filter className="size-5 text-muted-foreground" />
      </div>

      <h3 className="mt-4 font-semibold">No products found</h3>

      <p className="mt-1 text-muted-foreground text-sm">
        Try changing your filters.
      </p>

      <Button
        className="mt-4"
        // onClick={clearFilters}
        size="sm"
        variant="outline"
      >
        Clear filters
      </Button>
    </div>
  );
}
