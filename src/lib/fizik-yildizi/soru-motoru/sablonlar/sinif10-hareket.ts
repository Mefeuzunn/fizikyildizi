// ============================================================
// Fizik Yıldızı – Soru Şablonları: 10. Sınıf Hareket (Kinematik)
// ============================================================

import { SoruSablonu } from '../tipler';

export const sinif10HareketSablonlar: SoruSablonu[] = [

  // ─── 001: Düzgün hareket – yol bul (x = v·t) ────────────────────────────────
  {
    id: 'n10-har-001',
    sinif: 10,
    konuId: 'kinematik-10',
    altKonuId: 'duggun-hareket',
    zorluk: 1,
    tytMi: true,
    sure: 40,
    ilgiliFormul: 'x = v × t',
    kazanim: "Düzgün doğrusal harekette kat edilen yolu hesaplar.",
    ipucuSablonu: "Düzgün harekette hız sabittir: x = v × t.",
    parametreler: {
      v: { min: 1,  max: 50,  adim: 1, birim: 'm/s', tamsayi: true },
      t: { min: 1,  max: 60,  adim: 1, birim: 's',   tamsayi: true },
    },
    soruSablonu: (p) =>
      `${p.v} m/s sabit hızla hareket eden bir araç ${p.t} s'de kaç metre yol alır?`,
    hesapla: (p) => p.v * p.t,
    cevapFormatla: (v) => `${Math.round(v)} m`,
    yanlisCevapStratejisi: 'carpim-bolum-toplam',
    aciklamaSablonu: (p, c) =>
      `Düzgün hareket: x = v × t\nx = ${p.v} m/s × ${p.t} s = ${Math.round(c)} m`,
  },

  // ─── 002: Düzgün hareket – zamanı bul (t = x/v) ─────────────────────────────
  {
    id: 'n10-har-002',
    sinif: 10,
    konuId: 'kinematik-10',
    altKonuId: 'duggun-hareket',
    zorluk: 1,
    tytMi: true,
    sure: 40,
    ilgiliFormul: 't = x / v',
    kazanim: "Düzgün doğrusal harekette geçen süreyi hesaplar.",
    ipucuSablonu: "t = x / v. Yolu hıza böl.",
    parametreler: {
      x: { min: 100, max: 5000, adim: 100, birim: 'm', tamsayi: true },
      v: { min: 5,   max: 100,  adim: 5,   birim: 'm/s', tamsayi: true },
    },
    soruSablonu: (p) =>
      `${p.v} m/s sabit hızla hareket eden bir araç ${p.x} m yolu kaç saniyede alır?`,
    hesapla: (p) => p.x / p.v,
    cevapFormatla: (v) => `${v.toFixed(1)} s`,
    yanlisCevapStratejisi: 'ters-islem',
    aciklamaSablonu: (p, c) =>
      `t = x / v = ${p.x} m / ${p.v} m/s = ${c.toFixed(1)} s`,
  },

  // ─── 003: Düzgün hareket – hızı bul (v = x/t) ───────────────────────────────
  {
    id: 'n10-har-003',
    sinif: 10,
    konuId: 'kinematik-10',
    altKonuId: 'duggun-hareket',
    zorluk: 1,
    tytMi: true,
    sure: 40,
    ilgiliFormul: 'v = x / t',
    kazanim: "Alınan yol ve süreden ortalama hızı hesaplar.",
    ipucuSablonu: "v = x / t. Yolu süreye böl.",
    parametreler: {
      x: { min: 50,  max: 2000, adim: 50,  birim: 'm', tamsayi: true },
      t: { min: 5,   max: 100,  adim: 5,   birim: 's', tamsayi: true },
    },
    soruSablonu: (p) =>
      `Bir cisim ${p.t} s'de ${p.x} m yol alıyor. Bu cismin hızı kaç m/s'dir?`,
    hesapla: (p) => p.x / p.t,
    cevapFormatla: (v) => `${v.toFixed(1)} m/s`,
    yanlisCevapStratejisi: 'ters-islem',
    aciklamaSablonu: (p, c) =>
      `v = x / t = ${p.x} m / ${p.t} s = ${c.toFixed(1)} m/s`,
  },

  // ─── 004: DAH – son hızı bul (v = v₀ + a·t) ────────────────────────────────
  {
    id: 'n10-har-004',
    sinif: 10,
    konuId: 'kinematik-10',
    altKonuId: 'duzgun-ivmeli-hareket',
    zorluk: 2,
    tytMi: true,
    sure: 55,
    ilgiliFormul: 'v = v₀ + a × t',
    kazanim: "Düzgün ivmeli harekette son hızı v = v₀ + at formülüyle hesaplar.",
    ipucuSablonu: "v = v₀ + a·t. Başlangıç hızına ivme × zamanı ekle.",
    parametreler: {
      v0: { min: 0,  max: 20, adim: 1, birim: 'm/s',  tamsayi: true },
      a:  { min: 1,  max: 10, adim: 1, birim: 'm/s²', tamsayi: true },
      t:  { min: 2,  max: 15, adim: 1, birim: 's',    tamsayi: true },
    },
    soruSablonu: (p) =>
      `${p.v0} m/s başlangıç hızıyla hareket eden bir araç ${p.a} m/s² sabit ivmeyle hızlanmaktadır. ${p.t} s sonra aracın hızı kaç m/s olur?`,
    hesapla: (p) => p.v0 + p.a * p.t,
    cevapFormatla: (v) => `${Math.round(v)} m/s`,
    yanlisCevapStratejisi: 'carpim-bolum-toplam',
    aciklamaSablonu: (p, c) =>
      `v = v₀ + a·t\nv = ${p.v0} + ${p.a} × ${p.t} = ${p.v0} + ${p.a * p.t} = ${Math.round(c)} m/s`,
  },

  // ─── 005: DAH – konum bul (x = v₀t + ½at²) ──────────────────────────────────
  {
    id: 'n10-har-005',
    sinif: 10,
    konuId: 'kinematik-10',
    altKonuId: 'duzgun-ivmeli-hareket',
    zorluk: 2,
    tytMi: true,
    sure: 60,
    ilgiliFormul: 'x = v₀·t + ½·a·t²',
    kazanim: "Düzgün ivmeli harekette kat edilen yolu kinematik denklemle hesaplar.",
    ipucuSablonu: "x = v₀·t + ½·a·t². Her iki terimi ayrı hesaplayıp topla.",
    parametreler: {
      v0: { min: 0,  max: 10, adim: 1, birim: 'm/s',  tamsayi: true },
      a:  { min: 1,  max: 8,  adim: 1, birim: 'm/s²', tamsayi: true },
      t:  { min: 2,  max: 10, adim: 1, birim: 's',    tamsayi: true },
    },
    soruSablonu: (p) =>
      `${p.v0} m/s başlangıç hızıyla hareket etmeye başlayan bir cisim ${p.a} m/s² ivmeyle ${p.t} s'de kaç metre yol alır?`,
    hesapla: (p) => p.v0 * p.t + 0.5 * p.a * p.t * p.t,
    cevapFormatla: (v) => `${v.toFixed(1)} m`,
    yanlisCevapStratejisi: 'karekok-hata',
    aciklamaSablonu: (p, c) =>
      `x = v₀·t + ½·a·t²\nx = ${p.v0}×${p.t} + ½×${p.a}×${p.t}² = ${p.v0 * p.t} + ${0.5 * p.a * p.t * p.t} = ${c.toFixed(1)} m`,
  },

  // ─── 006: DAH – ivmeyi bul (a = (v−v₀)/t) ────────────────────────────────────
  {
    id: 'n10-har-006',
    sinif: 10,
    konuId: 'kinematik-10',
    altKonuId: 'duzgun-ivmeli-hareket',
    zorluk: 2,
    tytMi: true,
    sure: 55,
    ilgiliFormul: 'a = (v − v₀) / t',
    kazanim: "Hız değişiminden ivmeyi hesaplar.",
    ipucuSablonu: "a = (v − v₀) / t. Hız farkını süreye böl.",
    parametreler: {
      v0: { min: 0,  max: 10, adim: 1, birim: 'm/s', tamsayi: true },
      v:  { min: 11, max: 40, adim: 1, birim: 'm/s', tamsayi: true },
      t:  { min: 2,  max: 10, adim: 1, birim: 's',   tamsayi: true },
    },
    soruSablonu: (p) =>
      `Bir araç ${p.v0} m/s başlangıç hızından ${p.t} s içinde ${p.v} m/s'ye ulaşmaktadır. Aracın ivmesi kaç m/s²'dir?`,
    hesapla: (p) => (p.v - p.v0) / p.t,
    cevapFormatla: (v) => `${v.toFixed(1)} m/s²`,
    yanlisCevapStratejisi: 'ters-islem',
    aciklamaSablonu: (p, c) =>
      `a = (v − v₀) / t = (${p.v} − ${p.v0}) / ${p.t} = ${p.v - p.v0} / ${p.t} = ${c.toFixed(1)} m/s²`,
  },

  // ─── 007: DAH – süreyi bul (t = (v−v₀)/a) ────────────────────────────────────
  {
    id: 'n10-har-007',
    sinif: 10,
    konuId: 'kinematik-10',
    altKonuId: 'duzgun-ivmeli-hareket',
    zorluk: 2,
    tytMi: true,
    sure: 55,
    ilgiliFormul: 't = (v − v₀) / a',
    kazanim: "Başlangıç hızı, son hız ve ivmeden geçen süreyi hesaplar.",
    ipucuSablonu: "t = (v − v₀) / a. Hız farkını ivmeye böl.",
    parametreler: {
      v0: { min: 0,  max: 10, adim: 1, birim: 'm/s',  tamsayi: true },
      v:  { min: 11, max: 50, adim: 1, birim: 'm/s',  tamsayi: true },
      a:  { min: 1,  max: 10, adim: 1, birim: 'm/s²', tamsayi: true },
    },
    soruSablonu: (p) =>
      `${p.a} m/s² ivmeyle hızlanan bir araç ${p.v0} m/s'den ${p.v} m/s'ye kaç saniyede ulaşır?`,
    hesapla: (p) => (p.v - p.v0) / p.a,
    cevapFormatla: (v) => `${v.toFixed(1)} s`,
    yanlisCevapStratejisi: 'ters-islem',
    aciklamaSablonu: (p, c) =>
      `v = v₀ + at → t = (v − v₀) / a\nt = (${p.v} − ${p.v0}) / ${p.a} = ${p.v - p.v0} / ${p.a} = ${c.toFixed(1)} s`,
  },

  // ─── 008: DAH – başlangıç hızını bul (v₀ = v − at) ──────────────────────────
  {
    id: 'n10-har-008',
    sinif: 10,
    konuId: 'kinematik-10',
    altKonuId: 'duzgun-ivmeli-hareket',
    zorluk: 3,
    tytMi: true,
    sure: 65,
    ilgiliFormul: 'v₀ = v − a × t',
    kazanim: "Son hız, ivme ve süreden başlangıç hızını hesaplar.",
    ipucuSablonu: "v₀ = v − a·t. Son hızdan ivme×zamanı çıkar.",
    parametreler: {
      v:  { min: 20, max: 60, adim: 2, birim: 'm/s',  tamsayi: true },
      a:  { min: 1,  max: 5,  adim: 1, birim: 'm/s²', tamsayi: true },
      t:  { min: 2,  max: 10, adim: 1, birim: 's',    tamsayi: true },
    },
    soruSablonu: (p) =>
      `${p.a} m/s² ivmeyle ${p.t} s hızlanan bir aracın son hızı ${p.v} m/s'dir. Aracın başlangıç hızı kaç m/s'dir?`,
    hesapla: (p) => p.v - p.a * p.t,
    cevapFormatla: (v) => `${Math.round(v)} m/s`,
    yanlisCevapStratejisi: 'isaretli-hata',
    aciklamaSablonu: (p, c) =>
      `v = v₀ + a·t → v₀ = v − a·t\nv₀ = ${p.v} − ${p.a}×${p.t} = ${p.v} − ${p.a * p.t} = ${Math.round(c)} m/s`,
  },

  // ─── 009: Serbest düşüş – hız (v = g·t) ─────────────────────────────────────
  {
    id: 'n10-har-009',
    sinif: 10,
    konuId: 'kinematik-10',
    altKonuId: 'serbest-dusus',
    zorluk: 1,
    tytMi: true,
    sure: 45,
    ilgiliFormul: 'v = g × t  (g = 10 m/s²)',
    kazanim: "Serbest düşüşte belirli bir süre sonraki hızı hesaplar.",
    ipucuSablonu: "Serbest düşüşte v₀ = 0 ve g = 10 m/s²: v = g·t.",
    parametreler: {
      t: { min: 1, max: 10, adim: 1, birim: 's', tamsayi: true },
    },
    soruSablonu: (p) =>
      `Bir taş yüksek bir yerden serbest bırakılmaktadır. ${p.t} s sonra taşın hızı kaç m/s'dir? (g = 10 m/s²)`,
    hesapla: (p) => 10 * p.t,
    cevapFormatla: (v) => `${Math.round(v)} m/s`,
    yanlisCevapStratejisi: 'onlu-hata',
    aciklamaSablonu: (p, c) =>
      `Serbest düşüş (v₀ = 0):\nv = g·t = 10 × ${p.t} = ${Math.round(c)} m/s`,
  },

  // ─── 010: Serbest düşüş – yükseklik (h = ½g·t²) ─────────────────────────────
  {
    id: 'n10-har-010',
    sinif: 10,
    konuId: 'kinematik-10',
    altKonuId: 'serbest-dusus',
    zorluk: 2,
    tytMi: true,
    sure: 55,
    ilgiliFormul: 'h = ½ × g × t²',
    kazanim: "Serbest düşüşte t saniyede düşülen yüksekliği hesaplar.",
    ipucuSablonu: "h = ½·g·t². g = 10 m/s²'yi kullan; t'yi karesi alarak çarp.",
    parametreler: {
      t: { min: 1, max: 10, adim: 1, birim: 's', tamsayi: true },
    },
    soruSablonu: (p) =>
      `Serbest bırakılan bir cisim ${p.t} s'de kaç metre düşer? (g = 10 m/s²)`,
    hesapla: (p) => 0.5 * 10 * p.t * p.t,
    cevapFormatla: (v) => `${Math.round(v)} m`,
    yanlisCevapStratejisi: 'karekok-hata',
    aciklamaSablonu: (p, c) =>
      `h = ½·g·t² = ½ × 10 × ${p.t}² = 5 × ${p.t * p.t} = ${Math.round(c)} m`,
  },

  // ─── 011: Serbest düşüş – zamanı bul (t = √(2h/g)) ──────────────────────────
  {
    id: 'n10-har-011',
    sinif: 10,
    konuId: 'kinematik-10',
    altKonuId: 'serbest-dusus',
    zorluk: 2,
    tytMi: true,
    sure: 60,
    ilgiliFormul: 't = √(2h / g)',
    kazanim: "Bir yükseklikten serbest düşüşün kaç saniye sürdüğünü hesaplar.",
    ipucuSablonu: "h = ½gt² → t = √(2h/g). g = 10 m/s².",
    parametreler: {
      h: { min: 5, max: 500, adim: 5, birim: 'm', tamsayi: true },
    },
    soruSablonu: (p) =>
      `Bir taş ${p.h} m yükseklikten serbest bırakılmaktadır. Yere ulaşması kaç saniye sürer? (g = 10 m/s²)`,
    hesapla: (p) => Math.sqrt((2 * p.h) / 10),
    cevapFormatla: (v) => `${v.toFixed(1)} s`,
    yanlisCevapStratejisi: 'karekok-hata',
    aciklamaSablonu: (p, c) =>
      `h = ½gt² → t = √(2h/g)\nt = √(2×${p.h}/10) = √${2 * p.h / 10} = ${c.toFixed(1)} s`,
  },

  // ─── 012: Dikey atış – maksimum yükseklik (H = v₀²/2g) ──────────────────────
  {
    id: 'n10-har-012',
    sinif: 10,
    konuId: 'kinematik-10',
    altKonuId: 'dikey-atis',
    zorluk: 3,
    tytMi: true,
    sure: 65,
    ilgiliFormul: 'H = v₀² / (2g)',
    kazanim: "Dikey yukarı atılan cismin maksimum yüksekliğini hesaplar.",
    ipucuSablonu: "Maksimum yükseklikte v = 0. H = v₀²/(2g). g = 10 m/s².",
    parametreler: {
      v0: { min: 10, max: 60, adim: 5, birim: 'm/s', tamsayi: true },
    },
    soruSablonu: (p) =>
      `${p.v0} m/s başlangıç hızıyla dikey yukarı atılan bir cisim en fazla kaç metre yükselebilir? (g = 10 m/s²)`,
    hesapla: (p) => (p.v0 * p.v0) / (2 * 10),
    cevapFormatla: (v) => `${v.toFixed(1)} m`,
    yanlisCevapStratejisi: 'karekok-hata',
    aciklamaSablonu: (p, c) =>
      `Maksimum yükseklikte v = 0:\nv² = v₀² − 2gH → H = v₀²/(2g)\nH = ${p.v0}² / (2×10) = ${p.v0 * p.v0} / 20 = ${c.toFixed(1)} m`,
  },

  // ─── 013: Dikey atış – maksimuma çıkma süresi (t = v₀/g) ────────────────────
  {
    id: 'n10-har-013',
    sinif: 10,
    konuId: 'kinematik-10',
    altKonuId: 'dikey-atis',
    zorluk: 2,
    tytMi: true,
    sure: 55,
    ilgiliFormul: 't_max = v₀ / g',
    kazanim: "Dikey atışta cismin maksimum yüksekliğe ulaşma süresini hesaplar.",
    ipucuSablonu: "Maksimumda v = 0: v = v₀ − gt → t = v₀/g.",
    parametreler: {
      v0: { min: 10, max: 60, adim: 5, birim: 'm/s', tamsayi: true },
    },
    soruSablonu: (p) =>
      `${p.v0} m/s hızla dikey yukarı atılan bir cisim kaç saniyede maksimum yüksekliğe ulaşır? (g = 10 m/s²)`,
    hesapla: (p) => p.v0 / 10,
    cevapFormatla: (v) => `${v.toFixed(1)} s`,
    yanlisCevapStratejisi: 'onlu-hata',
    aciklamaSablonu: (p, c) =>
      `Maksimumda v = 0: v = v₀ − g·t → t = v₀/g\nt = ${p.v0} / 10 = ${c.toFixed(1)} s`,
  },

  // ─── 014: Dikey atış – havada kalma süresi (T = 2v₀/g) ──────────────────────
  {
    id: 'n10-har-014',
    sinif: 10,
    konuId: 'kinematik-10',
    altKonuId: 'dikey-atis',
    zorluk: 2,
    tytMi: true,
    sure: 55,
    ilgiliFormul: 'T = 2v₀ / g',
    kazanim: "Dikey atışta cismin havada kalma süresini hesaplar.",
    ipucuSablonu: "Çıkış ve iniş simetrik: T = 2·v₀/g.",
    parametreler: {
      v0: { min: 10, max: 60, adim: 5, birim: 'm/s', tamsayi: true },
    },
    soruSablonu: (p) =>
      `${p.v0} m/s hızla dikey yukarı atılan bir cisim yerden ayrıldıktan kaç saniye sonra yere geri döner? (g = 10 m/s², hava direnci ihmal edilsin)`,
    hesapla: (p) => (2 * p.v0) / 10,
    cevapFormatla: (v) => `${v.toFixed(1)} s`,
    yanlisCevapStratejisi: 'sabit-carpan',
    aciklamaSablonu: (p, c) =>
      `Havada kalma süresi simetriden: T = 2·v₀/g\nT = 2×${p.v0} / 10 = ${2 * p.v0} / 10 = ${c.toFixed(1)} s`,
  },

  // ─── 015: Yatay atış – yere düşme süresi (t = √(2h/g)) ──────────────────────
  {
    id: 'n10-har-015',
    sinif: 10,
    konuId: 'kinematik-10',
    altKonuId: 'yatay-atis',
    zorluk: 3,
    tytMi: true,
    sure: 65,
    ilgiliFormul: 't = √(2h / g)',
    kazanim: "Yatay atışta cismin yere düşme süresini hesaplar.",
    ipucuSablonu: "Düşey hareket serbest düşüştür. t = √(2h/g). Yatay hız düşeyi etkilemez.",
    parametreler: {
      h: { min: 5, max: 200, adim: 5, birim: 'm', tamsayi: true },
    },
    soruSablonu: (p) =>
      `${p.h} m yüksekliğindeki bir platformdan yatay olarak atılan bir cisim kaç saniyede yere çarpar? (g = 10 m/s²)`,
    hesapla: (p) => Math.sqrt((2 * p.h) / 10),
    cevapFormatla: (v) => `${v.toFixed(1)} s`,
    yanlisCevapStratejisi: 'karekok-hata',
    aciklamaSablonu: (p, c) =>
      `Düşey: h = ½gt² → t = √(2h/g)\nt = √(2×${p.h}/10) = √${2 * p.h / 10} ≈ ${c.toFixed(1)} s`,
  },

  // ─── 016: Yatay atış – menzil (x = v₀ × √(2h/g)) ────────────────────────────
  {
    id: 'n10-har-016',
    sinif: 10,
    konuId: 'kinematik-10',
    altKonuId: 'yatay-atis',
    zorluk: 3,
    tytMi: true,
    sure: 70,
    ilgiliFormul: 'x = v₀ × √(2h / g)',
    kazanim: "Yatay atışta cismin yatay menzilini hesaplar.",
    ipucuSablonu: "x = v₀ × t; t = √(2h/g). Önce düşme süresini bul, sonra yatay yolu hesapla.",
    parametreler: {
      v0: { min: 5,  max: 40, adim: 5, birim: 'm/s', tamsayi: true },
      h:  { min: 5,  max: 80, adim: 5, birim: 'm',   tamsayi: true },
    },
    soruSablonu: (p) =>
      `${p.h} m yüksekliğinden ${p.v0} m/s yatay hızla atılan bir cisim yere çarpmadan önce yatayda kaç metre yol alır? (g = 10 m/s²)`,
    hesapla: (p) => p.v0 * Math.sqrt((2 * p.h) / 10),
    cevapFormatla: (v) => `${v.toFixed(1)} m`,
    yanlisCevapStratejisi: 'karekok-hata',
    aciklamaSablonu: (p, c) => {
      const t = Math.sqrt((2 * p.h) / 10);
      return `t = √(2h/g) = √(2×${p.h}/10) = ${t.toFixed(2)} s\nx = v₀×t = ${p.v0} × ${t.toFixed(2)} = ${c.toFixed(1)} m`;
    },
  },

  // ─── 017: Yatay atış – yere çarpma hızı (v = √(v₀² + vy²)) ─────────────────
  {
    id: 'n10-har-017',
    sinif: 10,
    konuId: 'kinematik-10',
    altKonuId: 'yatay-atis',
    zorluk: 4,
    tytMi: true,
    sure: 80,
    ilgiliFormul: 'v = √(v₀² + vᵧ²) ,  vᵧ = g × t',
    kazanim: "Yatay atışta cismin yere çarparkenki bileşke hızını hesaplar.",
    ipucuSablonu: "Düşey hız: vᵧ = g·t. Bileşke: v = √(v₀² + vᵧ²).",
    parametreler: {
      v0: { min: 5, max: 30, adim: 5, birim: 'm/s', tamsayi: true },
      h:  { min: 20, max: 200, adim: 20, birim: 'm', tamsayi: true },
    },
    soruSablonu: (p) =>
      `${p.h} m yüksekliğinden ${p.v0} m/s yatay hızla atılan bir cisim yere kaç m/s hızla çarpar? (g = 10 m/s²)`,
    hesapla: (p) => {
      const t = Math.sqrt((2 * p.h) / 10);
      const vy = 10 * t;
      return Math.sqrt(p.v0 * p.v0 + vy * vy);
    },
    cevapFormatla: (v) => `${v.toFixed(1)} m/s`,
    yanlisCevapStratejisi: 'karekok-hata',
    aciklamaSablonu: (p, c) => {
      const t  = Math.sqrt((2 * p.h) / 10);
      const vy = 10 * t;
      return `t = √(2h/g) = ${t.toFixed(2)} s\nvᵧ = g·t = 10 × ${t.toFixed(2)} = ${vy.toFixed(2)} m/s\nv = √(v₀² + vᵧ²) = √(${p.v0}² + ${vy.toFixed(2)}²) ≈ ${c.toFixed(1)} m/s`;
    },
  },

  // ─── 018: Dairesel hareket – periyot (T = 2πr/v) ────────────────────────────
  {
    id: 'n10-har-018',
    sinif: 10,
    konuId: 'dairesel-hareket-10',
    altKonuId: 'dairesel-hareket',
    zorluk: 2,
    tytMi: true,
    sure: 60,
    ilgiliFormul: 'T = 2π × r / v',
    kazanim: "Dairesel harekette periyodu T = 2πr/v formülüyle hesaplar.",
    ipucuSablonu: "T = 2πr/v. Çevre uzunluğu 2πr'yi hıza böl.",
    parametreler: {
      r: { min: 1, max: 20, adim: 1, birim: 'm',   tamsayi: true },
      v: { min: 1, max: 20, adim: 1, birim: 'm/s', tamsayi: true },
    },
    soruSablonu: (p) =>
      `Yarıçapı ${p.r} m olan dairesel bir yörüngede ${p.v} m/s sabit hızla hareket eden bir cismin periyodu kaç saniyedir? (π ≈ 3,14)`,
    hesapla: (p) => (2 * Math.PI * p.r) / p.v,
    cevapFormatla: (v) => `${v.toFixed(2)} s`,
    yanlisCevapStratejisi: 'sabit-carpan',
    aciklamaSablonu: (p, c) =>
      `T = 2πr / v = 2π × ${p.r} / ${p.v} = ${(2 * Math.PI * p.r).toFixed(2)} / ${p.v} = ${c.toFixed(2)} s`,
  },

  // ─── 019: Dairesel hareket – frekans (f = 1/T) ──────────────────────────────
  {
    id: 'n10-har-019',
    sinif: 10,
    konuId: 'dairesel-hareket-10',
    altKonuId: 'dairesel-hareket',
    zorluk: 2,
    tytMi: true,
    sure: 50,
    ilgiliFormul: 'f = 1 / T',
    kazanim: "Periyottan frekansı hesaplar.",
    ipucuSablonu: "f = 1/T. Periyodun tersini al.",
    parametreler: {
      T: { min: 1, max: 20, adim: 1, birim: 's', tamsayi: true },
    },
    soruSablonu: (p) =>
      `Periyodu ${p.T} s olan bir cismin dönme frekansı kaç Hz'dir?`,
    hesapla: (p) => 1 / p.T,
    cevapFormatla: (v) => `${v.toFixed(3)} Hz`,
    yanlisCevapStratejisi: 'ters-islem',
    aciklamaSablonu: (p, c) =>
      `f = 1/T = 1/${p.T} = ${c.toFixed(3)} Hz`,
  },

  // ─── 020: Dairesel hareket – merkezcil ivme (a = v²/r) ───────────────────────
  {
    id: 'n10-har-020',
    sinif: 10,
    konuId: 'dairesel-hareket-10',
    altKonuId: 'dairesel-hareket',
    zorluk: 2,
    tytMi: true,
    sure: 60,
    ilgiliFormul: 'a_c = v² / r',
    kazanim: "Dairesel harekette merkezcil ivmeyi hesaplar.",
    ipucuSablonu: "Merkezcil ivme: a = v²/r. Hızın karesini yarıçapa böl.",
    parametreler: {
      v: { min: 2, max: 30, adim: 2, birim: 'm/s', tamsayi: true },
      r: { min: 1, max: 20, adim: 1, birim: 'm',   tamsayi: true },
    },
    soruSablonu: (p) =>
      `${p.v} m/s hızla yarıçapı ${p.r} m olan dairesel yörüngede dönen bir cismin merkezcil ivmesi kaç m/s²'dir?`,
    hesapla: (p) => (p.v * p.v) / p.r,
    cevapFormatla: (v) => `${v.toFixed(2)} m/s²`,
    yanlisCevapStratejisi: 'karekok-hata',
    aciklamaSablonu: (p, c) =>
      `a_c = v²/r = ${p.v}²/${p.r} = ${p.v * p.v}/${p.r} = ${c.toFixed(2)} m/s²`,
  },

  // ─── 021: Dairesel hareket – merkezcil kuvvet (F = mv²/r) ───────────────────
  {
    id: 'n10-har-021',
    sinif: 10,
    konuId: 'dairesel-hareket-10',
    altKonuId: 'dairesel-hareket',
    zorluk: 3,
    tytMi: false,
    aytMi: true,
    sure: 65,
    ilgiliFormul: 'F_c = m × v² / r',
    kazanim: "Merkezcil kuvveti F = mv²/r formülüyle hesaplar.",
    ipucuSablonu: "F_c = mv²/r. Kütle, hız karesi ve yarıçapı dikkate al.",
    parametreler: {
      m: { min: 1,  max: 50, adim: 1, birim: 'kg',  tamsayi: true },
      v: { min: 2,  max: 20, adim: 2, birim: 'm/s', tamsayi: true },
      r: { min: 1,  max: 15, adim: 1, birim: 'm',   tamsayi: true },
    },
    soruSablonu: (p) =>
      `${p.m} kg kütleli bir cisim ${p.v} m/s hızla yarıçapı ${p.r} m olan dairesel yörüngede hareket etmektedir. Cisme etki eden merkezcil kuvvet kaç Newton'dur?`,
    hesapla: (p) => (p.m * p.v * p.v) / p.r,
    cevapFormatla: (v) => `${v.toFixed(1)} N`,
    yanlisCevapStratejisi: 'karekok-hata',
    aciklamaSablonu: (p, c) =>
      `F_c = m·v²/r = ${p.m}×${p.v}²/${p.r} = ${p.m * p.v * p.v}/${p.r} = ${c.toFixed(1)} N`,
  },

  // ─── 022: Bağıl hız – aynı yön (v_rel = v₁ − v₂) ────────────────────────────
  {
    id: 'n10-har-022',
    sinif: 10,
    konuId: 'kinematik-10',
    altKonuId: 'bagil-hiz',
    zorluk: 2,
    tytMi: false,
    aytMi: true,
    sure: 55,
    ilgiliFormul: 'v_bağıl = v₁ − v₂  (aynı yön)',
    kazanim: "Aynı yönde hareket eden iki cismin birbirine göre hızını hesaplar.",
    ipucuSablonu: "Aynı yönde: v_bağıl = v₁ − v₂ (hızlı olandan yavaşı çıkar).",
    parametreler: {
      v1: { min: 30, max: 120, adim: 5, birim: 'm/s', tamsayi: true },
      v2: { min: 5,  max: 29,  adim: 5, birim: 'm/s', tamsayi: true },
    },
    soruSablonu: (p) =>
      `Aynı yönde hareket eden iki araçtan birincisi ${p.v1} m/s, ikincisi ${p.v2} m/s hızla gitmektedir. Birinci aracın ikinciye göre bağıl hızı kaç m/s'dir?`,
    hesapla: (p) => p.v1 - p.v2,
    cevapFormatla: (v) => `${Math.round(v)} m/s`,
    yanlisCevapStratejisi: 'isaretli-hata',
    aciklamaSablonu: (p, c) =>
      `Aynı yönde bağıl hız:\nv_bağıl = v₁ − v₂ = ${p.v1} − ${p.v2} = ${Math.round(c)} m/s`,
  },

  // ─── 023: Bağıl hız – zıt yön (v_rel = v₁ + v₂) ─────────────────────────────
  {
    id: 'n10-har-023',
    sinif: 10,
    konuId: 'kinematik-10',
    altKonuId: 'bagil-hiz',
    zorluk: 2,
    tytMi: false,
    aytMi: true,
    sure: 55,
    ilgiliFormul: 'v_bağıl = v₁ + v₂  (zıt yön)',
    kazanim: "Karşılıklı hareket eden iki cismin birbirine göre hızını hesaplar.",
    ipucuSablonu: "Zıt yönde: v_bağıl = v₁ + v₂. Her iki hızı topla.",
    parametreler: {
      v1: { min: 10, max: 80, adim: 5, birim: 'm/s', tamsayi: true },
      v2: { min: 10, max: 80, adim: 5, birim: 'm/s', tamsayi: true },
    },
    soruSablonu: (p) =>
      `Birbirine doğru hareket eden iki araçtan birincisi ${p.v1} m/s, ikincisi ${p.v2} m/s hızla gitmektedir. Birinci aracın ikinciye göre bağıl hızı kaç m/s'dir?`,
    hesapla: (p) => p.v1 + p.v2,
    cevapFormatla: (v) => `${Math.round(v)} m/s`,
    yanlisCevapStratejisi: 'isaretli-hata',
    aciklamaSablonu: (p, c) =>
      `Zıt yönde bağıl hız:\nv_bağıl = v₁ + v₂ = ${p.v1} + ${p.v2} = ${Math.round(c)} m/s`,
  },

  // ─── 024: Grafik okuma – v-t grafiği alan = yer değiştirme ─────────────────
  {
    id: 'n10-har-024',
    sinif: 10,
    konuId: 'kinematik-10',
    altKonuId: 'grafik-okuma',
    zorluk: 3,
    tytMi: false,
    aytMi: true,
    sure: 70,
    ilgiliFormul: 'x = alan (v-t grafiği altındaki)',
    kazanim: "v-t grafiği altındaki alanın yer değiştirmeye eşit olduğunu uygular.",
    ipucuSablonu: "v-t grafiğinde alan = yer değiştirme. Dikdörtgen: v×t; üçgen: ½×v×t.",
    parametreler: {
      v: { min: 5,  max: 40, adim: 5, birim: 'm/s', tamsayi: true },
      t: { min: 4,  max: 20, adim: 2, birim: 's',   tamsayi: true },
    },
    soruSablonu: (p) =>
      `Bir v-t grafiğinde cisim ${p.t} s boyunca ${p.v} m/s sabit hızla hareket etmektedir. Cismin yer değiştirmesi kaç metredir? (Grafik yatay bir çizgidir.)`,
    hesapla: (p) => p.v * p.t,
    cevapFormatla: (v) => `${Math.round(v)} m`,
    yanlisCevapStratejisi: 'carpim-bolum-toplam',
    aciklamaSablonu: (p, c) =>
      `v-t grafiği altındaki alan = yer değiştirme\nDikdörtgen alan = v × t = ${p.v} × ${p.t} = ${Math.round(c)} m`,
  },

  // ─── 025: Ortalama hız (DAH: v_ort = (v₀+v)/2) ───────────────────────────────
  {
    id: 'n10-har-025',
    sinif: 10,
    konuId: 'kinematik-10',
    altKonuId: 'duzgun-ivmeli-hareket',
    zorluk: 2,
    tytMi: false,
    aytMi: true,
    sure: 50,
    ilgiliFormul: 'v_ort = (v₀ + v) / 2',
    kazanim: "Düzgün ivmeli harekette ortalama hızı hesaplar.",
    ipucuSablonu: "DAH'ta ortalama hız = (başlangıç hızı + son hız) / 2.",
    parametreler: {
      v0: { min: 0,  max: 20, adim: 2, birim: 'm/s', tamsayi: true },
      v:  { min: 10, max: 50, adim: 2, birim: 'm/s', tamsayi: true },
    },
    soruSablonu: (p) =>
      `Düzgün ivmeli hareket yapan bir cismin başlangıç hızı ${p.v0} m/s, son hızı ${p.v} m/s'dir. Cismin ortalama hızı kaç m/s'dir?`,
    hesapla: (p) => (p.v0 + p.v) / 2,
    cevapFormatla: (v) => `${v.toFixed(1)} m/s`,
    yanlisCevapStratejisi: 'aritmetik-hata',
    aciklamaSablonu: (p, c) =>
      `v_ort = (v₀ + v) / 2 = (${p.v0} + ${p.v}) / 2 = ${p.v0 + p.v} / 2 = ${c.toFixed(1)} m/s`,
  },

  // ─── 026: DAH – v²=v₀²+2ax'ten yol bul ──────────────────────────────────────
  {
    id: 'n10-har-026',
    sinif: 10,
    konuId: 'kinematik-10',
    altKonuId: 'duzgun-ivmeli-hareket',
    zorluk: 3,
    tytMi: false,
    aytMi: true,
    sure: 70,
    ilgiliFormul: 'x = (v² − v₀²) / (2a)',
    kazanim: "Başlangıç/son hız ve ivmeden kat edilen yolu hesaplar.",
    ipucuSablonu: "v² = v₀² + 2ax → x = (v² − v₀²)/(2a). Zamanı bilmeden yol bul!",
    parametreler: {
      v0: { min: 0,  max: 10, adim: 1, birim: 'm/s',  tamsayi: true },
      v:  { min: 15, max: 50, adim: 5, birim: 'm/s',  tamsayi: true },
      a:  { min: 1,  max: 8,  adim: 1, birim: 'm/s²', tamsayi: true },
    },
    soruSablonu: (p) =>
      `${p.v0} m/s başlangıç hızıyla hareket eden bir araç ${p.a} m/s² ivmeli hızlanmakta ve hızı ${p.v} m/s'ye ulaşmaktadır. Araç bu sürede kaç metre yol almıştır?`,
    hesapla: (p) => (p.v * p.v - p.v0 * p.v0) / (2 * p.a),
    cevapFormatla: (v) => `${v.toFixed(1)} m`,
    yanlisCevapStratejisi: 'karekok-hata',
    aciklamaSablonu: (p, c) =>
      `v² = v₀² + 2ax → x = (v² − v₀²)/(2a)\nx = (${p.v}² − ${p.v0}²) / (2×${p.a})\nx = (${p.v * p.v} − ${p.v0 * p.v0}) / ${2 * p.a}\nx = ${p.v * p.v - p.v0 * p.v0} / ${2 * p.a} = ${c.toFixed(1)} m`,
  },

  // ─── 027: Dairesel hareket – açısal hız (ω = 2π/T) ──────────────────────────
  {
    id: 'n10-har-027',
    sinif: 10,
    konuId: 'dairesel-hareket-10',
    altKonuId: 'acisal-hareket',
    zorluk: 3,
    tytMi: false,
    aytMi: true,
    sure: 60,
    ilgiliFormul: 'ω = 2π / T',
    kazanim: "Periyottan açısal hızı hesaplar.",
    ipucuSablonu: "ω = 2π/T. Periyottan 2π'yi böl.",
    parametreler: {
      T: { min: 1, max: 20, adim: 1, birim: 's', tamsayi: true },
    },
    soruSablonu: (p) =>
      `Periyodu ${p.T} s olan bir cismin açısal hızı kaç rad/s'dir? (π ≈ 3,14)`,
    hesapla: (p) => (2 * Math.PI) / p.T,
    cevapFormatla: (v) => `${v.toFixed(2)} rad/s`,
    yanlisCevapStratejisi: 'sabit-carpan',
    aciklamaSablonu: (p, c) =>
      `ω = 2π / T = 2π / ${p.T} = ${(2 * Math.PI).toFixed(2)} / ${p.T} = ${c.toFixed(2)} rad/s`,
  },

  // ─── 028: Açısal hızdan merkezcil ivme (a = ω²r) ─────────────────────────────
  {
    id: 'n10-har-028',
    sinif: 10,
    konuId: 'dairesel-hareket-10',
    altKonuId: 'acisal-hareket',
    zorluk: 3,
    tytMi: false,
    aytMi: true,
    sure: 65,
    ilgiliFormul: 'a_c = ω² × r',
    kazanim: "Açısal hız ve yarıçaptan merkezcil ivmeyi hesaplar.",
    ipucuSablonu: "a_c = ω²·r. Açısal hızın karesini yarıçapla çarp.",
    parametreler: {
      omega: { min: 1, max: 10, adim: 1, birim: 'rad/s', tamsayi: true },
      r:     { min: 1, max: 10, adim: 1, birim: 'm',     tamsayi: true },
    },
    soruSablonu: (p) =>
      `Açısal hızı ω = ${p.omega} rad/s ve yarıçapı r = ${p.r} m olan dairesel hareketteki bir cismin merkezcil ivmesi kaç m/s²'dir?`,
    hesapla: (p) => p.omega * p.omega * p.r,
    cevapFormatla: (v) => `${Math.round(v)} m/s²`,
    yanlisCevapStratejisi: 'karekok-hata',
    aciklamaSablonu: (p, c) =>
      `a_c = ω²·r = ${p.omega}² × ${p.r} = ${p.omega * p.omega} × ${p.r} = ${Math.round(c)} m/s²`,
  },

  // ─── 029: Açısal hızdan doğrusal hız (v = ω × r) ─────────────────────────────
  {
    id: 'n10-har-029',
    sinif: 10,
    konuId: 'dairesel-hareket-10',
    altKonuId: 'acisal-hareket',
    zorluk: 2,
    tytMi: false,
    aytMi: true,
    sure: 55,
    ilgiliFormul: 'v = ω × r',
    kazanim: "Açısal hız ve yarıçaptan teğetsel (doğrusal) hızı hesaplar.",
    ipucuSablonu: "v = ω × r. Açısal hızı yarıçapla çarp.",
    parametreler: {
      omega: { min: 1, max: 20, adim: 1, birim: 'rad/s', tamsayi: true },
      r:     { min: 1, max: 10, adim: 1, birim: 'm',     tamsayi: true },
    },
    soruSablonu: (p) =>
      `Açısal hızı ω = ${p.omega} rad/s olan bir cisim yarıçapı ${p.r} m olan dairesel yörüngede hareket etmektedir. Cismin teğetsel hızı kaç m/s'dir?`,
    hesapla: (p) => p.omega * p.r,
    cevapFormatla: (v) => `${Math.round(v)} m/s`,
    yanlisCevapStratejisi: 'carpim-bolum-toplam',
    aciklamaSablonu: (p, c) =>
      `v = ω × r = ${p.omega} × ${p.r} = ${Math.round(c)} m/s`,
  },

  // ─── 030: DAH çok adımlı – fren mesafesi ────────────────────────────────────
  {
    id: 'n10-har-030',
    sinif: 10,
    konuId: 'kinematik-10',
    altKonuId: 'duzgun-ivmeli-hareket',
    zorluk: 4,
    tytMi: false,
    aytMi: true,
    sure: 85,
    ilgiliFormul: 'x = (v² − v₀²) / (2a)  →  v = 0',
    kazanim: "Frenleme ivmesi ve başlangıç hızından araçların durmak için kat ettiği mesafeyi hesaplar.",
    ipucuSablonu: "Dur → son hız 0. x = v₀²/(2|a|). Önce km/h → m/s dönüşümü yap!",
    parametreler: {
      v0kmh: { min: 36,  max: 144, adim: 18, birim: 'km/h', tamsayi: true }, // 10–40 m/s
      a:     { min: 3,   max: 10,  adim: 1,  birim: 'm/s²', tamsayi: true },
    },
    soruSablonu: (p) =>
      `${p.v0kmh} km/h hızla giden bir araç ${p.a} m/s² yavaşlama ivmesiyle fren yapmaktadır. Araç tamamen durana kadar kaç metre yol alır?`,
    hesapla: (p) => {
      const v0 = p.v0kmh / 3.6;
      return (v0 * v0) / (2 * p.a);
    },
    cevapFormatla: (v) => `${v.toFixed(1)} m`,
    yanlisCevapStratejisi: 'birim-donusum',
    aciklamaSablonu: (p, c) => {
      const v0 = p.v0kmh / 3.6;
      return `v₀ = ${p.v0kmh} km/h = ${p.v0kmh}/3,6 = ${v0.toFixed(2)} m/s\nv = 0 (duruyor)\nv² = v₀² − 2ax → x = v₀²/(2a)\nx = ${v0.toFixed(2)}² / (2×${p.a}) = ${(v0 * v0).toFixed(2)} / ${2 * p.a} = ${c.toFixed(1)} m`;
    },
  },

];
