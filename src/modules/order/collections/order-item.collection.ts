import type { CollectionConfig } from "payload";
import { SIM_TYPE } from "@/modules/sim/constant";
import { isAdmin, isAdminOrBuyerOnlyFieldAccess } from "@/shared/access";
import { RELATION_TO } from "@/shared/constant";
import {
  koboToNaira,
  nairaToKobo,
} from "@/shared/payload/hooks/current-converter";
import { validateNonNegativeInteger } from "@/shared/payload/hooks/validate-non-negativate-integer";
import { ORDER_FULFILLMENT_STATUS } from "../order.constants";
import { ValidateRelationToLinkage } from "../validate/validate-relation-to-linkage";

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
      "productType",
      "simType",
      "quantity",
      "unitPrice",
      "lineTotal",
      "fulfillmentStatus",
    ],
    description:
      "Purchase-time snapshots of individual products, gifts, or SIMs in an order.",
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
          "Original product purchased. Only one item relationship may be set.",
        position: "sidebar",
        readOnly: true,
      },
      index: true,
      name: "product",
      relationTo: "products",
      type: "relationship",
    },
    {
      admin: {
        description:
          "Original gift purchased. Only one item relationship may be set.",
        position: "sidebar",
        readOnly: true,
      },
      index: true,
      name: "gift",
      relationTo: "gifts",
      type: "relationship",
    },
    {
      admin: {
        description:
          "Original SIM purchased. Only one item relationship may be set.",
        position: "sidebar",
        readOnly: true,
      },
      index: true,
      name: "sim",
      relationTo: "sims",
      type: "relationship",
    },
    {
      admin: {
        description: "Type of purchasable item captured at purchase time.",
        position: "sidebar",
        readOnly: true,
      },
      name: "productType",
      options: [
        { label: "Product", value: RELATION_TO.PRODUCT },
        { label: "Gift", value: RELATION_TO.GIFT },
        { label: "SIM", value: RELATION_TO.SIM },
      ],
      required: true,
      type: "select",
    },

    {
      admin: {
        condition: (data) => data?.productType === RELATION_TO.SIM,
        description: "SIM type captured at the time of purchase.",
        position: "sidebar",
        readOnly: true,
      },
      name: "simType",
      options: [
        { label: "eSIM", value: SIM_TYPE.ESIM },
        { label: "Physical SIM", value: SIM_TYPE.PHYSICAL },
      ],
      type: "select",
    },
    {
      admin: {
        description: "Item name captured at the time of purchase.",
        readOnly: true,
      },
      name: "productName",
      required: true,
      type: "text",
    },
    {
      admin: {
        description: "Item image captured at the time of purchase.",
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
        description: "Total quantity purchased.",
        readOnly: true,
      },
      defaultValue: 1,
      min: 1,
      name: "quantity",
      required: true,
      type: "number",
      validate: validateNonNegativeInteger("quantity"),
    },
    {
      admin: {
        description: "Total amount charged for this order item.",
        position: "sidebar",
        readOnly: true,
      },
      hooks: {
        afterRead: [koboToNaira],
        beforeValidate: [nairaToKobo],
      },
      min: 0,
      name: "lineTotal",
      required: true,
      type: "number",
    },
    {
      admin: {
        description: "Current fulfillment status of this order item.",
        position: "sidebar",
      },
      defaultValue: ORDER_FULFILLMENT_STATUS.PENDING,
      index: true,
      name: "fulfillmentStatus",
      options: [
        { label: "Pending", value: ORDER_FULFILLMENT_STATUS.PENDING },
        { label: "Partial", value: ORDER_FULFILLMENT_STATUS.PARTIAL },
        { label: "Completed", value: ORDER_FULFILLMENT_STATUS.COMPLETED },
        { label: "Cancelled", value: ORDER_FULFILLMENT_STATUS.CANCELLED },
      ],
      required: true,
      type: "select",
    },
    {
      admin: {
        condition: (data) => {
          if (data?.productType === RELATION_TO.GIFT) {
            return false;
          }

          return (
            data?.productType === RELATION_TO.SIM &&
            data?.simType === SIM_TYPE.ESIM
          );
        },
        description:
          "Purchase-specific secrets used for fulfillment. Restrict access to these values independently of collection access.",
      },
      fields: [
        {
          access: {
            read: isAdminOrBuyerOnlyFieldAccess,
          },
          label: "Secret",
          name: "secret",
          required: true,
          type: "text",
        },
      ],
      label: "Secrets",
      name: "secrets",
      type: "array",
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

  hooks: {
    beforeValidate: [ValidateRelationToLinkage],
  },

  indexes: [
    {
      fields: ["order"],
    },
    {
      fields: ["product"],
    },
    {
      fields: ["gift"],
    },
    {
      fields: ["sim"],
    },
    {
      fields: ["order", "product"],
    },
    {
      fields: ["order", "gift"],
    },
    {
      fields: ["order", "sim"],
    },
    {
      fields: ["order", "fulfillmentStatus"],
    },
    {
      fields: ["fulfillmentStatus"],
    },
  ],

  labels: {
    plural: "Order Items",
    singular: "Order Item",
  },

  slug: "order-items",

  timestamps: true,
};
