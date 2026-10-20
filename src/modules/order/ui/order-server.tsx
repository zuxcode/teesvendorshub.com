import { connection } from "next/server";
import { getAuthenticateUser } from "@/modules/users/libs/get-auth";
import { payload } from "@/shared/payload/utils/payload";
import { OrderRepository } from "../repository/order.repository";

const orderOrderRepository = new OrderRepository(payload);

export async function OrderServer() {
  await connection();
  const { user } = await getAuthenticateUser();

  await orderOrderRepository.findBuyerOrders(user?.id);
  return null;
}
