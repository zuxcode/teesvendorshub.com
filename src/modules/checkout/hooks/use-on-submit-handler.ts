import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import {
  useCartActions,
  useCartItemValues,
} from "@/modules/checkout/store/cart-store";
import { checkOutAction } from "../actions/checkout.action";
import type { CheckOutSchemaValues } from "../lib/check-out-schema";

const CHECK_OUT_TOAST_ID = "CHECK_OUT_TOAST_ID";

export function useOnSubmitHandler() {
  const cartItems = useCartItemValues();
  const { clearCart } = useCartActions();

  const { execute, isExecuting } = useAction(checkOutAction, {
    onError: ({ error }) => {
      if (error.validationErrors) {
        const { fieldErrors } = error.validationErrors;

        const errorMessage = Object.values(fieldErrors)
          .flat()
          .filter(Boolean)
          .join(" ");

        toast.error(errorMessage || "Please check your information.", {
          id: CHECK_OUT_TOAST_ID,
        });

        return;
      }

      if (error.serverError) {
        toast.error(error.serverError.message, {
          id: CHECK_OUT_TOAST_ID,
        });

        return;
      }

      if (error.thrownError) {
        toast.error(error.thrownError.name, {
          id: CHECK_OUT_TOAST_ID,
        });
        return;
      }

      toast.error("Something went wrong. Please try again.", {
        id: CHECK_OUT_TOAST_ID,
      });
    },
    onExecute: () => {
      toast.loading("Processing...", {
        id: CHECK_OUT_TOAST_ID,
      });
    },

    onSuccess: () => {
      clearCart();
      toast.success("Checkout created successfully.", {
        id: CHECK_OUT_TOAST_ID,
      });
    },
  });

  const onSubmit = (values: CheckOutSchemaValues) => {
    execute({
      ...values,
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    });
  };

  return {
    execute: onSubmit,
    isExecuting,
  };
}
