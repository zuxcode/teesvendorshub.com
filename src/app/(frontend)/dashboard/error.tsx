"use client";

import { captureException } from "@sentry/nextjs";
import { CircleAlert, RefreshCw } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    captureException(error, {
      tags: {
        errorDigest: error.digest,
      },
    });
  }, [error]);

  return (
    <Card className="border-dashed shadow-none">
      <CardContent className="flex min-h-105 flex-col items-center justify-center px-6 py-12 text-center">
        <div
          aria-hidden="true"
          className="mb-6 flex size-16 items-center justify-center rounded-full bg-destructive/10"
        >
          <CircleAlert className="size-8 text-destructive" />
        </div>

        <CardTitle className="text-xl">Something went wrong</CardTitle>

        <CardDescription className="mt-2 max-w-md text-sm leading-6">
          We couldn't load this page right now. Please try again in a moment.
        </CardDescription>

        <Button
          className="mt-6 gap-2"
          onClick={reset}
          type="button"
          variant="outline"
        >
          <RefreshCw className="size-4" />
          Try again
        </Button>
      </CardContent>
    </Card>
  );
}
