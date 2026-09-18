"use client";

import { Check, ShieldCheck } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PaymentMethod() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Payment</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="rounded-lg border p-4">
          <div className="flex items-start gap-3">
            {/* Selected indicator */}
            <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary">
              <Check className="size-3 text-primary-foreground" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium text-sm">Online payment</p>

                <span className="rounded-md bg-muted px-2 py-1 font-medium text-xs">
                  TransactPay
                </span>
              </div>

              <p className="mt-1 text-muted-foreground text-xs">
                Pay securely through TransactPay using your preferred payment
                method.
              </p>

              <div className="mt-3 flex items-center gap-1.5 text-muted-foreground text-xs">
                <ShieldCheck className="size-3.5" />
                <span>Secure payment</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
