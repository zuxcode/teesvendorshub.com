"use client";

import { useEffect } from "react";

import type { ProductLibrary } from "@/payload-types";
import { useProductImageActions } from "@/stores/product-image-store";

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
