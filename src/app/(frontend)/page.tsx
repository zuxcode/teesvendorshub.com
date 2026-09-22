import "@/lib/styles/homepage.css";
import { FeaturedProduct } from "@/features/homepage/featured-product";
import HeroSection from "@/features/homepage/hero";
import { ProductCategories } from "@/features/homepage/product-categories";
import { AppFooter } from "@/layout/footer/app-footer";
import { SiteNavbar } from "@/layout/nav-bar";

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
