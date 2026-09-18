/** biome-ignore-all lint/performance/noJsxPropsBind: <Silent> */
"use client";
import { useFormContext } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getAllStates, getStateTowns } from "@/lib/nigeria-geo";
import type { CheckOutSchemaValues } from "./lib/check-out-schema";

export function ShippingAddress() {
  const { register, formState, setValue, watch } =
    useFormContext<CheckOutSchemaValues>();

  const { errors } = formState;

  const watchedState = watch("state");

  const allStates = getAllStates();

  const cities = getStateTowns(watchedState);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Shipping address</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="addressLine1">Street address</Label>

          <Input
            {...register("addressLine1")}
            aria-invalid={!!errors.addressLine1}
            autoComplete="street-address"
            id="addressLine1"
            placeholder="12 Allen Avenue"
          />

          {errors.addressLine1 ? (
            <p className="text-destructive text-sm">
              {errors.addressLine1.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="addressLine2">
            Apartment, suite, unit
            <span className="ml-1 text-muted-foreground">(optional)</span>
          </Label>

          <Input
            {...register("addressLine2")}
            autoComplete="address-line2"
            id="addressLine2"
            placeholder="Apartment 4B"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>

            <Select<CheckOutSchemaValues>
              onValueChange={(value) => {
                setValue(
                  "state",
                  (value as unknown as string) || "",

                  {
                    shouldDirty: true,
                    shouldValidate: true,
                  }
                );
              }}
            >
              <SelectTrigger
                aria-invalid={!!errors.state}
                className={"w-full"}
                id="state"
              >
                <SelectValue placeholder="Select state" />
              </SelectTrigger>

              <SelectContent>
                {allStates.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors.state ? (
              <p className="text-destructive text-sm">{errors.state.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>

            <Select<CheckOutSchemaValues>
              onValueChange={(value) => {
                setValue("city", (value as unknown as string) || "", {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
            >
              <SelectTrigger
                aria-invalid={!!errors.city}
                className={"w-full"}
                id="city"
              >
                <SelectValue placeholder="Select city" />
              </SelectTrigger>

              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors.city ? (
              <p className="text-destructive text-sm">{errors.city.message}</p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="postalCode">
              Postal code
              <span className="ml-1 text-muted-foreground">(optional)</span>
            </Label>

            <Input
              {...register("postalCode")}
              autoComplete="postal-code"
              id="postalCode"
              inputMode="numeric"
              placeholder="100001"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>

            <Input
              {...register("country")}
              autoComplete="country-name"
              disabled
              id="country"
              readOnly
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="deliveryInstructions">
            Delivery instructions
            <span className="ml-1 text-muted-foreground">(optional)</span>
          </Label>

          <Textarea
            {...register("deliveryInstructions")}
            id="deliveryInstructions"
            placeholder="Add a landmark, gate instructions, or other details to help with delivery."
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}
