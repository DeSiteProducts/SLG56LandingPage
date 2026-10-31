"use client";

import { useEffect, useState } from "react";
import { getSalePrice } from "@/lib/sale-pricing";

type Price = {
  amount: string;
  currency: string;
};

type PriceBadgeProps = {
  initialPrice: Price;
};

export function PriceBadge({ initialPrice }: PriceBadgeProps) {
  const [price, setPrice] = useState(initialPrice);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/pricing", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: Price | null) => {
        if (isMounted && data?.amount && data.currency) {
          setPrice(data);
        }
      })
      .catch(() => {
        // Keep the default price if location detection is unavailable.
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const originalPrice = Number(price.amount.replace(/[^0-9.]/g, ""));
  const salePrice = getSalePrice(originalPrice, price.currency);

  return (
    <span aria-live="polite" className="flex flex-col items-center gap-1">
      <span>
        <span className="sr-only">Sale price: </span>
        ${salePrice.toLocaleString("en-US")} {price.currency}
      </span>
      <span className="text-base font-medium text-white/80 sm:text-xl">
        <span className="sr-only">Original price: </span>
        <del>{price.amount} {price.currency}</del>
      </span>
    </span>
  );
}
