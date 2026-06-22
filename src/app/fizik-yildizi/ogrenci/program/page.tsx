'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FizikNavbar from '@/components/fizik-yildizi/FizikNavbar';
import styles from '../../fizik.module.css';
import { sorular } from '@/data/fizik-yildizi/sorular';

interface Gorev {
  id: string;
  tip: 'konu_tekrar' | 'soru_cozumu' | 'deneme';
  baslik: string;
  detay: string;
  durum: 'bekliyor' | 'yapiliyor' | 'tamamlandi';
  xp: number;
}

interface GunProgrami {
  gun: string;
  tarih: string;
  gorevler: Gorev[];
}

const GUNLER = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

export default function AkilliProgramPage() {
  const router = useRouter();
  const [kullanici, setKullanici] = useState<any>(null);
  const [hafta, setHafta] = useState<GunProgrami[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('fizik_token');
    const raw = localStorage.getItem('fizik_kullanici');
    if (!token || !raw) {
      router.push('/fizik-yildizi/giris');
      return;
    }
    const k = JSON.parse(raw);
    setKullanici(k);

    const savedProgram = localStorage.getItem(`fizik_program_${k.id}`);
    if (savedProgram) {
      setHafta(JSON.parse(savedProgram));
      setYukleniyor(false);
    } else {
      generateSmartProgram(k.id);
    }
  }, [router]);

  const generateSmartProgram = (ogrenciId: string) => {
    // 1. Zayıf kazanımları bul
    const gecmisStr = localStorage.getItem('fizik_test_gecmisi') || '{}';
    const testGecmisi = JSON.parse(gecmisStr)[ogrenciId] || {};
    
    const kazanimMap: Record<string, { toplam: number; dogru: number; konu: string }> = {};
    Object.keys(testGecmisi).forEach(qId => {
      const q = sorular.find(s => s.id === qId || s.id === qId.split('-v')[0]);
      if (q) {
        if (!kazanimMap[q.kazanim]) kazanimMap[q.kazanim] = { toplam: 0, dogru: 0, konu: q.konuBaslik };
        kazanimMap[q.kazanim].toplam++;
        if (testGecmisi[qId]) kazanimMap[q.kazanim].dogru++;
      }
    });

    const zayifKonular = Object.entries(kazanimMap)
      .map(([k, v]) => ({ kazanim: k, yuzde: (v.dogru / v.toplam) * 100, konu: v.konu }))
      .filter(x => x.yuzde < 70)
      .sort((a, b) => a.yuzde - b.yuzde);

    const ornekKonular = zayifKonular.map(k => k.konu);
    const fallbacks = ['Newton Yasaları', 'Elektrik Devreleri', 'Dalgalar', 'Optik', 'Enerji'];
    
    const konularListesi = Array.from(new Set([...ornekKonular, ...fallbacks]));

    // 2. Günleri oluştur
    const simdi = new Date();
    const gunIndex = simdi.getDay() === 0 ? 6 : simdi.getDay() - 1; // 0: Pzt, 6: Pzr
    
    const yeniHafta: GunProgrami[] = [];
    
    for (let i = 0; i < 7; i++) {
      const g = new Date(simdi);
      g.setDate(simdi.getDate() - gunIndex + i);
      
      const gorevler: Gorev[] = [];
      const konu = konularListesi[i % konularListesi.length];

      if (i < 5) { // Hafta içi
        gorevler.push({
          id: `g_${i}_1`,
          tip: 'konu_tekrar',
          baslik: `${konu} Konu Anlatımı`,
          detay: 'Eksiklerin tespit edildi. Bu konu üzerinden hızlı bir tekrar yapmalısın.',
          durum: 'bekliyor',
          xp: 20
        });
        gorevler.push({
          id: `g_${i}_2`,
          tip: 'soru_cozumu',
          baslik: `${konu} - 15 Soru`,
          detay: 'Konu anlatımını pekiştirmek için test çöz.',
          durum: 'bekliyor',
          xp: 30
        });
      } else { // Hafta sonu
        gorevler.push({
          id: `g_${i}_1`,
          tip: 'deneme',
          baslik: i === 5 ? 'TYT Fizik Denemesi' : 'AYT Fizik Denemesi',
          detay: 'Genel tekrar ve zaman yönetimi için.',
          durum: 'bekliyor',
          xp: 100
        });
      }

      yeniHafta.push({
        gun: GUNLER[i],
        tarih: g.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
        gorevler
      });
    }

    setHafta(yeniHafta);
    localStorage.setItem(`fizik_program_${ogrenciId}`, JSON.stringify(yeniHafta));
    setYukleniyor(false);
  };

  const updateGorevDurumu = (gunIndex: number, gorevId: string, yeniDurum: 'bekliyor' | 'yapiliyor' | 'tamamlandi') => {
    const yeniHafta = [...hafta];
    const gorevIndex = yeniHafta[gunIndex].gorevler.findIndex(g => g.id === gorevId);
    if (gorevIndex !== -1) {
      const oncekiDurum = yeniHafta[gunIndex].gorevler[gorevIndex].durum;
      yeniHafta[gunIndex].gorevler[gorevIndex].durum = yeniDurum;
      setHafta(yeniHafta);
      localStorage.setItem(`fizik_program_${kullanici.id}`, JSON.stringify(yeniHafta));

      // XP kazanımı
      if (oncekiDurum !== 'tamamlandi' && yeniDurum === 'tamamlandi') {
        const xp = yeniHafta[gunIndex].gorevler[gorevIndex].xp;
        fetch('/api/fizik-yildizi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'addXp', data: { ogrenciId: kullanici.id, xp } })
        }).catch(e => console.error(e));
      }
    }
  };

  const getTipRenk = (tip: string) => {
    switch (tip) {
      case 'konu_tekrar': return '#3b82f6';
      case 'soru_cozumu': return '#10b981';
      case 'deneme': return '#8b5cf6';
      default: return '#64748b';
    }
  };

  const getTipIkon = (tip: string) => {
    switch (tip) {
      case 'konu_tekrar': return '📖';
      case 'soru_cozumu': return '📝';
      case 'deneme': return '⏳';
      default: return '📌';
    }
  };

  if (yukleniyor) {
    return (
      <div className={styles.wrapper} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ width: 44, height: 44, border: '3px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Kanban view logic
  const columnStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '16px',
    padding: '1.5rem',
    minHeight: '600px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  };

  return (
    <div className={styles.root} style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      <FizikNavbar />

      <main className={styles.main} style={{ paddingTop: '2.5rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.5rem', background: 'linear-gradient(135deg, #3b82f6, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              📅 Akıllı Çalışma Programım
            </h1>
            <p style={{ color: '#a1a1aa', fontSize: '0.95rem' }}>
              Test analizlerindeki eksiklerine göre yapay zeka destekli olarak üretilmiştir. Görevleri sürükleyip bırakarak durumlarını güncelleyebilirsin.
            </p>
          </div>
          <button 
            onClick={() => { setYukleniyor(true); setTimeout(() => generateSmartProgram(kullanici.id), 500); }}
            className={styles.btnSecondary}
            style={{ fontSize: '0.85rem' }}
          >
            🔄 Programı Yeniden Oluştur
          </button>
        </div>

        {/* Weekly Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1.5rem', scrollbarWidth: 'none' }}>
          {hafta.map((g, i) => {
            const isToday = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }) === g.tarih;
            return (
              <div 
                key={i} 
                style={{ 
                  flex: '0 0 auto', 
                  padding: '1rem 1.5rem', 
                  background: isToday ? 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(16,185,129,0.15))' : 'rgba(255,255,255,0.03)', 
                  border: `1px solid ${isToday ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.08)'}`, 
                  borderRadius: '12px',
                  textAlign: 'center',
                  minWidth: '140px'
                }}
              >
                <div style={{ fontSize: '0.85rem', color: isToday ? '#60a5fa' : '#a1a1aa', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.2rem' }}>{g.gun}</div>
                <div style={{ fontSize: '1.1rem', color: '#f8fafc', fontWeight: 600 }}>{g.tarih}</div>
                {isToday && <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', background: '#3b82f6', color: 'white', padding: '0.15rem 0.5rem', borderRadius: '10px', display: 'inline-block' }}>Bugün</div>}
              </div>
            );
          })}
        </div>

        {/* Kanban Board */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          
          {/* Column: Bekleyenler */}
          <div style={columnStyle}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f4f4f5', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#64748b' }}></span> Yapılacaklar
            </h3>
            {hafta.map((g, gunIndex) => (
              g.gorevler.filter(x => x.durum === 'bekliyor').map(gorev => (
                <GorevCard key={gorev.id} gorev={gorev} gunAd={g.gun} onUpdate={(durum) => updateGorevDurumu(gunIndex, gorev.id, durum as any)} />
              ))
            ))}
          </div>

          {/* Column: Yapılıyor */}
          <div style={columnStyle}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f4f4f5', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 10px rgba(245,158,11,0.5)' }}></span> Devam Edenler
            </h3>
            {hafta.map((g, gunIndex) => (
              g.gorevler.filter(x => x.durum === 'yapiliyor').map(gorev => (
                <GorevCard key={gorev.id} gorev={gorev} gunAd={g.gun} onUpdate={(durum) => updateGorevDurumu(gunIndex, gorev.id, durum as any)} />
              ))
            ))}
          </div>

          {/* Column: Tamamlandı */}
          <div style={columnStyle}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f4f4f5', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px rgba(16,185,129,0.5)' }}></span> Tamamlananlar
            </h3>
            {hafta.map((g, gunIndex) => (
              g.gorevler.filter(x => x.durum === 'tamamlandi').map(gorev => (
                <GorevCard key={gorev.id} gorev={gorev} gunAd={g.gun} onUpdate={(durum) => updateGorevDurumu(gunIndex, gorev.id, durum as any)} />
              ))
            ))}
          </div>

        </div>

      </main>

      <style>{`
        /* Minimalist scrollbar for kanban */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );

  function GorevCard({ gorev, gunAd, onUpdate }: { gorev: Gorev, gunAd: string, onUpdate: (d: string) => void }) {
    const tipRenk = getTipRenk(gorev.tip);
    const tipIkon = getTipIkon(gorev.tip);

    return (
      <div 
        style={{ 
          background: 'rgba(24,24,27,0.8)', 
          border: `1px solid ${gorev.durum === 'tamamlandi' ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)'}`, 
          borderRadius: '12px', 
          padding: '1.25rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          transition: 'all 0.2s',
          borderLeft: `4px solid ${tipRenk}`,
          opacity: gorev.durum === 'tamamlandi' ? 0.6 : 1
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: tipRenk, background: `${tipRenk}20`, padding: '0.2rem 0.5rem', borderRadius: '6px', textTransform: 'uppercase' }}>
            {tipIkon} {gorev.tip.replace('_', ' ')}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#a1a1aa', fontWeight: 600 }}>{gunAd}</span>
        </div>
        <h4 style={{ color: '#f8fafc', fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem', lineHeight: 1.4, textDecoration: gorev.durum === 'tamamlandi' ? 'line-through' : 'none' }}>
          {gorev.baslik}
        </h4>
        <p style={{ color: '#a1a1aa', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '1rem' }}>
          {gorev.detay}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            ⭐ +{gorev.xp} XP
          </span>
          <select 
            value={gorev.durum}
            onChange={(e) => onUpdate(e.target.value)}
            style={{ 
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#f8fafc', borderRadius: '6px', padding: '0.3rem 0.5rem', fontSize: '0.8rem', outline: 'none', cursor: 'pointer'
            }}
          >
            <option value="bekliyor" style={{ color: 'black' }}>⏳ Yapılacak</option>
            <option value="yapiliyor" style={{ color: 'black' }}>🔄 Devam Ediyor</option>
            <option value="tamamlandi" style={{ color: 'black' }}>✅ Tamamlandı</option>
          </select>
        </div>
      </div>
    );
  }
}
