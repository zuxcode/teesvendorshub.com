// "use client";
import { ArrowRight, ArrowUpRight, BadgeCheck, Check } from "lucide-react";
import Link from "next/link";

/**
 * components/tees-ui/featured-product.tsx
 *
 * Autoplay via a single CSS keyframe (translateX loop) on a duplicated
 * card list — no React state, no interval, no carousel library. Pauses
 * on hover and respects prefers-reduced-motion. Still no "use client":
 * nothing here needs the client at all.
 *
 * One honest tradeoff: hover-pause covers mouse users, but a
 * continuously-moving marquee has no built-in pause control for
 * keyboard/touch users, which matters for WCAG 2.2.2 (Pause, Stop,
 * Hide) if this ships publicly. If that matters for launch, the
 * simplest fix is a single pause/play icon button — say the word and
 * I'll add it back in; leaving it out for now since you asked to keep
 * this version minimal.
 */

const featuredProducts = [
  {
    audience: "lifestyle · community",
    benefits: ["Original email included", "Clean account history"],
    description:
      "A warm, loyal audience with consistent organic engagement, ready for a new creative direction.",
    established: "3 yrs",
    initials: "AF",
    name: "Autumn Folk",
    platform: "INSTAGRAM",
    price: "$1,850",
    slug: "autumn-folk",
  },
  {
    audience: "beauty · editorial",
    benefits: ["Original email included", "No policy strikes"],
    description:
      "A polished beauty audience built around thoughtful product discovery, with strong repeat engagement.",
    established: "2 yrs",
    initials: "OS",
    name: "Olive Studio",
    platform: "INSTAGRAM",
    price: "$1,420",
    slug: "olive-studio",
  },
  {
    audience: "travel · culture",
    benefits: ["Original email included", "Clean account history"],
    description:
      "An active travel community with a clear point of view and steady high-intent engagement.",
    established: "4 yrs",
    initials: "RD",
    name: "Roam Daily",
    platform: "INSTAGRAM",
    price: "$2,240",
    slug: "roam-daily",
  },
] as const;

// Duplicated so the loop reads as continuous — the animation slides
// exactly one copy's width (-50%) before snapping back unnoticed.
const marqueeItems = [...featuredProducts, ...featuredProducts];

export function FeaturedProduct() {
  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-28">
      <div className="pointer-events-none absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-secondary/8 blur-[120px]" />

      <div className="relative mx-auto max-w-360 px-5 sm:px-10 lg:px-18">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-secondary tracking-[0.16em]">
              <span className="h-px w-7 bg-secondary" />
              CURATED THIS WEEK
            </div>
            <h2 className="mt-5 font-bold font-heading text-4xl text-foreground tracking-tight sm:text-5xl">
              Fresh listings,
              <span className="text-muted-foreground"> on rotation.</span>
            </h2>
          </div>
          <Link
            className="group inline-flex items-center gap-2 font-semibold text-muted-foreground text-sm transition-colors hover:text-foreground"
            href="/products"
          >
            Browse all products
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      <div className="marquee-mask relative mt-12">
        <div className="marquee-track flex w-max gap-6 px-5 sm:px-10 lg:px-18">
          {marqueeItems.map((product, index) => (
            <article
              className="flex w-[300px] shrink-0 flex-col overflow-hidden rounded-3xl border border-border bg-card transition-colors hover:border-primary/40 sm:w-[320px]"
              key={`${product.slug}-${
                // biome-ignore lint/suspicious/noArrayIndexKey: <Silent>
                index
              }`}
            >
              {/* banner */}
              <div className="relative h-28 overflow-hidden border-border/70 border-b p-4">
                <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(color-mix(in_oklab,var(--secondary)_25%,transparent)_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-secondary/10 via-transparent to-primary/8" />

                <div className="relative flex items-center justify-between">
                  <span className="rounded-full border border-border bg-background/60 px-2.5 py-1 font-mono text-[10px] text-muted-foreground tracking-wide">
                    {product.platform}
                  </span>
                  <BadgeCheck className="h-4 w-4 text-primary" />
                </div>

                <div className="absolute -bottom-6 left-4 flex h-14 w-14 items-center justify-center rounded-2xl border-4 border-card bg-linear-to-br from-secondary to-accent font-bold font-heading text-lg text-secondary-foreground shadow-lg">
                  {product.initials}
                </div>
              </div>

              {/* content */}
              <div className="flex flex-1 flex-col px-5 pt-9 pb-5">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-foreground">{product.name}</p>
                  <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                    {product.established}
                  </span>
                </div>
                <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                  {product.audience}
                </p>

                <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                  {product.description}
                </p>

                <ul className="mt-4 space-y-1.5">
                  {product.benefits.map((benefit) => (
                    <li
                      className="flex items-center gap-2 text-muted-foreground text-xs"
                      key={benefit}
                    >
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check className="h-2.5 w-2.5" />
                      </span>
                      {benefit}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex items-center justify-between border-border/60 border-t pt-4">
                  <div>
                    <p className="font-mono text-[9px] text-muted-foreground tracking-[0.1em]">
                      ASKING PRICE
                    </p>
                    <p className="font-bold font-heading text-foreground text-xl">
                      {product.price}
                    </p>
                  </div>
                  <Link
                    aria-label={`View ${product.name} details`}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:-translate-y-0.5"
                    href={`/products/${product.slug}`}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee 34s linear infinite;
        }
        .marquee-mask:hover .marquee-track {
          animation-play-state: paused;
        }
        .marquee-mask {
          overflow: hidden;
          -webkit-mask-image: linear-gradient(
            to right,
            transparent,
            black 6%,
            black 94%,
            transparent
          );
          mask-image: linear-gradient(
            to right,
            transparent,
            black 6%,
            black 94%,
            transparent
          );
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
