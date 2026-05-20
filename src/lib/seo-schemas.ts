import type { CalculatorInfo, Category } from "@/data/calculators";

const BASE_URL = "https://kalkula.com.tr";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FAQItem {
  q: string;
  a: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

// ─── FAQPage Schema ─────────────────────────────────────────────────────────

export function generateFAQPageSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

// ─── WebApplication Schema ──────────────────────────────────────────────────

const categorySchemaMap: Record<string, string> = {
  kredi: "FinanceApplication",
  finans: "FinanceApplication",
  saglik: "HealthApplication",
  egitim: "EducationalApplication",
  matematik: "EducationalApplication",
  sinav: "EducationalApplication",
  muhasebe: "BusinessApplication",
  vergi: "BusinessApplication",
  ticari: "BusinessApplication",
  donusturuculer: "UtilitiesApplication",
  sure: "UtilitiesApplication",
  diger: "UtilitiesApplication",
  araclar: "UtilitiesApplication",
  eglence: "EntertainmentApplication",
  gelistirici: "DeveloperApplication",
  muhendislik: "EducationalApplication",
  sosyal: "SocialNetworkingApplication",
  pdf: "UtilitiesApplication",
  oyun: "GameApplication",
};

export function generateWebApplicationSchema(
  calc: CalculatorInfo,
  category: Category | null
) {
  const appCategory =
    categorySchemaMap[calc.categoryId] || "UtilitiesApplication";

  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: calc.title,
    url: `${BASE_URL}/hesapla/${calc.slug}`,
    description: calc.description,
    applicationCategory: appCategory,
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "TRY",
    },
    creator: {
      "@type": "Organization",
      name: "Kalkula",
      url: BASE_URL,
    },
    ...(category && {
      isPartOf: {
        "@type": "WebPage",
        name: `${category.name} Hesaplamaları`,
        url: `${BASE_URL}/kategori/${category.slug}`,
      },
    }),
    inLanguage: "tr",
  };
}

// ─── BreadcrumbList Schema ──────────────────────────────────────────────────

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ─── Helper: Build breadcrumb items for a calculator page ───────────────────

export function buildCalculatorBreadcrumbs(
  calc: CalculatorInfo,
  category: Category | null
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { name: "Ana Sayfa", url: BASE_URL },
  ];

  if (category) {
    items.push({
      name: category.name,
      url: `${BASE_URL}/kategori/${category.slug}`,
    });
  }

  items.push({
    name: calc.title,
    url: `${BASE_URL}/hesapla/${calc.slug}`,
  });

  return items;
}

// ─── Helper: Build breadcrumb items for a category page ─────────────────────

export function buildCategoryBreadcrumbs(
  category: Category
): BreadcrumbItem[] {
  return [
    { name: "Ana Sayfa", url: BASE_URL },
    {
      name: category.name,
      url: `${BASE_URL}/kategori/${category.slug}`,
    },
  ];
}
