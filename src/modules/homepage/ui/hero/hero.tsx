"use client";

import { CategoryStrip } from "./category-strip";
import { HeroContent } from "./hero-content";
import { HeroVisual } from "./hero-visual";
import { HeroNavigation } from "./nav";

export function HeroSection() {
  return (
    <main className="overflow-hidden bg-background text-foreground">
      <HeroNavigation />
      <section className="relative isolate">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-10 -right-32 size-162.5 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute top-40 -left-40 size-100 rounded-full bg-muted/70 blur-3xl" />
        </div>
        <div className="relative mx-auto grid max-w-360 items-center gap-8 px-5 pt-12 pb-10 sm:px-8 sm:pt-14 sm:pb-14 lg:min-h-162.5 lg:grid-cols-[0.92fr_1.08fr] lg:gap-4 lg:px-12 lg:py-10">
          <HeroContent />
          <HeroVisual />
        </div>
      </section>

      <CategoryStrip />
    </main>
  );
}
