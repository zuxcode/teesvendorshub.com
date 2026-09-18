"use client";

import { useEffect } from "react";

import type { Category, Product } from "@/payload-types";

import { useCategoryActions } from "@/stores/category-store";
import { useProductActions } from "@/stores/product-store";

interface ProductsStoreBoundaryProps {
  categories: Category[];
  children: React.ReactNode;
  products: Product[];
}

export function ProductsStoreBoundary({
  products,
  categories,
  children,
}: ProductsStoreBoundaryProps) {
  const { setProducts } = useProductActions();
  const { setCategories } = useCategoryActions();

  useEffect(() => {
    setProducts(products);
    setCategories(categories);
  }, [products, categories, setProducts, setCategories]);

  return children;
}
