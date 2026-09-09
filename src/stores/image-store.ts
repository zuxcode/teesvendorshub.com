import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import type { DocumentId } from "@/lib/types";
import type { Media } from "@/payload-types";

export interface ImageStoreState {
  images: Record<DocumentId, Media>;
  selectedImageId: DocumentId | null;
}

export interface ImageStoreActions {
  addImage: (image: Media) => void;
  clearImages: () => void;
  getImageById: (id: DocumentId) => Media | undefined;
  removeImage: (id: DocumentId) => void;
  setImages: (images: Media[]) => void;
  setSelectedImageId: (id: DocumentId | null) => void;
  updateImage: (id: DocumentId, updates: Partial<Media>) => void;
}

export interface ImageStore extends ImageStoreState {
  actions: ImageStoreActions;
}

export const useImageStore = createWithEqualityFn<ImageStore>()(
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
      name: "tvh_images",

      partialize: (state) => ({
        images: state.images,
      }),
    }
  ),
  shallow
);
