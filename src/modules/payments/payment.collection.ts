import type { CollectionConfig } from "payload";

import { isAdmin } from "@/access";
import { createAuditActorHook } from "@/shared/payload/hooks/audit-actor";
import { canReadPayment } from "./payment.access";
import { PAYMENT_PROVIDER_NAME, PAYMENT_STATUS } from "./payment.constants";

export const PaymentsCollection: CollectionConfig = {
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: canReadPayment,
    update: isAdmin,
  },

  admin: {
    defaultColumns: [
      "orderReference",
      "order",
      "status",
      "amount",
      "currency",
      "provider",
      "createdAt",
    ],
    useAsTitle: "orderReference",
  },

  fields: [
    {
      admin: {
        readOnly: true,
      },
      index: true,
      label: "Order Reference",
      name: "orderReference",
      required: true,
      type: "text",
      unique: true,
    },
    {
      admin: {
        description: "URL used by the customer to complete the payment.",
        readOnly: true,
      },
      name: "checkoutUrl",
      type: "text",
    },
    {
      admin: {
        description:
          "Reference assigned to the payment by the payment provider.",
        readOnly: true,
      },
      index: true,
      name: "providerReference",
      type: "text",
    },
    {
      admin: {
        description: "Processing Fee",
        readOnly: true,
      },
      min: 0,
      name: "providerFee",
      type: "number",
    },
    {
      admin: {
        readOnly: true,
      },
      min: 0,
      name: "totalAmountCharged",
      type: "number",
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
      defaultValue: PAYMENT_PROVIDER_NAME.TRANSACTPAY,
      index: true,
      name: "provider",
      options: [
        {
          label: "TransactPay",
          value: PAYMENT_PROVIDER_NAME.TRANSACTPAY,
        },
      ],
      required: true,
      type: "select",
    },

    {
      defaultValue: PAYMENT_STATUS.PENDING,
      index: true,
      name: "status",
      options: [
        {
          label: "Pending",
          value: PAYMENT_STATUS.PENDING,
        },
        {
          label: "Successful",
          value: PAYMENT_STATUS.SUCCESSFUL,
        },
        {
          label: "Failed",
          value: PAYMENT_STATUS.FAILED,
        },
        {
          label: "Partially Paid",
          value: PAYMENT_STATUS.PARTIALLY_PAID,
        },
        {
          label: "Refunded",
          value: PAYMENT_STATUS.REFUNDED,
        },
        {
          label: "Partially Refunded",
          value: PAYMENT_STATUS.PARTIALLY_REFUNDED,
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
