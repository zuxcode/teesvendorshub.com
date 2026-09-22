"use client";

import { useFormContext } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CheckOutSchemaValues } from "../lib/check-out-schema";

export function ContactInformation() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CheckOutSchemaValues>();

  const error = errors.email;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Contact information</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>

          <Input
            {...register("email")}
            aria-describedby={error ? "email-error" : "email-description"}
            aria-invalid={!!error}
            autoComplete="email"
            id="email"
            placeholder="you@example.com"
            type="email"
          />

          {error ? (
            <p className="text-destructive text-sm" id="email-error">
              {error.message}
            </p>
          ) : (
            <p className="text-muted-foreground text-xs" id="email-description">
              Your order confirmation and activation details will be sent here.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
