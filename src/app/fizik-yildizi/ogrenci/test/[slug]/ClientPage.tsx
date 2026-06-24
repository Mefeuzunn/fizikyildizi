'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { saveTestSonucu, saveTestGecmisi, addXp, addRozet } from '@/lib/fizik-yildizi/db';
import { sorular as GLOBAL_SORULAR } from '@/data/fizik-yildizi/sorular';

// ─── Soru Bankası ────────────────────────────────────────────────────────────
interface Soru {
  id: string; 
  soru: string; 
  secenekler: [string, string, string, string, string]; // 5 options (A, B, C, D, E)
  dogruCevap: number; // 0=A, 1=B, 2=C, 3=D, 4=E
  aciklama: string; 
  ipucu: string;
  konuId: string; 
  konuBaslik: string; 
  zorluk: 1|2|3|4|5; 
  sure: number;
  ilgiliFormul?: string;
}

const SORU_BANKASI: Soru[] = GLOBAL_SORULAR.map(s => {
  const optionsObj = s.secenekler || { A: '', B: '', C: '', D: '' };
  const seceneklerArr: [string, string, string, string, string] = [
    optionsObj.A || '',
    optionsObj.B || '',
    optionsObj.C || '',
    optionsObj.D || '',
    (optionsObj as any).E || 'Seçenek belirtilmemiş'
  ];

  let dogruCevapIdx = 0;
  if (s.dogruCevap === 'A') dogruCevapIdx = 0;
  else if (s.dogruCevap === 'B') dogruCevapIdx = 1;
  else if (s.dogruCevap === 'C') dogruCevapIdx = 2;
  else if (s.dogruCevap === 'D') dogruCevapIdx = 3;
  else if (s.dogruCevap === 'E') dogruCevapIdx = 4;
  else if (s.dogruCevap === 'Doğru') dogruCevapIdx = 0;
  else if (s.dogruCevap === 'Yanlış') dogruCevapIdx = 1;

  const konuBaslik = s.konuId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return {
    id: s.id,
    soru: s.soru,
    secenekler: seceneklerArr,
    dogruCevap: dogruCevapIdx,
    aciklama: s.aciklama || '',
    ipucu: s.ipucu || '',
    konuId: s.konuId,
    konuBaslik,
    zorluk: s.zorluk,
    sure: s.sure || 60,
    ilgiliFormul: s.ilgiliFormul
  };
});

// Konu bazlı soru seçimi
function soruSec(slug: string, ogrenciId: string): Soru[] {
  const tumSorular = slug === 'karisik' ? SORU_BANKASI : SORU_BANKASI.filter(s => s.konuId === slug);
  const soruHavuzu = tumSorular.length > 0 ? tumSorular : SORU_BANKASI;

  // Adaptif seçim: önceki yanlışları al
  const gecmis = JSON.parse(localStorage.getItem('fizik_test_gecmisi') || '{}') as Record<string, Record<string, boolean>>;
  const ogrenciGecmis = gecmis[ogrenciId] || {};

  const zayiflar = soruHavuzu.filter(s => ogrenciGecmis[s.id] === false);
  const digerleri = soruHavuzu.filter(s => !ogrenciGecmis[s.id]);
  const gucluler = soruHavuzu.filter(s => ogrenciGecmis[s.id] === true);

  const karisik: Soru[] = [];
  const shuffle = (arr: Soru[]) => [...arr].sort(() => Math.random() - 0.5);

  karisik.push(...shuffle(zayiflar).slice(0, 6));
  karisik.push(...shuffle(digerleri).slice(0, 3));
  karisik.push(...shuffle(gucluler).slice(0, 1));

  const sonuc = karisik.length >= 10 ? karisik.slice(0, 10) : shuffle(soruHavuzu).slice(0, 10);
  return sonuc.map(s => {
    let soruSuresi = 60; // Orta
    if (s.zorluk <= 2) {
      soruSuresi = 30; // Kolay
    } else if (s.zorluk >= 4) {
      soruSuresi = 90; // Zor
    }
    return { ...s, sure: soruSuresi };
  });
}

type Faz = 'baslangic' | 'soru' | 'feedback' | 'bitis';

export default function TestPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const [faz, setFaz] = useState<Faz>('baslangic');
  const [sorular, setSorular] = useState<Soru[]>([]);
  const [soruIndex, setSoruIndex] = useState(0);
  const [secilenCevap, setSecilenCevap] = useState<number | null>(null);
  const [cevaplar, setCevaplar] = useState<(number | null)[]>([]);
  const [sure, setSure] = useState(90);
  const [toplamSure, setToplamSure] = useState(0);
  const [kullanici, setKullanici] = useState<{ id: string; ad: string } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const globalTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const k = JSON.parse(localStorage.getItem('fizik_kullanici') || 'null');
    setKullanici(k);
  }, []);

  // Format total seconds into MM:SS
  const formatSure = (saniyeler: number) => {
    const dk = Math.floor(saniyeler / 60);
    const sn = saniyeler % 60;
    return `${dk.toString().padStart(2, '0')}:${sn.toString().padStart(2, '0')}`;
  };

  const baslatTimer = useCallback((soruSuresi = 90) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSure(soruSuresi);
    timerRef.current = setInterval(() => {
      setSure(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setFaz('feedback');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // Global test stopwatch timer
  const baslatGlobalTimer = useCallback(() => {
    if (globalTimerRef.current) clearInterval(globalTimerRef.current);
    setToplamSure(0);
    globalTimerRef.current = setInterval(() => {
      setToplamSure(prev => prev + 1);
    }, 1000);
  }, []);

  const durdurTimers = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (globalTimerRef.current) clearInterval(globalTimerRef.current);
  }, []);

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (globalTimerRef.current) clearInterval(globalTimerRef.current);
  }, []);

  const baslat = () => {
    const secilen = soruSec(slug, kullanici?.id || 'misafir');
    setSorular(secilen);
    setCevaplar(new Array(secilen.length).fill(null));
    setSoruIndex(0);
    setFaz('soru');
    const ilkSoruSuresi = secilen[0]?.sure || 90;
    baslatTimer(ilkSoruSuresi);
    baslatGlobalTimer();
  };

  const cevapVer = (idx: number) => {
    if (faz !== 'soru') return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSecilenCevap(idx);
    const yeniCevaplar = [...cevaplar];
    yeniCevaplar[soruIndex] = idx;
    setCevaplar(yeniCevaplar);
    setFaz('feedback');
  };

  const sonrakiSoru = () => {
    if (soruIndex + 1 >= sorular.length) {
      // Test bitti
      durdurTimers();
      kaydet();
      setFaz('bitis');
    } else {
      const sonrakiIdx = soruIndex + 1;
      setSoruIndex(sonrakiIdx);
      setSecilenCevap(null);
      setFaz('soru');
      const sonrakiSoruSuresi = sorular[sonrakiIdx]?.sure || 90;
      baslatTimer(sonrakiSoruSuresi);
    }
  };

  const kaydet = () => {
    if (!kullanici || sorular.length === 0) return;
    const dogru = cevaplar.filter((c, i) => c === sorular[i].dogruCevap).length;
    const puan = Math.round((dogru / sorular.length) * 100);
    const sonuc = {
      id: Date.now().toString(),
      ogrenciId: kullanici.id,
      konuBaslik: slug === 'karisik' ? 'Karışık Test' : sorular[0]?.konuBaslik || slug,
      puan, dogru,
      yanlis: cevaplar.filter((c, i) => c !== null && c !== sorular[i].dogruCevap).length,
      tarih: new Date().toISOString(),
      sure: toplamSure,
    };
    saveTestSonucu(sonuc);

    // Geçmişi güncelle
    sorular.forEach((s, i) => {
      saveTestGecmisi(kullanici.id, s.id, cevaplar[i] === s.dogruCevap);
    });

    // XP Kazandır (Her doğru için 20 XP, test tamamladığı için ekstra 50 XP)
    const kazanilanXp = (dogru * 20) + 50;
    addXp(kullanici.id, kazanilanXp);

    // Başarı Rozetleri Kontrolü
    if (puan === 100) {
      addRozet(kullanici.id, 'kusursuz-test', 'Kusursuz Zihin', '🌟');
    }
    const gecmisTestler = JSON.parse(localStorage.getItem('fizik_test_sonuclari') || '[]');
    if (gecmisTestler.filter((t: any) => t.ogrenciId === kullanici.id).length === 0) {
      addRozet(kullanici.id, 'ilk-test', 'Çırak Fizikçi', '🔰');
    }
  };

  const soru = sorular[soruIndex];
  const dogru = cevaplar.filter((c, i) => sorular[i] && c === sorular[i].dogruCevap).length;
  const puan = sorular.length > 0 ? Math.round((dogru / sorular.length) * 100) : 0;
  const yildizSayisi = puan >= 90 ? 3 : puan >= 70 ? 2 : puan >= 50 ? 1 : 0;

  const S = { // Inline styles
    wrap: { minHeight: '100vh', background: '#050a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' },
    card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, backdropFilter: 'blur(20px)', padding: '2.5rem', maxWidth: 680, width: '100%', margin: '0 auto' },
  };

  if (faz === 'baslangic') return (
    <div className="fy-layout" style={S.wrap}>
      <div style={{ ...S.card, textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
          {slug === 'karisik' ? 'Karışık Test' : slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
        </h1>
        <p style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>10 soru • 5 Şıklı Seçenekler • Her Soruya 90 saniye</p>
        <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '2rem' }}>
          Adaptif soru seçimi ile zayıf noktalarına odaklanacak sorular hazırlandı.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[['🎯','Adaptif','Kişisel sorular'],['⏱️','Süreli','90 sn/soru'],['📊','Analizli','Sonuç detayı']].map(([ico,baslik,ac],i)=>(
            <div key={i} style={{ padding: '1rem', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 12 }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{ico}</div>
              <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.85rem' }}>{baslik}</div>
              <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{ac}</div>
            </div>
          ))}
        </div>
        <button onClick={baslat} className="fy-btn fy-btn-primary fy-btn-lg" style={{ width: '100%' }}>
          🚀 Testi Başlat
        </button>
        <Link href="/fizik-yildizi/ogrenci/dashboard" style={{ display: 'block', color: '#64748b', fontSize: '0.85rem', marginTop: '1rem', textDecoration: 'none' }}>
          ← Geri dön
        </Link>
      </div>
    </div>
  );

  if (faz === 'bitis') return (
    <div className="fy-layout" style={S.wrap}>
      <div style={{ ...S.card, textAlign: 'center', maxWidth: 720 }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{puan >= 70 ? '🎉' : puan >= 50 ? '😊' : '💪'}</div>
        <div style={{ fontSize: '4rem', fontWeight: 900, background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
          {puan}
        </div>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '0.25rem' }}>puan</p>
        <div style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>
          {'⭐'.repeat(yildizSayisi)}{'☆'.repeat(3-yildizSayisi)}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[['✅',dogru,'Doğru','#10b981'],['❌',sorular.length-dogru,'Yanlış','#ef4444'],['📋',sorular.length,'Toplam','#7c3aed'],['⏱️',formatSure(toplamSure),'Toplam Süre','#f59e0b']].map(([ico,val,lbl,renk],i)=>(
            <div key={i} style={{ padding: '1rem', background: `${renk}15`, border: `1px solid ${renk}30`, borderRadius: 12 }}>
              <div style={{ fontSize: '1.25rem' }}>{ico}</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: renk as string, marginTop: '0.25rem' }}>{val}</div>
              <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{lbl}</div>
            </div>
          ))}
        </div>

        {/* Soru Özeti */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '1.25rem', marginBottom: '2rem', textAlign: 'left' }}>
          <h3 style={{ color: '#f8fafc', fontWeight: 700, marginBottom: '0.875rem', fontSize: '0.9rem' }}>Soru Özeti</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {sorular.map((s, i) => {
              const dogru2 = cevaplar[i] === s.dogruCevap;
              return (
                <div key={i} title={s.soru.slice(0,60)}
                  style={{ width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', background: cevaplar[i] === null ? 'rgba(255,255,255,0.06)' : dogru2 ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)', border: `1px solid ${cevaplar[i] === null ? 'rgba(255,255,255,0.1)' : dogru2 ? '#10b981' : '#ef4444'}`, color: cevaplar[i] === null ? '#64748b' : dogru2 ? '#10b981' : '#ef4444' }}>
                  {i+1}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button onClick={() => { setFaz('baslangic'); setSoruIndex(0); setCevaplar([]); }} className="fy-btn fy-btn-secondary" style={{ flex: 1 }}>
            🔄 Tekrar Çöz
          </button>
          <Link href="/fizik-yildizi/ogrenci/analiz" className="fy-btn fy-btn-primary" style={{ flex: 1 }}>
            📊 Analiz Görüntüle
          </Link>
          <Link href="/fizik-yildizi/ogrenci/dashboard" className="fy-btn fy-btn-secondary" style={{ flex: 1 }}>
            🏠 Dashboard
          </Link>
        </div>
      </div>
    </div>
  );

  if (!soru) return null;

  return (
    <div className="fy-layout" style={{ minHeight: '100vh', background: '#050a1a', padding: '2rem' }}>
      {/* Top bar */}
      <div style={{ maxWidth: 680, margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link href="/fizik-yildizi/ogrenci/dashboard" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.85rem' }}>← Çık</Link>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.8rem', color: '#64748b' }}>
            <span>Soru {soruIndex + 1}/{sorular.length}</span>
            <span style={{ display: 'flex', gap: '1rem' }}>
              <span style={{ color: '#06b6d4', fontWeight: 600 }}>⏱ Test Süresi: {formatSure(toplamSure)}</span>
              <span style={{ color: sure <= 15 ? '#ef4444' : '#64748b' }}>⏱ Soru Süresi: {sure}s</span>
            </span>
          </div>
          <div className="fy-progress">
            <div className="fy-progress-bar" style={{ width: `${((soruIndex) / sorular.length) * 100}%` }} />
          </div>
        </div>
        <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>{dogru} ✓</div>
      </div>

      {/* Soru Kartı */}
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '2rem', marginBottom: '1rem', backdropFilter: 'blur(20px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className={`fy-badge ${soru.zorluk <= 2 ? 'fy-badge-success' : soru.zorluk === 3 ? 'fy-badge-warning' : 'fy-badge-danger'}`}>
                {soru.zorluk <= 2 ? 'Kolay' : soru.zorluk === 3 ? 'Orta' : 'Zor'}
              </span>
              <span className="fy-badge fy-badge-primary">{soru.konuBaslik}</span>
            </div>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('astro_ask', { detail: `Şu soruda takıldım: "${soru.soru}". Lütfen bana doğrudan cevabı söyleme, sadece nasıl çözmem gerektiğine dair ipucu ver.` }))}
              style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(124,58,237,0.2))', border: '1px solid rgba(99,102,241,0.4)', borderRadius: 20, padding: '0.4rem 0.8rem', color: '#a5b4fc', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(124,58,237,0.4))'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(124,58,237,0.2))'; }}
            >
              ✨ AstroTutor'a Sor
            </button>
          </div>
          <p style={{ color: '#f8fafc', fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.7, marginBottom: '1.5rem' }}>
            {soru.soru}
          </p>

          {/* Cevap Seçenekleri */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {soru.secenekler.map((secenek, i) => {
              let extra = {};
              if (faz === 'feedback') {
                if (i === soru.dogruCevap) extra = { borderColor: '#10b981', background: 'rgba(16,185,129,0.15)', color: '#6ee7b7' };
                else if (i === secilenCevap) extra = { borderColor: '#ef4444', background: 'rgba(239,68,68,0.15)', color: '#fca5a5' };
              } else if (i === secilenCevap) {
                extra = { borderColor: '#7c3aed', background: 'rgba(124,58,237,0.15)' };
              }
              return (
                <button key={i} onClick={() => cevapVer(i)} disabled={faz === 'feedback'}
                  style={{ width: '100%', padding: '1rem 1.25rem', background: 'rgba(255,255,255,0.04)', border: '2px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#cbd5e1', fontSize: '0.95rem', fontWeight: 500, cursor: faz === 'feedback' ? 'default' : 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.75rem', transition: 'all 0.2s', fontFamily: 'inherit', ...extra }}>
                  <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800, flexShrink: 0, color: '#94a3b8' }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {secenek}
                  {faz === 'feedback' && i === soru.dogruCevap && <span style={{ marginLeft: 'auto' }}>✅</span>}
                  {faz === 'feedback' && i === secilenCevap && i !== soru.dogruCevap && <span style={{ marginLeft: 'auto' }}>❌</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback */}
        {faz === 'feedback' && (
          <div style={{ background: secilenCevap === soru.dogruCevap ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.08)', border: `1px solid ${secilenCevap === soru.dogruCevap ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: 16, padding: '1.25rem', marginBottom: '1rem' }}>
            <p style={{ fontWeight: 700, color: secilenCevap === soru.dogruCevap ? '#6ee7b7' : '#fca5a5', marginBottom: '0.5rem' }}>
              {secilenCevap === soru.dogruCevap ? '✅ Doğru!' : '❌ Yanlış!'}
            </p>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>{soru.aciklama}</p>
            {soru.ilgiliFormul && (
              <div className="fy-formula" style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>
                📐 {soru.ilgiliFormul}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {faz === 'feedback' && (
          <button onClick={sonrakiSoru} className="fy-btn fy-btn-primary" style={{ width: '100%' }}>
            {soruIndex + 1 >= sorular.length ? '📊 Sonuçları Gör' : 'Sonraki Soru →'}
          </button>
        )}
      </div>
    </div>
  );
}


