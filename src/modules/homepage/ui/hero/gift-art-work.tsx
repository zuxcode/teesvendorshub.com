"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Gift } from "lucide-react";
import { useEffect, useRef } from "react";

export function GiftArtwork() {
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
      const box = artwork.querySelector<HTMLElement>("[data-gift-box]");
      const lid = artwork.querySelector<HTMLElement>("[data-gift-lid]");
      const bow = artwork.querySelector<HTMLElement>("[data-gift-bow]");

      const glow = artwork.querySelector<HTMLElement>("[data-gift-glow]");

      const entrance = gsap.timeline({
        onComplete: () => {
          if (!(box && bow && lid)) {
            return;
          }

          gsap.to(box, {
            duration: 1.8,
            ease: "sine.inOut",
            repeat: -1,
            y: -3,
            yoyo: true,
          });

          gsap.to(bow, {
            duration: 1.2,
            ease: "sine.inOut",
            repeat: -1,
            rotation: 4,
            transformOrigin: "50% 100%",
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
        },
        paused: true,
      });

      entrance
        .from(box, {
          autoAlpha: 0,
          duration: 0.65,
          ease: "back.out(1.7)",
          scale: 0.85,
          y: 18,
        })
        .from(
          bow,
          {
            autoAlpha: 0,
            duration: 0.45,
            ease: "back.out(2)",
            rotation: -20,
            y: 8,
          },
          "-=0.35"
        )
        .from(
          lid,
          {
            duration: 0.4,
            ease: "power2.out",
            rotation: -8,
            y: 8,
          },
          "-=0.3"
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
      className="group relative flex min-h-24 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-rose-500/10 via-card to-rose-500/20"
      ref={artworkRef}
    >
      {/* Ambient decoration */}
      <div
        aria-hidden="true"
        className="absolute -top-7 -right-5 size-20 rounded-full bg-rose-400/10 blur-2xl"
        data-gift-glow
        ref={undefined}
      />

      {/* Gift box */}
      <div className="relative h-[4.25rem] w-[4.5rem]" data-gift-box>
        {/* Bow */}
        <div
          aria-hidden="true"
          className="absolute -top-2 left-1/2 z-20 flex -translate-x-1/2 items-end"
          data-gift-bow
        >
          <span className="relative -mr-0.5 h-4 w-5 rotate-[25deg] rounded-tl-full rounded-tr-full border-[5px] border-rose-400 border-b-0" />
          <span className="relative -ml-0.5 h-4 w-5 -rotate-[25deg] rounded-tl-full rounded-tr-full border-[5px] border-rose-500 border-b-0" />
          <span className="absolute bottom-0 left-1/2 size-2.5 -translate-x-1/2 rounded-full bg-rose-400 shadow-sm" />
        </div>

        {/* Box body */}
        <div className="absolute inset-x-0 top-5 bottom-0 overflow-hidden rounded-b-lg bg-gradient-to-br from-rose-500 to-rose-700 shadow-lg shadow-rose-950/15">
          <div className="absolute inset-y-0 left-1/2 w-3.5 -translate-x-1/2 bg-rose-200/90" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-rose-950/15 to-transparent" />
          <div className="absolute inset-x-1 top-1 h-px bg-white/30" />
        </div>

        {/* Lid */}
        <div
          className="absolute inset-x-[-3px] top-4 z-10 h-3 rounded-sm bg-gradient-to-b from-rose-300 to-rose-400 shadow-sm"
          data-gift-lid
        >
          <div className="absolute inset-y-0 left-1/2 w-3.5 -translate-x-1/2 bg-rose-100" />
          <div className="absolute inset-x-1 top-px h-px bg-white/60" />
        </div>
      </div>

      {/* Gift accent */}
      <Gift
        aria-hidden="true"
        className="absolute bottom-3 left-1/2 size-3 -translate-x-1/2 text-rose-500/30"
      />
    </div>
  );
}
