// ============================================================
// Fizik Yıldızı – Soru Şablonları: 9. Sınıf Mekanik
// ============================================================

import { SoruSablonu } from '../tipler';

export const sinif9MekanikSablonlar: SoruSablonu[] = [

  // ─── 001: Newton II – Net kuvvet bul (F = m × a) ────────────────────────────
  {
    id: 'n9-mek-001',
    sinif: 9,
    konuId: 'kuvvet-hareket-9',
    altKonuId: 'newton-ii',
    zorluk: 2,
    tytMi: true,
    sure: 50,
    ilgiliFormul: 'F = m × a',
    kazanim: "Newton'un ikinci hareket kanununu (F = m·a) uygulayarak net kuvveti hesaplar.",
    ipucuSablonu: "F = m × a formülünü kullan. Kütle kg, ivme m/s² cinsinden verilmiştir.",
    parametreler: {
      m: { min: 2, max: 60, adim: 1, birim: 'kg', tamsayi: true },
      a: { min: 1, max: 15, adim: 1, birim: 'm/s²', tamsayi: true },
    },
    soruSablonu: (p) =>
      `${p.m} kg kütleli bir cisim ${p.a} m/s² ivmeyle hareket ettirilmektedir. Cisme uygulanan net kuvvet kaç Newton'dur?`,
    hesapla: (p) => p.m * p.a,
    cevapFormatla: (v) => `${Math.round(v)} N`,
    yanlisCevapStratejisi: 'carpim-bolum-toplam',
    aciklamaSablonu: (p, c) =>
      `Newton'un II. Hareket Kanunu: F = m × a\nF = ${p.m} kg × ${p.a} m/s² = ${Math.round(c)} N`,
  },

  // ─── 002: Newton II ters – Kütleyi bul (m = F/a) ────────────────────────────
  {
    id: 'n9-mek-002',
    sinif: 9,
    konuId: 'kuvvet-hareket-9',
    altKonuId: 'newton-ii',
    zorluk: 2,
    tytMi: true,
    sure: 55,
    ilgiliFormul: 'm = F / a',
    kazanim: "F = m·a bağıntısından kütleyi hesaplar.",
    ipucuSablonu: "m = F / a formülünü kullan. Net kuvveti ivmeye böl.",
    parametreler: {
      F: { min: 10, max: 500, adim: 10, birim: 'N', tamsayi: true },
      a: { min: 1, max: 20, adim: 1, birim: 'm/s²', tamsayi: true },
    },
    soruSablonu: (p) =>
      `Bir cisme ${p.F} N'luk net kuvvet uygulandığında cisim ${p.a} m/s² ivme kazanmaktadır. Bu cismin kütlesi kaç kg'dır?`,
    hesapla: (p) => p.F / p.a,
    cevapFormatla: (v) => `${Math.round(v)} kg`,
    yanlisCevapStratejisi: 'ters-islem',
    aciklamaSablonu: (p, c) =>
      `F = m × a → m = F / a\nm = ${p.F} N / ${p.a} m/s² = ${Math.round(c)} kg`,
  },

  // ─── 003: Newton II ters – İvmeyi bul (a = F/m) ─────────────────────────────
  {
    id: 'n9-mek-003',
    sinif: 9,
    konuId: 'kuvvet-hareket-9',
    altKonuId: 'newton-ii',
    zorluk: 2,
    tytMi: true,
    sure: 55,
    ilgiliFormul: 'a = F / m',
    kazanim: "F = m·a bağıntısından ivmeyi hesaplar.",
    ipucuSablonu: "a = F / m formülünü kullan. Net kuvveti kütleye böl.",
    parametreler: {
      F: { min: 10, max: 400, adim: 10, birim: 'N', tamsayi: true },
      m: { min: 2, max: 50, adim: 1, birim: 'kg', tamsayi: true },
    },
    soruSablonu: (p) =>
      `${p.m} kg kütleli bir cisme ${p.F} N net kuvvet uygulanmaktadır. Cismin ivmesi kaç m/s²'dir?`,
    hesapla: (p) => p.F / p.m,
    cevapFormatla: (v) => `${v.toFixed(1)} m/s²`,
    yanlisCevapStratejisi: 'ters-islem',
    aciklamaSablonu: (p, c) =>
      `F = m × a → a = F / m\na = ${p.F} N / ${p.m} kg = ${c.toFixed(1)} m/s²`,
  },

  // ─── 004: Ağırlık kuvveti (G = mg) ──────────────────────────────────────────
  {
    id: 'n9-mek-004',
    sinif: 9,
    konuId: 'kuvvet-hareket-9',
    altKonuId: 'agirlik',
    zorluk: 1,
    tytMi: true,
    sure: 40,
    ilgiliFormul: 'G = m × g  (g = 10 m/s²)',
    kazanim: "Ağırlık kuvvetini G = m·g formülüyle hesaplar.",
    ipucuSablonu: "Yeryüzünde g = 10 m/s² alınır. Ağırlık G = m × g'dir.",
    parametreler: {
      m: { min: 1, max: 100, adim: 1, birim: 'kg', tamsayi: true },
    },
    soruSablonu: (p) =>
      `${p.m} kg kütleli bir cismin yeryüzündeki ağırlığı kaç Newton'dur? (g = 10 m/s²)`,
    hesapla: (p) => p.m * 10,
    cevapFormatla: (v) => `${Math.round(v)} N`,
    yanlisCevapStratejisi: 'onlu-hata',
    aciklamaSablonu: (p, c) =>
      `Ağırlık: G = m × g = ${p.m} kg × 10 m/s² = ${Math.round(c)} N`,
  },

  // ─── 005: Aynı yönlü iki kuvvet – bileşke ───────────────────────────────────
  {
    id: 'n9-mek-005',
    sinif: 9,
    konuId: 'kuvvet-hareket-9',
    altKonuId: 'bilesik-kuvvet',
    zorluk: 1,
    tytMi: true,
    sure: 45,
    ilgiliFormul: 'F_net = F₁ + F₂',
    kazanim: "Aynı doğrultuda aynı yönde etki eden kuvvetlerin bileşkesini bulur.",
    ipucuSablonu: "Aynı yönlü kuvvetler toplanır: F_net = F₁ + F₂.",
    parametreler: {
      F1: { min: 5, max: 200, adim: 5, birim: 'N', tamsayi: true },
      F2: { min: 5, max: 200, adim: 5, birim: 'N', tamsayi: true },
    },
    soruSablonu: (p) =>
      `Bir cisme aynı yönde ${p.F1} N ve ${p.F2} N büyüklüğünde iki kuvvet uygulanmaktadır. Bu iki kuvvetin bileşkesi kaç Newton'dur?`,
    hesapla: (p) => p.F1 + p.F2,
    cevapFormatla: (v) => `${Math.round(v)} N`,
    yanlisCevapStratejisi: 'carpim-bolum-toplam',
    aciklamaSablonu: (p, c) =>
      `Aynı yönlü kuvvetler toplanır:\nF_net = F₁ + F₂ = ${p.F1} N + ${p.F2} N = ${Math.round(c)} N`,
  },

  // ─── 006: Zıt yönlü iki kuvvet – bileşke ────────────────────────────────────
  {
    id: 'n9-mek-006',
    sinif: 9,
    konuId: 'kuvvet-hareket-9',
    altKonuId: 'bilesik-kuvvet',
    zorluk: 2,
    tytMi: true,
    sure: 50,
    ilgiliFormul: 'F_net = F₁ − F₂  (F₁ > F₂)',
    kazanim: "Zıt yönlü kuvvetlerin bileşkesini ve yönünü belirler.",
    ipucuSablonu: "Zıt yönlü kuvvetlerde büyükten küçüğü çıkar; yön büyük kuvvetin yönüdür.",
    parametreler: {
      F1: { min: 50, max: 300, adim: 10, birim: 'N', tamsayi: true },
      F2: { min: 10, max: 49,  adim: 5,  birim: 'N', tamsayi: true },
    },
    soruSablonu: (p) =>
      `Bir cisme sağa doğru ${p.F1} N, sola doğru ${p.F2} N kuvvet uygulanmaktadır. Net kuvvetin büyüklüğü kaç Newton'dur?`,
    hesapla: (p) => p.F1 - p.F2,
    cevapFormatla: (v) => `${Math.round(v)} N`,
    yanlisCevapStratejisi: 'isaretli-hata',
    aciklamaSablonu: (p, c) =>
      `Zıt yönlü kuvvetler:\nF_net = F₁ − F₂ = ${p.F1} N − ${p.F2} N = ${Math.round(c)} N (sağa doğru)`,
  },

  // ─── 007: Sürtünme kuvveti (f = μN) ─────────────────────────────────────────
  {
    id: 'n9-mek-007',
    sinif: 9,
    konuId: 'kuvvet-hareket-9',
    altKonuId: 'surtuinme',
    zorluk: 2,
    tytMi: true,
    sure: 55,
    ilgiliFormul: 'f = μ × N',
    kazanim: "Kinetik sürtünme kuvvetini f = μN formülüyle hesaplar.",
    ipucuSablonu: "f = μ × N; düz yüzeyde N = m × g'dir.",
    parametreler: {
      mu:  { min: 1, max: 5, adim: 1, birim: '', tamsayi: true },   // stored as tenths: 0.1–0.5
      m:   { min: 2, max: 50, adim: 1, birim: 'kg', tamsayi: true },
    },
    soruSablonu: (p) =>
      `${p.m} kg kütleli bir cisim yatay düzlemde hareket etmektedir. Cisim ile zemin arasındaki kinetik sürtünme katsayısı μ = 0.${p.mu} olduğuna göre sürtünme kuvveti kaç Newton'dur? (g = 10 m/s²)`,
    hesapla: (p) => (p.mu / 10) * p.m * 10,
    cevapFormatla: (v) => `${Math.round(v)} N`,
    yanlisCevapStratejisi: 'carpim-bolum-toplam',
    aciklamaSablonu: (p, c) =>
      `N = m × g = ${p.m} × 10 = ${p.m * 10} N\nf = μ × N = 0.${p.mu} × ${p.m * 10} N = ${Math.round(c)} N`,
  },

  // ─── 008: Eğik düzlemde sürtünme (f = μmgcosθ, θ=30°) ──────────────────────
  {
    id: 'n9-mek-008',
    sinif: 9,
    konuId: 'kuvvet-hareket-9',
    altKonuId: 'surtuinme',
    zorluk: 3,
    tytMi: true,
    sure: 70,
    ilgiliFormul: 'f = μ × m × g × cos30°',
    kazanim: "Eğik düzlemde sürtünme kuvvetini hesaplar; cos30° = √3/2 değerini kullanır.",
    ipucuSablonu: "Eğik düzlemde normal kuvvet N = mgcosθ'dir. cos30° = √3/2 ≈ 0,866.",
    parametreler: {
      mu10: { min: 1, max: 4, adim: 1, birim: '', tamsayi: true }, // μ = mu10/10
      m:    { min: 2, max: 20, adim: 1, birim: 'kg', tamsayi: true },
    },
    soruSablonu: (p) =>
      `${p.m} kg kütleli bir cisim 30° eğimli bir yüzeyde tutulmaktadır. Cisim ile yüzey arasındaki sürtünme katsayısı μ = 0.${p.mu10} olduğuna göre sürtünme kuvveti kaç Newton'dur? (g = 10 m/s², cos30° = √3/2)`,
    hesapla: (p) => (p.mu10 / 10) * p.m * 10 * (Math.sqrt(3) / 2),
    cevapFormatla: (v) => `${v.toFixed(1)} N`,
    yanlisCevapStratejisi: 'sin-cos-karisimi',
    aciklamaSablonu: (p, c) =>
      `N = m·g·cos30° = ${p.m} × 10 × (√3/2) = ${(p.m * 10 * Math.sqrt(3) / 2).toFixed(2)} N\nf = μN = 0.${p.mu10} × ${(p.m * 10 * Math.sqrt(3) / 2).toFixed(2)} = ${c.toFixed(1)} N`,
  },

  // ─── 009: Normal kuvvet – düz yüzey (N = mg) ────────────────────────────────
  {
    id: 'n9-mek-009',
    sinif: 9,
    konuId: 'kuvvet-hareket-9',
    altKonuId: 'normal-kuvvet',
    zorluk: 1,
    tytMi: true,
    sure: 40,
    ilgiliFormul: 'N = m × g',
    kazanim: "Yatay düzlemde hareketsiz duran cismin normal kuvvetini hesaplar.",
    ipucuSablonu: "Cisim dengede olduğundan N = G = m × g'dir.",
    parametreler: {
      m: { min: 1, max: 80, adim: 1, birim: 'kg', tamsayi: true },
    },
    soruSablonu: (p) =>
      `${p.m} kg kütleli bir cisim yatay düzlemde durmaktadır. Zemin cisime uyguladığı normal kuvvet kaç Newton'dur? (g = 10 m/s²)`,
    hesapla: (p) => p.m * 10,
    cevapFormatla: (v) => `${Math.round(v)} N`,
    yanlisCevapStratejisi: 'onlu-hata',
    aciklamaSablonu: (p, c) =>
      `Cisim dengede → N = G = m × g = ${p.m} × 10 = ${Math.round(c)} N`,
  },

  // ─── 010: Normal kuvvet – eğik düzlem (N = mgcosθ, θ=45°) ──────────────────
  {
    id: 'n9-mek-010',
    sinif: 9,
    konuId: 'kuvvet-hareket-9',
    altKonuId: 'normal-kuvvet',
    zorluk: 3,
    tytMi: true,
    sure: 65,
    ilgiliFormul: 'N = m × g × cos45°',
    kazanim: "Eğik düzlemde normal kuvveti N = mgcosθ formülüyle hesaplar.",
    ipucuSablonu: "Normal kuvvet eğik düzlemde N = mgcosθ'dir. cos45° = √2/2 ≈ 0,707.",
    parametreler: {
      m: { min: 2, max: 30, adim: 1, birim: 'kg', tamsayi: true },
    },
    soruSablonu: (p) =>
      `${p.m} kg kütleli bir cisim 45° eğimli bir yüzeyde durmaktadır. Yüzeyin cisme uyguladığı normal kuvvet kaç Newton'dur? (g = 10 m/s², cos45° = √2/2)`,
    hesapla: (p) => p.m * 10 * (Math.sqrt(2) / 2),
    cevapFormatla: (v) => `${v.toFixed(1)} N`,
    yanlisCevapStratejisi: 'sin-cos-karisimi',
    aciklamaSablonu: (p, c) =>
      `N = m·g·cos45° = ${p.m} × 10 × (√2/2) = ${c.toFixed(1)} N`,
  },

  // ─── 011: Atwood makinesi (a = (m1−m2)g / (m1+m2)) ─────────────────────────
  {
    id: 'n9-mek-011',
    sinif: 9,
    konuId: 'kuvvet-hareket-9',
    altKonuId: 'atwood',
    zorluk: 4,
    tytMi: true,
    sure: 80,
    ilgiliFormul: 'a = (m₁ − m₂) × g / (m₁ + m₂)',
    kazanim: "Atwood makinesi düzeneğinde sistemin ivmesini hesaplar.",
    ipucuSablonu: "Net kuvvet (m₁ − m₂)g, toplam kütle (m₁ + m₂)'dir. a = F_net / m_toplam.",
    parametreler: {
      m1: { min: 4, max: 20, adim: 1, birim: 'kg', tamsayi: true },
      m2: { min: 1, max: 3,  adim: 1, birim: 'kg', tamsayi: true },  // m2 = m1 − delta
    },
    soruSablonu: (p) => {
      const M1 = p.m1 + p.m2;
      const M2 = p.m1;
      return `Atwood makinesinde iki ağırlıktan birinin kütlesi ${M1} kg, diğerinin kütlesi ${M2} kg'dır. Sistemin ivmesi kaç m/s²'dir? (g = 10 m/s²)`;
    },
    hesapla: (p) => {
      const M1 = p.m1 + p.m2;
      const M2 = p.m1;
      return (M1 - M2) * 10 / (M1 + M2);
    },
    cevapFormatla: (v) => `${v.toFixed(2)} m/s²`,
    yanlisCevapStratejisi: 'carpim-bolum-toplam',
    aciklamaSablonu: (p, c) => {
      const M1 = p.m1 + p.m2;
      const M2 = p.m1;
      return `a = (m₁ − m₂)g / (m₁ + m₂)\na = (${M1} − ${M2}) × 10 / (${M1} + ${M2})\na = ${(M1 - M2) * 10} / ${M1 + M2} = ${c.toFixed(2)} m/s²`;
    },
  },

  // ─── 012: Asansörde terazi – yukarı gidiş (N = m(g+a)) ──────────────────────
  {
    id: 'n9-mek-012',
    sinif: 9,
    konuId: 'kuvvet-hareket-9',
    altKonuId: 'asansor',
    zorluk: 3,
    tytMi: true,
    sure: 65,
    ilgiliFormul: 'N = m × (g + a)',
    kazanim: "Yukarı ivmeli hareket eden asansörde terazinin gösterdiği kuvveti hesaplar.",
    ipucuSablonu: "Asansör yukarı ivmelenirken görünür ağırlık artar: N = m(g + a).",
    parametreler: {
      m: { min: 40, max: 100, adim: 5,  birim: 'kg', tamsayi: true },
      a: { min: 1,  max: 5,   adim: 1,  birim: 'm/s²', tamsayi: true },
    },
    soruSablonu: (p) =>
      `${p.m} kg kütleli bir kişi ${p.a} m/s² ivmeyle yukarı çıkan bir asansördedir. Kişinin terazi üzerindeki görünür ağırlığı kaç Newton'dur? (g = 10 m/s²)`,
    hesapla: (p) => p.m * (10 + p.a),
    cevapFormatla: (v) => `${Math.round(v)} N`,
    yanlisCevapStratejisi: 'isaretli-hata',
    aciklamaSablonu: (p, c) =>
      `Yukarı ivmeli harekette: N = m(g + a)\nN = ${p.m} × (10 + ${p.a}) = ${p.m} × ${10 + p.a} = ${Math.round(c)} N`,
  },

  // ─── 013: Yay kuvveti – uzamayı bul (x = F/k) ───────────────────────────────
  {
    id: 'n9-mek-013',
    sinif: 9,
    konuId: 'kuvvet-hareket-9',
    altKonuId: 'yay-kuvveti',
    zorluk: 2,
    tytMi: true,
    sure: 55,
    ilgiliFormul: 'F = k × x  →  x = F / k',
    kazanim: "Hooke Yasası'nı kullanarak yayın uzamasını hesaplar.",
    ipucuSablonu: "Hooke Yasası: F = kx → x = F/k. Uzama metre cinsinden bulunur.",
    parametreler: {
      F: { min: 10, max: 200, adim: 10, birim: 'N', tamsayi: true },
      k: { min: 50, max: 500, adim: 50, birim: 'N/m', tamsayi: true },
    },
    soruSablonu: (p) =>
      `Yay sabiti k = ${p.k} N/m olan bir yaya ${p.F} N kuvvet uygulanmaktadır. Yayın uzaması kaç cm'dir?`,
    hesapla: (p) => (p.F / p.k) * 100,   // cm
    cevapFormatla: (v) => `${v.toFixed(1)} cm`,
    yanlisCevapStratejisi: 'ters-islem',
    aciklamaSablonu: (p, c) =>
      `F = k × x → x = F/k\nx = ${p.F} N / ${p.k} N/m = ${(p.F / p.k).toFixed(3)} m = ${c.toFixed(1)} cm`,
  },

  // ─── 014: Yay kuvveti – k'yı bul (k = F/x) ─────────────────────────────────
  {
    id: 'n9-mek-014',
    sinif: 9,
    konuId: 'kuvvet-hareket-9',
    altKonuId: 'yay-kuvveti',
    zorluk: 2,
    tytMi: true,
    sure: 55,
    ilgiliFormul: 'k = F / x',
    kazanim: "Uygulanan kuvvet ve uzamadan yay sabitini hesaplar.",
    ipucuSablonu: "k = F / x. Uzamayı önce metreye çevir, sonra böl.",
    parametreler: {
      F:  { min: 20, max: 300, adim: 20, birim: 'N', tamsayi: true },
      xcm: { min: 2,  max: 20,  adim: 2,  birim: 'cm', tamsayi: true },
    },
    soruSablonu: (p) =>
      `Bir yay ${p.F} N kuvvetle ${p.xcm} cm uzamaktadır. Bu yayın yay sabiti kaç N/m'dir?`,
    hesapla: (p) => p.F / (p.xcm / 100),
    cevapFormatla: (v) => `${Math.round(v)} N/m`,
    yanlisCevapStratejisi: 'birim-donusum',
    aciklamaSablonu: (p, c) =>
      `k = F / x\nx = ${p.xcm} cm = ${p.xcm / 100} m\nk = ${p.F} N / ${p.xcm / 100} m = ${Math.round(c)} N/m`,
  },

  // ─── 015: Basınç (P = F/A) ───────────────────────────────────────────────────
  {
    id: 'n9-mek-015',
    sinif: 9,
    konuId: 'basinc-9',
    altKonuId: 'basinc',
    zorluk: 2,
    tytMi: true,
    sure: 50,
    ilgiliFormul: 'P = F / A',
    kazanim: "Katılarda basıncı P = F/A formülüyle hesaplar.",
    ipucuSablonu: "Basınç = Kuvvet / Alan. Alan m² cinsinden olmalı.",
    parametreler: {
      F: { min: 100, max: 2000, adim: 100, birim: 'N', tamsayi: true },
      A: { min: 1,   max: 10,   adim: 1,   birim: 'm²', tamsayi: true },
    },
    soruSablonu: (p) =>
      `Bir yüzeye ${p.F} N kuvvet uygulanmaktadır. Temas alanı ${p.A} m² olduğuna göre basınç kaç Pa'dır?`,
    hesapla: (p) => p.F / p.A,
    cevapFormatla: (v) => `${Math.round(v)} Pa`,
    yanlisCevapStratejisi: 'ters-islem',
    aciklamaSablonu: (p, c) =>
      `P = F / A = ${p.F} N / ${p.A} m² = ${Math.round(c)} Pa`,
  },

  // ─── 016: Basınç – alanı bul (A = F/P) ──────────────────────────────────────
  {
    id: 'n9-mek-016',
    sinif: 9,
    konuId: 'basinc-9',
    altKonuId: 'basinc',
    zorluk: 2,
    tytMi: true,
    sure: 55,
    ilgiliFormul: 'A = F / P',
    kazanim: "P = F/A bağıntısından temas alanını hesaplar.",
    ipucuSablonu: "A = F / P. Kuvveti basınca böl.",
    parametreler: {
      F: { min: 200, max: 2000, adim: 100, birim: 'N', tamsayi: true },
      P: { min: 100, max: 1000, adim: 100, birim: 'Pa', tamsayi: true },
    },
    soruSablonu: (p) =>
      `Bir yüzeye ${p.F} N kuvvet uygulandığında oluşan basınç ${p.P} Pa olmaktadır. Bu yüzeyin temas alanı kaç m²'dir?`,
    hesapla: (p) => p.F / p.P,
    cevapFormatla: (v) => `${v.toFixed(2)} m²`,
    yanlisCevapStratejisi: 'ters-islem',
    aciklamaSablonu: (p, c) =>
      `P = F/A → A = F/P\nA = ${p.F} N / ${p.P} Pa = ${c.toFixed(2)} m²`,
  },

  // ─── 017: İmpuls (J = F × Δt) ───────────────────────────────────────────────
  {
    id: 'n9-mek-017',
    sinif: 9,
    konuId: 'momentum-9',
    altKonuId: 'impuls',
    zorluk: 2,
    tytMi: true,
    sure: 50,
    ilgiliFormul: 'J = F × Δt',
    kazanim: "İmpuls kavramını kullanarak J = FΔt hesabını yapar.",
    ipucuSablonu: "İmpuls = Kuvvet × Zaman. J = F × Δt bağıntısını kullan.",
    parametreler: {
      F:  { min: 10, max: 500, adim: 10, birim: 'N', tamsayi: true },
      dt: { min: 1,  max: 20,  adim: 1,  birim: 's', tamsayi: true },
    },
    soruSablonu: (p) =>
      `Bir cisme ${p.F} N büyüklüğünde sabit bir kuvvet ${p.dt} s süreyle uygulanmaktadır. Cisme uygulanan impuls kaç N·s'dir?`,
    hesapla: (p) => p.F * p.dt,
    cevapFormatla: (v) => `${Math.round(v)} N·s`,
    yanlisCevapStratejisi: 'carpim-bolum-toplam',
    aciklamaSablonu: (p, c) =>
      `J = F × Δt = ${p.F} N × ${p.dt} s = ${Math.round(c)} N·s`,
  },

  // ─── 018: Momentum (p = mv) ──────────────────────────────────────────────────
  {
    id: 'n9-mek-018',
    sinif: 9,
    konuId: 'momentum-9',
    altKonuId: 'momentum',
    zorluk: 1,
    tytMi: true,
    sure: 45,
    ilgiliFormul: 'p = m × v',
    kazanim: "Momentumu p = mv formülüyle hesaplar.",
    ipucuSablonu: "Momentum = kütle × hız. p = m × v.",
    parametreler: {
      m: { min: 1,  max: 100, adim: 1,  birim: 'kg',  tamsayi: true },
      v: { min: 1,  max: 30,  adim: 1,  birim: 'm/s', tamsayi: true },
    },
    soruSablonu: (p) =>
      `${p.m} kg kütleli bir cisim ${p.v} m/s hızla hareket etmektedir. Cismin momentumu kaç kg·m/s'dir?`,
    hesapla: (p) => p.m * p.v,
    cevapFormatla: (v) => `${Math.round(v)} kg·m/s`,
    yanlisCevapStratejisi: 'carpim-bolum-toplam',
    aciklamaSablonu: (p, c) =>
      `p = m × v = ${p.m} kg × ${p.v} m/s = ${Math.round(c)} kg·m/s`,
  },

  // ─── 019: Momentum değişimi (Δp = mΔv) ──────────────────────────────────────
  {
    id: 'n9-mek-019',
    sinif: 9,
    konuId: 'momentum-9',
    altKonuId: 'momentum',
    zorluk: 2,
    tytMi: true,
    sure: 60,
    ilgiliFormul: 'Δp = m × Δv = m × (v₂ − v₁)',
    kazanim: "Cismin momentum değişimini Δp = mΔv bağıntısıyla hesaplar.",
    ipucuSablonu: "Δp = m × (v₂ − v₁). Son hızdan başlangıç hızını çıkar, kütleyle çarp.",
    parametreler: {
      m:  { min: 1, max: 50, adim: 1, birim: 'kg',  tamsayi: true },
      v1: { min: 1, max: 10, adim: 1, birim: 'm/s', tamsayi: true },
      v2: { min: 11, max: 30, adim: 1, birim: 'm/s', tamsayi: true },
    },
    soruSablonu: (p) =>
      `${p.m} kg kütleli bir cismin hızı ${p.v1} m/s'den ${p.v2} m/s'ye çıkmaktadır. Cismin momentum değişimi kaç kg·m/s'dir?`,
    hesapla: (p) => p.m * (p.v2 - p.v1),
    cevapFormatla: (v) => `${Math.round(v)} kg·m/s`,
    yanlisCevapStratejisi: 'isaretli-hata',
    aciklamaSablonu: (p, c) =>
      `Δp = m × (v₂ − v₁)\nΔp = ${p.m} kg × (${p.v2} − ${p.v1}) m/s = ${p.m} × ${p.v2 - p.v1} = ${Math.round(c)} kg·m/s`,
  },

  // ─── 020: Momentum korunumu – tamamen esnek olmayan çarpışma ────────────────
  {
    id: 'n9-mek-020',
    sinif: 9,
    konuId: 'momentum-9',
    altKonuId: 'momentum-korulumu',
    zorluk: 4,
    tytMi: true,
    sure: 80,
    ilgiliFormul: 'm₁v₁ = (m₁ + m₂) × v\'',
    kazanim: "Momentum korunumu ilkesini tamamen esnek olmayan çarpışmaya uygular.",
    ipucuSablonu: "Çarpışma sonrası cisimler birleşiyor: m₁v₁ = (m₁+m₂)v'. v' = m₁v₁/(m₁+m₂).",
    parametreler: {
      m1: { min: 2, max: 20, adim: 1, birim: 'kg',  tamsayi: true },
      v1: { min: 3, max: 20, adim: 1, birim: 'm/s', tamsayi: true },
      m2: { min: 2, max: 10, adim: 1, birim: 'kg',  tamsayi: true },
    },
    soruSablonu: (p) =>
      `${p.m1} kg kütleli ve ${p.v1} m/s hızla hareket eden bir cisim, durgun hâldeki ${p.m2} kg kütleli bir cisme çarparak yapışmaktadır. Çarpışma sonrası ortak hız kaç m/s'dir?`,
    hesapla: (p) => (p.m1 * p.v1) / (p.m1 + p.m2),
    cevapFormatla: (v) => `${v.toFixed(2)} m/s`,
    yanlisCevapStratejisi: 'carpim-bolum-toplam',
    aciklamaSablonu: (p, c) =>
      `Momentum korunumu: m₁v₁ = (m₁ + m₂)v'\nv' = m₁v₁ / (m₁ + m₂)\nv' = ${p.m1} × ${p.v1} / (${p.m1} + ${p.m2})\nv' = ${p.m1 * p.v1} / ${p.m1 + p.m2} = ${c.toFixed(2)} m/s`,
  },

  // ─── 021: Tork (τ = F × d) ───────────────────────────────────────────────────
  {
    id: 'n9-mek-021',
    sinif: 9,
    konuId: 'kuvvet-hareket-9',
    altKonuId: 'tork',
    zorluk: 2,
    tytMi: true,
    sure: 55,
    ilgiliFormul: 'τ = F × d',
    kazanim: "Tork kavramını ve τ = F·d formülünü kullanarak torku hesaplar.",
    ipucuSablonu: "Tork = Kuvvet × Kol Uzunluğu. τ = F × d.",
    parametreler: {
      F: { min: 5,  max: 200, adim: 5,  birim: 'N', tamsayi: true },
      d: { min: 1,  max: 10,  adim: 1,  birim: 'm', tamsayi: true },
    },
    soruSablonu: (p) =>
      `Bir döndürme eksenine ${p.d} m uzaklıkta ${p.F} N kuvvet uygulanmaktadır. Bu kuvvetin oluşturduğu tork kaç N·m'dir?`,
    hesapla: (p) => p.F * p.d,
    cevapFormatla: (v) => `${Math.round(v)} N·m`,
    yanlisCevapStratejisi: 'carpim-bolum-toplam',
    aciklamaSablonu: (p, c) =>
      `τ = F × d = ${p.F} N × ${p.d} m = ${Math.round(c)} N·m`,
  },

  // ─── 022: Tork dengesi – F2'yi bul (F₁d₁ = F₂d₂) ───────────────────────────
  {
    id: 'n9-mek-022',
    sinif: 9,
    konuId: 'kuvvet-hareket-9',
    altKonuId: 'tork',
    zorluk: 3,
    tytMi: true,
    sure: 65,
    ilgiliFormul: 'F₁ × d₁ = F₂ × d₂',
    kazanim: "Tork denge koşulunu kullanarak bilinmeyen kuvveti hesaplar.",
    ipucuSablonu: "Denge: F₁d₁ = F₂d₂ → F₂ = F₁d₁/d₂.",
    parametreler: {
      F1: { min: 10, max: 200, adim: 10, birim: 'N', tamsayi: true },
      d1: { min: 1,  max: 5,   adim: 1,  birim: 'm', tamsayi: true },
      d2: { min: 2,  max: 8,   adim: 1,  birim: 'm', tamsayi: true },
    },
    soruSablonu: (p) =>
      `Bir kaldıraçta F₁ = ${p.F1} N kuvvet eksenden ${p.d1} m, F₂ kuvvet ise ${p.d2} m uzaklıkta uygulanmaktadır. Kaldıraç dengede olduğuna göre F₂ kaç Newton'dur?`,
    hesapla: (p) => (p.F1 * p.d1) / p.d2,
    cevapFormatla: (v) => `${v.toFixed(1)} N`,
    yanlisCevapStratejisi: 'ters-islem',
    aciklamaSablonu: (p, c) =>
      `Tork dengesi: F₁d₁ = F₂d₂\nF₂ = F₁d₁ / d₂ = ${p.F1} × ${p.d1} / ${p.d2} = ${p.F1 * p.d1} / ${p.d2} = ${c.toFixed(1)} N`,
  },

  // ─── 023: Tork dengesi – d2'yi bul ──────────────────────────────────────────
  {
    id: 'n9-mek-023',
    sinif: 9,
    konuId: 'kuvvet-hareket-9',
    altKonuId: 'tork',
    zorluk: 3,
    tytMi: true,
    sure: 65,
    ilgiliFormul: 'd₂ = F₁ × d₁ / F₂',
    kazanim: "Tork denge koşulunu kullanarak bilinmeyen kol uzunluğunu hesaplar.",
    ipucuSablonu: "d₂ = F₁d₁ / F₂. Torku F₂'ye böl.",
    parametreler: {
      F1: { min: 20, max: 300, adim: 20, birim: 'N', tamsayi: true },
      d1: { min: 1,  max: 6,   adim: 1,  birim: 'm', tamsayi: true },
      F2: { min: 10, max: 150, adim: 10, birim: 'N', tamsayi: true },
    },
    soruSablonu: (p) =>
      `Bir kaldıraçta ${p.F1} N kuvvet eksenden ${p.d1} m uzaklıkta uygulanmaktadır. Karşı tarafta ${p.F2} N kuvvet uygulandığında kaldıraç dengeye geliyor. Bu kuvvetin eksene uzaklığı kaç metredir?`,
    hesapla: (p) => (p.F1 * p.d1) / p.F2,
    cevapFormatla: (v) => `${v.toFixed(2)} m`,
    yanlisCevapStratejisi: 'ters-islem',
    aciklamaSablonu: (p, c) =>
      `F₁d₁ = F₂d₂ → d₂ = F₁d₁ / F₂\nd₂ = ${p.F1} × ${p.d1} / ${p.F2} = ${p.F1 * p.d1} / ${p.F2} = ${c.toFixed(2)} m`,
  },

  // ─── 024: İki kütlenin ağırlık merkezi (çubuk üzerinde) ─────────────────────
  {
    id: 'n9-mek-024',
    sinif: 9,
    konuId: 'kuvvet-hareket-9',
    altKonuId: 'agirlik-merkezi',
    zorluk: 3,
    tytMi: true,
    sure: 70,
    ilgiliFormul: 'x_cg = (m₁x₁ + m₂x₂) / (m₁ + m₂)',
    kazanim: "İki kütleli sistemin ağırlık merkezini hesaplar.",
    ipucuSablonu: "Ağırlık merkezi: x_cg = (m₁x₁ + m₂x₂)/(m₁+m₂). Sol uctan mesafeyi bul.",
    parametreler: {
      m1: { min: 2, max: 20, adim: 1, birim: 'kg', tamsayi: true },
      x1: { min: 0, max: 1,  adim: 1, birim: 'm',  tamsayi: true },   // sol uç = 0
      m2: { min: 2, max: 20, adim: 1, birim: 'kg', tamsayi: true },
      L:  { min: 4, max: 10, adim: 1, birim: 'm',  tamsayi: true },   // x2 = L
    },
    soruSablonu: (p) =>
      `Uzunluğu ${p.L} m olan yatay bir çubuğun sol ucuna ${p.m1} kg, sağ ucuna ${p.m2} kg kütleler asılmaktadır. Sistemin ağırlık merkezi sol uca kaç metre uzaklıktadır? (Çubuğun kütlesi ihmal edilsin.)`,
    hesapla: (p) => (p.m1 * 0 + p.m2 * p.L) / (p.m1 + p.m2),
    cevapFormatla: (v) => `${v.toFixed(2)} m`,
    yanlisCevapStratejisi: 'carpim-bolum-toplam',
    aciklamaSablonu: (p, c) =>
      `x_cg = (m₁·x₁ + m₂·x₂) / (m₁ + m₂)\nx₁ = 0 m (sol uç), x₂ = ${p.L} m (sağ uç)\nx_cg = (${p.m1}×0 + ${p.m2}×${p.L}) / (${p.m1} + ${p.m2})\nx_cg = ${p.m2 * p.L} / ${p.m1 + p.m2} = ${c.toFixed(2)} m`,
  },

  // ─── 025: Sürtünme katsayısı ve normal kuvvetle sürtünme ────────────────────
  {
    id: 'n9-mek-025',
    sinif: 9,
    konuId: 'kuvvet-hareket-9',
    altKonuId: 'surtuinme',
    zorluk: 2,
    tytMi: true,
    sure: 60,
    ilgiliFormul: 'f = μ × N',
    kazanim: "Normal kuvvet ve sürtünme katsayısından sürtünme kuvvetini hesaplar; Newton II ile birleştirir.",
    ipucuSablonu: "f = μN; sonra net kuvvet ile ivmeyi bul: a = (F_uygulanan − f) / m.",
    parametreler: {
      m:   { min: 5,  max: 40, adim: 5,  birim: 'kg', tamsayi: true },
      mu2: { min: 1,  max: 4,  adim: 1,  birim: '',   tamsayi: true },  // μ = mu2/10
      Fapp:{ min: 50, max: 300, adim: 10, birim: 'N', tamsayi: true },
    },
    soruSablonu: (p) =>
      `${p.m} kg kütleli bir cisim yatay düzlemde ${p.Fapp} N kuvvetle itilmektedir. Zemin ile cisim arasındaki kinetik sürtünme katsayısı μ = 0.${p.mu2} olduğuna göre cismin ivmesi kaç m/s²'dir? (g = 10 m/s²)`,
    hesapla: (p) => {
      const f = (p.mu2 / 10) * p.m * 10;
      return (p.Fapp - f) / p.m;
    },
    cevapFormatla: (v) => `${v.toFixed(2)} m/s²`,
    yanlisCevapStratejisi: 'carpim-bolum-toplam',
    aciklamaSablonu: (p, c) => {
      const N = p.m * 10;
      const f = (p.mu2 / 10) * N;
      const Fnet = p.Fapp - f;
      return `N = m·g = ${p.m} × 10 = ${N} N\nf = μN = 0.${p.mu2} × ${N} = ${f} N\nF_net = F_app − f = ${p.Fapp} − ${f} = ${Fnet} N\na = F_net / m = ${Fnet} / ${p.m} = ${c.toFixed(2)} m/s²`;
    },
  },

];
