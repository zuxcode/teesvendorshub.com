"use client";

import { useEffect } from "react";
import type { Order, OrderItem } from "@/payload-types";
import { useOrderActions } from "../store/order-store";

interface Props {
  items: OrderItem[];
  orders: Order[];
}

export function HydrateOrderStore({ items, orders }: Props) {
  const { addOrders, addOrderItems } = useOrderActions();

  useEffect(() => {
    addOrderItems(items);
    addOrders(orders);
  }, [items, orders, addOrderItems, addOrders]);

  return null;
}
