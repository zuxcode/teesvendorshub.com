import { FeaturedProduct } from "@/modules/homepage/featured-product";
// import HeroSection from "@/modules/homepage/hero";
import { LandingHero } from "@/modules/homepage/hero-2";
import { ProductCategories } from "@/modules/homepage/product-categories";
import { AppFooter } from "@/shared/layout/footer/app-footer";
// import { SiteNavbar } from "@/shared/layout/nav-bar";

export default function HomePage() {
  return (
    <>
      {/* <SiteNavbar /> */}
      <LandingHero />
      {/* <HeroSection /> */}

      <ProductCategories />
      <FeaturedProduct />
      <AppFooter />
    </>
  );
}
