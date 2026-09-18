export interface TaxRule {
  amount?: number | null;
  rate?: number | null;
  type: "percentage" | "fixed";
}

export function getTaxAmount(taxableAmount: number, taxRule: TaxRule): number {
  if (taxableAmount <= 0) {
    return 0;
  }

  if (taxRule.type === "percentage") {
    const rate = taxRule.rate ?? 0;

    return roundMoney(taxableAmount * (rate / 100));
  }

  if (taxRule.type === "fixed") {
    return roundMoney(taxRule.amount ?? 0);
  }

  return 0;
}

function roundMoney(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}
