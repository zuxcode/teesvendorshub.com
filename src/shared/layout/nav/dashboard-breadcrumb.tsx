"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function DashboardBreadcrumb() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const currentSegment = segments.at(-1);

  if (!currentSegment || currentSegment === "dashboard") {
    return null;
  }

  const label = currentSegment.replaceAll("-", " ");

  return (
    <nav aria-label="Breadcrumb">
      <div className="flex items-center gap-1 text-sm">
        <Link
          className="hidden text-muted-foreground transition-colors hover:text-foreground sm:inline"
          href="/dashboard"
        >
          Dashboard
        </Link>

        <ChevronRight
          aria-hidden="true"
          className="hidden size-4 text-muted-foreground sm:block"
        />

        <span className="font-medium capitalize">{label}</span>
      </div>
    </nav>
  );
}
