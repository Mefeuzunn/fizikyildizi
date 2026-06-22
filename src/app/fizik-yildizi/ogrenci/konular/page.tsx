'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { konular } from '@/data/fizik-yildizi/konular';
import FizikNavbar from '@/components/fizik-yildizi/FizikNavbar';

export default function KonularPage() {
  const router = useRouter();
  const [secilenSinif, setSecilenSinif] = useState<number | 'tumu' | 'tyt' | 'ayt'>('tumu');
  const [aramaMetni, setAramaMetni] = useState('');
  const [konuIlerlemeleri, setKonuIlerlemeleri] = useState<Record<string, number>>({});
  const [kullanici, setKullanici] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('fizik_token');
    const kullaniciData = localStorage.getItem('fizik_kullanici');
    if (!token || !kullaniciData) {
      router.push('/fizik-yildizi/giris');
      return;
    }
    const k = JSON.parse(kullaniciData);
    setKullanici(k);
    if (k.sinif) {
      setSecilenSinif(k.sinif === 13 ? 'tumu' : k.sinif);
    }

    const ilerlemeler: Record<string, number> = {};
    konular.forEach((konu) => {
      ilerlemeler[konu.id] = parseInt(localStorage.getItem(`fizik_konu_${konu.id}`) || '0');
    });
    setKonuIlerlemeleri(ilerlemeler);
  }, [router]);

  const allowedGrades = 
    kullanici?.sinif === 9 ? [9] :
    kullanici?.sinif === 10 ? [10] :
    kullanici?.sinif === 11 ? [9, 10, 11] :
    kullanici?.sinif === 12 ? [9, 10, 11, 12] :
    [9, 10, 11, 12];

  const filtrelenmisKonular = konular.filter((konu) => {
    // Sadece izin verilen sınıfların konuları gösterilebilir
    const sinifIzinli = allowedGrades.includes(konu.sinif);
    if (!sinifIzinli) return false;

    let sinifUyar = false;
    if (secilenSinif === 'tumu') {
      sinifUyar = true;
    } else if (secilenSinif === 'tyt') {
      sinifUyar = konu.sinif === 9 || konu.sinif === 10;
    } else if (secilenSinif === 'ayt') {
      sinifUyar = konu.sinif === 11 || konu.sinif === 12;
    } else {
      sinifUyar = konu.sinif === secilenSinif;
    }

    const aramaUyar = konu.baslik.toLowerCase().includes(aramaMetni.toLowerCase()) ||
                      konu.aciklama.toLowerCase().includes(aramaMetni.toLowerCase());
    return sinifUyar && aramaUyar;
  });

  if (!kullanici) return null;

  return (
    <div style={{ background: '#050a1a', minHeight: '100vh', color: '#f8fafc' }}>
      <FizikNavbar />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 1.5rem 4rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.75rem', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            📚 Fizik Konu Kütüphanesi
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Müfredata uygun tüm üniteler, simülasyonlar ve adaptif testler. Çalışmak istediğin konuyu seç ve başla!
          </p>
        </div>

        {/* Filters and Search */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.25rem', borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
          {/* Class Tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {kullanici.sinif === 13 ? (
              ([
                { id: 'tumu', label: 'Tüm Konular' },
                { id: 'tyt', label: 'TYT Konuları (9-10)' },
                { id: 'ayt', label: 'AYT Konuları (11-12)' }
              ] as const).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSecilenSinif(tab.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    transition: 'all 0.2s',
                    background: secilenSinif === tab.id ? 'linear-gradient(135deg, #7c3aed, #06b6d4)' : 'rgba(255,255,255,0.05)',
                    color: secilenSinif === tab.id ? 'white' : '#94a3b8',
                    boxShadow: secilenSinif === tab.id ? '0 4px 15px rgba(124,58,237,0.3)' : 'none',
                  }}
                >
                  {tab.label}
                </button>
              ))
            ) : (
              ([
                { id: 'tumu', label: 'Tüm Sınıflar' },
                { id: 9, label: '9. Sınıf' },
                { id: 10, label: '10. Sınıf' },
                { id: 11, label: '11. Sınıf' },
                { id: 12, label: '12. Sınıf' }
              ] as const)
                .filter((tab) => tab.id === 'tumu' || allowedGrades.includes(Number(tab.id)))
                .map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSecilenSinif(tab.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    transition: 'all 0.2s',
                    background: secilenSinif === tab.id ? 'linear-gradient(135deg, #7c3aed, #06b6d4)' : 'rgba(255,255,255,0.05)',
                    color: secilenSinif === tab.id ? 'white' : '#94a3b8',
                    boxShadow: secilenSinif === tab.id ? '0 4px 15px rgba(124,58,237,0.3)' : 'none',
                  }}
                >
                  {tab.label}
                </button>
              ))
            )}
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            <input
              type="text"
              placeholder="Konu ara..."
              value={aramaMetni}
              onChange={(e) => setAramaMetni(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 1rem 0.6rem 2.5rem',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.04)',
                color: '#f8fafc',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
            <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
          </div>
        </div>

        {/* Topics Grid */}
        {filtrelenmisKonular.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#64748b' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🔍</span>
            <h3>Aradığınız kriterlere uygun konu bulunamadı.</h3>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Arama terimini değiştirmeyi veya farklı bir sınıf seçmeyi deneyin.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {filtrelenmisKonular.map((konu) => {
              const ilerleme = konuIlerlemeleri[konu.id] || 0;
              const tamamlandi = ilerleme >= 100;
              return (
                <div
                  key={konu.id}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: tamamlandi ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '20px',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.borderColor = tamamlandi ? 'rgba(16,185,129,0.5)' : `${konu.renk}80`;
                    e.currentTarget.style.boxShadow = `0 15px 35px rgba(0,0,0,0.3), 0 0 20px ${konu.renk}15`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = tamamlandi ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
                  }}
                >
                  {/* Class badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderRadius: '6px', background: `${konu.renk}20`, border: `1px solid ${konu.renk}40`, color: konu.renk, fontWeight: 700 }}>
                      {kullanici.sinif === 13 ? (
                        (konu.sinif === 9 || konu.sinif === 10) ? `TYT (${konu.sinif}. Sınıf)` : `AYT (${konu.sinif}. Sınıf)`
                      ) : (
                        `${konu.sinif}. Sınıf`
                      )}
                    </span>
                    {tamamlandi && (
                      <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderRadius: '6px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        ✓ Tamamlandı
                      </span>
                    )}
                  </div>

                  {/* Title and Icon */}
                  <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '2rem', flexShrink: 0 }}>{konu.ikon}</span>
                    <div>
                      <h3 style={{ fontWeight: 800, fontSize: '1.15rem', color: '#f8fafc', marginBottom: '0.4rem', lineHeight: 1.3 }}>
                        {konu.baslik}
                      </h3>
                      <p style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.5 }}>
                        {konu.aciklama}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Progress and Button */}
                  <div>
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.35rem', fontWeight: 600 }}>
                        <span>{konu.altKonular.length} Alt Konu</span>
                        <span>{ilerleme}% İlerleme</span>
                      </div>
                      <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${ilerleme}%`, height: '100%', background: `linear-gradient(90deg, ${konu.renk}, #06b6d4)`, borderRadius: '3px' }} />
                      </div>
                    </div>

                    <Link
                      href={`/fizik-yildizi/ogrenci/konu/${konu.id}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '12px',
                        background: tamamlandi ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${tamamlandi ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)'}`,
                        color: tamamlandi ? '#10b981' : '#f8fafc',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        textDecoration: 'none',
                        transition: 'all 0.2s',
                        textAlign: 'center',
                      }}
                    >
                      {ilerleme > 0 ? (tamamlandi ? 'Tekrar Et' : 'Devam Et') : 'Konuya Başla'} →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
