import "@/lib/styles/homepage.css";
import { FeaturedProduct } from "@/features/homepage/featured-product";
import HeroSection from "@/features/homepage/hero";
import { ProductCategories } from "@/features/homepage/product-categories";

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <ProductCategories />
      <FeaturedProduct />
    </>
  );
}
