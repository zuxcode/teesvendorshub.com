import type { CollectionConfig } from "payload";

import { isAdmin, isAdminOrBuyerOnlyFieldAccess } from "@/access";
import { PRODUCT_TYPE } from "../products/product.contants";
import { ORDER_STATUS } from "./order.constants";

export const OrderItemsCollection: CollectionConfig = {
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: isAdminOrBuyerOnlyFieldAccess,
    update: isAdmin,
  },

  admin: {
    defaultColumns: [
      "productName",
      "quantity",
      "unitPrice",
      "lineTotal",
      "productType",
      "orderStatus",
    ],

    description:
      "Immutable snapshots of products purchased as part of an order.",

    group: "Ecommerce",

    useAsTitle: "productName",
  },

  fields: [
    {
      admin: {
        description: "Order this item belongs to.",
        position: "sidebar",
        readOnly: true,
      },
      index: true,
      name: "order",
      relationTo: "orders",
      required: true,
      type: "relationship",
    },

    {
      admin: {
        description:
          "Original product purchased. Historical snapshot fields remain authoritative for this order item.",
        position: "sidebar",
        readOnly: true,
      },
      index: true,
      name: "product",
      relationTo: "products",
      required: true,
      type: "relationship",
    },

    {
      admin: {
        description: "Product name captured at the time of purchase.",
        readOnly: true,
      },
      name: "productName",
      required: true,
      type: "text",
    },

    {
      admin: {
        description: "Product type captured at the time of purchase.",
        readOnly: true,
      },
      name: "productType",
      options: [
        {
          label: "Physical",
          value: PRODUCT_TYPE.PHYSICAL,
        },
        {
          label: "Digital",
          value: PRODUCT_TYPE.DIGITAL,
        },
      ],
      required: true,
      type: "select",
    },

    {
      admin: {
        description:
          "Product image associated with the product at purchase time.",
        readOnly: true,
      },
      name: "productImage",
      relationTo: "product-library",
      type: "relationship",
    },

    {
      admin: {
        description: "Unit price captured at the time of purchase.",
        position: "sidebar",
        readOnly: true,
      },
      min: 0,
      name: "unitPrice",
      required: true,
      type: "number",
    },

    {
      admin: {
        description: "Quantity purchased.",
        position: "sidebar",
        readOnly: true,
      },
      defaultValue: 1,
      min: 1,
      name: "quantity",
      required: true,
      type: "number",
    },

    {
      admin: {
        description: "Final amount charged for this order item.",
        position: "sidebar",
        readOnly: true,
      },
      min: 0,
      name: "lineTotal",
      required: true,
      type: "number",
    },

    {
      admin: {
        description: "Overall lifecycle status of the order.",
        position: "sidebar",
      },
      defaultValue: ORDER_STATUS.PENDING,
      index: true,
      name: "orderStatus",
      options: [
        { label: "Pending", value: ORDER_STATUS.PENDING },
        { label: "Processing", value: ORDER_STATUS.PROCESSING },
        { label: "Completed", value: ORDER_STATUS.COMPLETED },
        { label: "Cancelled", value: ORDER_STATUS.CANCELLED },
        { label: "Refunded", value: ORDER_STATUS.REFUNDED },
      ],
      required: true,
      type: "select",
    },

    {
      admin: {
        description:
          "Additional purchase-specific data required for fulfillment. Do not store inventory state here.",
      },
      name: "metadata",
      type: "json",
    },
  ],

  indexes: [
    {
      fields: ["order"],
      unique: false,
    },

    {
      fields: ["product"],
      unique: false,
    },

    {
      fields: ["order", "product"],
      unique: false,
    },

    {
      fields: ["order", "orderStatus"],
      unique: false,
    },

    {
      fields: ["orderStatus"],
      unique: false,
    },
  ],

  labels: {
    plural: "Order Items",
    singular: "Order Item",
  },

  slug: "order-items",

  timestamps: true,
};
