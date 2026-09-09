"use client";

import { ArrowLeft, LockKeyhole } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/format-currency";
import type { DocumentId } from "@/lib/types";
import { useCartItemIds, useCartItemQuantity } from "@/stores/cart-store";
import { useProductImage } from "@/stores/product-image-store";
import { useSimCard } from "@/stores/sim-card-store";

function CheckoutItem({ productId }: { productId: DocumentId }) {
  const product = useSimCard(productId);
  const quantity = useCartItemQuantity(productId);

  const imageId =
    typeof product?.productImage === "object"
      ? product.productImage.id
      : product?.productImage;

  const image = useProductImage(imageId);

  if (!product || quantity <= 0) {
    return null;
  }

  const lineTotal = product.price * quantity;

  return (
    <div className="flex gap-4">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
        {image?.sizes?.card?.url ? (
          <Image
            alt={image.alt ?? product.name}
            className="object-cover"
            fill
            sizes="64px"
            src={image.sizes.card.url}
          />
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-1 font-medium text-sm">{product.name}</h3>

        <p className="mt-1 text-muted-foreground text-xs">
          {product.country} · Qty {quantity}
        </p>
      </div>

      <div className="shrink-0 text-right">
        <p className="font-medium text-sm">{formatCurrency(lineTotal)}</p>

        {quantity > 1 && (
          <p className="mt-1 text-muted-foreground text-xs">
            {formatCurrency(product.price)} each
          </p>
        )}
      </div>
    </div>
  );
}

function OrderSummary() {
  const productIds = useCartItemIds();

  const subtotal = productIds.reduce((total, productId) => {
    const product = useSimCard(productId);
    const quantity = useCartItemQuantity(productId);

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

        <Button className="w-full" size="lg">
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

function ContactInformation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Contact information</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>

          <Input
            autoComplete="email"
            id="email"
            name="email"
            placeholder="you@example.com"
            type="email"
          />

          <p className="text-muted-foreground text-xs">
            Your order confirmation and activation details will be sent here.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function CustomerInformation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Customer information</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>

            <Input
              autoComplete="given-name"
              id="firstName"
              name="firstName"
              placeholder="John"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>

            <Input
              autoComplete="family-name"
              id="lastName"
              name="lastName"
              placeholder="Doe"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone number</Label>

          <Input
            autoComplete="tel"
            id="phone"
            name="phone"
            placeholder="+234 800 000 0000"
            type="tel"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function PaymentMethod() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Payment</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-4 items-center justify-center rounded-full border">
              <div className="size-2 rounded-full bg-primary" />
            </div>

            <div>
              <p className="font-medium text-sm">Online payment</p>
              <p className="mt-0.5 text-muted-foreground text-xs">
                Pay securely with your preferred payment method.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyCheckout() {
  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-semibold text-2xl">Your cart is empty</h1>

      <p className="mt-2 max-w-sm text-muted-foreground text-sm">
        Add a SIM card to your cart before continuing to checkout.
      </p>

      <Button className="mt-6" render={<Link href="/sim-cards" />}>
        Browse SIM cards
      </Button>
    </div>
  );
}

export function CheckoutPage() {
  const productIds = useCartItemIds();

  if (productIds.length === 0) {
    return <EmptyCheckout />;
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Button
          className="-ml-2"
          render={<Link href="/sim-cards" />}
          size="sm"
          variant="ghost"
        >
          <ArrowLeft className="mr-2 size-4" />
          Continue shopping
        </Button>

        <h1 className="mt-5 font-bold text-3xl tracking-tight">Checkout</h1>

        <p className="mt-2 text-muted-foreground">
          Complete your order securely.
        </p>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="space-y-6">
          <ContactInformation />
          <CustomerInformation />
          <PaymentMethod />
        </div>

        <OrderSummary />
      </div>
    </main>
  );
}
