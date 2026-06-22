'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '@/app/fizik-yildizi/fizik.module.css';

export default function VeliDashboardPage() {
  const router = useRouter();
  const [veli, setVeli] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('fizik_token');
    const raw = localStorage.getItem('fizik_kullanici');
    
    if (!token || !raw) { 
      router.push('/fizik-yildizi/giris'); 
      return; 
    }
    const user = JSON.parse(raw);
    if (user.rol !== 'veli') {
      router.push('/fizik-yildizi');
      return;
    }
    setVeli(user);
    fetchData(user.id);
  }, [router]);

  const fetchData = async (id: string) => {
    try {
      const res = await fetch('/api/fizik-yildizi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'veliDashboard', data: { veliId: id } })
      });
      const resData = await res.json();
      if (resData.success) {
        setData(resData.data);
      } else {
        setError(resData.error || 'Veri alınamadı.');
      }
    } catch (err) {
      setError('Bağlantı hatası.');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className={styles.wrapper} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ width: 44, height: 44, border: '3px solid #10b981', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.root} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className={styles.glassCardNohover} style={{ padding: '3rem', textAlign: 'center', maxWidth: 500 }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👨‍👩‍👦</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f43f5e', marginBottom: '1rem' }}>Bağlantı Hatası</h2>
          <p style={{ color: '#a1a1aa', marginBottom: '2rem', lineHeight: 1.6 }}>{error}</p>
          <button className={styles.btnSecondary} onClick={() => router.push('/fizik-yildizi')}>Ana Sayfaya Dön</button>
        </div>
      </div>
    );
  }

  const { ogrenci, istatistikler, sonTestler, odevler } = data;

  return (
    <div className={styles.root} style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Veli Navbar */}
      <nav className={styles.navbar} style={{ position: 'sticky', top: 0, zIndex: 50 }}>
        <div className={styles.navInner}>
          <div className={styles.logo} onClick={() => router.push('/fizik-yildizi')} style={{ cursor: 'pointer' }}>
            <span className={styles.logoStar}>✨</span>
            <span className={styles.logoText}>Fizik Yıldızı <span style={{ fontSize: '0.8rem', color: '#10b981', marginLeft: 8 }}>Veli Takip Paneli</span></span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>Hoş Geldiniz, {veli?.ad}</span>
            <button className={styles.btnNavOutline} onClick={() => {
              localStorage.removeItem('fizik_token');
              localStorage.removeItem('fizik_kullanici');
              router.push('/fizik-yildizi');
            }}>
              Çıkış
            </button>
          </div>
        </div>
      </nav>

      <main className={styles.main} style={{ paddingTop: '2.5rem', maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Student Profile Header */}
        <div className={styles.glassCardNohover} style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{ width: 100, height: 100, borderRadius: '50%', background: ogrenci.avatarRenk || '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 800, color: 'white', border: '4px solid rgba(255,255,255,0.1)' }}>
            {ogrenci.ad[0]}{ogrenci.soyad[0]}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#f4f4f5', marginBottom: '0.5rem' }}>
              {ogrenci.ad} {ogrenci.soyad}
            </h1>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span className={styles.badge} style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}>
                🏆 {ogrenci.lig} Ligi
              </span>
              <span style={{ color: '#a1a1aa', fontSize: '0.9rem', fontWeight: 600 }}>
                ⭐ {ogrenci.toplamXp.toLocaleString()} XP
              </span>
            </div>
          </div>
        </div>

        {/* Analytics Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
          <div className={styles.glassCardNohover} style={{ padding: '1.5rem', borderLeft: '4px solid #6366f1' }}>
            <div style={{ fontSize: '0.8rem', color: '#a1a1aa', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Çözülen Testler</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#6366f1' }}>{istatistikler.cozulenTestSayisi}</div>
          </div>
          <div className={styles.glassCardNohover} style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
            <div style={{ fontSize: '0.8rem', color: '#a1a1aa', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Genel Başarı</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#10b981' }}>%{istatistikler.basariYuzdesi}</div>
          </div>
          <div className={styles.glassCardNohover} style={{ padding: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ fontSize: '0.8rem', color: '#a1a1aa', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Çözülen Soru</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#f59e0b' }}>{istatistikler.toplamSoru}</div>
          </div>
        </div>

        {/* Recent Activity Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          
          {/* Son Testler */}
          <div className={styles.glassCardNohover} style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f4f4f5', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📝 Son Çözülen Testler
            </h3>
            {sonTestler.length === 0 ? (
              <p style={{ color: '#71717a', fontSize: '0.9rem', fontStyle: 'italic' }}>Henüz test çözülmemiş.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {sonTestler.map((t: any) => (
                  <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#e4e4e7', fontSize: '0.95rem', marginBottom: '0.2rem' }}>{t.konuBaslik}</div>
                      <div style={{ fontSize: '0.75rem', color: '#71717a' }}>{new Date(t.tarih).toLocaleDateString('tr-TR')}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, color: t.puan >= 70 ? '#10b981' : t.puan >= 50 ? '#f59e0b' : '#ef4444', fontSize: '1.1rem' }}>{t.puan} Puan</div>
                      <div style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>{t.dogru} Doğru, {t.yanlis} Yanlış</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Atanan Ödevler */}
          <div className={styles.glassCardNohover} style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f4f4f5', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📚 Öğretmenin Verdiği Ödevler
            </h3>
            {odevler.length === 0 ? (
              <p style={{ color: '#71717a', fontSize: '0.9rem', fontStyle: 'italic' }}>Şu an atanmış aktif ödev bulunmuyor.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {odevler.map((o: any) => {
                  const tamamlandi = o.cozuldu > 0;
                  const gecikti = !tamamlandi && new Date() > new Date(o.sonTarih);
                  return (
                    <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', borderLeft: `4px solid ${tamamlandi ? '#10b981' : gecikti ? '#ef4444' : '#6366f1'}` }}>
                      <div>
                        <div style={{ fontWeight: 600, color: '#e4e4e7', fontSize: '0.95rem', marginBottom: '0.2rem' }}>{o.konuAdi} ({o.soruSayisi} Soru)</div>
                        <div style={{ fontSize: '0.75rem', color: gecikti ? '#ef4444' : '#71717a' }}>Son Teslim: {new Date(o.sonTarih).toLocaleDateString('tr-TR')}</div>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '0.3rem 0.6rem', borderRadius: '8px', background: tamamlandi ? 'rgba(16,185,129,0.1)' : gecikti ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.1)', color: tamamlandi ? '#10b981' : gecikti ? '#ef4444' : '#818cf8' }}>
                          {tamamlandi ? '✓ Tamamlandı' : gecikti ? '⚠️ Gecikti' : '⏳ Bekliyor'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </main>
    </div>
  );
}
