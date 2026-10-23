"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Radio, Signal } from "lucide-react";
import { useEffect, useRef } from "react";

const chipContacts = ["top-left", "top-right", "bottom-left", "bottom-right"];

function SimChip() {
  return (
    <div className="relative size-6 overflow-hidden rounded-[4px] border border-amber-300/80 bg-gradient-to-br from-amber-200 to-amber-500 p-px shadow-inner">
      <div className="grid size-full grid-cols-2 grid-rows-2 gap-px overflow-hidden rounded-[2px]">
        {chipContacts.map((contact) => (
          <span
            className="rounded-[1px] border border-amber-600/20 bg-gradient-to-br from-amber-100 to-amber-300"
            key={contact}
          />
        ))}
      </div>
      <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-amber-700/30" />
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-amber-700/30" />
    </div>
  );
}

export function SimArtwork() {
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
      const cards = artwork.querySelectorAll<HTMLElement>("[data-sim-card]");
      const glows = artwork.querySelectorAll<HTMLElement>("[data-sim-glow]");
      const signal = artwork.querySelector<HTMLElement>("[data-sim-signal]");

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

          gsap.to(glows, {
            autoAlpha: 0.8,
            duration: 2,
            ease: "sine.inOut",
            repeat: -1,
            scale: 1.15,
            stagger: 0.3,
            yoyo: true,
          });

          gsap.to(signal, {
            autoAlpha: 0.45,
            duration: 1.1,
            ease: "sine.inOut",
            repeat: -1,
            scale: 0.9,
            yoyo: true,
          });
        },
        paused: true,
      });

      entrance
        .from(cards, {
          autoAlpha: 0,
          duration: 0.65,
          ease: "back.out(1.7)",
          rotation: (index) => (index === 0 ? -20 : 16),
          scale: 0.8,
          stagger: 0.16,
          y: 18,
        })
        .from(
          signal,
          {
            autoAlpha: 0,
            duration: 0.4,
            ease: "back.out(2)",
            scale: 0.5,
          },
          "-=0.2"
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
      className="group relative flex min-h-24 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/10 via-card to-sky-500/20"
      ref={artworkRef}
    >
      {/* Ambient lighting */}
      <div
        aria-hidden="true"
        className="absolute -top-8 -left-4 size-24 rounded-full bg-background/70 blur-xl"
        data-sim-glow
      />

      <div
        aria-hidden="true"
        className="absolute -right-5 -bottom-8 size-20 rounded-full bg-sky-400/15 blur-2xl"
        data-sim-glow
      />

      {/* SIM cards */}
      <div className="relative flex -rotate-12 items-center gap-2">
        <div
          className="relative z-10 flex h-14 w-12 items-center justify-center overflow-hidden rounded-lg border border-blue-400/50 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-800 shadow-blue-950/20 shadow-lg"
          data-sim-card
        >
          <div className="absolute inset-x-1 top-1 h-px bg-white/30" />
          <SimChip />
          <span className="absolute right-1.5 bottom-1.5 size-1 rounded-full bg-sky-200/80" />
        </div>

        <div
          className="relative flex h-12 w-10 items-center justify-center rounded-lg border border-border bg-gradient-to-br from-card to-muted shadow-md"
          data-sim-card
        >
          <div className="absolute inset-x-1 top-1 h-px bg-foreground/10" />
          <SimChip />
        </div>
      </div>

      {/* Connectivity indicator */}
      <div
        className="absolute top-3 right-3 flex items-center justify-center rounded-full border border-border/70 bg-card/80 p-1.5 text-primary shadow-sm backdrop-blur-sm"
        data-sim-signal
      >
        <Signal aria-hidden="true" className="size-3.5" />
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 font-semibold text-[9px] text-muted-foreground/60 tracking-widest"
      >
        <Radio className="size-2.5" />
        CONNECT
      </div>
    </div>
  );
}
