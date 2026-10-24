import type { CollectionConfig } from "payload";

import { isAdmin, isPublicAccess } from "@/shared/access";
import { createAuditActorHook } from "@/shared/payload/hooks/audit-actor";
import { updateSlugHook } from "@/shared/payload/hooks/update-slug";

export const CountryCollection: CollectionConfig = {
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: isPublicAccess,
    update: isAdmin,
  },

  admin: {
    defaultColumns: ["name", "slug", "updatedAt"],
    description: "Countries available for products in the TVH catalog.",
    group: "Catalog",
    listSearchableFields: ["name", "slug"],
    useAsTitle: "name",
  },

  fields: [
    {
      admin: {
        description: "Country name.",
      },
      name: "name",
      required: true,
      type: "text",
      unique: true,
    },
    {
      admin: {
        description: "URL-friendly identifier generated from the country name.",
        position: "sidebar",
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          updateSlugHook({
            sourceField: "name",
          }),
        ],
      },
      index: true,
      name: "slug",
      required: true,
      type: "text",
      unique: true,
    },
    {
      admin: {
        description: "Admin who created this country.",
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
        description: "Admin who last updated this country.",
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

  indexes: [
    {
      fields: ["createdBy", "createdAt"],
      unique: false,
    },
  ],

  labels: {
    plural: "Countries",
    singular: "Country",
  },

  slug: "countries",

  timestamps: true,
};
