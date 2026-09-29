import { FeaturedProduct } from "@/modules/homepage/featured-product";
import HeroSection from "@/modules/homepage/hero";
import { ProductCategories } from "@/modules/homepage/product-categories";
import { AppFooter } from "@/shared/layout/footer/app-footer";
import { SiteNavbar } from "@/shared/layout/nav-bar";

export default function HomePage() {
  return (
    <>
      <SiteNavbar />
      <HeroSection />

      <ProductCategories />
      <FeaturedProduct />
      <AppFooter />
    </>
  );
}
