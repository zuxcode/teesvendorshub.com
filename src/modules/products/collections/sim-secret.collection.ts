import type { CollectionConfig } from "payload";

import { isAdmin } from "@/shared/access";
import { createAuditActorHook } from "@/shared/payload/hooks/audit-actor";
import { SECRET_STATUS } from "../constant/product.constants";

export const SimSecretCollection: CollectionConfig = {
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: isAdmin,
    update: isAdmin,
  },

  admin: {
    defaultColumns: ["sim", "status", "soldAt", "updatedAt"],
    description:
      "Sensitive SIM credentials and delivery secrets. Only administrators can manage secrets.",
    group: "Catalog",
    useAsTitle: "sim",
  },

  fields: [
    {
      admin: {
        description: "Sensitive SIM credential or delivery value.",
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
      label: "SIM",
      name: "sim",
      relationTo: "sims",
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
        {
          label: "Available",
          value: SECRET_STATUS.AVAILABLE,
        },
        {
          label: "Sold",
          value: SECRET_STATUS.SOLD,
        },
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
    plural: "SIM Secrets",
    singular: "SIM Secret",
  },
  slug: "sim-secrets",

  timestamps: true,
};
