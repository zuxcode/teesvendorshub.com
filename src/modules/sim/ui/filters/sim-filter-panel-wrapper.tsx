/** biome-ignore-all lint/performance/noJsxPropsBind: unnecessary optimization */

"use client";

import { useState } from "react";
import type {
  SimCountryOption,
  SimSortOption,
  SimTypeFilter,
} from "./sim-filter.types";
import { SimFilterPanel } from "./sim-filter-panel";

interface Props {
  countries: SimCountryOption[];
  onFiltersChange: (filters: {
    search: string;
    simType: SimTypeFilter;
    country: string;
    sortBy: SimSortOption;
  }) => void;
  resultCount: number;
}

function onFiltersChange() {}

export function SimFilterPanelWrapper() {
  const [search, setSearch] = useState("");
  const [simType, setSimType] = useState<SimTypeFilter>("all");
  const [country, setCountry] = useState("all");
  const [sortBy, setSortBy] = useState<SimSortOption>("newest");

  const updateFilters = (
    next: Partial<{
      search: string;
      simType: SimTypeFilter;
      country: string;
      sortBy: SimSortOption;
    }>
  ) => {
    const filters = {
      country,
      search,
      simType,
      sortBy,
      ...next,
    };

    onFiltersChange(filters);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    updateFilters({ search: value });
  };

  const handleSimTypeChange = (value: SimTypeFilter) => {
    setSimType(value);
    updateFilters({ simType: value });
  };

  const handleCountryChange = (value: string) => {
    setCountry(value);
    updateFilters({ country: value });
  };

  const handleSortChange = (value: SimSortOption) => {
    setSortBy(value);
    updateFilters({ sortBy: value });
  };

  const handleClearFilters = () => {
    setSearch("");
    setSimType("all");
    setCountry("all");

    updateFilters({
      country: "all",
      search: "",
      simType: "all",
    });
  };

  return (
    <SimFilterPanel
      countries={[]}
      country={country}
      onClearFilters={handleClearFilters}
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
