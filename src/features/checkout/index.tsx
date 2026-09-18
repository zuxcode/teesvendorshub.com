"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useHasCartItems } from "@/stores/cart-store";
import { useAuthUser } from "@/stores/user-store";
import { OrderSummary } from "./check-summary";
import { EmptyCheckout } from "./checkout-empty";
import { ContactInformation } from "./contact-information";
import { CustomerInformation } from "./customer-infomation";
import { useOnSubmitHandler } from "./hooks/use-on-submit-handler";
import {
  type CheckOutSchemaValues,
  checkOutSchema,
} from "./lib/check-out-schema";
import { PaymentMethod } from "./payment-method";
import { ShippingAddress } from "./shipping-address";

export function CheckOutContent() {
  const hasCartItem = useHasCartItems();
  const { execute } = useOnSubmitHandler();
  const user = useAuthUser();

  const form = useForm<CheckOutSchemaValues>({
    defaultValues: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      country: "Nigeria",
      deliveryInstructions: "",
      email: user?.email ?? "",
      fullName: user?.fullName ?? "",
      phone: user?.phone ?? "+234",
      postalCode: "",
      state: user?.fullName || "Lagos",
    },
    mode: "onBlur",
    resolver: zodResolver(checkOutSchema),
  });

  useEffect(() => {
    if (!user) {
      return;
    }

    form.reset({
      addressLine1: "",
      addressLine2: "",
      city: "",
      country: "Nigeria",
      deliveryInstructions: "",
      email: user.email ?? "",
      fullName: user.fullName ?? "",
      phone: user.phone ?? "+234",
      postalCode: "",
      state: user.fullName || "Lagos",
    });
  }, [user, form]);

  if (!hasCartItem) {
    return <EmptyCheckout />;
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(execute)}>
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
          <div className="space-y-6">
            <ContactInformation />
            <CustomerInformation />
            <ShippingAddress />
            <PaymentMethod />
          </div>

          <OrderSummary />
        </div>
      </form>
    </FormProvider>
  );
}
