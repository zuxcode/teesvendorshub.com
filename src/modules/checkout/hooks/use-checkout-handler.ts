import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  useCartActions,
  useCartItemValues,
} from "@/modules/checkout/store/cart-store";
import { useAuthUser } from "@/modules/users/stores/user-store";
import { checkOutAction } from "../actions/checkout.action";
import {
  type CheckoutDigitalSchemaValues,
  getCheckoutSchema,
  getDefaultValues,
} from "../lib/check-out-schema";
import { useCartHasPhysicalProduct } from "./use-cart-has-physical-product";

const CHECK_OUT_TOAST_ID = "CHECK_OUT_TOAST_ID";

export function useCheckoutHandler() {
  const cartItems = useCartItemValues();
  const { clearCart } = useCartActions();
  const user = useAuthUser();
  const { cartHasPhysicalProduct } = useCartHasPhysicalProduct();
  const schema = getCheckoutSchema(cartHasPhysicalProduct);

  const form = useForm({
    defaultValues: getDefaultValues(cartHasPhysicalProduct, user),
    mode: "onBlur",
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    form.reset(getDefaultValues(cartHasPhysicalProduct, user));
  }, [user, form, cartHasPhysicalProduct]);

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
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    });
  };

  return {
    execute: form.handleSubmit(onCheckoutHandler),
    form,
    isExecuting,
  };
}
