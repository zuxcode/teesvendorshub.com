import {
  ArrowRight,
  Headset,
  type LucideIcon,
  ShieldCheck,
  Truck,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function TrustItem({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="size-5" strokeWidth={1.8} />
      </span>

      <div>
        <p className="font-bold text-foreground text-xs">{title}</p>
        <p className="mt-1 text-[11px] text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function HeroContent() {
  return (
    <div className="relative z-20 max-w-142.5">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-4 py-2 font-semibold text-primary text-xs sm:text-sm">
        <Zap className="size-4 fill-current" />
        Your all-in-one marketplace
      </div>

      <h1 className="font-extrabold text-[clamp(3.4rem,6.1vw,5.6rem)] text-foreground leading-[0.99] tracking-[-0.065em]">
        More than a
        <br />
        marketplace<span className="text-primary">.</span>
      </h1>

      <p className="mt-7 max-w-125 text-base text-muted-foreground leading-8 sm:text-lg sm:leading-[1.85]">
        Shop gifts, get connected with SIM and eSIM, explore digital
        subscriptions, and discover social media accounts and pages — all in one
        place.
      </p>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Link href="/dashboard/products">
          <Button
            className="h-13.5 rounded-xl px-7 font-semibold text-sm shadow-lg shadow-primary/20"
            size="lg"
          >
            Explore marketplace
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </Link>

        <Button
          className="h-13.5 rounded-xl border-primary/60 px-7 font-semibold text-primary text-sm hover:bg-primary/5 hover:text-primary"
          size="lg"
          variant="outline"
        >
          <Link href="#categories">Browse categories</Link>
        </Button>
      </div>

      <div className="mt-10 grid max-w-140 grid-cols-1 gap-5 border-border border-t pt-7 sm:grid-cols-3 sm:gap-4">
        <TrustItem
          description="Shop with confidence"
          icon={ShieldCheck}
          title="Secure checkout"
        />

        <TrustItem
          description="For physical products"
          icon={Truck}
          title="Delivery options"
        />

        <TrustItem
          description="We're here to help"
          icon={Headset}
          title="Customer support"
        />
      </div>
    </div>
  );
}
