import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import type { Country } from "@/payload-types";

export interface CountryStoreState {
  countries: Record<string, Country>;
}

export interface CountryStoreActions {
  addCountry: (country: Country) => void;
  clearCountries: () => void;
  removeCountry: (id: string) => void;
  setCountries: (countries: Country[]) => void;
  updateCountry: (id: string, updates: Partial<Country>) => void;
}

export interface CountryStore extends CountryStoreState {
  actions: CountryStoreActions;
}

export const useCountryStore = createWithEqualityFn<CountryStore>()(
  persist(
    immer((set) => ({
      actions: {
        addCountry: (country) => {
          set((state) => {
            state.countries[country.id] = country;
          });
        },

        clearCountries: () => {
          set((state) => {
            state.countries = {};
          });
        },

        removeCountry: (id) => {
          set((state) => {
            delete state.countries[id];
          });
        },

        setCountries: (countries) => {
          set((state) => {
            state.countries = Object.fromEntries(
              countries.map((country) => [country.id, country])
            );
          });
        },

        updateCountry: (id, updates) => {
          set((state) => {
            const country = state.countries[id];

            if (country) {
              Object.assign(country, updates);
            }
          });
        },
      },
      countries: {},
    })),
    {
      name: "tvh_countries",
      partialize: (state) => ({
        countries: state.countries,
      }),
    }
  ),
  shallow
);

export const useCountry = (id: string | null | undefined) =>
  useCountryStore((state) => (id ? state.countries[id] : undefined));

export const useCountryActions = () =>
  useCountryStore((state) => state.actions);

export const useCountryEntries = () =>
  useCountryStore((state) => Object.entries(state.countries));

export const useCountries = () =>
  useCountryStore((state) => Object.values(state.countries), shallow);
