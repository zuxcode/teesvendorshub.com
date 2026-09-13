import { ProductListing } from "@/features/products";
import { getProduct } from "@/lib/services/get-product";

const products = [
  {
    badge: "Popular",
    brand: "Apple",
    category: {
      id: "phones",
      name: "Phones",
    },
    compareAtPrice: 950_000,
    currency: "NGN",
    id: "1",
    image: {
      alt: "iPhone 15",
      url: "/images/products/iphone-15.jpg",
    },
    inStock: true,
    name: "iPhone 15",
    price: 850_000,
    rating: 4.8,
    reviewCount: 124,
    slug: "iphone-15",
  },

  {
    brand: "Samsung",
    category: {
      id: "phones",
      name: "Phones",
    },
    currency: "NGN",
    id: "2",
    image: {
      alt: "Samsung Galaxy S24",
      url: "/images/products/samsung-s24.jpg",
    },
    inStock: true,
    name: "Samsung Galaxy S24",
    price: 780_000,
    rating: 4.7,
    reviewCount: 86,
    slug: "samsung-galaxy-s24",
  },
];

const categories = [
  {
    count: 32,
    id: "phones",
    name: "Phones",
  },
  {
    count: 48,
    id: "accessories",
    name: "Accessories",
  },
  {
    count: 24,
    id: "electronics",
    name: "Electronics",
  },
];

export default async function ProductsPage() {
  const { docs } = await getProduct();

  console.log(docs);

  return (
    <ProductListing
      categories={categories}
      products={products}
      total={products.length}
    />
  );
}
