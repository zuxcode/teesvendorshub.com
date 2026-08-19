"use client";

import Image, { type ImageProps } from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoSize = "xs" | "sm" | "md" | "lg" | "xl";

interface LogoProps extends Partial<ImageProps> {
  background?: boolean;
  hoverEffect?: boolean;
  href?: string;
  size?: LogoSize;
}

export function TeesLogo({
  className,
  href = "/",
  background = true,
  size = "md",
  src = "/images/logo.png",
  alt = "Tees Vendors Hub Logo",
  width,
  height,
  hoverEffect = true,
  ...props
}: LogoProps) {
  // Predefined size classes (optimized for React 19 memoization)
  const sizeClasses = {
    lg: "h-40 w-40",
    md: "h-30 w-30",
    sm: "h-20 w-20",
    xl: "h-50 w-50",
    xs: "h-8 w-8",
  } as Record<LogoSize, string>;

  // React 19: Compiler optimizes this automatically
  const currentSize = sizeClasses[size];

  return (
    <Link
      aria-label="Go to homepage"
      className="group relative flex items-center"
      href={href}
    >
      <Image
        alt={alt}
        className={cn(
          "object-contain",
          currentSize,
          hoverEffect
            ? "transition-transform duration-300 group-hover:scale-105"
            : "",
          className
        )}
        height={height ?? 120}
        src={src}
        width={width ?? 120}
        {...props}
      />
      <span className="font-semibold text-foreground tracking-tight">
        Tees
        <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          VendorsHub
        </span>
      </span>
    </Link>
  );
}
