import type { CollectionConfig } from "payload";
import {
  isAdminOrOwner,
  isAuthenticated,
  isPublicAccess,
} from "@/shared/access";
import { createAuditActorHook } from "@/shared/payload/hooks/audit-actor";

import { IMAGE_MIME_TYPES } from "./constants/constant";

export const AvatarCollection: CollectionConfig = {
  access: {
    create: isAuthenticated,
    delete: isAdminOrOwner,
    read: isPublicAccess,
    update: isAdminOrOwner,
  },

  admin: {
    defaultColumns: ["filename", "user", "createdBy", "updatedBy", "updatedAt"],
    description: "Public profile photos for users.",
    group: "Users",
    groupBy: true,
    useAsTitle: "filename",
  },

  fields: [
    {
      admin: {
        description: "User this profile photo belongs to.",
        position: "sidebar",
      },
      index: true,
      name: "user",
      relationTo: "users",
      required: true,
      type: "relationship",
      unique: true,
    },

    {
      admin: {
        description: "User who uploaded this profile photo.",
        position: "sidebar",
        readOnly: true,
      },
      index: true,
      name: "createdBy",
      relationTo: "users",
      required: true,
      type: "relationship",
    },

    {
      admin: {
        description: "User who last updated this profile photo.",
        position: "sidebar",
        readOnly: true,
      },
      index: true,
      name: "updatedBy",
      relationTo: "users",
      type: "relationship",
    },
  ],

  hooks: {
    beforeChange: [createAuditActorHook()],
  },

  labels: {
    plural: "Avatars",
    singular: "Avatar",
  },

  slug: "avatars",

  timestamps: true,

  upload: {
    imageSizes: [
      {
        crop: "center",
        formatOptions: {
          format: "webp",
          options: { quality: 85 },
        },
        height: 128,
        name: "small",
        width: 128,
      },
      {
        crop: "center",
        formatOptions: {
          format: "webp",
          options: { quality: 90 },
        },
        height: 256,
        name: "medium",
        width: 256,
      },
      {
        crop: "center",
        formatOptions: {
          format: "webp",
          options: { quality: 90 },
        },
        height: 512,
        name: "large",
        width: 512,
      },
    ],
    mimeTypes: [...IMAGE_MIME_TYPES],
  },
};
