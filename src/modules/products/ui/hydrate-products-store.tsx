"use client";

import { useEffect } from "react";
import { useProductActions } from "@/modules/products/store/product-store";
import type { Product } from "@/payload-types";

interface ProductsStoreBoundaryProps {
  products: Product[];
}

export function HydrateProductsStore({ products }: ProductsStoreBoundaryProps) {
  const { setProducts } = useProductActions();

  useEffect(() => {
    setProducts(products);
  }, [products, setProducts]);

  return null;
}
