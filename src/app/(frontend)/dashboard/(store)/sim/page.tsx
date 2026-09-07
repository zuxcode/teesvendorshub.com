"use client";

import { Filter, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const products = [
  {
    country: "Nigeria",
    description:
      "Reliable 4G/5G mobile data across Nigeria with instant digital activation.",
    id: 1,
    image: "/products/nigeria-esim.png",
    price: 12.99,
    title: "Nigeria eSIM",
    type: "eSIM",
  },
  {
    country: "Nigeria",
    description:
      "Prepaid physical SIM with fast activation and dependable nationwide coverage.",
    id: 2,
    image: "/products/nigeria-sim.png",
    price: 8.99,
    title: "Nigeria Physical SIM",
    type: "Physical SIM",
  },
  {
    country: "Ghana",
    description:
      "Stay connected in Ghana with flexible data plans and instant activation.",
    id: 3,
    image: "/products/ghana-esim.png",
    price: 10.99,
    title: "Ghana eSIM",
    type: "eSIM",
  },
  {
    country: "Kenya",
    description:
      "Fast mobile data for Kenya, perfect for travel, business and everyday use.",
    id: 4,
    image: "/products/kenya-esim.png",
    price: 11.99,
    title: "Kenya eSIM",
    type: "eSIM",
  },
  {
    country: "South Africa",
    description:
      "Flexible mobile connectivity throughout South Africa with instant setup.",
    id: 5,
    image: "/products/south-africa-esim.png",
    price: 14.99,
    title: "South Africa eSIM",
    type: "eSIM",
  },
  {
    country: "United Kingdom",
    description:
      "Stay connected across the UK with affordable prepaid mobile data.",
    id: 6,
    image: "/products/uk-esim.png",
    price: 15.99,
    title: "UK eSIM",
    type: "eSIM",
  },
  {
    country: "United States",
    description:
      "Reliable mobile data across the United States with quick digital activation.",
    id: 7,
    image: "/products/usa-esim.png",
    price: 18.99,
    title: "USA eSIM",
    type: "eSIM",
  },
  {
    country: "Africa",
    description:
      "One eSIM covering multiple African destinations for seamless travel.",
    id: 8,
    image: "/products/africa-esim.png",
    price: 24.99,
    title: "Africa Regional eSIM",
    type: "eSIM",
  },
];

const countries = [...new Set(products.map((product) => product.country))];

const simTypes = [...new Set(products.map((product) => product.type))];

export default function ProductsPage() {
  const [country, setCountry] = useState("all");
  const [simType, setSimType] = useState("all");

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesCountry = country === "all" || product.country === country;

        const matchesType = simType === "all" || product.type === simType;

        return matchesCountry && matchesType;
      }),
    [country, simType]
  );

  const hasFilters = country !== "all" || simType !== "all";

  const clearFilters = () => {
    setCountry("all");
    setSimType("all");
  };

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header + Filters */}
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 font-medium text-primary text-sm">
            SIM & eSIM Store
          </p>

          <h1 className="font-bold text-3xl tracking-tight sm:text-4xl">
            Stay connected anywhere
          </h1>

          <p className="mt-2 max-w-2xl text-muted-foreground text-sm sm:text-base">
            Choose from our range of eSIMs and physical SIM cards.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 font-medium text-muted-foreground text-sm">
            <Filter className="size-4" />
            <span className="hidden sm:inline">Filter</span>
          </div>

          {/* Country */}
          <Select onValueChange={setCountry} value={country}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Country" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All countries</SelectItem>

              {countries.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* SIM Type */}
          <Select onValueChange={setSimType} value={simType}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="SIM type" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All SIM types</SelectItem>

              {simTypes.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear */}
          {hasFilters && (
            <Button
              className="gap-1.5"
              onClick={clearFilters}
              size="sm"
              variant="ghost"
            >
              <X className="size-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Showing{" "}
          <span className="font-medium text-foreground">
            {filteredProducts.length}
          </span>{" "}
          {filteredProducts.length === 1 ? "product" : "products"}
        </p>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed">
          <div className="rounded-full bg-muted p-3">
            <Filter className="size-5 text-muted-foreground" />
          </div>

          <h3 className="mt-4 font-semibold">No products found</h3>

          <p className="mt-1 text-muted-foreground text-sm">
            Try changing your filters.
          </p>

          <Button
            className="mt-4"
            onClick={clearFilters}
            size="sm"
            variant="outline"
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: (typeof products)[number] }) {
  const [selectedProduct, setSelectedProduct] = useState<
    (typeof products)[number] | null
  >(null);
  return (
    <Card className="group overflow-hidden border-border/70 bg-card py-0 transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          alt={product.title}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          fill
          src={product.image}
        />

        <Badge className="absolute top-3 left-3 bg-background/90 text-foreground shadow-sm backdrop-blur">
          {product.type}
        </Badge>
      </div>

      <CardContent className="p-4">
        <h2 className="line-clamp-1 font-semibold text-base tracking-tight">
          {product.title}
        </h2>

        <p className="mt-1.5 line-clamp-2 min-h-10 text-muted-foreground text-sm leading-5">
          {product.description}
        </p>

        {/* <Button className="h-auto px-0 mt-1 text-xs font-medium" variant="link">
          Read more
        </Button> */}

        <Button
          className="mt-1 h-auto px-0 font-medium text-xs"
          onClick={() => setSelectedProduct(product)}
          variant="link"
        >
          Read more
        </Button>

        <div className="mt-4 flex items-center justify-between border-border/60 border-t pt-3 text-xs">
          <span className="font-medium">{product.country}</span>

          <Badge className="font-normal" variant="secondary">
            {product.type}
          </Badge>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <span className="text-muted-foreground text-xs">From</span>
            <div className="font-bold text-lg">${product.price.toFixed(2)}</div>
          </div>

          <Button className="gap-2" size="sm">
            <ShoppingCart className="size-4" />
            Add to cart
          </Button>
        </div>
      </CardContent>

      <Dialog
        onOpenChange={(open) => {
          if (!open) {
            setSelectedProduct(null);
          }
        }}
        open={!!selectedProduct}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {selectedProduct.title}
                </DialogTitle>

                <DialogDescription>
                  Complete product information and specifications.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 sm:grid-cols-[220px_1fr]">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
                  <Image
                    alt={selectedProduct.title}
                    className="object-cover"
                    fill
                    src={selectedProduct.image}
                  />
                </div>

                {/* Product Information */}
                <div className="space-y-5">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Badge>{selectedProduct.type}</Badge>
                      <Badge variant="secondary">
                        {selectedProduct.country}
                      </Badge>
                    </div>

                    <p className="text-muted-foreground text-sm leading-6">
                      {selectedProduct.description}
                    </p>
                  </div>

                  {/* Product Details */}
                  <div className="rounded-xl border bg-muted/30 p-4">
                    <h3 className="mb-3 font-semibold text-sm">
                      Product details
                    </h3>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Country</p>
                        <p className="mt-1 font-medium">
                          {selectedProduct.country}
                        </p>
                      </div>

                      <div>
                        <p className="text-muted-foreground text-xs">
                          SIM type
                        </p>
                        <p className="mt-1 font-medium">
                          {selectedProduct.type}
                        </p>
                      </div>

                      <div>
                        <p className="text-muted-foreground text-xs">Network</p>
                        <p className="mt-1 font-medium">4G / 5G</p>
                      </div>

                      <div>
                        <p className="text-muted-foreground text-xs">
                          Activation
                        </p>
                        <p className="mt-1 font-medium">
                          {selectedProduct.type === "eSIM"
                            ? "Instant"
                            : "Manual"}
                        </p>
                      </div>

                      <div>
                        <p className="text-muted-foreground text-xs">
                          Coverage
                        </p>
                        <p className="mt-1 font-medium">Nationwide</p>
                      </div>

                      <div>
                        <p className="text-muted-foreground text-xs">
                          Starting price
                        </p>
                        <p className="mt-1 font-semibold text-primary">
                          ${selectedProduct.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="mb-3 font-semibold text-sm">Features</h3>

                    <ul className="grid gap-2 text-sm sm:grid-cols-2">
                      <li className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-primary" />
                        4G / 5G mobile data
                      </li>

                      <li className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-primary" />
                        Reliable network coverage
                      </li>

                      <li className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-primary" />
                        Prepaid connectivity
                      </li>

                      <li className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-primary" />
                        No long-term contract
                      </li>

                      {selectedProduct.type === "eSIM" && (
                        <li className="flex items-center gap-2">
                          <span className="size-1.5 rounded-full bg-primary" />
                          Instant digital delivery
                        </li>
                      )}

                      {selectedProduct.type === "Physical SIM" && (
                        <li className="flex items-center gap-2">
                          <span className="size-1.5 rounded-full bg-primary" />
                          Physical delivery
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between gap-4 border-t pt-5">
                    <div>
                      <p className="text-muted-foreground text-xs">
                        Starting from
                      </p>

                      <p className="font-bold text-2xl">
                        ${selectedProduct.price.toFixed(2)}
                      </p>
                    </div>

                    <Button className="gap-2">
                      <ShoppingCart className="size-4" />
                      Add to cart
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
