"use client";

import "@/lib/styles/homepage.css";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Bot,
  ChartNoAxesCombined,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Cloud,
  Code2,
  GraduationCap,
  ListTodo,
  LockKeyhole,
  MessageCircle,
  Palette,
  ShieldCheck,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const productCategories = [
  {
    accent: "primary",
    description:
      "Premium AI subscriptions and creative copilots for faster work, better ideas, and cleaner output.",
    icon: Bot,
    label: "01 / WORK SMARTER",
    productCount: "24 tools",
    slug: "ai-tools",
    title: "AI Tools 🤖",
  },
  {
    accent: "secondary",
    description:
      "Reliable, high-speed privacy tools for secure browsing, streaming, and working anywhere.",
    icon: ShieldCheck,
    label: "02 / BROWSE FREELY",
    productCount: "18 providers",
    slug: "premium-vpns",
    title: "Premium VPNs",
  },
  {
    accent: "accent",
    description:
      "Professional tools for visual identity, content design, video, and your next polished launch.",
    icon: Palette,
    label: "03 / MAKE IT YOURS",
    productCount: "31 apps",
    slug: "design-creative",
    title: "Design & Creative",
  },
  {
    accent: "secondary",
    description:
      "Keep your planning, notes, teams, and everyday workflows moving without the busywork.",
    icon: ListTodo,
    label: "04 / STAY IN FLOW",
    productCount: "27 apps",
    slug: "productivity-apps",
    title: "Productivity Apps",
  },
  {
    accent: "primary",
    description:
      "Purpose-built subscriptions for writing, shipping, testing, and maintaining modern software.",
    icon: Code2,
    label: "05 / SHIP BETTER",
    productCount: "22 tools",
    slug: "developer-tools",
    title: "Developer Tools",
  },
  {
    accent: "accent",
    description:
      "Entertainment memberships for films, music, sports, and the shows everyone is talking about.",
    icon: Clapperboard,
    label: "06 / PRESS PLAY",
    productCount: "16 services",
    slug: "streaming-entertainment",
    title: "Streaming & Entertainment",
  },
  {
    accent: "secondary",
    description:
      "Analytics, scheduling, and workflow tools to turn consistent attention into measurable growth.",
    icon: ChartNoAxesCombined,
    label: "07 / GROW WITH INTENT",
    productCount: "19 tools",
    slug: "marketing-growth",
    title: "Marketing & Growth",
  },
  {
    accent: "primary",
    description:
      "Learn new skills with premium course platforms, study systems, and focused learning tools.",
    icon: GraduationCap,
    label: "08 / KEEP LEARNING",
    productCount: "14 platforms",
    slug: "education-learning",
    title: "Education & Learning",
  },
  {
    accent: "accent",
    description:
      "Extra storage, syncing, and sharing space for the files that matter to your work and life.",
    icon: Cloud,
    label: "09 / STORE MORE",
    productCount: "11 services",
    slug: "cloud-storage",
    title: "Cloud Storage",
  },
  {
    accent: "secondary",
    description:
      "Privacy-first tools that help protect accounts, identities, and the way you work online.",
    icon: LockKeyhole,
    label: "10 / STAY PROTECTED",
    productCount: "13 tools",
    slug: "security-privacy",
    title: "Security & Privacy",
  },
  {
    accent: "primary",
    description:
      "Scheduling, publishing, and audience tools for staying visible across the channels you use.",
    icon: MessageCircle,
    label: "11 / STAY CONNECTED",
    productCount: "17 tools",
    slug: "social-media-tools",
    title: "Social Media Tools",
  },
] as const;

const accentStyles = {
  accent: "from-accent/20 to-accent/0 text-accent group-hover:border-accent/40",
  primary:
    "from-primary/20 to-primary/0 text-primary group-hover:border-primary/40",
  secondary:
    "from-secondary/20 to-secondary/0 text-secondary group-hover:border-secondary/40",
} as const;

const AUTOPLAY_MS = 5000;

export function ProductCategories() {
  const [carousel, setCarousel] = useState<HTMLElement | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  // Bumped on every manual arrow click so the autoplay effect below
  // restarts its timer — without this, a click a moment before the next
  // scheduled tick caused an immediate second jump right after.
  const [lastInteraction, setLastInteraction] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = useCallback(
    (direction: "next" | "previous") => {
      if (!carousel) {
        return;
      }

      const scrollAmount = carousel.clientWidth * 0.8;
      const isAtEnd =
        carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 8;
      let targetScrollPosition = Math.max(
        0,
        carousel.scrollLeft - scrollAmount
      );

      if (direction === "next") {
        targetScrollPosition = isAtEnd ? 0 : carousel.scrollLeft + scrollAmount;
      }

      // Native smooth scrolling does exactly what the old gsap.to({
      // scrollLeft }) tween did, with no library involved — the browser
      // already animates this well.
      carousel.scrollTo({ behavior: "smooth", left: targetScrollPosition });
    },
    [carousel]
  );

  const showNextCategories = useCallback(() => {
    scrollCarousel("next");
  }, [scrollCarousel]);

  const showPreviousCategories = useCallback(() => {
    scrollCarousel("previous");
  }, [scrollCarousel]);

  const handleManualScroll = useCallback(
    (direction: "next" | "previous") => {
      scrollCarousel(direction);
      setLastInteraction(Date.now());
    },
    [scrollCarousel]
  );

  useGSAP(
    () => {
      if (!carousel) {
        return;
      }

      const timeline = gsap.timeline();

      timeline
        .fromTo(
          carousel.querySelectorAll("[data-category-card]"),
          { autoAlpha: 0, scale: 0.96, x: 32 },
          {
            autoAlpha: 1,
            duration: 0.55,
            ease: "power3.out",
            scale: 1,
            stagger: 0.07,
            x: 0,
          }
        )
        .fromTo(
          carousel.querySelectorAll("[data-category-icon]"),
          { rotate: -12, scale: 0.65 },
          {
            duration: 0.45,
            ease: "back.out(1.7)",
            rotate: 0,
            scale: 1,
            stagger: 0.07,
          },
          "<0.12"
        );
    },
    { dependencies: [carousel] }
  );

  // Autoplay — paused on hover so it never yanks the carousel away from
  // someone mid-read, and restarted from zero on every manual click via
  // the lastInteraction dependency.
  useEffect(() => {
    if (!carousel || isHovering) {
      return;
    }

    const autoplayTimer = window.setInterval(showNextCategories, AUTOPLAY_MS);

    return () => window.clearInterval(autoplayTimer);
  }, [carousel, showNextCategories, isHovering, lastInteraction]);

  // Thin scroll-progress indicator — mutates the bar's width directly via
  // ref rather than React state, since this fires on every scroll frame
  // and a state update per frame would be wasteful re-render churn.
  useEffect(() => {
    if (!carousel) {
      return;
    }

    const updateProgress = () => {
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      const progress = maxScroll > 0 ? carousel.scrollLeft / maxScroll : 0;
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${Math.min(100, Math.max(4, progress * 100))}%`;
      }
    };

    updateProgress();
    carousel.addEventListener("scroll", updateProgress, { passive: true });
    return () => carousel.removeEventListener("scroll", updateProgress);
  }, [carousel]);

  return (
    <section
      className="relative overflow-hidden border-border/60 border-y bg-card/35 py-20 sm:py-28"
      id="product-categories"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 -left-40 h-80 w-80 -translate-y-1/2 rounded-full bg-primary/7 blur-[100px]" />
        <div className="absolute -right-36 -bottom-48 h-96 w-96 rounded-full bg-accent/10 blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-360 px-5 sm:px-10 lg:px-18">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 font-mono text-[11px] text-primary tracking-[0.16em]">
              <span className="h-px w-7 bg-primary" />
              EXPLORE THE SHELF
            </div>
            <h2 className="mt-5 font-bold font-heading text-4xl text-foreground tracking-tight sm:text-5xl">
              Start with the asset
              <span className="text-muted-foreground">
                {" "}
                that fits your next move.
              </span>
            </h2>
          </div>

          <div className="flex items-end gap-5">
            <p className="max-w-md text-[15px] text-muted-foreground leading-relaxed">
              Every category is stocked and verified by the same in-house team.
              No mystery sellers, no handoffs between platforms.
            </p>
            <div className="hidden shrink-0 items-center gap-2 md:flex">
              <CategoryCarouselButton
                direction="previous"
                onClick={() => handleManualScroll("previous")}
              />
              <CategoryCarouselButton
                direction="next"
                onClick={() => handleManualScroll("next")}
              />
            </div>
          </div>
        </div>

        <div
          aria-label="Featured categories"
          aria-roledescription="carousel"
          className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          ref={setCarousel}
          role="region"
          tabIndex={0}
        >
          {productCategories.map((category) => {
            const Icon = category.icon;

            return (
              <a
                className="group relative min-h-82 min-w-[280px] snap-start overflow-hidden rounded-3xl border border-border/70 bg-card/70 p-6 shadow-[inset_0_1px_0_color-mix(in_oklab,var(--foreground)_5%,transparent)] transition-all duration-300 hover:-translate-y-1.5 hover:bg-card sm:min-w-[320px] sm:p-7 lg:min-w-[calc((100%-2rem)/3)]"
                data-category-card
                href={`/categories/${category.slug}`}
                key={category.slug}
              >
                <div
                  className={`absolute inset-x-0 top-0 h-40 bg-linear-to-b ${accentStyles[category.accent]}`}
                />
                <div className="relative flex h-full flex-col">
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-border/80 bg-background/70 backdrop-blur ${accentStyles[category.accent].split(" ")[2]}`}
                      data-category-icon
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.8} />
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                  </div>

                  <div className="mt-auto pt-12">
                    <p className="font-mono text-[10px] text-muted-foreground tracking-[0.13em]">
                      {category.label}
                    </p>
                    <h3 className="mt-3 font-bold font-heading text-2xl text-foreground tracking-tight">
                      {category.title}
                    </h3>
                    <p className="mt-3 max-w-xs text-muted-foreground text-sm leading-relaxed">
                      {category.description}
                    </p>
                    <div className="mt-6 flex items-center justify-between border-border/60 border-t pt-4">
                      <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-wide">
                        {category.productCount}
                      </span>
                      <span className="flex items-center gap-1.5 font-semibold text-[12px] text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                        Explore <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* scroll-progress — thin, mutated directly on scroll, no re-render */}
        <div className="mt-1 h-[3px] w-full overflow-hidden rounded-full bg-border/60">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-150 ease-out"
            ref={progressBarRef}
            style={{ width: "4%" }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between md:hidden">
          <p className="font-mono text-[10px] text-muted-foreground tracking-[0.13em]">
            SWIPE TO EXPLORE
          </p>
          <div className="flex items-center gap-2">
            <CategoryCarouselButton
              direction="previous"
              onClick={() => handleManualScroll("previous")}
            />
            <CategoryCarouselButton
              direction="next"
              onClick={() => handleManualScroll("next")}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col justify-between gap-4 rounded-2xl border border-border/70 bg-background/45 px-5 py-4 sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-center gap-3 text-muted-foreground text-sm">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <BadgeCheck className="h-4 w-4" />
            </span>
            Each listing is reviewed before it reaches the catalog.
          </div>
          <a
            className="group inline-flex items-center gap-2 font-semibold text-foreground text-sm transition-colors hover:text-primary"
            href="/categories"
          >
            View all categories
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}

function CategoryCarouselButton({
  direction,
  onClick,
}: {
  direction: "next" | "previous";
  onClick: () => void;
}) {
  const Icon = direction === "next" ? ChevronRight : ChevronLeft;

  return (
    <button
      aria-label={`Show ${direction} categories`}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
      onClick={onClick}
      type="button"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
