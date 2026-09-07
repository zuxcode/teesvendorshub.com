/**
 * Brand identity constants used by emails and external surfaces.
 *
 * Keep these values independent from UI theme tokens because
 * email clients cannot consume the application's CSS variables.
 */

export const BRAND = {
  link: "#2563EB",
  name: "TeesVendorsHub",
  primary: "#2563EB",
  primaryDark: "#1D4ED8",
  primaryLight: "#60A5FA",
  shadow: "rgba(37, 99, 235, 0.30)",
  textOnPrimary: "#FFFFFF",
} as const;

export const CURRENT_YEAR = new Date().getFullYear();
