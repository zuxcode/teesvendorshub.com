"use client";

import { useFormContext } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CheckOutSchemaValues } from "../../modules/checkout/lib/check-out-schema";

export function CustomerInformation() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CheckOutSchemaValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Customer information</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>

            <Input
              {...register("fullName")}
              aria-invalid={!!errors.fullName}
              autoComplete="name"
              id="fullName"
              placeholder="John Doe"
            />

            {errors.fullName ? (
              <p className="text-destructive text-sm">
                {errors.fullName.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone number</Label>

            <Input
              {...register("phone")}
              aria-invalid={!!errors.phone}
              autoComplete="tel"
              id="phone"
              inputMode="tel"
              placeholder="+2348000000000"
              type="tel"
            />
            <p className="text-muted-foreground text-xs">
              Enter your number with the Nigeria country code. For example:{" "}
              <span className="font-medium">+2348000000000</span>
            </p>
            {errors.phone ? (
              <p className="text-destructive text-sm">{errors.phone.message}</p>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
