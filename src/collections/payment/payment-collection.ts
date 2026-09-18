import type { CollectionConfig } from "payload";

import {
  isAdmin,
  isAdminOrBuyerOnlyFieldAccess,
  isPublicAccess,
} from "@/access";

import { createAuditActorHook } from "../hooks/audit-actor";

export const PaymentsCollection: CollectionConfig = {
  access: {
    create: isPublicAccess,
    delete: isAdmin,
    read: isAdminOrBuyerOnlyFieldAccess,
    update: isAdmin,
  },

  admin: {
    defaultColumns: [
      "paymentReference",
      "order",
      "status",
      "amount",
      "currency",
      "provider",
      "createdAt",
    ],
    useAsTitle: "paymentReference",
  },

  fields: [
    {
      admin: {
        readOnly: true,
      },
      index: true,
      label: "Payment Reference",
      name: "paymentReference",
      required: true,
      type: "text",
      unique: true,
    },

    {
      admin: {
        readOnly: true,
      },
      index: true,
      name: "order",
      relationTo: "orders",
      required: true,
      type: "relationship",
      unique: true,
    },

    {
      admin: {
        readOnly: true,
      },
      index: true,
      name: "buyer",
      relationTo: "users",
      required: true,
      type: "relationship",
    },

    {
      admin: {
        description: "Amount in the smallest currency unit (kobo).",
        readOnly: true,
      },
      min: 0,
      name: "amount",
      required: true,
      type: "number",
    },

    {
      admin: {
        readOnly: true,
      },
      defaultValue: "NGN",
      name: "currency",
      options: [
        {
          label: "Nigerian Naira",
          value: "NGN",
        },
      ],
      required: true,
      type: "select",
    },

    {
      admin: {
        readOnly: true,
      },
      index: true,
      name: "provider",
      options: [
        {
          label: "TransactPay",
          value: "transactpay",
        },
      ],
      required: true,
      type: "select",
    },

    {
      defaultValue: "pending",
      index: true,
      name: "status",
      options: [
        {
          label: "Pending",
          value: "pending",
        },
        {
          label: "Paid",
          value: "paid",
        },
        {
          label: "Failed",
          value: "failed",
        },
        {
          label: "Partially Paid",
          value: "partially-paid",
        },
        {
          label: "Refunded",
          value: "refunded",
        },
        {
          label: "Partially Refunded",
          value: "partially-refunded",
        },
      ],
      required: true,
      type: "select",
    },

    {
      admin: {
        readOnly: true,
      },
      name: "paidAt",
      type: "date",
    },

    {
      admin: {
        readOnly: true,
      },
      name: "refundedAt",
      type: "date",
    },

    {
      admin: {
        description:
          "Additional payment information that does not belong to the core payment model.",
      },
      name: "metadata",
      type: "json",
    },

    {
      admin: {
        readOnly: true,
      },
      name: "createdBy",
      relationTo: "users",
      required: true,
      type: "relationship",
    },

    {
      admin: {
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
      fields: ["order"],
    },
    {
      fields: ["buyer", "createdAt"],
    },
    {
      fields: ["status", "createdAt"],
    },
    {
      fields: ["provider", "status"],
    },
  ],
  slug: "payments",
};
