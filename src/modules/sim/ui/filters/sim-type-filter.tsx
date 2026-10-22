/** biome-ignore-all lint/performance/noJsxPropsBind: unnecessary optimization */

"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { SimTypeFilter as SimTypeFilterValue } from "./sim-filter.types";

interface Props {
  onChange: (value: SimTypeFilterValue) => void;
  value: SimTypeFilterValue;
}

export function SimTypeFilter({ value, onChange }: Props) {
  return (
    <Select
      onValueChange={(nextValue) => onChange(nextValue as SimTypeFilterValue)}
      value={value}
    >
      <SelectTrigger aria-label="Filter by SIM type" className="w-full">
        <SelectValue placeholder="SIM type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All SIM types</SelectItem>
        <SelectItem value="esim">eSIM</SelectItem>
        <SelectItem value="physical">Physical SIM</SelectItem>
      </SelectContent>
    </Select>
  );
}
