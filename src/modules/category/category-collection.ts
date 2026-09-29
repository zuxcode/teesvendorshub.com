import type { CollectionConfig } from "payload";
import { isAdmin, isPublicAccess } from "@/shared/access";
import { createAuditActorHook } from "@/shared/payload/hooks/audit-actor";
import { updateSlugHook } from "@/shared/payload/hooks/update-slug";
import { CATEGORY_STATUS } from "./constants/constant";
import { preventCategoryCycle } from "./helpers/prevent-category-cycle";
import { preventCategoryDelete } from "./helpers/prevent-category-delete";

export const CategoriesCollection: CollectionConfig = {
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: isPublicAccess,
    update: isAdmin,
  },

  admin: {
    defaultColumns: ["name", "slug", "parent", "status", "updatedAt"],
    description: "Product categories used to organize the TVH product catalog.",
    group: "Catalog",
    groupBy: true,
    listSearchableFields: ["name", "slug"],
    useAsTitle: "name",
  },

  fields: [
    {
      admin: {
        description: "Human-readable category name.",
      },
      name: "name",
      required: true,
      type: "text",
      unique: true,
    },

    {
      admin: {
        description:
          "URL-friendly identifier generated from the category name.",
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
        description: "Optional parent category for nested categories.",
      },
      hooks: {
        beforeValidate: [preventCategoryCycle],
      },
      index: true,
      name: "parent",
      relationTo: "categories",
      type: "relationship",
    },

    {
      admin: {
        description: "Controls whether the category is available to customers.",
        position: "sidebar",
      },
      defaultValue: CATEGORY_STATUS.ACTIVE,
      index: true,
      name: "status",
      options: [
        {
          label: "Active",
          value: CATEGORY_STATUS.ACTIVE,
        },
        {
          label: "Inactive",
          value: CATEGORY_STATUS.INACTIVE,
        },
      ],
      required: true,
      type: "select",
    },

    {
      admin: {
        description: "Admin who created this category.",
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
        description: "Admin who last updated this category.",
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
    beforeDelete: [preventCategoryDelete],
  },

  indexes: [
    {
      fields: ["status", "parent"],
      unique: false,
    },
    {
      fields: ["createdBy", "createdAt"],
      unique: false,
    },
  ],

  labels: {
    plural: "Categories",
    singular: "Category",
  },

  slug: "categories",

  timestamps: true,
};
