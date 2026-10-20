import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  Icon: LucideIcon;
  label: string;
  value?: string;
}

export function OrderHeaderCard({
  Icon,
  label,
  className,
  value = "-",
}: Props) {
  return (
    <Card className="shadow-none transition-colors hover:bg-muted/30">
      <CardContent className="flex items-center justify-between gap-4 p-4 sm:p-5">
        <div className="min-w-0 space-y-2">
          <p className="truncate font-medium text-muted-foreground text-sm">
            {label}
          </p>

          <p className="font-semibold text-2xl tabular-nums leading-none tracking-tight">
            {value}
          </p>
        </div>

        <Card
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg ring-0",
            className
          )}
        >
          <CardContent>
            <Icon
              aria-hidden="true"
              className="size-5 transition-transform duration-300 group-hover:scale-110"
            />
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
