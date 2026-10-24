import type { CollectionConfig } from "payload";

import { isAdmin } from "@/shared/access";
import { createAuditActorHook } from "@/shared/payload/hooks/audit-actor";
import { SECRET_STATUS } from "../constant/product.constants";

export const ProductSecretCollection: CollectionConfig = {
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: isAdmin,
    update: isAdmin,
  },

  admin: {
    defaultColumns: ["product", "status", "soldAt", "updatedAt"],
    description:
      "Sensitive digital product secrets. Only administrators can manage secrets.",
    group: "Catalog",
    useAsTitle: "product",
  },

  fields: [
    {
      admin: {
        description: "Sensitive credential or digital delivery value.",
      },
      label: "Secret",
      name: "secret",
      required: true,
      type: "textarea",
    },
    {
      admin: {
        position: "sidebar",
      },
      index: true,
      label: "Product",
      name: "product",
      relationTo: "products",
      required: true,
      type: "relationship",
    },
    {
      admin: {
        position: "sidebar",
        readOnly: true,
      },
      defaultValue: SECRET_STATUS.AVAILABLE,
      index: true,
      label: "Status",
      name: "status",
      options: [
        { label: "Available", value: SECRET_STATUS.AVAILABLE },
        { label: "Sold", value: SECRET_STATUS.SOLD },
      ],
      required: true,
      type: "select",
    },
    {
      admin: {
        description: "Timestamp when the secret was assigned to an order.",
        position: "sidebar",
        readOnly: true,
      },
      index: true,
      label: "Date Sold",
      name: "soldAt",
      type: "date",
    },
    {
      admin: {
        position: "sidebar",
        readOnly: true,
      },
      index: true,
      label: "Created By",
      name: "createdBy",
      relationTo: "users",
      required: true,
      type: "relationship",
    },
    {
      admin: {
        position: "sidebar",
        readOnly: true,
      },
      index: true,
      label: "Updated By",
      name: "updatedBy",
      relationTo: "users",
      type: "relationship",
    },
  ],

  hooks: {
    beforeChange: [createAuditActorHook()],
  },

  labels: {
    plural: "Product Secrets",
    singular: "Product Secret",
  },
  slug: "product-secrets",

  timestamps: true,
};
