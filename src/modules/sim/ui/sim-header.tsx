import {
  ArrowRight,
  Globe2,
  Headphones,
  Radio,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    description: "Stay connected",
    icon: Globe2,
    title: "Wide Coverage",
  },
  {
    description: "Get online faster",
    icon: Zap,
    title: "Quick Activation",
  },
  {
    description: "Connection you trust",
    icon: ShieldCheck,
    title: "Reliable Network",
  },
  {
    description: "We're here to help",
    icon: Headphones,
    title: "Customer Support",
  },
];

export function SimStoreHeader() {
  return (
    <section
      aria-labelledby="sim-store-heading"
      className="relative isolate overflow-hidden bg-linear-to-br from-background via-background to-primary/10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-24 size-96 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="grid items-center gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-4 lg:px-10 lg:py-12">
        <div className="relative z-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 font-medium text-primary text-sm">
            <Radio className="size-4" />
            SIM Store
          </div>

          <h1
            className="max-w-xl font-bold text-3xl tracking-tight sm:text-4xl lg:text-5xl"
            id="sim-store-heading"
          >
            Stay connected,
            <span className="block text-primary">wherever life takes you.</span>
          </h1>

          <p className="mt-4 max-w-lg text-muted-foreground text-sm leading-6 sm:text-base sm:leading-7">
            Find the right SIM for your needs. Explore eSIMs and physical SIM
            cards with reliable connectivity and straightforward pricing.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 font-semibold text-primary-foreground text-sm transition-opacity hover:opacity-90"
              href="#sim-products"
            >
              Explore SIMs
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4 lg:gap-x-5">
            {features.map(({ icon: Icon, title, description }) => (
              <div className="min-w-0" key={title}>
                <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon aria-hidden="true" className="size-5" />
                </div>
                <p className="font-semibold text-sm">{title}</p>
                <p className="mt-1 text-muted-foreground text-xs leading-5">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div
          aria-hidden="true"
          className="relative mx-auto flex aspect-5/4 w-full max-w-md items-center justify-center lg:max-w-none"
        >
          <div className="absolute size-[78%] rounded-full border border-primary/10 bg-primary/3" />
          <div className="absolute size-[62%] rounded-full border border-primary/20 border-dashed" />

          <div className="absolute top-[14%] right-[14%] flex size-14 items-center justify-center rounded-2xl border bg-background/80 text-primary shadow-sm backdrop-blur-sm">
            <Globe2 className="size-7" />
          </div>

          <div className="absolute top-[25%] left-[12%] flex size-10 items-center justify-center rounded-xl border bg-background/80 text-primary shadow-sm">
            <Radio className="size-5" />
          </div>

          <div className="relative flex h-56 w-44 -rotate-6 items-center justify-center rounded-2xl border bg-background shadow-xl sm:h-64 sm:w-48">
            <div className="absolute inset-3 rounded-xl border border-primary/10 bg-primary/4" />
            <div className="relative flex flex-col items-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <Globe2 className="size-9" />
              </div>
              <div className="text-center">
                <p className="font-bold text-lg tracking-wide">SIM</p>
                <p className="text-muted-foreground text-xs">Stay connected</p>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {Array.from({ length: 9 }, (_, index) => (
                  <span
                    className="size-2 rounded-sm bg-primary/30"
                    // biome-ignore lint/suspicious/noArrayIndexKey: <fix position item>
                    key={index}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="absolute right-[8%] bottom-[10%] flex h-36 w-28 rotate-12 items-center justify-center rounded-xl border bg-primary p-3 text-primary-foreground shadow-xl sm:h-40 sm:w-32">
            <div className="flex flex-col items-center gap-3">
              <Zap className="size-8" />
              <div className="h-12 w-14 rounded-lg border border-primary-foreground/30 bg-primary-foreground/15" />
              <span className="font-semibold text-xs tracking-widest">
                eSIM
              </span>
            </div>
          </div>

          <div className="absolute bottom-[8%] left-[14%] size-3 rounded-full bg-primary/40 blur-[1px]" />
          <div className="absolute top-[42%] right-[12%] size-2 rounded-full bg-primary/50" />
        </div>
      </div>
    </section>
  );
}
