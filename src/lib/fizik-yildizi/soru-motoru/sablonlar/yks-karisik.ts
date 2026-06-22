// ============================================================
// Fizik Yıldızı – YKS Karışık Şablonlar (TYT + AYT)
// ============================================================
// TYT: 10 şablon (9-10. sınıf, zorluk 2-3)
// AYT: 20 şablon (11-12. sınıf, zorluk 4-5)
// ============================================================

import { SoruSablonu } from '../tipler';

export const yksKarisikSablonlar: SoruSablonu[] = [

  // ════════════════════════════════════════════════════════════
  //  TYT BÖLÜMÜ  (1–10)
  // ════════════════════════════════════════════════════════════

  // ─────────────────────────────────────────────────────────────
  // TYT-1. Newton II + Sürtünme (Eğimli Düzlem)
  //   Ağırlık bileşeni: F_net = m·g·sinθ − μ·m·g·cosθ
  //   a = g(sinθ − μ·cosθ)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'yks-tyt-01',
    sinif: 10,
    konuId: 'kuvvet-hareket',
    altKonuId: 'newton-yasalari',
    zorluk: 3,
    tytMi: true,
    ilgiliFormul: 'a = g(sinθ − μcosθ)',
    kazanim: 'Eğimli düzlemde Newton II ve sürtünme kuvvetini birlikte uygular.',
    sure: 120,
    ipucuSablonu: 'F_net = m·g·sinθ − f; f = μ·m·g·cosθ. İvme: a = F_net/m.',

    parametreler: {
      m:   { min: 2, max: 10, adim: 1, birim: 'kg', tamsayi: true },
      // θ = 30° → sinθ=0.5, cosθ=0.866
      // θ = 45° → sinθ=0.707, cosθ=0.707
      // θ = 37° → sinθ=0.6, cosθ=0.8  (TYT klasiği)
      sinT: { degerler: [0.6], birim: '' },   // sin 37°
      cosT: { degerler: [0.8], birim: '' },   // cos 37°
      mu:   { min: 1, max: 3, adim: 1, birim: '' }, // μ × 10 (gerçek μ = mu/10)
    },

    soruSablonu: (p) => {
      const muReal = p.mu / 10;
      return (
        `Kütlesi ${p.m} kg olan bir cisim 37°'lik eğimli düzlemde aşağı doğru kaymaktadır. ` +
        `Sürtünme katsayısı μ = ${muReal} olduğuna göre cismin ivmesi kaç m/s²'dir? ` +
        `(g = 10 m/s², sin 37° = 0,6, cos 37° = 0,8)`
      );
    },

    hesapla: (p) => {
      // a = g(sinθ − μ·cosθ)
      const muReal = p.mu / 10;
      return parseFloat((10 * (p.sinT - muReal * p.cosT)).toFixed(2));
    },

    cevapFormatla: (a) => `${a} m/s²`,

    yanlisCevapStratejisi: 'sin-cos-karisimi',

    aciklamaSablonu: (p, dogruCevap) => {
      const muReal = p.mu / 10;
      const sinT = p.sinT;
      const cosT = p.cosT;
      return (
        `**Çözüm:**\n\n` +
        `Eğimli düzlemde: F_net = m·g·sinθ − μ·m·g·cosθ\n\n` +
        `a = g(sinθ − μ·cosθ) = 10 × (${sinT} − ${muReal} × ${cosT})\n\n` +
        `a = 10 × (${sinT} − ${(muReal * cosT).toFixed(2)})\n\n` +
        `a = 10 × ${(sinT - muReal * cosT).toFixed(2)}\n\n` +
        `**a = ${dogruCevap} m/s²**`
      );
    },
  },

  // ─────────────────────────────────────────────────────────────
  // TYT-2. Enerji Korunumu + Sürtünme (Eğimde h'den h=0'a)
  //   W_net = ΔKE → mgh − f·d = ½mv²
  //   f = μ·mg·cosθ,  d = h/sinθ
  // ─────────────────────────────────────────────────────────────
  {
    id: 'yks-tyt-02',
    sinif: 10,
    konuId: 'enerji-is-guc',
    altKonuId: 'enerji-korunumu',
    zorluk: 3,
    tytMi: true,
    ilgiliFormul: 'mgh − μmgcosθ·(h/sinθ) = ½mv²',
    kazanim: 'Eğimli düzlemde enerji korunumu ve sürtünme işini hesaplayarak hızı bulur.',
    sure: 130,
    ipucuSablonu: 'W_net = ΔKE. Sürtünme işi: W_f = −μ·mg·cosθ·d, d = h/sinθ.',

    parametreler: {
      m:    { min: 1, max: 5, adim: 1, birim: 'kg', tamsayi: true },
      h:    { min: 3, max: 9, adim: 3, birim: 'm', tamsayi: true },
      mu:   { degerler: [1, 2, 3], birim: '' }, // μ × 10
      sinT: { degerler: [0.6] },
      cosT: { degerler: [0.8] },
    },

    soruSablonu: (p) => {
      const muReal = p.mu / 10;
      return (
        `Kütlesi ${p.m} kg olan bir cisim ${p.h} m yüksekliğindeki 37°'lik eğimli düzlemden hareketsiz bırakılıyor. ` +
        `Sürtünme katsayısı μ = ${muReal} olan bu düzlemin altına ulaşan cismin hızı kaç m/s'dir? ` +
        `(g = 10 m/s², sin 37° = 0,6, cos 37° = 0,8)`
      );
    },

    hesapla: (p) => {
      const muReal = p.mu / 10;
      // d = h / sinθ
      const d = p.h / p.sinT;
      // ½mv² = mgh − μmgcosθ·d
      const v2 = 2 * (10 * p.h - muReal * 10 * p.cosT * d);
      return parseFloat(Math.sqrt(Math.max(0, v2)).toFixed(2));
    },

    cevapFormatla: (v) => `${v} m/s`,

    yanlisCevapStratejisi: 'karekok-hata',

    aciklamaSablonu: (p, dogruCevap) => {
      const muReal = p.mu / 10;
      const d = p.h / p.sinT;
      const Wyer = p.m * 10 * p.h;
      const Wf   = muReal * p.m * 10 * p.cosT * d;
      const KE   = Wyer - Wf;
      return (
        `**Çözüm:**\n\n` +
        `Eğim boyu: d = h/sinθ = ${p.h}/${p.sinT} = ${d.toFixed(2)} m\n\n` +
        `Yerçekimi işi: W_g = mgh = ${p.m}×10×${p.h} = ${Wyer} J\n\n` +
        `Sürtünme işi: W_f = μmgcosθ·d = ${muReal}×${p.m}×10×${p.cosT}×${d.toFixed(2)} = ${Wf.toFixed(2)} J\n\n` +
        `½mv² = W_g − W_f = ${Wyer} − ${Wf.toFixed(2)} = ${KE.toFixed(2)} J\n\n` +
        `v = √(2·${KE.toFixed(2)}/${p.m}) = **${dogruCevap} m/s**`
      );
    },
  },

  // ─────────────────────────────────────────────────────────────
  // TYT-3. Momentum + Kinetik Enerji (Çarpışma Sonrası)
  //   Tamamen esnek olmayan çarpışma: p korunur, ΔKE bul
  // ─────────────────────────────────────────────────────────────
  {
    id: 'yks-tyt-03',
    sinif: 10,
    konuId: 'momentum',
    altKonuId: 'carpismalar',
    zorluk: 3,
    tytMi: true,
    ilgiliFormul: 'm₁v₁ = (m₁+m₂)v₂  →  ΔKE = KE₁ − KE₂',
    kazanim: 'Tamamen esnek olmayan çarpışmada momentum korunumunu kullanır ve kinetik enerji kaybını hesaplar.',
    sure: 130,
    ipucuSablonu: 'Momentum korunur: m₁v₁ = (m₁+m₂)v_son. ΔKE = ½m₁v₁² − ½(m₁+m₂)v_son².',

    parametreler: {
      m1: { min: 2, max: 6, adim: 1, birim: 'kg', tamsayi: true },
      m2: { min: 2, max: 6, adim: 1, birim: 'kg', tamsayi: true },
      v1: { min: 4, max: 10, adim: 2, birim: 'm/s', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Kütlesi ${p.m1} kg olan bir araba ${p.v1} m/s hızla ilerlerken hareketsiz duran ${p.m2} kg kütleli başka bir arabaya çarptıktan sonra yapışarak hareket ediyor. ` +
      `Çarpışma sırasında kaybedilen kinetik enerji kaç J'dür?`,

    hesapla: (p) => {
      // v_son = m1*v1 / (m1+m2)
      const v_son = (p.m1 * p.v1) / (p.m1 + p.m2);
      const KE_once = 0.5 * p.m1 * p.v1 * p.v1;
      const KE_sonra = 0.5 * (p.m1 + p.m2) * v_son * v_son;
      return parseFloat((KE_once - KE_sonra).toFixed(2));
    },

    cevapFormatla: (dE) => `${dE} J`,

    yanlisCevapStratejisi: 'karekok-hata',

    aciklamaSablonu: (p, dogruCevap) => {
      const v_son = (p.m1 * p.v1) / (p.m1 + p.m2);
      const KE1 = 0.5 * p.m1 * p.v1 ** 2;
      const KE2 = 0.5 * (p.m1 + p.m2) * v_son ** 2;
      return (
        `**Çözüm:**\n\n` +
        `**Adım 1 – Momentum korunumu:**\n` +
        `m₁v₁ = (m₁+m₂)v_son\n` +
        `v_son = (${p.m1} × ${p.v1}) / (${p.m1}+${p.m2}) = ${v_son.toFixed(2)} m/s\n\n` +
        `**Adım 2 – Kinetik enerjiler:**\n` +
        `KE_önce = ½ × ${p.m1} × ${p.v1}² = ${KE1.toFixed(2)} J\n` +
        `KE_sonra = ½ × ${p.m1 + p.m2} × ${v_son.toFixed(2)}² = ${KE2.toFixed(2)} J\n\n` +
        `**ΔKE = ${KE1.toFixed(2)} − ${KE2.toFixed(2)} = ${dogruCevap} J**`
      );
    },
  },

  // ─────────────────────────────────────────────────────────────
  // TYT-4. Yatay Atış: Maksimum Yükseklik + Menzil
  //   H = v₀²sin²θ/(2g),  R = v₀²sin2θ/g
  // ─────────────────────────────────────────────────────────────
  {
    id: 'yks-tyt-04',
    sinif: 10,
    konuId: 'kinematik',
    altKonuId: 'atislar',
    zorluk: 2,
    tytMi: true,
    ilgiliFormul: 'H = v₀²sin²θ / (2g)',
    kazanim: '37° veya 53° açıyla atılan cismin maksimum yüksekliğini hesaplar.',
    sure: 110,
    ipucuSablonu: 'H = (v₀sinθ)² / (2g). Dikey bileşen: v_y = v₀sinθ.',

    parametreler: {
      v0:   { min: 20, max: 50, adim: 10, birim: 'm/s', tamsayi: true },
      sinT: { degerler: [0.6] },  // 37°
      cosT: { degerler: [0.8] },
    },

    soruSablonu: (p) =>
      `Yatay ile 37° açı yapacak şekilde ${p.v0} m/s başlangıç hızıyla fırlatılan bir cismin ulaşabileceği maksimum yükseklik kaç metredir? ` +
      `(g = 10 m/s², sin 37° = 0,6, cos 37° = 0,8)`,

    hesapla: (p) => {
      // H = (v0*sinθ)² / (2g)
      const vy = p.v0 * p.sinT;
      return parseFloat((vy * vy / (2 * 10)).toFixed(2));
    },

    cevapFormatla: (H) => `${H} m`,

    yanlisCevapStratejisi: 'karekok-hata',

    aciklamaSablonu: (p, dogruCevap) => {
      const vy = p.v0 * p.sinT;
      return (
        `**Çözüm:**\n\n` +
        `Dikey bileşen: v_y = v₀·sinθ = ${p.v0} × ${p.sinT} = ${vy} m/s\n\n` +
        `Maksimum yükseklikte v_y = 0, bu nedenle:\n` +
        `**H = v_y² / (2g) = ${vy}² / (2×10) = ${vy * vy} / 20**\n\n` +
        `**H = ${dogruCevap} m**`
      );
    },
  },

  // ─────────────────────────────────────────────────────────────
  // TYT-5. Seri-Paralel Devre
  //   Paralel: 1/R_p = 1/R2 + 1/R3; Toplam: R_t = R1 + R_p
  //   I_toplam = V / R_t
  // ─────────────────────────────────────────────────────────────
  {
    id: 'yks-tyt-05',
    sinif: 10,
    konuId: 'elektrik',
    altKonuId: 'devreler',
    zorluk: 3,
    tytMi: true,
    ilgiliFormul: 'R_seri = R₁ + R_paralel; I = V/R',
    kazanim: 'Seri ve paralel direnç kombinasyonunu çözer; toplam akımı hesaplar.',
    sure: 120,
    ipucuSablonu: 'Önce paralel direnci bul: R_p = R₂R₃/(R₂+R₃). Sonra R_t = R₁ + R_p.',

    parametreler: {
      V:  { min: 12, max: 36, adim: 6, birim: 'V', tamsayi: true },
      R1: { min: 2,  max: 6,  adim: 1, birim: 'Ω', tamsayi: true },
      R2: { min: 4,  max: 12, adim: 4, birim: 'Ω', tamsayi: true },
      R3: { min: 4,  max: 12, adim: 4, birim: 'Ω', tamsayi: true },
    },

    soruSablonu: (p) =>
      `${p.V} V'luk bir pil, R₁ = ${p.R1} Ω direnciyle seri bağlı olan ve R₂ = ${p.R2} Ω ile R₃ = ${p.R3} Ω'luk dirençlerin paralel kombinasyonuna bağlıdır. ` +
      `Devreden geçen toplam akım kaç A'dir?`,

    hesapla: (p) => {
      const R_p = (p.R2 * p.R3) / (p.R2 + p.R3);
      const R_t = p.R1 + R_p;
      return parseFloat((p.V / R_t).toFixed(2));
    },

    cevapFormatla: (I) => `${I} A`,

    yanlisCevapStratejisi: 'ters-islem',

    aciklamaSablonu: (p, dogruCevap) => {
      const R_p = (p.R2 * p.R3) / (p.R2 + p.R3);
      const R_t = p.R1 + R_p;
      return (
        `**Çözüm:**\n\n` +
        `**Adım 1 – Paralel direnç:**\n` +
        `R_p = R₂·R₃/(R₂+R₃) = (${p.R2}×${p.R3})/(${p.R2}+${p.R3}) = ${R_p.toFixed(2)} Ω\n\n` +
        `**Adım 2 – Toplam direnç:**\n` +
        `R_t = R₁ + R_p = ${p.R1} + ${R_p.toFixed(2)} = ${R_t.toFixed(2)} Ω\n\n` +
        `**Adım 3 – Toplam akım:**\n` +
        `I = V/R_t = ${p.V} / ${R_t.toFixed(2)} = **${dogruCevap} A**`
      );
    },
  },

  // ─────────────────────────────────────────────────────────────
  // TYT-6. Basınç + Kaldırma Kuvveti Kombine
  //   Suda asılı duran cisim: F_k = G → d_sıvı·g·V = m·g
  //   → V = m / d_sıvı; sonra P = d·g·h (yüzeyden derinlik)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'yks-tyt-06',
    sinif: 9,
    konuId: 'madde-ozellikleri-9',
    altKonuId: 'kaldirma-kuvveti',
    zorluk: 3,
    tytMi: true,
    ilgiliFormul: 'F_k = d_sıvı·g·V; P = d·g·h',
    kazanim: 'Kaldırma kuvveti dengesinden cismin hacmini, hacimden basıncını hesaplar.',
    sure: 130,
    ipucuSablonu: 'Askıda denge: F_k = G → V = m / d_sıvı. Basınç: P = d·g·h.',

    parametreler: {
      m:      { min: 100, max: 500, adim: 100, birim: 'g', tamsayi: true }, // gram
      d_sivi: { degerler: [1000], birim: 'kg/m³' },
      h:      { min: 2, max: 8, adim: 2, birim: 'm', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Kütlesi ${p.m} g olan bir cisim, yoğunluğu 1000 kg/m³ olan suyun içinde ${p.h} m derinlikte iplere bağlı olarak dengede durmaktadır. ` +
      `Cismin bulunduğu derinlikteki su basıncı kaç Pa'dır? (g = 10 m/s²)`,

    hesapla: (p) => p.d_sivi * 10 * p.h,

    cevapFormatla: (P) => `${P} Pa`,

    yanlisCevapStratejisi: 'carpim-bolum-toplam',

    aciklamaSablonu: (p, dogruCevap) =>
      `**Çözüm:**\n\n` +
      `Derinlikteki su basıncı sadece derinliğe, sıvının yoğunluğuna ve g'ye bağlıdır:\n\n` +
      `**P = d·g·h = 1000 × 10 × ${p.h} = ${dogruCevap} Pa**\n\n` +
      `*(Cismin kütlesi bu soruda tuzak: basınç cismin özelliklerine değil, sıvıya bağlıdır.)*`,
  },

  // ─────────────────────────────────────────────────────────────
  // TYT-7. Güç + Verimlilik
  //   P_faydalı = η × P_alınan; η = W_faydalı / W_toplam
  // ─────────────────────────────────────────────────────────────
  {
    id: 'yks-tyt-07',
    sinif: 10,
    konuId: 'enerji-is-guc',
    altKonuId: 'guc-verimlilik',
    zorluk: 2,
    tytMi: true,
    ilgiliFormul: 'P_çıkış = η × P_giriş',
    kazanim: 'Verimi ve güç tüketiminden faydalı güç veya harcanan enerjiyi hesaplar.',
    sure: 90,
    ipucuSablonu: 'η = P_çıkış / P_giriş → P_çıkış = η × P_giriş.',

    parametreler: {
      P_giris: { min: 1000, max: 5000, adim: 500, birim: 'W', tamsayi: true },
      eta:     { min: 5, max: 9, adim: 1, birim: '' }, // η × 10  (gerçek: 0.5–0.9)
    },

    soruSablonu: (p) => {
      const etaReal = p.eta / 10;
      return (
        `Giriş gücü ${p.P_giris} W olan ve verimi %${p.eta * 10} olan bir elektrik motoru ne kadarlık faydalı güç üretir?`
      );
    },

    hesapla: (p) => {
      const etaReal = p.eta / 10;
      return parseFloat((etaReal * p.P_giris).toFixed(1));
    },

    cevapFormatla: (P) => `${P} W`,

    yanlisCevapStratejisi: 'carpan-hatasi',

    aciklamaSablonu: (p, dogruCevap) => {
      const etaReal = p.eta / 10;
      return (
        `**Çözüm:**\n\n` +
        `**P_çıkış = η × P_giriş**\n\n` +
        `η = %${p.eta * 10} = ${etaReal}\n\n` +
        `P_çıkış = ${etaReal} × ${p.P_giris} W\n\n` +
        `**P_çıkış = ${dogruCevap} W**`
      );
    },
  },

  // ─────────────────────────────────────────────────────────────
  // TYT-8. Yay Potansiyel Enerjisi + Yay Sabiti
  //   F = k·x,  E_yay = ½·k·x²
  // ─────────────────────────────────────────────────────────────
  {
    id: 'yks-tyt-08',
    sinif: 10,
    konuId: 'enerji-is-guc',
    altKonuId: 'yay-enerjisi',
    zorluk: 2,
    tytMi: true,
    ilgiliFormul: 'E_yay = ½·k·x²',
    kazanim: 'Yay sabitini ve sıkıştırma miktarını kullanarak depolanan enerjiyi hesaplar.',
    sure: 90,
    ipucuSablonu: 'Yay potansiyel enerjisi: E = ½kx². k = F/x ile bulunabilir.',

    parametreler: {
      k: { min: 100, max: 1000, adim: 100, birim: 'N/m', tamsayi: true },
      x: { min: 0.05, max: 0.3, adim: 0.05, birim: 'm' },
    },

    soruSablonu: (p) =>
      `Yay sabiti ${p.k} N/m olan bir yay ${p.x} m sıkıştırılıyor. ` +
      `Yayda depolanan potansiyel enerji kaç J'dür?`,

    hesapla: (p) => parseFloat((0.5 * p.k * p.x * p.x).toFixed(4)),

    cevapFormatla: (E) => `${E} J`,

    yanlisCevapStratejisi: 'karekok-hata',

    aciklamaSablonu: (p, dogruCevap) =>
      `**Çözüm:**\n\n` +
      `Yay potansiyel enerjisi: **E = ½·k·x²**\n\n` +
      `E = ½ × ${p.k} × (${p.x})²\n\n` +
      `E = ½ × ${p.k} × ${(p.x * p.x).toFixed(4)}\n\n` +
      `**E = ${dogruCevap} J**`,
  },

  // ─────────────────────────────────────────────────────────────
  // TYT-9. Dairesel Hareket + Merkezcil Kuvvet
  //   F_c = m·v²/r = m·ω²·r
  // ─────────────────────────────────────────────────────────────
  {
    id: 'yks-tyt-09',
    sinif: 10,
    konuId: 'dairesel-hareket',
    altKonuId: 'merkezcil-kuvvet',
    zorluk: 2,
    tytMi: true,
    ilgiliFormul: 'F_c = m·v²/r',
    kazanim: 'Dairesel harekette merkezcil kuvveti hesaplar.',
    sure: 90,
    ipucuSablonu: 'F_c = mv²/r. v = 2πr/T ile hesaplanabilir.',

    parametreler: {
      m: { min: 1, max: 5, adim: 1, birim: 'kg', tamsayi: true },
      v: { min: 4, max: 20, adim: 4, birim: 'm/s', tamsayi: true },
      r: { min: 1, max: 5, adim: 1, birim: 'm', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Kütlesi ${p.m} kg olan bir cisim ${p.r} m yarıçaplı çemberde ${p.v} m/s sabit hızla dönmektedir. ` +
      `Cisme etki eden merkezcil kuvvet kaç N'dur?`,

    hesapla: (p) => parseFloat((p.m * p.v * p.v / p.r).toFixed(2)),

    cevapFormatla: (F) => `${F} N`,

    yanlisCevapStratejisi: 'karekok-hata',

    aciklamaSablonu: (p, dogruCevap) =>
      `**Çözüm:**\n\n` +
      `Merkezcil kuvvet: **F_c = m·v²/r**\n\n` +
      `F_c = ${p.m} × ${p.v}² / ${p.r}\n\n` +
      `F_c = ${p.m} × ${p.v * p.v} / ${p.r}\n\n` +
      `**F_c = ${dogruCevap} N**`,
  },

  // ─────────────────────────────────────────────────────────────
  // TYT-10. Ses Hızı + Yankı Süresi
  //   d = v·t/2  (yankı: ses gidip gelir)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'yks-tyt-10',
    sinif: 9,
    konuId: 'dalgalar',
    altKonuId: 'ses',
    zorluk: 2,
    tytMi: true,
    ilgiliFormul: 'd = v·t / 2',
    kazanim: 'Ses hızı ve yankı süresinden engele olan uzaklığı hesaplar.',
    sure: 80,
    ipucuSablonu: 'Yankıda ses gidip geri gelir: d = v × t / 2.',

    parametreler: {
      v: { degerler: [340], birim: 'm/s' },
      t: { min: 1, max: 6, adim: 1, birim: 's', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Ses hızının 340 m/s olduğu bir ortamda bir duvardan ${p.t} s sonra yankı duyuluyor. ` +
      `Duvar kaç metre uzaktadır?`,

    hesapla: (p) => p.v * p.t / 2,

    cevapFormatla: (d) => `${d} m`,

    yanlisCevapStratejisi: 'sabit-carpan',

    aciklamaSablonu: (p, dogruCevap) =>
      `**Çözüm:**\n\n` +
      `Yankıda ses gidip gelir, yani 2d mesafe kat eder:\n\n` +
      `2d = v × t → **d = v × t / 2**\n\n` +
      `d = 340 × ${p.t} / 2 = ${340 * p.t} / 2\n\n` +
      `**d = ${dogruCevap} m**`,
  },

  // ════════════════════════════════════════════════════════════
  //  AYT BÖLÜMÜ  (11–30)
  // ════════════════════════════════════════════════════════════

  // ─────────────────────────────────────────────────────────────
  // AYT-11. Faraday Yasası + Tel Üzerindeki Kuvvet
  //   EMK = N·ΔΦ/Δt;  F = B·I·L
  // ─────────────────────────────────────────────────────────────
  {
    id: 'yks-ayt-11',
    sinif: 11,
    konuId: 'elektromanyetizma',
    altKonuId: 'faraday-yasasi',
    zorluk: 4,
    aytMi: true,
    ilgiliFormul: 'EMK = N·ΔΦ/Δt; F = BIL',
    kazanim: 'Faraday yasasıyla oluşan EMK\'yı ve akım taşıyan tele etki eden kuvveti hesaplar.',
    sure: 150,
    ipucuSablonu: 'EMK = N·ΔΦ/Δt. Oluşan akım: I = EMK/R. Kuvvet: F = BIL.',

    parametreler: {
      N:    { min: 100, max: 500, adim: 100, birim: 'sarım', tamsayi: true },
      dPhi: { min: 0.01, max: 0.05, adim: 0.01, birim: 'Wb' },
      dt:   { min: 1, max: 5, adim: 1, birim: 's', tamsayi: true },
      R:    { min: 5, max: 20, adim: 5, birim: 'Ω', tamsayi: true },
      B:    { min: 1, max: 5, adim: 1, birim: 'T', tamsayi: true },
      L:    { min: 0.1, max: 0.5, adim: 0.1, birim: 'm' },
    },

    soruSablonu: (p) =>
      `${p.N} sarımlı bir bobinde manyetik akı ${p.dt} s içinde ${p.dPhi} Wb değişiyor. ` +
      `Bobinin direnci ${p.R} Ω, devrede ${p.B} T'lik manyetik alanda ${p.L} m uzunluğunda düz bir tel bulunuyor. ` +
      `Bu tele etki eden manyetik kuvvet kaç N'dur?`,

    hesapla: (p) => {
      const EMK = p.N * p.dPhi / p.dt;
      const I   = EMK / p.R;
      return parseFloat((p.B * I * p.L).toFixed(4));
    },

    cevapFormatla: (F) => `${F} N`,

    yanlisCevapStratejisi: 'carpim-bolum-toplam',

    aciklamaSablonu: (p, dogruCevap) => {
      const EMK = p.N * p.dPhi / p.dt;
      const I   = EMK / p.R;
      const F   = p.B * I * p.L;
      return (
        `**Çözüm:**\n\n` +
        `**Adım 1 – EMK:**\n` +
        `EMK = N·ΔΦ/Δt = ${p.N} × ${p.dPhi} / ${p.dt} = ${EMK.toFixed(3)} V\n\n` +
        `**Adım 2 – Akım:**\n` +
        `I = EMK/R = ${EMK.toFixed(3)} / ${p.R} = ${I.toFixed(4)} A\n\n` +
        `**Adım 3 – Kuvvet:**\n` +
        `F = B·I·L = ${p.B} × ${I.toFixed(4)} × ${p.L} = **${dogruCevap} N**`
      );
    },
  },

  // ─────────────────────────────────────────────────────────────
  // AYT-12. Transformatör + Verimlilik
  //   V₂/V₁ = N₂/N₁;  η = P₂/P₁ = (V₂·I₂)/(V₁·I₁)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'yks-ayt-12',
    sinif: 11,
    konuId: 'elektromanyetizma',
    altKonuId: 'transformator',
    zorluk: 4,
    aytMi: true,
    ilgiliFormul: 'V₂/V₁ = N₂/N₁; η = P₂/P₁',
    kazanim: 'Transformatör dönüştürme oranını ve verimli olmayan sistemdeki kayıp gücü hesaplar.',
    sure: 140,
    ipucuSablonu: 'V₂ = V₁ × N₂/N₁. Verimde P₂ = η × P₁.',

    parametreler: {
      V1: { min: 220, max: 440, adim: 220, birim: 'V', tamsayi: true },
      N1: { min: 1000, max: 4000, adim: 1000, birim: 'sarım', tamsayi: true },
      N2: { min: 100, max: 500, adim: 100, birim: 'sarım', tamsayi: true },
      I1: { min: 2, max: 10, adim: 2, birim: 'A', tamsayi: true },
      eta: { min: 7, max: 9, adim: 1, birim: '' }, // η × 10
    },

    soruSablonu: (p) => {
      const etaReal = p.eta / 10;
      const V2 = p.V1 * p.N2 / p.N1;
      return (
        `Birincil sargısında ${p.N1} sarım ve ${p.V1} V gerilim, ${p.I1} A akım olan bir transformatörün ` +
        `ikincil sargısında ${p.N2} sarım bulunmaktadır. Transformatörün verimi %${p.eta * 10} ise ` +
        `ikincil devredeki güç kaç W'tır?`
      );
    },

    hesapla: (p) => {
      const etaReal = p.eta / 10;
      const P1 = p.V1 * p.I1;
      return parseFloat((etaReal * P1).toFixed(1));
    },

    cevapFormatla: (P) => `${P} W`,

    yanlisCevapStratejisi: 'carpan-hatasi',

    aciklamaSablonu: (p, dogruCevap) => {
      const etaReal = p.eta / 10;
      const V2 = p.V1 * p.N2 / p.N1;
      const P1 = p.V1 * p.I1;
      return (
        `**Çözüm:**\n\n` +
        `İkincil gerilim: V₂ = V₁ × N₂/N₁ = ${p.V1} × ${p.N2}/${p.N1} = ${V2.toFixed(1)} V\n\n` +
        `Birincil güç: P₁ = V₁·I₁ = ${p.V1} × ${p.I1} = ${P1} W\n\n` +
        `İkincil güç: **P₂ = η × P₁ = ${etaReal} × ${P1} = ${dogruCevap} W**`
      );
    },
  },

  // ─────────────────────────────────────────────────────────────
  // AYT-13. Fotoelektrik Etki + Durdurma Potansiyeli
  //   E_foton = hf = hc/λ; K_max = E_foton − W₀; K_max = e·V_dur
  // ─────────────────────────────────────────────────────────────
  {
    id: 'yks-ayt-13',
    sinif: 12,
    konuId: 'modern-fizik',
    altKonuId: 'fotoelektrik',
    zorluk: 5,
    aytMi: true,
    ilgiliFormul: 'K_max = hc/λ − W₀ = eV_dur',
    kazanim: 'Foton enerjisini hesaplar, iş fonksiyonundan durdurma potansiyelini bulur.',
    sure: 160,
    ipucuSablonu: 'h = 6,63×10⁻³⁴ J·s; c = 3×10⁸ m/s; e = 1,6×10⁻¹⁹ C.',

    parametreler: {
      // λ × 100 nm → gerçek: lambda_nm / 100  → m = lambda_nm * 1e-9
      lambda_nm: { degerler: [200, 250, 300, 400], birim: 'nm' },
      W0_eV:     { min: 2, max: 4, adim: 1, birim: 'eV', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Dalga boyu ${p.lambda_nm} nm olan ışık, iş fonksiyonu ${p.W0_eV} eV olan bir metal yüzeyine çarpıyor. ` +
      `Durdurma potansiyeli (durdurucu gerilim) kaç V'tur? ` +
      `(h = 6,63×10⁻³⁴ J·s, c = 3×10⁸ m/s, e = 1,6×10⁻¹⁹ C)`,

    hesapla: (p) => {
      const h = 6.63e-34;
      const c = 3e8;
      const e = 1.6e-19;
      const lambda = p.lambda_nm * 1e-9;
      const E_foton_J = (h * c) / lambda;
      const W0_J = p.W0_eV * e;
      const K_max = E_foton_J - W0_J;
      if (K_max <= 0) return 0;
      return parseFloat((K_max / e).toFixed(2)); // V_dur in volts
    },

    cevapFormatla: (V) => `${V} V`,

    yanlisCevapStratejisi: 'isaretli-hata',

    aciklamaSablonu: (p, dogruCevap) => {
      const h = 6.63e-34;
      const c = 3e8;
      const e = 1.6e-19;
      const lambda = p.lambda_nm * 1e-9;
      const E_foton_J = (h * c) / lambda;
      const E_foton_eV = E_foton_J / e;
      const K_max_eV = E_foton_eV - p.W0_eV;
      return (
        `**Çözüm:**\n\n` +
        `**Adım 1 – Foton enerjisi:**\n` +
        `E = hc/λ = (6,63×10⁻³⁴ × 3×10⁸) / (${p.lambda_nm}×10⁻⁹)\n` +
        `E ≈ ${E_foton_eV.toFixed(2)} eV\n\n` +
        `**Adım 2 – Maksimum kinetik enerji:**\n` +
        `K_max = E − W₀ = ${E_foton_eV.toFixed(2)} − ${p.W0_eV} = ${K_max_eV.toFixed(2)} eV\n\n` +
        `**Adım 3 – Durdurma potansiyeli:**\n` +
        `K_max = e·V_dur → V_dur = K_max/e = **${dogruCevap} V**`
      );
    },
  },

  // ─────────────────────────────────────────────────────────────
  // AYT-14. Bohr Modeli: Foton Enerjisi (n_büyük → n_küçük)
  //   E_n = −13,6 eV / n²;  ΔE = E_n2 − E_n1
  // ─────────────────────────────────────────────────────────────
  {
    id: 'yks-ayt-14',
    sinif: 12,
    konuId: 'modern-fizik',
    altKonuId: 'bohr-modeli',
    zorluk: 4,
    aytMi: true,
    ilgiliFormul: 'E_n = −13,6/n² eV; ΔE = |E_yüksek − E_düşük|',
    kazanim: 'Hidrojen atomunun enerji düzeyleri arasındaki geçişlerde yayılan foton enerjisini hesaplar.',
    sure: 140,
    ipucuSablonu: 'E_n = −13,6/n² eV. Foton enerjisi: ΔE = |E_n2 − E_n1|.',

    parametreler: {
      n1: { degerler: [1, 2, 3], birim: '' },  // alt düzey
      n2: { min: 2, max: 6, adim: 1, birim: '', tamsayi: true }, // üst düzey (n2 > n1 garanti etmek için kurgusal)
    },

    soruSablonu: (p) => {
      // Ensure n2 > n1
      const n_alt = p.n1;
      const n_ust = p.n2 + p.n1; // always > n1
      return (
        `Hidrojen atomunun n = ${n_ust} düzeyinden n = ${n_alt} düzeyine geçişinde yayılan fotonun enerjisi kaç eV'dur? ` +
        `(E_n = −13,6/n² eV)`
      );
    },

    hesapla: (p) => {
      const n_alt = p.n1;
      const n_ust = p.n2 + p.n1;
      const E_ust = -13.6 / (n_ust * n_ust);
      const E_alt = -13.6 / (n_alt * n_alt);
      return parseFloat(Math.abs(E_ust - E_alt).toFixed(3));
    },

    cevapFormatla: (E) => `${E} eV`,

    yanlisCevapStratejisi: 'isaretli-hata',

    aciklamaSablonu: (p, dogruCevap) => {
      const n_alt = p.n1;
      const n_ust = p.n2 + p.n1;
      const E_ust = -13.6 / (n_ust * n_ust);
      const E_alt = -13.6 / (n_alt * n_alt);
      return (
        `**Çözüm:**\n\n` +
        `E_n${n_ust} = −13,6/${n_ust}² = ${E_ust.toFixed(3)} eV\n\n` +
        `E_n${n_alt} = −13,6/${n_alt}² = ${E_alt.toFixed(3)} eV\n\n` +
        `ΔE = |E_${n_ust} − E_${n_alt}| = |${E_ust.toFixed(3)} − ${E_alt.toFixed(3)}|\n\n` +
        `**ΔE = ${dogruCevap} eV**`
      );
    },
  },

  // ─────────────────────────────────────────────────────────────
  // AYT-15. Radyoaktif Bozunma + Yarı Ömür
  //   N(t) = N₀ × (1/2)^(t/T½)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'yks-ayt-15',
    sinif: 12,
    konuId: 'modern-fizik',
    altKonuId: 'radyoaktivite',
    zorluk: 4,
    aytMi: true,
    ilgiliFormul: 'N(t) = N₀ × (½)^(t/T½)',
    kazanim: 'Yarı ömrü kullanarak kalan radyoaktif madde miktarını hesaplar.',
    sure: 130,
    ipucuSablonu: 'Her yarı ömürde madde miktarı yarıya iner.',

    parametreler: {
      N0:    { min: 128, max: 1024, adim: 128, birim: 'g', tamsayi: true },
      T_yari: { min: 5, max: 20, adim: 5, birim: 'yıl', tamsayi: true },
      t_kati: { min: 2, max: 5, adim: 1, birim: '', tamsayi: true }, // kaç yarı ömür
    },

    soruSablonu: (p) => {
      const t = p.t_kati * p.T_yari;
      return (
        `Başlangıç kütlesi ${p.N0} g olan radyoaktif bir maddenin yarı ömrü ${p.T_yari} yıldır. ` +
        `${t} yıl sonra ne kadar madde kalmıştır?`
      );
    },

    hesapla: (p) => {
      return parseFloat((p.N0 * Math.pow(0.5, p.t_kati)).toFixed(4));
    },

    cevapFormatla: (N) => `${N} g`,

    yanlisCevapStratejisi: 'carpan-hatasi',

    aciklamaSablonu: (p, dogruCevap) => {
      const t = p.t_kati * p.T_yari;
      return (
        `**Çözüm:**\n\n` +
        `Geçen yarı ömür sayısı: n = ${t} / ${p.T_yari} = ${p.t_kati}\n\n` +
        `N(t) = N₀ × (½)ⁿ = ${p.N0} × (½)^${p.t_kati}\n\n` +
        `N(t) = ${p.N0} / 2^${p.t_kati} = ${p.N0} / ${Math.pow(2, p.t_kati)}\n\n` +
        `**N(t) = ${dogruCevap} g**`
      );
    },
  },

  // ─────────────────────────────────────────────────────────────
  // AYT-16. Mercek + Büyütme
  //   1/f = 1/d_o + 1/d_i;  M = −d_i/d_o
  // ─────────────────────────────────────────────────────────────
  {
    id: 'yks-ayt-16',
    sinif: 11,
    konuId: 'optik',
    altKonuId: 'mercekler',
    zorluk: 4,
    aytMi: true,
    ilgiliFormul: '1/f = 1/d_o + 1/d_i; M = d_i/d_o',
    kazanim: 'Mercek denklemini çözer ve görüntünün büyüklüğünü hesaplar.',
    sure: 150,
    ipucuSablonu: '1/d_i = 1/f − 1/d_o. Büyütme: |M| = d_i/d_o.',

    parametreler: {
      f:  { min: 10, max: 30, adim: 5, birim: 'cm', tamsayi: true },
      d_o: { min: 20, max: 60, adim: 10, birim: 'cm', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Odak uzaklığı ${p.f} cm olan ince kenarlı (yakınsak) bir mercekten ${p.d_o} cm uzakta bulunan bir nesnenin görüntü mesafesi kaç cm'dir? ` +
      `(1/f = 1/d_o + 1/d_i)`,

    hesapla: (p) => {
      // 1/d_i = 1/f - 1/d_o
      const inv_di = 1 / p.f - 1 / p.d_o;
      if (inv_di === 0) return 1e6; // sonsuz
      return parseFloat((1 / inv_di).toFixed(2));
    },

    cevapFormatla: (d) => `${d} cm`,

    yanlisCevapStratejisi: 'ters-islem',

    aciklamaSablonu: (p, dogruCevap) => {
      const inv_di = 1 / p.f - 1 / p.d_o;
      return (
        `**Çözüm:**\n\n` +
        `1/d_i = 1/f − 1/d_o = 1/${p.f} − 1/${p.d_o}\n\n` +
        `1/d_i = ${(1/p.f).toFixed(4)} − ${(1/p.d_o).toFixed(4)} = ${inv_di.toFixed(4)} cm⁻¹\n\n` +
        `**d_i = ${dogruCevap} cm**\n\n` +
        `*(d_i > 0 → gerçek görüntü; d_i < 0 → sanal görüntü)*`
      );
    },
  },

  // ─────────────────────────────────────────────────────────────
  // AYT-17. Doppler + Vuruş Frekansı
  //   f' = f × (v ± v_gözlem) / (v ∓ v_kaynak)
  //   Vuruş: f_vuruş = |f₁' − f₂'|  (iki ses kaynağı)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'yks-ayt-17',
    sinif: 11,
    konuId: 'dalgalar',
    altKonuId: 'doppler-vurus',
    zorluk: 5,
    aytMi: true,
    ilgiliFormul: "f' = f(v+v_g)/(v−v_k); f_vuruş = |f₁'−f₂'|",
    kazanim: 'Kaynak ya da gözlemci hareketli iken Doppler frekansını ve vuruşu hesaplar.',
    sure: 160,
    ipucuSablonu: 'Gözlemci yaklaşıyorsa +, uzaklaşıyorsa −. Vuruş = |f1−f2|.',

    parametreler: {
      f:   { min: 400, max: 800, adim: 100, birim: 'Hz', tamsayi: true },
      v_s: { degerler: [340], birim: 'm/s' }, // ses hızı
      v_k: { min: 10, max: 40, adim: 10, birim: 'm/s', tamsayi: true }, // kaynak hızı
    },

    soruSablonu: (p) =>
      `${p.f} Hz frekanslı bir ambulans ${p.v_k} m/s hızla bir dinleyiciye doğru yaklaşıyor. ` +
      `Dinleyicinin duyduğu frekans kaç Hz'dir? (Ses hızı = 340 m/s, dinleyici hareketsiz)`,

    hesapla: (p) => {
      // gözlemci hareketsiz, kaynak yaklaşıyor → f' = f × v / (v − v_k)
      return parseFloat((p.f * p.v_s / (p.v_s - p.v_k)).toFixed(2));
    },

    cevapFormatla: (f) => `${f} Hz`,

    yanlisCevapStratejisi: 'isaretli-hata',

    aciklamaSablonu: (p, dogruCevap) =>
      `**Çözüm:**\n\n` +
      `Kaynak yaklaşıyor, gözlemci hareketsiz:\n\n` +
      `**f' = f × v / (v − v_k)**\n\n` +
      `f' = ${p.f} × 340 / (340 − ${p.v_k})\n\n` +
      `f' = ${p.f} × 340 / ${340 - p.v_k}\n\n` +
      `**f' = ${dogruCevap} Hz**`,
  },

  // ─────────────────────────────────────────────────────────────
  // AYT-18. BHO Sarkacı + Enerji
  //   T = 2π√(L/g);  E_top = mgh_max = ½mv_max²
  // ─────────────────────────────────────────────────────────────
  {
    id: 'yks-ayt-18',
    sinif: 11,
    konuId: 'titresimler-dalgalar',
    altKonuId: 'bho-sarkac',
    zorluk: 4,
    aytMi: true,
    ilgiliFormul: 'T = 2π√(L/g); v_max = √(2gh)',
    kazanim: 'Sarkaç periyodunu ve maksimum hızını hesaplar.',
    sure: 150,
    ipucuSablonu: 'T = 2π√(L/g). v_max denge noktasında; E korunumu: ½mv² = mgh.',

    parametreler: {
      L:    { min: 1, max: 4, adim: 1, birim: 'm', tamsayi: true },
      h:    { min: 0.05, max: 0.2, adim: 0.05, birim: 'm' },
      // g = 10 m/s², π² ≈ 10 için T = 2√(L/g) = 2√(L/10)
    },

    soruSablonu: (p) =>
      `Boyu ${p.L} m olan bir sarkacın denge noktasından ${p.h} m yüksekten serbest bırakıldığında denge noktasındaki maksimum hızı kaç m/s'dir? (g = 10 m/s²)`,

    hesapla: (p) => parseFloat(Math.sqrt(2 * 10 * p.h).toFixed(3)),

    cevapFormatla: (v) => `${v} m/s`,

    yanlisCevapStratejisi: 'karekok-hata',

    aciklamaSablonu: (p, dogruCevap) =>
      `**Çözüm:**\n\n` +
      `Enerji korunumu: mgh = ½mv²_max\n\n` +
      `v_max = √(2gh) = √(2 × 10 × ${p.h})\n\n` +
      `v_max = √${2 * 10 * p.h}\n\n` +
      `**v_max = ${dogruCevap} m/s**\n\n` +
      `*(Sarkaç boyu L = ${p.L} m periyodu etkiler ama maksimum hızı değiştirmez.)*`,
  },

  // ─────────────────────────────────────────────────────────────
  // AYT-19. Elektrik Alan + Potansiyel (İki Yük Arası Orta Nokta)
  //   V_top = kQ₁/r₁ + kQ₂/r₂ (skaler toplam)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'yks-ayt-19',
    sinif: 12,
    konuId: 'elektrostatik',
    altKonuId: 'potansiyel',
    zorluk: 4,
    aytMi: true,
    ilgiliFormul: 'V = kQ/r; V_top = ΣkQᵢ/rᵢ',
    kazanim: 'İki nokta yük arasındaki orta noktadaki toplam elektrik potansiyelini hesaplar.',
    sure: 140,
    ipucuSablonu: 'Potansiyel skaler büyüklüktür: V_top = V₁ + V₂. k = 9×10⁹ N·m²/C².',

    parametreler: {
      Q1: { min: 2, max: 8, adim: 2, birim: 'μC', tamsayi: true },
      Q2: { min: 2, max: 8, adim: 2, birim: 'μC', tamsayi: true },
      d:  { min: 2, max: 6, adim: 2, birim: 'm', tamsayi: true },   // iki yük arası mesafe
    },

    soruSablonu: (p) =>
      `+${p.Q1} μC ve +${p.Q2} μC yüklü iki nokta yük ${p.d} m arayla konuluyor. ` +
      `Bu iki yükün tam ortasındaki toplam elektrik potansiyeli kaç V'tur? ` +
      `(k = 9×10⁹ N·m²/C²)`,

    hesapla: (p) => {
      const k = 9e9;
      const r = p.d / 2;
      const Q1 = p.Q1 * 1e-6;
      const Q2 = p.Q2 * 1e-6;
      return parseFloat(((k * Q1 / r) + (k * Q2 / r)).toFixed(0));
    },

    cevapFormatla: (V) => `${V} V`,

    yanlisCevapStratejisi: 'carpim-bolum-toplam',

    aciklamaSablonu: (p, dogruCevap) => {
      const k = 9e9;
      const r = p.d / 2;
      const Q1 = p.Q1 * 1e-6;
      const Q2 = p.Q2 * 1e-6;
      const V1 = k * Q1 / r;
      const V2 = k * Q2 / r;
      return (
        `**Çözüm:**\n\n` +
        `Orta nokta her yükten r = ${p.d}/2 = ${r} m uzaktadır.\n\n` +
        `V₁ = kQ₁/r = 9×10⁹ × ${p.Q1}×10⁻⁶ / ${r} = ${V1.toFixed(0)} V\n\n` +
        `V₂ = kQ₂/r = 9×10⁹ × ${p.Q2}×10⁻⁶ / ${r} = ${V2.toFixed(0)} V\n\n` +
        `**V_top = V₁ + V₂ = ${dogruCevap} V**\n\n` +
        `*(Potansiyel skaler olduğundan vektör toplamı gerekmez.)*`
      );
    },
  },

  // ─────────────────────────────────────────────────────────────
  // AYT-20. Kondansatör: Şarj + Bağlantı Sonrası Enerji
  //   Q = C·V;  E = Q²/(2C) = ½CV²
  //   Paralel bağlanınca: Q_top = Q₁+Q₂, C_top = C₁+C₂, V_ort = Q_top/C_top
  // ─────────────────────────────────────────────────────────────
  {
    id: 'yks-ayt-20',
    sinif: 12,
    konuId: 'elektrostatik',
    altKonuId: 'kondansator',
    zorluk: 5,
    aytMi: true,
    ilgiliFormul: 'Q = CV; E = ½CV²; V_ort = (Q₁+Q₂)/(C₁+C₂)',
    kazanim: 'Paralel bağlanan kondansatörlerin ortak gerilimini ve toplam enerjiyi hesaplar.',
    sure: 160,
    ipucuSablonu: 'Yük korunur: Q_top = Q₁+Q₂. V_ort = Q_top/(C₁+C₂). E = ½C_topV_ort².',

    parametreler: {
      C1: { min: 2, max: 6, adim: 2, birim: 'μF', tamsayi: true },
      V1: { min: 6, max: 12, adim: 2, birim: 'V', tamsayi: true },
      C2: { min: 2, max: 6, adim: 2, birim: 'μF', tamsayi: true },
      V2: { degerler: [0], birim: 'V' }, // ikinci kondansatör şarjsız
    },

    soruSablonu: (p) =>
      `${p.C1} μF kapasiteli kondansatör ${p.V1} V'a şarj edilmiş, ${p.C2} μF kapasiteli kondansatör şarjsızdır. ` +
      `Bu iki kondansatör paralel bağlandığında ortak gerilim kaç V olur?`,

    hesapla: (p) => {
      const Q1 = p.C1 * p.V1; // μC
      const Q2 = p.C2 * p.V2;
      const Q_top = Q1 + Q2;
      const C_top = p.C1 + p.C2;
      return parseFloat((Q_top / C_top).toFixed(3));
    },

    cevapFormatla: (V) => `${V} V`,

    yanlisCevapStratejisi: 'carpim-bolum-toplam',

    aciklamaSablonu: (p, dogruCevap) => {
      const Q1 = p.C1 * p.V1;
      const C_top = p.C1 + p.C2;
      return (
        `**Çözüm:**\n\n` +
        `**Adım 1 – Toplam yük:**\n` +
        `Q_top = C₁V₁ + C₂V₂ = ${p.C1}×${p.V1} + ${p.C2}×0 = ${Q1} μC\n\n` +
        `**Adım 2 – Toplam kapasite:**\n` +
        `C_top = C₁ + C₂ = ${p.C1} + ${p.C2} = ${C_top} μF\n\n` +
        `**Adım 3 – Ortak gerilim:**\n` +
        `V_ort = Q_top/C_top = ${Q1}/${C_top} = **${dogruCevap} V**`
      );
    },
  },

  // ─────────────────────────────────────────────────────────────
  // AYT-21. Coulomb Kuvveti + Denge
  //   F = kQ₁Q₂/r²; Üç yük doğrusal denge koşulu
  // ─────────────────────────────────────────────────────────────
  {
    id: 'yks-ayt-21',
    sinif: 12,
    konuId: 'elektrostatik',
    altKonuId: 'coulomb',
    zorluk: 5,
    aytMi: true,
    ilgiliFormul: 'F = kQ₁Q₂/r²',
    kazanim: 'İki yükten eşit uzaklıkta olan üçüncü yüke etki eden net Coulomb kuvvetini hesaplar.',
    sure: 150,
    ipucuSablonu: 'F = kQ₁Q₂/r². İki yük aynı işaretliyse itme, zıt işaretliyse çekme.',

    parametreler: {
      Q1: { min: 1, max: 5, adim: 1, birim: 'μC', tamsayi: true },
      Q2: { min: 1, max: 5, adim: 1, birim: 'μC', tamsayi: true },
      Q3: { min: 1, max: 3, adim: 1, birim: 'μC', tamsayi: true },
      r:  { min: 1, max: 3, adim: 1, birim: 'm', tamsayi: true },
    },

    soruSablonu: (p) =>
      `+${p.Q1} μC ve +${p.Q2} μC yükleri ${2 * p.r} m arayla konuluyor. ` +
      `+${p.Q3} μC yüklü bir cisim tam ortaya yerleştiriliyor. ` +
      `Bu cisme etki eden net Coulomb kuvveti kaç N'dur? (k = 9×10⁹ N·m²/C²)`,

    hesapla: (p) => {
      // Q3 tam ortada, Q1 ve Q2 eşit mesafede r'de, aynı işaretli
      // F₁₃ → sağa (Q2'ye doğru), F₂₃ → sola (Q1'e doğru)
      // Net kuvvet = |F₁₃ − F₂₃|
      const k = 9e9;
      const F1 = k * (p.Q1 * 1e-6) * (p.Q3 * 1e-6) / (p.r * p.r);
      const F2 = k * (p.Q2 * 1e-6) * (p.Q3 * 1e-6) / (p.r * p.r);
      return parseFloat(Math.abs(F1 - F2).toFixed(4));
    },

    cevapFormatla: (F) => `${F} N`,

    yanlisCevapStratejisi: 'carpim-bolum-toplam',

    aciklamaSablonu: (p, dogruCevap) => {
      const k = 9e9;
      const F1 = k * (p.Q1 * 1e-6) * (p.Q3 * 1e-6) / (p.r ** 2);
      const F2 = k * (p.Q2 * 1e-6) * (p.Q3 * 1e-6) / (p.r ** 2);
      return (
        `**Çözüm:**\n\n` +
        `Her yük ortaya r = ${p.r} m uzakta.\n\n` +
        `F₁ = kQ₁Q₃/r² = 9×10⁹ × ${p.Q1}×10⁻⁶ × ${p.Q3}×10⁻⁶ / ${p.r}² = ${F1.toFixed(4)} N\n\n` +
        `F₂ = kQ₂Q₃/r² = ${F2.toFixed(4)} N\n\n` +
        `Q₁ ve Q₂ aynı işaretli → kuvvetler zıt yönlü:\n\n` +
        `**F_net = |F₁ − F₂| = ${dogruCevap} N**`
      );
    },
  },

  // ─────────────────────────────────────────────────────────────
  // AYT-22. Manyetik Kuvvet (Akım Taşıyan Tel Döngü)
  //   F = B·I·L (döngünün bir kenarı için)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'yks-ayt-22',
    sinif: 11,
    konuId: 'elektromanyetizma',
    altKonuId: 'manyetik-kuvvet',
    zorluk: 4,
    aytMi: true,
    ilgiliFormul: 'F = B·I·L',
    kazanim: 'Düzgün manyetik alanda akım taşıyan tele etki eden kuvveti hesaplar.',
    sure: 130,
    ipucuSablonu: 'F = BIL. Tel alana dik ise sinθ = 1.',

    parametreler: {
      B: { min: 1, max: 5, adim: 1, birim: 'T', tamsayi: true },
      I: { min: 2, max: 10, adim: 2, birim: 'A', tamsayi: true },
      L: { min: 0.1, max: 0.5, adim: 0.1, birim: 'm' },
    },

    soruSablonu: (p) =>
      `${p.B} T'lik düzgün manyetik alanda ${p.I} A akım taşıyan ${p.L} m uzunluğundaki tel alana dik konumlanmıştır. ` +
      `Tele etki eden manyetik kuvvet kaç N'dur?`,

    hesapla: (p) => parseFloat((p.B * p.I * p.L).toFixed(3)),

    cevapFormatla: (F) => `${F} N`,

    yanlisCevapStratejisi: 'carpim-bolum-toplam',

    aciklamaSablonu: (p, dogruCevap) =>
      `**Çözüm:**\n\n` +
      `Tel alana dik → θ = 90°, sinθ = 1:\n\n` +
      `**F = B·I·L = ${p.B} × ${p.I} × ${p.L}**\n\n` +
      `**F = ${dogruCevap} N**`,
  },

  // ─────────────────────────────────────────────────────────────
  // AYT-23. Özel Görelilik: Zaman Genişlemesi
  //   Δt = Δt₀ / √(1 − v²/c²) = γ·Δt₀
  // ─────────────────────────────────────────────────────────────
  {
    id: 'yks-ayt-23',
    sinif: 12,
    konuId: 'modern-fizik',
    altKonuId: 'ozel-gorelilik',
    zorluk: 5,
    aytMi: true,
    ilgiliFormul: 'Δt = γ·Δt₀; γ = 1/√(1−β²)',
    kazanim: 'Özel görelilikte zaman genişlemesini hesaplar.',
    sure: 160,
    ipucuSablonu: 'β = v/c. γ = 1/√(1−β²). Δt = γ·Δt₀.',

    parametreler: {
      // β değerleri seçilmiş: γ tam sayı veya basit kesir çıkacak şekilde
      // β = 0.6 → γ = 1/√0.64 = 1/0.8 = 1.25
      // β = 0.8 → γ = 1/√0.36 = 1/0.6 = 5/3 ≈ 1.667
      // β = 0.866 → γ ≈ 2
      beta10: { degerler: [6, 8], birim: '' }, // β × 10
      dt0:    { min: 1, max: 10, adim: 1, birim: 'μs', tamsayi: true },
    },

    soruSablonu: (p) => {
      const beta = p.beta10 / 10;
      return (
        `Işık hızının ${beta * 100}%'i hızla hareket eden bir uzay gemisindeki saat ${p.dt0} μs ölçüyor. ` +
        `Dünya'daki gözlemciye göre geçen süre kaç μs'dir?`
      );
    },

    hesapla: (p) => {
      const beta = p.beta10 / 10;
      const gamma = 1 / Math.sqrt(1 - beta * beta);
      return parseFloat((gamma * p.dt0).toFixed(3));
    },

    cevapFormatla: (t) => `${t} μs`,

    yanlisCevapStratejisi: 'karekok-hata',

    aciklamaSablonu: (p, dogruCevap) => {
      const beta = p.beta10 / 10;
      const gamma = 1 / Math.sqrt(1 - beta * beta);
      return (
        `**Çözüm:**\n\n` +
        `β = v/c = ${beta}\n\n` +
        `γ = 1/√(1−β²) = 1/√(1−${beta}²) = 1/√${(1 - beta * beta).toFixed(4)} = ${gamma.toFixed(4)}\n\n` +
        `**Δt = γ·Δt₀ = ${gamma.toFixed(4)} × ${p.dt0} μs = ${dogruCevap} μs**\n\n` +
        `*(Zaman genişlemesi: Hareket eden sistemdeki süre daha kısa görünür.)*`
      );
    },
  },

  // ─────────────────────────────────────────────────────────────
  // AYT-24. Nükleer Bağlanma Enerjisi
  //   ΔE = Δm·c²; 1 u = 931,5 MeV/c²
  // ─────────────────────────────────────────────────────────────
  {
    id: 'yks-ayt-24',
    sinif: 12,
    konuId: 'modern-fizik',
    altKonuId: 'nukleer-fizik',
    zorluk: 5,
    aytMi: true,
    ilgiliFormul: 'E_bağ = Δm × 931,5 MeV/u',
    kazanim: 'Kütle farkından çekirdek bağlanma enerjisini hesaplar.',
    sure: 160,
    ipucuSablonu: '1 u = 931,5 MeV. Δm = (Z·m_p + N·m_n) − m_çekirdek.',

    parametreler: {
      // Δm değerleri × 1000 (gerçek Δm = dm_milli / 1000 u)
      dm_milli: { min: 1, max: 50, adim: 5, birim: 'mu', tamsayi: true },
    },

    soruSablonu: (p) => {
      const dm = p.dm_milli / 1000;
      return (
        `Bir çekirdeğin kütle defekti ${dm.toFixed(3)} u'dur. ` +
        `Bu çekirdeğin bağlanma enerjisi kaç MeV'dir? (1 u = 931,5 MeV/c²)`
      );
    },

    hesapla: (p) => {
      const dm = p.dm_milli / 1000;
      return parseFloat((dm * 931.5).toFixed(3));
    },

    cevapFormatla: (E) => `${E} MeV`,

    yanlisCevapStratejisi: 'onlu-hata',

    aciklamaSablonu: (p, dogruCevap) => {
      const dm = p.dm_milli / 1000;
      return (
        `**Çözüm:**\n\n` +
        `E_bağ = Δm × 931,5 MeV/u\n\n` +
        `E_bağ = ${dm.toFixed(3)} u × 931,5 MeV/u\n\n` +
        `**E_bağ = ${dogruCevap} MeV**`
      );
    },
  },

  // ─────────────────────────────────────────────────────────────
  // AYT-25. de Broglie Dalgaboyu + Elektron Kırınımı
  //   λ = h / (m·v) = h / p
  // ─────────────────────────────────────────────────────────────
  {
    id: 'yks-ayt-25',
    sinif: 12,
    konuId: 'modern-fizik',
    altKonuId: 'dalga-parcacik-ikiligi',
    zorluk: 5,
    aytMi: true,
    ilgiliFormul: 'λ = h/(mv)',
    kazanim: 'Hareketli parçacığın de Broglie dalgaboyunu hesaplar.',
    sure: 140,
    ipucuSablonu: 'λ = h/(mv). h = 6,63×10⁻³⁴ J·s. m_e = 9,1×10⁻³¹ kg.',

    parametreler: {
      v_e6: { min: 1, max: 5, adim: 1, birim: '×10⁶ m/s', tamsayi: true }, // v = v_e6 × 10⁶
    },

    soruSablonu: (p) =>
      `${p.v_e6}×10⁶ m/s hızla hareket eden bir elektronun de Broglie dalgaboyu kaç metredir? ` +
      `(h = 6,63×10⁻³⁴ J·s, m_e = 9,1×10⁻³¹ kg)`,

    hesapla: (p) => {
      const h = 6.63e-34;
      const m_e = 9.1e-31;
      const v = p.v_e6 * 1e6;
      return parseFloat((h / (m_e * v)).toExponential(3) as unknown as string);
    },

    cevapFormatla: (lam) => `${lam} m`,

    yanlisCevapStratejisi: 'onlu-hata',

    aciklamaSablonu: (p, dogruCevap) => {
      const h = 6.63e-34;
      const m_e = 9.1e-31;
      const v = p.v_e6 * 1e6;
      const lam = h / (m_e * v);
      return (
        `**Çözüm:**\n\n` +
        `λ = h/(m_e·v)\n\n` +
        `λ = 6,63×10⁻³⁴ / (9,1×10⁻³¹ × ${p.v_e6}×10⁶)\n\n` +
        `λ = 6,63×10⁻³⁴ / ${(m_e * v).toExponential(3)}\n\n` +
        `**λ ≈ ${lam.toExponential(3)} m**`
      );
    },
  },

  // ─────────────────────────────────────────────────────────────
  // AYT-26. Eğim + Enerji + Sürtünme (Kombine)
  //   Uç hız: v = √(2gh − 2μgh/tanθ)  [h/sinθ × cosθ = h/tanθ]
  // ─────────────────────────────────────────────────────────────
  {
    id: 'yks-ayt-26',
    sinif: 10,
    konuId: 'enerji-is-guc',
    altKonuId: 'enerji-korunumu',
    zorluk: 4,
    aytMi: true,
    ilgiliFormul: 'v = √[2g(h − μh/tanθ)]',
    kazanim: 'Eğimli düzlemde enerji korunumu ve sürtünme işini birleştirerek son hızı hesaplar.',
    sure: 150,
    ipucuSablonu: 'Enerji korunumu: mgh − W_sürtünme = ½mv². W_sürt = μmgcosθ·(h/sinθ) = μmgh/tanθ.',

    parametreler: {
      h:    { min: 5, max: 20, adim: 5, birim: 'm', tamsayi: true },
      mu10: { min: 1, max: 3, adim: 1, birim: '' }, // μ × 10
      // θ = 37°: tanθ = 0.75, sinθ = 0.6, cosθ = 0.8
    },

    soruSablonu: (p) => {
      const muReal = p.mu10 / 10;
      return (
        `${p.h} m yüksekliğindeki 37°'lik bir eğimden μ = ${muReal} sürtünme katsayısıyla inen cisim tabana kaç m/s hızla ulaşır? ` +
        `(g = 10 m/s², sin37°=0,6, cos37°=0,8, tan37°=0,75)`
      );
    },

    hesapla: (p) => {
      const muReal = p.mu10 / 10;
      // v = √(2g(h − μh/tanθ)) where tanθ = 0.75 (37°)
      const tanT = 0.75;
      const inner = 2 * 10 * (p.h - muReal * p.h / tanT);
      if (inner <= 0) return 0;
      return parseFloat(Math.sqrt(inner).toFixed(2));
    },

    cevapFormatla: (v) => `${v} m/s`,

    yanlisCevapStratejisi: 'karekok-hata',

    aciklamaSablonu: (p, dogruCevap) => {
      const muReal = p.mu10 / 10;
      const tanT = 0.75;
      const d = p.h / 0.6; // d = h/sinθ
      const Wg = 10 * p.h; // g*h per kg
      const Wf = muReal * 10 * 0.8 * d; // μgcosθ·d per kg
      return (
        `**Çözüm:**\n\n` +
        `Eğim boyu: d = h/sinθ = ${p.h}/0,6 = ${d.toFixed(2)} m\n\n` +
        `Birim kütlede:\n` +
        `  Yerçekimi işi = g·h = 10 × ${p.h} = ${Wg} J/kg\n` +
        `  Sürtünme işi = μ·g·cosθ·d = ${muReal}×10×0,8×${d.toFixed(2)} = ${Wf.toFixed(2)} J/kg\n\n` +
        `½v² = ${Wg} − ${Wf.toFixed(2)} = ${(Wg - Wf).toFixed(2)}\n\n` +
        `v = √(2 × ${(Wg - Wf).toFixed(2)}) = **${dogruCevap} m/s**`
      );
    },
  },

  // ─────────────────────────────────────────────────────────────
  // AYT-27. İki Cisim Çarpışması + Enerji Kaybı %
  //   Kısmen esnek: v₁' = (m₁−m₂)v₁/(m₁+m₂), v₂' = 2m₁v₁/(m₁+m₂)
  //   %ΔKE = (KE_önce − KE_sonra) / KE_önce × 100
  // ─────────────────────────────────────────────────────────────
  {
    id: 'yks-ayt-27',
    sinif: 10,
    konuId: 'momentum',
    altKonuId: 'carpismalar',
    zorluk: 5,
    aytMi: true,
    ilgiliFormul: 'v₂\' = 2m₁v₁/(m₁+m₂); %ΔKE',
    kazanim: 'Tamamen elastik olmayan çarpışmada enerji kaybı yüzdesini hesaplar.',
    sure: 170,
    ipucuSablonu: 'Tamamen yapışan çarpışma: v_son=(m₁v₁)/(m₁+m₂). %ΔKE = m₂/(m₁+m₂)×100.',

    parametreler: {
      m1: { min: 1, max: 5, adim: 1, birim: 'kg', tamsayi: true },
      m2: { min: 1, max: 5, adim: 1, birim: 'kg', tamsayi: true },
      v1: { min: 4, max: 12, adim: 2, birim: 'm/s', tamsayi: true },
    },

    soruSablonu: (p) =>
      `${p.m1} kg kütleli cisim ${p.v1} m/s hızla hareketsiz ${p.m2} kg kütleli cisme çarpıp yapışıyor. ` +
      `Çarpışmada kinetik enerjinin yüzde kaçı kaybolur?`,

    hesapla: (p) => {
      // %ΔKE = m₂/(m₁+m₂) × 100  (tamamen plastik çarpışma)
      const oran = p.m2 / (p.m1 + p.m2);
      return parseFloat((oran * 100).toFixed(2));
    },

    cevapFormatla: (pct) => `%${pct}`,

    yanlisCevapStratejisi: 'carpim-bolum-toplam',

    aciklamaSablonu: (p, dogruCevap) => {
      const v_son = (p.m1 * p.v1) / (p.m1 + p.m2);
      const KE1 = 0.5 * p.m1 * p.v1 ** 2;
      const KE2 = 0.5 * (p.m1 + p.m2) * v_son ** 2;
      const deltaKE = KE1 - KE2;
      return (
        `**Çözüm:**\n\n` +
        `v_son = m₁v₁/(m₁+m₂) = ${p.m1}×${p.v1}/${p.m1+p.m2} = ${v_son.toFixed(3)} m/s\n\n` +
        `KE_önce = ½×${p.m1}×${p.v1}² = ${KE1.toFixed(2)} J\n\n` +
        `KE_sonra = ½×${p.m1+p.m2}×${v_son.toFixed(3)}² = ${KE2.toFixed(2)} J\n\n` +
        `ΔKE = ${deltaKE.toFixed(2)} J\n\n` +
        `**%ΔKE = ${deltaKE.toFixed(2)}/${KE1.toFixed(2)} × 100 = ${dogruCevap}%**\n\n` +
        `*(Kısa yol: %ΔKE = m₂/(m₁+m₂) × 100 = ${p.m2}/${p.m1+p.m2} × 100 = ${dogruCevap}%)*`
      );
    },
  },

  // ─────────────────────────────────────────────────────────────
  // AYT-28. Rezonans Borusu (Açık/Kapalı) + Frekans Oranı
  //   Kapalı uçlu: f_n = nv/4L (n=1,3,5...)
  //   Açık uçlu:   f_n = nv/2L (n=1,2,3...)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'yks-ayt-28',
    sinif: 11,
    konuId: 'dalgalar',
    altKonuId: 'boru-rezonans',
    zorluk: 4,
    aytMi: true,
    ilgiliFormul: 'f_n = nv/(4L) [kapalı]; f_n = nv/(2L) [açık]',
    kazanim: 'Borunun temel frekansını ve üst harmonik frekanslarını hesaplar.',
    sure: 150,
    ipucuSablonu: 'Kapalı boru: yalnızca tek harmonikler. L = nλ/4.',

    parametreler: {
      L:   { min: 0.5, max: 2.0, adim: 0.5, birim: 'm' },
      v_s: { degerler: [340], birim: 'm/s' },
      n:   { degerler: [1, 3, 5], birim: '' }, // Harmonik (kapalı uç)
    },

    soruSablonu: (p) =>
      `Uzunluğu ${p.L} m olan bir ucunda kapalı borunun ${p.n}. harmonik rezonans frekansı kaç Hz'dir? ` +
      `(Ses hızı = 340 m/s)`,

    hesapla: (p) => {
      // f_n = n × v / (4L)
      return parseFloat((p.n * p.v_s / (4 * p.L)).toFixed(2));
    },

    cevapFormatla: (f) => `${f} Hz`,

    yanlisCevapStratejisi: 'sabit-carpan',

    aciklamaSablonu: (p, dogruCevap) =>
      `**Çözüm:**\n\n` +
      `Bir ucu kapalı boru: **f_n = n·v/(4L)**\n\n` +
      `f_${p.n} = ${p.n} × 340 / (4 × ${p.L})\n\n` +
      `f_${p.n} = ${(p.n * 340).toFixed(0)} / ${(4 * p.L).toFixed(1)}\n\n` +
      `**f_${p.n} = ${dogruCevap} Hz**\n\n` +
      `*(Kapalı boru yalnızca tek harmoniklere (1,3,5...) izin verir.)*`,
  },

  // ─────────────────────────────────────────────────────────────
  // AYT-29. Kırılma + Kritik Açı
  //   n₁sinθ₁ = n₂sinθ₂ (Snell); sinθ_krit = n₂/n₁
  // ─────────────────────────────────────────────────────────────
  {
    id: 'yks-ayt-29',
    sinif: 11,
    konuId: 'optik',
    altKonuId: 'kirilma-kritik-aci',
    zorluk: 4,
    aytMi: true,
    ilgiliFormul: 'sinθ_krit = n₂/n₁',
    kazanim: 'Tam iç yansıma kritik açısını hesaplar.',
    sure: 140,
    ipucuSablonu: 'Kritik açıda θ₂ = 90°: sinθ_krit = n₂/n₁. n₂ = 1 (hava) → sinθ_krit = 1/n₁.',

    parametreler: {
      n1_10: { degerler: [12, 13, 15, 20], birim: '' }, // n₁ × 10; gerçek = n1_10/10
    },

    soruSablonu: (p) => {
      const n1 = p.n1_10 / 10;
      return (
        `Kırılma indisi ${n1} olan cam-hava arayüzeyindeki kritik açının sinüsü kaçtır?`
      );
    },

    hesapla: (p) => {
      const n1 = p.n1_10 / 10;
      return parseFloat((1 / n1).toFixed(4));
    },

    cevapFormatla: (s) => `sin θ_k = ${s}`,

    yanlisCevapStratejisi: 'ters-islem',

    aciklamaSablonu: (p, dogruCevap) => {
      const n1 = p.n1_10 / 10;
      return (
        `**Çözüm:**\n\n` +
        `Tam iç yansımada θ₂ = 90°, Snell yasası:\n\n` +
        `n₁ × sinθ_krit = n₂ × sin 90°\n\n` +
        `sinθ_krit = n₂/n₁ = 1/${n1}\n\n` +
        `**sinθ_krit = ${dogruCevap}**\n\n` +
        `*(θ_krit = arcsin(${dogruCevap}) ≈ ${(Math.asin(dogruCevap) * 180 / Math.PI).toFixed(1)}°)*`
      );
    },
  },

  // ─────────────────────────────────────────────────────────────
  // AYT-30. RC Devresi: Zaman Sabiti + Şarj
  //   τ = RC;  Q(t) = Q_max(1 − e^(−t/τ))
  //   t = τ'da Q = Q_max(1 − 1/e) ≈ 0,632·Q_max
  // ─────────────────────────────────────────────────────────────
  {
    id: 'yks-ayt-30',
    sinif: 12,
    konuId: 'elektrik',
    altKonuId: 'rc-devresi',
    zorluk: 5,
    aytMi: true,
    ilgiliFormul: 'τ = RC; Q(τ) ≈ 0,632·Q_max',
    kazanim: 'RC devresinin zaman sabitini ve bir τ sonraki yükü hesaplar.',
    sure: 150,
    ipucuSablonu: 'τ = RC. t = τ anında şarj: Q = Q_max(1 − e⁻¹) ≈ 0,632·Q_max. Q_max = C·V.',

    parametreler: {
      R: { min: 1000, max: 5000, adim: 1000, birim: 'Ω', tamsayi: true },
      C: { min: 100, max: 500, adim: 100, birim: 'μF', tamsayi: true },
      V: { min: 10, max: 50, adim: 10, birim: 'V', tamsayi: true },
    },

    soruSablonu: (p) => {
      const tau = p.R * p.C * 1e-6;
      return (
        `R = ${p.R} Ω ve C = ${p.C} μF olan bir RC devresine ${p.V} V gerilim uygulanıyor. ` +
        `Bir zaman sabiti (τ = ${tau.toFixed(3)} s) sonra kondansatördeki yük kaç μC'dir? ` +
        `(e⁻¹ ≈ 0,368)`
      );
    },

    hesapla: (p) => {
      // Q(τ) = C·V·(1 − e⁻¹) ≈ C·V·0.632
      const Q_max = p.C * p.V; // μC (C in μF, V in V)
      return parseFloat((Q_max * (1 - Math.exp(-1))).toFixed(2));
    },

    cevapFormatla: (Q) => `${Q} μC`,

    yanlisCevapStratejisi: 'carpan-hatasi',

    aciklamaSablonu: (p, dogruCevap) => {
      const tau = (p.R * p.C * 1e-6).toFixed(4);
      const Q_max = p.C * p.V;
      const Q_tau = Q_max * (1 - Math.exp(-1));
      return (
        `**Çözüm:**\n\n` +
        `**Adım 1 – Zaman sabiti:**\n` +
        `τ = R × C = ${p.R} Ω × ${p.C}×10⁻⁶ F = ${tau} s\n\n` +
        `**Adım 2 – Maksimum yük:**\n` +
        `Q_max = C × V = ${p.C} μF × ${p.V} V = ${Q_max} μC\n\n` +
        `**Adım 3 – t = τ anındaki yük:**\n` +
        `Q(τ) = Q_max(1 − e⁻¹) ≈ ${Q_max} × (1 − 0,368)\n` +
        `Q(τ) ≈ ${Q_max} × 0,632\n\n` +
        `**Q(τ) ≈ ${dogruCevap} μC**`
      );
    },
  },

];
