"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { SimCountryOption } from "./sim-filter.types";

interface Props {
  countries: SimCountryOption[];
  onChange: (value: string | null) => void;
  value: string;
}

export function SimCountryFilter({ value, countries, onChange }: Props) {
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger aria-label="Filter by country" className="w-full">
        <SelectValue placeholder="Country" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All countries</SelectItem>
        {countries.map((country) => (
          <SelectItem key={country.value} value={country.value}>
            {country.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
