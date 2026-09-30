"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useAuthUser } from "@/modules/users/stores/user-store";
import { useCartHasPhysicalProduct } from "../hooks/use-cart-has-physical-product";
import { useCheckoutHandler } from "../hooks/use-checkout-handler";
import { getCheckoutSchema } from "../lib/check-out-schema";
import { OrderSummary } from "./check-summary";
import { ContactInformation } from "./contact-information";
import { CustomerInformation } from "./customer-infomation";
import { PaymentMethod } from "./payment-method";
import { ShippingAddress } from "./shipping-address";

export function CheckoutForm() {
  const user = useAuthUser();
  const { execute } = useCheckoutHandler();
  const { cartHasPhysicalProduct } = useCartHasPhysicalProduct();
  const schema = getCheckoutSchema(cartHasPhysicalProduct);

  const form = useForm({
    defaultValues: cartHasPhysicalProduct
      ? {
          addressLine1: "",
          addressLine2: "",
          city: "",
          country: "NIG",
          deliveryInstructions: "",
          email: user?.email ?? "",
          fullName: user?.fullName ?? "",
          phone: user?.phone ?? "",
          postalCode: "",
          state: "",
        }
      : {
          email: user?.email ?? "",
        },

    mode: "onBlur",

    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!user) {
      return;
    }

    form.reset(
      cartHasPhysicalProduct
        ? {
            addressLine1: "",
            addressLine2: "",
            city: "",
            country: "NIG",
            deliveryInstructions: "",
            email: user?.email ?? "",
            fullName: user?.fullName ?? "",
            phone: user?.phone ?? "",
            postalCode: "",
            state: "",
          }
        : {
            email: user?.email ?? "",
          }
    );
  }, [user, form, cartHasPhysicalProduct]);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(execute)}>
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
          <div className="space-y-6">
            <ContactInformation />

            {cartHasPhysicalProduct ? (
              <>
                <CustomerInformation />
                <ShippingAddress />
              </>
            ) : null}

            <PaymentMethod />
          </div>

          <OrderSummary />
        </div>
      </form>
    </FormProvider>
  );
}
