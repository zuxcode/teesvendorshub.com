import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { resendAdapter } from "@payloadcms/email-resend";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
// import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { buildConfig } from "payload";
import sharp from "sharp";
import { CategoriesCollection } from "./collections/category";
import { Media } from "./collections/Media";
import { ProductLibraryCollection } from "./collections/media/product-library";
import { ProductsCollection } from "./collections/product";
import { SimCardsCollection } from "./collections/product/sim-card";
import { UsersCollection } from "./collections/users";
import { APP_NAME, APP_URL, APP_URL_WWW } from "./constant";
import { env } from "./env";
import { sendWelcomeEmailTask } from "./lib/tasks/send-welcome-email";

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
    Media,
    ProductLibraryCollection,
    ProductsCollection,
    CategoriesCollection,
    SimCardsCollection,
  ],

  cors: {
    headers: ["x-custom-header"],
    origins: [...COR],
  },
  csrf: [...COR],
  db: postgresAdapter({
    pool: {
      connectionString: env.DATABASE_URL,
    },
  }),
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
    // vercelBlobStorage({
    //   clientUploads: true,
    //   collections: {
    //     media: true,
    //     "product-library": {
    //       prefix: "product",
    //     },
    //   },
    //   token: env.BLOB_READ_WRITE_TOKEN,
    // }),
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
