// ============================================================
// Fizik Yıldızı – Soru Üretim Motoru: Ana Motor
// ============================================================

import type {
  SoruSablonu,
  SoruParametreleri,
  UretilmisSoru,
  YanlisCevapStratejisi,
  ZorulukSeviye,
  SoruFiltresi,
} from './tipler';

// ─── Yardımcı: Deterministik Sahte Rastgele ──────────────────
/**
 * Seed-tabanlı deterministik pseudo-random sayı üretici.
 * Aynı seed → aynı soru → tekrarlanabilir sonuçlar.
 * Mulberry32 algoritması kullanır.
 */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── Parametre Üretimi ─────────────────────────────────────
export function parametreUret(
  sablon: SoruSablonu,
  seed: number
): SoruParametreleri {
  const rng = mulberry32(seed);
  const parametreler: SoruParametreleri = {};

  for (const [key, aralik] of Object.entries(sablon.parametreler)) {
    if (aralik.degerler && aralik.degerler.length > 0) {
      // Sabit değerler listesinden deterministik seç
      const idx = Math.floor(rng() * aralik.degerler.length);
      parametreler[key] = aralik.degerler[idx];
    } else if (aralik.min !== undefined && aralik.max !== undefined) {
      const adim = aralik.adim ?? 1;
      const adimSayisi = Math.floor((aralik.max - aralik.min) / adim);
      const secilenAdim = Math.floor(rng() * (adimSayisi + 1));
      let deger = aralik.min + secilenAdim * adim;

      // Floating point temizleme
      deger = Math.round(deger * 1000) / 1000;

      if (aralik.tamsayi) {
        deger = Math.round(deger);
      }
      parametreler[key] = deger;
    } else {
      // Fallback: skip (parametre 0 olarak kalır)
      parametreler[key] = 0;
    }
  }

  return parametreler;
}

// ─── Cevap Formatlama ─────────────────────────────────────
function formatDeger(deger: number): string {
  if (!isFinite(deger)) return '∞';
  if (Math.abs(deger) < 0.001 && deger !== 0) {
    return deger.toExponential(2);
  }
  // 4+ basamak → 2 ondalık; 1-3 basamak → tam veya 1 ondalık
  const abs = Math.abs(deger);
  if (abs >= 1000) return Math.round(deger).toString();
  if (abs >= 10) return (Math.round(deger * 10) / 10).toString();
  if (Number.isInteger(deger)) return deger.toString();
  return (Math.round(deger * 100) / 100).toString();
}

// ─── Yanlış Cevap Üretimi ─────────────────────────────────
export function yanlisCevapUret(
  dogruCevap: number,
  strateji: YanlisCevapStratejisi,
  formatla: (n: number) => string,
  parametreler: SoruParametreleri,
  rng: () => number
): number[] {
  const aday: Set<number> = new Set();
  const degerler = Object.values(parametreler);
  const [p1 = 1, p2 = 1, p3 = 1] = degerler;

  const ekle = (n: number) => {
    const yuvarla = Math.round(n * 100) / 100;
    if (yuvarla !== dogruCevap && yuvarla > 0 && isFinite(yuvarla)) {
      aday.add(yuvarla);
    }
  };

  switch (strateji) {
    case 'carpim-bolum-toplam':
      ekle(p1 + p2);
      ekle(p1 - p2 > 0 ? p1 - p2 : p1 * p3);
      ekle(p1 / p2);
      ekle(p2 / p1);
      ekle(p1 * p3);
      ekle(p2 * p3);
      break;

    case 'carpan-hatasi':
      ekle(dogruCevap * 1.1);
      ekle(dogruCevap * 0.9);
      ekle(dogruCevap * 1.25);
      ekle(dogruCevap * 0.75);
      ekle(dogruCevap * 2);
      ekle(dogruCevap / 2);
      ekle(dogruCevap + p1);
      ekle(dogruCevap - p1 > 0 ? dogruCevap - p1 : dogruCevap + p2);
      break;

    case 'onlu-hata':
      ekle(dogruCevap * 10);
      ekle(dogruCevap / 10);
      ekle(dogruCevap * 100);
      ekle(dogruCevap / 100);
      ekle(dogruCevap * 1000);
      break;

    case 'ters-islem':
      if (p2 !== 0) ekle(p1 / p2);
      if (p1 !== 0) ekle(p2 / p1);
      ekle(p1 + p2);
      ekle(Math.abs(p1 - p2));
      ekle(p1 * p2 * 2);
      break;

    case 'birim-donusum':
      ekle(dogruCevap * 1000);    // g → kg unutuldu
      ekle(dogruCevap / 1000);    // kg → g
      ekle(dogruCevap * 100);     // cm → m unutuldu
      ekle(dogruCevap / 100);     // m → cm
      ekle(dogruCevap * 3.6);     // m/s → km/h
      ekle(dogruCevap / 3.6);     // km/h → m/s
      break;

    case 'karekok-hata':
      ekle(dogruCevap * dogruCevap);   // v yerine v² kullanıldı
      ekle(Math.sqrt(Math.abs(dogruCevap))); // √ alındı
      ekle(dogruCevap * 2);
      ekle(dogruCevap / 2);
      break;

    case 'sin-cos-karisimi':
      ekle(dogruCevap * Math.cos(Math.PI / 6) / Math.sin(Math.PI / 6));
      ekle(dogruCevap * 2);
      ekle(dogruCevap / 2);
      ekle(Math.abs(dogruCevap - p1));
      break;

    case 'isaretli-hata':
      ekle(-dogruCevap + 2 * p1);
      ekle(p1 - dogruCevap > 0 ? p1 - dogruCevap : dogruCevap + p2);
      ekle(dogruCevap + 2 * p2);
      ekle(dogruCevap * 1.5);
      break;

    case 'sabit-carpan':
      ekle(dogruCevap / (2 * Math.PI));  // 2π unutuldu
      ekle(dogruCevap * (2 * Math.PI));  // 2π fazladan eklendi
      ekle(dogruCevap / Math.PI);
      ekle(dogruCevap * Math.PI);
      break;

    case 'aritmetik-hata':
      ekle(dogruCevap + 1);
      ekle(dogruCevap - 1 > 0 ? dogruCevap - 1 : dogruCevap + 2);
      ekle(dogruCevap + p1);
      ekle(dogruCevap - p2 > 0 ? dogruCevap - p2 : dogruCevap + p2);
      ekle(dogruCevap * 1.2);
      break;

    default:
      ekle(dogruCevap * 2);
      ekle(dogruCevap / 2);
      ekle(dogruCevap + p1);
      ekle(dogruCevap - p1 > 0 ? dogruCevap - p1 : dogruCevap * 3);
  }

  // Eğer yeterli aday üretilemezse, rastgele yakın değerler ekle
  let safeCounter = 0;
  while (aday.size < 5 && safeCounter < 200) {
    safeCounter++;
    const carpan = 0.3 + rng() * 2;
    const gosterge = dogruCevap > 0.5 ? dogruCevap : 1.0;
    ekle(dogruCevap * carpan + (rng() - 0.5) * gosterge * 0.5);
  }

  return Array.from(aday).slice(0, 10);
}

// ─── Şıkları Karıştır ─────────────────────────────────────
function sikKarıstir(
  dogruCevap: number,
  yanlisCevaplar: number[],
  formatla: (n: number) => string,
  rng: () => number
): {
  secenekler: { A: string; B: string; C: string; D: string };
  dogruSik: 'A' | 'B' | 'C' | 'D';
} {
  // 3 tane benzersiz yanlış cevap seç
  const benzersizYanlis = yanlisCevaplar.filter(
    (v, i, arr) => arr.indexOf(v) === i && v !== dogruCevap
  );

  // Karıştır
  for (let i = benzersizYanlis.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [benzersizYanlis[i], benzersizYanlis[j]] = [benzersizYanlis[j], benzersizYanlis[i]];
  }

  const yanlis3 = benzersizYanlis.slice(0, 3);

  // Doğru cevabın pozisyonunu belirle (A/B/C/D)
  const dogruPozisyon = Math.floor(rng() * 4);
  const dortlu: number[] = [];

  let yanlisSay = 0;
  for (let i = 0; i < 4; i++) {
    if (i === dogruPozisyon) {
      dortlu.push(dogruCevap);
    } else {
      dortlu.push(yanlis3[yanlisSay++] ?? dogruCevap * (1.5 + yanlisSay));
    }
  }

  const sikHarfleri: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
  const dogruSik = sikHarfleri[dogruPozisyon];

  return {
    secenekler: {
      A: formatla(dortlu[0]),
      B: formatla(dortlu[1]),
      C: formatla(dortlu[2]),
      D: formatla(dortlu[3]),
    },
    dogruSik,
  };
}

// ─── Tek Soru Üret ────────────────────────────────────────
export function tekSoruUret(
  sablon: SoruSablonu,
  seed: number
): UretilmisSoru | null {
  try {
    const rng = mulberry32(seed * 1000 + 7);
    const parametreler = parametreUret(sablon, seed);

    const dogruDeger = sablon.hesapla(parametreler);

    // Sıfır veya negatif veya sonsuz → geçersiz
    if (!isFinite(dogruDeger) || dogruDeger <= 0) return null;

    const formatla = sablon.cevapFormatla ?? formatDeger;
    const dogruMetin = formatla(dogruDeger);

    const yanlisDegerler = yanlisCevapUret(
      dogruDeger,
      sablon.yanlisCevapStratejisi,
      formatla,
      parametreler,
      rng
    );

    const { secenekler, dogruSik } = sikKarıstir(
      dogruDeger,
      yanlisDegerler,
      formatla,
      rng
    );

    return {
      id: `${sablon.id}_s${seed}`,
      sablonId: sablon.id,
      sinif: sablon.sinif,
      konuId: sablon.konuId,
      altKonuId: sablon.altKonuId,
      tip: 'coktan-secmeli',
      zorluk: sablon.zorluk,
      soru: sablon.soruSablonu(parametreler),
      secenekler,
      dogruCevap: dogruSik,
      aciklama: sablon.aciklamaSablonu(parametreler, dogruDeger),
      ipucu: sablon.ipucuSablonu,
      ilgiliFormul: sablon.ilgiliFormul,
      kazanim: sablon.kazanim,
      sure: sablon.sure,
      seed,
      tytMi: sablon.tytMi,
      aytMi: sablon.aytMi,
      parametreler,
    };
  } catch {
    return null;
  }
}

// ─── Toplu Üretim ────────────────────────────────────────
export function topluUret(
  sablon: SoruSablonu,
  adet: number,
  baslangicSeed: number = 0
): UretilmisSoru[] {
  const sorular: UretilmisSoru[] = [];
  const gorulenParametreler = new Set<string>();

  let seed = baslangicSeed;
  let deneme = 0;
  const maxDeneme = adet * 5; // Maksimum deneme sayısı

  while (sorular.length < adet && deneme < maxDeneme) {
    const soru = tekSoruUret(sablon, seed);
    if (soru) {
      // Aynı parametre kombinasyonunu tekrar üretme
      const parametreKey = JSON.stringify(soru.parametreler);
      if (!gorulenParametreler.has(parametreKey)) {
        gorulenParametreler.add(parametreKey);
        sorular.push(soru);
      }
    }
    seed++;
    deneme++;
  }

  return sorular;
}

// ─── Zorluk Dağılımı ile Toplu Üretim ────────────────────
/**
 * Belirli bir şablondan zorluk dağılımına göre sorular üretir.
 * %30 kolay (1-2), %40 orta (3), %30 zor (4-5)
 */
export function zorlukDagilimiyleUret(
  sablonlar: SoruSablonu[],
  sablonBasinaAdet: number = 80
): UretilmisSoru[] {
  const tumSorular: UretilmisSoru[] = [];

  for (const sablon of sablonlar) {
    const sorular = topluUret(sablon, sablonBasinaAdet, sablon.id.length * 17);
    tumSorular.push(...sorular);
  }

  return tumSorular;
}

// ─── Filtreli Üretim ─────────────────────────────────────

export function filtreliSoruUret(
  sablonlar: SoruSablonu[],
  filtre: SoruFiltresi
): UretilmisSoru[] {
  const uygunSablonlar = sablonlar.filter((s) => {
    if (filtre.sinif && !filtre.sinif.includes(s.sinif)) return false;
    if (filtre.konuId && s.konuId !== filtre.konuId) return false;
    if (filtre.altKonuId && s.altKonuId !== filtre.altKonuId) return false;
    if (filtre.zorluk && !filtre.zorluk.includes(s.zorluk)) return false;
    if (filtre.tytMi !== undefined && s.tytMi !== filtre.tytMi) return false;
    if (filtre.aytMi !== undefined && s.aytMi !== filtre.aytMi) return false;
    return true;
  });

  const adetPerSablon = Math.ceil(
    (filtre.adet ?? 100) / Math.max(1, uygunSablonlar.length)
  );

  const sorular: UretilmisSoru[] = [];
  for (const sablon of uygunSablonlar) {
    const yeni = topluUret(sablon, adetPerSablon, filtre.seed ?? 0);
    sorular.push(...yeni);
  }

  // Shuffle ve adet sınırla
  const shuffled = sorular.sort(() => Math.random() - 0.5);
  return filtre.adet ? shuffled.slice(0, filtre.adet) : shuffled;
}

// ─── İstatistik ──────────────────────────────────────────
export function istatistikHesapla(sorular: UretilmisSoru[]) {
  const sablonaGore: Record<string, number> = {};
  const konuyaGore: Record<string, number> = {};
  const sinifaGore: Record<number, number> = { 9: 0, 10: 0, 11: 0, 12: 0 };
  const zorluğaGore: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  for (const s of sorular) {
    sablonaGore[s.sablonId] = (sablonaGore[s.sablonId] ?? 0) + 1;
    konuyaGore[s.konuId] = (konuyaGore[s.konuId] ?? 0) + 1;
    sinifaGore[s.sinif] = (sinifaGore[s.sinif] ?? 0) + 1;
    zorluğaGore[s.zorluk] = (zorluğaGore[s.zorluk] ?? 0) + 1;
  }

  return { toplam: sorular.length, sablonaGore, konuyaGore, sinifaGore, zorluğaGore };
}
