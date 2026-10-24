import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCartActions, useCartItems } from "@/modules/cart/store/cart-store";
import { useAuthUser } from "@/modules/users/stores/user-store";
import { checkOutAction } from "../actions/checkout.action";
import {
  type CheckoutDigitalSchemaValues,
  getCheckoutSchema,
  getDefaultValues,
} from "../lib/check-out-schema";
import { useShippingAddressVisibility } from "./use-shipping-address-visibility";

const CHECK_OUT_TOAST_ID = "CHECK_OUT_TOAST_ID";

export function useCheckoutHandler() {
  const cartItems = useCartItems();
  const { clearCart } = useCartActions();
  const user = useAuthUser();
  const { requiresShippingAddress } = useShippingAddressVisibility();

  const schema = getCheckoutSchema(requiresShippingAddress);

  const form = useForm({
    defaultValues: getDefaultValues(requiresShippingAddress, user),
    mode: "onBlur",
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    form.reset(getDefaultValues(requiresShippingAddress, user));
  }, [user, form, requiresShippingAddress]);

  const { execute, isExecuting } = useAction(checkOutAction, {
    onError: ({ error }) => {
      if (error.validationErrors) {
        const { fieldErrors } = error.validationErrors;

        let errorMessage = "Please check your information.";

        for (const [field, messages] of Object.entries(fieldErrors)) {
          if (messages && messages.length > 0) {
            errorMessage = `${field}: ${messages.join(" ")}`;
            form.setError(field as keyof CheckoutDigitalSchemaValues, {
              message: messages.join(" "),
              type: "manual",
            });
          }
        }

        toast.error(errorMessage, {
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

  const onCheckoutHandler = (values: CheckoutDigitalSchemaValues) => {
    execute({
      ...values,
      items: cartItems.map((item) => item),
    });
  };

  return {
    execute: form.handleSubmit(onCheckoutHandler),
    form,
    isExecuting,
  };
}
