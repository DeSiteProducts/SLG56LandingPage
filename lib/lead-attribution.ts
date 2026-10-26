export const leadSources = [
  "Facebook", "Instagram", "Google Ads", "Google", "Direct / Unknown", "Other",
] as const;

export type LeadSource = (typeof leadSources)[number];
export type LeadAttribution = {
  leadSource: LeadSource;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
};

export function normalizeAttribution(value: unknown): LeadAttribution {
  const data = value && typeof value === "object"
    ? value as Record<string, unknown> : {};
  const text = (key: string) => typeof data[key] === "string"
    ? data[key].replace(/[\r\n\t]/g, " ").trim().slice(0, 200) : "";

  return {
    leadSource: leadSources.includes(data.leadSource as LeadSource)
      ? data.leadSource as LeadSource : "Direct / Unknown",
    utmSource: text("utmSource"),
    utmMedium: text("utmMedium"),
    utmCampaign: text("utmCampaign"),
  };
}

export function detectAttribution(href: string, referrer: string): LeadAttribution {
  const url = new URL(href);
  const params = url.searchParams;
  const source = (params.get("utm_source") ?? "").trim().toLowerCase();
  const medium = (params.get("utm_medium") ?? "").trim().toLowerCase();
  let leadSource: LeadSource = "Direct / Unknown";
  let referrerHost = "";
  try {
    const referringUrl = new URL(referrer);
    if (referringUrl.origin !== url.origin) referrerHost = referringUrl.hostname;
  } catch { /* No usable referrer. */ }
  const from = (domain: string) => referrerHost === domain || referrerHost.endsWith(`.${domain}`);

  if (["gclid", "gbraid", "wbraid"].some((key) => params.get(key)?.trim())) {
    leadSource = "Google Ads";
  } else if (["facebook", "fb"].includes(source)) {
    leadSource = "Facebook";
  } else if (["instagram", "ig"].includes(source)) {
    leadSource = "Instagram";
  } else if (["google_ads", "googleads", "google-ads", "adwords"].includes(source)) {
    leadSource = "Google Ads";
  } else if (source === "google") {
    leadSource = ["cpc", "ppc", "paid", "paid_search", "paidsearch", "display", "cpm"].includes(medium)
      ? "Google Ads" : "Google";
  } else if (source) {
    leadSource = "Other";
  } else if (from("instagram.com")) {
    leadSource = "Instagram";
  } else if (from("facebook.com") || from("fb.com")) {
    leadSource = "Facebook";
  } else if (/^(?:[a-z0-9-]+\.)*google\.(?:com|[a-z]{2}|com\.[a-z]{2}|co\.[a-z]{2})$/.test(referrerHost)) {
    leadSource = "Google";
  } else if (referrerHost) {
    leadSource = "Other";
  }

  return normalizeAttribution({
    leadSource,
    utmSource: params.get("utm_source"),
    utmMedium: params.get("utm_medium"),
    utmCampaign: params.get("utm_campaign"),
  });
}

// Keep the first arrival in this tab across reloads; storage is optional.
export function captureAttribution(): LeadAttribution {
  const key = "slg56:lead-attribution:v1";
  try {
    const saved = window.sessionStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && leadSources.includes(parsed.leadSource)) return normalizeAttribution(parsed);
    }
  } catch { /* Storage can be blocked or malformed. */ }

  const attribution = detectAttribution(window.location.href, document.referrer);
  try {
    window.sessionStorage.setItem(key, JSON.stringify(attribution));
  } catch { /* The form still works without browser storage. */ }
  return attribution;
}
