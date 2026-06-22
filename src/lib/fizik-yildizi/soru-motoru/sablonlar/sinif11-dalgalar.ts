// ============================================================
// Fizik Yıldızı – 11. Sınıf Dalgalar Şablonları
// ============================================================

import { SoruSablonu } from '../tipler';

export const sinif11DalgalarSablonlar: SoruSablonu[] = [

  // ─── 1. Dalga Hızı (v = λ * f) ───────────────────────────────────────────────
  {
    id: 'dalgalar-11-01-dalga-hizi',
    sinif: 11,
    konuId: 'dalgalar-11',
    altKonuId: 'dalga-temelleri',
    zorluk: 1,
    aytMi: true,
    ilgiliFormul: 'v = λ × f',
    kazanim: 'Dalga hızını dalga boyu ve frekans cinsinden hesaplar.',
    sure: 60,
    ipucuSablonu: 'v = λ × f formülünü kullan.',

    parametreler: {
      lambda: { min: 0.2, max: 10, adim: 0.2, birim: 'm' },
      f: { min: 20, max: 1000, adim: 20, birim: 'Hz', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Dalga boyu ${p.lambda} m olan bir sesin frekansı ${p.f} Hz'dir. ` +
      `Bu sesin hızı kaç m/s'dir?`,

    hesapla: (p) => p.lambda * p.f,

    cevapFormatla: (d) => `${parseFloat(d.toFixed(2))} m/s`,

    yanlisCevapStratejisi: 'carpim-bolum-toplam',

    aciklamaSablonu: (p, d) =>
      `v = λ × f formülünü uygulayalım:\n` +
      `v = ${p.lambda} × ${p.f} = ${d} m/s`,
  },

  // ─── 2. Dalga Boyunu Bul (λ = v / f) ─────────────────────────────────────────
  {
    id: 'dalgalar-11-02-dalga-boyu',
    sinif: 11,
    konuId: 'dalgalar-11',
    altKonuId: 'dalga-temelleri',
    zorluk: 1,
    aytMi: true,
    ilgiliFormul: 'λ = v / f',
    kazanim: 'Dalga hızı ve frekans verildiğinde dalga boyunu hesaplar.',
    sure: 60,
    ipucuSablonu: 'λ = v / f formülünü kullan.',

    parametreler: {
      v: { degerler: [340, 350, 360, 400, 1500, 3000], birim: 'm/s' },
      f: { min: 100, max: 2000, adim: 100, birim: 'Hz', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Hızı ${p.v} m/s olan bir dalganın frekansı ${p.f} Hz'dir. ` +
      `Bu dalganın dalga boyu kaç m'dir?`,

    hesapla: (p) => p.v / p.f,

    cevapFormatla: (d) => `${parseFloat(d.toFixed(3))} m`,

    yanlisCevapStratejisi: 'ters-islem',

    aciklamaSablonu: (p, d) =>
      `λ = v / f formülünü uygulayalım:\n` +
      `λ = ${p.v} / ${p.f} = ${d} m`,
  },

  // ─── 3. Frekansı Bul (f = v / λ) ─────────────────────────────────────────────
  {
    id: 'dalgalar-11-03-frekans-bul',
    sinif: 11,
    konuId: 'dalgalar-11',
    altKonuId: 'dalga-temelleri',
    zorluk: 1,
    aytMi: true,
    ilgiliFormul: 'f = v / λ',
    kazanim: 'Dalga hızı ve dalga boyu verildiğinde frekansı hesaplar.',
    sure: 60,
    ipucuSablonu: 'f = v / λ formülünü kullan.',

    parametreler: {
      v: { degerler: [340, 350, 360, 400, 1500], birim: 'm/s' },
      lambda: { degerler: [0.1, 0.2, 0.25, 0.4, 0.5, 1.0, 2.0], birim: 'm' },
    },

    soruSablonu: (p) =>
      `Hızı ${p.v} m/s olan bir dalganın dalga boyu ${p.lambda} m'dir. ` +
      `Bu dalganın frekansı kaç Hz'dir?`,

    hesapla: (p) => p.v / p.lambda,

    cevapFormatla: (d) => `${parseFloat(d.toFixed(1))} Hz`,

    yanlisCevapStratejisi: 'ters-islem',

    aciklamaSablonu: (p, d) =>
      `f = v / λ formülünü uygulayalım:\n` +
      `f = ${p.v} / ${p.lambda} = ${d} Hz`,
  },

  // ─── 4. Periyot-Frekans İlişkisi (T = 1/f) ───────────────────────────────────
  {
    id: 'dalgalar-11-04-periyot-frekans',
    sinif: 11,
    konuId: 'dalgalar-11',
    altKonuId: 'dalga-temelleri',
    zorluk: 1,
    aytMi: true,
    ilgiliFormul: 'T = 1 / f',
    kazanim: 'Periyot ve frekans arasındaki ters orantı ilişkisini kullanır.',
    sure: 45,
    ipucuSablonu: 'T = 1/f veya f = 1/T formülünü kullan.',

    parametreler: {
      f: { degerler: [0.5, 1, 2, 4, 5, 10, 20, 25, 50, 100, 200, 250, 500], birim: 'Hz' },
    },

    soruSablonu: (p) =>
      `Frekansı ${p.f} Hz olan bir dalganın periyodu kaç s'dir?`,

    hesapla: (p) => 1 / p.f,

    cevapFormatla: (d) => `${parseFloat(d.toFixed(4))} s`,

    yanlisCevapStratejisi: 'ters-islem',

    aciklamaSablonu: (p, d) =>
      `T = 1 / f formülünü uygulayalım:\n` +
      `T = 1 / ${p.f} = ${d} s`,
  },

  // ─── 5. Havada Ses Hızı (v ≈ 331 + 0.6T) ────────────────────────────────────
  {
    id: 'dalgalar-11-05-ses-hizi-sicaklik',
    sinif: 11,
    konuId: 'dalgalar-11',
    altKonuId: 'ses-dalgalari',
    zorluk: 2,
    aytMi: true,
    ilgiliFormul: 'v ≈ 331 + 0.6 × T (°C)',
    kazanim: 'Havadaki ses hızının sıcaklıkla değişimini hesaplar.',
    sure: 60,
    ipucuSablonu: 'v = 331 + 0.6 × T°C formülünü kullan.',

    parametreler: {
      T: { min: 0, max: 40, adim: 5, birim: '°C', tamsayi: true },
    },

    soruSablonu: (p) =>
      `${p.T}°C sıcaklıktaki havada sesin hızı yaklaşık kaç m/s'dir? ` +
      `(v = 331 + 0.6T formülünü kullanınız)`,

    hesapla: (p) => 331 + 0.6 * p.T,

    cevapFormatla: (d) => `${d} m/s`,

    yanlisCevapStratejisi: 'aritmetik-hata',

    aciklamaSablonu: (p, d) =>
      `v = 331 + 0.6 × T formülünü uygulayalım:\n` +
      `v = 331 + 0.6 × ${p.T} = 331 + ${0.6 * p.T} = ${d} m/s`,
  },

  // ─── 6. Doppler Etkisi: Kaynak Gözlemciye Doğru (f' = f*v/(v−vs)) ───────────
  {
    id: 'dalgalar-11-06-doppler-yaklasan',
    sinif: 11,
    konuId: 'dalgalar-11',
    altKonuId: 'doppler',
    zorluk: 3,
    aytMi: true,
    ilgiliFormul: "f' = f × v / (v − vₛ)",
    kazanim: 'Yaklaşan kaynağın oluşturduğu Doppler etkisini hesaplar.',
    sure: 90,
    ipucuSablonu: "Kaynak yaklaşıyorsa paydaya (v − vₛ) yaz: f' = f × v / (v − vₛ)",

    parametreler: {
      f: { min: 200, max: 1000, adim: 50, birim: 'Hz', tamsayi: true },
      vs: { min: 10, max: 80, adim: 10, birim: 'm/s', tamsayi: true },
      v: { degerler: [340], birim: 'm/s' },
    },

    soruSablonu: (p) =>
      `${p.f} Hz frekanslı siren çalan bir ambulans ${p.vs} m/s hızla durduğunuz yere ` +
      `doğru yaklaşmaktadır. Sesin hızı ${p.v} m/s olduğuna göre, gözlemlediğiniz frekans ` +
      `yaklaşık kaç Hz'dir?`,

    hesapla: (p) => (p.f * p.v) / (p.v - p.vs),

    cevapFormatla: (d) => `${parseFloat(d.toFixed(1))} Hz`,

    yanlisCevapStratejisi: 'isaretli-hata',

    aciklamaSablonu: (p, d) =>
      `f' = f × v / (v − vₛ) (kaynak yaklaşıyor, frekans artar)\n` +
      `f' = ${p.f} × ${p.v} / (${p.v} − ${p.vs})\n` +
      `f' = ${p.f * p.v} / ${p.v - p.vs} ≈ ${d} Hz`,
  },

  // ─── 7. Doppler Etkisi: Kaynak Uzaklaşıyor (f' = f*v/(v+vs)) ────────────────
  {
    id: 'dalgalar-11-07-doppler-uzaklasan',
    sinif: 11,
    konuId: 'dalgalar-11',
    altKonuId: 'doppler',
    zorluk: 3,
    aytMi: true,
    ilgiliFormul: "f' = f × v / (v + vₛ)",
    kazanim: 'Uzaklaşan kaynağın oluşturduğu Doppler etkisini hesaplar.',
    sure: 90,
    ipucuSablonu: "Kaynak uzaklaşıyorsa paydaya (v + vₛ) yaz: f' = f × v / (v + vₛ)",

    parametreler: {
      f: { min: 200, max: 1000, adim: 50, birim: 'Hz', tamsayi: true },
      vs: { min: 10, max: 80, adim: 10, birim: 'm/s', tamsayi: true },
      v: { degerler: [340], birim: 'm/s' },
    },

    soruSablonu: (p) =>
      `${p.f} Hz frekanslı bir tren ${p.vs} m/s hızla sizden uzaklaşmaktadır. ` +
      `Sesin hızı ${p.v} m/s olduğuna göre, işittiğiniz frekans yaklaşık kaç Hz'dir?`,

    hesapla: (p) => (p.f * p.v) / (p.v + p.vs),

    cevapFormatla: (d) => `${parseFloat(d.toFixed(1))} Hz`,

    yanlisCevapStratejisi: 'isaretli-hata',

    aciklamaSablonu: (p, d) =>
      `f' = f × v / (v + vₛ) (kaynak uzaklaşıyor, frekans azalır)\n` +
      `f' = ${p.f} × ${p.v} / (${p.v} + ${p.vs})\n` +
      `f' = ${p.f * p.v} / ${p.v + p.vs} ≈ ${d} Hz`,
  },

  // ─── 8. Açık Boru Rezonansı (f_n = n*v/(2L)) ─────────────────────────────────
  {
    id: 'dalgalar-11-08-acik-boru-rezonans',
    sinif: 11,
    konuId: 'dalgalar-11',
    altKonuId: 'rezonans',
    zorluk: 3,
    aytMi: true,
    ilgiliFormul: 'fₙ = n × v / (2L)',
    kazanim: 'Açık borudaki harmoniklerin frekansını hesaplar.',
    sure: 90,
    ipucuSablonu: 'Açık boruda tüm harmonikler bulunur: fₙ = n × v / (2L)',

    parametreler: {
      L: { degerler: [0.5, 1.0, 1.5, 2.0], birim: 'm' },
      n: { degerler: [1, 2, 3] },
      v: { degerler: [340], birim: 'm/s' },
    },

    soruSablonu: (p) =>
      `Uzunluğu ${p.L} m olan açık bir borunun ${p.n}. harmonik frekansı kaç Hz'dir? ` +
      `(Sesin hızı = ${p.v} m/s)`,

    hesapla: (p) => (p.n * p.v) / (2 * p.L),

    cevapFormatla: (d) => `${parseFloat(d.toFixed(1))} Hz`,

    yanlisCevapStratejisi: 'sabit-carpan',

    aciklamaSablonu: (p, d) =>
      `Açık boru: fₙ = n × v / (2L)\n` +
      `f${p.n} = ${p.n} × ${p.v} / (2 × ${p.L})\n` +
      `f${p.n} = ${p.n * p.v} / ${2 * p.L} = ${d} Hz`,
  },

  // ─── 9. Kapalı Boru Rezonansı (f_n = (2n-1)*v/(4L)) ────────────────────────
  {
    id: 'dalgalar-11-09-kapali-boru-rezonans',
    sinif: 11,
    konuId: 'dalgalar-11',
    altKonuId: 'rezonans',
    zorluk: 3,
    aytMi: true,
    ilgiliFormul: 'fₙ = (2n−1) × v / (4L)',
    kazanim: 'Kapalı borudaki tek harmoniklerin frekansını hesaplar.',
    sure: 90,
    ipucuSablonu: 'Kapalı boruda yalnızca tek harmonikler bulunur: fₙ = (2n−1)v/(4L)',

    parametreler: {
      L: { degerler: [0.5, 1.0, 1.5, 2.0], birim: 'm' },
      n: { degerler: [1, 2, 3] },
      v: { degerler: [340], birim: 'm/s' },
    },

    soruSablonu: (p) =>
      `Uzunluğu ${p.L} m olan bir ucu kapalı borunun ${2 * p.n - 1}. harmonik frekansı ` +
      `kaç Hz'dir? (Sesin hızı = ${p.v} m/s)`,

    hesapla: (p) => ((2 * p.n - 1) * p.v) / (4 * p.L),

    cevapFormatla: (d) => `${parseFloat(d.toFixed(1))} Hz`,

    yanlisCevapStratejisi: 'sabit-carpan',

    aciklamaSablonu: (p, d) =>
      `Kapalı boru: fₙ = (2n−1) × v / (4L)\n` +
      `f = (${2 * p.n - 1}) × ${p.v} / (4 × ${p.L})\n` +
      `f = ${(2 * p.n - 1) * p.v} / ${4 * p.L} = ${d} Hz`,
  },

  // ─── 10. Vuruş Frekansı (f_beat = |f1 - f2|) ─────────────────────────────────
  {
    id: 'dalgalar-11-10-vurus-frekansi',
    sinif: 11,
    konuId: 'dalgalar-11',
    altKonuId: 'ses-dalgalari',
    zorluk: 2,
    aytMi: true,
    ilgiliFormul: 'f_vuruş = |f₁ − f₂|',
    kazanim: 'İki farklı frekanslı dalganın oluşturduğu vuruş frekansını hesaplar.',
    sure: 60,
    ipucuSablonu: 'Vuruş frekansı = iki frekans arasındaki fark.',

    parametreler: {
      f1: { min: 200, max: 500, adim: 10, birim: 'Hz', tamsayi: true },
      df: { min: 2, max: 20, adim: 2, birim: 'Hz', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Frekansları ${p.f1} Hz ve ${p.f1 + p.df} Hz olan iki ses kaynağı aynı anda ` +
      `çalıştırılıyor. Saniyede kaç vuruş duyulur?`,

    hesapla: (p) => p.df,

    cevapFormatla: (d) => `${d} Hz`,

    yanlisCevapStratejisi: 'carpim-bolum-toplam',

    aciklamaSablonu: (p, d) =>
      `f_vuruş = |f₁ − f₂| = |${p.f1} − ${p.f1 + p.df}| = ${d} Hz\n` +
      `Saniyede ${d} vuruş duyulur.`,
  },

  // ─── 11. Ses Şiddeti Düzeyi (L = 10*log(I/I₀)) ───────────────────────────────
  {
    id: 'dalgalar-11-11-ses-siddeti-duzey',
    sinif: 11,
    konuId: 'dalgalar-11',
    altKonuId: 'ses-dalgalari',
    zorluk: 4,
    aytMi: true,
    ilgiliFormul: 'L = 10 × log(I / I₀)  [I₀ = 10⁻¹² W/m²]',
    kazanim: 'Ses şiddeti düzeyini desibel cinsinden hesaplar.',
    sure: 120,
    ipucuSablonu: 'L = 10 log(I/I₀) dB. I₀ = 10⁻¹² W/m² eşik değeridir.',

    parametreler: {
      exponent: { degerler: [-10, -9, -8, -7, -6, -5, -4, -3, -2] },
    },

    soruSablonu: (p) =>
      `Ses şiddeti I = 10^${p.exponent} W/m² olan bir sesin şiddeti kaç dB'dir? ` +
      `(I₀ = 10⁻¹² W/m²)`,

    hesapla: (p) => 10 * (p.exponent - (-12)),

    cevapFormatla: (d) => `${d} dB`,

    yanlisCevapStratejisi: 'sabit-carpan',

    aciklamaSablonu: (p, d) =>
      `L = 10 × log(I / I₀)\n` +
      `L = 10 × log(10^${p.exponent} / 10^-12)\n` +
      `L = 10 × log(10^${p.exponent - (-12)})\n` +
      `L = 10 × ${p.exponent - (-12)} = ${d} dB`,
  },

  // ─── 12. Mesafede Ses Şiddeti (I = P/(4πr²)) ─────────────────────────────────
  {
    id: 'dalgalar-11-12-ses-siddeti-mesafe',
    sinif: 11,
    konuId: 'dalgalar-11',
    altKonuId: 'ses-dalgalari',
    zorluk: 3,
    aytMi: true,
    ilgiliFormul: 'I = P / (4πr²)',
    kazanim: 'Nokta kaynaktan belirli bir mesafedeki ses şiddetini hesaplar.',
    sure: 90,
    ipucuSablonu: 'Ses gücü küresel olarak yayılır: I = P / (4πr²)',

    parametreler: {
      P: { degerler: [1, 4, 9, 16, 25, 100], birim: 'W' },
      r: { min: 1, max: 10, adim: 1, birim: 'm', tamsayi: true },
    },

    soruSablonu: (p) =>
      `${p.P} W gücündeki bir ses kaynağından ${p.r} m uzaklıktaki ses şiddeti ` +
      `kaç W/m²'dir? (π ≈ 3.14 kullanınız)`,

    hesapla: (p) => p.P / (4 * Math.PI * p.r * p.r),

    cevapFormatla: (d) => `${parseFloat(d.toFixed(4))} W/m²`,

    yanlisCevapStratejisi: 'karekok-hata',

    aciklamaSablonu: (p, d) =>
      `I = P / (4πr²)\n` +
      `I = ${p.P} / (4 × 3.14 × ${p.r}²)\n` +
      `I = ${p.P} / (4 × 3.14 × ${p.r * p.r})\n` +
      `I ≈ ${d} W/m²`,
  },

  // ─── 13. Yay-Kütle SHM Periyodu (T = 2π√(m/k)) ──────────────────────────────
  {
    id: 'dalgalar-11-13-shm-yay-periyot',
    sinif: 11,
    konuId: 'dalgalar-11',
    altKonuId: 'basit-harmonik-hareket',
    zorluk: 2,
    aytMi: true,
    ilgiliFormul: 'T = 2π√(m/k)',
    kazanim: 'Yay-kütle sisteminin titreşim periyodunu hesaplar.',
    sure: 90,
    ipucuSablonu: 'T = 2π√(m/k) formülünü kullan. m kütle, k yay sabitidir.',

    parametreler: {
      m: { degerler: [0.1, 0.4, 0.9, 1.0, 1.6, 2.5, 4.0], birim: 'kg' },
      k: { degerler: [10, 40, 90, 100, 160, 250, 400], birim: 'N/m' },
    },

    soruSablonu: (p) =>
      `Yay sabiti ${p.k} N/m olan bir yaya ${p.m} kg'lık bir kütle asılıyor. ` +
      `Bu sistemin titreşim periyodu kaç s'dir? (π ≈ 3.14)`,

    hesapla: (p) => 2 * Math.PI * Math.sqrt(p.m / p.k),

    cevapFormatla: (d) => `${parseFloat(d.toFixed(2))} s`,

    yanlisCevapStratejisi: 'sabit-carpan',

    aciklamaSablonu: (p, d) =>
      `T = 2π√(m/k)\n` +
      `T = 2 × 3.14 × √(${p.m} / ${p.k})\n` +
      `T = 6.28 × √${(p.m / p.k).toFixed(4)}\n` +
      `T ≈ ${d} s`,
  },

  // ─── 14. Yay Sabitini Periyottan Bul (k = 4π²m/T²) ──────────────────────────
  {
    id: 'dalgalar-11-14-shm-yay-sabiti',
    sinif: 11,
    konuId: 'dalgalar-11',
    altKonuId: 'basit-harmonik-hareket',
    zorluk: 3,
    aytMi: true,
    ilgiliFormul: 'k = 4π²m / T²',
    kazanim: 'Periyot ve kütleden yay sabitini hesaplar.',
    sure: 90,
    ipucuSablonu: 'k = 4π²m / T² formülünü kullan.',

    parametreler: {
      m: { degerler: [0.1, 0.25, 0.4, 0.5, 1.0, 2.0], birim: 'kg' },
      T: { degerler: [0.1, 0.2, 0.25, 0.4, 0.5, 1.0, 2.0], birim: 's' },
    },

    soruSablonu: (p) =>
      `Kütlesi ${p.m} kg olan bir cisim bir yaya bağlanıyor ve ${p.T} s periyotla ` +
      `titreşiyor. Yay sabiti kaç N/m'dir? (π ≈ 3.14)`,

    hesapla: (p) => (4 * Math.PI * Math.PI * p.m) / (p.T * p.T),

    cevapFormatla: (d) => `${parseFloat(d.toFixed(2))} N/m`,

    yanlisCevapStratejisi: 'karekok-hata',

    aciklamaSablonu: (p, d) =>
      `k = 4π²m / T²\n` +
      `k = (4 × 3.14² × ${p.m}) / ${p.T}²\n` +
      `k = (4 × 9.87 × ${p.m}) / ${p.T * p.T}\n` +
      `k ≈ ${d} N/m`,
  },

  // ─── 15. Sarkaç Periyodu (T = 2π√(L/g)) ─────────────────────────────────────
  {
    id: 'dalgalar-11-15-sarkac-periyot',
    sinif: 11,
    konuId: 'dalgalar-11',
    altKonuId: 'basit-harmonik-hareket',
    zorluk: 2,
    aytMi: true,
    ilgiliFormul: 'T = 2π√(L/g)',
    kazanim: 'Sarkaç uzunluğundan titreşim periyodunu hesaplar.',
    sure: 90,
    ipucuSablonu: 'T = 2π√(L/g). Sarkaç periyodu kütleye değil, yalnızca uzunluğa bağlıdır.',

    parametreler: {
      L: { degerler: [0.1, 0.25, 0.4, 1.0, 1.6, 2.5, 4.0], birim: 'm' },
    },

    soruSablonu: (p) =>
      `Uzunluğu ${p.L} m olan bir basit sarkaç küçük açılı salınımlar yapıyor. ` +
      `Bu sarkaçın periyodu kaç s'dir? (g = 10 m/s², π ≈ 3.14)`,

    hesapla: (p) => 2 * Math.PI * Math.sqrt(p.L / 10),

    cevapFormatla: (d) => `${parseFloat(d.toFixed(2))} s`,

    yanlisCevapStratejisi: 'sabit-carpan',

    aciklamaSablonu: (p, d) =>
      `T = 2π√(L/g)\n` +
      `T = 2 × 3.14 × √(${p.L} / 10)\n` +
      `T = 6.28 × √${(p.L / 10).toFixed(4)}\n` +
      `T ≈ ${d} s`,
  },

  // ─── 16. Sarkaç Uzunluğunu Periyottan Bul (L = g*T²/(4π²)) ──────────────────
  {
    id: 'dalgalar-11-16-sarkac-uzunluk',
    sinif: 11,
    konuId: 'dalgalar-11',
    altKonuId: 'basit-harmonik-hareket',
    zorluk: 3,
    aytMi: true,
    ilgiliFormul: 'L = g × T² / (4π²)',
    kazanim: 'Sarkaç periyodundan sarkaç uzunluğunu hesaplar.',
    sure: 90,
    ipucuSablonu: 'L = g × T² / (4π²) formülünü kullan.',

    parametreler: {
      T: { degerler: [0.628, 1.0, 1.256, 1.414, 2.0, 2.512], birim: 's' },
    },

    soruSablonu: (p) =>
      `Periyodu ${p.T} s olan bir basit sarkaç için ip uzunluğu kaç m'dir? ` +
      `(g = 10 m/s², π ≈ 3.14)`,

    hesapla: (p) => (10 * p.T * p.T) / (4 * Math.PI * Math.PI),

    cevapFormatla: (d) => `${parseFloat(d.toFixed(2))} m`,

    yanlisCevapStratejisi: 'karekok-hata',

    aciklamaSablonu: (p, d) =>
      `L = g × T² / (4π²)\n` +
      `L = 10 × ${p.T}² / (4 × 3.14²)\n` +
      `L = 10 × ${(p.T * p.T).toFixed(4)} / ${(4 * Math.PI * Math.PI).toFixed(4)}\n` +
      `L ≈ ${d} m`,
  },

  // ─── 17. SHM Maksimum Hız (v_max = A * 2πf) ─────────────────────────────────
  {
    id: 'dalgalar-11-17-shm-maksimum-hiz',
    sinif: 11,
    konuId: 'dalgalar-11',
    altKonuId: 'basit-harmonik-hareket',
    zorluk: 3,
    aytMi: true,
    ilgiliFormul: 'v_max = A × ω = A × 2πf',
    kazanim: 'BHH yapan cismin maksimum hızını genlik ve frekansdan hesaplar.',
    sure: 90,
    ipucuSablonu: 'v_max = A × 2πf. Maksimum hız denge noktasında gerçekleşir.',

    parametreler: {
      A: { degerler: [0.05, 0.1, 0.15, 0.2, 0.25, 0.5], birim: 'm' },
      f: { degerler: [1, 2, 4, 5, 10], birim: 'Hz' },
    },

    soruSablonu: (p) =>
      `Genliği ${p.A} m olan bir yay-kütle sistemi ${p.f} Hz frekansla titreşiyor. ` +
      `Cismin maksimum hızı kaç m/s'dir? (π ≈ 3.14)`,

    hesapla: (p) => p.A * 2 * Math.PI * p.f,

    cevapFormatla: (d) => `${parseFloat(d.toFixed(3))} m/s`,

    yanlisCevapStratejisi: 'sabit-carpan',

    aciklamaSablonu: (p, d) =>
      `v_max = A × 2πf\n` +
      `v_max = ${p.A} × 2 × 3.14 × ${p.f}\n` +
      `v_max = ${p.A} × ${(2 * Math.PI * p.f).toFixed(2)}\n` +
      `v_max ≈ ${d} m/s`,
  },

  // ─── 18. İpteki Enine Dalga Hızı (v = √(T_ger/μ)) ───────────────────────────
  {
    id: 'dalgalar-11-18-ipteki-dalga-hizi',
    sinif: 11,
    konuId: 'dalgalar-11',
    altKonuId: 'mekanik-dalgalar',
    zorluk: 3,
    aytMi: true,
    ilgiliFormul: 'v = √(F_ger / μ)',
    kazanim: 'Gerilen ipteki dalga hızını gerilim kuvveti ve doğrusal yoğunluktan hesaplar.',
    sure: 90,
    ipucuSablonu: 'v = √(Fger/μ). μ = m/L birim uzunluk kütlesidir.',

    parametreler: {
      Fg: { degerler: [4, 9, 16, 25, 36, 49, 64, 100, 144, 196, 225, 400], birim: 'N' },
      mu: { degerler: [0.01, 0.04, 0.09, 0.16, 0.25, 0.36], birim: 'kg/m' },
    },

    soruSablonu: (p) =>
      `Doğrusal yoğunluğu μ = ${p.mu} kg/m olan bir ip ${p.Fg} N gerilim kuvvetiyle ` +
      `gerilmiştir. Bu ipteki enine dalga hızı kaç m/s'dir?`,

    hesapla: (p) => Math.sqrt(p.Fg / p.mu),

    cevapFormatla: (d) => `${parseFloat(d.toFixed(2))} m/s`,

    yanlisCevapStratejisi: 'karekok-hata',

    aciklamaSablonu: (p, d) =>
      `v = √(F_ger / μ)\n` +
      `v = √(${p.Fg} / ${p.mu})\n` +
      `v = √${(p.Fg / p.mu).toFixed(2)}\n` +
      `v ≈ ${d} m/s`,
  },

  // ─── 19. Yansıma: Gelme Açısı = Yansıma Açısı ───────────────────────────────
  {
    id: 'dalgalar-11-19-yansima',
    sinif: 11,
    konuId: 'dalgalar-11',
    altKonuId: 'yansima-kirilma',
    zorluk: 1,
    aytMi: true,
    ilgiliFormul: 'θᵢ = θᵣ',
    kazanim: 'Yansıma yasasını uygular ve yansıma açısını bulur.',
    sure: 45,
    ipucuSablonu: 'Yansıma yasası: Gelme açısı = Yansıma açısı (her ikisi de normalle ölçülür).',

    parametreler: {
      theta: { degerler: [30, 45, 60] },
    },

    soruSablonu: (p) =>
      `Bir dalga normalle ${p.theta}° açı yaparak düz bir yüzeye çarpıyor. ` +
      `Yansıma açısı kaç derecedir?`,

    hesapla: (p) => p.theta,

    cevapFormatla: (d) => `${d}°`,

    yanlisCevapStratejisi: 'sin-cos-karisimi',

    aciklamaSablonu: (p, d) =>
      `Yansıma yasası: Gelme açısı = Yansıma açısı\n` +
      `Gelme açısı = ${p.theta}° ⟹ Yansıma açısı = ${d}°`,
  },

  // ─── 20. Snell Yasası (n1*sinθ1 = n2*sinθ2) ──────────────────────────────────
  {
    id: 'dalgalar-11-20-snell-yasasi',
    sinif: 11,
    konuId: 'dalgalar-11',
    altKonuId: 'yansima-kirilma',
    zorluk: 3,
    aytMi: true,
    ilgiliFormul: 'n₁ × sin θ₁ = n₂ × sin θ₂',
    kazanim: 'Snell yasasını kullanarak kırılma açısını hesaplar.',
    sure: 90,
    ipucuSablonu: 'n₁ sin θ₁ = n₂ sin θ₂. Daha yoğun ortamda dalga normale yaklaşır.',

    parametreler: {
      n1: { degerler: [1.0], birim: '' },
      n2: { degerler: [1.5, 1.732, 2.0], birim: '' },
      // θ1 ∈ {30, 45, 60}; sinθ1 = {0.5, 0.707, 0.866}
      theta1: { degerler: [30, 45, 60] },
    },

    soruSablonu: (p) => {
      const sinTheta1 = p.theta1 === 30 ? 0.5 : p.theta1 === 45 ? 0.707 : 0.866;
      return (
        `Işık hava ortamından (n₁ = ${p.n1}) geçen ışın, cam ortamına (n₂ = ${p.n2}) ` +
        `${p.theta1}° açıyla geliyor. Kırılma açısı sin θ₂ değeri nedir? ` +
        `(sin ${p.theta1}° = ${sinTheta1})`
      );
    },

    hesapla: (p) => {
      const sinTheta1 = p.theta1 === 30 ? 0.5 : p.theta1 === 45 ? 0.707 : 0.866;
      return (p.n1 * sinTheta1) / p.n2;
    },

    cevapFormatla: (d) => `sin θ₂ = ${parseFloat(d.toFixed(4))}`,

    yanlisCevapStratejisi: 'sin-cos-karisimi',

    aciklamaSablonu: (p, d) => {
      const sinTheta1 = p.theta1 === 30 ? 0.5 : p.theta1 === 45 ? 0.707 : 0.866;
      return (
        `n₁ sin θ₁ = n₂ sin θ₂\n` +
        `${p.n1} × ${sinTheta1} = ${p.n2} × sin θ₂\n` +
        `sin θ₂ = (${p.n1} × ${sinTheta1}) / ${p.n2}\n` +
        `sin θ₂ = ${sinTheta1} / ${p.n2} ≈ ${parseFloat(d.toFixed(4))}`
      );
    },
  },
];
