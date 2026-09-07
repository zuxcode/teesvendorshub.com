import type { TaskConfig, TaskHandler } from "payload";
import { APP_NAME } from "@/constant";
import type { TaskSendWelcomeEmail } from "@/payload-types";
import { getWelcomeEmailHTML } from "../email-template/auth-email-templates";

const welcomeEmailHandler: TaskHandler<TaskSendWelcomeEmail> = async ({
  input,
  req,
}) => {
  await req.payload.sendEmail({
    html: getWelcomeEmailHTML({ userFullname: input.userFullname }),
    subject: `Welcome to ${APP_NAME}`,
    to: input.userEmail,
  });
  return {
    output: {
      success: true,
    },
  };
};

export const sendWelcomeEmailTask: TaskConfig<TaskSendWelcomeEmail> = {
  handler: welcomeEmailHandler,
  inputSchema: [
    {
      name: "userEmail",
      required: true,
      type: "email",
    },
    {
      name: "userFullname",
      required: true,
      type: "text",
    },
  ],
  outputSchema: [{ name: "success", required: true, type: "checkbox" }],
  retries: 3,
  slug: "sendWelcomeEmail",
};
