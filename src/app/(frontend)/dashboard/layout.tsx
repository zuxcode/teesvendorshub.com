import { type ReactNode, Suspense } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardEffect } from "@/features/dashboard/dashboard-effect";
import { ProductImagesServer } from "@/features/sim-card/product-images-server";
import { DashboardFooter } from "@/layout/footer/dashboard-footer";
import { DashboardTopNav } from "@/layout/nav/dashboard-top-nav";
import { getAuthenticateUser } from "@/lib/services/get-auth";

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
        <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col">
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
