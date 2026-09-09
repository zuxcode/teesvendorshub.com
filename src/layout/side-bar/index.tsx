"use client";
import {
  BarChart3,
  CardSim,
  HelpCircle,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Star,
  Tag,
  Users,
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

const BASE_PATH = "/dashboard";

const navigation = {
  insights: [
    {
      icon: BarChart3,
      title: "Analytics",
      url: "/dashboard/analytics",
    },
  ],
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
      badge: "12",
      icon: ShoppingCart,
      title: "Orders",
      url: "/dashboard/orders",
    },
    {
      badge: "12",
      icon: CardSim,
      title: "Physical / eSIM",
      url: "/dashboard/sim",
    },
    {
      icon: Users,
      title: "Customers",
      url: "/dashboard/customers",
    },
    {
      icon: Tag,
      title: "Discounts",
      url: "/dashboard/discounts",
    },
    {
      badge: "4",
      icon: Star,
      title: "Reviews",
      url: "/dashboard/reviews",
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

        {/* Insights */}
        <SidebarGroup className="mt-6 p-0">
          <SidebarGroupLabel className="h-7 px-2 font-medium text-[10px] text-muted-foreground/70 uppercase tracking-wider">
            Insights
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {navigation.insights.map((item) => (
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
