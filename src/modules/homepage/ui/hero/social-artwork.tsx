"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CirclePlay, Heart, Users, Zap } from "lucide-react";
import { useEffect, useRef } from "react";

const platforms = [
  {
    className: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400",
    icon: "instagram",
  },
  {
    className: "bg-slate-950",
    icon: "zap",
  },
  {
    className: "bg-red-600",
    icon: "video",
  },
] as const;

export function SocialArtwork() {
  const artworkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const artwork = artworkRef.current;

    if (
      artwork === null ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = artwork.querySelectorAll<HTMLElement>("[data-social-card]");
      const badge = artwork.querySelector<HTMLElement>("[data-social-badge]");
      const glow = artwork.querySelector<HTMLElement>("[data-social-glow]");
      const heart = artwork.querySelector<HTMLElement>("[data-social-heart]");

      const entrance = gsap.timeline({
        onComplete: () => {
          gsap.to(cards, {
            duration: 1.6,
            ease: "sine.inOut",
            repeat: -1,
            stagger: 0.2,
            y: -3,
            yoyo: true,
          });

          gsap.to(badge, {
            duration: 1.3,
            ease: "sine.inOut",
            repeat: -1,
            y: -3,
            yoyo: true,
          });

          gsap.to(glow, {
            autoAlpha: 0.8,
            duration: 2,
            ease: "sine.inOut",
            repeat: -1,
            scale: 1.2,
            yoyo: true,
          });

          gsap.to(heart, {
            duration: 0.7,
            ease: "sine.inOut",
            repeat: -1,
            scale: 1.18,
            yoyo: true,
          });
        },
        paused: true,
      });

      entrance
        .from(cards, {
          autoAlpha: 0,
          duration: 0.6,
          ease: "back.out(1.7)",
          rotation: (index) => [-18, 0, 18][index] ?? 0,
          scale: 0.7,
          stagger: 0.13,
          y: 18,
        })
        .from(
          badge,
          {
            autoAlpha: 0,
            duration: 0.4,
            ease: "back.out(2)",
            scale: 0.7,
            y: 8,
          },
          "-=0.25"
        );

      ScrollTrigger.create({
        once: true,
        onEnter: () => entrance.play(),
        start: "top 90%",
        trigger: artwork,
      });
    }, artwork);

    return () => ctx.revert();
  }, []);

  return (
    <div
      className="group relative flex min-h-24 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-violet-500/10 via-card to-blue-500/10"
      ref={artworkRef}
    >
      {/* Ambient lighting */}
      <div
        aria-hidden="true"
        className="absolute -top-8 left-1/2 size-24 -translate-x-1/2 rounded-full bg-violet-500/15 blur-2xl"
        data-social-glow
      />

      {/* Platform tiles */}
      <div className="relative flex -rotate-6 items-center gap-2">
        {platforms.map((platform) => (
          <span
            className={`relative flex size-11 items-center justify-center rounded-xl text-white shadow-lg ${platform.className}`}
            data-social-card
            key={platform.icon}
          >
            {platform.icon === "instagram" && (
              <span className="relative size-5 rounded-md border-2 border-white">
                <span className="absolute top-0.5 right-0.5 size-1 rounded-full bg-white" />
                <span className="absolute inset-1 rounded-full border border-white" />
              </span>
            )}

            {platform.icon === "zap" && (
              <Zap aria-hidden="true" className="size-6 fill-white" />
            )}

            {platform.icon === "video" && (
              <CirclePlay aria-hidden="true" className="size-6 fill-white" />
            )}
          </span>
        ))}
      </div>

      {/* Engagement badge */}
      <div
        className="absolute right-2.5 bottom-2 flex items-center gap-1.5 rounded-full border border-border/60 bg-card/90 px-2 py-1 font-semibold text-[9px] text-foreground shadow-sm backdrop-blur-sm"
        data-social-badge
      >
        <Users aria-hidden="true" className="size-3 text-violet-500" />
        SOCIAL
        <Heart
          aria-hidden="true"
          className="size-3 fill-rose-500 text-rose-500"
          data-social-heart
          ref={undefined}
        />
      </div>
    </div>
  );
}
