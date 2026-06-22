// ============================================================
// Fizik Yıldızı – Soru Üretim Motoru: Tipler
// ============================================================

export type ZorulukSeviye = 1 | 2 | 3 | 4 | 5;
export type SinifSeviye = 9 | 10 | 11 | 12;
export type YanlisCevapStratejisi =
  | 'carpim-bolum-toplam'  // m*a → m+a, m-a, m/a
  | 'carpan-hatasi'        // doğru ± %10-30
  | 'onlu-hata'            // x10 veya /10
  | 'ters-islem'           // a/b yerine b/a
  | 'birim-donusum'        // g/kg karışıklığı
  | 'karekok-hata'         // v² yerine v veya √v
  | 'sin-cos-karisimi'     // sin yerine cos
  | 'isaretli-hata'        // + yerine -
  | 'sabit-carpan'         // 2π, 4π gibi sabitleri unutma
  | 'aritmetik-hata';      // hesap hatası simülasyonu

export interface ParametreAraligi {
  min?: number;           // Optional when degerler is provided
  max?: number;           // Optional when degerler is provided
  adim?: number;          // Adım büyüklüğü (varsayılan: 1)
  birim?: string;         // Görüntü birimi
  tamsayi?: boolean;      // Sadece tam sayı üret
  degerler?: number[];    // Sabit liste yerine rastgele seç
}

export interface SoruParametreleri {
  [key: string]: number;
}

export interface UretilmisSoru {
  id: string;               // sablon_id + '_' + seed
  sablonId: string;
  sinif: SinifSeviye;
  konuId: string;
  altKonuId: string;
  tip: 'coktan-secmeli';
  zorluk: ZorulukSeviye;
  soru: string;
  secenekler: { A: string; B: string; C: string; D: string };
  dogruCevap: 'A' | 'B' | 'C' | 'D';
  aciklama: string;
  ipucu: string;
  ilgiliFormul?: string;
  kazanim: string;
  sure: number;             // saniye
  seed: number;             // Üretim tohumu (tekrarlanabilirlik)
  tytMi?: boolean;          // TYT kapsamında mı?
  aytMi?: boolean;          // AYT kapsamında mı?
  parametreler: SoruParametreleri; // Kullanılan parametre değerleri
}

export interface SoruSablonu {
  id: string;
  sinif: SinifSeviye;
  konuId: string;
  altKonuId: string;
  zorluk: ZorulukSeviye;
  tytMi?: boolean;
  aytMi?: boolean;
  ilgiliFormul?: string;
  kazanim: string;
  sure: number;
  ipucuSablonu: string;

  // Parametre tanımları
  parametreler: Record<string, ParametreAraligi>;

  // Soru metni üretici
  soruSablonu: (p: SoruParametreleri) => string;

  // Doğru cevap hesaplayıcı
  hesapla: (p: SoruParametreleri) => number;

  // Sonucu birim ile formatla
  cevapFormatla?: (deger: number) => string;

  // Yanlış cevap stratejisi
  yanlisCevapStratejisi: YanlisCevapStratejisi;

  // Açıklama üretici
  aciklamaSablonu: (p: SoruParametreleri, dogruCevap: number) => string;
}

export interface UretimSonucu {
  toplam: number;
  sorular: UretilmisSoru[];
  sablonaGore: Record<string, number>;
  konuyaGore: Record<string, number>;
  sinifaGore: Record<SinifSeviye, number>;
}

export interface SoruFiltresi {
  sinif?: (9 | 10 | 11 | 12)[];
  konuId?: string;
  altKonuId?: string;
  zorluk?: ZorulukSeviye[];
  tytMi?: boolean;
  aytMi?: boolean;
  adet?: number;
  seed?: number;
}

