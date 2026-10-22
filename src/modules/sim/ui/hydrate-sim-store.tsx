"use client";

import { useEffect } from "react";

import type { Country, Sim } from "@/payload-types";
import { useCountryActions } from "../store/country-store";
import { useSimActions } from "../store/sim-store";

interface Props {
  countries: Country[];
  sims: Sim[];
}

export function HydrateSimStore({ sims, countries }: Props) {
  const { setSims } = useSimActions();
  const { setCountries } = useCountryActions();

  useEffect(() => {
    setSims(sims);
    setCountries(countries);
  }, [sims, setSims, setCountries, countries]);

  return null;
}
