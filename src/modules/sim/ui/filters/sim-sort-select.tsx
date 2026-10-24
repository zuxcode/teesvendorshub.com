/** biome-ignore-all lint/performance/noJsxPropsBind: unnecessary optimization */

"use client";

import { ArrowDownUp } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { SimSortOption } from "./sim-filter.types";

interface Props {
  onChange: (value: SimSortOption) => void;
  value: SimSortOption;
}

export function SimSortSelect({ value, onChange }: Props) {
  return (
    <Select
      onValueChange={(nextValue) => onChange(nextValue as SimSortOption)}
      value={value}
    >
      <SelectTrigger aria-label="Sort SIM products" className="w-full">
        <ArrowDownUp className="size-4 text-muted-foreground" />
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Newest first</SelectItem>
        <SelectItem value="price-asc">Price: low to high</SelectItem>
        <SelectItem value="price-desc">Price: high to low</SelectItem>
        <SelectItem value="name">Name: A–Z</SelectItem>
      </SelectContent>
    </Select>
  );
}
