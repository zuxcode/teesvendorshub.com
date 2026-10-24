import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import type { Product } from "@/payload-types";

export interface ProductStoreState {
  products: Record<string, Product>;
  selectedProductId: string | null;
}

export interface ProductStoreActions {
  addProduct: (product: Product) => void;
  clearProducts: () => void;
  getProductById: (id: string) => Product | undefined;
  removeProduct: (id: string) => void;
  setProducts: (products: Product[]) => void;
  setSelectedProductId: (id: string | null) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
}

export interface ProductStore extends ProductStoreState {
  actions: ProductStoreActions;
}

export const useProductStore = createWithEqualityFn<ProductStore>()(
  persist(
    immer((set, get) => ({
      actions: {
        addProduct: (product) => {
          set((state) => {
            state.products[product.id] = product;
          });
        },

        clearProducts: () => {
          set((state) => {
            state.products = {};
          });
        },

        getProductById: (id) => get().products[id],

        removeProduct: (id) => {
          set((state) => {
            delete state.products[id];
          });
        },

        setProducts: (products) => {
          set((state) => {
            state.products = Object.fromEntries(
              products.map((product) => [product.id, product])
            );
          });
        },

        setSelectedProductId: (id) => {
          set((state) => {
            state.selectedProductId = id;
          });
        },

        updateProduct: (id, updates) => {
          set((state) => {
            const product = state.products[id];

            if (!product) {
              return;
            }

            Object.assign(product, updates);
          });
        },
      },
      products: {},
      selectedProductId: null,
    })),
    {
      name: "tvh_products",

      partialize: (state) => ({
        products: state.products,
      }),
    }
  ),
  shallow
);

export const useProduct = (id: string | null | undefined) =>
  useProductStore((state) => (id ? state.products[id] : undefined));

export const useProducts = () =>
  useProductStore((state) => Object.values(state.products));

export const useProductById = () => useProductStore((state) => state.products);

export const useSelectedProductId = () =>
  useProductStore((state) => state.selectedProductId);

export const useSelectedProduct = () =>
  useProductStore((state) => {
    const { selectedProductId, products } = state;
    return selectedProductId ? products[selectedProductId] : undefined;
  });

export const useProductActions = () =>
  useProductStore((state) => state.actions);
