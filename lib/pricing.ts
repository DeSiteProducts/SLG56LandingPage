type HeadersLike = {
  get(name: string): string | null;
};

type VisitorPrice = {
  amount: string;
  countryCode: "CA" | "US";
  countryLabel: string;
  currency: "CAD" | "USD";
};

const countryHeaderNames = [
  "cf-ipcountry",
  "x-vercel-ip-country",
  "x-country-code",
  "x-geo-country",
  "cloudfront-viewer-country",
  "x-appengine-country",
];

const pricingByCountry: Record<VisitorPrice["countryCode"], VisitorPrice> = {
  CA: {
    amount: "$4,700",
    countryCode: "CA",
    countryLabel: "Canada",
    currency: "CAD",
  },
  US: {
    amount: "$4,500",
    countryCode: "US",
    countryLabel: "United States",
    currency: "USD",
  },
};

function getCountryCode(headersList: HeadersLike) {
  const countryHeader = countryHeaderNames
    .map((headerName) => headersList.get(headerName))
    .find((value) => value && value.trim().length > 0);

  return countryHeader?.trim().slice(0, 2).toUpperCase();
}

export function getPriceForRequest(headersList: HeadersLike): VisitorPrice {
  const countryCode = getCountryCode(headersList);

  if (countryCode === "CA") {
    return pricingByCountry.CA;
  }

  return pricingByCountry.US;
}
