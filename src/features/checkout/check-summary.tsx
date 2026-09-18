"use client";

import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/format-currency";
import { useCartActions, useCartItemIds } from "@/stores/cart-store";
import { useProductActions } from "@/stores/product-store";
import { CheckoutItem } from "./checkout-item";

export function OrderSummary() {
  const productIds = useCartItemIds();
  const { getProductById } = useProductActions();
  const { getItemQuantity } = useCartActions();

  const subtotal = productIds.reduce((total, productId) => {
    const product = getProductById(productId);
    const quantity = getItemQuantity(productId);

    if (!product || quantity <= 0) {
      return total;
    }

    return total + product.price * quantity;
  }, 0);

  return (
    <Card className="lg:sticky lg:top-6">
      <CardHeader>
        <CardTitle className="text-lg">Order summary</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-4">
          {productIds.map((productId) => (
            <CheckoutItem key={productId} productId={productId} />
          ))}
        </div>

        <Separator />

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Discount</span>
            <span>—</span>
          </div>

          <Separator />

          <div className="flex items-center justify-between font-semibold text-base">
            <span>Total</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
        </div>

        <Button className="w-full" size="lg" type="submit">
          Place order · {formatCurrency(subtotal)}
        </Button>

        <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs">
          <LockKeyhole className="size-3.5" />
          <span>Secure checkout</span>
        </div>
      </CardContent>
    </Card>
  );
}
