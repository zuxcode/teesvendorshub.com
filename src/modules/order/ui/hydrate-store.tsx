"use client";

import { useEffect } from "react";
import type { Order, OrderItem } from "@/payload-types";
import { useClearCart } from "../hooks/use-clear-cart";
import { usePollPendingOrder } from "../hooks/use-poll-pending-order";
import { useOrderActions } from "../store/order-store";

interface Props {
  items: OrderItem[];
  orders: Order[];
}

export function HydrateOrderStore({ items, orders }: Props) {
  const { setOrders, setOrderItems } = useOrderActions();

  usePollPendingOrder();
  useClearCart();

  useEffect(() => {
    setOrderItems(items);
    setOrders(orders);
  }, [items, orders, setOrderItems, setOrders]);

  return null;
}
