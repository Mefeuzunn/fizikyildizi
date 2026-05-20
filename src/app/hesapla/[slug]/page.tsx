import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { getCalculatorBySlug, getCategoryBySlug, calculators, categories } from "@/data/calculators";
import { CalculatorWidget } from "@/components/CalculatorClient";
import { CalculatorGuide } from "@/components/CalculatorGuide";
import { Breadcrumb } from "@/components/Breadcrumb";
import { LeftSidebar } from "@/components/LeftSidebar";
import { RightSidebarAds } from "@/components/RightSidebarAds";
import { AdPlaceholder } from "@/components/AdPlaceholder";
import { getGuideBySlug } from "@/data/calculator-guides";
import {
  generateWebApplicationSchema,
  generateFAQPageSchema,
  generateBreadcrumbSchema,
  buildCalculatorBreadcrumbs,
} from "@/lib/seo-schemas";

type Props = {
  params: Promise<{ slug: string }>;
};

// SEO için Dinamik Metadata Oluşturma
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const calc = getCalculatorBySlug(slug);

  if (!calc) {
    return {
      title: "Araç Bulunamadı | Kalkula",
    };
  }

  const category = getCategoryBySlug(calc.categoryId);

  return {
    title: `${calc.title} Hesaplama`,
    description: calc.description,
    alternates: {
      canonical: `https://kalkula.com.tr/hesapla/${slug}`,
    },
    openGraph: {
      title: `${calc.title} | Kalkula`,
      description: calc.description,
      url: `https://kalkula.com.tr/hesapla/${slug}`,
    },
    keywords: [
      calc.title,
      "hesaplama",
      "hesap makinesi",
      ...(category ? [category.name, `${category.name} hesaplama`] : []),
      "kalkula",
    ],
  };
}

// Statik Parametre Üretimi (SSG)
export async function generateStaticParams() {
  return calculators.map((calc) => ({
    slug: calc.slug,
  }));
}

export default async function CalculatorPage({ params }: Props) {
  const { slug } = await params;
  const calc = getCalculatorBySlug(slug);
  const category = calc ? (getCategoryBySlug(calc.categoryId) ?? null) : null;

  if (!calc) {
    return (
      <div className="container" style={{ padding: "4rem 1rem", textAlign: "center" }}>
        <h2>Hesaplama aracı bulunamadı.</h2>
        <Link href="/" className="btn-secondary" style={{ marginTop: "2rem" }}>&larr; Geri Dön</Link>
      </div>
    );
  }

  // Guide verisi (SSR'da erişim — metin botlar tarafından okunabilir)
  const guide = getGuideBySlug(slug);

  // Breadcrumb öğeleri
  const breadcrumbItems = buildCalculatorBreadcrumbs(calc, category);

  // JSON-LD Şemaları
  const schemas = [
    generateWebApplicationSchema(calc, category),
    generateBreadcrumbSchema(breadcrumbItems),
    ...(guide?.faq ? [generateFAQPageSchema(guide.faq)] : []),
  ];

  return (
    <>
      {/* Yapılandırılmış Veri — Sunucu tarafında oluşturuluyor */}
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <div className="container layout-3col" style={{ padding: "1.5rem 0.75rem" }}>
        <LeftSidebar />

        <div className="main-content">
          <AdPlaceholder type="leaderboard" />

          {/* Breadcrumb — SSR */}
          <Breadcrumb
            items={[
              { label: "Ana Sayfa", href: "/" },
              ...(category
                ? [{ label: category.name, href: `/kategori/${category.slug}` }]
                : []),
              { label: calc.title },
            ]}
          />

          <div className="panel" style={{ padding: 0 }}>
            {/* Başlık ve açıklama — SSR (Botlar tarafından okunabilir) */}
            <div style={{ padding: "1.5rem 1.25rem", background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)" }}>
              <div className="md:px-4">
                <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.5rem", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                  {calc.title}
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.5, maxWidth: "800px" }}>
                  {calc.description}
                </p>
              </div>
            </div>

            <div style={{ padding: "1rem 1.25rem" }}>
              <AdPlaceholder type="native" />
            </div>

            {/* Hesaplama Widget (Client-Side) + Rehber (Server-Side) */}
            <div className="p-4 md:p-10">
              <CalculatorWidget slug={slug} />
              <CalculatorGuide slug={slug} />
            </div>
          </div>

          <AdPlaceholder type="fluid" style={{ marginTop: '2rem' }} />

          <div style={{ marginTop: '3rem' }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "1.5rem", opacity: 0.8 }}>Sizin İçin Seçtiklerimiz</h3>
            <AdPlaceholder type="multiplex" />
          </div>
        </div>

        <RightSidebarAds />
      </div>
    </>
  );
}
