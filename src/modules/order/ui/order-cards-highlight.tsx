"use client";

import {
  CheckCircle2,
  Clock3,
  LoaderCircle,
  ShoppingCart,
  XCircle,
} from "lucide-react";
import {
  useCancelledOrRefundedOrder,
  useCompletedOrder,
  useOrders,
  usePendingOrder,
  useProcessingOrder,
} from "../store/order-store";
import { OrderHeaderCard } from "./order-header-card";

export function OrderCardsHighlight() {
  const totalOrders = useOrders().length;
  const pendingOrders = usePendingOrder().length;
  const completedOrders = useCompletedOrder().length;
  const processingOrders = useProcessingOrder().length;
  const cancelledOrRefundedOrders = useCancelledOrRefundedOrder().length;

  const items = [
    {
      className: "product-order-primary",
      Icon: ShoppingCart,
      label: "Total orders",
      value: totalOrders,
    },
    {
      className: "product-order-pending",
      Icon: Clock3,
      label: "Pending",
      value: pendingOrders,
    },
    {
      className: "product-order-processing",
      Icon: LoaderCircle,
      label: "Processing",
      value: processingOrders,
    },
    {
      className: "product-order-completed",
      Icon: CheckCircle2,
      label: "Completed",
      value: completedOrders,
    },
    {
      className: "product-order-cancelled",
      Icon: XCircle,
      label: "Cancelled / Refunded",
      value: cancelledOrRefundedOrders,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
      {items.map(({ className, Icon, label, value }) => (
        <OrderHeaderCard
          className={className}
          Icon={Icon}
          key={label}
          label={label}
          value={value}
        />
      ))}
    </div>
  );
}
