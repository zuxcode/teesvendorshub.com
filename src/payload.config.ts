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
import { CategoriesCollection } from "./collections/category/category-collection";
import { ProductLibraryCollection } from "./collections/media/product-library";
import { TaxRulesCollection } from "./collections/tax/tax-rule";
import { TransactionsCollection } from "./collections/transaction/transaction-collection";
import { UsersCollection } from "./collections/users";
import { APP_NAME, APP_URL, APP_URL_WWW } from "./constant";
import { env } from "./env";
import { sendWelcomeEmailTask } from "./lib/tasks/send-welcome-email";
import { InventoryCollection } from "./modules/inventory/inventory.collection";
import { OrdersCollection } from "./modules/order/order.collection";
import { OrderItemsCollection } from "./modules/order/order-item.collection";
import { PaymentsCollection } from "./modules/payments/payment.collection";
import { ProductsCollection } from "./modules/products/product.collection";

// import { DOMAIN } from "./lib/constant/constant";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

const COR_DEV = "http://localhost:3000" as const;
const COR_PROD = [APP_URL, APP_URL_WWW] as const;

const COR = IS_DEVELOPMENT ? [...COR_PROD, COR_DEV] : COR_PROD;

export default buildConfig({
  admin: {
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
    TaxRulesCollection,
    OrdersCollection,
    OrderItemsCollection,
    TransactionsCollection,
    PaymentsCollection,
  ],
  cookiePrefix: "tvh",

  cors: {
    headers: ["x-custom-header"],
    origins: [...COR],
  },
  csrf: [...COR],

  db: postgresAdapter({
    pg,
    pool: {
      connectionString: env.DATABASE_URL,
      ssl: process.env.NODE_ENV !== "development",
    },
  }),
  debug: process.env.NODE_ENV === "development",
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
      clientUploads: true,
      collections: {
        // media: true,
        "product-library": {
          prefix: "product",
        },
      },
      token: env.BLOB_READ_WRITE_TOKEN,
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
    safeFileNames: true,
  },
});
