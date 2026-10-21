import { ShoppingCart } from "lucide-react";

export function CartEmpty() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <ShoppingCart className="mx-auto mb-3 size-10 text-muted-foreground" />

        <p className="font-medium">Your cart is empty</p>

        <p className="mt-1 text-muted-foreground text-sm">
          Add some products to get started.
        </p>
      </div>
    </div>
  );
}
