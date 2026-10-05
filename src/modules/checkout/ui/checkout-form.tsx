"use client";

import { FormProvider } from "react-hook-form";
import { useCartHasPhysicalProduct } from "../hooks/use-cart-has-physical-product";
import { useCheckoutHandler } from "../hooks/use-checkout-handler";
import { OrderSummary } from "./check-summary";
import { ContactInformation } from "./contact-information";
import { CustomerInformation } from "./customer-infomation";
import { PaymentMethod } from "./payment-method";
import { ShippingAddress } from "./shipping-address";

export function CheckoutForm() {
  const { execute, form } = useCheckoutHandler();
  const { cartHasPhysicalProduct } = useCartHasPhysicalProduct();

  return (
    <FormProvider {...form}>
      <form onSubmit={execute}>
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
