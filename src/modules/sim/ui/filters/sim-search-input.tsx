/** biome-ignore-all lint/performance/noJsxPropsBind: unnecessary optimization */

"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

interface Props {
  onChange: (value: string) => void;
  value: string;
}

export function SimSearchInput({ value, onChange }: Props) {
  return (
    <div className="relative">
      <Search
        aria-hidden="true"
        className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        aria-label="Search SIM products"
        className="pl-9"
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search SIMs..."
        type="search"
        value={value}
      />
    </div>
  );
}
