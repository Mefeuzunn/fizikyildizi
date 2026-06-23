import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google"; // Switch to Outfit as per user request
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import GlobalLayoutWrapper from "@/components/GlobalLayoutWrapper";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});


export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://kalkula.com.tr"),
  title: {
    default: "Kalkula | Türkiye'nin En Kapsamlı Hesaplama Platformu",
    template: "%s | Kalkula"
  },
  description: "Kalkula ile finans, eğitim, health, vergi ve daha fazlasını kapsayan 60+ ücretsiz hesaplama aracı, not defteri, takvim ve belge dönüştürücü tek platformda.",
  keywords: ["hesaplama", "hesap makinesi", "kredi hesaplama", "vergi hesaplama", "kalkula", "birim dönüştürücü"],
  manifest: "/manifest.json",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Kalkula | Türkiye'nin En Kapsamlı Hesaplama Platformu",
    description: "160+ profesyonel hesaplama aracı tek platformda.",
    url: "https://kalkula.com.tr",
    siteName: "Kalkula",
    locale: "tr_TR",
    type: "website",
  },
};

import { TimerProvider } from "@/context/TimerContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Kalkula",
    "url": "https://kalkula.com.tr",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://kalkula.com.tr/ara?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html
      lang="tr"
      className={`${outfit.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1249009698882112"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <TimerProvider>
            <GlobalLayoutWrapper>
              {children}
            </GlobalLayoutWrapper>
          </TimerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
