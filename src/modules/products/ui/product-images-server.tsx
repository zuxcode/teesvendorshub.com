import { getProductImages } from "@/lib/services/get-product-images";
import { ProductImagesHydrator } from "./product-images-hydrator";

export async function ProductImagesServer() {
  const { docs } = await getProductImages();

  return <ProductImagesHydrator images={docs} />;
}
