import { connection } from "next/server";
import { type ReactNode, Suspense } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { getAuthenticateUser } from "@/modules/authentication/libs/get-auth";
import { DashboardEffect } from "@/modules/dashboard/dashboard-effect";
import { ProductImagesServer } from "@/modules/products/ui/product-images-server";
import { DashboardFooter } from "@/shared/layout/footer/dashboard-footer";
import { DashboardTopNav } from "@/shared/layout/nav/dashboard-top-nav";

export default async function DashboardLayout({
  children,
  sidebar,
}: {
  children: ReactNode;
  sidebar: ReactNode;
}) {
  await connection();
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
