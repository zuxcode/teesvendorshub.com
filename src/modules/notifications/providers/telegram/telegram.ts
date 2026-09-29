import type { Bot } from "grammy";
import type { Payload } from "payload";
// import { NotificationChannelRepository } from "../../repositories/notification-channel-repository";
// import { NotificationProviderRegistry } from "../provider.registry";
// import { TelegramService } from "./telegram.service";
import { telegramBotCommand } from "./telegram-handler";
// import { TelegramChannelRepository } from "./telegram-repository";

export function registerTelegram(_payload: Payload, bot: Bot) {
  // const notificationChannelRepository = new NotificationChannelRepository(
  //   payload
  // );

  // const _telegramChannelRepository = new TelegramChannelRepository(
  //   notificationChannelRepository
  // );

  // const telegramService = new TelegramService(bot);

  // const _notificationProviderRegistry = new NotificationProviderRegistry(
  //   telegramService
  // );

  telegramBotCommand(bot);

  return {
    bot,
  };
}
