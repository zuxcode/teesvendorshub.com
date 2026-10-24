import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { OrderItem } from "@/payload-types";

interface OrderedItemSecretsProps {
  secrets: NonNullable<OrderItem["secrets"]>;
}

export function OrderedItemSecrets({ secrets }: OrderedItemSecretsProps) {
  if (secrets.length === 0) {
    return null;
  }

  return (
    <Collapsible className="mt-3 rounded-lg border bg-muted/30">
      <CollapsibleTrigger className="group flex min-h-11 w-full items-center justify-between gap-3 px-3 py-2 font-medium text-sm">
        <span>Product secrets</span>

        <span className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs">
            {secrets.length} {secrets.length === 1 ? "item" : "items"}
          </span>

          <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 group-data-panel-open:rotate-180 motion-reduce:transition-none" />
        </span>
      </CollapsibleTrigger>

      <CollapsibleContent className="h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-300 ease-in-out data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none [&[hidden]:not([hidden='until-found'])]:hidden">
        <div className="overflow-hidden">
          <div className="space-y-2 border-t p-3">
            {secrets.map((secret) => (
              <div
                className="rounded-md border bg-background p-3"
                key={secret.id}
              >
                <p className="break-all font-mono text-sm">{secret.secret}</p>
              </div>
            ))}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
