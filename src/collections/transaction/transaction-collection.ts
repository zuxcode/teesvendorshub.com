import type { CollectionConfig } from "payload";
import { isAdmin } from "@/access";

import {
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
} from "@/lib/config/collection-config";
import { CURRENCY } from "@/modules/order/order.constants";
import { PAYMENT_PROVIDER_NAME } from "@/modules/payments/payment.constants";
import { createAuditActorHook } from "../../shared/payload/hooks/audit-actor";

export const TransactionsCollection: CollectionConfig = {
  access: {
    /**
     * Financial records are private.
     *
     * Customers should access their payment information through
     * the order/payment API rather than directly querying the
     * transaction collection.
     */
    create: isAdmin,
    delete: () => false,
    read: isAdmin,

    /**
     * Transactions are immutable.
     *
     * A refund, reversal, or chargeback creates another transaction
     * rather than modifying the original payment.
     */
    update: () => false,
  },

  admin: {
    defaultColumns: [
      "reference",
      "order",
      "customer",
      "type",
      "status",
      "amount",
      "currency",
      "provider",
      "createdAt",
    ],

    description:
      "Immutable financial transaction history for orders and payments.",
    group: "Ecommerce",
    useAsTitle: "reference",
  },

  fields: [
    // -------------------------------------------------------------------------
    // REFERENCE
    // -------------------------------------------------------------------------

    {
      admin: {
        description: "Unique internal transaction reference.",
        readOnly: true,
      },
      index: true,
      label: "Transaction Reference",
      name: "reference",
      required: true,
      type: "text",
      unique: true,
    },

    // -------------------------------------------------------------------------
    // ORDER
    // -------------------------------------------------------------------------

    {
      admin: {
        description: "Order associated with this financial transaction.",
      },
      index: true,
      label: "Order",
      name: "order",
      relationTo: "orders",
      required: true,
      type: "relationship",
    },

    // -------------------------------------------------------------------------
    // CUSTOMER
    // -------------------------------------------------------------------------

    {
      admin: {
        description: "Customer associated with the transaction.",
        position: "sidebar",
        readOnly: true,
      },
      index: true,
      label: "Customer",
      name: "customer",
      relationTo: "users",
      required: true,
      type: "relationship",
    },

    // -------------------------------------------------------------------------
    // TRANSACTION TYPE
    // -------------------------------------------------------------------------

    {
      admin: {
        description: "Financial event represented by this transaction.",
        position: "sidebar",
      },
      index: true,
      label: "Transaction Type",
      name: "type",

      options: [
        {
          label: "Payment",
          value: TRANSACTION_TYPE.PAYMENT,
        },
        {
          label: "Refund",
          value: TRANSACTION_TYPE.REFUND,
        },
        {
          label: "Chargeback",
          value: TRANSACTION_TYPE.CHARGEBACK,
        },
      ],
      required: true,
      type: "select",
    },

    // -------------------------------------------------------------------------
    // STATUS
    // -------------------------------------------------------------------------

    {
      admin: {
        description: "Current processing state of this transaction.",
        position: "sidebar",
      },
      defaultValue: TRANSACTION_STATUS.PENDING,
      index: true,
      label: "Status",
      name: "status",

      options: [
        {
          label: "Pending",
          value: TRANSACTION_STATUS.PENDING,
        },
        {
          label: "Successful",
          value: TRANSACTION_STATUS.SUCCESSFUL,
        },
        {
          label: "Failed",
          value: TRANSACTION_STATUS.FAILED,
        },
        {
          label: "Cancelled",
          value: TRANSACTION_STATUS.CANCELLED,
        },
      ],
      required: true,
      type: "select",
    },

    // -------------------------------------------------------------------------
    // AMOUNT
    // -------------------------------------------------------------------------

    {
      admin: {
        description: "Transaction amount stored in the smallest currency unit.",
      },
      index: true,
      label: "Amount",
      min: 1,
      name: "amount",
      required: true,
      type: "number",
    },

    // -------------------------------------------------------------------------
    // CURRENCY
    // -------------------------------------------------------------------------

    {
      admin: {
        description: "Currency used for this transaction.",
        position: "sidebar",
      },
      defaultValue: CURRENCY.NGN,
      index: true,
      label: "Currency",
      name: "currency",
      options: [
        {
          label: "Nigerian Naira (NGN)",
          value: CURRENCY.NGN,
        },
      ],
      required: true,
      type: "select",
    },

    // -------------------------------------------------------------------------
    // PAYMENT PROVIDER
    // -------------------------------------------------------------------------

    {
      admin: {
        description:
          "Payment provider responsible for processing the transaction.",
        position: "sidebar",
      },
      index: true,
      label: "Payment Provider",
      name: "provider",

      options: [
        {
          label: "Transactpay",
          value: PAYMENT_PROVIDER_NAME.TRANSACTPAY,
        },
        // {
        //   label: "Manual",
        //   value: PAYMENT_PROVIDER_NAME.MANUAL,
        // },
      ],
      required: true,
      type: "select",
    },

    // -------------------------------------------------------------------------
    // PROVIDER REFERENCE
    // -------------------------------------------------------------------------

    {
      admin: {
        description: "Reference supplied by the payment provider.",
        readOnly: true,
      },
      index: true,
      label: "Provider Reference",
      name: "providerReference",
      type: "text",
    },

    // -------------------------------------------------------------------------
    // PROVIDER RESPONSE
    // -------------------------------------------------------------------------

    {
      admin: {
        description:
          "Raw or normalized response data received from the payment provider.",
        readOnly: true,
      },
      label: "Provider Response",
      name: "providerResponse",
      type: "json",
    },

    // -------------------------------------------------------------------------
    // PARENT TRANSACTION
    // -------------------------------------------------------------------------

    {
      admin: {
        description:
          "Original transaction associated with a refund or chargeback.",
        readOnly: true,
      },
      index: true,
      label: "Parent Transaction",
      name: "parentTransaction",
      relationTo: "transactions",
      type: "relationship",
    },

    // -------------------------------------------------------------------------
    // FAILURE INFORMATION
    // -------------------------------------------------------------------------

    {
      admin: {
        description: "Payment provider failure code, if available.",
        readOnly: true,
      },
      label: "Failure Code",
      name: "failureCode",
      type: "text",
    },

    {
      admin: {
        description: "Payment provider failure message, if available.",
        readOnly: true,
      },
      label: "Failure Message",
      name: "failureMessage",
      type: "textarea",
    },

    // -------------------------------------------------------------------------
    // DESCRIPTION
    // -------------------------------------------------------------------------

    {
      admin: {
        description: "Human-readable explanation of the transaction.",
      },
      label: "Description",
      name: "description",
      type: "textarea",
    },

    // -------------------------------------------------------------------------
    // AUDIT
    // -------------------------------------------------------------------------

    {
      admin: {
        description:
          "Admin or system user responsible for creating this transaction.",
        position: "sidebar",
        readOnly: true,
      },
      index: true,
      label: "Created By",
      name: "createdBy",
      relationTo: "users",
      type: "relationship",
    },

    {
      admin: {
        description:
          "Kept for audit consistency. Transactions cannot be updated.",
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

  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------

  hooks: {
    beforeChange: [
      createAuditActorHook({
        createdBy: "createdBy",
        updatedBy: "updatedBy",
      }),
    ],
  },

  // ---------------------------------------------------------------------------
  // INDEXES
  // ---------------------------------------------------------------------------

  indexes: [
    {
      fields: ["order", "createdAt"],
      unique: false,
    },

    {
      fields: ["customer", "createdAt"],
      unique: false,
    },

    {
      fields: ["provider", "providerReference"],
      unique: false,
    },

    {
      fields: ["type", "status", "createdAt"],
      unique: false,
    },

    {
      fields: ["parentTransaction"],
      unique: false,
    },

    {
      fields: ["createdBy", "createdAt"],
      unique: false,
    },
  ],

  labels: {
    plural: "Transactions",
    singular: "Transaction",
  },
  slug: "transactions",

  timestamps: true,
};
