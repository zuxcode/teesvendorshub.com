import type { TeesLink } from "../types";

export const DOMAIN = "teesvendorshub.com" as const;
export const BRAND_NAME = "TeesVendorsHub" as const;

export const CONTACT_LINKS = {
  instagram: "https://www.instagram.com/tees_vendors_hub",
  SERVICE_EMAIL: `tees@${DOMAIN}`,
  supportMail: `support@${DOMAIN}`,
  supportTeam: "https://t.me/teesvendorshub",
  telegram: "https://t.me/Teesvendors",
  whatsapp: "https://chat.whatsapp.com/Cs8rWf3iYzZ5Eltcdkp7eg",
} as const;

export const SHOP_LINKS: TeesLink[] = [
  {
    disable: false,
    exact: true,
    href: "/dashboard/products",
    label: "Products",
    tag: "NEW",
  },
  {
    disable: false,
    exact: true,
    href: "/dashboard/sims",
    label: "Sims",
  },
];

export const ACCOUNT_LINKS: TeesLink[] = [
  {
    disable: false,
    exact: true,
    href: "/dashboard",
    label: "Dashboard",
  },
  {
    disable: false,
    exact: false,
    href: "/dashboard/orders",
    label: "Orders",
  },
];

export const FOOTER_LINKS: TeesLink[] = [
  {
    disable: false,
    exact: true,
    href: "/about",
    label: "About",
  },
  {
    disable: false,
    exact: true,
    href: "/rules",
    label: "Rules",
  },
  {
    disable: false,
    exact: true,
    href: "/disclaimer",
    label: "Disclaimer",
  },
  {
    disable: false,
    exact: false,
    href: CONTACT_LINKS.telegram,
    label: "Contact",
  },
  {
    disable: true,
    exact: true,
    href: "/refer-and-earn",
    label: "Refer & Earn",
  },
];

export const QUERY_TIMEOUT = 10_000;
