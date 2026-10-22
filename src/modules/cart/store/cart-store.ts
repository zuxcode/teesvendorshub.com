import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import type { RelationTo } from "@/shared/constant";

interface AddItemProps {
  id: string;
  quantity?: number;
  relationTo: RelationTo;
}

export interface CartItemIdentifier {
  id: string;
  relationTo: RelationTo;
}

export interface CartItem extends CartItemIdentifier {
  quantity: number;
}

export interface CartStoreState {
  isOpen: boolean;
  items: Record<string, CartItem>;
}

export interface CartStoreActions {
  addItem: (props: AddItemProps) => void;
  clearCart: () => void;
  decrementItem: (item: CartItemIdentifier) => void;
  incrementItem: (item: CartItemIdentifier) => void;
  removeItem: (item: CartItemIdentifier) => void;
  setIsOpen: (isOpen: boolean) => void;
}

export interface CartStore extends CartStoreState {
  actions: CartStoreActions;
}

export const getCartItemKey = ({ id, relationTo }: CartItemIdentifier) =>
  JSON.stringify([relationTo, id]);

const isValidQuantity = (quantity: number) =>
  Number.isSafeInteger(quantity) && quantity > 0;

export const useCartStore = createWithEqualityFn<CartStore>()(
  persist(
    immer((set) => ({
      actions: {
        addItem: ({ id, quantity = 1, relationTo }) => {
          if (!(id && isValidQuantity(quantity))) {
            return;
          }

          set((state) => {
            const key = getCartItemKey({ id, relationTo });
            const item = state.items[key];

            if (item) {
              const nextQuantity = item.quantity + quantity;

              if (Number.isSafeInteger(nextQuantity)) {
                item.quantity = nextQuantity;
              }

              return;
            }

            state.items[key] = {
              id,
              quantity,
              relationTo,
            };
          });
        },

        clearCart: () => {
          set((state) => {
            state.items = {};
          });
        },

        decrementItem: (identifier) => {
          set((state) => {
            const key = getCartItemKey(identifier);
            const item = state.items[key];

            if (!item) {
              return;
            }

            if (item.quantity <= 1) {
              delete state.items[key];
              return;
            }

            item.quantity -= 1;
          });
        },

        incrementItem: (identifier) => {
          set((state) => {
            const item = state.items[getCartItemKey(identifier)];

            if (!(item && Number.isSafeInteger(item.quantity + 1))) {
              return;
            }

            item.quantity += 1;
          });
        },

        removeItem: (identifier) => {
          set((state) => {
            delete state.items[getCartItemKey(identifier)];
          });
        },

        setIsOpen: (isOpen) => {
          set((state) => {
            state.isOpen = isOpen;
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

export const useIsOpen = () => useCartStore((state) => state.isOpen);

export const useCartItem = (identifier: CartItemIdentifier) =>
  useCartStore((state) => state.items[getCartItemKey(identifier)]);

export const useCartItemQuantity = (identifier: CartItemIdentifier) =>
  useCartStore(
    (state) => state.items[getCartItemKey(identifier)]?.quantity ?? 0
  );

export const useCartItems = () =>
  useCartStore((state) => Object.values(state.items), shallow);

export const useCartItemCount = () =>
  useCartStore((state) =>
    Object.values(state.items).reduce((total, item) => total + item.quantity, 0)
  );

export const useHasCartItems = () =>
  useCartStore((state) => Object.keys(state.items).length > 0);

export const useCartActions = () => useCartStore((state) => state.actions);
