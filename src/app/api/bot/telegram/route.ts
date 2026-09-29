import { registerTelegram } from "@/modules/notifications/providers/telegram/telegram";
import {
  createTelegramBot,
  initializeTelegramBot,
} from "@/modules/notifications/providers/telegram/telegram-bot";
import { payload } from "@/shared/payload/utils/payload";
import { env } from "@/shared/utils/env";

export async function GET() {
  try {
    const bot = createTelegramBot(env.TELEGRAM_BOT_TOKEN);
    await initializeTelegramBot(bot);

    registerTelegram(payload, bot);

    return Response.json({ message: "ok" });
  } catch (error) {
    payload.logger.error(error);
    return Response.json({ message: "Bad" });
  }
}
