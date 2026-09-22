import { CheckOutContent } from "@/modules/checkout/ui";
import { CheckoutReturnToPreviousPage } from "@/modules/checkout/ui/checkout-back-button";

export default function CheckoutPage() {
  return (
    <>
      <div className="mb-8">
        <CheckoutReturnToPreviousPage />

        <h1 className="mt-5 font-bold text-3xl tracking-tight">Checkout</h1>

        <p className="mt-2 text-muted-foreground">
          Complete your order securely.
        </p>
      </div>

      <CheckOutContent />
    </>
  );
}
