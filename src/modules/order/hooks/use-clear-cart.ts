import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useCartActions } from "@/modules/cart/store/cart-store";

export function useClearCart() {
  const searchParams = useSearchParams();
  const { clearCart } = useCartActions();

  const paymentStatus = searchParams.get("status");

  useEffect(() => {
    if (paymentStatus !== "Successful") {
      return;
    }
    clearCart();
  }, [paymentStatus, clearCart]);
}
