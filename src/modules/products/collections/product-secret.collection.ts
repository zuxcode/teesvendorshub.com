import type { CollectionConfig } from "payload";

import { isAdmin, isAdminOrBuyerOnlyFieldAccess } from "@/shared/access";
import { createAuditActorHook } from "@/shared/payload/hooks/audit-actor";

/**
 * Stores sensitive digital product secrets.
 *
 * Only administrators can create, update, and delete secrets.
 * A purchasing buyer may read the secret associated with their purchase.
 */
export const ProductSecretCollection: CollectionConfig = {
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: isAdmin,
    update: isAdmin,
  },

  admin: {
    defaultColumns: ["product", "buyer", "updatedAt"],
    description:
      "Sensitive secrets for digital products. Only administrators can manage secrets.",
    group: "Catalog",
    useAsTitle: "product",
  },

  fields: [
    {
      access: {
        read: isAdminOrBuyerOnlyFieldAccess,
      },
      admin: {
        description:
          "Sensitive product secret visible only to authorized administrators or the purchasing buyer.",
      },
      label: "Secret",
      name: "secret",
      required: true,
      type: "textarea",
    },

    {
      admin: {
        description: "Product associated with this secret.",
        position: "sidebar",
      },
      index: true,
      label: "Product",
      name: "product",
      relationTo: "products",
      required: true,
      type: "relationship",
      unique: true,
    },

    {
      access: {
        read: isAdminOrBuyerOnlyFieldAccess,
      },
      admin: {
        description: "Customer associated with this product purchase.",
        position: "sidebar",
        readOnly: true,
      },
      index: true,
      label: "Buyer",
      name: "buyer",
      relationTo: "users",
      type: "relationship",
    },

    {
      admin: {
        description: "Admin who created this product secret.",
        position: "sidebar",
        readOnly: true,
      },
      index: true,
      name: "createdBy",
      relationTo: "users",
      required: true,
      type: "relationship",
    },

    {
      admin: {
        description: "Admin who last updated this product secret.",
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

  labels: {
    plural: "Product Secrets",
    singular: "Product Secret",
  },

  slug: "product-secrets",

  timestamps: true,
};
