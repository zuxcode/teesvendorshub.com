export interface ProductCardData {
  badges?: string[] | null;
  category?: unknown;
  currency: string;
  description?: string | null;
  id: string;
  name: string;
  priceKobo: number;
  productImage: unknown;
  status: string;
  stock: number;
}

export type RelationTo = "sim" | "gift" | "product";

export interface ProductCardProps<T extends ProductCardData> {
  data: T;
  relationTo: RelationTo;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}
export interface ProductDialogProps<T extends ProductCardData>
  extends Pick<ProductCardProps<T>, "setSelectedId"> {
  data: T | undefined;
}
