import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import type { ProductLibrary } from "@/payload-types";
import type { ResourceId } from "@/shared/types";

export interface ProductImageStoreState {
  images: Record<ResourceId, ProductLibrary>;
  selectedImageId: ResourceId | null;
}

export interface ProductImageStoreActions {
  addImage: (image: ProductLibrary) => void;
  clearImages: () => void;
  getImageById: (id: ResourceId) => ProductLibrary | undefined;
  removeImage: (id: ResourceId) => void;
  setImages: (images: ProductLibrary[]) => void;
  setSelectedImageId: (id: ResourceId | null) => void;
  updateImage: (id: ResourceId, updates: Partial<ProductLibrary>) => void;
}

export interface ProductImageStore extends ProductImageStoreState {
  actions: ProductImageStoreActions;
}

export const useProductImageStore = createWithEqualityFn<ProductImageStore>()(
  persist(
    immer((set, get) => ({
      actions: {
        addImage: (image) => {
          set((state) => {
            state.images[image.id] = image;
          });
        },

        clearImages: () => {
          set((state) => {
            state.images = {};
            state.selectedImageId = null;
          });
        },

        getImageById: (id) => get().images[id],

        removeImage: (id) => {
          set((state) => {
            delete state.images[id];

            if (state.selectedImageId === id) {
              state.selectedImageId = null;
            }
          });
        },

        setImages: (images) => {
          set((state) => {
            state.images = Object.fromEntries(
              images.map((image) => [image.id, image])
            );
          });
        },

        setSelectedImageId: (id) => {
          set((state) => {
            state.selectedImageId = id;
          });
        },

        updateImage: (id, updates) => {
          set((state) => {
            const image = state.images[id];

            if (image) {
              Object.assign(image, updates);
            }
          });
        },
      },

      images: {},
      selectedImageId: null,
    })),
    {
      name: "tvh_product_images",

      partialize: (state) => ({
        images: state.images,
      }),
    }
  ),
  shallow
);

export const useProductImage = (id: ResourceId | null | undefined) =>
  useProductImageStore((state) => (id ? state.images[id] : undefined));

export const useProductImageIds = () =>
  useProductImageStore((state) => Object.keys(state.images));

export const useProductImages = () =>
  useProductImageStore((state) => state.images);

export const useHasProductImages = () =>
  useProductImageStore((state) => Object.keys(state.images).length > 0);

export const useProductImageActions = () =>
  useProductImageStore((state) => state.actions);
