import type { Payload } from "payload";
import type { ResourceId } from "@/shared/types";
import type { NotificationChannelProvider } from "../constants/notification-channel";

export class NotificationChannelRepository {
  private readonly payload: Payload;

  private readonly dbTransactionId: ResourceId | undefined;

  constructor(payload: Payload, dbTransactionId?: ResourceId) {
    this.payload = payload;
    this.dbTransactionId = dbTransactionId;
  }

  async findByProvider(data: {
    admin: ResourceId;
    provider: NotificationChannelProvider;
  }) {
    const { docs } = await this.payload.find({
      collection: "notification-channels",
      limit: 1,
      where: {
        and: [
          {
            admin: {
              equals: data.admin,
            },
          },
          {
            provider: {
              equals: data.provider,
            },
          },
        ],
      },
      ...(this.dbTransactionId
        ? {
            req: {
              transactionID: this.dbTransactionId,
            },
          }
        : {}),
    });

    return docs.at(0);
  }

  async create(data: {
    admin: number;
    destination: string;
    enabled: boolean;
    provider: NotificationChannelProvider;
  }) {
    return await this.payload.create({
      collection: "notification-channels",
      data,
      ...(this.dbTransactionId
        ? {
            req: {
              transactionID: this.dbTransactionId,
            },
          }
        : {}),
    });
  }

  async update(
    id: ResourceId,
    data: {
      destination?: string;
      enabled?: boolean;
    }
  ) {
    return await this.payload.update({
      collection: "notification-channels",
      data,
      id,
      ...(this.dbTransactionId
        ? {
            req: {
              transactionID: this.dbTransactionId,
            },
          }
        : {}),
    });
  }
}
