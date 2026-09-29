"use server";

// import { redirect } from "next/navigation";
// import { createTelegramConnectionToken } from "@/modules/telegram";
import { authenticatedActionClient } from "@/shared/utils/server-action";

export const connectTelegramAction = authenticatedActionClient.action(
  async ({ ctx }) => {
    console.log(ctx.user.fullName);

    // const token = await createTelegramConnectionToken(ctx.user.id);

    // redirect(
    //   `https://t.me/teesvendorshub_bot?start=${encodeURIComponent(token)}`
    // );

    return await { data: null };
  }
);
