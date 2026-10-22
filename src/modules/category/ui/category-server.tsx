import { payload } from "@/shared/payload/utils/payload";
import { CategoryRepository } from "../repository/category.repository";
import { HydrateCategoryStore } from "./products-store-boundary";

const categoryRepository = new CategoryRepository(payload);

export async function CategoryServer() {
  const categories = await categoryRepository.findAllActive();

  return <HydrateCategoryStore categories={categories} />;
}
