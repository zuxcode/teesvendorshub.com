"use client";

import {
  ArrowRight,
  ChevronRight,
  CirclePlay,
  Gift,
  Headset,
  Menu,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Truck,
  UserRound,
  Users,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const categories = [
  {
    description: "Thoughtful gifts for every occasion",
    href: "/shop/gifts",
    icon: Gift,
    theme: "rose",
    title: "Gifts & accessories",
  },
  {
    description: "Physical SIMs and digital eSIMs",
    href: "/shop/sim-esim",
    icon: Smartphone,
    theme: "blue",
    title: "SIM & eSIM",
  },
  {
    description: "Streaming, VPS and more",
    href: "/shop/digital-services",
    icon: CirclePlay,
    theme: "violet",
    title: "Digital subscriptions",
  },
  {
    description: "Explore available listings",
    href: "/shop/social-accounts",
    icon: Users,
    theme: "emerald",
    title: "Social media accounts & pages",
  },
] as const;

const featuredProducts = [
  {
    description: "Digital subscription",
    name: "Netflix subscription",
    price: "₦12,500",
    visual: "netflix",
  },
  {
    description: "Featured electronics",
    name: "Smartphone",
    price: "₦1,250,000",
    visual: "phone",
  },
] as const;

function Brand() {
  return (
    <Link
      aria-label="TVH home"
      className="inline-flex shrink-0 items-center gap-2.5"
      href="/"
    >
      <span className="flex size-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-blue-600/20 shadow-sm">
        <ShoppingBag className="size-6" strokeWidth={2.4} />
      </span>
      <span className="font-extrabold text-[27px] text-slate-950 tracking-tight">
        TVH
      </span>
    </Link>
  );
}

function GiftArtwork() {
  return (
    <div className="relative flex h-full min-h-24 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-rose-50 via-white to-rose-100">
      <div className="relative h-14 w-16">
        <div className="absolute -top-4 left-1/2 z-10 h-5 w-5 -translate-x-1/2 rounded-t-full border-[5px] border-indigo-500 border-b-0" />
        <div className="absolute -top-4 left-1/2 z-10 h-5 w-5 -translate-x-1/2 -scale-x-100 rounded-t-full border-[5px] border-indigo-400 border-b-0" />
        <div className="absolute inset-x-0 top-3 bottom-0 rounded-b-md bg-indigo-600 shadow-indigo-900/15 shadow-lg" />
        <div className="absolute top-3 bottom-0 left-1/2 w-3 -translate-x-1/2 bg-indigo-300" />
        <div className="absolute inset-x-0 top-0 h-3 rounded-sm bg-indigo-400" />
      </div>
    </div>
  );
}

function SimArtwork() {
  return (
    <div className="relative flex h-full min-h-24 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-sky-100">
      <div className="absolute -top-8 -left-4 size-24 rounded-full bg-white/70 blur-xl" />
      <div className="relative flex -rotate-12 items-center gap-2">
        <div className="flex h-14 w-12 items-center justify-center rounded-lg border border-blue-300 bg-blue-600 shadow-blue-900/15 shadow-lg">
          <div className="grid size-6 grid-cols-2 gap-px rounded-sm bg-amber-300 p-0.5">
            {Array.from({ length: 4 }, (_, index) => (
              <span className="rounded-[2px] bg-amber-200" key={index} />
            ))}
          </div>
        </div>
        <div className="flex h-12 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white shadow-md">
          <div className="grid size-5 grid-cols-2 gap-px rounded-sm bg-amber-400 p-0.5">
            {Array.from({ length: 4 }, (_, index) => (
              <span className="rounded-[2px] bg-amber-200" key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SubscriptionArtwork() {
  return (
    <div className="relative flex h-full min-h-24 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 to-slate-700">
      <span className="font-black text-2xl text-red-500 tracking-tight">
        NETFLIX
      </span>
      <span className="absolute right-3 bottom-2 rounded-md bg-white/10 px-2 py-1 font-medium text-[9px] text-white/80">
        DIGITAL ACCESS
      </span>
    </div>
  );
}

function SocialArtwork() {
  return (
    <div className="flex h-full min-h-24 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-violet-50 via-white to-blue-50">
      <div className="flex -rotate-6 items-center gap-2">
        <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white shadow-md">
          <span className="size-5 rounded-md border-2 border-white" />
        </span>
        <span className="flex size-11 items-center justify-center rounded-xl bg-slate-950 text-white shadow-md">
          <Zap className="size-6 fill-white" />
        </span>
        <span className="flex size-11 items-center justify-center rounded-xl bg-red-600 text-white shadow-md">
          <CirclePlay className="size-6 fill-white" />
        </span>
      </div>
    </div>
  );
}

function CategoryArtwork({ theme }: { theme: string }) {
  switch (theme) {
    case "rose":
      return <GiftArtwork />;
    case "blue":
      return <SimArtwork />;
    case "violet":
      return <SubscriptionArtwork />;
    default:
      return <SocialArtwork />;
  }
}

function FloatingCategoryCard({
  title,
  theme,
  className,
  href,
}: {
  title: string;
  theme: string;
  className: string;
  href: string;
}) {
  return (
    <Link
      className={`absolute z-10 w-44 rounded-2xl border border-white/90 bg-white/90 p-2.5 shadow-blue-950/10 shadow-xl backdrop-blur-sm transition-transform duration-300 hover:scale-105 sm:w-48 ${className}`}
      href={href}
    >
      <CategoryArtwork theme={theme} />
      <p className="mt-2 font-semibold text-slate-800 text-xs">{title}</p>
    </Link>
  );
}

function PhoneStorefront() {
  return (
    <div className="relative z-20 mx-auto w-[260px] rotate-[3deg] rounded-[2.7rem] border-[5px] border-slate-900 bg-slate-950 p-[5px] shadow-2xl shadow-blue-950/25 sm:w-[280px] lg:w-[286px]">
      <div className="relative overflow-hidden rounded-[2.15rem] bg-white">
        <div className="absolute top-0 left-1/2 z-30 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-slate-950" />

        <div className="px-3 pt-7 pb-3">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="flex size-6 items-center justify-center rounded-md bg-blue-600 text-white">
                <ShoppingBag className="size-3.5" />
              </span>
              <span className="font-extrabold text-slate-950 text-sm">TVH</span>
            </div>
            <ShoppingCart className="size-4 text-slate-700" />
          </div>

          <div className="relative mb-3">
            <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
            <div className="rounded-lg border border-slate-200 bg-slate-50 py-2 pr-2 pl-8 text-[9px] text-slate-400">
              Search products...
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-blue-200 p-3">
            <div className="relative z-10 max-w-[58%]">
              <p className="font-medium text-[9px] text-blue-800">
                Discover something special
              </p>
              <h3 className="mt-1 font-extrabold text-slate-950 text-sm leading-tight">
                More ways to shop.
              </h3>
              <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-blue-600 px-2 py-1 font-semibold text-[8px] text-white">
                Explore shop <ArrowRight className="size-2.5" />
              </span>
            </div>
            <div className="absolute -right-2 -bottom-2">
              <div className="scale-75">
                <GiftArtwork />
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  className="rounded-xl border border-slate-100 bg-slate-50/80 p-2"
                  href={category.href}
                  key={category.title}
                >
                  <span
                    className={`flex size-6 items-center justify-center rounded-md ${
                      category.theme === "rose"
                        ? "bg-rose-100 text-rose-600"
                        : category.theme === "blue"
                          ? "bg-blue-100 text-blue-600"
                          : category.theme === "violet"
                            ? "bg-violet-100 text-violet-600"
                            : "bg-emerald-100 text-emerald-600"
                    }`}
                  >
                    <Icon className="size-3.5" />
                  </span>
                  <p className="mt-1.5 font-bold text-[9px] text-slate-800 leading-tight">
                    {category.title}
                  </p>
                  <p className="mt-1 text-[8px] text-slate-500 leading-tight">
                    Explore products
                  </p>
                </Link>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <h4 className="font-bold text-[10px] text-slate-900">
              Featured products
            </h4>
            <Link
              className="font-semibold text-[9px] text-blue-600"
              href="/shop"
            >
              View all →
            </Link>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2">
            {featuredProducts.map((product) => (
              <div
                className="overflow-hidden rounded-lg border border-slate-100 bg-white p-1.5"
                key={product.name}
              >
                {product.visual === "netflix" ? (
                  <SubscriptionArtwork />
                ) : (
                  <div className="flex h-14 items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-blue-100">
                    <Smartphone className="size-8 text-slate-500" />
                  </div>
                )}
                <p className="mt-1.5 truncate font-bold text-[8px] text-slate-800">
                  {product.name}
                </p>
                <p className="mt-0.5 text-[7px] text-slate-500">
                  {product.description}
                </p>
                <p className="mt-1 font-extrabold text-[9px] text-slate-950">
                  {product.price}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="sticky bottom-0 grid grid-cols-4 border-slate-100 border-t bg-white px-1 py-2">
          {[ShoppingBag, Search, ShoppingCart, UserRound].map((Icon, index) => (
            <div
              className={`flex flex-col items-center gap-1 ${
                index === 0 ? "text-blue-600" : "text-slate-400"
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

function TrustItem({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof ShieldCheck;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-800">
        <Icon className="size-5" strokeWidth={1.8} />
      </span>
      <div>
        <p className="font-bold text-slate-800 text-xs">{title}</p>
        <p className="mt-1 text-[11px] text-slate-500">{description}</p>
      </div>
    </div>
  );
}

export function LandingHero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="overflow-hidden bg-[#f8fbff] text-slate-950">
      <header className="relative z-40 border-slate-100 border-b bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-12">
          <Brand />

          <nav className="hidden items-center gap-7 lg:flex">
            {[
              ["Home", "/"],
              ["Shop", "/shop"],
              ["Gifts", "/shop/gifts"],
              ["SIM & eSIM", "/shop/sim-esim"],
              ["Digital Services", "/shop/digital-services"],
              ["Social Accounts", "/shop/social-accounts"],
            ].map(([label, href], index) => (
              <Link
                className={`relative py-7 font-medium text-[13px] transition-colors hover:text-blue-600 ${
                  index === 0
                    ? "text-blue-600 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-blue-600"
                    : "text-slate-700"
                }`}
                href={href}
                key={label}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-4 xl:flex">
            <form action="/shop" className="relative w-[235px]">
              <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                aria-label="Search products"
                className="h-10 rounded-xl border-slate-200 bg-slate-50/70 pl-10 text-xs placeholder:text-slate-400 focus-visible:ring-blue-500"
                name="q"
                placeholder="Search products..."
              />
            </form>
            <Link
              aria-label="Shopping cart"
              className="rounded-lg p-2 text-slate-800 transition-colors hover:bg-blue-50 hover:text-blue-600"
              href="/cart"
            >
              <ShoppingCart className="size-5" />
            </Link>
            <Link
              aria-label="Your account"
              className="rounded-lg p-2 text-slate-800 transition-colors hover:bg-blue-50 hover:text-blue-600"
              href="/account"
            >
              <UserRound className="size-5" />
            </Link>
          </div>

          <div className="flex items-center gap-2 xl:hidden">
            <Link
              aria-label="Shopping cart"
              className="rounded-lg p-2 text-slate-800 hover:bg-blue-50"
              href="/cart"
            >
              <ShoppingCart className="size-5" />
            </Link>
            <Button
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileMenuOpen((open) => !open)}
              size="icon"
              variant="outline"
            >
              {mobileMenuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="border-slate-100 border-t bg-white px-5 py-4 lg:hidden">
            <div className="mx-auto grid max-w-3xl gap-1">
              {[
                ["Home", "/"],
                ["Shop", "/shop"],
                ["Gifts & accessories", "/shop/gifts"],
                ["SIM & eSIM", "/shop/sim-esim"],
                ["Digital services", "/shop/digital-services"],
                ["Social accounts & pages", "/shop/social-accounts"],
              ].map(([label, href]) => (
                <Link
                  className="rounded-lg px-3 py-3 font-medium text-slate-700 text-sm hover:bg-blue-50 hover:text-blue-600"
                  href={href}
                  key={label}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>

      <section className="relative">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-10 -right-32 size-[650px] rounded-full bg-blue-100/50 blur-3xl" />
          <div className="absolute top-40 -left-40 size-[400px] rounded-full bg-white blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-[1440px] items-center gap-12 px-5 pt-12 pb-12 sm:px-8 sm:pt-16 sm:pb-16 lg:min-h-[650px] lg:grid-cols-[0.92fr_1.08fr] lg:gap-4 lg:px-12 lg:py-14">
          <div className="relative z-20 max-w-[570px]">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-100/80 px-4 py-2 font-semibold text-blue-700 text-xs sm:text-sm">
              <Zap className="size-4 fill-blue-600" />
              Your all-in-one marketplace
            </div>

            <h1 className="font-extrabold text-[clamp(3.4rem,6.1vw,5.6rem)] text-slate-950 leading-[0.99] tracking-[-0.065em]">
              More than a
              <br />
              marketplace<span className="text-blue-600">.</span>
            </h1>

            <p className="mt-7 max-w-[500px] text-base text-slate-500 leading-8 sm:text-lg sm:leading-[1.85]">
              Shop gifts, get connected with SIM and eSIM, explore digital
              subscriptions, and discover social media accounts and pages — all
              in one place.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="h-[54px] rounded-xl bg-blue-600 px-7 font-semibold text-sm shadow-blue-600/20 shadow-lg hover:bg-blue-700"
                size="lg"
              >
                <Link href="/shop">
                  Explore marketplace
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                className="h-[54px] rounded-xl border-blue-500 bg-white/70 px-7 font-semibold text-blue-600 text-sm hover:bg-blue-50"
                size="lg"
                variant="outline"
              >
                <Link href="#categories">Browse categories</Link>
              </Button>
            </div>

            <div className="mt-10 grid max-w-[560px] grid-cols-1 gap-5 border-slate-200/80 border-t pt-7 sm:grid-cols-3 sm:gap-4">
              <TrustItem
                description="Shop with confidence"
                icon={ShieldCheck}
                title="Secure checkout"
              />
              <TrustItem
                description="For physical products"
                icon={Truck}
                title="Delivery options"
              />
              <TrustItem
                description="We're here to help"
                icon={Headset}
                title="Customer support"
              />
            </div>
          </div>

          <div className="relative mx-auto flex min-h-[480px] w-full max-w-[650px] items-center justify-center sm:min-h-[570px] lg:min-h-[590px]">
            <div className="absolute top-1/2 left-1/2 aspect-square w-[88%] max-w-[540px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-blue-100 via-blue-200/80 to-indigo-100/70" />
            <div className="absolute top-[17%] left-[12%] h-36 w-36 rounded-full bg-white/50 blur-3xl" />
            <div className="absolute right-[8%] bottom-[8%] h-40 w-40 rounded-full bg-blue-300/30 blur-3xl" />

            <FloatingCategoryCard
              className="top-[12%] -left-1 -rotate-[8deg] sm:left-1"
              href="/shop/gifts"
              theme="rose"
              title="Gifts & accessories"
            />
            <FloatingCategoryCard
              className="bottom-[23%] -left-1 -rotate-[9deg] sm:left-0"
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

            <div className="absolute right-[17%] bottom-[3%] left-[17%] h-8 rounded-[100%] bg-blue-950/15 blur-xl" />

            <PhoneStorefront />
          </div>
        </div>
      </section>

      <section className="relative z-20 mx-auto max-w-[1440px] px-5 pb-8 sm:px-8 lg:px-12 lg:pb-12">
        <div
          className="grid overflow-hidden rounded-2xl border border-white bg-white/90 shadow-slate-200/50 shadow-sm backdrop-blur-sm sm:grid-cols-2 lg:grid-cols-4"
          id="categories"
        >
          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <Link
                className={`group flex min-h-[112px] items-center gap-4 px-5 py-5 transition-colors hover:bg-blue-50/70 sm:px-6 ${
                  index < categories.length - 1
                    ? "border-slate-100 border-b sm:border-r lg:border-b-0"
                    : ""
                } ${index === 1 ? "sm:border-r-0 lg:border-r" : ""}`}
                href={category.href}
                key={category.title}
              >
                <span
                  className={`flex size-[54px] shrink-0 items-center justify-center rounded-full transition-transform group-hover:scale-105 ${
                    category.theme === "rose"
                      ? "bg-rose-50 text-rose-500"
                      : category.theme === "blue"
                        ? "bg-blue-50 text-blue-600"
                        : category.theme === "violet"
                          ? "bg-violet-100/80 text-violet-600"
                          : "bg-emerald-50 text-emerald-600"
                  }`}
                >
                  <Icon className="size-6" strokeWidth={1.8} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-slate-800 text-sm leading-snug">
                    {category.title}
                  </span>
                  <span className="mt-1.5 block text-slate-500 text-xs leading-relaxed">
                    {category.description}
                  </span>
                </span>

                <ChevronRight className="size-4 shrink-0 text-blue-600 transition-transform group-hover:translate-x-1" />
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
