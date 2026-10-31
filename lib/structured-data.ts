import { featureVideos, seoFaqs } from "@/lib/site-data";
import { absoluteUrl, productName, seoDescription, seoTitle, siteUrl } from "@/lib/seo";

const organizationId = `${siteUrl}/#organization`;
const productId = `${siteUrl}/#product`;
const webPageId = `${siteUrl}/#webpage`;

const vimeoVideos = [
  {
    description:
      "Overview of the DeSite SLG 56 Mini Screener for compact equipment and small job sites.",
    duration: 75,
    embedUrl: "https://player.vimeo.com/video/1006286529",
    id: "1006286529",
    name: "SLG 56 Towable Spring Loaded Grizzly | Overview",
    thumbnailSrc: "/video-thumbnails/hero.webp",
    uploadDate: "2024-09-04",
  },
  ...featureVideos.map((video) => ({
    description: video.description,
    duration:
      video.vimeoId === "965551564"
        ? 44
        : video.vimeoId === "967214871"
          ? 39
          : video.vimeoId === "965558331"
            ? 28
            : 39,
    embedUrl: `https://player.vimeo.com/video/${video.vimeoId}`,
    id: video.vimeoId,
    name: video.title,
    thumbnailSrc: video.thumbnailSrc,
    uploadDate:
      video.vimeoId === "965551564"
        ? "2024-06-22"
        : video.vimeoId === "967214871"
          ? "2024-06-24"
          : video.vimeoId === "965558331"
            ? "2024-06-22"
            : "2024-06-28",
  })),
];

function toIsoDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `PT${minutes > 0 ? `${minutes}M` : ""}${remainingSeconds}S`;
}

export function getStructuredData() {
  return [
    {
      "@context": "https://schema.org",
      "@id": organizationId,
      "@type": "Organization",
      contactPoint: [
        {
          "@type": "ContactPoint",
          areaServed: ["US", "CA"],
          availableLanguage: ["en"],
          contactType: "sales",
          email: "sales@desiteproducts.com",
          telephone: "+1-806-500-3915",
        },
      ],
      name: "DeSite Products",
      url: siteUrl,
    },
    {
      "@context": "https://schema.org",
      "@id": `${siteUrl}/#website`,
      "@type": "WebSite",
      inLanguage: "en-US",
      name: "DeSite Products",
      publisher: {
        "@id": organizationId,
      },
      url: siteUrl,
    },
    {
      "@context": "https://schema.org",
      "@id": webPageId,
      "@type": "WebPage",
      about: {
        "@id": productId,
      },
      dateModified: new Date().toISOString(),
      description: seoDescription,
      inLanguage: "en-US",
      isPartOf: {
        "@id": `${siteUrl}/#website`,
      },
      name: seoTitle,
      primaryImageOfPage: absoluteUrl("/video-thumbnails/hero.webp"),
      url: siteUrl,
    },
    {
      "@context": "https://schema.org",
      "@id": productId,
      "@type": "Product",
      additionalProperty: [
        {
          "@type": "PropertyValue",
          name: "Machine width",
          value: "74 inches",
        },
        {
          "@type": "PropertyValue",
          name: "Machine height",
          value: "61.4 inches",
        },
        {
          "@type": "PropertyValue",
          name: "Screen deck width",
          value: "63 inches",
        },
        {
          "@type": "PropertyValue",
          name: "Screen deck length",
          value: "66 inches",
        },
        {
          "@type": "PropertyValue",
          name: "Total weight",
          value: "882 lbs",
        },
      ],
      brand: {
        "@type": "Brand",
        name: "DeSite Products",
      },
      category: "Mini equipment screener",
      description: seoDescription,
      image: [
        absoluteUrl("/video-thumbnails/hero.webp"),
        absoluteUrl("/tractor-optimized.webp"),
        absoluteUrl("/excavator-optimized.webp"),
      ],
      name: productName,
      offers: [
        {
          "@type": "Offer",
          areaServed: "US",
          itemCondition: "https://schema.org/NewCondition",
          price: "3500",
          priceCurrency: "USD",
          seller: {
            "@id": organizationId,
          },
          url: siteUrl,
        },
        {
          "@type": "Offer",
          areaServed: "CA",
          itemCondition: "https://schema.org/NewCondition",
          price: "4200",
          priceCurrency: "CAD",
          seller: {
            "@id": organizationId,
          },
          url: siteUrl,
        },
      ],
      url: siteUrl,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: seoFaqs.map((faq) => ({
        "@type": "Question",
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
        name: faq.question,
      })),
    },
    ...vimeoVideos.map((video) => ({
      "@context": "https://schema.org",
      "@type": "VideoObject",
      description: video.description,
      duration: toIsoDuration(video.duration),
      embedUrl: video.embedUrl,
      name: video.name,
      thumbnailUrl: [absoluteUrl(video.thumbnailSrc)],
      uploadDate: video.uploadDate,
    })),
  ];
}
