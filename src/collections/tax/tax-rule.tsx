import type { CollectionConfig } from "payload";

import { isAdmin, isPublicAccess } from "@/access";
import { CURRENCY } from "@/lib/config/collection-config";
import { createAuditActorHook } from "../hooks/audit-actor";

export const TaxRulesCollection: CollectionConfig = {
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: isPublicAccess,
    update: isAdmin,
  },

  admin: {
    defaultColumns: ["name", "type", "rate", "country", "status", "updatedAt"],
    description: "Tax rules used to calculate taxes during checkout.",
    group: "Ecommerce",
    useAsTitle: "name",
  },

  fields: [
    // BASIC
    {
      admin: {
        description: 'Tax rule name displayed to administrators, e.g. "VAT".',
      },
      label: "Name",
      name: "name",
      required: true,
      type: "text",
    },

    {
      admin: {
        description:
          "Optional description explaining when this tax rule applies.",
      },
      label: "Description",
      name: "description",
      type: "textarea",
    },

    // TAX TYPE
    {
      admin: {
        description:
          "Determines whether the tax is calculated as a percentage or fixed amount.",
        position: "sidebar",
      },
      defaultValue: "percentage",
      index: true,
      label: "Tax Type",
      name: "type",
      options: [
        {
          label: "Percentage",
          value: "percentage",
        },
        {
          label: "Fixed Amount",
          value: "fixed",
        },
      ],
      required: true,
      type: "select",
    },

    // RATE
    {
      admin: {
        condition: (_, siblingData) => siblingData?.type === "percentage",
        description:
          "Tax percentage applied to the taxable amount. Enter 7.5 for 7.5%.",
        position: "sidebar",
      },
      label: "Rate (%)",
      min: 0,
      name: "rate",
      required: true,
      type: "number",
    },

    // FIXED AMOUNT
    {
      admin: {
        condition: (_, siblingData) => siblingData?.type === "fixed",
        description: "Fixed tax amount in the store currency.",
        position: "sidebar",
      },
      label: "Amount (₦ NGN)",
      min: 0,
      name: "amount",
      type: "number",
    },

    // CURRENCY
    {
      admin: {
        description: "Currency used when a fixed tax amount is configured.",
        position: "sidebar",
      },
      defaultValue: CURRENCY.NGN,
      index: true,
      label: "Currency",
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

    // MARKET
    {
      admin: {
        description: "Country where this tax rule applies.",
        position: "sidebar",
      },
      defaultValue: "NG",
      index: true,
      label: "Country",
      name: "country",
      options: [
        {
          label: "Nigeria",
          value: "NG",
        },
      ],
      required: true,
      type: "select",
    },

    // APPLICABILITY
    {
      admin: {
        description: "Determines which products are subject to this tax rule.",
      },
      defaultValue: "all",
      index: true,
      label: "Applies To",
      name: "appliesTo",
      options: [
        {
          label: "All Products",
          value: "all",
        },
        {
          label: "Specific Products",
          value: "products",
        },
        {
          label: "Specific Categories",
          value: "categories",
        },
      ],
      required: true,
      type: "select",
    },

    {
      admin: {
        condition: (_, siblingData) => siblingData?.appliesTo === "products",
        description: "Products to which this tax rule applies.",
      },
      hasMany: true,
      label: "Products",
      name: "products",
      relationTo: "products",
      type: "relationship",
    },

    {
      admin: {
        condition: (_, siblingData) => siblingData?.appliesTo === "categories",
        description: "Categories to which this tax rule applies.",
      },
      hasMany: true,
      label: "Categories",
      name: "categories",
      relationTo: "categories",
      type: "relationship",
    },

    // STATUS
    {
      admin: {
        description: "Only active tax rules are considered during checkout.",
        position: "sidebar",
      },
      defaultValue: "active",
      index: true,
      label: "Status",
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

    // EFFECTIVE PERIOD
    {
      admin: {
        description:
          "Optional date from which this tax rule becomes effective.",
        position: "sidebar",
      },
      label: "Effective From",
      name: "effectiveFrom",
      type: "date",
    },

    {
      admin: {
        description:
          "Optional date after which this tax rule is no longer effective.",
        position: "sidebar",
      },
      label: "Effective Until",
      name: "effectiveUntil",
      type: "date",
    },

    // AUDIT
    {
      admin: {
        description: "Admin who created this tax rule.",
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
        description: "Admin who last updated this tax rule.",
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

  indexes: [
    {
      fields: ["status", "country"],
      unique: false,
    },
    {
      fields: ["status", "appliesTo"],
      unique: false,
    },
    {
      fields: ["country", "status", "effectiveFrom"],
      unique: false,
    },
  ],

  labels: {
    plural: "Tax Rules",
    singular: "Tax Rule",
  },

  slug: "tax-rules",

  timestamps: true,
};
