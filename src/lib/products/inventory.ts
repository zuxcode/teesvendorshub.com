export const LOW_STOCK_THRESHOLD = 5;

export function getProductInventoryState(stock: number) {
  if (!Number.isInteger(stock) || stock < 0) {
    throw new Error("Invalid stock");
  }

  return {
    isInStock: stock > 0,
    isLowStock: stock > 0 && stock <= LOW_STOCK_THRESHOLD,
    isOutOfStock: stock === 0,
  };
}

export function getLineTotal(price: number, quantity: number) {
  if (!Number.isFinite(price) || price < 0) {
    throw new Error("Invalid price");
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("Invalid quantity");
  }

  return price * quantity;
}
