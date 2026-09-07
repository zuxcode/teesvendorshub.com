import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "alt",
      required: true,
      type: "text",
    },
  ],
  labels: {
    plural: "Media Library",
    singular: "Media Library",
  },
  slug: "media",
  upload: true,
};
