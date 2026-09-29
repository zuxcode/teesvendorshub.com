import { Bot } from "grammy";

let bot: Bot | undefined;

let isRunning = false;

export function createTelegramBot(token: string): Bot {
  if (bot) {
    return bot;
  }

  bot = new Bot(token);

  return bot;
}

export async function initializeTelegramBot(telegramBot: Bot): Promise<Bot> {
  if (isRunning) {
    return telegramBot;
  }

  const me = await telegramBot.api.getMe();

  console.log(`Telegram bot connected: @${me.username}`);

  isRunning = true;

  telegramBot.start().catch((error) => {
    isRunning = false;
    console.error(error);
  });

  return telegramBot;
}
