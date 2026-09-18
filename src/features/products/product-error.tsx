"use client";

import { CircleAlert, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

interface ProductStoreErrorProps {
  description?: string;
  title?: string;
}

export function ProductStoreError({
  title = "Unable to load products",
  description = "We couldn't load the products right now. Please try again in a moment.",
}: ProductStoreErrorProps) {
  const router = useRouter();

  return (
    <Card className="border-dashed shadow-none">
      <CardContent className="flex min-h-105 flex-col items-center justify-center px-6 py-12 text-center">
        <div
          aria-hidden="true"
          className="mb-6 flex size-16 items-center justify-center rounded-full bg-destructive/10"
        >
          <CircleAlert className="size-8 text-destructive" />
        </div>

        <CardTitle className="text-xl">{title}</CardTitle>

        <CardDescription className="mt-2 max-w-md text-sm leading-6">
          {description}
        </CardDescription>

        <Button
          className="mt-6 gap-2"
          onClick={router.refresh}
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
