"use client";

import { useEffect } from "react";
import { useProductImageActions } from "@/modules/media/stores/product-image-store";
import type { ProductLibrary } from "@/payload-types";

interface ProductImagesHydratorProps {
  images: ProductLibrary[];
}

export function ProductImagesHydrator({ images }: ProductImagesHydratorProps) {
  const { setImages } = useProductImageActions();

  useEffect(() => {
    setImages(images);
  }, [images, setImages]);

  return null;
}
