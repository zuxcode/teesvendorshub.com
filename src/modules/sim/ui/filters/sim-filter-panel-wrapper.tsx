/** biome-ignore-all lint/performance/noJsxPropsBind: unnecessary optimization */

"use client";

import { useState } from "react";
import type { SimSortOption, SimTypeFilter } from "./sim-filter.types";
import { SimFilterPanel } from "./sim-filter-panel";

export function SimFilterPanelWrapper() {
  const [search, setSearch] = useState<string>("");
  const [simType, setSimType] = useState<SimTypeFilter>("all");
  const [country, setCountry] = useState("all");
  const [sortBy, setSortBy] = useState<SimSortOption>("newest");

  const handleSearchChange = (value: string | null) => {
    setSearch(value ?? "");
    // updateFilters({ search: value });
  };

  const handleSimTypeChange = (value: SimTypeFilter) => {
    setSimType(value);
    // updateFilters({ simType: value });
  };

  const handleCountryChange = (value: string | null) => {
    setCountry(value ?? "");
    // updateFilters({ country: value });
  };

  const handleSortChange = (value: SimSortOption) => {
    setSortBy(value);
    // updateFilters({ sortBy: value });
  };

  return (
    <SimFilterPanel
      countries={[]}
      country={country}
      onCountryChange={handleCountryChange}
      onSearchChange={handleSearchChange}
      onSimTypeChange={handleSimTypeChange}
      onSortChange={handleSortChange}
      resultCount={3}
      search={search}
      simType={simType}
      sortBy={sortBy}
    />
  );
}
