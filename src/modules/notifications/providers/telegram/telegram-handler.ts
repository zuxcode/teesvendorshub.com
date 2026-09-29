import type { Bot } from "grammy";

export interface TelegramBotConfig {
  botToken: string;
}

export function telegramBotCommand(bot: Bot) {
  bot.command("start", async (ctx) => {
    const token = ctx.match.trim();

    console.log(ctx.message);

    if (!token) {
      await ctx.reply(
        "Please use the Connect Telegram button from the admin dashboard."
      );
    }

    // try {
    //   await linkingService.completeLink({
    //     telegramChatId: String(ctx.chat.id),
    //     token,
    //   });

    //   await ctx.reply(
    //     "Telegram has been successfully connected to your admin account."
    //   );
    // } catch (error) {
    //   console.error("Failed to link Telegram:", error);

    //   await ctx.reply(
    //     "This connection link is invalid or has expired. Please generate a new one from the admin dashboard."
    //   );
    // }
  });

  return bot;
}
