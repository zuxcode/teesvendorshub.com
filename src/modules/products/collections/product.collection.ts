import type { CollectionConfig } from "payload";
import { isAdmin, isPublicAccess } from "@/shared/access";
import { CURRENCY, PRODUCT_BADGE, PRODUCT_STATUS } from "@/shared/constant";
import { createAuditActorHook } from "@/shared/payload/hooks/audit-actor";
import {
  koboToNaira,
  nairaToKobo,
} from "@/shared/payload/hooks/current-converter";
import { updateSlugHook } from "@/shared/payload/hooks/update-slug";
import { validateNonNegativeInteger } from "@/shared/payload/hooks/validate-non-negativate-integer";

export const ProductsCollection: CollectionConfig = {
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: isPublicAccess,
    update: isAdmin,
  },

  admin: {
    defaultColumns: [
      "name",
      "productType",
      "status",
      "virtualStock",
      "stock",
      "priceKobo",
      "category",
      "updatedAt",
    ],
    description:
      "Products available for purchase. Product type determines fulfillment, while category organizes products in the catalog.",
    group: "Catalog",
    groupBy: true,
    useAsTitle: "name",
  },

  fields: [
    {
      admin: {
        description:
          "Product name displayed to customers, e.g. UK 🇬🇧 Lebara SIM.",
      },
      label: "Name",
      name: "name",
      required: true,
      type: "text",
    },

    {
      admin: {
        description:
          "Customer-facing description of the product and its included features.",
      },
      label: "Description",
      name: "description",
      required: true,
      type: "textarea",
    },

    {
      admin: {
        description: "Primary image displayed for the product.",
      },
      label: "Product Image",
      name: "productImage",
      relationTo: "product-library",
      required: true,
      type: "relationship",
    },

    {
      admin: {
        description:
          "Product lifecycle status. Storefront availability is determined separately.",
        position: "sidebar",
      },
      defaultValue: PRODUCT_STATUS.ACTIVE,
      index: true,
      label: "Status",
      name: "status",
      options: [
        {
          label: "Active",
          value: PRODUCT_STATUS.ACTIVE,
        },
        {
          label: "Draft",
          value: PRODUCT_STATUS.DRAFT,
        },
        {
          label: "Inactive",
          value: PRODUCT_STATUS.INACTIVE,
        },
        {
          label: "Archived",
          value: PRODUCT_STATUS.ARCHIVED,
        },
      ],
      required: true,
      type: "select",
    },

    {
      admin: {
        description: "Marketing badges displayed on the product.",
        position: "sidebar",
      },
      hasMany: true,
      label: "Badges",
      name: "badges",
      options: [
        {
          label: "Best Seller",
          value: PRODUCT_BADGE.BEST_SELLER,
        },
        {
          label: "Featured",
          value: PRODUCT_BADGE.FEATURED,
        },
        {
          label: "New",
          value: PRODUCT_BADGE.NEW,
        },
        {
          label: "Trending",
          value: PRODUCT_BADGE.TRENDING,
        },
      ],
      type: "select",
    },

    {
      admin: {
        description:
          "Authoritative inventory quantity available for fulfillment. Updated through inventory movements.",
        position: "sidebar",
      },
      defaultValue: 0,
      index: true,
      label: "Stock",
      min: 0,
      name: "stock",
      required: true,
      type: "number",
      validate: validateNonNegativeInteger("Stock"),
    },

    {
      admin: {
        description:
          "Customer-facing inventory quantity used for storefront display. Does not replace authoritative stock validation.",
        position: "sidebar",
        readOnly: true,
      },
      defaultValue: 0,
      index: true,
      label: "Virtual Stock",
      min: 0,
      name: "virtualStock",
      required: true,
      type: "number",
      validate: validateNonNegativeInteger("Virtual stock"),
    },

    {
      admin: {
        description:
          "Enter the selling price in naira. Stored as integer kobo (100 kobo = ₦1).",
      },
      hooks: {
        afterRead: [koboToNaira],
        beforeValidate: [nairaToKobo],
      },
      label: "Price (NGN)",
      min: 0,
      name: "priceKobo",
      required: true,
      type: "number",
      validate: validateNonNegativeInteger("Price"),
    },

    {
      admin: {
        description: "Category this product belongs to.",
      },
      index: true,
      label: "Category",
      name: "category",
      relationTo: "categories",
      required: true,
      type: "relationship",
    },

    {
      admin: {
        description: "URL-friendly identifier generated from the product name.",
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
        description: "Currency used for this product.",
        position: "sidebar",
        readOnly: true,
      },
      defaultValue: CURRENCY.NGN,
      index: true,
      name: "currency",
      options: [
        {
          label: "NGN",
          value: CURRENCY.NGN,
        },
      ],
      required: true,
      type: "select",
    },

    {
      access: {
        update: () => false,
      },
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
      access: {
        update: () => false,
      },
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
    beforeChange: [createAuditActorHook()],
  },

  indexes: [
    {
      fields: ["status", "priceKobo"],
    },
    {
      fields: ["category", "status"],
    },
    {
      fields: ["createdBy", "createdAt"],
    },
  ],

  labels: {
    plural: "Products",
    singular: "Product",
  },
  slug: "products",

  timestamps: true,
};
