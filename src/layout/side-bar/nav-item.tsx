import { useNextActiveLink } from "hookbase-nextjs";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import {
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { BASE_DASHBOARD_PATH } from "@/constant";

interface Props {
  badge?: string;
  icon: LucideIcon;
  title: string;
  url: string;
}

export function NavigationItem({ icon: Icon, title, url, badge }: Props) {
  const { getActiveLinkProps } = useNextActiveLink();

  const { active } = getActiveLinkProps(url, {
    exact: BASE_DASHBOARD_PATH === url,
  });

  return (
    <SidebarMenuItem>
      <Link href={url}>
        <SidebarMenuButton
          className="h-9 rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[active=true]:bg-primary/10 data-[active=true]:font-medium data-[active=true]:text-primary"
          isActive={active}
          tooltip={title}
        >
          <Icon className="size-4" strokeWidth={active ? 2 : 1.75} />

          <span>{title}</span>
        </SidebarMenuButton>

        {badge ? (
          <SidebarMenuBadge className="rounded-md bg-muted px-1.5 font-medium text-[10px] text-muted-foreground">
            {badge}
          </SidebarMenuBadge>
        ) : null}
      </Link>
    </SidebarMenuItem>
  );
}
