import { FeaturedProduct } from "@/modules/homepage/ui/featured-product";
import { HeroSection } from "@/modules/homepage/ui/hero/hero";
import { ProductCategories } from "@/modules/homepage/ui/product-categories";
import { AppFooter } from "@/shared/layout/footer/app-footer";
// import { SiteNavbar } from "@/shared/layout/nav-bar";

export default function HomePage() {
  return (
    <>
      {/* <SiteNavbar /> */}
      <HeroSection />

      <ProductCategories />
      <FeaturedProduct />
      <AppFooter />
    </>
  );
}
