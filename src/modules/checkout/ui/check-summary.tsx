"use client";

import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTotalPrice } from "@/modules/cart/hooks/use-total-price";
import { useCartItems } from "@/modules/cart/store/cart-store";
import { formatCurrency } from "@/shared/utils/format-currency";
import { CheckoutItem } from "./checkout-item";

export function OrderSummary() {
  const cartItems = useCartItems();

  const { total } = useTotalPrice();

  return (
    <Card className="lg:sticky lg:top-6">
      <CardHeader>
        <CardTitle className="text-lg">Order summary</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-4">
          {cartItems.map((item) => (
            <CheckoutItem key={item.id} {...item} />
          ))}
        </div>

        <Separator />

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(total)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Discount</span>
            <span>—</span>
          </div>

          <Separator />

          <div className="flex items-center justify-between font-semibold text-base">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        <Button className="w-full" size="lg" type="submit">
          Place order · {formatCurrency(total)}
        </Button>

        <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs">
          <LockKeyhole className="size-3.5" />
          <span>Secure checkout</span>
        </div>
      </CardContent>
    </Card>
  );
}
