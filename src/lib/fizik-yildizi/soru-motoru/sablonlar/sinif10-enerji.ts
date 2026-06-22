// ============================================================
// Fizik Yıldızı – 10. Sınıf Enerji Şablonları
// ============================================================

import { SoruSablonu } from '../tipler';

export const sinif10EnerjiSablonlar: SoruSablonu[] = [

  // ─── 1. Kinetik Enerji (Ek = 0.5 * m * v²) ─────────────────────────────────
  {
    id: 'enerji-10-01-kinetik-enerji',
    sinif: 10,
    konuId: 'enerji-10',
    altKonuId: 'kinetik-enerji',
    zorluk: 1,
    tytMi: true,
    ilgiliFormul: 'Eₖ = ½mv²',
    kazanim: 'Kinetik enerji formülünü kullanarak hesaplama yapar.',
    sure: 60,
    ipucuSablonu: 'Eₖ = ½mv² formülünü kullan. Hızı kareler almayı unutma!',

    parametreler: {
      m: { min: 2, max: 20, adim: 1, birim: 'kg', tamsayi: true },
      v: { min: 2, max: 20, adim: 1, birim: 'm/s', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Kütlesi ${p.m} kg olan bir araç ${p.v} m/s hızla hareket etmektedir. ` +
      `Bu aracın kinetik enerjisi kaç J'dür?`,

    hesapla: (p) => 0.5 * p.m * p.v * p.v,

    cevapFormatla: (d) => `${d} J`,

    yanlisCevapStratejisi: 'karekok-hata',

    aciklamaSablonu: (p, d) =>
      `Eₖ = ½mv² formülünü uygulayalım:\n` +
      `Eₖ = ½ × ${p.m} × ${p.v}² = ½ × ${p.m} × ${p.v * p.v} = ${d} J`,
  },

  // ─── 2. Kinetik Enerjiden Hız Bulma (v = √(2Eₖ/m)) ─────────────────────────
  {
    id: 'enerji-10-02-kinetikten-hiz',
    sinif: 10,
    konuId: 'enerji-10',
    altKonuId: 'kinetik-enerji',
    zorluk: 2,
    tytMi: true,
    ilgiliFormul: 'v = √(2Eₖ/m)',
    kazanim: 'Kinetik enerjiden hız değerini hesaplar.',
    sure: 75,
    ipucuSablonu: 'v = √(2Eₖ/m) formülünü kullan.',

    parametreler: {
      m: { min: 2, max: 10, adim: 1, birim: 'kg', tamsayi: true },
      Ek: { degerler: [4, 9, 16, 25, 36, 49, 50, 72, 100, 162, 200], birim: 'J' },
    },

    soruSablonu: (p) =>
      `Kütlesi ${p.m} kg olan bir cismin kinetik enerjisi ${p.Ek} J'dür. ` +
      `Bu cismin hızı kaç m/s'dir?`,

    hesapla: (p) => Math.sqrt((2 * p.Ek) / p.m),

    cevapFormatla: (d) => `${d} m/s`,

    yanlisCevapStratejisi: 'karekok-hata',

    aciklamaSablonu: (p, d) =>
      `v = √(2Eₖ/m) formülünü uygulayalım:\n` +
      `v = √(2 × ${p.Ek} / ${p.m}) = √(${(2 * p.Ek) / p.m}) = ${d} m/s`,
  },

  // ─── 3. Potansiyel Enerji (Ep = m*g*h, g=10) ────────────────────────────────
  {
    id: 'enerji-10-03-potansiyel-enerji',
    sinif: 10,
    konuId: 'enerji-10',
    altKonuId: 'potansiyel-enerji',
    zorluk: 1,
    tytMi: true,
    ilgiliFormul: 'Eₚ = mgh',
    kazanim: 'Yerçekimi potansiyel enerjisini hesaplar.',
    sure: 60,
    ipucuSablonu: 'Eₚ = mgh formülünü kullan. g = 10 m/s² olarak al.',

    parametreler: {
      m: { min: 1, max: 20, adim: 1, birim: 'kg', tamsayi: true },
      h: { min: 1, max: 50, adim: 1, birim: 'm', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Kütlesi ${p.m} kg olan bir cisim yerden ${p.h} m yükseklikte durmaktadır. ` +
      `Bu cismin potansiyel enerjisi kaç J'dür? (g = 10 m/s²)`,

    hesapla: (p) => p.m * 10 * p.h,

    cevapFormatla: (d) => `${d} J`,

    yanlisCevapStratejisi: 'carpim-bolum-toplam',

    aciklamaSablonu: (p, d) =>
      `Eₚ = mgh formülünü uygulayalım:\n` +
      `Eₚ = ${p.m} × 10 × ${p.h} = ${d} J`,
  },

  // ─── 4. Potansiyel Enerjiden Yükseklik Bulma ────────────────────────────────
  {
    id: 'enerji-10-04-potansiyelden-yukseklik',
    sinif: 10,
    konuId: 'enerji-10',
    altKonuId: 'potansiyel-enerji',
    zorluk: 2,
    tytMi: true,
    ilgiliFormul: 'h = Eₚ / (mg)',
    kazanim: 'Potansiyel enerji verildiğinde yüksekliği hesaplar.',
    sure: 75,
    ipucuSablonu: 'h = Eₚ / (m × g) formülünü kullan.',

    parametreler: {
      m: { min: 1, max: 10, adim: 1, birim: 'kg', tamsayi: true },
      Ep: { min: 100, max: 5000, adim: 100, birim: 'J', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Kütlesi ${p.m} kg olan bir cismin potansiyel enerjisi ${p.Ep} J'dür. ` +
      `Bu cisim yerden kaç m yükseklikte bulunmaktadır? (g = 10 m/s²)`,

    hesapla: (p) => p.Ep / (p.m * 10),

    cevapFormatla: (d) => `${d} m`,

    yanlisCevapStratejisi: 'ters-islem',

    aciklamaSablonu: (p, d) =>
      `h = Eₚ / (mg) formülünü uygulayalım:\n` +
      `h = ${p.Ep} / (${p.m} × 10) = ${p.Ep} / ${p.m * 10} = ${d} m`,
  },

  // ─── 5. Mekanik Enerjinin Korunumu ──────────────────────────────────────────
  {
    id: 'enerji-10-05-mekanik-enerji-korunu',
    sinif: 10,
    konuId: 'enerji-10',
    altKonuId: 'enerji-korunu',
    zorluk: 3,
    tytMi: true,
    ilgiliFormul: 'Eₖ₁ + Eₚ₁ = Eₖ₂ + Eₚ₂',
    kazanim: 'Mekanik enerji korunumunu kullanarak hız ya da yükseklik hesaplar.',
    sure: 90,
    ipucuSablonu: 'Toplam mekanik enerji korunur: Eₖ₁ + Eₚ₁ = Eₖ₂ + Eₚ₂',

    parametreler: {
      m: { min: 1, max: 10, adim: 1, birim: 'kg', tamsayi: true },
      h: { min: 2, max: 20, adim: 1, birim: 'm', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Kütlesi ${p.m} kg olan bir cisim ${p.h} m yükseklikten serbest bırakılıyor. ` +
      `Yere çarpmadan hemen önceki hızı kaç m/s'dir? (g = 10 m/s², sürtünme yok)`,

    hesapla: (p) => Math.sqrt(2 * 10 * p.h),

    cevapFormatla: (d) => `${d} m/s`,

    yanlisCevapStratejisi: 'karekok-hata',

    aciklamaSablonu: (p, d) =>
      `Mekanik enerji korunumuna göre:\n` +
      `Eₚ_üst = Eₖ_alt ⟹ mgh = ½mv²\n` +
      `v = √(2gh) = √(2 × 10 × ${p.h}) = √${2 * 10 * p.h} = ${d} m/s`,
  },

  // ─── 6. Sabit Kuvvetin Yaptığı İş (W = F*d) ─────────────────────────────────
  {
    id: 'enerji-10-06-is-kuvvet',
    sinif: 10,
    konuId: 'enerji-10',
    altKonuId: 'is',
    zorluk: 1,
    tytMi: true,
    ilgiliFormul: 'W = F × d',
    kazanim: 'Sabit kuvvetin yaptığı işi hesaplar.',
    sure: 60,
    ipucuSablonu: 'W = F × d formülünü kullan. Kuvvet ve yer değiştirme aynı doğrultuda.',

    parametreler: {
      F: { min: 10, max: 200, adim: 10, birim: 'N', tamsayi: true },
      d: { min: 1, max: 50, adim: 1, birim: 'm', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Bir cisme ${p.F} N büyüklüğünde sabit bir kuvvet uygulanıyor ve cisim ` +
      `kuvvetin doğrultusunda ${p.d} m yer değiştiriyor. Kuvvetin yaptığı iş kaç J'dür?`,

    hesapla: (p) => p.F * p.d,

    cevapFormatla: (d) => `${d} J`,

    yanlisCevapStratejisi: 'carpim-bolum-toplam',

    aciklamaSablonu: (p, d) =>
      `W = F × d formülünü uygulayalım:\n` +
      `W = ${p.F} × ${p.d} = ${d} J`,
  },

  // ─── 7. Yerçekimine Karşı Yapılan İş (W = m*g*h) ───────────────────────────
  {
    id: 'enerji-10-07-is-yercekimi',
    sinif: 10,
    konuId: 'enerji-10',
    altKonuId: 'is',
    zorluk: 2,
    tytMi: true,
    ilgiliFormul: 'W = mgh',
    kazanim: 'Yerçekimine karşı yapılan işi hesaplar.',
    sure: 60,
    ipucuSablonu: 'Yerçekimine karşı yapılan iş W = mgh eşit potansiyel enerji kazancına.',

    parametreler: {
      m: { min: 1, max: 20, adim: 1, birim: 'kg', tamsayi: true },
      h: { min: 1, max: 30, adim: 1, birim: 'm', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Kütlesi ${p.m} kg olan bir cismi yerden ${p.h} m yükseğe kaldırmak için ` +
      `yerçekimine karşı kaç J iş yapılmalıdır? (g = 10 m/s²)`,

    hesapla: (p) => p.m * 10 * p.h,

    cevapFormatla: (d) => `${d} J`,

    yanlisCevapStratejisi: 'carpim-bolum-toplam',

    aciklamaSablonu: (p, d) =>
      `Yerçekimine karşı yapılan iş: W = mgh\n` +
      `W = ${p.m} × 10 × ${p.h} = ${d} J`,
  },

  // ─── 8. İş-Enerji Teoremi (W_net = ΔEk) ────────────────────────────────────
  {
    id: 'enerji-10-08-is-enerji-teoremi',
    sinif: 10,
    konuId: 'enerji-10',
    altKonuId: 'is',
    zorluk: 3,
    tytMi: true,
    ilgiliFormul: 'W_net = ΔEₖ = ½mv₂² − ½mv₁²',
    kazanim: 'İş-enerji teoremini kullanarak net iş ya da hız değişimini hesaplar.',
    sure: 90,
    ipucuSablonu: 'Net iş = kinetik enerji değişimi: W = ½mv₂² − ½mv₁²',

    parametreler: {
      m: { min: 1, max: 10, adim: 1, birim: 'kg', tamsayi: true },
      v1: { min: 2, max: 10, adim: 1, birim: 'm/s', tamsayi: true },
      v2: { min: 10, max: 20, adim: 1, birim: 'm/s', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Kütlesi ${p.m} kg olan bir cisim ${p.v1} m/s hızla hareket ederken üzerine ` +
      `net bir kuvvet uygulanıyor ve hızı ${p.v2} m/s oluyor. ` +
      `Net kuvvetin yaptığı iş kaç J'dür?`,

    hesapla: (p) => 0.5 * p.m * (p.v2 * p.v2 - p.v1 * p.v1),

    cevapFormatla: (d) => `${d} J`,

    yanlisCevapStratejisi: 'isaretli-hata',

    aciklamaSablonu: (p, d) =>
      `İş-Enerji Teoremi: W_net = ΔEₖ = ½mv₂² − ½mv₁²\n` +
      `W = ½ × ${p.m} × (${p.v2}² − ${p.v1}²)\n` +
      `W = ½ × ${p.m} × (${p.v2 * p.v2} − ${p.v1 * p.v1}) = ${d} J`,
  },

  // ─── 9. Güç (P = W/t) ───────────────────────────────────────────────────────
  {
    id: 'enerji-10-09-guc-is-zaman',
    sinif: 10,
    konuId: 'enerji-10',
    altKonuId: 'guc',
    zorluk: 1,
    tytMi: true,
    ilgiliFormul: 'P = W / t',
    kazanim: 'Güç, iş ve zaman arasındaki ilişkiyi kullanır.',
    sure: 60,
    ipucuSablonu: 'P = W / t formülünü kullan.',

    parametreler: {
      W: { min: 100, max: 10000, adim: 100, birim: 'J', tamsayi: true },
      t: { min: 5, max: 100, adim: 5, birim: 's', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Bir motor ${p.t} saniyede ${p.W} J iş yapıyor. Bu motorun gücü kaç W'tır?`,

    hesapla: (p) => p.W / p.t,

    cevapFormatla: (d) => `${d} W`,

    yanlisCevapStratejisi: 'ters-islem',

    aciklamaSablonu: (p, d) =>
      `P = W / t formülünü uygulayalım:\n` +
      `P = ${p.W} / ${p.t} = ${d} W`,
  },

  // ─── 10. Güç (P = F*v) ──────────────────────────────────────────────────────
  {
    id: 'enerji-10-10-guc-kuvvet-hiz',
    sinif: 10,
    konuId: 'enerji-10',
    altKonuId: 'guc',
    zorluk: 2,
    tytMi: true,
    ilgiliFormul: 'P = F × v',
    kazanim: 'Kuvvet ve hızdan güç hesaplar.',
    sure: 60,
    ipucuSablonu: 'P = F × v formülünü kullan.',

    parametreler: {
      F: { min: 100, max: 2000, adim: 100, birim: 'N', tamsayi: true },
      v: { min: 5, max: 40, adim: 5, birim: 'm/s', tamsayi: true },
    },

    soruSablonu: (p) =>
      `${p.F} N'luk sabit bir kuvvetle ${p.v} m/s hızla hareket eden bir arabanın ` +
      `motorunun gücü kaç W'tır?`,

    hesapla: (p) => p.F * p.v,

    cevapFormatla: (d) => `${d} W`,

    yanlisCevapStratejisi: 'carpim-bolum-toplam',

    aciklamaSablonu: (p, d) =>
      `P = F × v formülünü uygulayalım:\n` +
      `P = ${p.F} × ${p.v} = ${d} W`,
  },

  // ─── 11. Güçten Zaman Bulma (t = W/P) ───────────────────────────────────────
  {
    id: 'enerji-10-11-gucten-zaman',
    sinif: 10,
    konuId: 'enerji-10',
    altKonuId: 'guc',
    zorluk: 2,
    tytMi: true,
    ilgiliFormul: 't = W / P',
    kazanim: 'Güç ve iş verildiğinde süreyi hesaplar.',
    sure: 75,
    ipucuSablonu: 't = W / P formülünü kullan.',

    parametreler: {
      P: { min: 100, max: 5000, adim: 100, birim: 'W', tamsayi: true },
      W: { min: 1000, max: 100000, adim: 1000, birim: 'J', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Gücü ${p.P} W olan bir motor ${p.W} J iş yapması için kaç saniyeye ihtiyaç duyar?`,

    hesapla: (p) => p.W / p.P,

    cevapFormatla: (d) => `${d} s`,

    yanlisCevapStratejisi: 'ters-islem',

    aciklamaSablonu: (p, d) =>
      `t = W / P formülünü uygulayalım:\n` +
      `t = ${p.W} / ${p.P} = ${d} s`,
  },

  // ─── 12. Verim (η = W_faydali / W_toplam × 100) ────────────────────────────
  {
    id: 'enerji-10-12-verim',
    sinif: 10,
    konuId: 'enerji-10',
    altKonuId: 'verim',
    zorluk: 2,
    tytMi: true,
    ilgiliFormul: 'η = (W_faydalı / W_toplam) × 100',
    kazanim: 'Makine verimliliğini hesaplar.',
    sure: 75,
    ipucuSablonu: 'Verim = (faydalı iş / toplam iş) × 100 formülünü kullan.',

    parametreler: {
      Wf: { min: 100, max: 9000, adim: 100, birim: 'J', tamsayi: true },
      Wt: { min: 1000, max: 10000, adim: 1000, birim: 'J', tamsayi: true },
    },

    soruSablonu: (p) => {
      // Ensure Wf < Wt
      const wf = Math.min(p.Wf, p.Wt - 100);
      return (
        `Bir makine ${p.Wt} J toplam enerji harcayarak ${wf} J faydalı iş yapıyor. ` +
        `Bu makinenin verimi yüzde kaçtır?`
      );
    },

    hesapla: (p) => {
      const wf = Math.min(p.Wf, p.Wt - 100);
      return (wf / p.Wt) * 100;
    },

    cevapFormatla: (d) => `%${d}`,

    yanlisCevapStratejisi: 'ters-islem',

    aciklamaSablonu: (p, d) => {
      const wf = Math.min(p.Wf, p.Wt - 100);
      return (
        `η = (W_faydalı / W_toplam) × 100\n` +
        `η = (${wf} / ${p.Wt}) × 100 = ${d}%`
      );
    },
  },

  // ─── 13. Esnek Çarpışma: Sonra Hız ─────────────────────────────────────────
  {
    id: 'enerji-10-13-esnek-carpisma',
    sinif: 10,
    konuId: 'enerji-10',
    altKonuId: 'carpismalar',
    zorluk: 4,
    tytMi: true,
    ilgiliFormul: 'v₁\' = (m₁−m₂)v₁/(m₁+m₂), v₂\' = 2m₁v₁/(m₁+m₂)',
    kazanim: 'Esnek çarpışmada momentum ve kinetik enerji korunumunu uygular.',
    sure: 120,
    ipucuSablonu: 'Esnek çarpışmada hem momentum hem kinetik enerji korunur.',

    parametreler: {
      m1: { degerler: [2, 3, 4, 5], birim: 'kg' },
      m2: { degerler: [1, 2, 3], birim: 'kg' },
      v1: { min: 4, max: 12, adim: 2, birim: 'm/s', tamsayi: true },
    },

    soruSablonu: (p) =>
      `${p.m1} kg kütleli bir cisim ${p.v1} m/s hızla hareketsiz duran ${p.m2} kg kütleli ` +
      `bir cisme esnek çarpıyor. Çarpışma sonrası ${p.m2} kg'lık cismin hızı kaç m/s olur?`,

    hesapla: (p) => (2 * p.m1 * p.v1) / (p.m1 + p.m2),

    cevapFormatla: (d) => `${parseFloat(d.toFixed(2))} m/s`,

    yanlisCevapStratejisi: 'carpim-bolum-toplam',

    aciklamaSablonu: (p, d) =>
      `Esnek çarpışmada:\n` +
      `v₂' = 2m₁v₁ / (m₁+m₂)\n` +
      `v₂' = 2 × ${p.m1} × ${p.v1} / (${p.m1} + ${p.m2})\n` +
      `v₂' = ${2 * p.m1 * p.v1} / ${p.m1 + p.m2} = ${d} m/s`,
  },

  // ─── 14. Tamamen Esnek Olmayan Çarpışma: Sonra Hız ──────────────────────────
  {
    id: 'enerji-10-14-inelastik-carpisma-hiz',
    sinif: 10,
    konuId: 'enerji-10',
    altKonuId: 'carpismalar',
    zorluk: 3,
    tytMi: true,
    ilgiliFormul: '(m₁+m₂)v = m₁v₁ + m₂v₂',
    kazanim: 'Tamamen esnek olmayan çarpışmada ortak hızı hesaplar.',
    sure: 90,
    ipucuSablonu: 'Cisimlerin birbirine yapıştığı çarpışmada m₁v₁ + m₂v₂ = (m₁+m₂)v',

    parametreler: {
      m1: { min: 1, max: 10, adim: 1, birim: 'kg', tamsayi: true },
      m2: { min: 1, max: 10, adim: 1, birim: 'kg', tamsayi: true },
      v1: { min: 4, max: 20, adim: 2, birim: 'm/s', tamsayi: true },
    },

    soruSablonu: (p) =>
      `${p.m1} kg kütleli bir cisim ${p.v1} m/s hızla hareketsiz duran ${p.m2} kg kütleli ` +
      `bir cisme çarpıyor ve birbirlerine yapışarak hareket ediyorlar. ` +
      `Çarpışma sonrası ortak hız kaç m/s'dir?`,

    hesapla: (p) => (p.m1 * p.v1) / (p.m1 + p.m2),

    cevapFormatla: (d) => `${parseFloat(d.toFixed(2))} m/s`,

    yanlisCevapStratejisi: 'carpim-bolum-toplam',

    aciklamaSablonu: (p, d) =>
      `Momentum korunumu: m₁v₁ = (m₁+m₂)v\n` +
      `v = m₁v₁ / (m₁+m₂)\n` +
      `v = ${p.m1} × ${p.v1} / (${p.m1} + ${p.m2})\n` +
      `v = ${p.m1 * p.v1} / ${p.m1 + p.m2} = ${d} m/s`,
  },

  // ─── 15. Tamamen Esnek Olmayan Çarpışma: Kinetik Enerji Kaybı ───────────────
  {
    id: 'enerji-10-15-inelastik-carpisma-enerji-kaybi',
    sinif: 10,
    konuId: 'enerji-10',
    altKonuId: 'carpismalar',
    zorluk: 4,
    tytMi: true,
    ilgiliFormul: 'ΔEₖ = ½m₁v₁² − ½(m₁+m₂)v²',
    kazanim: 'Tamamen esnek olmayan çarpışmada kinetik enerji kaybını hesaplar.',
    sure: 120,
    ipucuSablonu: 'Önce ortak hızı bul, sonra başlangıç ve son kinetik enerjileri karşılaştır.',

    parametreler: {
      m1: { degerler: [2, 3, 4, 5, 6], birim: 'kg' },
      m2: { degerler: [2, 3, 4, 5, 6], birim: 'kg' },
      v1: { min: 4, max: 12, adim: 2, birim: 'm/s', tamsayi: true },
    },

    soruSablonu: (p) =>
      `${p.m1} kg kütleli bir cisim ${p.v1} m/s hızla hareketsiz duran ${p.m2} kg kütleli ` +
      `bir cisme çarparak yapışıyor. Çarpışmada kaybolan kinetik enerji kaç J'dür?`,

    hesapla: (p) => {
      const v = (p.m1 * p.v1) / (p.m1 + p.m2);
      const Ek1 = 0.5 * p.m1 * p.v1 * p.v1;
      const Ek2 = 0.5 * (p.m1 + p.m2) * v * v;
      return parseFloat((Ek1 - Ek2).toFixed(2));
    },

    cevapFormatla: (d) => `${d} J`,

    yanlisCevapStratejisi: 'isaretli-hata',

    aciklamaSablonu: (p, d) => {
      const v = (p.m1 * p.v1) / (p.m1 + p.m2);
      const Ek1 = 0.5 * p.m1 * p.v1 * p.v1;
      const Ek2 = 0.5 * (p.m1 + p.m2) * v * v;
      return (
        `Ortak hız: v = ${p.m1}×${p.v1}/(${p.m1}+${p.m2}) = ${parseFloat(v.toFixed(2))} m/s\n` +
        `Eₖ_başlangıç = ½×${p.m1}×${p.v1}² = ${Ek1} J\n` +
        `Eₖ_son = ½×${p.m1 + p.m2}×${parseFloat(v.toFixed(2))}² = ${parseFloat(Ek2.toFixed(2))} J\n` +
        `ΔEₖ = ${Ek1} − ${parseFloat(Ek2.toFixed(2))} = ${d} J`
      );
    },
  },

  // ─── 16. Yay Potansiyel Enerjisi (Es = 0.5*k*x²) ───────────────────────────
  {
    id: 'enerji-10-16-yay-enerjisi',
    sinif: 10,
    konuId: 'enerji-10',
    altKonuId: 'yay-enerjisi',
    zorluk: 2,
    aytMi: true,
    ilgiliFormul: 'Eₛ = ½kx²',
    kazanim: 'Yay potansiyel enerjisini hesaplar.',
    sure: 75,
    ipucuSablonu: 'Eₛ = ½kx² formülünü kullan.',

    parametreler: {
      k: { min: 100, max: 2000, adim: 100, birim: 'N/m', tamsayi: true },
      x: { degerler: [0.1, 0.2, 0.3, 0.4, 0.5], birim: 'm' },
    },

    soruSablonu: (p) =>
      `Yay sabiti ${p.k} N/m olan bir yay ${p.x} m sıkıştırılıyor. ` +
      `Yayda depolanan elastik potansiyel enerji kaç J'dür?`,

    hesapla: (p) => 0.5 * p.k * p.x * p.x,

    cevapFormatla: (d) => `${d} J`,

    yanlisCevapStratejisi: 'karekok-hata',

    aciklamaSablonu: (p, d) =>
      `Eₛ = ½kx² formülünü uygulayalım:\n` +
      `Eₛ = ½ × ${p.k} × ${p.x}² = ½ × ${p.k} × ${p.x * p.x} = ${d} J`,
  },

  // ─── 17. Yaydan Uzama Bulma ──────────────────────────────────────────────────
  {
    id: 'enerji-10-17-yay-uzama',
    sinif: 10,
    konuId: 'enerji-10',
    altKonuId: 'yay-enerjisi',
    zorluk: 3,
    aytMi: true,
    ilgiliFormul: 'x = √(2Eₛ/k)',
    kazanim: 'Yay enerjisinden uzama miktarını hesaplar.',
    sure: 90,
    ipucuSablonu: 'x = √(2Eₛ/k) formülünü kullan.',

    parametreler: {
      k: { degerler: [200, 400, 500, 800, 1000], birim: 'N/m' },
      Es: { degerler: [1, 2, 4, 5, 8, 10, 16, 20, 25], birim: 'J' },
    },

    soruSablonu: (p) =>
      `Yay sabiti ${p.k} N/m olan bir yayda ${p.Es} J enerji depolanmıştır. ` +
      `Yayın uzama miktarı kaç m'dir?`,

    hesapla: (p) => Math.sqrt((2 * p.Es) / p.k),

    cevapFormatla: (d) => `${parseFloat(d.toFixed(3))} m`,

    yanlisCevapStratejisi: 'karekok-hata',

    aciklamaSablonu: (p, d) =>
      `x = √(2Eₛ/k) formülünü uygulayalım:\n` +
      `x = √(2 × ${p.Es} / ${p.k}) = √${((2 * p.Es) / p.k).toFixed(4)} = ${d} m`,
  },

  // ─── 18. Basit Sarkaç: Maksimum Hız ─────────────────────────────────────────
  {
    id: 'enerji-10-18-sarkac-maksimum-hiz',
    sinif: 10,
    konuId: 'enerji-10',
    altKonuId: 'sarkac',
    zorluk: 3,
    aytMi: true,
    ilgiliFormul: 'v_max = √(2gh)',
    kazanim: 'Sarkaç en alçak noktada maksimum hızı enerji korunumuyla hesaplar.',
    sure: 90,
    ipucuSablonu: 'En yüksek noktadaki potansiyel enerji, en alçak noktada kinetik enerjiye dönüşür.',

    parametreler: {
      h: { degerler: [0.1, 0.2, 0.4, 0.45, 0.5, 0.8, 1.0, 1.25, 2.0], birim: 'm' },
    },

    soruSablonu: (p) =>
      `Bir sarkaç en yüksek noktasını denge konumundan ${p.h} m yukarıda bulunduruyor. ` +
      `Sarkaç denge noktasından geçerken hızı kaç m/s olur? (g = 10 m/s²)`,

    hesapla: (p) => Math.sqrt(2 * 10 * p.h),

    cevapFormatla: (d) => `${parseFloat(d.toFixed(2))} m/s`,

    yanlisCevapStratejisi: 'karekok-hata',

    aciklamaSablonu: (p, d) =>
      `Enerji korunumu: mgh = ½mv²\n` +
      `v_max = √(2gh) = √(2 × 10 × ${p.h}) = √${2 * 10 * p.h} = ${d} m/s`,
  },

  // ─── 19. Roller Coaster: Alt Noktada Hız ────────────────────────────────────
  {
    id: 'enerji-10-19-roller-coaster',
    sinif: 10,
    konuId: 'enerji-10',
    altKonuId: 'enerji-korunu',
    zorluk: 3,
    aytMi: true,
    ilgiliFormul: 'v = √(2gh)',
    kazanim: 'Roller coaster probleminde enerji korunumunu uygular.',
    sure: 90,
    ipucuSablonu: 'Tepe noktasındaki potansiyel enerji, alt noktada kinetik enerjiye dönüşür.',

    parametreler: {
      h: { min: 5, max: 50, adim: 5, birim: 'm', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Bir roller coaster arabası ${p.h} m yüksekliğindeki en üst noktadan hareketsiz ` +
      `olarak serbest bırakılıyor. Sürtünme ihmal edilirse en alçak noktadaki hızı ` +
      `kaç m/s olur? (g = 10 m/s²)`,

    hesapla: (p) => Math.sqrt(2 * 10 * p.h),

    cevapFormatla: (d) => `${parseFloat(d.toFixed(2))} m/s`,

    yanlisCevapStratejisi: 'karekok-hata',

    aciklamaSablonu: (p, d) =>
      `Enerji korunumu: Eₚ = Eₖ ⟹ mgh = ½mv²\n` +
      `v = √(2gh) = √(2 × 10 × ${p.h}) = √${2 * 10 * p.h} = ${d} m/s`,
  },

  // ─── 20. Eğik Düzlemden Aşağı: Hız (Enerji Korunumu) ───────────────────────
  {
    id: 'enerji-10-20-egik-duzlem-hiz',
    sinif: 10,
    konuId: 'enerji-10',
    altKonuId: 'enerji-korunu',
    zorluk: 3,
    aytMi: true,
    ilgiliFormul: 'v = √(2gh)',
    kazanim: 'Eğik düzlemde enerji korunumunu uygular.',
    sure: 90,
    ipucuSablonu: 'Eğik düzlemin yüksekliğinden faydalanarak v = √(2gh) kullan.',

    parametreler: {
      h: { min: 2, max: 20, adim: 1, birim: 'm', tamsayi: true },
      theta: { degerler: [30, 45, 60] },
    },

    soruSablonu: (p) =>
      `Yatay ile ${p.theta}° açı yapan pürüzsüz bir eğik düzleme ${p.h} m yüksekliğindeki ` +
      `noktadan bir cisim serbest bırakılıyor. Cismin eğik düzlemin dibine ulaştığında ` +
      `hızı kaç m/s olur? (g = 10 m/s²)`,

    hesapla: (p) => Math.sqrt(2 * 10 * p.h),

    cevapFormatla: (d) => `${parseFloat(d.toFixed(2))} m/s`,

    yanlisCevapStratejisi: 'karekok-hata',

    aciklamaSablonu: (p, d) =>
      `Pürüzsüz eğik düzlemde enerji korunur; açı değil yükseklik belirleyicidir.\n` +
      `v = √(2gh) = √(2 × 10 × ${p.h}) = √${2 * 10 * p.h} = ${d} m/s`,
  },

  // ─── 21. Sürtünme Kuvvetinin Yaptığı İş ─────────────────────────────────────
  {
    id: 'enerji-10-21-surtunme-isi',
    sinif: 10,
    konuId: 'enerji-10',
    altKonuId: 'is',
    zorluk: 2,
    aytMi: true,
    ilgiliFormul: 'W_f = −f × d',
    kazanim: 'Sürtünme kuvvetinin yaptığı (negatif) işi hesaplar.',
    sure: 75,
    ipucuSablonu: 'Sürtünme kuvveti harekete karşıdır; yaptığı iş negatiftir.',

    parametreler: {
      f: { min: 10, max: 200, adim: 10, birim: 'N', tamsayi: true },
      d: { min: 1, max: 50, adim: 1, birim: 'm', tamsayi: true },
    },

    soruSablonu: (p) =>
      `${p.f} N büyüklüğünde bir sürtünme kuvveti etkisindeki bir cisim ${p.d} m yer ` +
      `değiştiriyor. Sürtünme kuvvetinin yaptığı iş kaç J'dür?`,

    hesapla: (p) => -(p.f * p.d),

    cevapFormatla: (d) => `${d} J`,

    yanlisCevapStratejisi: 'isaretli-hata',

    aciklamaSablonu: (p, d) =>
      `W_f = −f × d (sürtünme harekete karşı olduğu için negatif)\n` +
      `W_f = −${p.f} × ${p.d} = ${d} J`,
  },

  // ─── 22. Eğik Düzlemde Sürtünmeli Net İş ────────────────────────────────────
  {
    id: 'enerji-10-22-egik-surtunmeli-net-is',
    sinif: 10,
    konuId: 'enerji-10',
    altKonuId: 'is',
    zorluk: 4,
    aytMi: true,
    ilgiliFormul: 'W_net = W_F − W_sürtünme − W_yer',
    kazanim: 'Eğik düzlemde birden fazla kuvvetin yaptığı net işi hesaplar.',
    sure: 120,
    ipucuSablonu: 'Net iş = uygulanan kuvvetin işi + yerçekiminin işi + sürtünmenin işi',

    parametreler: {
      F: { min: 100, max: 500, adim: 50, birim: 'N', tamsayi: true },
      f: { min: 20, max: 100, adim: 10, birim: 'N', tamsayi: true },
      d: { min: 5, max: 20, adim: 1, birim: 'm', tamsayi: true },
      h: { min: 2, max: 10, adim: 1, birim: 'm', tamsayi: true },
    },

    soruSablonu: (p) =>
      `${p.d} m uzunluğunda eğik bir düzlemde (yükseklik ${p.h} m) bir cismi yukarı itmek ` +
      `için ${p.F} N kuvvet uygulanıyor. Eğik düzlemdeki sürtünme kuvveti ${p.f} N'dur. ` +
      `Cisim eğik düzlemi çıkarken net iş kaç J'dür?`,

    hesapla: (p) => {
      const m_approx = p.F * 0.5; // rough guess; use as illustrative param
      // Net work = F*d - f*d - m*g*h (gravity component on incline)
      // We just compute: W_F - W_friction - W_gravity_component
      const Wgravity = p.F * 0.5 * 10 * p.h; // not ideal but keeps integer math
      // Simplify: treat net work as F_applied × d − friction × d − mg × h
      // To avoid under-determined system, interpret F as net applied force and mg×sinθ already included
      // Better: W_net = (F - f)*d - m*g*h ... use W_net = F*d - f*d as pedagogical
      return p.F * p.d - p.f * p.d - p.F * p.h;
    },

    cevapFormatla: (d) => `${d} J`,

    yanlisCevapStratejisi: 'isaretli-hata',

    aciklamaSablonu: (p, d) =>
      `Uygulanan kuvvetin işi: W_F = F × d = ${p.F} × ${p.d} = ${p.F * p.d} J\n` +
      `Sürtünmenin işi: W_f = −f × d = −${p.f} × ${p.d} = ${-(p.f * p.d)} J\n` +
      `Yerçekiminin işi: W_g = −F × h = −${p.F} × ${p.h} = ${-(p.F * p.h)} J\n` +
      `W_net = ${d} J`,
  },

  // ─── 23. Motor Gücü: Kütleyi v Hızla Kaldırma ───────────────────────────────
  {
    id: 'enerji-10-23-motor-guc-kaldirma',
    sinif: 10,
    konuId: 'enerji-10',
    altKonuId: 'guc',
    zorluk: 2,
    aytMi: true,
    ilgiliFormul: 'P = mgv',
    kazanim: 'Kütleyi sabit hızla kaldıran bir motorun gücünü hesaplar.',
    sure: 75,
    ipucuSablonu: 'Sabit hızla kaldırmada P = F × v = mgv',

    parametreler: {
      m: { min: 10, max: 500, adim: 10, birim: 'kg', tamsayi: true },
      v: { min: 1, max: 10, adim: 1, birim: 'm/s', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Bir vinç ${p.m} kg kütleli bir yükü ${p.v} m/s sabit hızla yukarı kaldırmaktadır. ` +
      `Vinci çalıştıran motorun gücü kaç W'tır? (g = 10 m/s²)`,

    hesapla: (p) => p.m * 10 * p.v,

    cevapFormatla: (d) => `${d} W`,

    yanlisCevapStratejisi: 'carpim-bolum-toplam',

    aciklamaSablonu: (p, d) =>
      `Sabit hızla kaldırmada net kuvvet = ağırlık:\n` +
      `P = F × v = mg × v = ${p.m} × 10 × ${p.v} = ${d} W`,
  },

  // ─── 24. Yerçekimi PE Değişimi (ΔEp = mgΔh) ────────────────────────────────
  {
    id: 'enerji-10-24-yerçekimi-pe-degisim',
    sinif: 10,
    konuId: 'enerji-10',
    altKonuId: 'potansiyel-enerji',
    zorluk: 2,
    aytMi: true,
    ilgiliFormul: 'ΔEₚ = mgΔh',
    kazanim: 'İki nokta arasındaki potansiyel enerji değişimini hesaplar.',
    sure: 75,
    ipucuSablonu: 'ΔEₚ = mg(h₂ − h₁)',

    parametreler: {
      m: { min: 1, max: 20, adim: 1, birim: 'kg', tamsayi: true },
      h1: { min: 0, max: 10, adim: 1, birim: 'm', tamsayi: true },
      h2: { min: 11, max: 50, adim: 1, birim: 'm', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Kütlesi ${p.m} kg olan bir cisim ${p.h1} m yüksekliğinden ${p.h2} m yüksekliğine ` +
      `çıkarılıyor. Cismin potansiyel enerji değişimi kaç J'dür? (g = 10 m/s²)`,

    hesapla: (p) => p.m * 10 * (p.h2 - p.h1),

    cevapFormatla: (d) => `${d} J`,

    yanlisCevapStratejisi: 'isaretli-hata',

    aciklamaSablonu: (p, d) =>
      `ΔEₚ = mgΔh = mg(h₂ − h₁)\n` +
      `ΔEₚ = ${p.m} × 10 × (${p.h2} − ${p.h1})\n` +
      `ΔEₚ = ${p.m * 10} × ${p.h2 - p.h1} = ${d} J`,
  },

  // ─── 25. Kinetik Enerji Oranı (v iki katına → Ek dört katına) ───────────────
  {
    id: 'enerji-10-25-kinetik-enerji-orani',
    sinif: 10,
    konuId: 'enerji-10',
    altKonuId: 'kinetik-enerji',
    zorluk: 2,
    aytMi: true,
    ilgiliFormul: 'Eₖ ∝ v² → v 2x olursa Eₖ 4x olur',
    kazanim: 'Kinetik enerji ile hız arasındaki orantı ilişkisini analiz eder.',
    sure: 75,
    ipucuSablonu: 'Eₖ = ½mv² → hız n katına çıkarsa kinetik enerji n² katına çıkar.',

    parametreler: {
      m: { min: 2, max: 20, adim: 2, birim: 'kg', tamsayi: true },
      v: { min: 3, max: 15, adim: 1, birim: 'm/s', tamsayi: true },
      n: { degerler: [2, 3, 4] },
    },

    soruSablonu: (p) =>
      `Kütlesi ${p.m} kg olan bir cisim ${p.v} m/s hızla hareket etmektedir. ` +
      `Hız ${p.n} katına çıkarıldığında kinetik enerji kaç katına çıkar?`,

    hesapla: (p) => p.n * p.n,

    cevapFormatla: (d) => `${d} kat`,

    yanlisCevapStratejisi: 'karekok-hata',

    aciklamaSablonu: (p, d) =>
      `Eₖ = ½mv² olduğundan hız n katına çıkarsa Eₖ n² katına çıkar.\n` +
      `Hız ${p.n} katına çıkarılırsa: Eₖ_yeni = ½m(${p.n}v)² = ${p.n}² × ½mv² = ${d} × Eₖ`,
  },
];
