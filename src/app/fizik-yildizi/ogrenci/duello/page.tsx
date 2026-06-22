'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FizikNavbar from '@/components/fizik-yildizi/FizikNavbar';
import styles from '@/app/fizik-yildizi/fizik.module.css';
import AIDuel from './AIDuel';
import RealDuel from './RealDuel';

interface DuelHistory {
  id: string;
  tarih: string;
  rakipAd: string;
  rakipAvatarRenk: string;
  skorCis: string;
  durum: 'galibiyet' | 'beraberlik' | 'maglubiyet';
  xpReward: number;
}

export default function DuelloPage() {
  const router = useRouter();
  const [kullanici, setKullanici] = useState<any>(null);
  const [mode, setMode] = useState<'select' | 'real' | 'ai'>('select');
  const [history, setHistory] = useState<DuelHistory[]>([]);

  useEffect(() => {
    const kData = localStorage.getItem('fizik_kullanici');
    if (!kData) {
      router.push('/fizik-yildizi/giris');
      return;
    }
    setKullanici(JSON.parse(kData));
    
    // Load history
    const storedHistory = JSON.parse(localStorage.getItem('fizik_duello_gecmisi') || '[]') as DuelHistory[];
    setHistory(storedHistory);
  }, [router]);

  if (!kullanici) return null;

  if (mode === 'ai') {
    return (
      <div style={{ background: '#09090b', minHeight: '100vh', color: '#f4f4f5', fontFamily: "'Inter', sans-serif" }}>
        <FizikNavbar />
        <AIDuel onExit={() => setMode('select')} />
      </div>
    );
  }

  if (mode === 'real') {
    return (
      <div style={{ background: '#09090b', minHeight: '100vh', color: '#f4f4f5', fontFamily: "'Inter', sans-serif" }}>
        <FizikNavbar />
        <RealDuel onExit={() => setMode('select')} onAutoBot={() => setMode('ai')} />
      </div>
    );
  }

  // Calculate stats
  const totalPlayed = history.length;
  const wins = history.filter(h => h.durum === 'galibiyet').length;
  const winRate = totalPlayed > 0 ? Math.round((wins / totalPlayed) * 100) : 0;

  const xp = kullanici.toplamXp || 0;
  const lig = kullanici.lig || 'Bronz';
  const getXpBound = (l: string) => {
    if (l === 'Bronz') return { min: 0, max: 500 };
    if (l === 'Gümüş') return { min: 500, max: 2000 };
    if (l === 'Altın') return { min: 2000, max: 5000 };
    if (l === 'Platin') return { min: 5000, max: 10000 };
    return { min: 10000, max: 20000 };
  };
  const bounds = getXpBound(lig);
  const progressPercent = Math.min(100, Math.round(((xp - bounds.min) / (bounds.max - bounds.min)) * 100));

  const getOutcomeText = (durum: 'galibiyet' | 'beraberlik' | 'maglubiyet') => {
    if (durum === 'galibiyet') return { text: 'ZAFER!', color: '#10b981', emoji: '🏆' };
    if (durum === 'beraberlik') return { text: 'BERABERLİK', color: '#f59e0b', emoji: '🤝' };
    return { text: 'MAĞLUBİYET', color: '#f43f5e', emoji: '💀' };
  };

  return (
    <div style={{ background: '#09090b', minHeight: '100vh', color: '#f4f4f5', fontFamily: "'Inter', sans-serif" }}>
      <FizikNavbar />

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '6rem 1.5rem 4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', background: 'linear-gradient(135deg, #6366f1, #f43f5e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ⚔️ Bilgi Düellosu
          </h1>
          <p style={{ color: '#a1a1aa', fontSize: '0.95rem' }}>
            Oyun modunu seç ve rakiplerinle kapışmaya başla!
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'start', marginBottom: '3rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className={styles.glassCardNohover} style={{ padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', flexShrink: 0, boxShadow: '0 8px 24px rgba(99,102,241,0.25)'
              }}>🏆</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div>
                    <span className={styles.ligBadge} style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem' }}>{lig} Ligi</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#a1a1aa', fontWeight: 700 }}>
                    {xp} / {bounds.max} XP
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#27272a', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #a855f7)', borderRadius: '4px', transition: 'width 0.4s' }} />
                </div>
              </div>
            </div>

            <div className={styles.glassCardNohover} style={{ padding: '2.5rem', textAlign: 'center', border: '1px solid rgba(99,102,241,0.25)', background: 'linear-gradient(180deg, rgba(99,102,241,0.02) 0%, transparent 100%)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌍</div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem' }}>Gerçek Oyuncularla Düello</h2>
              <p style={{ color: '#a1a1aa', fontSize: '0.85rem', maxWidth: '400px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
                Sınıf arkadaşlarınla gerçek zamanlı kapış! Kazanırsan tam XP!
              </p>
              <button
                onClick={() => setMode('real')}
                className={styles.btnPrimary}
                style={{
                  padding: '1rem 2.5rem', fontSize: '1.1rem', fontWeight: 800,
                  borderRadius: '14px', cursor: 'pointer', width: '100%',
                  boxShadow: '0 10px 30px rgba(99,102,241,0.4)',
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)'
                }}
              >
                🎮 Gerçek Oyuncu ile Dereceli Düello
              </button>

              <div style={{ margin: '1.5rem 0', height: '1px', background: 'rgba(255,255,255,0.1)' }} />

              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🤖</div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem' }}>AI Antrenman</h2>
              <p style={{ color: '#a1a1aa', fontSize: '0.85rem', maxWidth: '400px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
                Sanal rakiplerle pratik yap. 
              </p>
              <button
                onClick={() => setMode('ai')}
                className={styles.btnSecondary}
                style={{
                  padding: '1rem 2.5rem', fontSize: '1.1rem', fontWeight: 800,
                  borderRadius: '14px', cursor: 'pointer', width: '100%',
                }}
              >
                🤖 Yapay Zeka ile Antrenman
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className={styles.glassCardNohover} style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Düello Karnesi</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ background: '#111113', border: '1px solid #27272a', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#6366f1' }}>{totalPlayed}</div>
                  <div style={{ fontSize: '0.72rem', color: '#71717a', marginTop: '0.25rem' }}>Toplam Düello</div>
                </div>
                <div style={{ background: '#111113', border: '1px solid #27272a', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#10b981' }}>%{winRate}</div>
                  <div style={{ fontSize: '0.72rem', color: '#71717a', marginTop: '0.25rem' }}>Kazanma Oranı</div>
                </div>
              </div>
            </div>

            <div className={styles.glassCardNohover} style={{ padding: '1.5rem', display: 'flex', flex: 1, flexDirection: 'column' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '1rem' }}>Son Karşılaşmalar</h3>
              
              {history.length === 0 ? (
                <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', padding: '2rem', color: '#52525b', fontSize: '0.85rem' }}>
                  Henüz düello yapmadın.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {history.map(h => {
                    const outcome = getOutcomeText(h.durum);
                    return (
                      <div key={h.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#111113', border: '1px solid #27272a', borderRadius: '10px', padding: '0.75rem 0.875rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                          <div style={{
                            width: '28px', height: '28px', borderRadius: '50%',
                            background: h.rakipAvatarRenk || '#6366f1',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.75rem', fontWeight: 800
                          }}>
                            {h.rakipAd[0]}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{h.rakipAd}</div>
                            <span style={{ fontSize: '0.7rem', color: outcome.color, fontWeight: 700 }}>{outcome.emoji} {outcome.text}</span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, fontFamily: 'monospace' }}>{h.skorCis}</div>
                          <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>+{h.xpReward} XP</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
