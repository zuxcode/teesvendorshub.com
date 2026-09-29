import { Bot } from "grammy";
import type { NotificationChannel } from "../../constants/notification-channel";
import type {
  NotificationMessage,
  NotificationProvider,
} from "../notification-provider";

export class TelegramProvider implements NotificationProvider {
  private readonly bot: Bot;

  constructor(botToken: string) {
    this.bot = new Bot(botToken);
  }

  async send(channel: NotificationChannel, message: NotificationMessage) {
    await this.bot.api.sendMessage(channel.destination, message.content);
  }
}
