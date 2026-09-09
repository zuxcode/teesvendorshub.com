import {
  ArrowUpRight,
  BadgeCheck,
  ShapesIcon,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import "@/lib/styles/homepage.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background font-sans">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[-8%] left-[2%] h-[38vw] w-[38vw] animate-blob-1 rounded-full bg-secondary/40 blur-[90px]" />
        <div className="absolute top-[8%] right-[-6%] h-[34vw] w-[34vw] animate-blob-2 rounded-full bg-accent/30 blur-[90px]" />
        <div className="absolute bottom-[-10%] left-[30%] h-[26vw] w-[26vw] animate-blob-3 rounded-full bg-primary/15 blur-[90px]" />
      </div>
      <div
        className="mask-[radial-gradient(ellipse_80%_60%_at_50%_20%,black_20%,transparent_75%)] pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(color-mix(in oklab, var(--border) 35%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, var(--border) 35%, transparent) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 mx-auto grid max-w-360 grid-cols-1 items-center gap-10 px-5 pt-8 pb-10 sm:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:px-18 lg:pt-16">
        <div>
          <Badge
            className="anim-fade-up gap-2 rounded-full border-border bg-card/60 py-1.5 pr-3.5 pl-2 font-mono font-normal text-muted-foreground text-xs delay-1"
            variant="outline"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Single-source · every asset verified in-house
          </Badge>

          <h1 className="mt-6 font-bold font-heading text-[2.6rem] text-foreground leading-[0.99] tracking-tight sm:text-6xl lg:text-[4.4rem]">
            <span className="block overflow-hidden">
              <span className="anim-reveal-line block delay-2">
                Social assets,
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="anim-reveal-line block delay-3">
                sourced and sold
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="anim-reveal-line block bg-linear-to-r from-primary via-primary to-secondary bg-clip-text text-transparent delay-4">
                by one team, direct.
              </span>
            </span>
          </h1>

          <p className="anim-fade-up mt-6 max-w-120 text-[17px] text-muted-foreground leading-relaxed delay-5">
            No third-party resellers, no marketplace noise. TeesVendorsHub is
            the direct storefront for brand-ready social media logs and accounts
            — every listing captured, checked, and delivered by our own team.
          </p>

          <div className="anim-fade-up mt-8 flex flex-wrap items-center gap-4 delay-6">
            <Link href="/dashboard/sim">
              <Button
                className="group rounded-full bg-linear-to-r from-primary to-secondary font-bold text-primary-foreground hover:shadow-[0_14px_34px_color-mix(in_oklab,var(--primary)_28%,transparent)]"
                size="lg"
              >
                Browse the catalog
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
            </Link>
            <Button
              className="rounded-full border-border bg-card/60 backdrop-blur-md hover:border-foreground/20 hover:bg-card"
              size="lg"
              variant="outline"
            >
              <span className="flex h-5.5 w-5.5 items-center justify-center rounded-full border border-border">
                <ShapesIcon className="h-2.5 w-2.5 fill-current" />
              </span>
              View Categories
            </Button>
          </div>

          <div className="anim-fade-up mt-11 flex flex-wrap items-center gap-6 delay-7">
            <div className="flex items-center gap-2 text-[13.5px] text-muted-foreground">
              <BadgeCheck className="h-4 w-4 text-primary" />
              <span>
                <b className="font-bold text-foreground">100%</b> in-house
                sourced, no resellers
              </span>
            </div>
            <div className="flex items-center gap-2 text-[13.5px] text-muted-foreground">
              <Zap className="h-4 w-4 text-secondary" />
              <span>
                <b className="font-bold text-foreground">Instant</b> delivery
                after purchase
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div
            className="anim-fade-in-scale stage relative aspect-[1/1.05] w-full overflow-hidden rounded-[28px] border border-border bg-linear-to-br from-card to-card/40 backdrop-blur-xl delay-2"
            style={{
              boxShadow:
                "0 30px 80px -20px rgba(0,0,0,0.6), inset 0 1px 0 color-mix(in oklab, var(--foreground) 6%, transparent)",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(color-mix(in oklab, var(--border) 40%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, var(--border) 40%, transparent) 1px, transparent 1px)",
                backgroundSize: "36px 36px",
              }}
            />
            <div className="absolute inset-[14%] rounded-full border border-border border-dashed" />
            <div className="absolute inset-[14%] animate-orbit-spin">
              <span
                className="absolute top-0 left-1/2 h-2.25 w-2.25 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary"
                style={{ boxShadow: "0 0 12px var(--secondary)" }}
              />
            </div>

            {/* stat chip — CSS scale-in entrance + continuous glow pulse */}
            <div className="anim-fade-in-scale absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 animate-chip-pulse rounded-2xl border border-primary/30 bg-primary/8 px-6 py-4 text-center backdrop-blur-md delay-7">
              <div className="font-bold font-heading text-[26px] text-primary">
                2,300+
              </div>
              <div className="mt-0.5 font-mono text-[10.5px] text-muted-foreground tracking-wide">
                ASSETS DELIVERED
              </div>
            </div>

            {/* floating cards — CSS fade-up entrance, then idle bob loop */}
            <div className="anim-fade-up absolute top-[9%] left-[8%] flex w-[76%] animate-float-1 items-center gap-3 rounded-2xl border border-border bg-card/75 p-3.5 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.5)] backdrop-blur-lg delay-6">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-linear-to-br from-primary to-secondary text-base">
                ⌁
              </span>
              <div>
                <div className="font-bold text-[13px] text-foreground">
                  Verified Brand Page
                </div>
                <div className="font-mono text-[11px] text-muted-foreground">
                  50K followers · active
                </div>
              </div>
            </div>

            <div className="anim-fade-up absolute right-[-4%] bottom-[22%] flex w-[62%] animate-float-2 items-center gap-3 rounded-2xl border border-border bg-card/75 p-3.5 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.5)] backdrop-blur-lg delay-7">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-linear-to-br from-accent to-secondary text-base">
                ◈
              </span>
              <div>
                <div className="font-bold text-[13px] text-foreground">
                  Engagement Log
                </div>
                <div className="font-mono text-[11px] text-muted-foreground">
                  full export · CSV
                </div>
              </div>
            </div>

            <div className="anim-fade-up absolute bottom-[6%] left-[2%] flex w-[52%] animate-float-3 items-center gap-3 rounded-2xl border border-border bg-card/75 p-3.5 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.5)] backdrop-blur-lg delay-8">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-linear-to-br from-destructive to-primary text-base">
                ✦
              </span>
              <div>
                <div className="font-bold text-[13px] text-foreground">
                  Ownership Transfer
                </div>
                <div className="font-mono text-[11px] text-muted-foreground">
                  included, free
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
