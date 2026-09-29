import { toast } from "@payloadcms/ui";
import { useAction } from "next-safe-action/hooks";

import { connectTelegramAction } from "../actions/connect-telegram-action";

const CONNECT_TELEGRAM_TOAST_ID = "CONNECT_TELEGRAM_TOAST_ID";

export function useConnectTelegram() {
  const { execute, isExecuting } = useAction(connectTelegramAction, {
    onError: ({ error }) => {
      if (error.serverError) {
        toast.error(error.serverError.message, {
          id: CONNECT_TELEGRAM_TOAST_ID,
        });

        return;
      }

      if (error.thrownError) {
        toast.error(error.thrownError.name, {
          id: CONNECT_TELEGRAM_TOAST_ID,
        });

        return;
      }

      toast.error("Something went wrong. Please try again.", {
        id: CONNECT_TELEGRAM_TOAST_ID,
      });
    },

    onExecute: () => {
      toast.loading("Generating Telegram link...", {
        id: CONNECT_TELEGRAM_TOAST_ID,
      });
    },
  });

  const onSubmit = () => {
    execute();
  };

  return {
    execute: onSubmit,
    isExecuting,
  };
}
