import { ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  className?: string;
  iconClassName?: string;
}

export function ImagePlaceholder({
  className,
  iconClassName,
}: ImagePlaceholderProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-muted",
        className
      )}
    >
      <ImageIcon
        className={cn("size-10 text-muted-foreground/50", iconClassName)}
      />
    </div>
  );
}
