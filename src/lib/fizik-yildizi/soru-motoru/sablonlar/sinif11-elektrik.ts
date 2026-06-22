// ============================================================
// Fizik Yıldızı – 11. Sınıf Elektrik Soru Şablonları
// ============================================================

import { SoruSablonu } from '../tipler';

export const sinif11ElektrikSablonlar: SoruSablonu[] = [

  // ─────────────────────────────────────────────────────────
  // 1. Ohm Yasası: V = I * R
  // ─────────────────────────────────────────────────────────
  {
    id: 'e11-ohm-V',
    sinif: 11,
    konuId: 'elektrik-11',
    altKonuId: 'ohm-yasasi',
    zorluk: 1,
    aytMi: true,
    ilgiliFormul: 'V = I · R',
    kazanim: 'Ohm Yasası\'nı kullanarak gerilimi hesaplar.',
    sure: 60,
    ipucuSablonu: 'Ohm Yasası: V = I × R. Akımı (A) dirençle (Ω) çarp.',

    parametreler: {
      I: { min: 1, max: 10, adim: 1, birim: 'A', tamsayi: true },
      R: { min: 2, max: 20, adim: 2, birim: 'Ω', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Üzerinden ${p.I} A akım geçen bir iletkenin direnci ${p.R} Ω\'dur. İletkenin iki ucu arasındaki gerilim kaç V\'dur?`,

    hesapla: (p) => p.I * p.R,

    cevapFormatla: (d) => `${d} V`,

    yanlisCevapStratejisi: 'carpim-bolum-toplam',

    aciklamaSablonu: (p, d) =>
      `Ohm Yasası'na göre V = I × R formülü uygulanır.\nV = ${p.I} A × ${p.R} Ω = ${d} V`,
  },

  // ─────────────────────────────────────────────────────────
  // 2. Ohm Yasası: I = V / R
  // ─────────────────────────────────────────────────────────
  {
    id: 'e11-ohm-I',
    sinif: 11,
    konuId: 'elektrik-11',
    altKonuId: 'ohm-yasasi',
    zorluk: 1,
    aytMi: true,
    ilgiliFormul: 'I = V / R',
    kazanim: 'Ohm Yasası\'nı kullanarak akımı hesaplar.',
    sure: 60,
    ipucuSablonu: 'Ohm Yasası: I = V / R. Gerilimi direce böl.',

    parametreler: {
      V: { min: 6, max: 60, adim: 6, birim: 'V', tamsayi: true },
      R: { min: 2, max: 12, adim: 2, birim: 'Ω', tamsayi: true },
    },

    soruSablonu: (p) =>
      `İki ucu arasında ${p.V} V gerilim uygulanan bir iletkenin direnci ${p.R} Ω\'dur. İletken üzerinden geçen akım kaç A\'dır?`,

    hesapla: (p) => p.V / p.R,

    cevapFormatla: (d) => `${d} A`,

    yanlisCevapStratejisi: 'ters-islem',

    aciklamaSablonu: (p, d) =>
      `Ohm Yasası'na göre I = V / R formülü kullanılır.\nI = ${p.V} V / ${p.R} Ω = ${d} A`,
  },

  // ─────────────────────────────────────────────────────────
  // 3. Ohm Yasası: R = V / I
  // ─────────────────────────────────────────────────────────
  {
    id: 'e11-ohm-R',
    sinif: 11,
    konuId: 'elektrik-11',
    altKonuId: 'ohm-yasasi',
    zorluk: 1,
    aytMi: true,
    ilgiliFormul: 'R = V / I',
    kazanim: 'Ohm Yasası\'nı kullanarak direnci hesaplar.',
    sure: 60,
    ipucuSablonu: 'Ohm Yasası: R = V / I. Gerilimi akıma böl.',

    parametreler: {
      V: { min: 12, max: 120, adim: 12, birim: 'V', tamsayi: true },
      I: { min: 2, max: 10, adim: 2, birim: 'A', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Üzerinden ${p.I} A akım geçen ve iki ucu arasındaki gerilim ${p.V} V olan bir iletkenin direnci kaç Ω\'dur?`,

    hesapla: (p) => p.V / p.I,

    cevapFormatla: (d) => `${d} Ω`,

    yanlisCevapStratejisi: 'ters-islem',

    aciklamaSablonu: (p, d) =>
      `Ohm Yasası'na göre R = V / I formülü kullanılır.\nR = ${p.V} V / ${p.I} A = ${d} Ω`,
  },

  // ─────────────────────────────────────────────────────────
  // 4. Seri Devre: Toplam Direnç
  // ─────────────────────────────────────────────────────────
  {
    id: 'e11-seri-Rtoplam',
    sinif: 11,
    konuId: 'elektrik-11',
    altKonuId: 'seri-devre',
    zorluk: 2,
    aytMi: true,
    ilgiliFormul: 'R_toplam = R₁ + R₂ + R₃',
    kazanim: 'Seri bağlı dirençlerin toplam direncini hesaplar.',
    sure: 75,
    ipucuSablonu: 'Seri devrede dirençler toplanır: R_toplam = R₁ + R₂ + R₃.',

    parametreler: {
      R1: { min: 2, max: 10, adim: 2, birim: 'Ω', tamsayi: true },
      R2: { min: 3, max: 12, adim: 3, birim: 'Ω', tamsayi: true },
      R3: { min: 4, max: 8,  adim: 2, birim: 'Ω', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Seri bağlı üç direnç R₁ = ${p.R1} Ω, R₂ = ${p.R2} Ω ve R₃ = ${p.R3} Ω\'dur. Devrenin toplam direnci kaç Ω\'dur?`,

    hesapla: (p) => p.R1 + p.R2 + p.R3,

    cevapFormatla: (d) => `${d} Ω`,

    yanlisCevapStratejisi: 'aritmetik-hata',

    aciklamaSablonu: (p, d) =>
      `Seri devrede R_toplam = R₁ + R₂ + R₃.\nR_toplam = ${p.R1} + ${p.R2} + ${p.R3} = ${d} Ω`,
  },

  // ─────────────────────────────────────────────────────────
  // 5. Seri Devre: Akım (her yerde aynı)
  // ─────────────────────────────────────────────────────────
  {
    id: 'e11-seri-akim',
    sinif: 11,
    konuId: 'elektrik-11',
    altKonuId: 'seri-devre',
    zorluk: 2,
    aytMi: true,
    ilgiliFormul: 'I = V / (R₁ + R₂)',
    kazanim: 'Seri devrede akımın her yerde eşit olduğunu ve değerini hesaplar.',
    sure: 90,
    ipucuSablonu: 'Seri devrede akım her yerden aynı geçer: I = V_toplam / R_toplam.',

    parametreler: {
      V:  { min: 12, max: 60, adim: 12, birim: 'V', tamsayi: true },
      R1: { min: 2,  max: 8,  adim: 2,  birim: 'Ω', tamsayi: true },
      R2: { min: 4,  max: 12, adim: 4,  birim: 'Ω', tamsayi: true },
    },

    soruSablonu: (p) =>
      `${p.V} V\'luk bir pil ile R₁ = ${p.R1} Ω ve R₂ = ${p.R2} Ω\'luk iki direnç seri bağlanmıştır. Devreden geçen akım kaç A\'dır?`,

    hesapla: (p) => p.V / (p.R1 + p.R2),

    cevapFormatla: (d) => `${d} A`,

    yanlisCevapStratejisi: 'carpim-bolum-toplam',

    aciklamaSablonu: (p, d) =>
      `Seri devrede R_toplam = R₁ + R₂ = ${p.R1 + p.R2} Ω.\nI = V / R_toplam = ${p.V} / ${p.R1 + p.R2} = ${d} A`,
  },

  // ─────────────────────────────────────────────────────────
  // 6. Seri Devre: Gerilim Dağılımı
  // ─────────────────────────────────────────────────────────
  {
    id: 'e11-seri-gerilim',
    sinif: 11,
    konuId: 'elektrik-11',
    altKonuId: 'seri-devre',
    zorluk: 2,
    aytMi: true,
    ilgiliFormul: 'V₁ = I · R₁',
    kazanim: 'Seri devrede gerilim dağılımını hesaplar.',
    sure: 90,
    ipucuSablonu: 'Seri devrede her direncin gerilimi: V = I × R. Önce akımı bul.',

    parametreler: {
      V:  { min: 24, max: 60, adim: 12, birim: 'V', tamsayi: true },
      R1: { min: 3,  max: 9,  adim: 3,  birim: 'Ω', tamsayi: true },
      R2: { min: 6,  max: 12, adim: 3,  birim: 'Ω', tamsayi: true },
    },

    soruSablonu: (p) =>
      `R₁ = ${p.R1} Ω ve R₂ = ${p.R2} Ω dirençleri ${p.V} V\'luk kaynağa seri bağlanmıştır. R₁ üzerindeki gerilim kaç V\'dur?`,

    hesapla: (p) => {
      const I = p.V / (p.R1 + p.R2);
      return Math.round(I * p.R1 * 100) / 100;
    },

    cevapFormatla: (d) => `${d} V`,

    yanlisCevapStratejisi: 'carpim-bolum-toplam',

    aciklamaSablonu: (p, d) => {
      const I = p.V / (p.R1 + p.R2);
      return `I = V / (R₁+R₂) = ${p.V} / ${p.R1 + p.R2} = ${I} A\nV₁ = I × R₁ = ${I} × ${p.R1} = ${d} V`;
    },
  },

  // ─────────────────────────────────────────────────────────
  // 7. Paralel Devre: Toplam Direnç (iki direnç)
  // ─────────────────────────────────────────────────────────
  {
    id: 'e11-paralel-Rtoplam',
    sinif: 11,
    konuId: 'elektrik-11',
    altKonuId: 'paralel-devre',
    zorluk: 2,
    aytMi: true,
    ilgiliFormul: '1/R = 1/R₁ + 1/R₂  →  R = R₁R₂/(R₁+R₂)',
    kazanim: 'Paralel bağlı dirençlerin eşdeğer direncini hesaplar.',
    sure: 90,
    ipucuSablonu: 'İki paralel direnç için: R_eş = (R₁ × R₂) / (R₁ + R₂).',

    parametreler: {
      R1: { min: 4,  max: 12, adim: 4, birim: 'Ω', tamsayi: true },
      R2: { min: 6,  max: 12, adim: 6, birim: 'Ω', tamsayi: true },
    },

    soruSablonu: (p) =>
      `R₁ = ${p.R1} Ω ve R₂ = ${p.R2} Ω dirençleri paralel bağlanmıştır. Eşdeğer direnç kaç Ω\'dur?`,

    hesapla: (p) => Math.round((p.R1 * p.R2) / (p.R1 + p.R2) * 100) / 100,

    cevapFormatla: (d) => `${d} Ω`,

    yanlisCevapStratejisi: 'ters-islem',

    aciklamaSablonu: (p, d) =>
      `Paralel bağlı iki direnç için:\nR_eş = (R₁ × R₂) / (R₁ + R₂) = (${p.R1} × ${p.R2}) / (${p.R1 + p.R2}) = ${d} Ω`,
  },

  // ─────────────────────────────────────────────────────────
  // 8. Paralel Devre: Toplam Akım
  // ─────────────────────────────────────────────────────────
  {
    id: 'e11-paralel-akim',
    sinif: 11,
    konuId: 'elektrik-11',
    altKonuId: 'paralel-devre',
    zorluk: 2,
    aytMi: true,
    ilgiliFormul: 'I = I₁ + I₂',
    kazanim: 'Paralel devrede toplam akımı hesaplar.',
    sure: 90,
    ipucuSablonu: 'Paralel devrede I_toplam = I₁ + I₂. Her dal akımını ayrı hesapla.',

    parametreler: {
      V:  { min: 12, max: 36, adim: 12, birim: 'V', tamsayi: true },
      R1: { min: 3,  max: 6,  adim: 3,  birim: 'Ω', tamsayi: true },
      R2: { min: 4,  max: 12, adim: 4,  birim: 'Ω', tamsayi: true },
    },

    soruSablonu: (p) =>
      `${p.V} V\'luk bir pil R₁ = ${p.R1} Ω ve R₂ = ${p.R2} Ω dirençlerine paralel bağlanmıştır. Kaynaktan çekilen toplam akım kaç A\'dır?`,

    hesapla: (p) => Math.round((p.V / p.R1 + p.V / p.R2) * 100) / 100,

    cevapFormatla: (d) => `${d} A`,

    yanlisCevapStratejisi: 'carpim-bolum-toplam',

    aciklamaSablonu: (p, d) => {
      const I1 = p.V / p.R1;
      const I2 = p.V / p.R2;
      return `I₁ = V/R₁ = ${p.V}/${p.R1} = ${I1} A\nI₂ = V/R₂ = ${p.V}/${p.R2} = ${I2} A\nI = I₁ + I₂ = ${d} A`;
    },
  },

  // ─────────────────────────────────────────────────────────
  // 9. Paralel Devre: Gerilim (her dalda aynı)
  // ─────────────────────────────────────────────────────────
  {
    id: 'e11-paralel-gerilim',
    sinif: 11,
    konuId: 'elektrik-11',
    altKonuId: 'paralel-devre',
    zorluk: 1,
    aytMi: true,
    ilgiliFormul: 'V₁ = V₂ = V_kaynak',
    kazanim: 'Paralel devrede gerilimin her dalda eşit olduğunu kavrar.',
    sure: 60,
    ipucuSablonu: 'Paralel bağlı dirençlerin uçlarındaki gerilim kaynak gerilimine eşittir.',

    parametreler: {
      V:  { min: 12, max: 24, adim: 12, birim: 'V', tamsayi: true },
      R2: { min: 6,  max: 12, adim: 6,  birim: 'Ω', tamsayi: true },
    },

    soruSablonu: (p) =>
      `${p.V} V\'luk kaynağa iki direnç paralel bağlanmıştır. R₂ = ${p.R2} Ω direncinin uçlarındaki gerilim kaç V\'dur?`,

    hesapla: (p) => p.V,

    cevapFormatla: (d) => `${d} V`,

    yanlisCevapStratejisi: 'carpim-bolum-toplam',

    aciklamaSablonu: (p, d) =>
      `Paralel devrede bütün dalların uçlarındaki gerilim, kaynak gerilimine eşittir.\nV₂ = V_kaynak = ${d} V`,
  },

  // ─────────────────────────────────────────────────────────
  // 10. Elektrik Gücü: P = V * I
  // ─────────────────────────────────────────────────────────
  {
    id: 'e11-guc-VI',
    sinif: 11,
    konuId: 'elektrik-11',
    altKonuId: 'elektrik-gucu',
    zorluk: 2,
    aytMi: true,
    ilgiliFormul: 'P = V · I',
    kazanim: 'Elektrik gücünü V ve I kullanarak hesaplar.',
    sure: 75,
    ipucuSablonu: 'P = V × I formülünü kullan.',

    parametreler: {
      V: { min: 6,  max: 24, adim: 6, birim: 'V', tamsayi: true },
      I: { min: 2,  max: 10, adim: 2, birim: 'A', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Üzerinden ${p.I} A akım geçen ve uçları arasında ${p.V} V gerilim bulunan bir direncin harcadığı güç kaç W\'dır?`,

    hesapla: (p) => p.V * p.I,

    cevapFormatla: (d) => `${d} W`,

    yanlisCevapStratejisi: 'carpim-bolum-toplam',

    aciklamaSablonu: (p, d) =>
      `P = V × I = ${p.V} × ${p.I} = ${d} W`,
  },

  // ─────────────────────────────────────────────────────────
  // 11. Elektrik Enerjisi: E = P * t
  // ─────────────────────────────────────────────────────────
  {
    id: 'e11-enerji-Pt',
    sinif: 11,
    konuId: 'elektrik-11',
    altKonuId: 'elektrik-enerjisi',
    zorluk: 2,
    aytMi: true,
    ilgiliFormul: 'E = P · t',
    kazanim: 'Elektrik enerjisini güç ve süre cinsinden hesaplar.',
    sure: 75,
    ipucuSablonu: 'E = P × t. Süreyi saniyeye çevir: 1 saat = 3600 s.',

    parametreler: {
      P: { min: 100, max: 1000, adim: 100, birim: 'W', tamsayi: true },
      t: { min: 1,   max: 5,   adim: 1,   birim: 'saat', tamsayi: true },
    },

    soruSablonu: (p) =>
      `${p.P} W gücündeki bir elektrikli alet ${p.t} saat çalıştırılıyor. Harcanan elektrik enerjisi kaç J\'dür?`,

    hesapla: (p) => p.P * p.t * 3600,

    cevapFormatla: (d) => `${d.toExponential(2)} J`,

    yanlisCevapStratejisi: 'birim-donusum',

    aciklamaSablonu: (p, d) =>
      `E = P × t = ${p.P} W × (${p.t} × 3600 s) = ${p.P} × ${p.t * 3600} = ${d.toExponential(2)} J`,
  },

  // ─────────────────────────────────────────────────────────
  // 12. Elektrik Faturası: Maliyet
  // ─────────────────────────────────────────────────────────
  {
    id: 'e11-maliyet',
    sinif: 11,
    konuId: 'elektrik-11',
    altKonuId: 'elektrik-enerjisi',
    zorluk: 2,
    aytMi: true,
    ilgiliFormul: 'E_kWh = P(kW) × t(saat)',
    kazanim: 'Elektrik enerjisi tüketimini kWh cinsinden ve maliyetini hesaplar.',
    sure: 90,
    ipucuSablonu: 'Önce kWh\'e çevir: E = P(W)/1000 × t(saat). Sonra birim fiyatla çarp.',

    parametreler: {
      P:    { min: 200, max: 2000, adim: 200, birim: 'W',      tamsayi: true },
      t:    { min: 5,   max: 20,   adim: 5,   birim: 'saat',   tamsayi: true },
      fiyat:{ min: 2,   max: 6,    adim: 1,   birim: 'TL/kWh', tamsayi: true },
    },

    soruSablonu: (p) =>
      `${p.P} W gücündeki bir klima ${p.t} saat çalıştırılıyor. 1 kWh elektriğin fiyatı ${p.fiyat} TL ise ödenmesi gereken ücret kaç TL\'dir?`,

    hesapla: (p) => Math.round((p.P / 1000) * p.t * p.fiyat * 100) / 100,

    cevapFormatla: (d) => `${d} TL`,

    yanlisCevapStratejisi: 'birim-donusum',

    aciklamaSablonu: (p, d) => {
      const kWh = (p.P / 1000) * p.t;
      return `E = ${p.P} W / 1000 × ${p.t} h = ${kWh} kWh\nMaliyet = ${kWh} × ${p.fiyat} = ${d} TL`;
    },
  },

  // ─────────────────────────────────────────────────────────
  // 13. Coulomb Yasası: F = k·q1·q2 / r²
  // ─────────────────────────────────────────────────────────
  {
    id: 'e11-coulomb-F',
    sinif: 11,
    konuId: 'elektrik-11',
    altKonuId: 'elektrostatik',
    zorluk: 3,
    aytMi: true,
    ilgiliFormul: 'F = k·q₁·q₂ / r²   (k = 9×10⁹ N·m²/C²)',
    kazanim: 'Coulomb Yasası\'nı kullanarak iki yük arasındaki elektrostatik kuvveti hesaplar.',
    sure: 100,
    ipucuSablonu: 'k = 9×10⁹ N·m²/C². Yükleri Coulomb\'a (×10⁻⁶) çevirerek yerine koy.',

    parametreler: {
      q1: { min: 2, max: 8, adim: 2, birim: 'μC', tamsayi: true },
      q2: { min: 3, max: 9, adim: 3, birim: 'μC', tamsayi: true },
      r:  { min: 1, max: 3, adim: 1, birim: 'm',  tamsayi: true },
    },

    soruSablonu: (p) =>
      `q₁ = ${p.q1} μC ve q₂ = ${p.q2} μC olan iki nokta yük ${p.r} m uzaklıkta bulunmaktadır. Aralarındaki elektrostatik kuvvet kaç N\'dur? (k = 9×10⁹ N·m²/C²)`,

    hesapla: (p) => {
      const k = 9e9;
      const q1 = p.q1 * 1e-6;
      const q2 = p.q2 * 1e-6;
      return Math.round(k * q1 * q2 / (p.r * p.r) * 100) / 100;
    },

    cevapFormatla: (d) => `${d} N`,

    yanlisCevapStratejisi: 'karekok-hata',

    aciklamaSablonu: (p, d) => {
      const k = 9e9;
      const q1 = p.q1 * 1e-6;
      const q2 = p.q2 * 1e-6;
      return `F = k·q₁·q₂/r² = 9×10⁹ × ${q1.toExponential(0)} × ${q2.toExponential(0)} / ${p.r}² = ${d} N`;
    },
  },

  // ─────────────────────────────────────────────────────────
  // 14. Elektrik Alan: E = k·q / r²
  // ─────────────────────────────────────────────────────────
  {
    id: 'e11-elektrik-alan',
    sinif: 11,
    konuId: 'elektrik-11',
    altKonuId: 'elektrostatik',
    zorluk: 3,
    aytMi: true,
    ilgiliFormul: 'E = k·q / r²',
    kazanim: 'Nokta yükün oluşturduğu elektrik alan şiddetini hesaplar.',
    sure: 100,
    ipucuSablonu: 'E = kq/r². k = 9×10⁹, q\'yu C\'a çevir (μC × 10⁻⁶).',

    parametreler: {
      q: { min: 2, max: 10, adim: 2, birim: 'μC', tamsayi: true },
      r: { min: 1, max: 3,  adim: 1, birim: 'm',  tamsayi: true },
    },

    soruSablonu: (p) =>
      `q = ${p.q} μC\'luk bir nokta yükten ${p.r} m uzaklıktaki elektrik alan şiddeti kaç N/C\'dur? (k = 9×10⁹ N·m²/C²)`,

    hesapla: (p) => {
      const k = 9e9;
      const q = p.q * 1e-6;
      return Math.round(k * q / (p.r * p.r) * 10) / 10;
    },

    cevapFormatla: (d) => `${d} N/C`,

    yanlisCevapStratejisi: 'karekok-hata',

    aciklamaSablonu: (p, d) =>
      `E = kq/r² = 9×10⁹ × ${p.q}×10⁻⁶ / ${p.r}² = ${d} N/C`,
  },

  // ─────────────────────────────────────────────────────────
  // 15. Elektrik Potansiyel: V = k·q / r
  // ─────────────────────────────────────────────────────────
  {
    id: 'e11-potansiyel',
    sinif: 11,
    konuId: 'elektrik-11',
    altKonuId: 'elektrostatik',
    zorluk: 3,
    aytMi: true,
    ilgiliFormul: 'V = k·q / r',
    kazanim: 'Nokta yükün oluşturduğu elektrik potansiyelini hesaplar.',
    sure: 90,
    ipucuSablonu: 'V = kq/r. Potansiyel alan şiddetinin aksine r ile düz orantılı değil, 1/r ile değişir.',

    parametreler: {
      q: { min: 2, max: 8, adim: 2, birim: 'μC', tamsayi: true },
      r: { min: 1, max: 3, adim: 1, birim: 'm',  tamsayi: true },
    },

    soruSablonu: (p) =>
      `q = ${p.q} μC\'luk bir nokta yükün ${p.r} m uzağındaki elektrik potansiyeli kaç V\'dur? (k = 9×10⁹ N·m²/C²)`,

    hesapla: (p) => {
      const k = 9e9;
      const q = p.q * 1e-6;
      return Math.round(k * q / p.r * 10) / 10;
    },

    cevapFormatla: (d) => `${d} V`,

    yanlisCevapStratejisi: 'karekok-hata',

    aciklamaSablonu: (p, d) =>
      `V = kq/r = 9×10⁹ × ${p.q}×10⁻⁶ / ${p.r} = ${d} V`,
  },

  // ─────────────────────────────────────────────────────────
  // 16. Sığa: C = Q / V
  // ─────────────────────────────────────────────────────────
  {
    id: 'e11-siga',
    sinif: 11,
    konuId: 'elektrik-11',
    altKonuId: 'kondansator',
    zorluk: 2,
    aytMi: true,
    ilgiliFormul: 'C = Q / V',
    kazanim: 'Kondansatörün sığasını hesaplar.',
    sure: 75,
    ipucuSablonu: 'C = Q/V. Q\'yu Coulomb, V\'yi volt olarak kullan.',

    parametreler: {
      Q: { min: 20, max: 100, adim: 20, birim: 'μC', tamsayi: true },
      V: { min: 5,  max: 20,  adim: 5,  birim: 'V',  tamsayi: true },
    },

    soruSablonu: (p) =>
      `Bir kondansatör ${p.V} V gerilimde ${p.Q} μC yük depoluyorsa sığası kaç μF\'dır?`,

    hesapla: (p) => Math.round((p.Q / p.V) * 100) / 100,

    cevapFormatla: (d) => `${d} μF`,

    yanlisCevapStratejisi: 'ters-islem',

    aciklamaSablonu: (p, d) =>
      `C = Q/V = ${p.Q} μC / ${p.V} V = ${d} μF`,
  },

  // ─────────────────────────────────────────────────────────
  // 17. Kondansatör Enerjisi: E = 0.5·C·V²
  // ─────────────────────────────────────────────────────────
  {
    id: 'e11-kondansator-enerji',
    sinif: 11,
    konuId: 'elektrik-11',
    altKonuId: 'kondansator',
    zorluk: 3,
    aytMi: true,
    ilgiliFormul: 'E = ½·C·V²',
    kazanim: 'Kondansatörde depolanan enerjiyi hesaplar.',
    sure: 90,
    ipucuSablonu: 'E = ½CV². C\'yi Farad\'a çevir (μF × 10⁻⁶), V²\'yi unutma.',

    parametreler: {
      C: { min: 2,  max: 10, adim: 2, birim: 'μF', tamsayi: true },
      V: { min: 10, max: 50, adim: 10, birim: 'V', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Sığası ${p.C} μF olan bir kondansatör ${p.V} V\'ye şarj ediliyor. Kondansatörde depolanan enerji kaç J\'dür?`,

    hesapla: (p) => {
      const C = p.C * 1e-6;
      return Math.round(0.5 * C * p.V * p.V * 1e7) / 1e7;
    },

    cevapFormatla: (d) => `${d.toExponential(2)} J`,

    yanlisCevapStratejisi: 'karekok-hata',

    aciklamaSablonu: (p, d) =>
      `E = ½CV² = 0.5 × ${p.C}×10⁻⁶ × ${p.V}² = ${d.toExponential(2)} J`,
  },

  // ─────────────────────────────────────────────────────────
  // 18. Seri Kondansatörler: 1/C = 1/C1 + 1/C2
  // ─────────────────────────────────────────────────────────
  {
    id: 'e11-seri-kondansator',
    sinif: 11,
    konuId: 'elektrik-11',
    altKonuId: 'kondansator',
    zorluk: 3,
    aytMi: true,
    ilgiliFormul: '1/C_eş = 1/C₁ + 1/C₂',
    kazanim: 'Seri bağlı kondansatörlerin eşdeğer sığasını hesaplar.',
    sure: 90,
    ipucuSablonu: 'Seri kondansatörler, paralel dirençler gibi davranır: C_eş = C₁C₂/(C₁+C₂).',

    parametreler: {
      C1: { min: 4, max: 12, adim: 4, birim: 'μF', tamsayi: true },
      C2: { min: 6, max: 12, adim: 6, birim: 'μF', tamsayi: true },
    },

    soruSablonu: (p) =>
      `C₁ = ${p.C1} μF ve C₂ = ${p.C2} μF olan iki kondansatör seri bağlanmıştır. Eşdeğer sığa kaç μF\'dır?`,

    hesapla: (p) => Math.round((p.C1 * p.C2) / (p.C1 + p.C2) * 100) / 100,

    cevapFormatla: (d) => `${d} μF`,

    yanlisCevapStratejisi: 'ters-islem',

    aciklamaSablonu: (p, d) =>
      `C_eş = (C₁×C₂)/(C₁+C₂) = (${p.C1}×${p.C2})/(${p.C1 + p.C2}) = ${d} μF`,
  },

  // ─────────────────────────────────────────────────────────
  // 19. Paralel Kondansatörler: C = C1 + C2
  // ─────────────────────────────────────────────────────────
  {
    id: 'e11-paralel-kondansator',
    sinif: 11,
    konuId: 'elektrik-11',
    altKonuId: 'kondansator',
    zorluk: 2,
    aytMi: true,
    ilgiliFormul: 'C_eş = C₁ + C₂',
    kazanim: 'Paralel bağlı kondansatörlerin eşdeğer sığasını hesaplar.',
    sure: 60,
    ipucuSablonu: 'Paralel kondansatörlerin sığaları doğrudan toplanır.',

    parametreler: {
      C1: { min: 3, max: 10, adim: 1, birim: 'μF', tamsayi: true },
      C2: { min: 5, max: 15, adim: 1, birim: 'μF', tamsayi: true },
    },

    soruSablonu: (p) =>
      `C₁ = ${p.C1} μF ve C₂ = ${p.C2} μF olan iki kondansatör paralel bağlanmıştır. Eşdeğer sığa kaç μF\'dır?`,

    hesapla: (p) => p.C1 + p.C2,

    cevapFormatla: (d) => `${d} μF`,

    yanlisCevapStratejisi: 'aritmetik-hata',

    aciklamaSablonu: (p, d) =>
      `Paralel bağlı kondansatörlerde C_eş = C₁ + C₂ = ${p.C1} + ${p.C2} = ${d} μF`,
  },

  // ─────────────────────────────────────────────────────────
  // 20. Hareketli Yüke Manyetik Kuvvet: F = q·v·B
  // ─────────────────────────────────────────────────────────
  {
    id: 'e11-manyetik-yuk',
    sinif: 11,
    konuId: 'elektrik-11',
    altKonuId: 'manyetizma',
    zorluk: 3,
    aytMi: true,
    ilgiliFormul: 'F = q·v·B  (v ⊥ B)',
    kazanim: 'Manyetik alanda hareket eden yüklü parçacığa etkiyen kuvveti hesaplar.',
    sure: 100,
    ipucuSablonu: 'F = qvB (v ve B dik ise). q\'yu Coulomb\'a çevir: μC × 10⁻⁶.',

    parametreler: {
      q: { min: 2,   max: 8,   adim: 2,   birim: 'μC',  tamsayi: true },
      v: { min: 100, max: 500, adim: 100, birim: 'm/s', tamsayi: true },
      B: { min: 1,   max: 3,   adim: 1,   birim: 'T',   tamsayi: true },
    },

    soruSablonu: (p) =>
      `q = ${p.q} μC yüklü bir parçacık, ${p.B} T\'lik homojen bir manyetik alana dik olarak ${p.v} m/s hızla giriyor. Parçacığa etkiyen manyetik kuvvet kaç N\'dur?`,

    hesapla: (p) => Math.round(p.q * 1e-6 * p.v * p.B * 1e4) / 1e4,

    cevapFormatla: (d) => `${d} N`,

    yanlisCevapStratejisi: 'birim-donusum',

    aciklamaSablonu: (p, d) =>
      `F = qvB = ${p.q}×10⁻⁶ × ${p.v} × ${p.B} = ${d} N`,
  },

  // ─────────────────────────────────────────────────────────
  // 21. Akım Taşıyan Tele Manyetik Kuvvet: F = B·I·L
  // ─────────────────────────────────────────────────────────
  {
    id: 'e11-manyetik-tel',
    sinif: 11,
    konuId: 'elektrik-11',
    altKonuId: 'manyetizma',
    zorluk: 3,
    aytMi: true,
    ilgiliFormul: 'F = B·I·L',
    kazanim: 'Manyetik alanda akım taşıyan tele etkiyen kuvveti hesaplar.',
    sure: 90,
    ipucuSablonu: 'F = BIL. B Tesla, I Amper, L metre cinsinden.',

    parametreler: {
      B: { min: 1, max: 3,  adim: 1, birim: 'T', tamsayi: true },
      I: { min: 2, max: 10, adim: 2, birim: 'A', tamsayi: true },
      L: { min: 1, max: 5,  adim: 1, birim: 'm', tamsayi: true },
    },

    soruSablonu: (p) =>
      `${p.B} T\'lik homojen manyetik alanda, ${p.I} A akım taşıyan ve alandaki uzunluğu ${p.L} m olan bir tele etkiyen manyetik kuvvet kaç N\'dur? (Tel manyetik alana dik)`,

    hesapla: (p) => p.B * p.I * p.L,

    cevapFormatla: (d) => `${d} N`,

    yanlisCevapStratejisi: 'carpim-bolum-toplam',

    aciklamaSablonu: (p, d) =>
      `F = B·I·L = ${p.B} × ${p.I} × ${p.L} = ${d} N`,
  },

  // ─────────────────────────────────────────────────────────
  // 22. Manyetik Akı: Φ = B·A·cosθ
  // ─────────────────────────────────────────────────────────
  {
    id: 'e11-manyetik-aki',
    sinif: 11,
    konuId: 'elektrik-11',
    altKonuId: 'manyetizma',
    zorluk: 3,
    aytMi: true,
    ilgiliFormul: 'Φ = B·A·cosθ',
    kazanim: 'Bir yüzeyden geçen manyetik akıyı hesaplar.',
    sure: 90,
    ipucuSablonu: 'Φ = BAcosθ. θ = 0° ise cosθ = 1 (maksimum akı), θ = 90° ise akı sıfır.',

    parametreler: {
      B: { min: 1, max: 3, adim: 1,    birim: 'T',  tamsayi: true },
      A: { min: 2, max: 8, adim: 2,    birim: 'm²', tamsayi: true },
      cosTheta: { degerler: [1, 0.87, 0.5, 0] },
    },

    soruSablonu: (p) =>
      `${p.B} T\'lik homojen manyetik alan ile normal arasındaki açının kosinüsü ${p.cosTheta} olan ${p.A} m²\'lik bir yüzeyden geçen manyetik akı kaç Wb\'dır?`,

    hesapla: (p) => Math.round(p.B * p.A * p.cosTheta * 100) / 100,

    cevapFormatla: (d) => `${d} Wb`,

    yanlisCevapStratejisi: 'sin-cos-karisimi',

    aciklamaSablonu: (p, d) =>
      `Φ = B·A·cosθ = ${p.B} × ${p.A} × ${p.cosTheta} = ${d} Wb`,
  },

  // ─────────────────────────────────────────────────────────
  // 23. Faraday: ε = ΔΦ / Δt
  // ─────────────────────────────────────────────────────────
  {
    id: 'e11-faraday-emk',
    sinif: 11,
    konuId: 'elektrik-11',
    altKonuId: 'elektromanyetik-indukleme',
    zorluk: 3,
    aytMi: true,
    ilgiliFormul: 'ε = ΔΦ / Δt',
    kazanim: 'Faraday indüksiyon yasasını kullanarak EMK hesaplar.',
    sure: 100,
    ipucuSablonu: 'ε = ΔΦ/Δt. Manyetik akıdaki değişimi süreye böl.',

    parametreler: {
      dPhi: { min: 2,  max: 10, adim: 2, birim: 'Wb', tamsayi: true },
      dt:   { min: 1,  max: 5,  adim: 1, birim: 's',  tamsayi: true },
    },

    soruSablonu: (p) =>
      `Bir bobinden geçen manyetik akı ${p.dt} s içinde ${p.dPhi} Wb kadar değişiyor. Bobinde oluşan indüksiyon EMK\'sı kaç V\'dur?`,

    hesapla: (p) => Math.round((p.dPhi / p.dt) * 100) / 100,

    cevapFormatla: (d) => `${d} V`,

    yanlisCevapStratejisi: 'ters-islem',

    aciklamaSablonu: (p, d) =>
      `ε = ΔΦ/Δt = ${p.dPhi} Wb / ${p.dt} s = ${d} V`,
  },

  // ─────────────────────────────────────────────────────────
  // 24. Transformatör: Gerilim Oranı
  // ─────────────────────────────────────────────────────────
  {
    id: 'e11-trafo-gerilim',
    sinif: 11,
    konuId: 'elektrik-11',
    altKonuId: 'transformator',
    zorluk: 3,
    aytMi: true,
    ilgiliFormul: 'V₁/V₂ = N₁/N₂',
    kazanim: 'Transformatörde gerilim ve sarım sayısı arasındaki oranı kullanır.',
    sure: 90,
    ipucuSablonu: 'V₁/V₂ = N₁/N₂. Çıkış gerilimini bulmak için çapraz çarp.',

    parametreler: {
      V1: { min: 220, max: 440, adim: 220, birim: 'V', tamsayi: true },
      N1: { min: 100, max: 500, adim: 100, birim: 'sarım', tamsayi: true },
      N2: { min: 10,  max: 50,  adim: 10,  birim: 'sarım', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Bir transformatörün birincil sargısında N₁ = ${p.N1} sarım ve V₁ = ${p.V1} V gerilim bulunmaktadır. İkincil sargıda N₂ = ${p.N2} sarım varsa çıkış gerilimi kaç V\'dur?`,

    hesapla: (p) => Math.round((p.V1 * p.N2) / p.N1 * 100) / 100,

    cevapFormatla: (d) => `${d} V`,

    yanlisCevapStratejisi: 'ters-islem',

    aciklamaSablonu: (p, d) =>
      `V₁/V₂ = N₁/N₂  →  V₂ = V₁ × N₂/N₁ = ${p.V1} × ${p.N2}/${p.N1} = ${d} V`,
  },

  // ─────────────────────────────────────────────────────────
  // 25. Transformatör: Akım Oranı
  // ─────────────────────────────────────────────────────────
  {
    id: 'e11-trafo-akim',
    sinif: 11,
    konuId: 'elektrik-11',
    altKonuId: 'transformator',
    zorluk: 3,
    aytMi: true,
    ilgiliFormul: 'I₁/I₂ = N₂/N₁',
    kazanim: 'Transformatörde akım ve sarım sayısı arasındaki ters oranı kullanır.',
    sure: 90,
    ipucuSablonu: 'I₁/I₂ = N₂/N₁ (ters oran). Yüksek gerilim tarafında akım az, düşük tarafta fazla.',

    parametreler: {
      I1: { min: 1,   max: 5,   adim: 1,   birim: 'A',    tamsayi: true },
      N1: { min: 200, max: 400, adim: 100, birim: 'sarım', tamsayi: true },
      N2: { min: 20,  max: 40,  adim: 10,  birim: 'sarım', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Bir transformatörün birincil sargısından I₁ = ${p.I1} A akım geçmektedir. N₁ = ${p.N1}, N₂ = ${p.N2} ise ikincil sargıdaki akım kaç A\'dır?`,

    hesapla: (p) => Math.round((p.I1 * p.N1) / p.N2 * 100) / 100,

    cevapFormatla: (d) => `${d} A`,

    yanlisCevapStratejisi: 'ters-islem',

    aciklamaSablonu: (p, d) =>
      `I₁/I₂ = N₂/N₁  →  I₂ = I₁ × N₁/N₂ = ${p.I1} × ${p.N1}/${p.N2} = ${d} A`,
  },

  // ─────────────────────────────────────────────────────────
  // 26. Solenoid Manyetik Alan: B = μ₀·n·I
  // ─────────────────────────────────────────────────────────
  {
    id: 'e11-solenoid-B',
    sinif: 11,
    konuId: 'elektrik-11',
    altKonuId: 'manyetizma',
    zorluk: 3,
    aytMi: true,
    ilgiliFormul: 'B = μ₀·n·I   (μ₀ = 4π×10⁻⁷ T·m/A)',
    kazanim: 'Solenoidin içindeki manyetik alan şiddetini hesaplar.',
    sure: 100,
    ipucuSablonu: 'B = μ₀nI. n = sarım sayısı/uzunluk (sarım/m). μ₀ ≈ 4π×10⁻⁷.',

    parametreler: {
      n: { min: 500,  max: 2000, adim: 500, birim: 'sarım/m', tamsayi: true },
      I: { min: 1,    max: 5,    adim: 1,   birim: 'A',       tamsayi: true },
    },

    soruSablonu: (p) =>
      `Birim uzunluğa n = ${p.n} sarım olan ve ${p.I} A akım taşıyan bir solenoidin içindeki manyetik alan şiddeti kaç T\'dir? (μ₀ = 4π×10⁻⁷ T·m/A)`,

    hesapla: (p) => {
      const mu0 = 4 * Math.PI * 1e-7;
      return Math.round(mu0 * p.n * p.I * 1e6) / 1e6;
    },

    cevapFormatla: (d) => `${d.toFixed(4)} T`,

    yanlisCevapStratejisi: 'sabit-carpan',

    aciklamaSablonu: (p, d) =>
      `B = μ₀·n·I = 4π×10⁻⁷ × ${p.n} × ${p.I} = ${d.toFixed(4)} T`,
  },

  // ─────────────────────────────────────────────────────────
  // 27. RC Devresi: Zaman Sabiti τ = R·C
  // ─────────────────────────────────────────────────────────
  {
    id: 'e11-rc-tau',
    sinif: 11,
    konuId: 'elektrik-11',
    altKonuId: 'kondansator',
    zorluk: 3,
    aytMi: true,
    ilgiliFormul: 'τ = R·C',
    kazanim: 'RC devresinin zaman sabitini hesaplar ve anlamını yorumlar.',
    sure: 90,
    ipucuSablonu: 'τ = RC. R ohm, C Farad cinsinden. τ, kondansatörün %63 dolması için geçen süredir.',

    parametreler: {
      R: { min: 1,  max: 10,  adim: 1, birim: 'kΩ', tamsayi: true },
      C: { min: 10, max: 100, adim: 10, birim: 'μF', tamsayi: true },
    },

    soruSablonu: (p) =>
      `R = ${p.R} kΩ\'luk bir direnç ve C = ${p.C} μF\'lık bir kondansatör seri bağlanarak RC devresi oluşturuluyor. Bu devrenin zaman sabiti kaç ms\'dir?`,

    hesapla: (p) => Math.round(p.R * 1e3 * p.C * 1e-6 * 1000 * 100) / 100,

    cevapFormatla: (d) => `${d} ms`,

    yanlisCevapStratejisi: 'birim-donusum',

    aciklamaSablonu: (p, d) =>
      `τ = R×C = ${p.R}×10³ Ω × ${p.C}×10⁻⁶ F = ${d}×10⁻³ s = ${d} ms`,
  },

  // ─────────────────────────────────────────────────────────
  // 28. Karma Devre (Seri-Paralel Kombinasyonu)
  // ─────────────────────────────────────────────────────────
  {
    id: 'e11-karma-devre',
    sinif: 11,
    konuId: 'elektrik-11',
    altKonuId: 'karma-devre',
    zorluk: 4,
    aytMi: true,
    ilgiliFormul: 'R_eş = R₁ + R₂R₃/(R₂+R₃)',
    kazanim: 'Seri ve paralel bağlı dirençleri içeren karma devrenin eşdeğer direncini hesaplar.',
    sure: 120,
    ipucuSablonu: 'Önce paralel grubun eşdeğer direncini bul, sonra seri dirençle topla.',

    parametreler: {
      R1: { min: 2,  max: 6,  adim: 2, birim: 'Ω', tamsayi: true },
      R2: { min: 4,  max: 8,  adim: 4, birim: 'Ω', tamsayi: true },
      R3: { min: 4,  max: 12, adim: 4, birim: 'Ω', tamsayi: true },
    },

    soruSablonu: (p) =>
      `R₂ = ${p.R2} Ω ve R₃ = ${p.R3} Ω dirençleri paralel bağlı; bu grup R₁ = ${p.R1} Ω ile seri bağlanmıştır. Devrenin eşdeğer direnci kaç Ω\'dur?`,

    hesapla: (p) => {
      const Rp = (p.R2 * p.R3) / (p.R2 + p.R3);
      return Math.round((p.R1 + Rp) * 100) / 100;
    },

    cevapFormatla: (d) => `${d} Ω`,

    yanlisCevapStratejisi: 'aritmetik-hata',

    aciklamaSablonu: (p, d) => {
      const Rp = Math.round((p.R2 * p.R3) / (p.R2 + p.R3) * 100) / 100;
      return `R_paralel = (${p.R2}×${p.R3})/(${p.R2}+${p.R3}) = ${Rp} Ω\nR_eş = R₁ + R_paralel = ${p.R1} + ${Rp} = ${d} Ω`;
    },
  },

  // ─────────────────────────────────────────────────────────
  // 29. İç Direnç: V = ε - I·r
  // ─────────────────────────────────────────────────────────
  {
    id: 'e11-ic-direnç',
    sinif: 11,
    konuId: 'elektrik-11',
    altKonuId: 'ohm-yasasi',
    zorluk: 3,
    aytMi: true,
    ilgiliFormul: 'V = ε - I·r',
    kazanim: 'İç direnci olan bir pilin uç gerilimini hesaplar.',
    sure: 100,
    ipucuSablonu: 'Uç gerilimi = EMK - İç dirençteki düşüm. V = ε - Ir.',

    parametreler: {
      emk: { min: 6,  max: 24, adim: 6, birim: 'V', tamsayi: true },
      I:   { min: 1,  max: 4,  adim: 1, birim: 'A', tamsayi: true },
      r:   { min: 1,  max: 3,  adim: 1, birim: 'Ω', tamsayi: true },
    },

    soruSablonu: (p) =>
      `EMK\'sı ε = ${p.emk} V ve iç direnci r = ${p.r} Ω olan bir pilden ${p.I} A akım çekilmektedir. Pilin uç gerilimi kaç V\'dur?`,

    hesapla: (p) => p.emk - p.I * p.r,

    cevapFormatla: (d) => `${d} V`,

    yanlisCevapStratejisi: 'isaretli-hata',

    aciklamaSablonu: (p, d) =>
      `V = ε - I·r = ${p.emk} - ${p.I}×${p.r} = ${p.emk} - ${p.I * p.r} = ${d} V`,
  },

  // ─────────────────────────────────────────────────────────
  // 30. Maksimum Güç Transferi: P_max = ε² / (4r)
  // ─────────────────────────────────────────────────────────
  {
    id: 'e11-max-guc',
    sinif: 11,
    konuId: 'elektrik-11',
    altKonuId: 'ohm-yasasi',
    zorluk: 4,
    aytMi: true,
    ilgiliFormul: 'P_max = ε² / (4r)',
    kazanim: 'Bir pilde dış devreye aktarılabilecek maksimum gücü hesaplar.',
    sure: 120,
    ipucuSablonu: 'Maksimum güç transferi R_dış = r olduğunda gerçekleşir. P_max = ε²/(4r).',

    parametreler: {
      emk: { min: 6,  max: 24, adim: 6, birim: 'V', tamsayi: true },
      r:   { min: 1,  max: 4,  adim: 1, birim: 'Ω', tamsayi: true },
    },

    soruSablonu: (p) =>
      `EMK\'sı ε = ${p.emk} V ve iç direnci r = ${p.r} Ω olan bir pilin dış devreye aktarabileceği maksimum güç kaç W\'dır?`,

    hesapla: (p) => Math.round((p.emk * p.emk) / (4 * p.r) * 100) / 100,

    cevapFormatla: (d) => `${d} W`,

    yanlisCevapStratejisi: 'sabit-carpan',

    aciklamaSablonu: (p, d) =>
      `Maksimum güç transferi R_dış = r şartında gerçekleşir.\nP_max = ε²/(4r) = ${p.emk}²/(4×${p.r}) = ${p.emk * p.emk}/${4 * p.r} = ${d} W`,
  },
];
