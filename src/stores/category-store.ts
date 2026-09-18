import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import type { DocumentId } from "@/lib/types";
import type { Category } from "@/payload-types";

export interface CategoryStoreState {
  categories: Record<DocumentId, Category>;
  selectedCategoryId: DocumentId | null;
}

export interface CategoryStoreActions {
  addCategory: (category: Category) => void;
  clearCategories: () => void;
  getCategoryById: (id: DocumentId) => Category | undefined;
  removeCategory: (id: DocumentId) => void;
  setCategories: (categories: Category[]) => void;
  setSelectedCategoryId: (id: DocumentId | null) => void;
  updateCategory: (id: DocumentId, updates: Partial<Category>) => void;
}

export interface CategoryStore extends CategoryStoreState {
  actions: CategoryStoreActions;
}

export const useCategoryStore = createWithEqualityFn<CategoryStore>()(
  persist(
    immer((set, get) => ({
      actions: {
        addCategory: (category) => {
          set((state) => {
            state.categories[category.id] = category;
          });
        },

        clearCategories: () => {
          set((state) => {
            state.categories = {};
            state.selectedCategoryId = null;
          });
        },

        getCategoryById: (id) => get().categories[id],

        removeCategory: (id) => {
          set((state) => {
            delete state.categories[id];

            if (state.selectedCategoryId === id) {
              state.selectedCategoryId = null;
            }
          });
        },

        setCategories: (categories) => {
          set((state) => {
            state.categories = Object.fromEntries(
              categories.map((category) => [category.id, category])
            );
          });
        },

        setSelectedCategoryId: (id) => {
          set((state) => {
            state.selectedCategoryId = id;
          });
        },

        updateCategory: (id, updates) => {
          set((state) => {
            const category = state.categories[id];

            if (!category) {
              return;
            }

            Object.assign(category, updates);
          });
        },
      },
      categories: {},
      selectedCategoryId: null,
    })),
    {
      name: "tvh_product_categories",

      partialize: (state) => ({
        categories: state.categories,
      }),
    }
  ),
  shallow
);

export const useCategory = (id: DocumentId | null | undefined) =>
  useCategoryStore((state) => (id ? state.categories[id] : undefined));

export const useCategoryIds = () =>
  useCategoryStore((state) => Object.keys(state.categories));

export const useCategories = () =>
  useCategoryStore((state) => state.categories);

export const useHasCategories = () =>
  useCategoryStore((state) => Object.keys(state.categories).length > 0);

export const useSelectedCategoryId = () =>
  useCategoryStore((state) => state.selectedCategoryId);

export const useSelectedCategory = () =>
  useCategoryStore((state) => {
    const id = state.selectedCategoryId;

    return id ? state.categories[id] : undefined;
  });

export const useCategoryActions = () =>
  useCategoryStore((state) => state.actions);

export const useCategoryEntries = () =>
  useCategoryStore((state) => Object.entries(state.categories));

export const useCategoryValues = () =>
  useCategoryStore((state) => Object.values(state.categories), shallow);
