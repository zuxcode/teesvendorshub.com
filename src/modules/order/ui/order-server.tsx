import { connection } from "next/server";
import { AuthError } from "@/modules/authentication/libs/auth-errors";
import { getAuthenticateUser } from "@/modules/authentication/libs/get-auth";
import { payload } from "@/shared/payload/utils/payload";
import { OrderRepository } from "../repository/order.repository";
import { OrderItemRepository } from "../repository/order-item.repository";
import { HydrateOrderStore } from "./hydrate-store";

const orderOrderRepository = new OrderRepository(payload);
const orderItemRepository = new OrderItemRepository(payload);

export async function OrderServer() {
  await connection();
  const { user } = await getAuthenticateUser();

  if (!user) {
    throw new AuthError({ code: "AUTH_ACCOUNT_REQUIRED" });
  }

  const [orderRecords, orderItemRecords] = await Promise.all([
    orderOrderRepository.findBuyerOrders(user?.id),
    orderItemRepository.findBuyerOrderItems(user?.id),
  ]);

  return <HydrateOrderStore items={orderItemRecords} orders={orderRecords} />;
}
