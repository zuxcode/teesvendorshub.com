import { OrderCardsHighlight } from "@/modules/order/ui/order-cards-highlight";
import { OrderHeader } from "@/modules/order/ui/order-header";
import { OrderServer } from "@/modules/order/ui/order-server";
import { OrderedItems } from "@/modules/order/ui/ordered-items";

export default function OrdersPage() {
  return (
    <div className="space-y-5">
      <OrderServer />
      <OrderHeader />
      <OrderCardsHighlight />
      <OrderedItems />
    </div>
  );
}
