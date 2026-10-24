"use client";

import gsap from "gsap";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { CategoryTheme } from "../constant";
import { GiftArtwork } from "./gift-art-work";
import { SimArtwork } from "./sim-art-work";
import { SocialArtwork } from "./social-artwork";
import { SubscriptionArtwork } from "./subcription-art-work";

interface FloatingCategoryCardProps {
  animationDelay?: number;
  className: string;
  href: string;
  theme: CategoryTheme;
  title: string;
}

function CategoryArtwork({ theme }: { theme: CategoryTheme }) {
  switch (theme) {
    case "rose":
      return <GiftArtwork />;
    case "blue":
      return <SimArtwork />;
    case "violet":
      return <SubscriptionArtwork />;
    case "emerald":
      return <SocialArtwork />;
    default:
      return null;
  }
}

export function FloatingCategoryCard({
  title,
  theme,
  className,
  href,
  animationDelay = 0,
}: FloatingCategoryCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const card = cardRef.current;

    if (
      card === null ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        card,
        {
          autoAlpha: 0,
          scale: 0.92,
          y: 22,
        },
        {
          autoAlpha: 1,
          delay: animationDelay,
          duration: 0.7,
          ease: "back.out(1.5)",
          onComplete: () => {
            gsap.to(card, {
              duration: 2.2,
              ease: "sine.inOut",
              repeat: -1,
              y: -5,
              yoyo: true,
            });
          },
          scale: 1,
          y: 0,
        }
      );
    }, card);

    return () => ctx.revert();
  }, [animationDelay]);

  return (
    <Link
      className={cn(
        "absolute z-10 w-40 rounded-2xl border border-border/70 bg-card/95 p-2.5",
        "shadow-foreground/5 shadow-xl backdrop-blur-md",
        "transition-[border-color,box-shadow] duration-300",
        "hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "sm:w-48",
        className
      )}
      href={href}
      ref={cardRef}
    >
      <CategoryArtwork theme={theme} />

      <p className="mt-2 font-semibold text-card-foreground text-xs">{title}</p>
    </Link>
  );
}
