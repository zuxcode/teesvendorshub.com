import type { CollectionConfig } from "payload";
import { CURRENCY } from "@/modules/order/order.constants";
import { isAdmin, isPublicAccess } from "@/shared/access";
import { PRODUCT_STATUS } from "@/shared/constant";
import { createAuditActorHook } from "@/shared/payload/hooks/audit-actor";
import {
  koboToNaira,
  nairaToKobo,
} from "@/shared/payload/hooks/current-converter";
import { updateSlugHook } from "@/shared/payload/hooks/update-slug";
import { validateNonNegativeInteger } from "@/shared/payload/hooks/validate-non-negativate-integer";

export const GiftsCollection: CollectionConfig = {
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
      "priceKobo",
      "category",
      "updatedAt",
    ],
    description:
      "Gifts available for purchase. Stock represents the authoritative inventory quantity.",
    group: "Catalog",
    groupBy: true,
    useAsTitle: "name",
  },

  fields: [
    {
      admin: {
        description: "Gift name displayed to customers",
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
          "Customer-facing description of the gift and its included features.",
      },
      label: "Description",
      name: "description",
      required: true,
      type: "textarea",
    },

    {
      admin: {
        description: "Primary image displayed for the gift.",
      },
      label: "Gift Image",
      name: "productImage",
      relationTo: "product-library",
      required: true,
      type: "relationship",
    },

    {
      admin: {
        description: "Controls the gift lifecycle",
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
        description: "Authoritative inventory quantity",
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
        description: "Category this gift belongs to.",
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
        description: "Currency used for this gift.",
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
      admin: {
        description:
          "Unique URL-friendly identifier generated from the gift name.",
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
        description: "Admin who created this gift.",
        position: "sidebar",
        readOnly: true,
      },
      name: "createdBy",
      relationTo: "users",
      required: true,
      type: "relationship",
    },

    {
      admin: {
        description: "Admin who last updated this gift.",
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
    plural: "Gifts",
    singular: "Gift",
  },

  slug: "gifts",

  timestamps: true,
};
