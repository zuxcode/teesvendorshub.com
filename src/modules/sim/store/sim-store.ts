import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import type { Sim } from "@/payload-types";

export interface SimStoreState {
  selectedSimId: string | null;
  sims: Record<string, Sim>;
}

export interface SimStoreActions {
  addSim: (sim: Sim) => void;
  clearSims: () => void;
  removeSim: (id: string) => void;
  setSelectedSimId: (id: string | null) => void;
  setSims: (sims: Sim[]) => void;
  updateSim: (id: string, updates: Partial<Sim>) => void;
}

export interface SimStore extends SimStoreState {
  actions: SimStoreActions;
}

export const useSimStore = createWithEqualityFn<SimStore>()(
  persist(
    immer((set) => ({
      actions: {
        addSim: (sim) => {
          set((state) => {
            state.sims[sim.id] = sim;
          });
        },

        clearSims: () => {
          set((state) => {
            state.sims = {};
          });
        },

        removeSim: (id) => {
          set((state) => {
            delete state.sims[id];

            if (state.selectedSimId === id) {
              state.selectedSimId = null;
            }
          });
        },

        setSelectedSimId: (id) => {
          set((state) => {
            state.selectedSimId = id;
          });
        },

        setSims: (sims) => {
          set((state) => {
            state.sims = Object.fromEntries(sims.map((sim) => [sim.id, sim]));

            if (state.selectedSimId && !state.sims[state.selectedSimId]) {
              state.selectedSimId = null;
            }
          });
        },

        updateSim: (id, updates) => {
          set((state) => {
            const sim = state.sims[id];

            if (!sim) {
              return;
            }

            Object.assign(sim, updates, { id });
          });
        },
      },

      selectedSimId: null,
      sims: {},
    })),
    {
      name: "tvh_sims",
      partialize: (state) => ({
        sims: state.sims,
      }),
    }
  ),
  shallow
);

export const useSim = (id: string | null | undefined) =>
  useSimStore((state) => (id ? state.sims[id] : undefined));

export const useSelectedSimId = () =>
  useSimStore((state) => state.selectedSimId);

export const useSelectedSim = () =>
  useSimStore((state) => {
    const { selectedSimId, sims } = state;

    return selectedSimId ? sims[selectedSimId] : undefined;
  });

export const useSimActions = () => useSimStore((state) => state.actions);

export const useSims = () =>
  useSimStore((state) => Object.values(state.sims), shallow);
