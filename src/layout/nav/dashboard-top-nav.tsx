import { TeesLogo } from "@/components/tees-ui/logo";
import { ThemeToggle } from "@/components/tees-ui/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CartSheet } from "@/features/cart";
import { DashboardBreadcrumb } from "./dashboard-breadcrumb";

export function DashboardTopNav() {
  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="flex w-full items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />

        <Separator className="mx-1 min-h-4" orientation="vertical" />

        <TeesLogo className="size-7" href="/dashboard" size="xs" textHidden />

        <DashboardBreadcrumb />

        <div className="ml-auto flex items-center gap-1">
          <CartSheet />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
