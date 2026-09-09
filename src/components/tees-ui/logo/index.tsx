"use client";

import Image, { type ImageProps } from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

type LogoSize = "xs" | "sm" | "md" | "lg" | "xl";

interface LogoProps extends Omit<Partial<ImageProps>, "alt"> {
  alt?: string;
  hoverEffect?: boolean;
  href?: string;
  size?: LogoSize;
  textHidden?: boolean;
}

const LOGO_SIZE_CLASSES: Record<LogoSize, string> = {
  lg: "h-40 w-40",
  md: "h-30 w-30",
  sm: "h-20 w-20",
  xl: "h-50 w-50",
  xs: "h-8 w-8",
};

export function TeesLogo({
  className,
  href = "/",
  textHidden = false,
  size = "md",
  src = "/images/logo.png",
  alt = "Tees Vendors Hub Logo",
  width = 120,
  height = 120,
  hoverEffect = true,
  ...props
}: LogoProps) {
  return (
    <Link
      aria-label="Go to homepage"
      className="group relative flex items-center"
      href={href}
    >
      <Image
        {...props}
        alt={alt}
        className={cn(
          "object-contain",
          LOGO_SIZE_CLASSES[size],
          hoverEffect &&
            "transition-transform duration-300 group-hover:scale-105",
          className
        )}
        height={height}
        loading="eager"
        src={src}
        width={width}
      />

      <span
        className={cn(
          "bg-linear-to-r from-foreground to-primary bg-clip-text font-semibold text-transparent tracking-tight",
          textHidden && "hidden"
        )}
      >
        TeesVendorsHub
      </span>
    </Link>
  );
}
