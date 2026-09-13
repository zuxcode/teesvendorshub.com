/** biome-ignore-all lint/performance/noJsxPropsBind: <explanation> */
/** biome-ignore-all lint/style/noNonNullAssertion: <explanation> */
/** biome-ignore-all lint/suspicious/noLeakedRender: <explanation> */
"use client";

import {
  Heart,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export interface ProductListItem {
  badge?: string | null;
  brand?: string | null;

  category?: {
    id: string;
    name: string;
  } | null;
  compareAtPrice?: number | null;
  currency?: string;
  description?: string | null;
  id: string;

  image?: {
    url: string;
    alt?: string | null;
  } | null;

  inStock?: boolean;
  name: string;

  price: number;

  rating?: number | null;
  reviewCount?: number | null;
  slug: string;
}

interface ProductListingProps {
  categories?: {
    id: string;
    name: string;
    count?: number;
  }[];
  products: ProductListItem[];
  total?: number;
}

type SortValue = "featured" | "newest" | "price-low" | "price-high" | "rating";

function formatCurrency(amount: number, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    currency,
    maximumFractionDigits: 0,
    style: "currency",
  }).format(amount);
}

function ProductCard({ product }: { product: ProductListItem }) {
  const hasDiscount =
    product.compareAtPrice !== null &&
    (product.compareAtPrice || 0) > product.price;

  const discount = hasDiscount
    ? Math.round(
        ((product.compareAtPrice! - product.price) / product.compareAtPrice!) *
          100
      )
    : null;

  return (
    <Card className="group overflow-hidden border bg-background shadow-none transition-shadow hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.image ? (
          <Image
            alt={product.image.alt || product.name}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            fill
            sizes="
              (max-width: 640px) 50vw,
              (max-width: 1024px) 33vw,
              25vw
            "
            src={product.image.url}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
            No image
          </div>
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.badge && <Badge variant="secondary">{product.badge}</Badge>}

          {discount && <Badge variant="destructive">-{discount}%</Badge>}
        </div>

        <Button
          aria-label={`Add ${product.name} to wishlist`}
          className="absolute top-3 right-3 size-9 rounded-full opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
          size="icon"
          variant="secondary"
        >
          <Heart className="size-4" />
        </Button>
      </div>

      <CardContent className="space-y-2 p-4">
        {product.brand && (
          <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
            {product.brand}
          </p>
        )}

        <Link
          className="line-clamp-2 font-medium text-sm leading-5 hover:underline"
          href={`/products/${product.slug}`}
        >
          {product.name}
        </Link>

        {(product.rating !== null || product.reviewCount !== null) && (
          <div className="flex items-center gap-1 text-sm">
            <span className="text-amber-500">★</span>

            {product.rating !== null && (
              <span className="font-medium">{product.rating?.toFixed(1)}</span>
            )}

            {product.reviewCount !== null && (
              <span className="text-muted-foreground">
                ({product.reviewCount})
              </span>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-semibold text-base">
            {formatCurrency(product.price, product.currency)}
          </span>

          {hasDiscount && (
            <span className="text-muted-foreground text-sm line-through">
              {formatCurrency(product.compareAtPrice!, product.currency)}
            </span>
          )}
        </div>

        {product.inStock === false && (
          <p className="font-medium text-destructive text-xs">Out of stock</p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button className="w-full" disabled={product.inStock === false}>
          <ShoppingCart className="mr-2 size-4" />
          {product.inStock === false ? "Out of stock" : "Add to cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}

function FilterContent({
  categories = [],
}: {
  categories?: ProductListingProps["categories"];
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 font-semibold text-sm">Categories</h3>

        <div className="space-y-2">
          {categories.length === 0 ? (
            <p className="text-muted-foreground text-sm">No categories</p>
          ) : (
            categories.map((category) => (
              <label
                className="flex cursor-pointer items-center justify-between gap-3 text-sm"
                key={category.id}
              >
                <span className="flex items-center gap-2">
                  <input
                    className="size-4 rounded border-input"
                    type="checkbox"
                  />

                  {category.name}
                </span>

                {category.count !== null && (
                  <span className="text-muted-foreground text-xs">
                    {category.count}
                  </span>
                )}
              </label>
            ))
          )}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-3 font-semibold text-sm">Price</h3>

        <div className="space-y-2">
          {[
            ["under-10000", "Under ₦10,000"],
            ["10000-50000", "₦10,000 – ₦50,000"],
            ["50000-100000", "₦50,000 – ₦100,000"],
            ["over-100000", "Over ₦100,000"],
          ].map(([value, label]) => (
            <label
              className="flex cursor-pointer items-center gap-2 text-sm"
              key={value}
            >
              <input
                className="size-4"
                name="price"
                type="radio"
                value={value}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-3 font-semibold text-sm">Availability</h3>

        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input className="size-4 rounded border-input" type="checkbox" />
          In stock
        </label>
      </div>

      <Separator />

      <Button className="w-full" variant="outline">
        Clear filters
      </Button>
    </div>
  );
}

function ProductToolbar({ total }: { total: number }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-muted-foreground text-sm">
        {total} {total === 1 ? "product" : "products"}
      </p>

      <Select defaultValue="featured">
        <SelectTrigger className="w-[170px]">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="featured">Featured</SelectItem>

          <SelectItem value="newest">Newest</SelectItem>

          <SelectItem value="price-low">Price: Low to high</SelectItem>

          <SelectItem value="price-high">Price: High to low</SelectItem>

          <SelectItem value="rating">Highest rated</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export function ProductListing({
  products,
  categories = [],
  total = products.length,
}: ProductListingProps) {
  const [search, setSearch] = React.useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);

  const filteredProducts = React.useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return products;
    }

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(value) ||
        product.brand?.toLowerCase().includes(value) ||
        product.category?.name.toLowerCase().includes(value)
    );
  }, [products, search]);

  return (
    <main className="container mx-auto px-4 py-8 lg:py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 text-muted-foreground text-sm">
          Home / Products
        </div>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="font-bold text-3xl tracking-tight">Products</h1>

            <p className="mt-2 max-w-xl text-muted-foreground">
              Browse our collection and find the products that are right for
              you.
            </p>
          </div>

          <p className="text-muted-foreground text-sm">{total} products</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-2xl">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            className="h-11 pr-10 pl-10"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products..."
            value={search}
          />

          {search ? (
            <Button
              className="absolute top-1/2 right-1 size-9 -translate-y-1/2"
              onClick={() => setSearch("")}
              size="icon"
              variant="ghost"
            >
              <X className="size-4" />
            </Button>
          ) : null}
        </div>
      </div>

      {/* Mobile filter */}
      <div className="mb-6 flex items-center justify-between lg:hidden">
        <Sheet onOpenChange={setMobileFiltersOpen} open={mobileFiltersOpen}>
          <SheetTrigger render={<Button variant="outline" />}>
            <SlidersHorizontal className="mr-2 size-4" />
            Filters
          </SheetTrigger>

          <SheetContent className="w-[300px]" side="left">
            <SheetHeader className="mb-6">
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>

            <FilterContent categories={categories} />
          </SheetContent>
        </Sheet>

        <ProductToolbar total={filteredProducts.length} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        {/* Desktop filters */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-semibold">Filters</h2>

              <Button className="text-xs" size="sm" variant="ghost">
                Clear
              </Button>
            </div>

            <FilterContent categories={categories} />
          </div>
        </aside>

        {/* Products */}
        <section>
          <div className="mb-6 hidden lg:block">
            <ProductToolbar total={filteredProducts.length} />
          </div>

          {filteredProducts.length > 0 ? (
            <div
              className={cn(
                "grid gap-4",
                "grid-cols-2",
                "md:grid-cols-3",
                "xl:grid-cols-4"
              )}
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <div className="mb-4 rounded-full bg-muted p-4">
                <Search className="size-6 text-muted-foreground" />
              </div>

              <h2 className="font-semibold">No products found</h2>

              <p className="mt-1 max-w-sm text-muted-foreground text-sm">
                Try changing your search or clearing your filters.
              </p>

              {search ? (
                <Button
                  className="mt-5"
                  onClick={() => setSearch("")}
                  variant="outline"
                >
                  Clear search
                </Button>
              ) : null}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
