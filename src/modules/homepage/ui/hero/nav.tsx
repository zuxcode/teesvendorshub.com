/** biome-ignore-all lint/performance/noJsxPropsBind: <turn off> */
"use client";

import {
  Menu,
  Search,
  ShoppingBag,
  ShoppingCart,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const navigation = [
  { active: true, href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/shop/gifts", label: "Gifts" },
  { href: "/shop/sim-esim", label: "SIM & eSIM" },
  { href: "/shop/digital-services", label: "Digital Services" },
  { href: "/shop/social-accounts", label: "Social Accounts" },
];

function Brand() {
  return (
    <Link
      aria-label="TVH home"
      className="inline-flex shrink-0 items-center gap-2.5"
      href="/"
    >
      <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-primary/20 shadow-sm">
        <ShoppingBag className="size-6" strokeWidth={2.4} />
      </span>

      <span className="font-extrabold text-[27px] text-foreground tracking-tight">
        TVH
      </span>
    </Link>
  );
}

function SearchForm({ mobile = false }: { mobile?: boolean }) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: <want a search role>
    <form
      action="/shop"
      className={cn("relative", mobile ? "mt-3" : "w-58.75")}
      role="search"
    >
      <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        aria-label="Search products"
        className={`h-10 border-border bg-muted/40 pl-10 text-xs ${
          mobile ? "text-sm" : ""
        }`}
        name="q"
        placeholder="Search products..."
      />
    </form>
  );
}

function DesktopNavigation() {
  return (
    <nav
      aria-label="Main navigation"
      className="hidden items-center gap-7 lg:flex"
    >
      {navigation.map(({ label, href, active }) => (
        <Link
          className={`relative py-7 font-medium text-[13px] transition-colors hover:text-primary ${
            active
              ? "text-primary after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary"
              : "text-foreground/80"
          }`}
          href={href}
          key={label}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}

function MobileNavigation({ onNavigate }: { onNavigate: () => void }) {
  return (
    <nav
      aria-label="Mobile navigation"
      className="border-border border-t bg-background px-5 py-4 lg:hidden"
    >
      <div className="mx-auto grid max-w-3xl gap-1">
        {navigation.map(({ label, href }) => (
          <Link
            className="rounded-lg px-3 py-3 font-medium text-foreground/80 text-sm transition-colors hover:bg-accent hover:text-primary"
            href={href}
            key={label}
            onClick={onNavigate}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="mx-auto max-w-3xl">
        <SearchForm mobile />
      </div>
    </nav>
  );
}

export function HeroNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative z-40 border-border border-b bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-19 max-w-360 items-center justify-between gap-5 px-5 sm:px-8 lg:px-12">
        <Brand />

        <DesktopNavigation />

        <div className="hidden items-center gap-4 xl:flex">
          <SearchForm />

          <Link
            aria-label="Shopping cart"
            className="rounded-lg p-2 text-foreground transition-colors hover:bg-accent hover:text-primary"
            href="/cart"
          >
            <ShoppingCart className="size-5" />
          </Link>

          <Link
            aria-label="Your account"
            className="rounded-lg p-2 text-foreground transition-colors hover:bg-accent hover:text-primary"
            href="/account"
          >
            <UserRound className="size-5" />
          </Link>
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <Link
            aria-label="Shopping cart"
            className="rounded-lg p-2 text-foreground hover:bg-accent"
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

      {mobileMenuOpen ? (
        <MobileNavigation onNavigate={() => setMobileMenuOpen(false)} />
      ) : null}
    </header>
  );
}
