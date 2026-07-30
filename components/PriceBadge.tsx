"use client";

import { useEffect, useState } from "react";

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

  return (
    <span aria-live="polite">
      {price.amount} {price.currency}
    </span>
  );
}
