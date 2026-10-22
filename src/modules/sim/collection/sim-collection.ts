import type { CollectionConfig } from "payload";

import { CURRENCY } from "@/modules/order/order.constants";
import { isAdmin, isPublicAccess } from "@/shared/access";
import { PRODUCT_BADGE, PRODUCT_STATUS } from "@/shared/constant";
import { createAuditActorHook } from "@/shared/payload/hooks/audit-actor";
import {
  koboToNaira,
  nairaToKobo,
} from "@/shared/payload/hooks/current-converter";
import { updateSlugHook } from "@/shared/payload/hooks/update-slug";
import { validateNonNegativeInteger } from "@/shared/payload/hooks/validate-non-negativate-integer";
import { SIM_TYPE } from "../constant";

export const SimCollection: CollectionConfig = {
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
      "stock",
      "virtualStock",
      "priceKobo",
      "category",
      "updatedAt",
    ],
    description:
      "SIM products available for purchase. Stock is the authoritative inventory quantity.",
    group: "Catalog",
    groupBy: true,
    useAsTitle: "name",
  },

  fields: [
    {
      admin: {
        description: "SIM product name displayed to customers.",
      },
      label: "Name",
      maxLength: 160,
      name: "name",
      required: true,
      type: "text",
    },

    {
      admin: {
        description:
          "Customer-facing description of the SIM and its included features.",
      },
      label: "Description",
      name: "description",
      required: true,
      type: "textarea",
    },

    {
      admin: {
        description: "Primary image displayed for the SIM product.",
      },
      label: "SIM Image",
      name: "productImage",
      relationTo: "product-library",
      required: true,
      type: "relationship",
    },

    {
      admin: {
        description: "Controls the SIM type.",
        position: "sidebar",
      },
      defaultValue: SIM_TYPE.PHYSICAL,
      label: "SIM Type",
      name: "simType",
      options: [
        { label: "eSIM", value: SIM_TYPE.ESIM },
        { label: "Physical SIM", value: SIM_TYPE.PHYSICAL },
      ],
      required: true,
      type: "select",
    },

    {
      admin: {
        description: "Controls the SIM product lifecycle.",
        position: "sidebar",
      },
      defaultValue: PRODUCT_STATUS.ACTIVE,
      index: true,
      label: "Status",
      name: "status",
      options: [
        { label: "Active", value: PRODUCT_STATUS.ACTIVE },
        { label: "Draft", value: PRODUCT_STATUS.DRAFT },
        { label: "Inactive", value: PRODUCT_STATUS.INACTIVE },
        { label: "Archived", value: PRODUCT_STATUS.ARCHIVED },
      ],
      required: true,
      type: "select",
    },

    {
      admin: {
        description: "Marketing badges displayed on the SIM product.",
        position: "sidebar",
      },
      hasMany: true,
      label: "Badges",
      name: "badges",
      options: [
        { label: "Best Seller", value: PRODUCT_BADGE.BEST_SELLER },
        { label: "Featured", value: PRODUCT_BADGE.FEATURED },
        { label: "New", value: PRODUCT_BADGE.NEW },
        { label: "Trending", value: PRODUCT_BADGE.TRENDING },
      ],
      type: "select",
    },

    {
      admin: {
        description:
          "Authoritative inventory quantity used by inventory and fulfillment services.",
        position: "sidebar",
      },
      defaultValue: 0,
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
          "Customer-facing inventory quantity for storefront display. This does not represent actual inventory available for fulfillment.",
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
          "Enter the selling price in naira. The database store integer kobo (100 kobo = ₦1).",
      },
      hooks: {
        afterRead: [koboToNaira],
        beforeValidate: [nairaToKobo],
      },
      label: "Price (kobo)",
      min: 0,
      name: "priceKobo",
      required: true,
      type: "number",
      validate: validateNonNegativeInteger("Price"),
    },

    {
      admin: {
        description: "Category this SIM product belongs to.",
        position: "sidebar",
      },
      index: true,
      label: "Category",
      name: "category",
      relationTo: "categories",
      type: "relationship",
    },
    {
      admin: {
        description: "Country this SIM product belongs to.",
      },
      index: true,
      label: "Country",
      name: "country",
      relationTo: "countries",
      required: true,
      type: "relationship",
    },

    {
      admin: {
        description: "Currency used for this SIM product. Always NGN.",
        position: "sidebar",
        readOnly: true,
      },
      defaultValue: CURRENCY.NGN,
      index: true,
      name: "currency",
      options: [{ label: "NGN", value: CURRENCY.NGN }],
      required: true,
      type: "select",
    },

    {
      admin: {
        description: "Unique URL-friendly identifier generated from the name.",
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
      access: {
        create: () => false,
        update: () => false,
      },
      admin: {
        description: "Admin who created this SIM product.",
        position: "sidebar",
        readOnly: true,
      },
      name: "createdBy",
      relationTo: "users",
      required: true,
      type: "relationship",
    },

    {
      access: {
        create: () => false,
        update: () => false,
      },
      admin: {
        description: "Admin who last updated this SIM product.",
        position: "sidebar",
        readOnly: true,
      },
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
      fields: ["category", "status"],
      unique: false,
    },
    {
      fields: ["status", "priceKobo"],
      unique: false,
    },
    {
      fields: ["createdBy", "createdAt"],
      unique: false,
    },
  ],

  labels: {
    plural: "Sims",
    singular: "Sim",
  },
  slug: "sims",

  timestamps: true,
};
