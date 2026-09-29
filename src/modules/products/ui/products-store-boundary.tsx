"use client";

import { useEffect } from "react";
import { useCategoryActions } from "@/modules/category/stores/category-store";
import { useProductActions } from "@/modules/products/stores/product-store";
import type { Category, Product } from "@/payload-types";

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
