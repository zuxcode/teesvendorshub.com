import { ArrowUpRight, Copy, Heart, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { TeesLogo } from "@/components/tees-ui/logo";
import {
  BRAND_NAME,
  CONTACT_LINKS,
  FOOTER_LINKS,
  SHOP_LINKS,
} from "@/lib/constant/constant";
import type { TeesLink } from "@/lib/types";

export function SiteFooter() {
  return (
    <footer className="border-border/60 border-t bg-card/55">
      <div className="mx-auto max-w-360 px-5 pt-16 sm:px-10 sm:pt-20 lg:px-18">
        <div className="grid gap-12 border-border/60 border-b pb-14 lg:grid-cols-[1.35fr_0.7fr_0.7fr_1fr]">
          <div className="max-w-sm">
            <TeesLogo size="xs" />
            <p className="mt-5 text-muted-foreground text-sm leading-relaxed">
              The direct storefront for social assets sourced, checked, and
              delivered by one team.
            </p>
            <a
              className="mt-6 inline-flex items-center gap-2 font-semibold text-foreground text-sm transition-colors hover:text-primary"
              href={`mailto:${CONTACT_LINKS.supportMail}`}
            >
              <Mail className="h-4 w-4 text-primary" />
              {CONTACT_LINKS.supportMail}
            </a>
          </div>

          <FooterLinkGroup links={SHOP_LINKS} title="Shop" />
          <FooterLinkGroup links={FOOTER_LINKS} title="Company" />

          <div>
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.15em]">
              Buy with confidence
            </p>
            <div className="mt-5 space-y-4 text-muted-foreground text-sm">
              <p className="flex gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Every listing is reviewed by our in-house team.
              </p>
              <p className="flex gap-3">
                <Copy className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                Clear transfer documentation for every purchase.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 py-6 text-muted-foreground text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <Heart className="h-3.5 w-3.5 text-destructive" />
            Built for the next good move.
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLinkGroup({
  links,
  title,
}: {
  links: TeesLink[];
  title: string;
}) {
  return (
    <div>
      <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.15em]">
        {title}
      </p>
      <ul className="mt-5 space-y-3">
        {links.map((link) => {
          const isExternal = link.href.startsWith("http");

          return (
            <li key={link.href}>
              {link.disable ? (
                <span className="cursor-not-allowed text-muted-foreground/45 text-sm">
                  {link.label}
                  <span className="ml-2 font-mono text-[9px] tracking-wide">
                    SOON
                  </span>
                </span>
              ) : (
                <Link
                  className="group inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
                  href={link.href}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  target={isExternal ? "_blank" : undefined}
                >
                  {link.label}
                  <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
