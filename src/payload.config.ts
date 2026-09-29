/** biome-ignore-all lint/performance/noNamespaceImport: <supress for sentry> */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { resendAdapter } from "@payloadcms/email-resend";
import { sentryPlugin } from "@payloadcms/plugin-sentry";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import * as Sentry from "@sentry/nextjs";
import { buildConfig } from "payload";
import pg from "pg";
import sharp from "sharp";

import { APP_NAME, APP_URL, APP_URL_WWW } from "./constant";
import { sendWelcomeEmailTask } from "./modules/users/tasks/send-welcome-email";
import { CategoriesCollection } from "./modules/category/category-collection";
import { InventoryCollection } from "./modules/inventory/inventory.collection";
import { AvatarCollection } from "./modules/media/avatar-collection";
import { ProductLibraryCollection } from "./modules/media/product-library";
import { NotificationChannelCollection } from "./modules/notifications/notification.collection";
import { OrdersCollection } from "./modules/order/order.collection";
import { OrderItemsCollection } from "./modules/order/order-item.collection";
import { PaymentsCollection } from "./modules/payments/payment.collection";
import { ProductsCollection } from "./modules/products/collections/product.collection";
import { ProductSecretCollection } from "./modules/products/collections/product-secret.collection";
import { TransactionsCollection } from "./modules/transaction/transaction-collection";
import { UsersCollection } from "./modules/users";
import { env } from "./shared/utils/env";

// import { DOMAIN } from "./lib/constant/constant";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

const COR_DEV = "http://localhost:3000" as const;
const COR_PREVIEW = "https://thv-nu.vercel.app" as const;
const COR_PROD = [APP_URL, APP_URL_WWW] as const;

const _COR = IS_DEVELOPMENT ? [...COR_PROD, COR_DEV, COR_PREVIEW] : COR_PROD;

export default buildConfig({
  admin: {
    autoRefresh: true,
    dashboard: {
      widgets: [
        {
          Component: {
            exportName: "ConnectTelegramButton",
            path: "./modules/notifications/ui/connect-telegram-button.tsx",
          },
          label: "Connect telegram",
          maxWidth: "full",
          minWidth: "x-small",
          slug: "connect-telegram",
        },
      ],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: UsersCollection.slug,
  },
  collections: [
    UsersCollection,
    ProductLibraryCollection,
    ProductsCollection,
    CategoriesCollection,
    InventoryCollection,
    OrdersCollection,
    OrderItemsCollection,
    TransactionsCollection,
    PaymentsCollection,
    AvatarCollection,
    NotificationChannelCollection,
    ProductSecretCollection,
  ],
  cookiePrefix: "tvh",

  // cors: {
  //   headers: ["x-custom-header"],
  //   origins: [...COR],
  // },
  // csrf: [...COR],

  db: postgresAdapter({
    pg,
    pool: {
      connectionString: env.DATABASE_URL,
    },
  }),
  debug: process.env.NODE_ENV === "development",
  defaultDepth: 0,
  editor: lexicalEditor(),

  email: resendAdapter({
    apiKey: env.SMTP_PASSWORD,
    // defaultFromAddress: `notifications@${DOMAIN}`,
    defaultFromAddress: "notifications@myforexsignatureacademy.com",
    defaultFromName: `${APP_NAME} Team`,
  }),

  jobs: {
    jobsCollectionOverrides: ({ defaultJobsCollection }) => {
      if (!defaultJobsCollection.admin) {
        defaultJobsCollection.admin = {};
      }

      defaultJobsCollection.admin.hidden = false;
      return defaultJobsCollection;
    },
    tasks: [sendWelcomeEmailTask],
  },

  plugins: [
    vercelBlobStorage({
      access: "public",
      clientUploads: false,
      collections: {
        avatars: {
          prefix: "avatars",
        },
        "product-library": {
          prefix: "product",
        },
      },
      token: env.TVH_READ_WRITE_TOKEN,
    }),
    sentryPlugin({
      options: {
        captureErrors: [401, 403, 404, 409, 422, 429, 500, 501, 502, 503, 504],
        context: ({ defaultContext, req }) => {
          const { user } = req;
          return {
            ...defaultContext,
            tags: {
              locale: req.locale,
            },
            user: user || undefined,
          };
        },
        debug: process.env.NODE_ENV === "development",
      },
      Sentry,
    }),
  ],
  secret: env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  upload: {
    // safeFileNames: true,
  },
});
