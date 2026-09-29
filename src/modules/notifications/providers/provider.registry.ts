import {
  NOTIFICATION_CHANNEL_PROVIDER,
  type NotificationChannelProvider,
} from "../constants/notification-channel";
import type { TelegramService } from "./telegram/telegram.service";

export class NotificationProviderRegistry {
  private readonly telegramService: TelegramService;

  constructor(telegramService: TelegramService) {
    this.telegramService = telegramService;
  }

  connect(provider: NotificationChannelProvider) {
    if (provider === NOTIFICATION_CHANNEL_PROVIDER.Telegram) {
      this.telegramService.connect();
    }
  }
}
