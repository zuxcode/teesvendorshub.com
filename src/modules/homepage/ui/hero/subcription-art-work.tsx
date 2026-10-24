"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MonitorPlay, Play } from "lucide-react";
import { useEffect, useRef } from "react";

export function SubscriptionArtwork() {
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
      const content = artwork.querySelector("[data-subscription-content]");
      const playButton = artwork.querySelector("[data-subscription-play]");
      const glow = artwork.querySelector("[data-subscription-glow]");
      const badge = artwork.querySelector("[data-subscription-badge]");

      const entrance = gsap.timeline({
        onComplete: () => {
          gsap.to(glow, {
            autoAlpha: 0.75,
            duration: 2.4,
            ease: "sine.inOut",
            repeat: -1,
            scale: 1.2,
            yoyo: true,
          });

          gsap.to(playButton, {
            duration: 1.4,
            ease: "sine.inOut",
            repeat: -1,
            scale: 1.08,
            yoyo: true,
          });

          gsap.to(badge, {
            duration: 1.8,
            ease: "sine.inOut",
            repeat: -1,
            y: -2,
            yoyo: true,
          });
        },
        paused: true,
      });

      entrance
        .from(content, {
          autoAlpha: 0,
          duration: 0.65,
          ease: "power3.out",
          scale: 0.92,
          y: 12,
        })
        .from(
          playButton,
          {
            autoAlpha: 0,
            duration: 0.5,
            ease: "back.out(2)",
            rotation: -25,
            scale: 0.5,
          },
          "-=0.25"
        )

        .from(
          badge,
          {
            autoAlpha: 0,
            duration: 0.35,
            ease: "power2.out",
            y: 8,
          },
          "-=0.15"
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
      className="group relative flex min-h-24 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-slate-950 via-neutral-950 to-slate-800"
      ref={artworkRef}
    >
      {/* Cinematic lighting */}
      <div
        aria-hidden="true"
        className="absolute -top-10 left-1/2 size-28 -translate-x-1/2 rounded-full bg-red-600/25 blur-3xl"
        data-subscription-glow
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/[0.03]"
      />

      {/* Streaming service branding */}
      <div
        className="relative flex flex-col items-center"
        data-subscription-content
      >
        <span className="font-black text-2xl text-red-500 tracking-tight drop-shadow-[0_2px_12px_rgba(239,68,68,0.25)]">
          NETFLIX
        </span>

        <span className="mt-1 font-semibold text-[8px] text-white/50 tracking-[0.35em]">
          STREAM WITHOUT LIMITS
        </span>
      </div>

      {/* Play button */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 right-4 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white shadow-lg backdrop-blur-md transition-colors group-hover:bg-red-500"
        data-subscription-play
      >
        <Play className="ml-0.5 size-3.5 fill-current" />
      </div>

      {/* Access badge */}
      <div
        className="absolute right-3 bottom-2 flex items-center gap-1.5 rounded-md border border-white/10 bg-white/10 px-2 py-1 font-medium text-[9px] text-white/80 backdrop-blur-md"
        data-subscription-badge
      >
        <MonitorPlay aria-hidden="true" className="size-3 text-red-400" />
        DIGITAL ACCESS
      </div>

      {/* Bottom accent */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-red-500/70 to-transparent"
      />
    </div>
  );
}
