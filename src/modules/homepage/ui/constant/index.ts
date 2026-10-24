import { CirclePlay, Gift, Smartphone, Users } from "lucide-react";

export const categories = [
  {
    description: "Thoughtful gifts for every occasion",
    href: "/shop/gifts",
    icon: Gift,
    theme: "rose",
    title: "Gifts & accessories",
  },
  {
    description: "Physical SIMs and digital eSIMs",
    href: "/shop/sim-esim",
    icon: Smartphone,
    theme: "blue",
    title: "SIM & eSIM",
  },
  {
    description: "Streaming, VPS and more",
    href: "/shop/digital-services",
    icon: CirclePlay,
    theme: "violet",
    title: "Digital subscriptions",
  },
  {
    description: "Explore available listings",
    href: "/shop/social-accounts",
    icon: Users,
    theme: "emerald",
    title: "Social media accounts & pages",
  },
] as const;

export const categoryColors = {
  blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
} as const;

export type CategoryTheme = (typeof categories)[number]["theme"];
