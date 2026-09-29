import { NOTIFICATION_CHANNEL_PROVIDER } from "../../constants/notification-channel";
import type { NotificationChannelRepository } from "../../repositories/notification-channel-repository";

export class TelegramChannelRepository {
  private readonly channelRepository: NotificationChannelRepository;

  constructor(channelRepository: NotificationChannelRepository) {
    this.channelRepository = channelRepository;
  }

  async upsert(data: { admin: number; destination: string }) {
    const existing = await this.channelRepository.findByProvider({
      admin: data.admin,
      provider: NOTIFICATION_CHANNEL_PROVIDER.Telegram,
    });

    if (existing) {
      return this.channelRepository.update(existing.id, {
        destination: data.destination,
        enabled: true,
      });
    }

    return this.channelRepository.create({
      admin: data.admin,
      destination: data.destination,
      enabled: true,
      provider: NOTIFICATION_CHANNEL_PROVIDER.Telegram,
    });
  }

  async findEnabled() {
    // generic repository could expose findByProviderAndEnabled()
    // or a more general query method
  }
}
