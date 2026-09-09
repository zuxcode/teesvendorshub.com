import type { CollectionConfig } from "payload";

import { isAdmin, isPublicAccess } from "@/access";
import { createAuditActorHook } from "../hooks/audit-actor";

export const CategoriesCollection: CollectionConfig = {
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: isPublicAccess,
    update: isAdmin,
  },

  admin: {
    defaultColumns: ["name", "slug", "description", "createdBy", "updatedAt"],
    description: "Product categories used to organize the TVH product catalog.",
    group: "Ecommerce",
    groupBy: true,
    listSearchableFields: ["name", "slug"],
    useAsTitle: "name",
  },

  fields: [
    {
      admin: {
        description: "Category name, e.g. SIM Cards, Data Plans, Accessories.",
      },
      label: "Name",
      name: "name",
      required: true,
      type: "text",
    },

    {
      admin: {
        description:
          "Short description of what products belong to this category.",
      },
      name: "description",
      type: "textarea",
    },

    // {
    //   admin: {
    //     description:
    //       "URL-friendly identifier generated from the category name.",
    //     position: "sidebar",
    //     readOnly: true,
    //   },
    //   hooks: {
    //     beforeChange: [
    //       updateSlugHook({
    //         sourceField: "name",
    //       }),
    //     ],
    //   },
    //   index: true,
    //   name: "slug",
    //   required: true,
    //   type: "text",
    //   unique: true,
    // },

    {
      admin: {
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
    beforeChange: [
      createAuditActorHook({
        createdBy: "createdBy",
        updatedBy: "updatedBy",
      }),
    ],
  },

  labels: {
    plural: "Categories",
    singular: "Category",
  },

  slug: "categories",

  timestamps: true,
};
