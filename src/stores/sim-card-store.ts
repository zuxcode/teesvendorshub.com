import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SimType = "eSIM" | "Physical SIM";

export interface SimCard {
  activation?: string;
  country: string;
  coverage?: string;

  currency: string;

  data?: string;
  delivery?: string;
  description: string;

  features?: string[];
  id: string;
  image: string;
  name: string;

  network?: string;
  price: number;
  slug: string;
  type: SimType;
  validity?: string;
}

export interface SimCardSelection {
  product: SimCard;
  quantity: number;
}

interface SimCardStore {
  clearSelection: () => void;
  decrementQuantity: () => void;

  getTotal: () => number;
  incrementQuantity: () => void;
  selectedSim: SimCardSelection | null;

  selectSim: (product: SimCard) => void;

  setQuantity: (quantity: number) => void;
}

export const useSimCardStore = create<SimCardStore>()(
  persist(
    (set, get) => ({
      clearSelection: () => {
        set({
          selectedSim: null,
        });
      },

      decrementQuantity: () => {
        set((state) => {
          if (!state.selectedSim) {
            return state;
          }

          const quantity = Math.max(1, state.selectedSim.quantity - 1);

          return {
            selectedSim: {
              ...state.selectedSim,
              quantity,
            },
          };
        });
      },

      getTotal: () => {
        const selectedSim = get().selectedSim;

        if (!selectedSim) {
          return 0;
        }

        return selectedSim.product.price * selectedSim.quantity;
      },

      incrementQuantity: () => {
        set((state) => {
          if (!state.selectedSim) {
            return state;
          }

          return {
            selectedSim: {
              ...state.selectedSim,
              quantity: state.selectedSim.quantity + 1,
            },
          };
        });
      },
      selectedSim: null,

      selectSim: (product) => {
        set({
          selectedSim: {
            product,
            quantity: 1,
          },
        });
      },

      setQuantity: (quantity) => {
        if (quantity < 1) {
          return;
        }

        set((state) => {
          if (!state.selectedSim) {
            return state;
          }

          return {
            selectedSim: {
              ...state.selectedSim,
              quantity,
            },
          };
        });
      },
    }),
    {
      name: "tees-simcard",
    }
  )
);
