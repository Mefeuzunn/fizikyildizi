// ============================================================
// Fizik Yıldızı – 9. Sınıf: Madde ve Özellikleri Şablonları
// ============================================================
// Kapsam: Yoğunluk, Basınç, Kaldırma Kuvveti, Pascal, Yüzey Gerilimi,
//         Elastik Deformasyon, Özgül Ağırlık
// ============================================================

import { SoruSablonu } from '../tipler';

export const sinif9MaddeSablonlar: SoruSablonu[] = [

  // ─────────────────────────────────────────────────────────────
  // 1. Yoğunluk Bul: d = m / V
  // ─────────────────────────────────────────────────────────────
  {
    id: 's9-madde-01',
    sinif: 9,
    konuId: 'madde-ozellikleri-9',
    altKonuId: 'yogunluk',
    zorluk: 1,
    tytMi: true,
    ilgiliFormul: 'd = m / V',
    kazanim: 'Maddenin kütlesi ve hacmi verildiğinde yoğunluğunu hesaplar.',
    sure: 60,
    ipucuSablonu: 'Yoğunluk formülü: d = m / V. Birimlere dikkat edin!',

    parametreler: {
      m: { min: 100, max: 800, adim: 50, birim: 'g', tamsayi: true },
      V: { min: 50,  max: 400, adim: 50, birim: 'cm³', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Kütlesi ${p.m} g ve hacmi ${p.V} cm³ olan bir cismin yoğunluğu kaç g/cm³'tür?`,

    hesapla: (p) => {
      // d = m / V  (g/cm³)
      return parseFloat((p.m / p.V).toFixed(3));
    },

    cevapFormatla: (d) => `${d} g/cm³`,

    yanlisCevapStratejisi: 'ters-islem',

    aciklamaSablonu: (p, dogruCevap) =>
      `**Çözüm:**\n\n` +
      `Yoğunluk formülü: **d = m / V**\n\n` +
      `d = ${p.m} g ÷ ${p.V} cm³\n\n` +
      `**d = ${dogruCevap} g/cm³**`,
  },

  // ─────────────────────────────────────────────────────────────
  // 2. Kütle Bul: m = d * V
  // ─────────────────────────────────────────────────────────────
  {
    id: 's9-madde-02',
    sinif: 9,
    konuId: 'madde-ozellikleri-9',
    altKonuId: 'yogunluk',
    zorluk: 1,
    tytMi: true,
    ilgiliFormul: 'm = d × V',
    kazanim: 'Yoğunluk ve hacim verildiğinde kütleyi hesaplar.',
    sure: 60,
    ipucuSablonu: 'm = d × V formülünü kullanın.',

    parametreler: {
      d: { min: 1, max: 10, adim: 1, birim: 'g/cm³', tamsayi: true },
      V: { min: 20, max: 200, adim: 10, birim: 'cm³', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Yoğunluğu ${p.d} g/cm³ ve hacmi ${p.V} cm³ olan bir cismin kütlesi kaç gramdır?`,

    hesapla: (p) => p.d * p.V,

    cevapFormatla: (m) => `${m} g`,

    yanlisCevapStratejisi: 'carpim-bolum-toplam',

    aciklamaSablonu: (p, dogruCevap) =>
      `**Çözüm:**\n\n` +
      `Kütle formülü: **m = d × V**\n\n` +
      `m = ${p.d} g/cm³ × ${p.V} cm³\n\n` +
      `**m = ${dogruCevap} g**`,
  },

  // ─────────────────────────────────────────────────────────────
  // 3. Hacim Bul: V = m / d
  // ─────────────────────────────────────────────────────────────
  {
    id: 's9-madde-03',
    sinif: 9,
    konuId: 'madde-ozellikleri-9',
    altKonuId: 'yogunluk',
    zorluk: 1,
    tytMi: true,
    ilgiliFormul: 'V = m / d',
    kazanim: 'Kütle ve yoğunluk verildiğinde hacmi hesaplar.',
    sure: 60,
    ipucuSablonu: 'V = m / d formülünü kullanın.',

    parametreler: {
      m: { min: 100, max: 1000, adim: 100, birim: 'g', tamsayi: true },
      d: { min: 2,   max: 10,   adim: 1,   birim: 'g/cm³', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Kütlesi ${p.m} g ve yoğunluğu ${p.d} g/cm³ olan bir cismin hacmi kaç cm³'tür?`,

    hesapla: (p) => parseFloat((p.m / p.d).toFixed(2)),

    cevapFormatla: (V) => `${V} cm³`,

    yanlisCevapStratejisi: 'ters-islem',

    aciklamaSablonu: (p, dogruCevap) =>
      `**Çözüm:**\n\n` +
      `Hacim formülü: **V = m / d**\n\n` +
      `V = ${p.m} g ÷ ${p.d} g/cm³\n\n` +
      `**V = ${dogruCevap} cm³**`,
  },

  // ─────────────────────────────────────────────────────────────
  // 4. Birim Dönüşümü: g/cm³ → kg/m³  (× 1000)
  // ─────────────────────────────────────────────────────────────
  {
    id: 's9-madde-04',
    sinif: 9,
    konuId: 'madde-ozellikleri-9',
    altKonuId: 'yogunluk',
    zorluk: 2,
    tytMi: true,
    ilgiliFormul: '1 g/cm³ = 1000 kg/m³',
    kazanim: 'Yoğunluk birimlerini dönüştürür (g/cm³ ↔ kg/m³).',
    sure: 60,
    ipucuSablonu: '1 g/cm³ = 1000 kg/m³ olduğunu hatırlayın.',

    parametreler: {
      d_gcm3: { min: 1, max: 14, adim: 1, birim: 'g/cm³', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Yoğunluğu ${p.d_gcm3} g/cm³ olan bir maddenin yoğunluğu kaç kg/m³'tür?`,

    hesapla: (p) => p.d_gcm3 * 1000,

    cevapFormatla: (d) => `${d} kg/m³`,

    yanlisCevapStratejisi: 'onlu-hata',

    aciklamaSablonu: (p, dogruCevap) =>
      `**Çözüm:**\n\n` +
      `Birim dönüşümü: 1 g/cm³ = **1000 kg/m³**\n\n` +
      `${p.d_gcm3} g/cm³ × 1000 = **${dogruCevap} kg/m³**\n\n` +
      `*İpucu: g→kg için ÷1000, cm³→m³ için ÷10⁶ uygulanır; net etki ×1000.*`,
  },

  // ─────────────────────────────────────────────────────────────
  // 5. Sıvı Basıncı: P = d·g·h  (g = 10 m/s²)
  // ─────────────────────────────────────────────────────────────
  {
    id: 's9-madde-05',
    sinif: 9,
    konuId: 'madde-ozellikleri-9',
    altKonuId: 'basinc',
    zorluk: 2,
    tytMi: true,
    ilgiliFormul: 'P = d·g·h',
    kazanim: 'Sıvı içindeki bir noktadaki hidrostatik basıncı hesaplar.',
    sure: 75,
    ipucuSablonu: 'P = d·g·h; g = 10 m/s² alınır.',

    parametreler: {
      d:   { min: 800,  max: 1500, adim: 100, birim: 'kg/m³', tamsayi: true },
      h:   { min: 1,    max: 10,   adim: 1,   birim: 'm',      tamsayi: true },
    },

    soruSablonu: (p) =>
      `Yoğunluğu ${p.d} kg/m³ olan bir sıvının ${p.h} m derinliğindeki basıncı kaç Pa'dır? (g = 10 m/s²)`,

    hesapla: (p) => p.d * 10 * p.h,

    cevapFormatla: (P) => `${P} Pa`,

    yanlisCevapStratejisi: 'carpim-bolum-toplam',

    aciklamaSablonu: (p, dogruCevap) =>
      `**Çözüm:**\n\n` +
      `Hidrostatik basınç: **P = d × g × h**\n\n` +
      `P = ${p.d} kg/m³ × 10 m/s² × ${p.h} m\n\n` +
      `**P = ${dogruCevap} Pa**`,
  },

  // ─────────────────────────────────────────────────────────────
  // 6. Derinlik Bul: h = P / (d·g)
  // ─────────────────────────────────────────────────────────────
  {
    id: 's9-madde-06',
    sinif: 9,
    konuId: 'madde-ozellikleri-9',
    altKonuId: 'basinc',
    zorluk: 2,
    tytMi: true,
    ilgiliFormul: 'h = P / (d·g)',
    kazanim: 'Sıvı basıncından derinliği hesaplar.',
    sure: 75,
    ipucuSablonu: 'h = P / (d × g) formülünü kullanın; g = 10 m/s².',

    parametreler: {
      P: { min: 10000, max: 100000, adim: 10000, birim: 'Pa', tamsayi: true },
      d: { min: 800,   max: 1200,   adim: 100,   birim: 'kg/m³', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Yoğunluğu ${p.d} kg/m³ olan bir sıvıda ${p.P} Pa'lık hidrostatik basıncın oluştuğu derinlik kaç metredir? (g = 10 m/s²)`,

    hesapla: (p) => parseFloat((p.P / (p.d * 10)).toFixed(2)),

    cevapFormatla: (h) => `${h} m`,

    yanlisCevapStratejisi: 'ters-islem',

    aciklamaSablonu: (p, dogruCevap) =>
      `**Çözüm:**\n\n` +
      `P = d·g·h → **h = P / (d·g)**\n\n` +
      `h = ${p.P} Pa ÷ (${p.d} kg/m³ × 10 m/s²)\n\n` +
      `h = ${p.P} ÷ ${p.d * 10}\n\n` +
      `**h = ${dogruCevap} m**`,
  },

  // ─────────────────────────────────────────────────────────────
  // 7. Toplam Basınç: P_top = P_atm + d·g·h
  // ─────────────────────────────────────────────────────────────
  {
    id: 's9-madde-07',
    sinif: 9,
    konuId: 'madde-ozellikleri-9',
    altKonuId: 'basinc',
    zorluk: 2,
    tytMi: true,
    ilgiliFormul: 'P_top = P_atm + d·g·h',
    kazanim: 'Atmosfer basıncı ve sıvı sütununun oluşturduğu toplam basıncı hesaplar.',
    sure: 90,
    ipucuSablonu: 'P_toplam = P_atm + d·g·h; P_atm = 10⁵ Pa alınır.',

    parametreler: {
      h: { min: 1, max: 20, adim: 1, birim: 'm', tamsayi: true },
      d: { min: 900, max: 1100, adim: 100, birim: 'kg/m³', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Yoğunluğu ${p.d} kg/m³ olan bir sıvının yüzeyi atmosferle temas hâlindedir. Bu sıvının ${p.h} m derinliğindeki mutlak basınç kaç Pa'dır? (g = 10 m/s², P_atm = 10⁵ Pa)`,

    hesapla: (p) => 100000 + p.d * 10 * p.h,

    cevapFormatla: (P) => `${P} Pa`,

    yanlisCevapStratejisi: 'isaretli-hata',

    aciklamaSablonu: (p, dogruCevap) =>
      `**Çözüm:**\n\n` +
      `Mutlak basınç: **P = P_atm + d·g·h**\n\n` +
      `P = 100 000 + ${p.d} × 10 × ${p.h}\n\n` +
      `P = 100 000 + ${p.d * 10 * p.h}\n\n` +
      `**P = ${dogruCevap} Pa**`,
  },

  // ─────────────────────────────────────────────────────────────
  // 8. Kaldırma Kuvveti: F_k = d_sıvı · g · V_bat
  // ─────────────────────────────────────────────────────────────
  {
    id: 's9-madde-08',
    sinif: 9,
    konuId: 'madde-ozellikleri-9',
    altKonuId: 'kaldirma-kuvveti',
    zorluk: 2,
    tytMi: true,
    ilgiliFormul: 'F_k = d_sıvı × g × V_bat',
    kazanim: 'Sıvı içindeki cisme etki eden kaldırma kuvvetini hesaplar.',
    sure: 90,
    ipucuSablonu: 'Arşimet: F_k = d_sıvı × g × V_batık. Cismin tamamen batık olduğunu varsayın.',

    parametreler: {
      d_sivi: { min: 800, max: 1200, adim: 100, birim: 'kg/m³', tamsayi: true },
      V_bat:  { min: 0.001, max: 0.01, adim: 0.001, birim: 'm³' },
    },

    soruSablonu: (p) =>
      `Yoğunluğu ${p.d_sivi} kg/m³ olan bir sıvıya tamamen daldırılan, hacmi ${p.V_bat} m³ olan bir cisme etki eden kaldırma kuvveti kaç N'dur? (g = 10 m/s²)`,

    hesapla: (p) => parseFloat((p.d_sivi * 10 * p.V_bat).toFixed(2)),

    cevapFormatla: (F) => `${F} N`,

    yanlisCevapStratejisi: 'carpim-bolum-toplam',

    aciklamaSablonu: (p, dogruCevap) =>
      `**Çözüm:**\n\n` +
      `Arşimet ilkesi: **F_k = d_sıvı × g × V_batık**\n\n` +
      `F_k = ${p.d_sivi} kg/m³ × 10 m/s² × ${p.V_bat} m³\n\n` +
      `**F_k = ${dogruCevap} N**`,
  },

  // ─────────────────────────────────────────────────────────────
  // 9. Yüzme Koşulu: d_cisim × V_toplam = d_sıvı × V_batık  →  V_batık bul
  // ─────────────────────────────────────────────────────────────
  {
    id: 's9-madde-09',
    sinif: 9,
    konuId: 'madde-ozellikleri-9',
    altKonuId: 'kaldirma-kuvveti',
    zorluk: 3,
    tytMi: true,
    ilgiliFormul: 'F_k = G  →  d_cisim × V_top = d_sıvı × V_bat',
    kazanim: 'Yüzen cismin denge koşulunu kurarak batık hacmini hesaplar.',
    sure: 100,
    ipucuSablonu: 'Yüzme denge koşulu: G = F_k → d_c·g·V_c = d_s·g·V_bat.',

    parametreler: {
      d_cisim: { min: 400, max: 900, adim: 50, birim: 'kg/m³', tamsayi: true },
      V_top:   { min: 0.01, max: 0.1, adim: 0.01, birim: 'm³' },
      d_sivi:  { degerler: [1000], birim: 'kg/m³' },
    },

    soruSablonu: (p) =>
      `Yoğunluğu ${p.d_cisim} kg/m³ ve toplam hacmi ${p.V_top} m³ olan bir cisim su (d = 1000 kg/m³) üzerinde yüzmektedir. Suyun altında kalan cisim hacmi kaç m³'tür?`,

    hesapla: (p) =>
      parseFloat(((p.d_cisim * p.V_top) / 1000).toFixed(5)),

    cevapFormatla: (V) => `${V} m³`,

    yanlisCevapStratejisi: 'ters-islem',

    aciklamaSablonu: (p, dogruCevap) =>
      `**Çözüm:**\n\n` +
      `Yüzme dengesi: **d_cisim × V_top = d_sıvı × V_bat**\n\n` +
      `${p.d_cisim} × ${p.V_top} = 1000 × V_bat\n\n` +
      `V_bat = (${p.d_cisim} × ${p.V_top}) / 1000\n\n` +
      `**V_bat = ${dogruCevap} m³**`,
  },

  // ─────────────────────────────────────────────────────────────
  // 10. Batık Kesir: V_bat/V_top = d_cisim / d_sıvı
  // ─────────────────────────────────────────────────────────────
  {
    id: 's9-madde-10',
    sinif: 9,
    konuId: 'madde-ozellikleri-9',
    altKonuId: 'kaldirma-kuvveti',
    zorluk: 2,
    tytMi: true,
    ilgiliFormul: 'V_bat/V_top = d_cisim / d_sıvı',
    kazanim: 'Yüzen cismin kaçta kaçının sıvı içinde kaldığını hesaplar.',
    sure: 80,
    ipucuSablonu: 'Batık kesir = d_cisim / d_sıvı.',

    parametreler: {
      d_cisim: { min: 500, max: 950, adim: 50, birim: 'kg/m³', tamsayi: true },
      d_sivi:  { degerler: [1000], birim: 'kg/m³' },
    },

    soruSablonu: (p) =>
      `Yoğunluğu ${p.d_cisim} kg/m³ olan bir cisim su (d = 1000 kg/m³) üzerinde yüzmektedir. Cismin suyun altında kalan kısmının toplam hacmine oranı nedir? (Ondalık olarak verin)`,

    hesapla: (p) => parseFloat((p.d_cisim / 1000).toFixed(3)),

    cevapFormatla: (f) => `${f}`,

    yanlisCevapStratejisi: 'ters-islem',

    aciklamaSablonu: (p, dogruCevap) =>
      `**Çözüm:**\n\n` +
      `Batık kesir: **V_bat / V_top = d_cisim / d_sıvı**\n\n` +
      `V_bat / V_top = ${p.d_cisim} / 1000\n\n` +
      `**Oran = ${dogruCevap}**\n\n` +
      `Yani cismin %${(dogruCevap * 100).toFixed(1)}'ı suyun altında kalır.`,
  },

  // ─────────────────────────────────────────────────────────────
  // 11. Manometre Basıncı (Gösterge): P_gösterge = P_mutlak - P_atm
  // ─────────────────────────────────────────────────────────────
  {
    id: 's9-madde-11',
    sinif: 9,
    konuId: 'madde-ozellikleri-9',
    altKonuId: 'basinc',
    zorluk: 2,
    tytMi: true,
    ilgiliFormul: 'P_gösterge = P_mutlak - P_atm',
    kazanim: 'Mutlak basınç ve atmosfer basıncından gösterge basıncını hesaplar.',
    sure: 60,
    ipucuSablonu: 'P_gösterge = P_mutlak − P_atmosfer.',

    parametreler: {
      P_mutlak: { min: 150000, max: 400000, adim: 50000, birim: 'Pa', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Mutlak basıncı ${p.P_mutlak} Pa olan bir sistemin gösterge basıncı (manometre basıncı) kaç Pa'dır? (P_atm = 10⁵ Pa)`,

    hesapla: (p) => p.P_mutlak - 100000,

    cevapFormatla: (P) => `${P} Pa`,

    yanlisCevapStratejisi: 'isaretli-hata',

    aciklamaSablonu: (p, dogruCevap) =>
      `**Çözüm:**\n\n` +
      `**P_gösterge = P_mutlak − P_atm**\n\n` +
      `P_gösterge = ${p.P_mutlak} − 100 000\n\n` +
      `**P_gösterge = ${dogruCevap} Pa**`,
  },

  // ─────────────────────────────────────────────────────────────
  // 12. Pascal İlkesi: F1/A1 = F2/A2  →  Basıncı doğrula
  // ─────────────────────────────────────────────────────────────
  {
    id: 's9-madde-12',
    sinif: 9,
    konuId: 'madde-ozellikleri-9',
    altKonuId: 'basinc',
    zorluk: 2,
    tytMi: true,
    ilgiliFormul: 'P = F/A (Pascal ilkesi)',
    kazanim: 'Pascal ilkesini kullanarak kapalı sistemdeki basıncı hesaplar.',
    sure: 75,
    ipucuSablonu: 'F1/A1 = F2/A2 → P eşit iletilir.',

    parametreler: {
      F1: { min: 10, max: 100, adim: 10, birim: 'N', tamsayi: true },
      A1: { min: 0.01, max: 0.05, adim: 0.01, birim: 'm²' },
    },

    soruSablonu: (p) =>
      `Küçük pistonun alanı ${p.A1} m² ve üzerine uygulanan kuvvet ${p.F1} N olan bir hidrolik sistemde sıvıya uygulanan basınç kaç Pa'dır?`,

    hesapla: (p) => parseFloat((p.F1 / p.A1).toFixed(1)),

    cevapFormatla: (P) => `${P} Pa`,

    yanlisCevapStratejisi: 'ters-islem',

    aciklamaSablonu: (p, dogruCevap) =>
      `**Çözüm:**\n\n` +
      `Pascal ilkesi: **P = F / A**\n\n` +
      `P = ${p.F1} N ÷ ${p.A1} m²\n\n` +
      `**P = ${dogruCevap} Pa**\n\n` +
      `Bu basınç hidrolik sistemin her noktasına eşit iletilir.`,
  },

  // ─────────────────────────────────────────────────────────────
  // 13. Hidrolik Kaldıraç: F2 = F1 × A2/A1
  // ─────────────────────────────────────────────────────────────
  {
    id: 's9-madde-13',
    sinif: 9,
    konuId: 'madde-ozellikleri-9',
    altKonuId: 'basinc',
    zorluk: 2,
    tytMi: true,
    ilgiliFormul: 'F2 = F1 × (A2 / A1)',
    kazanim: 'Hidrolik sistemde büyük pistona etki eden kuvveti hesaplar.',
    sure: 90,
    ipucuSablonu: 'F2/F1 = A2/A1 → F2 = F1 × A2/A1.',

    parametreler: {
      F1: { min: 50, max: 200, adim: 50, birim: 'N', tamsayi: true },
      A1: { min: 5, max: 20, adim: 5, birim: 'cm²', tamsayi: true },
      A2: { min: 50, max: 400, adim: 50, birim: 'cm²', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Bir hidrolik kaldıraçta küçük pistonun alanı ${p.A1} cm² ve üzerine ${p.F1} N kuvvet uygulanmaktadır. Büyük pistonun alanı ${p.A2} cm² ise bu pistona etki eden kuvvet kaç N'dur?`,

    hesapla: (p) => parseFloat((p.F1 * p.A2 / p.A1).toFixed(2)),

    cevapFormatla: (F) => `${F} N`,

    yanlisCevapStratejisi: 'ters-islem',

    aciklamaSablonu: (p, dogruCevap) =>
      `**Çözüm:**\n\n` +
      `Pascal ilkesi: **F1/A1 = F2/A2**\n\n` +
      `F2 = F1 × (A2/A1)\n\n` +
      `F2 = ${p.F1} N × (${p.A2} cm² ÷ ${p.A1} cm²)\n\n` +
      `F2 = ${p.F1} × ${(p.A2 / p.A1).toFixed(2)}\n\n` +
      `**F2 = ${dogruCevap} N**`,
  },

  // ─────────────────────────────────────────────────────────────
  // 14. Hidrolik Kaldıraç: Alan Bul → A2 = F2 × A1 / F1
  // ─────────────────────────────────────────────────────────────
  {
    id: 's9-madde-14',
    sinif: 9,
    konuId: 'madde-ozellikleri-9',
    altKonuId: 'basinc',
    zorluk: 3,
    tytMi: true,
    ilgiliFormul: 'A2 = F2 × A1 / F1',
    kazanim: 'İstenen kuvvet oranını sağlayacak piston alanını hesaplar.',
    sure: 90,
    ipucuSablonu: 'F2/F1 = A2/A1 → A2 = F2 × A1 / F1.',

    parametreler: {
      F1: { min: 20, max: 100, adim: 20, birim: 'N', tamsayi: true },
      F2: { min: 200, max: 2000, adim: 200, birim: 'N', tamsayi: true },
      A1: { min: 2, max: 10, adim: 2, birim: 'cm²', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Bir hidrolik sistemde küçük pistona ${p.F1} N kuvvet uygulanarak büyük pistonda ${p.F2} N kuvvet elde edilmek isteniyor. Küçük pistonun alanı ${p.A1} cm² olduğuna göre büyük pistonun alanı kaç cm² olmalıdır?`,

    hesapla: (p) => parseFloat((p.F2 * p.A1 / p.F1).toFixed(2)),

    cevapFormatla: (A) => `${A} cm²`,

    yanlisCevapStratejisi: 'ters-islem',

    aciklamaSablonu: (p, dogruCevap) =>
      `**Çözüm:**\n\n` +
      `Pascal: **F1/A1 = F2/A2 → A2 = F2 × A1 / F1**\n\n` +
      `A2 = ${p.F2} × ${p.A1} / ${p.F1}\n\n` +
      `**A2 = ${dogruCevap} cm²**`,
  },

  // ─────────────────────────────────────────────────────────────
  // 15. Yüzey Gerilimi: W = γ × ΔA
  // ─────────────────────────────────────────────────────────────
  {
    id: 's9-madde-15',
    sinif: 9,
    konuId: 'madde-ozellikleri-9',
    altKonuId: 'yuzey-gerilimi',
    zorluk: 3,
    tytMi: true,
    ilgiliFormul: 'W = γ × ΔA',
    kazanim: 'Yüzey alanı değişimine karşı yapılan işi yüzey gerilimi ile hesaplar.',
    sure: 90,
    ipucuSablonu: 'W = γ × ΔA; ΔA sabun filmi için her iki yüzey göz önüne alınır.',

    parametreler: {
      gamma: { min: 0.02, max: 0.08, adim: 0.01, birim: 'N/m' },
      dA:    { min: 0.01, max: 0.10, adim: 0.01, birim: 'm²' },
    },

    soruSablonu: (p) =>
      `Yüzey gerilimi ${p.gamma} N/m olan bir sıvının serbest yüzeyi ${p.dA} m² artırılıyor. Bu süreçte yapılan iş kaç J'dür?`,

    hesapla: (p) => parseFloat((p.gamma * p.dA).toFixed(5)),

    cevapFormatla: (W) => `${W} J`,

    yanlisCevapStratejisi: 'carpim-bolum-toplam',

    aciklamaSablonu: (p, dogruCevap) =>
      `**Çözüm:**\n\n` +
      `Yüzey işi: **W = γ × ΔA**\n\n` +
      `W = ${p.gamma} N/m × ${p.dA} m²\n\n` +
      `**W = ${dogruCevap} J**`,
  },

  // ─────────────────────────────────────────────────────────────
  // 16. Kılcal Yükselme: h = 2γ / (d·g·r)  (cos θ = 1 varsayımı)
  // ─────────────────────────────────────────────────────────────
  {
    id: 's9-madde-16',
    sinif: 9,
    konuId: 'madde-ozellikleri-9',
    altKonuId: 'yuzey-gerilimi',
    zorluk: 3,
    tytMi: true,
    ilgiliFormul: 'h = 2γ / (d·g·r)',
    kazanim: 'Kılcallık formülünü kullanarak sıvı yükselme yüksekliğini hesaplar.',
    sure: 100,
    ipucuSablonu: 'h = 2γ / (d·g·r); tam ıslanma (cosθ = 1) varsayılır.',

    parametreler: {
      gamma: { degerler: [0.07, 0.05, 0.04], birim: 'N/m' },
      d:     { degerler: [1000], birim: 'kg/m³' },
      r:     { min: 0.0005, max: 0.002, adim: 0.0005, birim: 'm' },
    },

    soruSablonu: (p) =>
      `Yüzey gerilimi ${p.gamma} N/m olan su (d = ${p.d} kg/m³) yarıçapı ${p.r} m olan kılcal bir tüpte kaç metre yükselir? (g = 10 m/s², cosθ = 1)`,

    hesapla: (p) => parseFloat(((2 * p.gamma) / (p.d * 10 * p.r)).toFixed(4)),

    cevapFormatla: (h) => `${h} m`,

    yanlisCevapStratejisi: 'carpim-bolum-toplam',

    aciklamaSablonu: (p, dogruCevap) =>
      `**Çözüm:**\n\n` +
      `Kılcal yükselme: **h = 2γ / (d·g·r)**\n\n` +
      `h = (2 × ${p.gamma}) / (${p.d} × 10 × ${p.r})\n\n` +
      `h = ${(2 * p.gamma).toFixed(3)} / ${(p.d * 10 * p.r).toFixed(3)}\n\n` +
      `**h = ${dogruCevap} m**`,
  },

  // ─────────────────────────────────────────────────────────────
  // 17. Gerilme (Stres): σ = F / A
  // ─────────────────────────────────────────────────────────────
  {
    id: 's9-madde-17',
    sinif: 9,
    konuId: 'madde-ozellikleri-9',
    altKonuId: 'elastik-deformasyon',
    zorluk: 2,
    tytMi: true,
    ilgiliFormul: 'σ = F / A',
    kazanim: 'Bir cisme uygulanan kuvvet ve kesit alanından gerilmeyi hesaplar.',
    sure: 75,
    ipucuSablonu: 'Gerilme (stres): σ = F/A. Birimi Pa (N/m²).',

    parametreler: {
      F: { min: 1000, max: 50000, adim: 1000, birim: 'N', tamsayi: true },
      A: { min: 0.001, max: 0.01, adim: 0.001, birim: 'm²' },
    },

    soruSablonu: (p) =>
      `Kesit alanı ${p.A} m² olan bir çubuğa ${p.F} N'luk çekme kuvveti uygulanıyor. Çubukta oluşan gerilme (stres) kaç Pa'dır?`,

    hesapla: (p) => parseFloat((p.F / p.A).toFixed(0)),

    cevapFormatla: (sigma) => `${sigma} Pa`,

    yanlisCevapStratejisi: 'ters-islem',

    aciklamaSablonu: (p, dogruCevap) =>
      `**Çözüm:**\n\n` +
      `Gerilme: **σ = F / A**\n\n` +
      `σ = ${p.F} N ÷ ${p.A} m²\n\n` +
      `**σ = ${dogruCevap} Pa**`,
  },

  // ─────────────────────────────────────────────────────────────
  // 18. Birim Uzama (Strain): ε = ΔL / L
  // ─────────────────────────────────────────────────────────────
  {
    id: 's9-madde-18',
    sinif: 9,
    konuId: 'madde-ozellikleri-9',
    altKonuId: 'elastik-deformasyon',
    zorluk: 2,
    tytMi: true,
    ilgiliFormul: 'ε = ΔL / L₀',
    kazanim: 'Boyundaki değişim ve başlangıç boyundan birim uzamayı hesaplar.',
    sure: 60,
    ipucuSablonu: 'Birim uzama (strain): ε = ΔL / L₀. Birimsizdir.',

    parametreler: {
      L0:  { min: 1, max: 5, adim: 1, birim: 'm', tamsayi: true },
      dL:  { min: 0.001, max: 0.05, adim: 0.001, birim: 'm' },
    },

    soruSablonu: (p) =>
      `Başlangıç boyu ${p.L0} m olan bir tel ${p.dL} m uzuyor. Bu telin birim uzaması (strain, ε) kaçtır?`,

    hesapla: (p) => parseFloat((p.dL / p.L0).toFixed(5)),

    cevapFormatla: (eps) => `${eps}`,

    yanlisCevapStratejisi: 'ters-islem',

    aciklamaSablonu: (p, dogruCevap) =>
      `**Çözüm:**\n\n` +
      `Birim uzama: **ε = ΔL / L₀**\n\n` +
      `ε = ${p.dL} m ÷ ${p.L0} m\n\n` +
      `**ε = ${dogruCevap}** (birimsiz)`,
  },

  // ─────────────────────────────────────────────────────────────
  // 19. Young Modülü: E = σ / ε = F·L₀ / (A·ΔL)
  // ─────────────────────────────────────────────────────────────
  {
    id: 's9-madde-19',
    sinif: 9,
    konuId: 'madde-ozellikleri-9',
    altKonuId: 'elastik-deformasyon',
    zorluk: 3,
    tytMi: true,
    ilgiliFormul: 'E = F·L₀ / (A·ΔL)',
    kazanim: 'Kuvvet, başlangıç boyu, kesit alanı ve uzamadan Young modülünü hesaplar.',
    sure: 110,
    ipucuSablonu: 'E = σ/ε = (F/A) / (ΔL/L₀) = F·L₀ / (A·ΔL).',

    parametreler: {
      F:  { min: 1000, max: 10000, adim: 1000, birim: 'N', tamsayi: true },
      L0: { min: 1, max: 4, adim: 1, birim: 'm', tamsayi: true },
      A:  { min: 0.0001, max: 0.001, adim: 0.0001, birim: 'm²' },
      dL: { min: 0.001, max: 0.01, adim: 0.001, birim: 'm' },
    },

    soruSablonu: (p) =>
      `Kesit alanı ${p.A} m² ve boyu ${p.L0} m olan bir çubuğa ${p.F} N kuvvet uygulandığında ${p.dL} m uzuyor. Bu malzemenin Young modülü kaç Pa'dır?`,

    hesapla: (p) => parseFloat(((p.F * p.L0) / (p.A * p.dL)).toFixed(0)),

    cevapFormatla: (E) => `${E} Pa`,

    yanlisCevapStratejisi: 'carpim-bolum-toplam',

    aciklamaSablonu: (p, dogruCevap) =>
      `**Çözüm:**\n\n` +
      `**E = F·L₀ / (A·ΔL)**\n\n` +
      `Adım 1 – Gerilme: σ = ${p.F} / ${p.A} = ${(p.F / p.A).toFixed(0)} Pa\n\n` +
      `Adım 2 – Birim uzama: ε = ${p.dL} / ${p.L0} = ${(p.dL / p.L0).toFixed(5)}\n\n` +
      `Adım 3 – Young modülü: E = σ / ε = ${(p.F / p.A).toFixed(0)} / ${(p.dL / p.L0).toFixed(5)}\n\n` +
      `**E = ${dogruCevap} Pa**`,
  },

  // ─────────────────────────────────────────────────────────────
  // 20. Özgül Ağırlık (Bağıl Yoğunluk): SG = d_cisim / d_su
  // ─────────────────────────────────────────────────────────────
  {
    id: 's9-madde-20',
    sinif: 9,
    konuId: 'madde-ozellikleri-9',
    altKonuId: 'yogunluk',
    zorluk: 1,
    tytMi: true,
    ilgiliFormul: 'SG = d_cisim / d_su',
    kazanim: 'Bir maddenin özgül ağırlığını (bağıl yoğunluğunu) hesaplar.',
    sure: 45,
    ipucuSablonu: 'SG = d_cisim / d_su; d_su = 1000 kg/m³.',

    parametreler: {
      d_cisim: { min: 500, max: 11000, adim: 500, birim: 'kg/m³', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Yoğunluğu ${p.d_cisim} kg/m³ olan bir maddenin özgül ağırlığı (bağıl yoğunluğu) kaçtır? (d_su = 1000 kg/m³)`,

    hesapla: (p) => parseFloat((p.d_cisim / 1000).toFixed(3)),

    cevapFormatla: (sg) => `${sg}`,

    yanlisCevapStratejisi: 'onlu-hata',

    aciklamaSablonu: (p, dogruCevap) =>
      `**Çözüm:**\n\n` +
      `Özgül ağırlık: **SG = d_cisim / d_su**\n\n` +
      `SG = ${p.d_cisim} kg/m³ ÷ 1000 kg/m³\n\n` +
      `**SG = ${dogruCevap}** (birimsiz)\n\n` +
      `SG > 1 ise madde suda batar; SG < 1 ise yüzer.`,
  },

];
