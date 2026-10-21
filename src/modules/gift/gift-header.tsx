import { Gift, Heart } from "lucide-react";

export function GiftStoreHeader() {
  return (
    <section aria-labelledby="gift-store-heading">
      <header className="relative isolate overflow-hidden rounded-2xl border bg-card px-5 py-7 sm:px-8 sm:py-9">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-12 -z-10 size-56 rounded-full bg-primary/5 blur-3xl sm:size-72"
        />

        <div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-center">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-primary">
              <Heart aria-hidden="true" className="size-3.5" />
              <span className="font-semibold text-xs tracking-widest">
                THOUGHTFUL GIFTS, MADE EASY
              </span>
            </div>

            <h1
              className="font-black text-3xl leading-tight tracking-tight sm:text-4xl lg:text-5xl"
              id="gift-store-heading"
            >
              Find the perfect gift,{" "}
              <span className="text-primary">make their day.</span>
            </h1>

            <p className="mt-3 max-w-xl text-muted-foreground text-sm leading-6 sm:text-base">
              Discover thoughtful gifts for birthdays, special occasions, and
              everyday surprises. Find something meaningful for everyone you
              love.
            </p>
          </div>

          <div
            aria-hidden="true"
            className="hidden size-24 shrink-0 items-center justify-center rounded-2xl border border-primary/10 bg-primary/5 sm:flex lg:size-28"
          >
            <Gift className="size-12 text-primary/80 lg:size-14" />
          </div>
        </div>
      </header>
    </section>
  );
}
