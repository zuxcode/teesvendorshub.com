import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import type { Gift } from "@/payload-types";

export interface GiftStoreState {
  gifts: Record<string, Gift>;
  selectedGiftId: string | null;
}

export interface GiftStoreActions {
  addGift: (gift: Gift) => void;
  clearGifts: () => void;
  removeGift: (id: string) => void;
  setGifts: (gifts: Gift[]) => void;
  setSelectedGiftId: (id: string | null) => void;
}

export interface GiftStore extends GiftStoreState {
  actions: GiftStoreActions;
}

export const useGiftStore = createWithEqualityFn<GiftStore>()(
  persist(
    immer((set) => ({
      actions: {
        addGift: (gift) => {
          set((state) => {
            state.gifts[gift.id] = gift;
          });
        },

        clearGifts: () => {
          set((state) => {
            state.gifts = {};
            state.selectedGiftId = null;
          });
        },

        removeGift: (id) => {
          set((state) => {
            delete state.gifts[id];

            if (state.selectedGiftId === id) {
              state.selectedGiftId = null;
            }
          });
        },

        setGifts: (gifts) => {
          set((state) => {
            state.gifts = Object.fromEntries(
              gifts.map((gift) => [gift.id, gift])
            );

            if (state.selectedGiftId && !state.gifts[state.selectedGiftId]) {
              state.selectedGiftId = null;
            }
          });
        },

        setSelectedGiftId: (id) => {
          set((state) => {
            state.selectedGiftId = id !== null && state.gifts[id] ? id : null;
          });
        },
      },
      gifts: {},
      selectedGiftId: null,
    })),
    {
      name: "tvh_gift",
      partialize: (state) => ({
        gifts: state.gifts,
      }),
    }
  ),
  shallow
);

export const useGift = (id: string | null) =>
  useGiftStore((state) => (id ? (state.gifts[id] ?? null) : null));

export const useGifts = () =>
  useGiftStore((state) => Object.values(state.gifts), shallow);

export const useGiftById = () => useGiftStore((state) => state.gifts, shallow);

export const useGiftActions = () => useGiftStore((state) => state.actions);

export const useSelectedGiftId = () =>
  useGiftStore((state) => state.selectedGiftId);

export const useSelectedGift = () =>
  useGiftStore((state) => {
    const { selectedGiftId, gifts } = state;

    return selectedGiftId ? (gifts[selectedGiftId] ?? null) : null;
  });

export const useHasSelectedGift = () =>
  useGiftStore((state) => state.selectedGiftId !== null);
