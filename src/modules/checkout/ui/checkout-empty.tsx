"use client";

import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function EmptyCheckout() {
  const router = useRouter();
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-muted">
          <ShoppingCart className="size-7 text-muted-foreground" />
        </div>

        <h1 className="font-semibold text-2xl tracking-tight">
          Your cart is empty
        </h1>

        <p className="mt-2 text-muted-foreground text-sm leading-6">
          There are no items to check out yet. Add something to your cart to
          continue.
        </p>

        <Button className="mt-6" onClick={router.back}>
          Continue Shopping
        </Button>
      </div>
    </main>
  );
}
