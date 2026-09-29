import type { Bot } from "grammy";
import { getAuthenticateUser } from "@/modules/authentication/libs/get-auth";
import {
  GlobalError,
  GlobalErrorCode,
  globalServerActionError,
} from "@/shared/errors/global-errors";

export class TelegramService {
  private readonly bot: Bot;

  constructor(bot: Bot) {
    this.bot = bot;
  }

  async connect() {
    const { user } = await getAuthenticateUser();

    if (user?.role !== "admin") {
      throw new GlobalError(
        globalServerActionError(GlobalErrorCode.ACCESS_DENIED)
      );
    }
  }

  //   async sendMessage() {}

  //   async sendOrderNotification() {}
}
