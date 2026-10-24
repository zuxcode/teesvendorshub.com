import Link from "next/link";

import { TeesLogo } from "@/components/tees-ui/logo";
import { Separator } from "@/components/ui/separator";
import { LEGAL_PAGES } from "@/constant";

export function DashboardFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col place-items-center gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <TeesLogo className="size-8" href="/" size="xs" textHidden />

            <div className="flex flex-col">
              <span className="font-semibold text-sm">TeesVendorsHub</span>

              <span className="text-muted-foreground text-xs">
                Quality products, designed for you.
              </span>
            </div>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex max-w-full flex-wrap items-center justify-center gap-x-5 gap-y-2 text-muted-foreground text-sm md:justify-end"
          >
            {LEGAL_PAGES.map((legal) => (
              <Link
                className="whitespace-nowrap transition-colors hover:text-foreground"
                href={legal.href}
                key={legal.slug}
              >
                {legal.title}
              </Link>
            ))}
          </nav>
        </div>

        <Separator className="my-5" />

        <div className="flex flex-col place-items-center gap-2 text-muted-foreground text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} TeesVendorsHub. All rights reserved.</p>

          <p>Quality products, designed for you.</p>
        </div>
      </div>
    </footer>
  );
}
