/** biome-ignore-all lint/suspicious/noArrayIndexKey: <fixed index> */
import {
  ArrowRight,
  Search,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { categories } from "../constant";
import { GiftArtwork } from "./gift-art-work";
import { PhoneCategoryCard } from "./phone-category";
import { SubscriptionArtwork } from "./subcription-art-work";

const featuredProducts = [
  {
    description: "Digital subscription",
    name: "Netflix subscription",
    price: "₦12,500",
    visual: "subscription",
  },
  {
    description: "Featured electronics",
    name: "Smartphone",
    price: "₦1,250,000",
    visual: "phone",
  },
] as const;

export function PhoneStorefront() {
  return (
    <div className="relative z-20 mx-auto w-[248px] rotate-[3deg] rounded-[2.7rem] border-[5px] border-slate-800 bg-slate-950 p-[5px] shadow-2xl shadow-foreground/20 sm:w-[270px] lg:w-[280px]">
      <div className="relative overflow-hidden rounded-[2.15rem] bg-card text-card-foreground">
        <div className="absolute top-0 left-1/2 z-30 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-slate-950" />

        <div className="px-3 pt-7 pb-3">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <ShoppingBag className="size-3.5" />
              </span>

              <span className="font-extrabold text-sm">TVH</span>
            </div>

            <ShoppingCart className="size-4 text-foreground" />
          </div>

          <div className="relative mb-3">
            <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />

            <div className="rounded-lg border border-border bg-muted/50 py-2 pr-2 pl-8 text-[9px] text-muted-foreground">
              Search products...
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-linear-to-br from-primary/10 to-primary/25 p-3">
            <div className="relative z-10 max-w-[62%]">
              <p className="font-medium text-[9px] text-primary">
                Discover something special
              </p>

              <h3 className="mt-1 font-extrabold text-foreground text-sm leading-tight">
                More ways to shop.
              </h3>

              <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-primary px-2 py-1 font-semibold text-[8px] text-primary-foreground">
                Explore shop <ArrowRight className="size-2.5" />
              </span>
            </div>

            <div className="absolute -right-2 -bottom-2 w-24">
              <GiftArtwork />
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <PhoneCategoryCard
                href={category.href}
                key={category.title}
                theme={category.theme}
                title={category.title}
              />
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <h4 className="font-bold text-[10px]">Featured products</h4>

            <Link
              className="font-semibold text-[9px] text-primary hover:underline"
              href="/shop"
            >
              View all →
            </Link>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2">
            {featuredProducts.map((product) => (
              <div
                className="overflow-hidden rounded-lg border border-border bg-card p-1.5"
                key={product.name}
              >
                {product.visual === "subscription" ? (
                  <SubscriptionArtwork />
                ) : (
                  <div className="flex h-14 items-center justify-center rounded-lg bg-muted">
                    <Smartphone className="size-8 text-muted-foreground" />
                  </div>
                )}

                <p className="mt-1.5 truncate font-bold text-[8px]">
                  {product.name}
                </p>

                <p className="mt-0.5 text-[7px] text-muted-foreground">
                  {product.description}
                </p>

                <p className="mt-1 font-extrabold text-[9px]">
                  {product.price}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="sticky bottom-0 grid grid-cols-4 border-border border-t bg-card px-1 py-2">
          {[ShoppingBag, Search, ShoppingCart, UserRound].map((Icon, index) => (
            <div
              className={`flex flex-col items-center gap-1 ${
                index === 0 ? "text-primary" : "text-muted-foreground"
              }`}
              key={index}
            >
              <Icon className="size-3.5" />

              <span className="text-[7px]">
                {["Home", "Explore", "Cart", "Account"][index]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
