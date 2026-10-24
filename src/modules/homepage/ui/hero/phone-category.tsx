import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { type CategoryTheme, categories, categoryColors } from "../constant";

interface PhoneCategoryCardProps {
  href: string;
  theme: CategoryTheme;
  title: string;
}

export function PhoneCategoryCard({
  title,
  theme,
  href,
}: PhoneCategoryCardProps) {
  const category = categories.find((item) => item.theme === theme);
  const Icon = category?.icon ?? ShoppingBag;

  return (
    <Link
      className={cn(
        "group rounded-xl border border-border/70 bg-muted/40 p-2",
        "transition-colors duration-200 hover:border-primary/30 hover:bg-accent",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
      href={href}
    >
      <span
        className={cn(
          "flex size-6 items-center justify-center rounded-md",
          "transition-transform duration-200 group-hover:scale-105",
          categoryColors[theme]
        )}
      >
        <Icon aria-hidden="true" className="size-3.5" />
      </span>

      <p className="mt-1.5 font-bold text-[9px] text-card-foreground leading-tight">
        {title}
      </p>

      <p className="mt-1 text-[8px] text-muted-foreground leading-tight">
        Explore products
      </p>
    </Link>
  );
}
