// ============================================================
// Fizik Yıldızı – Soru Üretim Motoru: Public API
// ============================================================

export type { SoruSablonu, UretilmisSoru, SoruParametreleri, SoruFiltresi } from './tipler';
export {
  tekSoruUret,
  topluUret,
  zorlukDagilimiyleUret,
  filtreliSoruUret,
  istatistikHesapla,
  parametreUret,
  yanlisCevapUret,
} from './uretici';

// ─── Şablon Koleksiyonları (lazy import pattern) ─────────────
// Not: Bu importlar Next.js'de server-side'da çalışır.
// Client-side API için /api/fizik-yildizi?action=sorular kullanın.

let _tumSablonlar: import('./tipler').SoruSablonu[] | null = null;

export async function tumSablonlarıYukle() {
  if (_tumSablonlar) return _tumSablonlar;

  const [
    { sinif9MekanikSablonlar },
    { sinif9MaddeSablonlar },
    { sinif10HareketSablonlar },
    { sinif10EnerjiSablonlar },
    { sinif11DalgalarSablonlar },
    { sinif11ElektrikSablonlar },
    { sinif12ModernSablonlar },
    { yksKarisikSablonlar },
    { sinif10OptikSablonlar },
  ] = await Promise.all([
    import('./sablonlar/sinif9-mekanik'),
    import('./sablonlar/sinif9-madde'),
    import('./sablonlar/sinif10-hareket'),
    import('./sablonlar/sinif10-enerji'),
    import('./sablonlar/sinif11-dalgalar'),
    import('./sablonlar/sinif11-elektrik'),
    import('./sablonlar/sinif12-modern'),
    import('./sablonlar/yks-karisik'),
    import('./sablonlar/sinif10-optik'),
  ]);

  _tumSablonlar = [
    ...sinif9MekanikSablonlar,
    ...sinif9MaddeSablonlar,
    ...sinif10HareketSablonlar,
    ...sinif10EnerjiSablonlar,
    ...sinif11DalgalarSablonlar,
    ...sinif11ElektrikSablonlar,
    ...sinif12ModernSablonlar,
    ...yksKarisikSablonlar,
    ...sinif10OptikSablonlar,
  ];

  return _tumSablonlar;
}

// ─── Senkron versiyon (static import — sadece server'da) ────
// Bu fonksiyon sorular.ts dosyasında kullanılır.
import { sinif9MekanikSablonlar } from './sablonlar/sinif9-mekanik';
import { sinif9MaddeSablonlar } from './sablonlar/sinif9-madde';
import { sinif10HareketSablonlar } from './sablonlar/sinif10-hareket';
import { sinif10EnerjiSablonlar } from './sablonlar/sinif10-enerji';
import { sinif11DalgalarSablonlar } from './sablonlar/sinif11-dalgalar';
import { sinif11ElektrikSablonlar } from './sablonlar/sinif11-elektrik';
import { sinif12ModernSablonlar } from './sablonlar/sinif12-modern';
import { yksKarisikSablonlar } from './sablonlar/yks-karisik';
import { sinif10OptikSablonlar } from './sablonlar/sinif10-optik';

export function tumSablonlarSenkron(): import('./tipler').SoruSablonu[] {
  return [
    ...sinif9MekanikSablonlar,
    ...sinif9MaddeSablonlar,
    ...sinif10HareketSablonlar,
    ...sinif10EnerjiSablonlar,
    ...sinif11DalgalarSablonlar,
    ...sinif11ElektrikSablonlar,
    ...sinif12ModernSablonlar,
    ...yksKarisikSablonlar,
    ...sinif10OptikSablonlar,
  ];
}
