import type { NotificationChannel } from "../constants/notification-channel";

export interface NotificationMessage {
  action?: {
    label: string;
    url: string;
  };
  content: string;
  title?: string;
}

export interface NotificationProvider {
  send: (
    channel: NotificationChannel,
    message: NotificationMessage
  ) => Promise<void>;
}
