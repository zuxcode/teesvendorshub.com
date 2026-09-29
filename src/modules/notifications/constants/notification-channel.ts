export const NOTIFICATION_CHANNEL_PROVIDER = {
  Telegram: "telegram",
} as const;

export type NotificationChannelProvider =
  (typeof NOTIFICATION_CHANNEL_PROVIDER)[keyof typeof NOTIFICATION_CHANNEL_PROVIDER];

export interface NotificationChannel {
  destination: string;
  enabled: boolean;
  id: string;
  name: string;
  provider: NotificationChannelProvider;
}
