"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useOrderByRefrence } from "../store/order-store";

const MAX_POLL_ATTEMPTS = 10;
const INITIAL_POLL_DELAY = 1000;
const MAX_POLL_DELAY = 30_000;

export function usePollPendingOrder() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderPaymentReference = searchParams.get("order_payment_reference");
  const order = useOrderByRefrence(orderPaymentReference);

  useEffect(() => {
    if (!orderPaymentReference || order?.status !== "pending") {
      return;
    }

    let attempts = 0;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    function poll() {
      if (cancelled || attempts >= MAX_POLL_ATTEMPTS) {
        return;
      }

      const delay = Math.min(
        INITIAL_POLL_DELAY * 2 ** attempts,
        MAX_POLL_DELAY
      );

      timeoutId = setTimeout(() => {
        if (cancelled) {
          return;
        }

        attempts += 1;
        router.refresh();
        poll();
      }, delay);
    }

    poll();

    return () => {
      cancelled = true;

      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [orderPaymentReference, order?.status, router]);
}
