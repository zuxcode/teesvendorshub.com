import type { CollectionConfig } from "payload";

import {
  isAdmin,
  isAdminOrBuyerOnlyFieldAccess,
  isPublicAccess,
} from "@/access";

import { PRODUCT_STATUS } from "@/lib/config/collection-config";
import { createAuditActorHook } from "../hooks/audit-actor";

export const SimCardsCollection: CollectionConfig = {
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: isPublicAccess,
    update: isAdmin,
  },

  admin: {
    defaultColumns: [
      "name",
      "type",
      "status",
      "price",
      "country",
      "buyer",
      "updatedAt",
    ],

    description:
      "SIM cards available for purchase. Sensitive SIM information is restricted to authorized users.",

    group: "Ecommerce",
    groupBy: true,
    useAsTitle: "name",
  },

  fields: [
    // Basic Information
    {
      admin: {
        description: "Unique SIM product name, e.g. UK 🇬🇧 Lebara SIM.",
      },
      label: "Name",
      name: "name",
      required: true,
      type: "text",
    },

    {
      admin: {
        description: "Describe the SIM card and its included features.",
      },
      label: "Description",
      name: "description",
      required: true,
      type: "textarea",
    },

    {
      admin: {
        description: "Primary SIM card product image.",
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
        description: "SIM card type.",
        position: "sidebar",
      },
      defaultValue: "physical_sim",
      label: "SIM Type",
      name: "type",
      options: [
        {
          label: "Physical SIM",
          value: "physical_sim",
        },
        {
          label: "eSIM",
          value: "e_sim",
        },
      ],
      required: true,
      type: "select",
    },

    // Availability
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
          label: "Low Stock",
          value: PRODUCT_STATUS.LOW_STOCK,
        },
        {
          label: "Out of Stock",
          value: PRODUCT_STATUS.OUT_OF_STOCK,
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
        description: "Country associated with this SIM card.",
        position: "sidebar",
      },
      index: true,
      label: "Country",
      name: "country",
      required: true,
      type: "text",
    },

    // Ownership & Audit
    {
      admin: {
        description: "Admin who listed this SIM card.",
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
        description: "Admin who last updated this SIM card.",
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
        description: "Customer who purchased this SIM card.",
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
    plural: "SIM Cards",
    singular: "SIM Card",
  },

  slug: "sim-cards",

  timestamps: true,
};
