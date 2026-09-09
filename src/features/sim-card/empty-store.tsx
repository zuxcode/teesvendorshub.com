import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";

export function EmptyProductStore() {
  const router = useRouter();

  const handleRefresh = useCallback(() => {
    router.refresh();
  }, [router.refresh]);

  return (
    <section className="flex min-h-[480px] items-center justify-center px-6 py-16">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="size-8 text-muted-foreground" />
        </div>

        <h2 className="font-semibold text-2xl tracking-tight">
          Nothing to see here yet
        </h2>

        <p className="mt-3 text-muted-foreground text-sm leading-6">
          We’re getting our SIM cards ready. Check back soon to explore
          available plans and products.
        </p>

        <Button className="mt-7" onClick={handleRefresh} variant="outline">
          Refresh
        </Button>
      </div>
    </section>
  );
}
