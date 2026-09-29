"use client";

import { Button } from "@payloadcms/ui";
import { useConnectTelegram } from "../hooks/use-connect-telegram";

export function ConnectTelegramButton() {
  const { execute, isExecuting } = useConnectTelegram();

  const isNotReady = true;

  return (
    <div className="card">
      <Button
        buttonStyle="primary"
        disabled={isExecuting || isNotReady}
        onClick={execute}
      >
        {isExecuting ? "Connecting..." : "Connect Telegram"}
      </Button>
    </div>
  );
}
