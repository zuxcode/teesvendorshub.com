import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import type { DocumentId, FilterValue } from "@/lib/types";
import type { SimCard } from "@/payload-types";

export interface SimCardStoreState {
  country: FilterValue;
  selectSimCardId: DocumentId | null;
  simCards: Record<DocumentId, SimCard>;
  type: FilterValue;
}

export interface SimCardStoreActions {
  addSimCard: (simCard: SimCard) => void;
  clearSimCards: () => void;
  getSimCardById: (id: DocumentId) => SimCard | undefined;
  removeSimCard: (id: DocumentId) => void;
  resetFilter: () => void;
  setCountry: (value: FilterValue | null) => void;
  setSelectedSimcardId: (id: DocumentId | null) => void;
  setSimCards: (simCards: SimCard[]) => void;
  setType: (value: FilterValue | null) => void;
  updateSimCard: (id: DocumentId, updates: Partial<SimCard>) => void;
}

export interface SimCardStore extends SimCardStoreState {
  actions: SimCardStoreActions;
}

export const useSimCardStore = createWithEqualityFn<SimCardStore>()(
  persist(
    immer((set, get) => ({
      actions: {
        addSimCard: (simCard) => {
          set((state) => {
            state.simCards[simCard.id] = simCard;
          });
        },

        clearSimCards: () => {
          set((state) => {
            state.simCards = {};
          });
        },

        getSimCardById: (id) => get().simCards[id],

        removeSimCard: (id) => {
          set((state) => {
            delete state.simCards[id];
          });
        },

        resetFilter: () => {
          set((state) => {
            state.country = "all";
            state.type = "all";
          });
        },

        setCountry: (value) => {
          set((state) => {
            state.country = value || "all";
          });
        },

        setSelectedSimcardId: (id) => {
          set((state) => {
            state.selectSimCardId = id;
          });
        },

        setSimCards: (simCards) => {
          set((state) => {
            state.simCards = Object.fromEntries(
              simCards.map((simCard) => [simCard.id, simCard])
            );
          });
        },

        setType: (value) => {
          set((state) => {
            state.type = value || "all";
          });
        },

        updateSimCard: (id, updates) => {
          set((state) => {
            const simCard = state.simCards[id];

            if (simCard) {
              Object.assign(simCard, updates);
            }
          });
        },
      },
      country: "all",
      selectSimCardId: null,

      simCards: {},

      type: "all",
    })),
    {
      name: "tvh_sim_cards",

      partialize: (state) => ({
        simCards: state.simCards,
      }),
    }
  ),
  shallow
);

export const useSimCards = () => useSimCardStore((state) => state.simCards);
export const useSimCardType = () => useSimCardStore((state) => state.type);
export const useSimCardSelectedId = () =>
  useSimCardStore((state) => state.selectSimCardId);
export const useSimCardCountry = () =>
  useSimCardStore((state) => state.country);

export const useSimCardIds = () =>
  useSimCardStore((state) => Object.keys(state.simCards));

export const useSimCard = (id: DocumentId) =>
  useSimCardStore((state) => state.simCards[id]);

export const useSimCardUniqueCountries = () =>
  useSimCardStore(
    (state) => [
      ...new Set(
        Object.values(state.simCards)
          .map((simCard) => simCard.country)
          .filter(Boolean)
      ),
    ],
    shallow
  );

export const useSimCardUniqueTypes = () =>
  useSimCardStore(
    (state) => [
      ...new Set(
        Object.values(state.simCards)
          .map((simCard) => simCard.type)
          .filter(Boolean)
      ),
    ],
    shallow
  );

export const useHasSimCards = () =>
  useSimCardStore((state) => Object.keys(state.simCards).length > 0);

export const useHasSelectedIdSimCard = () =>
  useSimCardStore((state) => state.selectSimCardId !== null);

export const useHasFilters = () =>
  useSimCardStore((state) => state.type !== "all" || state.country !== "all");

export const useSimCardActions = () =>
  useSimCardStore((state) => state.actions);

export const useFilteredSimCardIds = () =>
  useSimCardStore((state) => {
    const { simCards, country, type } = state;

    return Object.values(simCards)
      .filter((simCard) => {
        if (country !== "all" && simCard.country !== country) {
          return false;
        }

        if (type !== "all" && simCard.type !== type) {
          return false;
        }

        return true;
      })
      .map((simCard) => simCard.id);
  }, shallow);
