import { Menu, Search } from "lucide-react";
import Link from "next/link";
import { TeesLogo } from "@/components/tees-ui/logo";
import { ThemeToggle } from "@/components/tees-ui/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "/explore", label: "Explore" },
  { href: "/software", label: "Software" },
  { href: "/subscriptions", label: "Subscriptions" },
  { href: "/ai-tools", label: "AI Tools", tag: "NEW" },
  { href: "/deals", label: "Deals" },
];

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger>
        <Button
          className="border-border text-foreground sm:hidden"
          size="icon"
          variant="outline"
        >
          <Menu className="h-4.5 w-4.5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="w-75 border-border bg-background/95 backdrop-blur-xl sm:w-85"
        side="right"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between gap-2">
            <TeesLogo />
            <ThemeToggle />
          </SheetTitle>
        </SheetHeader>

        <div className="relative mt-2 px-4">
          <Search className="pointer-events-none absolute top-1/2 left-7 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-9 rounded-lg bg-muted/40 pl-9 text-sm"
            placeholder="Search…"
            type="search"
          />
        </div>

        <div className="mt-4 flex flex-col gap-1 px-2">
          {NAV_LINKS.map((link) => (
            <SheetClose key={link.href}>
              <Link
                className="flex items-center justify-between rounded-lg px-3 py-2.5 font-medium text-muted-foreground text-sm hover:bg-muted hover:text-foreground"
                href={link.href}
              >
                {link.label}
                {link.tag ? (
                  <Badge className="h-4 rounded-sm bg-primary px-1 font-semibold text-[9px] text-primary-foreground hover:bg-primary">
                    {link.tag}
                  </Badge>
                ) : null}
              </Link>
            </SheetClose>
          ))}
          <SheetClose>
            <Link
              className="flex items-center rounded-lg px-3 py-2.5 font-medium text-muted-foreground text-sm hover:bg-muted hover:text-foreground"
              href="/sell"
            >
              Sell on TVH
            </Link>
          </SheetClose>
        </div>

        <div className="mt-4 flex gap-2 px-4">
          <Button className="flex-1 border-border" variant="outline">
            Sign in
          </Button>
          <Button className="flex-1 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
            Get started
          </Button>
        </div>

        <div className="mt-4 flex items-center gap-2 px-4 text-muted-foreground text-sm">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-accent text-accent-foreground text-xs">
              TV
            </AvatarFallback>
          </Avatar>
          Your account
        </div>
      </SheetContent>
    </Sheet>
  );
}
