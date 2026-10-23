"use client";

import { FloatingCategoryCard } from "./floating-category-card";
import { PhoneStorefront } from "./phone-store-front";

export function HeroVisual() {
  return (
    <div className="relative mx-auto flex min-h-110 w-full max-w-162.5 items-center justify-center sm:min-h-135 lg:min-h-147.5">
      <div className="absolute top-1/2 left-1/2 aspect-square w-[88%] max-w-135 -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-br from-primary/10 via-primary/20 to-primary/5" />

      <div className="absolute top-[17%] left-[12%] size-36 rounded-full bg-primary/10 blur-3xl" />

      <div className="absolute right-[8%] bottom-[8%] size-40 rounded-full bg-primary/15 blur-3xl" />

      <FloatingCategoryCard
        className="top-[12%] -left-1 rotate-[-8deg] sm:left-1"
        href="/shop/gifts"
        theme="rose"
        title="Gifts & accessories"
      />

      <FloatingCategoryCard
        className="bottom-[23%] -left-1 rotate-[-9deg] sm:left-0"
        href="/shop/sim-esim"
        theme="blue"
        title="SIM & eSIM"
      />

      <FloatingCategoryCard
        className="top-[17%] -right-1 rotate-[8deg] sm:right-0"
        href="/shop/digital-services"
        theme="violet"
        title="Digital subscriptions"
      />

      <FloatingCategoryCard
        className="-right-1 bottom-[18%] rotate-[8deg] sm:right-0"
        href="/shop/social-accounts"
        theme="emerald"
        title="Social media accounts & pages"
      />

      <div className="absolute right-[17%] bottom-[3%] left-[17%] h-8 rounded-[100%] bg-foreground/10 blur-xl" />

      <PhoneStorefront />
    </div>
  );
}
