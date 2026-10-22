"use client";
import {
  CardSim,
  GiftIcon,
  HelpCircle,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
} from "lucide-react";
import { TeesLogo } from "@/components/tees-ui/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavigationItem } from "./nav-item";
import { AppSidebarFooter } from "./side-bar-footer";

const navigation = {
  store: [
    {
      icon: LayoutDashboard,
      title: "Dashboard",
      url: "/dashboard",
    },
    {
      icon: Package,
      title: "Products",
      url: "/dashboard/products",
    },
    {
      icon: GiftIcon,
      title: "Gift Store",
      url: "/dashboard/gifts",
    },

    {
      icon: CardSim,
      title: "Physical / eSIM",
      url: "/dashboard/sim",
    },

    {
      icon: ShoppingCart,
      title: "Orders",
      url: "/dashboard/orders",
    },
  ],

  support: [
    {
      icon: HelpCircle,
      title: "Help & Support",
      url: "/dashboard/help",
    },
    {
      icon: Settings,
      title: "Settings",
      url: "/dashboard/settings",
    },
  ],
};

export function AppSidebar() {
  const { open } = useSidebar();
  return (
    <Sidebar
      className="border-border/60 border-r"
      collapsible="icon"
      side="left"
      variant="sidebar"
    >
      <SidebarHeader className="border-border/60 border-b p-3">
        <TeesLogo size="xs" textHidden={!open} />
      </SidebarHeader>
      {/* ================================================================== */}
      {/* Content                                                             */}
      {/* ================================================================== */}
      <SidebarContent className="px-2 py-3">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="h-7 px-2 font-medium text-[10px] text-muted-foreground/70 uppercase tracking-wider">
            Store
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {navigation.store.map((item) => (
                <NavigationItem {...item} key={item.title} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Support */}
        <SidebarGroup className="mt-auto border-border/60 border-t p-2">
          <SidebarGroupLabel className="h-7 px-2 font-medium text-[10px] text-muted-foreground/70 uppercase tracking-wider">
            Support
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {navigation.support.map((item) => (
                <NavigationItem {...item} key={item.title} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <AppSidebarFooter />

      <SidebarRail />
    </Sidebar>
  );
}
