import type { CollectionConfig } from "payload";
import { isAdmin, isPublicAccess } from "@/access";
import { updateSlugHook } from "../hooks/update-slug";

export const CategoriesCollection: CollectionConfig = {
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: isPublicAccess,
    update: isAdmin,
  },
  admin: {
    defaultColumns: [
      "name",
      "slug",
      "parent",
      "status",
      "sortOrder",
      "updatedAt",
    ],
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
        beforeChange: [
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
          value: "active",
        },
        {
          label: "Inactive",
          value: "inactive",
        },
      ],
      required: true,
      type: "select",
    },

    {
      admin: {
        description: "Controls category ordering in the catalog.",
        position: "sidebar",
      },
      defaultValue: 0,
      name: "sortOrder",
      required: true,
      type: "number",
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
  ],
  slug: "categories",

  timestamps: true,
};
