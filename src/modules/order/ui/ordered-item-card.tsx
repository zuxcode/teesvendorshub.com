import Image from "next/image";
import { ImagePlaceholder } from "@/components/tees-ui/image-placeholder";
import { cn } from "@/lib/utils";
import { useProductImage } from "@/modules/media/stores/product-image-store";
import type { OrderFulfillmentStatus } from "@/modules/order/order.constants";
import { useProduct } from "@/modules/products/stores/product-store";
import type { OrderItem } from "@/payload-types";
import { getRelationshipId } from "@/shared/utils/get-relationship-id";
import { OrderedItemSecrets } from "./ordered-item-secrets";

export function OrderedItemCard(item: OrderItem) {
  const orderImage = useProductImage(getRelationshipId(item.productImage));
  const product = useProduct(getRelationshipId(item.product));
  const secrets = item.secrets ?? [];
  const hasSecrets = product?.productType !== "physical" && secrets.length > 0;

  const FULFILLMENT_STATUS_STYLES = {
    cancelled: "product-order-cancelled",
    completed: "product-order-completed",
    partial: "product-order-partial",
    pending: "product-order-pending",
  } satisfies Record<OrderFulfillmentStatus, string>;

  return (
    <article className="rounded-xl border bg-card p-4">
      <div className="flex gap-3">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
          {orderImage?.sizes?.card?.url ? (
            <Image
              alt={orderImage.alt ?? product?.name ?? "Ordered product"}
              className="object-cover"
              fill
              sizes="80px"
              src={orderImage.sizes.card.url}
            />
          ) : (
            <ImagePlaceholder />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 font-medium text-sm">
              {product?.name ?? "Product"}
            </h3>

            <span
              className={cn(
                "shrink-0 rounded-md px-2 py-1 text-xs",
                FULFILLMENT_STATUS_STYLES[item.fulfillmentStatus]
              )}
            >
              {item.fulfillmentStatus}
            </span>
          </div>
        </div>
      </div>

      {hasSecrets ? <OrderedItemSecrets secrets={secrets} /> : null}
    </article>
  );
}
