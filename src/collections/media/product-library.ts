import type { CollectionConfig } from "payload";

import { isAdmin, isPublicAccess } from "@/access";
import { IMAGE_MIME_TYPES } from "@/lib/config/collection-config";
import { createAuditActorHook } from "../hooks/audit-actor";
import { validateAltText } from "./validation";

export const ProductLibraryCollection: CollectionConfig = {
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: isPublicAccess,
    update: isAdmin,
  },

  admin: {
    defaultColumns: ["filename", "alt", "uploadedBy", "updatedBy", "updatedAt"],
    description: "Central product image library.",
    group: "Ecommerce",
    groupBy: true,
    useAsTitle: "filename",
  },

  fields: [
    {
      admin: {
        description: "User who uploaded this file.",
        position: "sidebar",
        readOnly: true,
      },
      index: true,
      name: "uploadedBy",
      relationTo: "users",
      required: true,
      type: "relationship",
    },

    {
      admin: {
        description: "User who last updated this file.",
        position: "sidebar",
        readOnly: true,
      },
      index: true,
      name: "updatedBy",
      relationTo: "users",
      type: "relationship",
    },

    {
      admin: {
        description:
          "Required for accessibility and SEO. Describe what the image shows.",
      },
      label: "Alt Text",
      name: "alt",
      required: true,
      type: "text",
      validate: validateAltText,
    },
  ],

  hooks: {
    beforeChange: [
      createAuditActorHook({
        createdBy: "uploadedBy",
        updatedBy: "updatedBy",
      }),
    ],
  },

  labels: {
    plural: "Product Library",
    singular: "Product Library",
  },
  slug: "product-library",

  timestamps: true,

  upload: {
    filenameCompoundIndex: ["filename"],
    imageSizes: [
      {
        crop: "center",
        formatOptions: { format: "webp", options: { quality: 80 } },
        height: 300,
        name: "thumbnail",
        width: 400,
      },
      {
        crop: "center",
        formatOptions: { format: "webp", options: { quality: 85 } },
        height: 576,
        name: "card",
        width: 768,
      },
      {
        formatOptions: { format: "webp", options: { quality: 90 } },
        name: "large",
        width: 1200,
      },
    ],
    mimeTypes: [...IMAGE_MIME_TYPES],
    staticDir: "tmp",
  },
};
