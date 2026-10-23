"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ChevronRight,
  CirclePlay,
  Gift,
  Smartphone,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

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

const categoryColors = {
  blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
} as const;

export function CategoryStrip() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (
      section === null ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from("[data-category-card]", {
        autoAlpha: 0,
        duration: 0.65,
        ease: "power3.out",
        scrollTrigger: {
          once: true,
          start: "top 85%",
          trigger: section,
        },
        stagger: 0.12,
        y: 24,
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      aria-label="Shop by category"
      className="relative z-20 mx-auto max-w-360 px-5 pb-8 sm:px-8 lg:px-12 lg:pb-12"
      ref={sectionRef}
    >
      <div
        className="grid overflow-hidden rounded-2xl border border-border bg-card/90 shadow-foreground/5 shadow-sm backdrop-blur-sm sm:grid-cols-2 lg:grid-cols-4"
        id="categories"
      >
        {categories.map((category, index) => {
          const Icon = category.icon;

          return (
            <Link
              className={cn(
                "group flex min-h-28 items-center gap-4 px-5 py-5 transition-colors hover:bg-accent sm:px-6",
                index < categories.length - 1 &&
                  "border-border border-b sm:border-r lg:border-b-0",
                index === 1 && "sm:border-r-0 lg:border-r"
              )}
              data-category-card
              href={category.href}
              key={category.title}
            >
              <span
                className={cn(
                  "flex size-13.5 shrink-0 items-center justify-center rounded-full transition-transform group-hover:scale-105",
                  categoryColors[category.theme]
                )}
              >
                <Icon aria-hidden="true" className="size-6" strokeWidth={1.8} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block font-bold text-foreground text-sm leading-snug">
                  {category.title}
                </span>

                <span className="mt-1.5 block text-muted-foreground text-xs leading-relaxed">
                  {category.description}
                </span>
              </span>

              <ChevronRight
                aria-hidden="true"
                className="size-4 shrink-0 text-primary transition-transform group-hover:translate-x-1"
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
