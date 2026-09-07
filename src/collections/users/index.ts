import type { CollectionConfig } from "payload";
import {
  isAdmin,
  isAdminOnlyFieldAccess,
  isAdminOrOwner,
  isAuthenticated,
} from "@/access";
import { APP_NAME, APP_URL, ROLE } from "@/constant";
import {
  getPasswordResetEmailHTML,
  getVerificationEmailHTML,
} from "@/lib/email-template/auth-email-templates";
import { ensureFirstUserIsAdmin } from "./hooks/ensure-first-user-is-admin";

export const UsersCollection: CollectionConfig = {
  access: {
    admin: ({ req }) => req.user?.role === ROLE.ADMIN,
    create: isAuthenticated,
    delete: isAdmin,
    read: isAdminOrOwner,
    unlock: isAdmin,
    update: isAdminOrOwner,
  },
  admin: {
    defaultColumns: ["fullName", "email", "role", "phone"],
    group: "Customer",
    useAsTitle: "fullName",
  },
  auth: {
    cookies: {
      domain:
        process.env.NODE_ENV === "production"
          ? "teesvendorshub.com"
          : undefined,
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
    },
    forgotPassword: {
      generateEmailHTML: (param) => {
        const resetUrl = `${APP_URL}/auth/reset-password?token=${param?.token}`;
        const userFullname =
          param?.user?.fullName ?? param?.user.email.split("@")[0];
        return getPasswordResetEmailHTML({ resetUrl, userFullname });
      },
      generateEmailSubject: (param) =>
        `Hey ${param?.user?.fullName ?? "there"}, reset your password on ${APP_NAME}`,
    },
    lockTime: 3600 * 1000, // 1 hour lockout after 5 failed attempts
    maxLoginAttempts: 5,
    tokenExpiration: 3600 * 2,
    verify: {
      generateEmailHTML: ({ user, token }) => {
        const verificationUrl = `${APP_URL}/auth/verify?token=${token}`;
        const userFullname = user?.fullName ?? user.email.split("@")[0];
        return getVerificationEmailHTML({ userFullname, verificationUrl });
      },
      generateEmailSubject: ({ user }) =>
        `Hey ${user.fullName ?? "there"}, verify your ${APP_NAME} account`,
    },
  },
  fields: [
    {
      access: {
        create: isAdminOnlyFieldAccess,
        update: isAdminOnlyFieldAccess,
      },

      defaultValue: ROLE.CUSTOMER,

      hooks: {
        beforeChange: [ensureFirstUserIsAdmin],
      },
      name: "role",

      options: [
        {
          label: "Admin",
          value: ROLE.ADMIN,
        },
        {
          label: "Customer",
          value: ROLE.CUSTOMER,
        },
      ],

      saveToJWT: true,
      type: "select",
    },

    {
      admin: {
        description: "Customer's full name (used in emails & orders)",
      },
      label: "Full Name",
      name: "fullName",
      required: true,
      type: "text",
    },

    {
      admin: {
        description:
          "Optional — useful for SMS notifications or Paystack payments (Nigeria)",
      },
      label: "Phone Number",
      name: "phone",
      type: "text",
    },
  ],

  hooks: {
    afterChange: [
      async ({ req, doc, operation }) => {
        if (operation === "create") {
          await req.payload.jobs.queue({
            input: {
              userEmail: doc.email,
              userFullname: doc.fullName ?? doc.email.split("@")[0],
            },
            task: "sendWelcomeEmail",
          });
        }
      },
      // Auto-create wallet for new customers (NGN balance for store credit)
      // async ({ operation, doc, req }) => {
      //   if (operation === "create") {
      //     await req.payload.create({
      //       collection: "wallets",
      //       data: {
      //         balance: 0,
      //         createdBy: doc.id,
      //         currency: "NGN",
      //         owner: doc.id,
      //         updatedBy: doc.id,
      //       },
      //       req,
      //     });
      //   }
      // },
    ],

    // afterError: [
    //   async ({ error, req }) => {
    //     if (error.name === "UnverifiedEmail") {
    //       const readUser = await req.payload.find({
    //         collection: "users",
    //         showHiddenFields: true,
    //         where: {
    //           email: {
    //             equals: req.data?.email,
    //           },
    //         },
    //       });

    //       const currentUser = readUser.docs?.[0];
    //       const verificationUrl = `${appUrl}/auth/verify?token=${currentUser?._verificationToken}`;
    //       const userFullname =
    //         currentUser?.fullName ?? currentUser?.email.split("@")[0];

    //       req.payload.sendEmail({
    //         html: getVerificationEmailHTML({ userFullname, verificationUrl }),
    //         subject: `Hey ${currentUser.fullName ?? "there"}, verify your ${appName} account`,
    //         to: currentUser?.email,
    //       });
    //     }
    //   },
    // ],
  },
  slug: "users",
};
