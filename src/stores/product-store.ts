import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import type { DocumentId, StoreStatus } from "@/lib/types";
import type { Product } from "@/payload-types";

export interface ProductStoreState {
  error: string | null;
  products: Record<DocumentId, Product>;
  selectedProductId: DocumentId | null;
  status: StoreStatus;
}

export interface ProductStoreActions {
  addProduct: (product: Product) => void;
  clearProducts: () => void;
  getProductById: (id: DocumentId) => Product | undefined;
  removeProduct: (id: DocumentId) => void;
  setError: (error: string | null) => void;
  setProducts: (products: Product[]) => void;
  setSelectedProductId: (id: DocumentId | null) => void;
  setStatus: (status: StoreStatus) => void;
  updateProduct: (id: DocumentId, updates: Partial<Product>) => void;
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
            state.status = "ready";
            state.error = null;
          });
        },

        clearProducts: () => {
          set((state) => {
            state.products = {};
            state.status = "ready";
            state.error = null;
          });
        },

        getProductById: (id) => get().products[id],

        removeProduct: (id) => {
          set((state) => {
            delete state.products[id];
            state.status = "ready";
            state.error = null;
          });
        },

        setError: (error) => {
          set((state) => {
            state.error = error;
            state.status = "error";
          });
        },

        setProducts: (products) => {
          set((state) => {
            state.products = Object.fromEntries(
              products.map((product) => [product.id, product])
            );

            state.status = "ready";
            state.error = null;
          });
        },

        setSelectedProductId: (id) => {
          set((state) => {
            state.selectedProductId = id;
          });
        },

        setStatus: (status) => {
          set((state) => {
            state.status = status;

            if (status !== "error") {
              state.error = null;
            }
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
      error: null,
      products: {},
      selectedProductId: null,
      status: "idle",
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

export const useProduct = (id: DocumentId | null | undefined) =>
  useProductStore((state) => (id ? state.products[id] : undefined));

export const useProducts = () => useProductStore((state) => state.products);
export const useSelectedProductId = () =>
  useProductStore((state) => state.selectedProductId);

export const useSelectedProduct = () =>
  useProductStore((state) => {
    const { selectedProductId, products } = state;
    return selectedProductId ? products[selectedProductId] : undefined;
  });

export const useHasSelectedProduct = () =>
  useProductStore((state) => state.selectedProductId !== null);

export const useProductIds = () =>
  useProductStore((state) => Object.keys(state.products));

export const useProductStatus = () => useProductStore((state) => state.status);

export const useProductError = () => useProductStore((state) => state.error);

export const useHasProducts = () =>
  useProductStore((state) => Object.keys(state.products).length > 0);

export const useProductCount = () =>
  useProductStore((state) => Object.keys(state.products).length);

export const useProductActions = () =>
  useProductStore((state) => state.actions);

export const useProductEntries = () =>
  useProductStore((state) => Object.entries(state.products));

export const useProductValues = () =>
  useProductStore((state) => Object.values(state.products), shallow);
