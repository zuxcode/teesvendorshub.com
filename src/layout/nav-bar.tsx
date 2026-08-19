"use client";

import { Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { TeesLogo } from "@/components/tees-ui/logo";
import { ThemeToggle } from "@/components/tees-ui/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActiveLink } from "@/hooks/use-active-link";
import { SHOP_LINKS } from "@/lib/constant/constant";
import { cn } from "@/lib/utils";
import { MobileNav } from "./nav/mobile-nav";

export function SiteNavbar() {
  const { getActiveLink } = useActiveLink();
  return (
    <div className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4">
      <nav
        className={cn(
          "mx-auto flex max-w-7xl items-center gap-3 rounded-2xl border border-border/60",
          "bg-background/70 px-3 py-2 shadow-black/20 shadow-lg backdrop-blur-xl backdrop-saturate-150"
        )}
      >
        <TeesLogo size="xs" />

        {/* Primary nav — hidden below lg */}
        <div className="hidden shrink-0 items-center gap-0.5 lg:flex">
          {SHOP_LINKS.map((link) => {
            const { combinedClass } = getActiveLink(link.href);

            return (
              <Link
                className={cn(
                  "group relative flex items-center gap-1.5 rounded-lg px-3 py-2 font-medium text-sm capitalize",
                  "text-muted-foreground transition-colors hover:text-foreground",
                  combinedClass
                )}
                href={link.href}
                key={link.href}
              >
                {link.label}
                {link.tag ? (
                  <Badge className="h-4 rounded-sm bg-primary px-1 font-semibold text-[9px] text-primary-foreground leading-none hover:bg-primary">
                    {link.tag}
                  </Badge>
                ) : null}
                <span className="pointer-events-none absolute inset-x-3 bottom-0.5 h-px scale-x-0 bg-linear-to-r from-primary to-secondary transition-transform duration-200 group-hover:scale-x-100" />
              </Link>
            );
          })}
        </div>

        {/* Search — hidden below md */}
        <div className="relative hidden flex-1 md:block">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-9 rounded-lg border-input bg-muted/40 pr-14 pl-9 text-sm placeholder:text-muted-foreground focus-visible:ring-ring/60"
            placeholder="Search tools, software, subscriptions…"
            type="search"
          />
          <kbd className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            ⌘K
          </kbd>
        </div>

        {/* Actions */}
        <div className="ml-auto flex shrink-0 items-center gap-1">
          <Button
            aria-label="Cart"
            className="relative text-muted-foreground hover:text-foreground"
            size="icon"
            variant="ghost"
          >
            <ShoppingCart className="h-4.5 w-4.5" />
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary font-semibold text-[10px] text-primary-foreground ring-2 ring-background">
              3
            </span>
          </Button>

          <ThemeToggle />

          <div className="mx-1 hidden h-5 w-px bg-border sm:block" />

          <Button
            className="hidden text-muted-foreground text-sm hover:text-foreground sm:inline-flex"
            variant="ghost"
          >
            Sign in
          </Button>

          <Button className="hidden gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 sm:inline-flex">
            Get started
          </Button>

          <MobileNav />
        </div>
      </nav>
    </div>
  );
}
