import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import type { Order, OrderItem } from "@/payload-types";
import { getRelationshipId } from "@/shared/utils/get-relationship-id";

export interface CartStoreState {
  orderItems: Record<string, OrderItem>;
  orders: Record<string, Order>;
}

export interface CartStoreActions {
  addOrder: (order: Order) => void;
  addOrderItem: (item: OrderItem) => void;
  addOrderItems: (items: OrderItem[]) => void;
  addOrders: (orders: Order[]) => void;
}

export interface CartStore extends CartStoreState {
  actions: CartStoreActions;
}

export const useOrderStore = createWithEqualityFn<CartStore>()(
  persist(
    immer((set) => ({
      actions: {
        addOrder: (order) => {
          set((state) => {
            state.orders[order.id] = order;
          });
        },

        addOrderItem: (item) => {
          set((state) => {
            state.orderItems[item.id] = item;
          });
        },

        addOrderItems: (items) => {
          set((state) => {
            for (const item of items) {
              state.orderItems[item.id] = item;
            }
          });
        },

        addOrders: (orders) => {
          set((state) => {
            for (const order of orders) {
              state.orders[order.id] = order;
            }
          });
        },
      },
      orderItems: {},
      orders: {},
    })),
    {
      name: "tvh_order",
      partialize: (state) => ({
        orderItems: state.orderItems,
        orders: state.orders,
      }),
    }
  ),
  shallow
);

export const useOrderById = (id: string | null) =>
  useOrderStore((state) => (id && state.orders[id]) || null);

export const useOrderItemById = (id: string) =>
  useOrderStore((state) => state.orderItems[id] || null);

export const useOrders = () =>
  useOrderStore((state) => Object.values(state.orders) ?? []);

export const useOrderItems = () =>
  useOrderStore((state) => Object.values(state.orderItems) ?? []);

export const useOrderItemsByOrderId = (orderId: string) =>
  useOrderStore(
    (state) =>
      Object.values(state.orderItems).filter(
        (item) => getRelationshipId(item.order) === orderId
      ),
    shallow
  );

export const useOrderActions = () => useOrderStore((state) => state.actions);

export const usePendingOrder = () =>
  useOrderStore(
    (state) =>
      Object.values(state.orders)?.filter((o) => o.status === "pending") ?? []
  );

export const useCompletedOrder = () =>
  useOrderStore(
    (state) =>
      Object.values(state.orders)?.filter((o) => o.status === "completed") ?? []
  );

export const useProcessingOrder = () =>
  useOrderStore(
    (state) =>
      Object.values(state.orders)?.filter((o) => o.status === "processing") ??
      []
  );

export const useCancelledOrRefundedOrder = () =>
  useOrderStore(
    (state) =>
      Object.values(state.orders)?.filter(
        (o) => o.status === "cancelled" || o.status === "refunded"
      ) ?? []
  );
