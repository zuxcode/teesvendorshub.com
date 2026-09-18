import type { CollectionConfig } from "payload";
import { isAdmin, isPublicAccess } from "@/access";
import { CATEGORY_STATUS } from "@/lib/config/collection-config";
import { createAuditActorHook } from "../hooks/audit-actor";
import { updateSlugHook } from "../hooks/update-slug";
import { preventCategoryDelete } from "./hooks/prevent-category-delete";

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
    group: "Ecommerce",
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
        description: "Short description used for category pages and SEO.",
      },
      name: "description",
      type: "textarea",
    },

    {
      admin: {
        description: "Optional image representing the category.",
      },
      name: "categoryImage",
      relationTo: "product-library",
      type: "relationship",
    },

    {
      admin: {
        description: "Optional parent category for nested categories.",
      },
      index: true,
      maxDepth: 1,
      name: "parent",
      relationTo: "categories",
      type: "relationship",
    },

    {
      admin: {
        position: "sidebar",
      },
      defaultValue: "active",
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
        description: "Optional metadata for the category page.",
      },
      fields: [
        {
          admin: {
            description: "Custom SEO title for the category page.",
          },
          name: "title",
          type: "text",
        },
        {
          admin: {
            description: "Custom SEO description for the category page.",
          },
          name: "description",
          type: "textarea",
        },
      ],
      name: "seo",
      type: "group",
    },

    {
      admin: {
        description: "Admin who created this product.",
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
        description: "Admin who last updated this product.",
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
    beforeDelete: [preventCategoryDelete],
  },
  labels: {
    plural: "Categories",
    singular: "Category",
  },
  slug: "categories",

  timestamps: true,
};
