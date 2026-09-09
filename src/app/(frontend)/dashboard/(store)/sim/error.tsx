"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function SimError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log(error);
    }
  }, [error]);

  return (
    <section className="flex min-h-120 items-center justify-center px-6 py-16">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="size-8 text-destructive" />
        </div>

        <h2 className="font-semibold text-2xl tracking-tight">
          Something went wrong
        </h2>

        <p className="mt-3 text-muted-foreground text-sm leading-6">
          We couldn’t load the SIM cards right now. Please try again.
        </p>

        <Button className="mt-7" onClick={reset} variant="outline">
          <RefreshCw className="mr-2 size-4" />
          Try again
        </Button>
      </div>
    </section>
  );
}
