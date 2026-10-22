"use client";

import { SlidersHorizontal } from "lucide-react";
import { SimCountryFilter } from "./sim-country-filter";
import type { SimCountryOption, SimFilterState } from "./sim-filter.types";
import { SimSearchInput } from "./sim-search-input";
import { SimSortSelect } from "./sim-sort-select";
import { SimTypeFilter } from "./sim-type-filter";

interface Props extends SimFilterState {
  countries: SimCountryOption[];
  onCountryChange: (value: string | null) => void;
  onSearchChange: (value: string | null) => void;
  onSimTypeChange: SimFilterState["simType"] extends infer T
    ? (value: T) => void
    : never;
  onSortChange: (value: SimFilterState["sortBy"]) => void;
  resultCount: number;
}

export function SimFilterPanel({
  search,
  simType,
  country,
  sortBy,
  countries,
  resultCount,
  onSearchChange,
  onSimTypeChange,
  onCountryChange,
  onSortChange,
}: Props) {
  return (
    <section
      aria-label="Filter and sort SIM products"
      className="space-y-4 rounded-xl border bg-card p-4 sm:p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <SlidersHorizontal className="size-4" />
          </div>
          <div>
            <h2 className="font-semibold">Find your SIM</h2>
            <p className="text-muted-foreground text-sm">
              Search, filter, and sort available SIMs.
            </p>
          </div>
        </div>

        <p
          aria-live="polite"
          className="shrink-0 text-muted-foreground text-sm"
        >
          <span className="font-medium text-foreground">{resultCount}</span>{" "}
          found
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(200px,1fr)_180px_180px_200px]">
        <SimSearchInput onChange={onSearchChange} value={search} />
        <SimTypeFilter onChange={onSimTypeChange} value={simType} />
        <SimCountryFilter
          countries={countries}
          onChange={onCountryChange}
          value={country}
        />
        <SimSortSelect onChange={onSortChange} value={sortBy} />
      </div>
    </section>
  );
}
