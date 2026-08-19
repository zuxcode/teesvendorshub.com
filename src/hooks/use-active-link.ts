/** biome-ignore-all lint/style/noNestedTernary: <silent> */
import { usePathname } from "next/navigation";
import { useCallback } from "react";

interface ActiveLinkResult {
  readonly combinedClass: string;
  readonly isActive: boolean;
}

interface UseActiveLinkReturn {
  getActiveLink: (targetHref: string, exact?: boolean) => ActiveLinkResult;
}
const ACTIVE_CLASS = [
  "text-primary",
  "font-semibold",
  "bg-primary/10",
  "shadow-[0_0_20px_-8px_var(--color-primary)]",
].join(" ");

const INACTIVE_CLASS = [
  "text-muted-foreground",
  "hover:text-foreground",
  "hover:bg-white/5",
].join(" ");

export function useActiveLink(): UseActiveLinkReturn {
  const pathname = usePathname();

  const getActiveLink = useCallback(
    (targetHref: string, exact = false): ActiveLinkResult => {
      const isActive =
        targetHref === "/"
          ? pathname === "/"
          : exact
            ? pathname === targetHref
            : pathname === targetHref || pathname.startsWith(`${targetHref}/`);

      return {
        combinedClass: isActive ? ACTIVE_CLASS : INACTIVE_CLASS,
        isActive,
      };
    },
    [pathname]
  );

  return { getActiveLink };
}
