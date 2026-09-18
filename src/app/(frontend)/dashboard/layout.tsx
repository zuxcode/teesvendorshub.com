import { type ReactNode, Suspense } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardEffect } from "@/features/dashboard/dashboard-effect";
import { ProductImagesServer } from "@/features/products/product-images-server";
import { DashboardFooter } from "@/layout/footer/dashboard-footer";
import { DashboardTopNav } from "@/layout/nav/dashboard-top-nav";
import { getAuthenticateUser } from "@/lib/services/get-auth";
import { cn } from "@/lib/utils";

export default async function DashboardLayout({
  children,
  sidebar,
}: {
  children: ReactNode;
  sidebar: ReactNode;
}) {
  const { user } = await getAuthenticateUser();

  return (
    <SidebarProvider>
      {sidebar}

      <SidebarInset>
        <DashboardTopNav />
        <div
          className={cn(
            "mx-auto flex w-full max-w-[1600px] flex-1 flex-col",
            "container mx-auto px-4 py-8 lg:py-8" // Layout
          )}
        >
          {children}
        </div>

        <DashboardEffect user={user} />
        <DashboardFooter />
      </SidebarInset>

      <Suspense fallback={null}>
        <ProductImagesServer />
      </Suspense>
    </SidebarProvider>
  );
}
