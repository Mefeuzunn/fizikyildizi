'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/app/fizik-yildizi/fizik.module.css';

export default function OdevVerPage() {
  const router = useRouter();
  const [ogretmen, setOgretmen] = useState<any>(null);
  
  const [sinif, setSinif] = useState('9');
  const [konuBaslik, setKonuBaslik] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [soruSayisi, setSoruSayisi] = useState(10);
  const [sure, setSure] = useState(15);
  const [sonTarih, setSonTarih] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('fizik_token');
    const raw = localStorage.getItem('fizik_kullanici');
    if (!token || !raw) { router.push('/fizik-yildizi/giris'); return; }

    try {
      const u = JSON.parse(raw);
      if (u.rol !== 'ogretmen') { router.push('/fizik-yildizi/ogrenci/dashboard'); return; }
      setOgretmen(u);
    } catch {
      router.push('/fizik-yildizi/giris');
    }
  }, [router]);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleGonder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ogretmen || !konuBaslik || !sonTarih) {
      showToast('error', 'Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    setLoading(true);
    const odev = {
      id: Date.now().toString(),
      ogretmenId: ogretmen.id,
      sinif: parseInt(sinif),
      konuId: 'odev-' + Date.now(),
      konuBaslik,
      aciklama,
      soruSayisi,
      sure,
      tarih: new Date().toISOString(),
      sonTarih: new Date(sonTarih).toISOString(),
    };

    try {
      const res = await fetch('/api/fizik-yildizi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'saveOdev', data: odev })
      });
      const data = await res.json();
      if (data.success || data.message) {
        showToast('success', 'Ödev başarıyla sınıfa gönderildi!');
        setKonuBaslik('');
        setAciklama('');
      } else {
        showToast('error', 'Ödev gönderilemedi.');
      }
    } catch (err) {
      showToast('error', 'Bağlantı hatası.');
    }
    setLoading(false);
  };

  if (!ogretmen) return null;

  return (
    <div className={styles.root}>
      {/* Simple Navbar for Teacher */}
      <nav className={styles.navbar} style={{ position: 'relative' }}>
        <div className={styles.navInner}>
          <div className={styles.logo} onClick={() => router.push('/fizik-yildizi/ogretmen/dashboard')} style={{ cursor: 'pointer' }}>
            <span className={styles.logoStar}>✨</span>
            <span className={styles.logoText}>Fizik Yıldızı <span style={{ fontSize: '0.8rem', color: '#6366f1', marginLeft: 8 }}>Öğretmen Paneli</span></span>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className={styles.btnNavOutline} onClick={() => router.push('/fizik-yildizi/ogretmen/dashboard')}>
              Dashboard'a Dön
            </button>
          </div>
        </div>
      </nav>

      <main className={styles.main} style={{ paddingTop: '3rem' }}>
        {toast && (
          <div style={{
            position: 'fixed', top: '2rem', right: '2rem', zIndex: 1000,
            background: toast.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)',
            border: `1px solid ${toast.type === 'success' ? '#10b981' : '#f43f5e'}`,
            padding: '1rem', borderRadius: 8, color: toast.type === 'success' ? '#6ee7b7' : '#fda4af',
            animation: 'fadeInUp 0.3s ease'
          }}>
            {toast.msg}
          </div>
        )}

        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 className={styles.gradientText} style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              📚 Yeni Ödev Gönder
            </h1>
            <p style={{ color: '#94a3b8' }}>
              Öğrencilerinize otomatik değerlendirilen parametrik testler atayın.
            </p>
          </div>

          <div className={styles.glassCardNohover} style={{ padding: '2rem' }}>
            <form onSubmit={handleGonder} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div>
                <label className={styles.label}>Hedef Sınıf</label>
                <select className={styles.inputField} value={sinif} onChange={e => setSinif(e.target.value)}>
                  <option value="9">9. Sınıf</option>
                  <option value="10">10. Sınıf</option>
                  <option value="11">11. Sınıf</option>
                  <option value="12">12. Sınıf</option>
                </select>
              </div>

              <div>
                <label className={styles.label}>Ödev Başlığı (Konu)</label>
                <input 
                  type="text" className={styles.inputField} required
                  placeholder="Örn: Newton'un Hareket Kanunları Karma Test"
                  value={konuBaslik} onChange={e => setKonuBaslik(e.target.value)}
                />
              </div>

              <div>
                <label className={styles.label}>Öğrencilere Not (Opsiyonel)</label>
                <textarea 
                  className={styles.inputField} style={{ minHeight: 80, resize: 'vertical' }}
                  placeholder="Çözerken formüllere dikkat edin..."
                  value={aciklama} onChange={e => setAciklama(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label className={styles.label}>Soru Sayısı</label>
                  <input 
                    type="number" min="5" max="50" className={styles.inputField} required
                    value={soruSayisi} onChange={e => setSoruSayisi(parseInt(e.target.value))}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className={styles.label}>Süre (Dakika)</label>
                  <input 
                    type="number" min="5" max="120" className={styles.inputField} required
                    value={sure} onChange={e => setSure(parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <label className={styles.label}>Son Teslim Tarihi</label>
                <input 
                  type="datetime-local" className={styles.inputField} required
                  value={sonTarih} onChange={e => setSonTarih(e.target.value)}
                />
              </div>

              <button type="submit" disabled={loading} className={styles.btnPrimary} style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                {loading ? 'Gönderiliyor...' : '🚀 Sınıfa Ödev Ata'}
              </button>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
