import type { CollectionConfig } from "payload";

import { isAdmin } from "@/shared/access";
import { NOTIFICATION_CHANNEL_PROVIDER } from "./constants/notification-channel";

export const NotificationChannelCollection: CollectionConfig = {
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: isAdmin,
    update: isAdmin,
  },

  admin: {
    defaultColumns: ["admin", "provider", "destination", "enabled"],
    group: "Notification",
    useAsTitle: "provider",
  },

  fields: [
    {
      index: true,
      label: "Admin",
      name: "admin",
      relationTo: "users",
      required: true,
      type: "relationship",
    },

    {
      index: true,
      name: "provider",
      options: [
        {
          label: "Telegram",
          value: NOTIFICATION_CHANNEL_PROVIDER.Telegram,
        },
      ],
      required: true,
      type: "select",
    },

    {
      index: true,
      label: "Destination",
      name: "destination",
      required: true,
      type: "text",
    },

    {
      defaultValue: true,
      index: true,
      label: "Enabled",
      name: "enabled",
      type: "checkbox",
    },
  ],

  indexes: [
    {
      fields: ["provider", "admin"],
      unique: true,
    },
  ],

  slug: "notification-channels",

  timestamps: true,
};
