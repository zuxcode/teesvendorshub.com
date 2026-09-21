"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function CheckoutReturnToPreviousPage() {
  const router = useRouter();

  return (
    <Button className="-ml-2" onClick={router.back} size="sm" variant="ghost">
      <ArrowLeft className="mr-2 size-4" />
      Continue shopping
    </Button>
  );
}
