'use client';

/**
 * Soru Motoru Client Hook
 * 
 * API üzerinden soru motoru ile üretilmiş soruları çeken React hook.
 * Server-side rendering yerine client-side fetch kullanır.
 */

import { useState, useCallback, useRef } from 'react';

export interface MotorSoru {
  id: string;
  soru: string;
  secenekler: { A: string; B: string; C: string; D: string };
  dogruCevap: 'A' | 'B' | 'C' | 'D';
  aciklama: string;
  ipucu: string;
  ilgiliFormul?: string;
  kazanim: string;
  zorluk: number;
  sinif: number;
  konuId: string;
  sure: number;
  tytMi?: boolean;
  aytMi?: boolean;
}

export interface SoruFiltreOptions {
  sinif?: number | number[];
  konuId?: string;
  altKonuId?: string;
  adet?: number;
  tyt?: boolean;
  ayt?: boolean;
  seed?: number;
}

export function useSoruMotoru() {
  const [sorular, setSorular] = useState<MotorSoru[]>([]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState<string | null>(null);
  const [istatistik, setIstatistik] = useState<{
    toplam: number;
    sablonSayisi: number;
  } | null>(null);
  
  const oncekiSeedRef = useRef<number>(0);

  const soruGetir = useCallback(async (filtre: SoruFiltreOptions = {}) => {
    setYukleniyor(true);
    setHata(null);
    
    try {
      const params = new URLSearchParams({ action: 'sorular' });
      
      if (filtre.sinif) {
        const siniflar = Array.isArray(filtre.sinif) ? filtre.sinif : [filtre.sinif];
        params.set('sinif', siniflar.join(','));
      }
      if (filtre.konuId) params.set('konuId', filtre.konuId);
      if (filtre.altKonuId) params.set('altKonuId', filtre.altKonuId);
      if (filtre.adet) params.set('adet', filtre.adet.toString());
      if (filtre.tyt) params.set('tyt', 'true');
      if (filtre.ayt) params.set('ayt', 'true');
      
      // Her çağrıda farklı seed → farklı sorular
      const seed = filtre.seed ?? (oncekiSeedRef.current + Date.now()) % 999999;
      oncekiSeedRef.current = seed;
      params.set('seed', seed.toString());
      
      const res = await fetch(`/api/fizik-yildizi?${params}`);
      const data = await res.json();
      
      if (!data.success) throw new Error(data.error || 'Soru alınamadı');
      
      setSorular(data.sorular ?? []);
      return data.sorular as MotorSoru[];
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Sunucu hatası';
      setHata(msg);
      return [];
    } finally {
      setYukleniyor(false);
    }
  }, []);

  const istatistikGetir = useCallback(async () => {
    try {
      const res = await fetch('/api/fizik-yildizi?action=soru-istatistik');
      const data = await res.json();
      if (data.success) {
        setIstatistik({
          toplam: data.istatistik.toplam,
          sablonSayisi: data.sablonSayisi,
        });
      }
    } catch { /* ignore */ }
  }, []);

  return { sorular, yukleniyor, hata, istatistik, soruGetir, istatistikGetir };
}

// ─── Format Yardımcıları ─────────────────────────────────────

/** Zorluk seviyesini Türkçe etikete çevirir */
export function zorlukEtiketi(zorluk: number): string {
  const etiketler: Record<number, string> = {
    1: 'Çok Kolay',
    2: 'Kolay',
    3: 'Orta',
    4: 'Zor',
    5: 'Çok Zor',
  };
  return etiketler[zorluk] ?? 'Orta';
}

/** Zorluk seviyesine göre renk */
export function zorlukRengi(zorluk: number): string {
  const renkler: Record<number, string> = {
    1: '#10b981',
    2: '#06b6d4',
    3: '#f59e0b',
    4: '#f97316',
    5: '#ef4444',
  };
  return renkler[zorluk] ?? '#6366f1';
}

/** YKS sınav etiketleri */
export function sinifEtiketi(sinif: number, tyt?: boolean, ayt?: boolean): string {
  if (tyt) return 'TYT';
  if (ayt) return 'AYT';
  return `${sinif}. Sınıf`;
}
