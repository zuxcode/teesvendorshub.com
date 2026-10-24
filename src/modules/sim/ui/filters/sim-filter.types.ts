export type SimTypeFilter = "all" | "esim" | "physical";

export type SimSortOption = "newest" | "price-asc" | "price-desc" | "name";

export interface SimCountryOption {
  label: string;
  value: string;
}

export interface SimFilterState {
  country: string;
  search: string;
  simType: SimTypeFilter;
  sortBy: SimSortOption;
}
