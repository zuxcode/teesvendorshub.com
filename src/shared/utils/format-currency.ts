export function formatCurrency(
  amount: number,
  options: Intl.NumberFormatOptions & {
    currency?: string;
    locale?: string;
  } = {}
) {
  const { currency = "NGN", locale = "en-NG", ...numberOptions } = options;

  return new Intl.NumberFormat(locale, {
    currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "currency",
    ...numberOptions,
  }).format(amount);
}
