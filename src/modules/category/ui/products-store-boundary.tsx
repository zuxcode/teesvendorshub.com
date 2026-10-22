"use client";

import { useEffect } from "react";
import { useCategoryActions } from "@/modules/category/stores/category-store";
import type { Category } from "@/payload-types";

interface Props {
  categories: Category[];
}

export function HydrateCategoryStore({ categories }: Props) {
  const { setCategories } = useCategoryActions();

  useEffect(() => {
    setCategories(categories);
  }, [categories, setCategories]);

  return null;
}
