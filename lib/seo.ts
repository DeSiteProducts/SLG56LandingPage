export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://desiteproducts.com").replace(
  /\/$/,
  "",
);

export const productName = "DeSite SLG 56 Mini Screener";

export const seoTitle = "DeSite SLG 56 Mini Screener | Mini Equipment Soil Screener";

export const seoDescription =
  "The DeSite SLG 56 Mini Screener is a compact screening solution for mini equipment, compact tractors, mini excavators, landscapers, property owners and small job sites.";

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
