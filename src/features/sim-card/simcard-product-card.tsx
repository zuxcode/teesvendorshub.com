// "use client";

// import Image from "next/image";
// import { ImagePlaceholder } from "@/components/tees-ui/image-placeholder";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent } from "@/components/ui/card";
// import { formatCurrency } from "@/lib/format-currency";
// import type { DocumentId } from "@/lib/types";
// import { useCartItemQuantity } from "@/stores/cart-store";
// import { useProductImageActions } from "@/stores/product-image-store";
// import { useSimCard, useSimCardActions } from "@/stores/sim-card-store";
// import { AddToCartButton } from "../cart/add-to-cart";
// import { SimCardProductDetailDialog } from "./product-detail-dialog";

// interface Props {
//   productId: DocumentId;
// }

// export function SimCardProductCard({ productId }: Props) {
//   const simCardProduct = useSimCard(productId);
//   const { setSelectedSimcardId } = useSimCardActions();
//   const { getImageById } = useProductImageActions();
//   const quantity = useCartItemQuantity(productId);

//   if (!simCardProduct) {
//     return null;
//   }

//   const imageId =
//     typeof simCardProduct?.productImage === "object"
//       ? simCardProduct?.productImage.id
//       : simCardProduct?.productImage;

//   const image = imageId ? getImageById(imageId) : undefined;

//   const SIM_TYPE = simCardProduct?.type.replace("_", " ");

//   return (
//     <Card
//       className="group overflow-hidden border-border/70 bg-card py-0 transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
//       // biome-ignore lint/performance/noJsxPropsBind: <Soft>
//       onClick={(e) => {
//         setSelectedSimcardId(productId);
//       }}
//     >
//       <div className="relative aspect-4/3 overflow-hidden bg-muted">
//         {image?.sizes?.card?.url ? (
//           <Image
//             alt={image?.alt}
//             className="object-cover transition-transform duration-300 group-hover:scale-105"
//             fill
//             src={image?.sizes?.card?.url}
//           />
//         ) : (
//           <ImagePlaceholder />
//         )}

//         <Badge className="absolute top-3 left-3 bg-background/90 text-foreground capitalize shadow-sm backdrop-blur">
//           {SIM_TYPE}
//         </Badge>
//         {quantity ? (
//           <Badge className="absolute top-3 right-3 bg-background/90 text-foreground shadow-sm backdrop-blur">
//             {quantity}
//           </Badge>
//         ) : null}
//       </div>

//       <CardContent className="p-4">
//         <h2 className="line-clamp-1 font-semibold text-base tracking-tight">
//           {simCardProduct?.name}
//         </h2>

//         <p className="mt-1.5 line-clamp-2 min-h-10 text-muted-foreground text-sm leading-5">
//           {simCardProduct?.description}
//         </p>

//         {/* <Button
//           className="mt-1 h-auto px-0 font-medium text-xs"
//           // biome-ignore lint/performance/noJsxPropsBind: <Soft>
//           onClick={() => setSelectedSimcardId(productId)}
//           variant="link"
//         >
//           Read more
//         </Button> */}

//         <div className="mt-4 flex items-center justify-between border-border/60 border-t pt-3 text-xs">
//           <span className="font-medium">{simCardProduct?.country}</span>

//           <Badge className="font-normal" variant="secondary">
//             {SIM_TYPE}
//           </Badge>
//         </div>

//         <div className="mt-4 flex items-center justify-between gap-3">
//           <div>
//             <span className="text-muted-foreground text-xs">Price</span>
//             <div className="font-bold text-lg">
//               {formatCurrency(simCardProduct?.price)}
//             </div>
//           </div>

//           <AddToCartButton productId={simCardProduct.id} />
//         </div>
//       </CardContent>
//       <SimCardProductDetailDialog />
//     </Card>
//   );
// }

"use client";

import Image from "next/image";
import { useCallback } from "react";
import { ImagePlaceholder } from "@/components/tees-ui/image-placeholder";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/format-currency";
import type { DocumentId } from "@/lib/types";
import { useCartItemQuantity } from "@/stores/cart-store";
import { useProductImage } from "@/stores/product-image-store";
import { useSimCard, useSimCardActions } from "@/stores/sim-card-store";
import { AddToCartButton } from "../cart/add-to-cart";
import { SimCardProductDetailDialog } from "./product-detail-dialog";

interface Props {
  productId: DocumentId;
}

export function SimCardProductCard({ productId }: Props) {
  const simCardProduct = useSimCard(productId);
  const quantity = useCartItemQuantity(productId);

  const { setSelectedSimcardId } = useSimCardActions();

  const handleProductSelect = useCallback(() => {
    setSelectedSimcardId(productId);
  }, [productId, setSelectedSimcardId]);

  const imageId =
    typeof simCardProduct?.productImage === "object"
      ? simCardProduct?.productImage.id
      : simCardProduct?.productImage;

  const image = useProductImage(imageId);

  if (!simCardProduct) {
    return null;
  }

  const simType = simCardProduct.type.replaceAll("_", " ");

  return (
    <Card className="group overflow-hidden border-border/70 bg-card py-0 transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
      <CardHeader onClick={handleProductSelect}>
        <div className="relative aspect-4/3 overflow-hidden bg-muted">
          {image?.sizes?.card?.url ? (
            <Image
              alt={image.alt ?? simCardProduct.name}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              fill
              src={image.sizes.card.url}
            />
          ) : (
            <ImagePlaceholder className="size-full rounded-none" />
          )}

          <Badge className="absolute top-3 left-3 bg-background/90 text-foreground capitalize shadow-sm backdrop-blur">
            {simType}
          </Badge>

          {quantity > 0 && (
            <Badge className="absolute top-3 right-3 bg-background/90 text-foreground shadow-sm backdrop-blur">
              {quantity}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4" onClick={handleProductSelect}>
        <h2 className="line-clamp-1 font-semibold text-base tracking-tight">
          {simCardProduct.name}
        </h2>
        <p className="mt-1.5 line-clamp-2 min-h-10 text-muted-foreground text-sm leading-5">
          {simCardProduct.description}
        </p>
        Read more
      </CardContent>

      <CardFooter className="flex flex-col items-stretch gap-4 border-border/60 border-t p-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium">{simCardProduct.country}</span>

          <Badge className="font-normal" variant="secondary">
            {simType}
          </Badge>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-muted-foreground text-xs">Price</span>

            <div className="font-bold text-lg">
              {formatCurrency(simCardProduct.price)}
            </div>
          </div>

          <AddToCartButton productId={productId} />
        </div>
      </CardFooter>

      <SimCardProductDetailDialog />
    </Card>
  );
}
