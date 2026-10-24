"use client";

import { FormProvider } from "react-hook-form";
import { useCheckoutHandler } from "../hooks/use-checkout-handler";
import { useShippingAddressVisibility } from "../hooks/use-shipping-address-visibility";
import { OrderSummary } from "./check-summary";
import { ContactInformation } from "./contact-information";
import { CustomerInformation } from "./customer-infomation";
import { PaymentMethod } from "./payment-method";
import { ShippingAddress } from "./shipping-address";

export function CheckoutForm() {
  const { execute, form } = useCheckoutHandler();
  const { requiresShippingAddress } = useShippingAddressVisibility();

  return (
    <FormProvider {...form}>
      <form onSubmit={execute}>
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
          <div className="space-y-6">
            <ContactInformation />

            {requiresShippingAddress ? (
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
