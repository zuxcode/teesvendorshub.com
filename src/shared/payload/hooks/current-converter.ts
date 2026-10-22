import type { FieldHook } from "payload";

export const nairaToKobo: FieldHook = ({ value }) => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return value;
  }

  const priceKobo = Math.round(value * 100);

  if (!Number.isSafeInteger(priceKobo) || priceKobo < 0) {
    return value;
  }

  return priceKobo;
};

export const koboToNaira: FieldHook = ({ value }) => {
  if (typeof value !== "number") {
    return value;
  }

  return value / 100;
};
