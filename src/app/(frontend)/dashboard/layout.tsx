import type { ReactNode } from "react";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
  sidebar,
}: {
  children: ReactNode;
  sidebar: ReactNode;
}) {
  return (
    <SidebarProvider>
      {sidebar}

      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
          <div className="flex w-full items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />

            <Separator className="mx-1 h-4" orientation="vertical" />

            <div className="flex items-center">
              <h1 className="font-medium text-sm">Dashboard</h1>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          <div className="mx-auto w-full max-w-[1600px] p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
