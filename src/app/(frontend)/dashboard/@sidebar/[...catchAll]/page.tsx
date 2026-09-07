"use client";

import { useNextActiveLink } from "hookbase-nextjs";
import {
  BarChart3,
  CardSim,
  ChevronDown,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  Star,
  Tag,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import type * as React from "react";
import { TeesLogo } from "@/components/tees-ui/logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

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

export default function AppSidebar() {
  const { getActiveLinkProps } = useNextActiveLink();

  return (
    <Sidebar
      className="border-border/60 border-r"
      collapsible="icon"
      side="left"
      variant="sidebar"
    >
      <SidebarHeader className="border-border/60 border-b p-3">
        <TeesLogo size="xs" />
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
                <NavigationItem
                  active={getActiveLinkProps(item.url).active}
                  item={item}
                  key={item.title}
                />
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
                <NavigationItem
                  active={getActiveLinkProps(item.url).active}
                  item={item}
                  key={item.title}
                />
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
                <NavigationItem
                  active={getActiveLinkProps(item.url).active}
                  item={item}
                  key={item.title}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* ================================================================== */}
      {/* Footer / Account                                                    */}
      {/* ================================================================== */}
      <SidebarFooter className="border-border/60 border-t p-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                className="h-12 rounded-lg hover:bg-muted data-popup-open:bg-muted"
                size="lg"
                tooltip="Account"
              />
            }
          >
            <Avatar className="size-8 shrink-0 rounded-full">
              <AvatarFallback className="rounded-full bg-primary font-medium text-primary-foreground text-xs">
                JD
              </AvatarFallback>
            </Avatar>

            <div className="grid min-w-0 flex-1 text-left leading-tight">
              <span className="truncate font-semibold text-sm">John</span>

              <span className="truncate text-muted-foreground text-xs">
                john@example.com
              </span>
            </div>

            <ChevronDown className="ml-auto size-4 shrink-0 text-muted-foreground" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-64 rounded-xl"
            side="top"
            sideOffset={8}
          >
            {/* Account identity */}
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10 shrink-0 rounded-full">
                    <AvatarFallback className="rounded-full bg-primary font-medium text-primary-foreground text-sm">
                      JD
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-sm">John</p>

                    <p className="truncate text-muted-foreground text-xs">
                      john@example.com
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Account actions */}
            <DropdownMenuGroup>
              <DropdownMenuItem render={<Link href="/dashboard/account" />}>
                <User className="size-4" />
                Account
              </DropdownMenuItem>

              <DropdownMenuItem render={<Link href="/dashboard/settings" />}>
                <Settings className="size-4" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Logout */}
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                // onClick={handleLogout}
              >
                <LogOut className="size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

function NavigationItem({
  item,
  active,
}: {
  item: {
    title: string;
    url: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  };
  active: boolean;
}) {
  const Icon = item.icon;

  return (
    <SidebarMenuItem>
      <Link href={item.url}>
        <SidebarMenuButton
          className="h-9 rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[active=true]:bg-primary/10 data-[active=true]:font-medium data-[active=true]:text-primary"
          isActive={active}
          tooltip={item.title}
        >
          <Icon className="size-4" strokeWidth={active ? 2 : 1.75} />

          <span>{item.title}</span>
        </SidebarMenuButton>

        {item.badge ? (
          <SidebarMenuBadge className="rounded-md bg-muted px-1.5 font-medium text-[10px] text-muted-foreground">
            {item.badge}
          </SidebarMenuBadge>
        ) : null}
      </Link>
    </SidebarMenuItem>
  );
}
