import { businessConfig } from "./business-config";

const { market } = businessConfig;

export function formatPrice(amount: number): string {
  const formatted = amount.toFixed(2).replace(/\.?0+$/, "");
  return `${formatted} ${market.currencySymbol}`;
}

export function formatStartingPrice(amount: number): string {
  return `يبدأ من ${formatPrice(amount)}`;
}

export function getSavings(offer: {
  price: number;
  compareAtPrice?: number;
}): number | null {
  if (!offer.compareAtPrice || offer.compareAtPrice <= offer.price) {
    return null;
  }
  return offer.compareAtPrice - offer.price;
}

export function formatSavings(offer: {
  price: number;
  compareAtPrice?: number;
}): string | null {
  const savings = getSavings(offer);
  return savings ? `وفّري ${formatPrice(savings)}` : null;
}

export function formatCtaLabel(
  product: { shortName: string },
  offer: { price: number }
): string {
  return `ابدئي ${product.shortName} الآن · ${formatPrice(offer.price)}`;
}

export function formatCtaShort(product: { shortName: string }): string {
  return `ابدئي ${product.shortName} الآن`;
}
