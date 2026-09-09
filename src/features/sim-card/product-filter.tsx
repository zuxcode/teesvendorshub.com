"use client";

import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useHasFilters,
  useSimCardActions,
  useSimCardCountry,
  useSimCardType,
  useSimCardUniqueCountries,
  useSimCardUniqueTypes,
} from "@/stores/sim-card-store";

export function SimCardHeaderFilter() {
  const { setType, setCountry, resetFilter } = useSimCardActions();
  const simTypes = useSimCardUniqueTypes();
  const countries = useSimCardUniqueCountries();
  const simType = useSimCardType();
  const country = useSimCardCountry();
  const hasFilters = useHasFilters();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-2 font-medium text-muted-foreground text-sm">
        <Filter className="size-4" />
        <span className="hidden sm:inline">Filter</span>
      </div>

      <Select onValueChange={setCountry} value={country}>
        <SelectTrigger className="w-40 capitalize">
          <SelectValue placeholder="Country" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All countries</SelectItem>

          {countries.map((item) => (
            <SelectItem className="capitalize" key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={setType} value={simType.replace("_", " ")}>
        <SelectTrigger className="w-37.5 capitalize">
          <SelectValue placeholder="SIM type" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All SIM types</SelectItem>

          {simTypes.map((item) => (
            <SelectItem className="capitalize" key={item} value={item}>
              {item.replace("_", " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters ? (
        <Button
          className="gap-1.5"
          onClick={resetFilter}
          size="sm"
          variant="ghost"
        >
          <X className="size-4" />
          Clear
        </Button>
      ) : null}
    </div>
  );
}
