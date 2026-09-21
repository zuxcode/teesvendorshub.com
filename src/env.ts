import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
  },

  experimental__runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },

  server: {
    BLOB_READ_WRITE_TOKEN: z.string().min(1),
    DATABASE_URL: z.url(),
    PAYLOAD_SECRET: z.string().min(1),
    SMTP_PASSWORD: z.string().min(1),
    TRANSACT_PAY_API_KEY: z.string().min(1),
    TRANSACT_PAY_ENCRYPTION_KEY: z.string().min(1),
  },
});

// SMTP_FROM_EMAIL: z.email(),
// SMTP_FROM_NAME: z.string().min(1),
// SMTP_HOST: z.string().min(1),
// SMTP_PORT: z.coerce.number().int().positive(),
// SMTP_SECURE: z.stringbool().default(false),
// SMTP_USERNAME: z.string().min(1),
