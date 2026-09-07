import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { resendAdapter } from "@payloadcms/email-resend";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";
import { Media } from "./collections/Media";
import { UsersCollection } from "./collections/users";
import { APP_NAME, APP_URL, APP_URL_WWW } from "./constant";
import { env } from "./env";
import { sendWelcomeEmailTask } from "./lib/tasks/send-welcome-email";

// import { DOMAIN } from "./lib/constant/constant";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

const COR_DEV = "http://localhost:3000";
const COR_PROD = [APP_URL, APP_URL_WWW];

const COR = IS_DEVELOPMENT ? [...COR_PROD, COR_DEV] : COR_PROD;

export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: UsersCollection.slug,
  },
  collections: [UsersCollection, Media],

  cors: {
    headers: ["x-custom-header"],
    origins: COR,
  },
  csrf: COR,
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

  plugins: [],
  secret: env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
});
