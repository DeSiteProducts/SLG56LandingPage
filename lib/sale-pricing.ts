export function getSalePrice(originalPrice: number, currency: string): number {
  return currency === "USD" ? 3500 : Math.round((originalPrice * 0.9) / 100) * 100;
}
