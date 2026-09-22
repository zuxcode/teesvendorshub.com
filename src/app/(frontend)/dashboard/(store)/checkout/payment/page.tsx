import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PaymentStatus = "successful" | "pending" | "failed";

interface PaymentReturnPageProps {
  searchParams: Promise<{
    reference?: string;
  }>;
}

export default async function PaymentReturnPage({
  searchParams,
}: PaymentReturnPageProps) {
  const { reference } = await searchParams;

  // Replace this with your server-side payment verification/status lookup.
  const status: PaymentStatus = "pending";

  return (
    <main className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-12">
      <PaymentResult reference={reference} status={status} />
    </main>
  );
}

interface PaymentResultProps {
  reference?: string;
  status: PaymentStatus;
}

function PaymentResult({ status, reference }: PaymentResultProps) {
  if (status === "successful") {
    return (
      <Card className="w-full max-w-md text-center">
        <CardHeader className="items-center">
          <div className="mb-2 flex size-14 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="size-8 text-green-600" />
          </div>

          <CardTitle className="text-2xl">Payment successful</CardTitle>

          <CardDescription>
            Your payment has been received and your order is being processed.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {reference ? (
            <div className="rounded-lg border bg-muted/40 p-4 text-sm">
              <p className="text-muted-foreground">Payment reference</p>
              <p className="mt-1 break-all font-medium">{reference}</p>
            </div>
          ) : null}

          <Button className="w-full" render={<Link href="/account/orders" />}>
            View my orders
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (status === "failed") {
    return (
      <Card className="w-full max-w-md text-center">
        <CardHeader className="items-center">
          <div className="mb-2 flex size-14 items-center justify-center rounded-full bg-red-100">
            <XCircle className="size-8 text-red-600" />
          </div>

          <CardTitle className="text-2xl">Payment unsuccessful</CardTitle>

          <CardDescription>
            We couldn't confirm your payment. Your order has not been completed.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {reference ? (
            <div className="rounded-lg border bg-muted/40 p-4 text-sm">
              <p className="text-muted-foreground">Payment reference</p>
              <p className="mt-1 break-all font-medium">{reference}</p>
            </div>
          ) : null}

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button className="flex-1" render={<Link href="/checkout" />}>
              Try again
            </Button>

            <Button
              className="flex-1"
              render={<Link href="/dashboard/products" />}
              variant="outline"
            >
              Continue shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md text-center">
      <CardHeader className="items-center">
        <div className="mb-2 flex size-14 items-center justify-center rounded-full bg-muted">
          <Clock3 className="size-8 text-muted-foreground" />
        </div>

        <CardTitle className="text-2xl">Verifying your payment</CardTitle>

        <CardDescription>
          We're confirming your payment. This may take a few moments.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {reference ? (
          <div className="rounded-lg border bg-muted/40 p-4 text-sm">
            <p className="text-muted-foreground">Payment reference</p>
            <p className="mt-1 break-all font-medium">{reference}</p>
          </div>
        ) : null}

        <p className="text-muted-foreground text-sm">
          Please don't make another payment while we verify this transaction.
        </p>

        <Button
          className="w-full"
          render={<Link href="/account/orders" />}
          variant="outline"
        >
          View my orders
        </Button>
      </CardContent>
    </Card>
  );
}
