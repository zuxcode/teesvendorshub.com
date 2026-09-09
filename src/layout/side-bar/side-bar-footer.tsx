"use client";

import { ChevronDown, LogOut, Settings } from "lucide-react";
import Link from "next/link";

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
import { SidebarFooter, SidebarMenuButton } from "@/components/ui/sidebar";
import { useAuthUser } from "@/stores/user-store";

export function AppSidebarFooter() {
  const user = useAuthUser();

  const fullName = user?.fullName?.trim() ?? "";
  // biome-ignore lint/performance/useTopLevelRegex: <Surpress>
  const nameParts = fullName.split(/\s+/).filter(Boolean);

  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.at(-1) ?? "";

  const userInitials =
    nameParts.length > 1
      ? `${firstName[0]}${lastName[0]}`.toUpperCase()
      : firstName.slice(0, 2).toUpperCase();

  return (
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
              {userInitials}
            </AvatarFallback>
          </Avatar>

          <div className="grid min-w-0 flex-1 text-left leading-tight">
            <span className="truncate font-semibold text-sm">
              {user?.fullName}
            </span>

            <span className="truncate text-muted-foreground text-xs">
              {user?.email}
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
          <DropdownMenuGroup>
            <DropdownMenuLabel className="p-3">
              <div className="flex items-center gap-3">
                <Avatar className="size-10 shrink-0 rounded-full">
                  <AvatarFallback className="rounded-full bg-primary font-medium text-primary-foreground text-sm">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-sm">
                    {user?.fullName}
                  </p>

                  <p className="truncate text-muted-foreground text-xs">
                    {user?.email}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem render={<Link href="/dashboard/settings" />}>
              <Settings className="size-4" />
              Settings
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

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
  );
}
