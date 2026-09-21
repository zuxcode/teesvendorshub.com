import type { CollectionConfig } from "payload";

import { isAdmin, isAdminOrBuyerOnlyFieldAccess } from "@/access";
import { createAuditActorHook } from "@/shared/payload/hooks/audit-actor";
import { CURRENCY } from "./order.constants";

export const OrdersCollection: CollectionConfig = {
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: isAdminOrBuyerOnlyFieldAccess,
    update: isAdmin,
  },

  admin: {
    defaultColumns: [
      "orderNumber",
      "buyer",
      "orderStatus",
      "paymentStatus",
      "fulfillmentStatus",
      "total",
      "currency",
      "createdAt",
    ],

    description: "Customer orders and their transaction lifecycle.",

    group: "Ecommerce",

    useAsTitle: "orderNumber",
  },

  fields: [
    {
      admin: {
        description: "Unique customer-facing order number.",
        position: "sidebar",
        readOnly: true,
      },
      index: true,
      name: "orderNumber",
      required: true,
      type: "text",
      unique: true,
    },

    {
      admin: {
        description: "Customer who placed the order.",
        position: "sidebar",
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
        description: "Overall lifecycle status of the order.",
        position: "sidebar",
      },
      defaultValue: "pending",
      index: true,
      name: "orderStatus",
      options: [
        {
          label: "Pending",
          value: "pending",
        },
        {
          label: "Processing",
          value: "processing",
        },
        {
          label: "Completed",
          value: "completed",
        },
        {
          label: "Cancelled",
          value: "cancelled",
        },
        {
          label: "Refunded",
          value: "refunded",
        },
      ],
      required: true,
      type: "select",
    },

    {
      admin: {
        description: "Payment status for this order.",
        position: "sidebar",
      },
      defaultValue: "pending",
      index: true,
      name: "paymentStatus",
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
          label: "Refunded",
          value: "refunded",
        },
        {
          label: "Partially Refunded",
          value: "partially-refunded",
        },
        {
          label: "Partially Paid",
          value: "partially-paid",
        },
      ],
      required: true,
      type: "select",
    },

    {
      admin: {
        description: "Current fulfillment state of the entire order.",
        position: "sidebar",
      },
      defaultValue: "pending",
      index: true,
      name: "fulfillmentStatus",
      options: [
        {
          label: "Pending",
          value: "pending",
        },
        {
          label: "Processing",
          value: "processing",
        },
        {
          label: "Partially Fulfilled",
          value: "partially-fulfilled",
        },
        {
          label: "Fulfilled",
          value: "fulfilled",
        },
        {
          label: "Cancelled",
          value: "cancelled",
        },
      ],
      required: true,
      type: "select",
    },

    {
      admin: {
        description: "Currency used for the order.",
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
          "Sum of all order item line totals before shipping and tax.",
        position: "sidebar",
        readOnly: true,
      },
      min: 0,
      name: "subtotal",
      required: true,
      type: "number",
    },

    {
      admin: {
        description: "Total shipping cost charged for the order.",
        position: "sidebar",
        readOnly: true,
      },
      defaultValue: 0,
      min: 0,
      name: "shippingAmount",
      required: true,
      type: "number",
    },

    {
      admin: {
        description: "Total tax charged for the order.",
        position: "sidebar",
        readOnly: true,
      },
      defaultValue: 0,
      min: 0,
      name: "taxAmount",
      required: true,
      type: "number",
    },

    {
      admin: {
        description:
          "Final amount payable by the customer, including shipping and tax.",
        position: "sidebar",
        readOnly: true,
      },
      min: 0,
      name: "total",
      required: true,
      type: "number",
    },

    {
      admin: {
        description: "Customer email captured when the order was placed.",
        readOnly: true,
      },
      name: "email",
      required: true,
      type: "email",
    },

    {
      admin: {
        description:
          "Customer phone number captured when the order was placed.",
        readOnly: true,
      },
      name: "phone",
      type: "text",
    },

    {
      admin: {
        description: "Shipping information captured when the order was placed.",
      },
      fields: [
        {
          name: "fullName",
          required: true,
          type: "text",
        },
        {
          name: "addressLine1",
          required: true,
          type: "text",
        },
        {
          name: "addressLine2",
          type: "text",
        },
        {
          name: "city",
          required: true,
          type: "text",
        },
        {
          name: "state",
          required: true,
          type: "text",
        },
        {
          name: "postalCode",
          type: "text",
        },
        {
          name: "country",
          required: true,
          type: "text",
        },
      ],
      name: "shippingAddress",
      type: "group",
    },

    {
      admin: {
        description: "Customer-provided instructions concerning delivery.",
      },
      name: "deliveryInstructions",
      type: "textarea",
    },

    {
      admin: {
        description:
          "Internal administrative notes. Never expose these to customers.",
      },
      name: "internalNotes",
      type: "textarea",
    },

    {
      admin: {
        description: "User responsible for creating the order.",
        position: "sidebar",
        readOnly: true,
      },
      index: true,
      name: "createdBy",
      relationTo: "users",
      type: "relationship",
    },

    {
      admin: {
        description: "User responsible for the most recent order update.",
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
      fields: ["buyer", "createdAt"],
      unique: false,
    },

    {
      fields: ["orderStatus", "createdAt"],
      unique: false,
    },

    {
      fields: ["paymentStatus", "createdAt"],
      unique: false,
    },

    {
      fields: ["fulfillmentStatus", "createdAt"],
      unique: false,
    },

    {
      fields: ["buyer", "orderStatus", "createdAt"],
      unique: false,
    },
  ],

  labels: {
    plural: "Orders",
    singular: "Order",
  },

  slug: "orders",

  timestamps: true,
};
