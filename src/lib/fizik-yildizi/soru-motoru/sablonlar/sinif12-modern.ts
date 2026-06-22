// ============================================================
// Fizik Yıldızı – 12. Sınıf Modern Fizik Soru Şablonları
// ============================================================

import { SoruSablonu } from '../tipler';

export const sinif12ModernSablonlar: SoruSablonu[] = [

  // ─────────────────────────────────────────────────────────
  // 1. Snell Yasası: Kırılma Açısı (n1·sinθ1 = n2·sinθ2)
  // ─────────────────────────────────────────────────────────
  {
    id: 'm12-snell',
    sinif: 12,
    konuId: 'modern-fizik-12',
    altKonuId: 'optik',
    zorluk: 2,
    aytMi: true,
    ilgiliFormul: 'n₁·sinθ₁ = n₂·sinθ₂',
    kazanim: 'Snell kırılma yasasını uygulayarak kırılma açısını hesaplar.',
    sure: 90,
    ipucuSablonu: 'n₁sinθ₁ = n₂sinθ₂. Kırılma açısı: sinθ₂ = (n₁/n₂)·sinθ₁.',

    parametreler: {
      n1:       { min: 1, max: 1, adim: 0, birim: '' },   // hava
      n2:       { degerler: [1.33, 1.5, 1.6] },           // su / cam / kristal
      sinTheta1:{ degerler: [0.5, 0.6, 0.75, 0.866] },   // sin 30°, 37°, ~49°, 60°
    },

    soruSablonu: (p) =>
      `Kırıcılık indisi n₂ = ${p.n2} olan bir ortama hava (n₁ = 1) tarafından gelen ışın, gelme açısının sinüsü sinθ₁ = ${p.sinTheta1} olacak şekilde düşüyor. Kırılma açısının sinüsü kaçtır?`,

    hesapla: (p) => Math.round((p.n1 * p.sinTheta1) / p.n2 * 1000) / 1000,

    cevapFormatla: (d) => `sinθ₂ = ${d}`,

    yanlisCevapStratejisi: 'ters-islem',

    aciklamaSablonu: (p, d) =>
      `n₁sinθ₁ = n₂sinθ₂\nsinθ₂ = (n₁/n₂)·sinθ₁ = (${p.n1}/${p.n2}) × ${p.sinTheta1} = ${d}`,
  },

  // ─────────────────────────────────────────────────────────
  // 2. Kritik Açı: sinθc = n2/n1
  // ─────────────────────────────────────────────────────────
  {
    id: 'm12-kritik-aci',
    sinif: 12,
    konuId: 'modern-fizik-12',
    altKonuId: 'optik',
    zorluk: 2,
    aytMi: true,
    ilgiliFormul: 'sinθ_c = n₂/n₁',
    kazanim: 'Toplam iç yansıma için kritik açıyı hesaplar.',
    sure: 75,
    ipucuSablonu: 'Kritik açı için sinθ_c = n_az/n_çok. Işık yoğun ortamdan seyrek ortama geçiyorsa geçerlidir.',

    parametreler: {
      n1: { degerler: [1.33, 1.5, 1.6, 2] },
      n2: { min: 1, max: 1, adim: 0, birim: '' },  // hava
    },

    soruSablonu: (p) =>
      `Kırıcılık indisi ${p.n1} olan bir ortamda ışık, hava (n = 1) ile temas yüzeyine çarpıyor. Toplam iç yansıma için kritik açının sinüsü kaçtır?`,

    hesapla: (p) => Math.round((p.n2 / p.n1) * 1000) / 1000,

    cevapFormatla: (d) => `sinθ_c = ${d}`,

    yanlisCevapStratejisi: 'ters-islem',

    aciklamaSablonu: (p, d) =>
      `sinθ_c = n₂/n₁ = ${p.n2}/${p.n1} = ${d}\nBu açıdan büyük geliş açılarında toplam iç yansıma gerçekleşir.`,
  },

  // ─────────────────────────────────────────────────────────
  // 3. İnce Mercek: Odak Uzaklığı (1/f = 1/do + 1/di)
  // ─────────────────────────────────────────────────────────
  {
    id: 'm12-mercek-f',
    sinif: 12,
    konuId: 'modern-fizik-12',
    altKonuId: 'optik',
    zorluk: 3,
    aytMi: true,
    ilgiliFormul: '1/f = 1/d_o + 1/d_i',
    kazanim: 'İnce mercek formülünü kullanarak odak uzaklığını hesaplar.',
    sure: 100,
    ipucuSablonu: '1/f = 1/do + 1/di. İnce mercek denkleminde işaretlere dikkat et.',

    parametreler: {
      do: { min: 20, max: 60, adim: 10, birim: 'cm', tamsayi: true },
      di: { min: 15, max: 30, adim: 5,  birim: 'cm', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Bir ince mercekte cisim uzaklığı d_o = ${p.do} cm ve görüntü uzaklığı d_i = ${p.di} cm ise mercek odak uzaklığı kaç cm\'dir?`,

    hesapla: (p) => {
      const invF = 1 / p.do + 1 / p.di;
      return Math.round((1 / invF) * 100) / 100;
    },

    cevapFormatla: (d) => `${d} cm`,

    yanlisCevapStratejisi: 'ters-islem',

    aciklamaSablonu: (p, d) =>
      `1/f = 1/d_o + 1/d_i = 1/${p.do} + 1/${p.di}\n1/f = (${p.di + p.do})/${p.do * p.di}\nf = ${d} cm`,
  },

  // ─────────────────────────────────────────────────────────
  // 4. İnce Mercek: Görüntü Uzaklığı
  // ─────────────────────────────────────────────────────────
  {
    id: 'm12-mercek-di',
    sinif: 12,
    konuId: 'modern-fizik-12',
    altKonuId: 'optik',
    zorluk: 3,
    aytMi: true,
    ilgiliFormul: '1/d_i = 1/f − 1/d_o',
    kazanim: 'İnce mercek formülünü kullanarak görüntü uzaklığını hesaplar.',
    sure: 100,
    ipucuSablonu: '1/d_i = 1/f − 1/d_o. Sonuç (+) ise gerçek görüntü, (−) ise sanal görüntü.',

    parametreler: {
      f:  { min: 10, max: 20, adim: 5,  birim: 'cm', tamsayi: true },
      do: { min: 30, max: 60, adim: 10, birim: 'cm', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Odak uzaklığı f = ${p.f} cm olan yakınsak bir merceğe d_o = ${p.do} cm uzaklıkta cisim konuluyor. Görüntü uzaklığı d_i kaç cm\'dir?`,

    hesapla: (p) => {
      const invDi = 1 / p.f - 1 / p.do;
      return Math.round((1 / invDi) * 100) / 100;
    },

    cevapFormatla: (d) => `${d} cm`,

    yanlisCevapStratejisi: 'ters-islem',

    aciklamaSablonu: (p, d) => {
      const invDi = Math.round((1 / p.f - 1 / p.do) * 1000) / 1000;
      return `1/d_i = 1/f − 1/d_o = 1/${p.f} − 1/${p.do} = ${invDi}\nd_i = ${d} cm`;
    },
  },

  // ─────────────────────────────────────────────────────────
  // 5. Büyütme: m = -di/do = hi/ho
  // ─────────────────────────────────────────────────────────
  {
    id: 'm12-buyutme',
    sinif: 12,
    konuId: 'modern-fizik-12',
    altKonuId: 'optik',
    zorluk: 2,
    aytMi: true,
    ilgiliFormul: 'm = −d_i / d_o',
    kazanim: 'Mercek veya aynada büyütmeyi hesaplar.',
    sure: 75,
    ipucuSablonu: '|m| = |d_i / d_o|. |m| > 1 büyüme, |m| < 1 küçülme demektir.',

    parametreler: {
      di: { min: 20, max: 60, adim: 10, birim: 'cm', tamsayi: true },
      do: { min: 10, max: 20, adim: 5,  birim: 'cm', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Görüntü uzaklığı d_i = ${p.di} cm ve cisim uzaklığı d_o = ${p.do} cm olan bir mercek sisteminin büyütmesinin mutlak değeri kaçtır?`,

    hesapla: (p) => Math.round((p.di / p.do) * 100) / 100,

    cevapFormatla: (d) => `|m| = ${d}`,

    yanlisCevapStratejisi: 'ters-islem',

    aciklamaSablonu: (p, d) =>
      `|m| = d_i / d_o = ${p.di} / ${p.do} = ${d}\nGörüntü cisme göre ${d} kat büyüktür.`,
  },

  // ─────────────────────────────────────────────────────────
  // 6. Fotoelektrik Etki: Eşik Frekansı (hf₀ = W)
  // ─────────────────────────────────────────────────────────
  {
    id: 'm12-esik-frekans',
    sinif: 12,
    konuId: 'modern-fizik-12',
    altKonuId: 'kuantum-fizigi',
    zorluk: 3,
    aytMi: true,
    ilgiliFormul: 'f₀ = W / h   (h = 6.63×10⁻³⁴ J·s)',
    kazanim: 'Fotoelektrik etkide eşik frekansını iş fonksiyonundan hesaplar.',
    sure: 100,
    ipucuSablonu: 'f₀ = W/h. W\'yi joule\'a çevir: 1 eV = 1.6×10⁻¹⁹ J. h = 6.63×10⁻³⁴ J·s.',

    parametreler: {
      W_eV: { min: 2, max: 5, adim: 1, birim: 'eV', tamsayi: true },
    },

    soruSablonu: (p) =>
      `İş fonksiyonu W = ${p.W_eV} eV olan bir metalin fotoelektrik eşik frekansı kaç Hz\'dir? (h = 6.63×10⁻³⁴ J·s, 1 eV = 1.6×10⁻¹⁹ J)`,

    hesapla: (p) => {
      const W_J = p.W_eV * 1.6e-19;
      const h = 6.63e-34;
      return Math.round((W_J / h) * 1e-13) / 1e-13;  // ×10¹⁴ basamağına yuvarlama
    },

    cevapFormatla: (d) => `${(d * 1e-14).toFixed(2)}×10¹⁴ Hz`,

    yanlisCevapStratejisi: 'birim-donusum',

    aciklamaSablonu: (p, d) => {
      const W_J = (p.W_eV * 1.6e-19).toExponential(2);
      return `W = ${p.W_eV} eV = ${W_J} J\nf₀ = W/h = ${W_J} / 6.63×10⁻³⁴ ≈ ${(d * 1e-14).toFixed(2)}×10¹⁴ Hz`;
    },
  },

  // ─────────────────────────────────────────────────────────
  // 7. Fotoelektrik Etki: Maksimum Kinetik Enerji
  // ─────────────────────────────────────────────────────────
  {
    id: 'm12-fotoelektrik-Ek',
    sinif: 12,
    konuId: 'modern-fizik-12',
    altKonuId: 'kuantum-fizigi',
    zorluk: 3,
    aytMi: true,
    ilgiliFormul: 'E_k = hf − W',
    kazanim: 'Fotoelektrik etkide fotoelektronun maksimum kinetik enerjisini hesaplar.',
    sure: 100,
    ipucuSablonu: 'E_k = hf − W. hf: foton enerjisi, W: iş fonksiyonu. Sonuç eV cinsinden.',

    parametreler: {
      f_14:  { min: 8,  max: 15, adim: 1, birim: '×10¹⁴ Hz', tamsayi: true },
      W_eV:  { min: 2,  max: 4,  adim: 1, birim: 'eV',        tamsayi: true },
    },

    soruSablonu: (p) =>
      `İş fonksiyonu W = ${p.W_eV} eV olan bir metale f = ${p.f_14}×10¹⁴ Hz frekanslı ışık gönderiliyor. Fotoelektronun maksimum kinetik enerjisi kaç eV\'dir? (h = 6.63×10⁻³⁴ J·s, 1 eV = 1.6×10⁻¹⁹ J)`,

    hesapla: (p) => {
      const h = 6.63e-34;
      const f = p.f_14 * 1e14;
      const E_foton_J = h * f;
      const E_foton_eV = E_foton_J / 1.6e-19;
      return Math.round((E_foton_eV - p.W_eV) * 100) / 100;
    },

    cevapFormatla: (d) => `${d} eV`,

    yanlisCevapStratejisi: 'isaretli-hata',

    aciklamaSablonu: (p, d) => {
      const h = 6.63e-34;
      const f = p.f_14 * 1e14;
      const E_eV = Math.round((h * f / 1.6e-19) * 100) / 100;
      return `hf = 6.63×10⁻³⁴ × ${p.f_14}×10¹⁴ ≈ ${E_eV} eV\nE_k = hf − W = ${E_eV} − ${p.W_eV} = ${d} eV`;
    },
  },

  // ─────────────────────────────────────────────────────────
  // 8. Foton Enerjisi: E = h·f
  // ─────────────────────────────────────────────────────────
  {
    id: 'm12-foton-enerji',
    sinif: 12,
    konuId: 'modern-fizik-12',
    altKonuId: 'kuantum-fizigi',
    zorluk: 2,
    aytMi: true,
    ilgiliFormul: 'E = h·f   (h = 6.63×10⁻³⁴ J·s)',
    kazanim: 'Fotonun enerjisini frekansından hesaplar.',
    sure: 75,
    ipucuSablonu: 'E = hf. h = 6.63×10⁻³⁴ J·s. Sonucu 10⁻¹⁹ mertebesinde bekle.',

    parametreler: {
      f_14: { min: 5, max: 12, adim: 1, birim: '×10¹⁴ Hz', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Frekansı f = ${p.f_14}×10¹⁴ Hz olan bir fotonun enerjisi kaç J\'dür? (h = 6.63×10⁻³⁴ J·s)`,

    hesapla: (p) => {
      const h = 6.63e-34;
      return Math.round(h * p.f_14 * 1e14 * 1e21) / 1e21;
    },

    cevapFormatla: (d) => `${d.toExponential(2)} J`,

    yanlisCevapStratejisi: 'onlu-hata',

    aciklamaSablonu: (p, d) =>
      `E = hf = 6.63×10⁻³⁴ × ${p.f_14}×10¹⁴ = ${d.toExponential(2)} J`,
  },

  // ─────────────────────────────────────────────────────────
  // 9. Foton Momentumu: p = h / λ
  // ─────────────────────────────────────────────────────────
  {
    id: 'm12-foton-momentum',
    sinif: 12,
    konuId: 'modern-fizik-12',
    altKonuId: 'kuantum-fizigi',
    zorluk: 3,
    aytMi: true,
    ilgiliFormul: 'p = h / λ',
    kazanim: 'Fotonun momentumunu dalga boyundan hesaplar.',
    sure: 90,
    ipucuSablonu: 'p = h/λ. λ\'yi metreye çevir (nm × 10⁻⁹).',

    parametreler: {
      lambda_nm: { min: 200, max: 700, adim: 100, birim: 'nm', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Dalga boyu λ = ${p.lambda_nm} nm olan bir fotonun momentumu kaç kg·m/s\'dir? (h = 6.63×10⁻³⁴ J·s)`,

    hesapla: (p) => {
      const h = 6.63e-34;
      const lambda = p.lambda_nm * 1e-9;
      return Math.round((h / lambda) * 1e30) / 1e30;
    },

    cevapFormatla: (d) => `${d.toExponential(2)} kg·m/s`,

    yanlisCevapStratejisi: 'birim-donusum',

    aciklamaSablonu: (p, d) =>
      `p = h/λ = 6.63×10⁻³⁴ / (${p.lambda_nm}×10⁻⁹) = ${d.toExponential(2)} kg·m/s`,
  },

  // ─────────────────────────────────────────────────────────
  // 10. de Broglie Dalga Boyu: λ = h / (m·v)
  // ─────────────────────────────────────────────────────────
  {
    id: 'm12-de-broglie',
    sinif: 12,
    konuId: 'modern-fizik-12',
    altKonuId: 'kuantum-fizigi',
    zorluk: 3,
    aytMi: true,
    ilgiliFormul: 'λ = h / (m·v)',
    kazanim: 'Hareketli bir parçacığın de Broglie dalga boyunu hesaplar.',
    sure: 100,
    ipucuSablonu: 'λ = h/(mv). Elektron kütlesi m_e = 9.11×10⁻³¹ kg.',

    parametreler: {
      v_6: { min: 1, max: 5, adim: 1, birim: '×10⁶ m/s', tamsayi: true },
    },

    soruSablonu: (p) =>
      `${p.v_6}×10⁶ m/s hızla hareket eden bir elektronun de Broglie dalga boyu kaç m\'dir? (m_e = 9.11×10⁻³¹ kg, h = 6.63×10⁻³⁴ J·s)`,

    hesapla: (p) => {
      const h = 6.63e-34;
      const m = 9.11e-31;
      const v = p.v_6 * 1e6;
      return Math.round((h / (m * v)) * 1e12) / 1e12;
    },

    cevapFormatla: (d) => `${d.toExponential(2)} m`,

    yanlisCevapStratejisi: 'ters-islem',

    aciklamaSablonu: (p, d) =>
      `λ = h/(mv) = 6.63×10⁻³⁴ / (9.11×10⁻³¹ × ${p.v_6}×10⁶) = ${d.toExponential(2)} m`,
  },

  // ─────────────────────────────────────────────────────────
  // 11. Bohr Modeli: Enerji Seviyeleri (En = -13.6/n² eV)
  // ─────────────────────────────────────────────────────────
  {
    id: 'm12-bohr-enerji',
    sinif: 12,
    konuId: 'modern-fizik-12',
    altKonuId: 'atom-fizigi',
    zorluk: 2,
    aytMi: true,
    ilgiliFormul: 'E_n = −13.6 / n²  eV',
    kazanim: 'Bohr modelini kullanarak hidrojen atomu enerji seviyelerini hesaplar.',
    sure: 75,
    ipucuSablonu: 'E_n = −13.6/n² eV. n=1: −13.6 eV, n=2: −3.4 eV, n=3: −1.51 eV.',

    parametreler: {
      n: { degerler: [1, 2, 3, 4, 5] },
    },

    soruSablonu: (p) =>
      `Bohr modeline göre hidrojen atomunun n = ${p.n} enerji seviyesindeki enerjisi kaç eV\'dir?`,

    hesapla: (p) => Math.round((-13.6 / (p.n * p.n)) * 100) / 100,

    cevapFormatla: (d) => `${d} eV`,

    yanlisCevapStratejisi: 'karekok-hata',

    aciklamaSablonu: (p, d) =>
      `E_${p.n} = −13.6 / n² = −13.6 / ${p.n}² = −13.6 / ${p.n * p.n} = ${d} eV`,
  },

  // ─────────────────────────────────────────────────────────
  // 12. Bohr: Geçiş Enerjisi ΔE = E_son - E_ilk
  // ─────────────────────────────────────────────────────────
  {
    id: 'm12-bohr-gecis',
    sinif: 12,
    konuId: 'modern-fizik-12',
    altKonuId: 'atom-fizigi',
    zorluk: 3,
    aytMi: true,
    ilgiliFormul: 'ΔE = E_son − E_ilk = −13.6(1/n_son² − 1/n_ilk²) eV',
    kazanim: 'Bohr modelinde enerji seviyeleri arası geçişte yayılan ya da soğurulan foton enerjisini hesaplar.',
    sure: 100,
    ipucuSablonu: '|ΔE| = |E_son − E_ilk|. Dışarı foton: n büyükten küçüğe; içeri foton: küçükten büyüğe.',

    parametreler: {
      n_ilk: { degerler: [3, 4, 5] },
      n_son: { degerler: [1, 2] },
    },

    soruSablonu: (p) =>
      `Hidrojen atomunun elektronu n = ${p.n_ilk} seviyesinden n = ${p.n_son} seviyesine geçiyor. Yayılan fotonun enerjisi kaç eV\'dir?`,

    hesapla: (p) => {
      const E_ilk = -13.6 / (p.n_ilk * p.n_ilk);
      const E_son = -13.6 / (p.n_son * p.n_son);
      return Math.round(Math.abs(E_son - E_ilk) * 100) / 100;
    },

    cevapFormatla: (d) => `${d} eV`,

    yanlisCevapStratejisi: 'isaretli-hata',

    aciklamaSablonu: (p, d) => {
      const E_ilk = Math.round(-13.6 / (p.n_ilk * p.n_ilk) * 100) / 100;
      const E_son = Math.round(-13.6 / (p.n_son * p.n_son) * 100) / 100;
      return `E_${p.n_ilk} = ${E_ilk} eV,  E_${p.n_son} = ${E_son} eV\n|ΔE| = |${E_son} − ${E_ilk}| = ${d} eV`;
    },
  },

  // ─────────────────────────────────────────────────────────
  // 13. Radyoaktif Bozunma: N = N₀·(1/2)^(t/T)
  // ─────────────────────────────────────────────────────────
  {
    id: 'm12-bozunma-N',
    sinif: 12,
    konuId: 'modern-fizik-12',
    altKonuId: 'nukleer-fizik',
    zorluk: 3,
    aytMi: true,
    ilgiliFormul: 'N = N₀ · (1/2)^(t/T₁/₂)',
    kazanim: 'Radyoaktif bozunma yasasını kullanarak kalan çekirdek sayısını hesaplar.',
    sure: 100,
    ipucuSablonu: 'Her yarı ömürde miktar yarıya iner. t/T tam sayıysa (1/2)^k doğrudan uygulanır.',

    parametreler: {
      N0:   { min: 1000, max: 8000, adim: 1000, birim: 'çekirdek', tamsayi: true },
      k:    { min: 1,    max: 4,    adim: 1,    birim: 'yarı ömür', tamsayi: true },
      T_gun:{ min: 5,    max: 20,   adim: 5,    birim: 'gün',       tamsayi: true },
    },

    soruSablonu: (p) =>
      `Başlangıçta N₀ = ${p.N0} çekirdeği bulunan bir radyoaktif maddenin yarı ömrü T = ${p.T_gun} gündür. ${p.k * p.T_gun} gün sonra kaç çekirdek kalır?`,

    hesapla: (p) => Math.round(p.N0 * Math.pow(0.5, p.k)),

    cevapFormatla: (d) => `${d} çekirdek`,

    yanlisCevapStratejisi: 'carpan-hatasi',

    aciklamaSablonu: (p, d) =>
      `t/T = ${p.k * p.T_gun} / ${p.T_gun} = ${p.k} yarı ömür\nN = ${p.N0} × (1/2)^${p.k} = ${p.N0} / ${Math.pow(2, p.k)} = ${d} çekirdek`,
  },

  // ─────────────────────────────────────────────────────────
  // 14. Radyoaktif Bozunma: Kalan Kütle
  // ─────────────────────────────────────────────────────────
  {
    id: 'm12-bozunma-kitle',
    sinif: 12,
    konuId: 'modern-fizik-12',
    altKonuId: 'nukleer-fizik',
    zorluk: 3,
    aytMi: true,
    ilgiliFormul: 'm = m₀ · (1/2)^(t/T₁/₂)',
    kazanim: 'Kalan radyoaktif madde kütlesini yarı ömür kullanarak hesaplar.',
    sure: 90,
    ipucuSablonu: 'Kütle için de N = N₀·(1/2)^k formülü geçerlidir. m = m₀/2^k.',

    parametreler: {
      m0:  { min: 80, max: 320, adim: 80, birim: 'g',   tamsayi: true },
      k:   { min: 1,  max: 4,   adim: 1,  birim: 'yarı ömür', tamsayi: true },
      T_yil:{ min: 5, max: 25,  adim: 5,  birim: 'yıl', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Yarı ömrü ${p.T_yil} yıl olan ${p.m0} g\'lık radyoaktif bir madde ${p.k * p.T_yil} yıl sonra kaç gram kalır?`,

    hesapla: (p) => Math.round(p.m0 * Math.pow(0.5, p.k) * 100) / 100,

    cevapFormatla: (d) => `${d} g`,

    yanlisCevapStratejisi: 'carpan-hatasi',

    aciklamaSablonu: (p, d) =>
      `t/T = ${p.k * p.T_yil} / ${p.T_yil} = ${p.k} yarı ömür\nm = ${p.m0} × (1/2)^${p.k} = ${p.m0} / ${Math.pow(2, p.k)} = ${d} g`,
  },

  // ─────────────────────────────────────────────────────────
  // 15. Nükleer Bağlanma Enerjisi: E = Δm·c²
  // ─────────────────────────────────────────────────────────
  {
    id: 'm12-baglanma-enerjisi',
    sinif: 12,
    konuId: 'modern-fizik-12',
    altKonuId: 'nukleer-fizik',
    zorluk: 4,
    aytMi: true,
    ilgiliFormul: 'E = Δm · c²   (1 u = 931.5 MeV/c²)',
    kazanim: 'Kütle defekti kullanarak nükleer bağlanma enerjisini MeV cinsinden hesaplar.',
    sure: 120,
    ipucuSablonu: '1 u = 931.5 MeV. E(MeV) = Δm(u) × 931.5.',

    parametreler: {
      dm_mu: { min: 5, max: 30, adim: 5, birim: '×10⁻³ u', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Bir çekirdeğin kütle defekti Δm = ${p.dm_mu}×10⁻³ u olarak ölçülmüştür. Bu çekirdeğin bağlanma enerjisi kaç MeV\'dir? (1 u = 931.5 MeV/c²)`,

    hesapla: (p) => Math.round(p.dm_mu * 1e-3 * 931.5 * 100) / 100,

    cevapFormatla: (d) => `${d} MeV`,

    yanlisCevapStratejisi: 'birim-donusum',

    aciklamaSablonu: (p, d) =>
      `E = Δm × 931.5 MeV/u = ${p.dm_mu}×10⁻³ u × 931.5 MeV/u = ${d} MeV`,
  },

  // ─────────────────────────────────────────────────────────
  // 16. Özel Görelilik: Zaman Genişlemesi t' = t / √(1-v²/c²)
  // ─────────────────────────────────────────────────────────
  {
    id: 'm12-zaman-genislemesi',
    sinif: 12,
    konuId: 'modern-fizik-12',
    altKonuId: 'ozel-gorelilik',
    zorluk: 4,
    aytMi: true,
    ilgiliFormul: "t' = t / √(1 − v²/c²)",
    kazanim: 'Özel görelilik zaman genişlemesini hesaplar.',
    sure: 120,
    ipucuSablonu: "t' = γt. γ = 1/√(1−β²), β = v/c. v = 0.6c için γ = 1.25, v = 0.8c için γ = 5/3.",

    parametreler: {
      t_s:  { min: 1, max: 5,  adim: 1, birim: 's', tamsayi: true },
      beta: { degerler: [0.6, 0.8, 0.866] },  // γ = 1.25, 5/3, 2
    },

    soruSablonu: (p) =>
      `Uzay gemisinde bulunan bir saat, geminin referans çerçevesinde ${p.t_s} s ölçüyor. Gemi ışık hızının v = ${p.beta}c kadarıyla hareket ediyorsa, dünya gözlemcisi kaç s ölçer?`,

    hesapla: (p) => {
      const gamma = 1 / Math.sqrt(1 - p.beta * p.beta);
      return Math.round(p.t_s * gamma * 100) / 100;
    },

    cevapFormatla: (d) => `${d} s`,

    yanlisCevapStratejisi: 'karekok-hata',

    aciklamaSablonu: (p, d) => {
      const gamma = Math.round(1 / Math.sqrt(1 - p.beta * p.beta) * 100) / 100;
      return `γ = 1/√(1−${p.beta}²) = ${gamma}\nt' = γ × t = ${gamma} × ${p.t_s} = ${d} s`;
    },
  },

  // ─────────────────────────────────────────────────────────
  // 17. Uzunluk Kısalması: L' = L · √(1-v²/c²)
  // ─────────────────────────────────────────────────────────
  {
    id: 'm12-uzunluk-kisalmasi',
    sinif: 12,
    konuId: 'modern-fizik-12',
    altKonuId: 'ozel-gorelilik',
    zorluk: 4,
    aytMi: true,
    ilgiliFormul: "L' = L · √(1 − v²/c²)",
    kazanim: 'Özel görelilik uzunluk kısalmasını hesaplar.',
    sure: 120,
    ipucuSablonu: "L' = L/γ. Hareket yönündeki uzunluk kısalır, enine boyutlar değişmez.",

    parametreler: {
      L_m:  { min: 100, max: 500, adim: 100, birim: 'm', tamsayi: true },
      beta: { degerler: [0.6, 0.8, 0.866] },
    },

    soruSablonu: (p) =>
      `Dinlenme uzunluğu L₀ = ${p.L_m} m olan bir uzay gemisi v = ${p.beta}c hızıyla hareket ederken dünya gözlemcisi uzunluğu kaç m olarak ölçer?`,

    hesapla: (p) => {
      const factor = Math.sqrt(1 - p.beta * p.beta);
      return Math.round(p.L_m * factor * 100) / 100;
    },

    cevapFormatla: (d) => `${d} m`,

    yanlisCevapStratejisi: 'karekok-hata',

    aciklamaSablonu: (p, d) => {
      const factor = Math.round(Math.sqrt(1 - p.beta * p.beta) * 1000) / 1000;
      return `L' = L₀ × √(1−v²/c²) = ${p.L_m} × ${factor} = ${d} m`;
    },
  },

  // ─────────────────────────────────────────────────────────
  // 18. Kütle-Enerji Denkliği: E = m·c²
  // ─────────────────────────────────────────────────────────
  {
    id: 'm12-e-mc2',
    sinif: 12,
    konuId: 'modern-fizik-12',
    altKonuId: 'ozel-gorelilik',
    zorluk: 3,
    aytMi: true,
    ilgiliFormul: 'E = m · c²   (c = 3×10⁸ m/s)',
    kazanim: 'Einstein\'ın kütle-enerji denkliğini kullanarak enerjiyi hesaplar.',
    sure: 90,
    ipucuSablonu: 'E = mc². c = 3×10⁸ m/s, c² = 9×10¹⁶ m²/s². Sonuç çok büyük bir değer çıkar.',

    parametreler: {
      m_mg: { min: 1, max: 5, adim: 1, birim: 'mg', tamsayi: true },
    },

    soruSablonu: (p) =>
      `${p.m_mg} mg kütlesi tamamen enerjiye dönüştürülüyor. Açığa çıkan enerji kaç J\'dür? (c = 3×10⁸ m/s)`,

    hesapla: (p) => {
      const m = p.m_mg * 1e-6;  // mg → kg
      const c = 3e8;
      return Math.round(m * c * c * 100) / 100;
    },

    cevapFormatla: (d) => `${d.toExponential(2)} J`,

    yanlisCevapStratejisi: 'onlu-hata',

    aciklamaSablonu: (p, d) =>
      `m = ${p.m_mg} mg = ${p.m_mg}×10⁻⁶ kg\nE = mc² = ${p.m_mg}×10⁻⁶ × (3×10⁸)² = ${p.m_mg}×10⁻⁶ × 9×10¹⁶ = ${d.toExponential(2)} J`,
  },

  // ─────────────────────────────────────────────────────────
  // 19. X-Işını Minimum Dalga Boyu: λ_min = hc / (eV)
  // ─────────────────────────────────────────────────────────
  {
    id: 'm12-xray-lambda',
    sinif: 12,
    konuId: 'modern-fizik-12',
    altKonuId: 'kuantum-fizigi',
    zorluk: 4,
    aytMi: true,
    ilgiliFormul: 'λ_min = hc / (eV)',
    kazanim: 'Hızlandırma geriliminden X-ışınının minimum dalga boyunu hesaplar.',
    sure: 110,
    ipucuSablonu: 'λ_min = hc/(eV). hc = 1240 eV·nm kısayolunu kullan: λ_min(nm) = 1240/V.',

    parametreler: {
      V_kV: { min: 10, max: 50, adim: 10, birim: 'kV', tamsayi: true },
    },

    soruSablonu: (p) =>
      `Bir X-ışını tüpünde elektronlar ${p.V_kV} kV gerilimle hızlandırılıyor. Oluşan X-ışınlarının minimum dalga boyu kaç pm\'dir? (h = 6.63×10⁻³⁴ J·s, c = 3×10⁸ m/s, e = 1.6×10⁻¹⁹ C)`,

    hesapla: (p) => {
      const h = 6.63e-34;
      const c = 3e8;
      const e = 1.6e-19;
      const V = p.V_kV * 1e3;
      const lambda_m = (h * c) / (e * V);
      return Math.round(lambda_m * 1e12 * 10) / 10;  // pm
    },

    cevapFormatla: (d) => `${d} pm`,

    yanlisCevapStratejisi: 'birim-donusum',

    aciklamaSablonu: (p, d) => {
      const lambda_nm = Math.round(1240 / (p.V_kV * 1000) * 1e5) / 1e5;
      return `λ_min = hc/(eV) = 1240 eV·nm / (${p.V_kV * 1000} eV) ≈ ${lambda_nm} nm = ${d} pm`;
    },
  },

  // ─────────────────────────────────────────────────────────
  // 20. Manyetik Alanda Elektron: r = mv / (qB)
  // ─────────────────────────────────────────────────────────
  {
    id: 'm12-elektron-manyetik-r',
    sinif: 12,
    konuId: 'modern-fizik-12',
    altKonuId: 'kuantum-fizigi',
    zorluk: 4,
    aytMi: true,
    ilgiliFormul: 'r = mv / (qB)',
    kazanim: 'Manyetik alanda dairesel hareket yapan elektronun yörünge yarıçapını hesaplar.',
    sure: 110,
    ipucuSablonu: 'r = mv/(qB). m_e = 9.11×10⁻³¹ kg, e = 1.6×10⁻¹⁹ C. v ve B değerlerini yerine koy.',

    parametreler: {
      v_6: { min: 1, max: 4, adim: 1, birim: '×10⁶ m/s', tamsayi: true },
      B:   { min: 1, max: 3, adim: 1, birim: 'mT',        tamsayi: true },
    },

    soruSablonu: (p) =>
      `${p.v_6}×10⁶ m/s hızla hareket eden bir elektron, ${p.B} mT\'lik homojen manyetik alana dik olarak giriyor. Elektronun dairesel yörüngesinin yarıçapı kaç m\'dir? (m_e = 9.11×10⁻³¹ kg, e = 1.6×10⁻¹⁹ C)`,

    hesapla: (p) => {
      const m = 9.11e-31;
      const q = 1.6e-19;
      const v = p.v_6 * 1e6;
      const B = p.B * 1e-3;
      return Math.round((m * v) / (q * B) * 1000) / 1000;
    },

    cevapFormatla: (d) => `${d} m`,

    yanlisCevapStratejisi: 'ters-islem',

    aciklamaSablonu: (p, d) =>
      `r = mv/(qB) = (9.11×10⁻³¹ × ${p.v_6}×10⁶) / (1.6×10⁻¹⁹ × ${p.B}×10⁻³) = ${d} m`,
  },
];
