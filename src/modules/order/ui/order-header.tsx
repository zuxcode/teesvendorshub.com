import { ArrowRight, PackageCheck, ShoppingBag } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function OrderHeader() {
  return (
    <section aria-labelledby="orders-heading">
      <header className="relative isolate overflow-hidden bg-card px-5 py-7 sm:px-8 sm:py-9">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-12 -z-10 size-56 rounded-full bg-primary/5 blur-3xl sm:size-72"
        />

        <div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-center">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-primary">
              <PackageCheck aria-hidden="true" className="size-3.5" />
              <span className="font-semibold text-xs tracking-widest">
                ORDER MANAGEMENT
              </span>
            </div>

            <h1
              className="font-black text-3xl leading-tight tracking-tight sm:text-4xl lg:text-5xl"
              id="orders-heading"
            >
              Your orders,{" "}
              <span className="text-primary">all in one place.</span>
            </h1>

            <p className="mt-3 max-w-xl text-muted-foreground text-sm leading-6 sm:text-base">
              Stay up to date with your purchases, follow delivery progress, and
              revisit your order history whenever you need it.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href="/dashboard/products">
                <Button className="cursor-pointer gap-2">
                  <ShoppingBag aria-hidden="true" className="size-4" />
                  Continue shopping
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Button>
              </Link>

              <span className="text-muted-foreground text-xs">
                Your next favorite find is waiting.
              </span>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="hidden size-24 shrink-0 items-center justify-center rounded-2xl border border-primary/10 bg-primary/5 sm:flex lg:size-28"
          >
            <ShoppingBag className="size-12 text-primary/80 lg:size-14" />
          </div>
        </div>
      </header>
    </section>
  );
}
