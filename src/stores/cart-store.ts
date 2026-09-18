import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import type { DocumentId } from "@/lib/types";

export interface CartItem {
  id: DocumentId;
  productId: DocumentId;
  quantity: number;
}

export interface CartStoreState {
  isOpen: boolean;
  items: Record<string, CartItem>;
}

export interface CartStoreActions {
  addItem: (productId: DocumentId, quantity?: number) => void;
  clearCart: () => void;
  decrementItem: (productId: DocumentId) => void;
  getItem: (productId: DocumentId) => CartItem | undefined;
  getItemQuantity: (productId: DocumentId) => number;
  incrementItem: (productId: DocumentId) => void;
  removeItem: (productId: DocumentId) => void;
  setIsOpen: (isOpen: boolean) => void;
  setItemQuantity: (productId: DocumentId, quantity: number) => void;
}

export interface CartStore extends CartStoreState {
  actions: CartStoreActions;
}

export const useCartStore = createWithEqualityFn<CartStore>()(
  persist(
    immer((set, get) => ({
      actions: {
        addItem: (productId, quantity = 1) => {
          set((state) => {
            const item = state.items[productId];

            if (item) {
              item.quantity += quantity;
              return;
            }

            state.items[productId] = {
              id: productId,
              productId,
              quantity,
            };
          });
        },

        clearCart: () => {
          set((state) => {
            state.items = {};
          });
        },

        decrementItem: (productId) => {
          set((state) => {
            const item = state.items[productId];

            if (!item) {
              return;
            }

            if (item.quantity <= 1) {
              delete state.items[productId];
              return;
            }

            item.quantity -= 1;
          });
        },

        getItem: (productId) => get().items[productId],

        getItemQuantity: (productId) => get().items[productId]?.quantity ?? 0,

        incrementItem: (productId) => {
          set((state) => {
            const item = state.items[productId];

            if (item) {
              item.quantity += 1;
            }
          });
        },

        removeItem: (productId) => {
          set((state) => {
            delete state.items[productId];
          });
        },

        setIsOpen: (isOpen) => {
          set((state) => {
            state.isOpen = isOpen;
          });
        },

        setItemQuantity: (productId, quantity) => {
          set((state) => {
            if (quantity <= 0) {
              delete state.items[productId];
              return;
            }

            const item = state.items[productId];

            if (item) {
              item.quantity = quantity;
            } else {
              state.items[productId] = {
                id: productId,
                productId,
                quantity,
              };
            }
          });
        },
      },
      isOpen: false,

      items: {},
    })),
    {
      name: "tvh_cart",

      partialize: (state) => ({
        items: state.items,
      }),
    }
  ),
  shallow
);

export const useCartItems = () => useCartStore((state) => state.items);
export const useIsOpen = () => useCartStore((state) => state.isOpen);

export const useCartItemIds = () =>
  useCartStore((state) => Object.keys(state.items));

export const useCartItemValues = () =>
  useCartStore((state) => Object.values(state.items));

export const useCartItem = (productId: DocumentId) =>
  useCartStore((state) => state.items[productId]);

export const useCartItemQuantity = (productId: DocumentId) =>
  useCartStore((state) => state.items[productId]?.quantity ?? 0);

export const useCartItemCount = () =>
  useCartStore((state) =>
    Object.values(state.items).reduce((total, item) => total + item.quantity, 0)
  );

export const useCartLineCount = () =>
  useCartStore((state) => Object.keys(state.items).length);

export const useHasCartItems = () =>
  useCartStore((state) => Object.keys(state.items).length > 0);

export const useCartActions = () => useCartStore((state) => state.actions);
