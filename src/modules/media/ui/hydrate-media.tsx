"use client";

import { useEffect } from "react";
import { useProductImageActions } from "@/modules/media/stores/product-image-store";
import type { ProductLibrary } from "@/payload-types";

interface Props {
  media: ProductLibrary[];
}

export function HydrateMediaStore({ media }: Props) {
  const { setImages } = useProductImageActions();

  useEffect(() => {
    setImages(media);
  }, [media, setImages]);

  return null;
}
