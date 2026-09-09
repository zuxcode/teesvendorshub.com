import type { CollectionConfig } from "payload";

import {
  isAdmin,
  isAdminOrBuyerOnlyFieldAccess,
  isPublicAccess,
} from "@/access";
import { PRODUCT_STATUS } from "@/lib/config/collection-config";
import { createAuditActorHook } from "../hooks/audit-actor";

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
      "status",
      "price",
      "country",
      "buyer",
      "createdBy",
      "updatedAt",
    ],
    description:
      "Products available for purchase. Sensitive product information is restricted to authorized users.",
    group: "Ecommerce",
    groupBy: true,
    useAsTitle: "name",
  },

  fields: [
    {
      admin: {
        description: "Unique product name, e.g. UK 🇬🇧 Lebara Product.",
      },
      label: "Name",
      name: "name",
      required: true,
      type: "text",
    },

    {
      admin: {
        description: "Describe the product and its included features.",
      },
      label: "Description",
      name: "description",
      required: true,
      type: "textarea",
    },

    {
      admin: {
        description: "Primary product image.",
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
        position: "sidebar",
      },
      defaultValue: PRODUCT_STATUS.AVAILABLE,
      name: "status",
      options: [
        {
          label: "Available",
          value: PRODUCT_STATUS.AVAILABLE,
        },
        {
          label: "Pending",
          value: PRODUCT_STATUS.PENDING,
        },
        {
          label: "Sold",
          value: PRODUCT_STATUS.SOLD,
        },
        {
          label: "Delivered",
          value: PRODUCT_STATUS.DELIVERED,
        },
      ],
      required: true,
      type: "select",
    },

    {
      admin: {
        position: "sidebar",
      },
      label: "Price (₦ NGN)",
      min: 100,
      name: "price",
      required: true,
      type: "number",
    },

    {
      admin: {
        description: "Country associated with this Product.",
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

    {
      access: {
        read: isAdminOrBuyerOnlyFieldAccess,
      },
      admin: {
        description:
          "Sensitive Product information. Visible only to authorized users.",
      },
      label: "Product Details",
      name: "secret",
      required: true,
      type: "textarea",
    },

    // Ownership & Audit

    {
      admin: {
        description: "Admin who listed this product.",
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

    {
      access: {
        read: isAdminOrBuyerOnlyFieldAccess,
      },
      admin: {
        description: "Customer who purchased this product.",
        position: "sidebar",
        readOnly: true,
      },
      index: true,
      name: "buyer",
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

  indexes: [
    {
      fields: ["status", "country", "price"],
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
