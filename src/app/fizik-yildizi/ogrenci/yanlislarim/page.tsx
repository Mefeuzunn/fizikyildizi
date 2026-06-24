'use client';
import { apiFetch } from '@/lib/fizik-yildizi/apiFetch';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FizikNavbar from '@/components/fizik-yildizi/FizikNavbar';
import styles from '@/app/fizik-yildizi/fizik.module.css';

interface Soru {
  id: string;
  konuId: string;
  altKonuId: string;
  tip: string;
  soru: string;
  secenekler?: { A: string; B: string; C: string; D: string };
  dogruCevap: string;
  aciklama: string;
  ipucu: string;
}

export default function YanlislarimPage() {
  const router = useRouter();
  const [kullanici, setKullanici] = useState<any>(null);
  const [sorular, setSorular] = useState<Soru[]>([]);
  const [loading, setLoading] = useState(true);
  const [acikCozumler, setAcikCozumler] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const kData = localStorage.getItem('fizik_kullanici');
    if (!kData) {
      router.push('/fizik-yildizi/giris');
      return;
    }
    const k = JSON.parse(kData);
    if (k.rol !== 'ogrenci') {
      router.push('/fizik-yildizi/ogretmen/dashboard');
      return;
    }
    setKullanici(k);

    const fetchYanlislar = async () => {
      try {
        const res = await apiFetch('/api/fizik-yildizi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'getYanlisSorular', data: { ogrenciId: k.id } })
        });
        const data = await res.json();
        if (data.success) {
          setSorular(data.sorular);
        }
      } catch (e) {
        console.error('Yanlış sorular çekilemedi:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchYanlislar();
  }, [router]);

  const toggleCozum = (id: string) => {
    setAcikCozumler(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!kullanici) return null;

  return (
    <div className={styles.root}>
      <FizikNavbar />

      <main className={styles.main}>
        <div style={{ maxWidth: 800, margin: '0 auto', width: '100%' }}>
          
          <div style={{ marginBottom: '2rem' }}>
            <h1 className={styles.sectionTitle}>
              <span style={{ fontSize: '2rem', marginRight: '0.5rem' }}>❌</span>
              Yanlışlarım
            </h1>
            <p className={styles.sectionSubtitle}>
              Önceki testlerde hatalı cevapladığın sorular burada birikir. Hatalarından öğrenmek başarının en büyük anahtarıdır!
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Yükleniyor...</div>
          ) : sorular.length === 0 ? (
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '16px',
              padding: '3rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
              <h3 style={{ color: '#f8fafc', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Harika İş!</h3>
              <p style={{ color: '#a1a1aa' }}>Şu an kayıtlı hiçbir yanlışın bulunmuyor. Böyle devam et!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {sorular.map((s, idx) => (
                <div key={`${s.id}-${idx}`} style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ color: '#6366f1', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Konu: {s.konuId.replace('-9', '').replace('-10', '').replace('-11', '').replace('-12', '').toUpperCase()}
                    </span>
                    <span style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, background: 'rgba(239, 68, 68, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
                      Yanlış Cevaplandı
                    </span>
                  </div>

                  <p style={{ color: '#f8fafc', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    {s.soru}
                  </p>

                  {s.secenekler && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                      {Object.entries(s.secenekler).map(([key, value]) => (
                        <div key={key} style={{
                          padding: '0.75rem 1rem',
                          background: 'rgba(0,0,0,0.2)',
                          borderRadius: '8px',
                          color: '#cbd5e1',
                          border: key === s.dogruCevap && acikCozumler[s.id] ? '1px solid #10b981' : '1px solid transparent',
                          display: 'flex',
                          gap: '0.5rem'
                        }}>
                          <span style={{ color: key === s.dogruCevap && acikCozumler[s.id] ? '#10b981' : '#64748b', fontWeight: 700 }}>{key})</span>
                          <span>{value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem', marginTop: '1rem' }}>
                    <button
                      onClick={() => toggleCozum(s.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#6366f1',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0'
                      }}
                    >
                      {acikCozumler[s.id] ? 'Çözümü Gizle ⬆️' : 'Çözümü Göster ⬇️'}
                    </button>

                    {acikCozumler[s.id] && (
                      <div style={{
                        marginTop: '1rem',
                        padding: '1.25rem',
                        background: 'rgba(16, 185, 129, 0.05)',
                        borderLeft: '4px solid #10b981',
                        borderRadius: '0 12px 12px 0',
                        color: '#e2e8f0',
                        lineHeight: 1.6,
                        whiteSpace: 'pre-wrap'
                      }}>
                        <div style={{ color: '#10b981', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                          Doğru Cevap: {s.dogruCevap}
                        </div>
                        {s.aciklama}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
