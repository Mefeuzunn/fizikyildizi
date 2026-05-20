export type CalculatorInfo = {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  description: string;
  icon?: string;
};

// Yalnızca prototipe uygun başlangıç araçlarını ekleyelim.
export const TOOLS: CalculatorInfo[] = [
  // Finans Kategorisi
  { 
    id: "tahvil", 
    title: "Tahvil & Bono Hesaplayıcı", 
    slug: "tahvil", 
    categoryId: "finans", 
    description: "Kuponlu tahvillerin ve iskontolu bonoların bugünkü değerine göre fiyatlaması ve satım teorik verimi.",
    icon: "TrendingUp"
  },
  { 
    id: "kredi", 
    title: "Kredi Hesaplama", 
    slug: "kredi-hesaplama", 
    categoryId: "kredi", 
    description: "Aylık taksit tutarlarınızı, anapara ve faiz oranınıza göre detaylı hesaplayın.",
    icon: "Banknote"
  },
  { 
    id: "bmi", 
    title: "Vücut Kitle Endeksi", 
    slug: "vucut-kitle-endeksi", 
    categoryId: "saglik", 
    description: "Boyunuza ve kilonuza göre sağlıklı aralıkta olup olmadığınızı öğrenin.",
    icon: "Heart"
  },
];

export function getToolsByCategory(categorySlug: string) {
  return TOOLS.filter(t => t.categoryId === categorySlug);
}

export function getToolBySlug(slug: string) {
  return TOOLS.find(t => t.slug === slug);
}
