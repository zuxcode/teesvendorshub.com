import { FeaturedProduct } from "@/modules/homepage/ui/featured-product";
import { HeroSection } from "@/modules/homepage/ui/hero/hero";
import { ProductCategories } from "@/modules/homepage/ui/product-categories";
import { AppFooter } from "@/shared/layout/footer/app-footer";

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <ProductCategories />
      <FeaturedProduct />
      <AppFooter />
    </>
  );
}
