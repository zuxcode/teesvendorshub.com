import type { CollectionConfig } from "payload";

import {
  isAdmin,
  isAdminOrBuyerOnlyFieldAccess,
  isPublicAccess,
} from "@/access";

import { createAuditActorHook } from "@/shared/payload/hooks/audit-actor";
import { updateSlugHook } from "@/shared/payload/hooks/update-slug";
import { PRODUCT_BADGE, PRODUCT_STATUS, PRODUCT_TYPE } from "./product.contants";

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
      "stock",
      "price",
      "country",
      "category",
      "buyer",
      "updatedAt",
    ],
    description:
      "Products available for purchase. Product type determines fulfillment, while product kind identifies the product category.",
    group: "Ecommerce",
    groupBy: true,
    useAsTitle: "name",
  },

  fields: [
    // -------------------------------------------------------------------------
    // BASIC INFORMATION
    // -------------------------------------------------------------------------

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
      index: true,
      label: "Product Image",
      name: "productImage",
      relationTo: "product-library",
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

    // -------------------------------------------------------------------------
    // PRODUCT CLASSIFICATION
    // -------------------------------------------------------------------------

    {
      admin: {
        description:
          "Determines how the product is fulfilled. Physical products require physical delivery; digital products are delivered electronically.",
        position: "sidebar",
      },
      defaultValue: PRODUCT_TYPE.PHYSICAL,
      index: true,
      label: "Product Type",
      name: "productType",
      options: [
        {
          label: "Physical",
          value: PRODUCT_TYPE.PHYSICAL,
        },
        {
          label: "Digital",
          value: PRODUCT_TYPE.DIGITAL,
        },
      ],
      required: true,
      type: "select",
    },

    // -------------------------------------------------------------------------
    // PRODUCT STATUS
    // -------------------------------------------------------------------------

    {
      admin: {
        description:
          "Product lifecycle status. Inventory availability is determined from stock.",
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

    // -------------------------------------------------------------------------
    // INVENTORY
    // -------------------------------------------------------------------------

    {
      admin: {
        description:
          "Current inventory quantity. Stock is updated through inventory movements.",
        position: "sidebar",
        readOnly: true,
      },
      defaultValue: 0,
      index: true,
      label: "Stock",
      min: 0,
      name: "stock",
      required: true,
      type: "number",
    },

    // -------------------------------------------------------------------------
    // MARKETING
    // -------------------------------------------------------------------------

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
          label: "Coming Soon",
          value: PRODUCT_BADGE.COMING_SOON,
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

    // -------------------------------------------------------------------------
    // PRICING
    // -------------------------------------------------------------------------

    {
      admin: {
        description: "Current selling price of the product in Nigerian Naira.",
        position: "sidebar",
      },
      index: true,
      label: "Price (₦ NGN)",
      min: 0,
      name: "price",
      required: true,
      type: "number",
    },

    // -------------------------------------------------------------------------
    // LOCATION / MARKET
    // -------------------------------------------------------------------------

    {
      admin: {
        description: "Country associated with the product or service.",
        position: "sidebar",
      },
      index: true,
      label: "Country",
      name: "country",
      type: "text",
    },

    {
      admin: {
        description: "Category this product belongs to.",
        position: "sidebar",
      },
      index: true,
      label: "Category",
      name: "category",
      relationTo: "categories",
      required: true,
      type: "relationship",
    },

    // -------------------------------------------------------------------------
    // SENSITIVE PRODUCT INFORMATION
    // -------------------------------------------------------------------------

    {
      access: {
        read: isAdminOrBuyerOnlyFieldAccess,
      },
      admin: {
        description:
          "Sensitive product information visible only to authorized administrators or the purchasing buyer.",
      },
      label: "Product Details",
      name: "secret",
      required: true,
      type: "textarea",
    },

    // -------------------------------------------------------------------------
    // BUYER
    // -------------------------------------------------------------------------

    {
      access: {
        read: isAdminOrBuyerOnlyFieldAccess,
      },
      admin: {
        description: "Customer associated with this product purchase.",
        position: "sidebar",
        readOnly: true,
      },
      index: true,
      label: "Buyer",
      name: "buyer",
      relationTo: "users",
      type: "relationship",
    },

    // -------------------------------------------------------------------------
    // AUDIT
    // -------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------

  hooks: {
    beforeChange: [
      createAuditActorHook({
        createdBy: "createdBy",
        updatedBy: "updatedBy",
      }),
    ],
  },

  // ---------------------------------------------------------------------------
  // INDEXES
  // ---------------------------------------------------------------------------

  indexes: [
    {
      fields: ["status", "productType"],
      unique: false,
    },

    {
      fields: ["status", "country", "price"],
      unique: false,
    },

    {
      fields: ["category", "status"],
      unique: false,
    },

    {
      fields: ["stock"],
      unique: false,
    },

    {
      fields: ["buyer", "createdAt"],
      unique: false,
    },

    {
      fields: ["createdBy", "createdAt"],
      unique: false,
    },
  ],

  labels: {
    plural: "Products",
    singular: "Product",
  },
  slug: "products",

  timestamps: true,
};
