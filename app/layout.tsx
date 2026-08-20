import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { absoluteUrl, seoDescription, seoTitle, siteUrl } from "@/lib/seo";
import "./globals.css";

const metaPixelId = "1047002958291127";
const gaId = "G-1DE15DJQNY";

export const metadata: Metadata = {
  applicationName: "DeSite Products",
  authors: [{ name: "DeSite Products" }],
  category: "Industrial Equipment",
  creator: "DeSite Products",
  formatDetection: {
    address: false,
    email: false,
    telephone: false,
  },
  metadataBase: new URL(siteUrl),
  verification: {
    google: "oizZurPdff4JP1bQ3iTCV8y42rdAI16039XRVvDfOrI",
  },
  title: {
    default: seoTitle,
    template: "%s | DeSite Products",
  },
  description: seoDescription,
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
    },
  },
  keywords: [
    "DeSite SLG 56",
    "SLG 56 mini screener",
    "mini screener",
    "mini equipment screener",
    "compact tractor screener",
    "mini excavator screener",
    "topsoil screener",
    "soil screener",
    "gravel screener",
    "landscape material screener",
  ],
  openGraph: {
    title: seoTitle,
    description: seoDescription,
    images: [
      {
        alt: "DeSite SLG 56 Mini Screener working with compact equipment",
        height: 720,
        url: absoluteUrl("/video-thumbnails/hero.webp"),
        width: 1280,
      },
    ],
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "DeSite Products",
  },
  publisher: "DeSite Products",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      follow: true,
      index: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    description: seoDescription,
    images: [absoluteUrl("/video-thumbnails/hero.webp")],
    title: seoTitle,
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  themeColor: "#1d4ed8",
  width: "device-width",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://player.vimeo.com" />
        <link rel="dns-prefetch" href="https://i.vimeocdn.com" />
        <link rel="dns-prefetch" href="https://www.youtube-nocookie.com" />
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
      </head>
      <body>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];

            function gtag(){
              dataLayer.push(arguments);
            }

            gtag('js', new Date());
            gtag('config', '${gaId}');
          `}
        </Script>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${metaPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
        {children}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      </body>
    </html>
  );
}
