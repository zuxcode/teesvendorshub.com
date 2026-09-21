import type { CollectionConfig, FieldHook } from "payload";
import { isAdmin } from "@/access";
import { createAuditActorHook } from "@/shared/payload/hooks/audit-actor";
import { syncProductQuantitySnapshot } from "./helpers/inventory-sync";
import { INVENTORY_MOVEMENT } from "./inventory.constants";

const preventInventoryModification = () => false;

/**
 * Inventory movements are immutable.
 *
 * quantityBefore and quantityAfter are calculated by the inventory service,
 * not supplied by the client/admin.
 */
const preventManualQuantitySnapshot: FieldHook = ({
  operation,
  originalDoc,
}) => {
  if (operation === "create") {
    return;
  }

  return originalDoc;
};

export const InventoryCollection: CollectionConfig = {
  access: {
    /**
     * Inventory is internal/admin data.
     *
     * Do not expose the movement ledger publicly.
     */
    create: isAdmin,
    delete: preventInventoryModification,
    read: isAdmin,

    /**
     * Inventory movements are immutable.
     */
    update: preventInventoryModification,
  },

  admin: {
    defaultColumns: [
      "product",
      "type",
      "quantity",
      "quantityBefore",
      "quantityAfter",
      "reference",
      "createdBy",
      "createdAt",
    ],

    description:
      "Immutable inventory movement history. Current stock is maintained on the product.",
    group: "Ecommerce",
    useAsTitle: "product",
  },

  fields: [
    // -------------------------------------------------------------------------
    // PRODUCT
    // -------------------------------------------------------------------------

    {
      admin: {
        description: "Product affected by this inventory movement.",
      },
      index: true,
      label: "Product",
      name: "product",
      relationTo: "products",
      required: true,
      type: "relationship",
    },

    // -------------------------------------------------------------------------
    // MOVEMENT TYPE
    // -------------------------------------------------------------------------

    {
      admin: {
        description: "Business reason for the inventory quantity change.",
        position: "sidebar",
      },
      index: true,
      label: "Movement Type",
      name: "type",

      options: [
        {
          label: "Restock",
          value: INVENTORY_MOVEMENT.RESTOCK,
        },
        {
          label: "Sale",
          value: INVENTORY_MOVEMENT.SALE,
        },
        {
          label: "Return",
          value: INVENTORY_MOVEMENT.RETURN,
        },
        {
          label: "Adjustment",
          value: INVENTORY_MOVEMENT.ADJUSTMENT,
        },
        {
          label: "Damaged",
          value: INVENTORY_MOVEMENT.DAMAGED,
        },
        {
          label: "Expired",
          value: INVENTORY_MOVEMENT.EXPIRED,
        },
      ],
      required: true,
      type: "select",
    },

    // -------------------------------------------------------------------------
    // QUANTITY
    // -------------------------------------------------------------------------

    {
      admin: {
        description:
          "Quantity changed by this movement. Positive values increase stock; negative values decrease stock.",
        position: "sidebar",
      },
      hooks: {
        afterChange: [syncProductQuantitySnapshot],
      },
      label: "Quantity",
      name: "quantity",
      required: true,
      type: "number",
    },

    // -------------------------------------------------------------------------
    // STOCK BEFORE
    // -------------------------------------------------------------------------

    {
      admin: {
        description: "Product stock immediately before this movement.",
        position: "sidebar",
        readOnly: true,
      },
      defaultValue: 0,

      hooks: {
        beforeChange: [preventManualQuantitySnapshot],
      },
      label: "Quantity Before",
      min: 0,
      name: "quantityBefore",
      required: true,
      type: "number",
    },

    // -------------------------------------------------------------------------
    // STOCK AFTER
    // -------------------------------------------------------------------------

    {
      admin: {
        description: "Product stock immediately after this movement.",
        position: "sidebar",
        readOnly: true,
      },
      defaultValue: 0,

      hooks: {
        beforeChange: [preventManualQuantitySnapshot],
      },
      label: "Quantity After",
      min: 0,
      name: "quantityAfter",
      required: true,
      type: "number",
    },

    // -------------------------------------------------------------------------
    // REFERENCE
    // -------------------------------------------------------------------------

    {
      admin: {
        description:
          "Optional order, payment, shipment, transaction, or external reference.",
      },
      index: true,
      label: "Reference",
      name: "reference",
      type: "text",
    },

    // -------------------------------------------------------------------------
    // NOTES
    // -------------------------------------------------------------------------

    {
      admin: {
        description:
          "Additional information explaining this inventory movement.",
      },
      label: "Notes",
      name: "notes",
      type: "textarea",
    },

    // -------------------------------------------------------------------------
    // AUDIT ACTOR
    // -------------------------------------------------------------------------

    {
      admin: {
        description:
          "Admin or system user responsible for this inventory movement.",
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
          "Kept for consistency with the audit model. Inventory records cannot be updated.",
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
    /**
     * Product inventory history.
     */
    {
      fields: ["product", "createdAt"],
      unique: false,
    },

    /**
     * Useful for reports such as:
     * "How many restocks happened for this product?"
     */
    {
      fields: ["product", "type", "createdAt"],
      unique: false,
    },

    /**
     * Audit queries.
     */
    {
      fields: ["createdBy", "createdAt"],
      unique: false,
    },

    /**
     * Searching external references.
     */
    {
      fields: ["reference"],
      unique: false,
    },
  ],

  labels: {
    plural: "Inventory",
    singular: "Inventory Movement",
  },
  slug: "inventory",

  timestamps: true,
};
