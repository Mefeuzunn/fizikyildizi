'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FizikNavbar from '@/components/fizik-yildizi/FizikNavbar';
import styles from '../../fizik.module.css';

const AVATAR_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', 
  '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e'
];

export default function AyarlarPage() {
  const router = useRouter();
  const [kullanici, setKullanici] = useState<any>(null);
  
  // Settings State
  const [avatarRenk, setAvatarRenk] = useState('#6366f1');
  const [bildirimler, setBildirimler] = useState(true);

  const [duelloIstek, setDuelloIstek] = useState(true);
  
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [mesaj, setMesaj] = useState({ text: '', type: '' });

  useEffect(() => {
    const raw = localStorage.getItem('fizik_kullanici');
    if (!raw) {
      router.push('/fizik-yildizi/giris');
      return;
    }
    const user = JSON.parse(raw);
    setKullanici(user);
    setAvatarRenk(user.avatarRenk || '#6366f1');
    
    // Load local settings if any
    const settings = JSON.parse(localStorage.getItem(`fizik_ayarlar_${user.id}`) || '{}');
    if (settings.bildirimler !== undefined) setBildirimler(settings.bildirimler);

    if (settings.duelloIstek !== undefined) setDuelloIstek(settings.duelloIstek);
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setKaydediliyor(true);
    setMesaj({ text: '', type: '' });

    try {
      // Sadece veritabanı senaryosunu simüle ediyoruz (aslında avatarRenk auth/profil alanıdır)
      // Ancak db.ts içindeki yapıyı bozmamak için sadece localStorage güncelliyoruz.
      const user = { ...kullanici, avatarRenk };
      localStorage.setItem('fizik_kullanici', JSON.stringify(user));
      setKullanici(user);

      // Diğer ayarlar
      const settings = { bildirimler, duelloIstek };
      localStorage.setItem(`fizik_ayarlar_${user.id}`, JSON.stringify(settings));

      setMesaj({ text: 'Ayarlar başarıyla kaydedildi!', type: 'success' });
      
      // Event fırlat ki navbar vb güncellensin (isteğe bağlı)
      window.dispatchEvent(new Event('storage'));

    } catch (err) {
      setMesaj({ text: 'Bir hata oluştu.', type: 'error' });
    } finally {
      setKaydediliyor(false);
      setTimeout(() => setMesaj({ text: '', type: '' }), 3000);
    }
  };

  if (!kullanici) return null;

  return (
    <div style={{ background: '#09090b', minHeight: '100vh', color: '#f4f4f5', fontFamily: "'Inter', sans-serif" }}>
      <FizikNavbar />

      <main style={{ maxWidth: '700px', margin: '0 auto', padding: '4rem 1.5rem 6rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '2.2rem' }}>⚙️</span> Ayarlar
        </h1>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Avatar Settings */}
          <div className={styles.glassCardNohover} style={{ padding: '2rem', borderTop: '4px solid #6366f1' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: '#f8fafc' }}>Profil Görünümü</h2>
            <p style={{ color: '#a1a1aa', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Platformda diğer öğrencilere ve öğretmenine nasıl görüneceğini seç.</p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%', background: avatarRenk,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 800,
                boxShadow: `0 0 20px ${avatarRenk}40`, transition: 'all 0.3s'
              }}>
                {kullanici.ad[0]}
              </div>
              
              <div style={{ flex: 1, display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {AVATAR_COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setAvatarRenk(color)}
                    style={{
                      width: '36px', height: '36px', borderRadius: '50%', background: color,
                      border: avatarRenk === color ? '3px solid #fff' : '2px solid transparent',
                      cursor: 'pointer', transition: 'all 0.2s',
                      boxShadow: avatarRenk === color ? `0 0 10px ${color}80` : 'none',
                      transform: avatarRenk === color ? 'scale(1.1)' : 'scale(1)'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Preferences Settings */}
          <div className={styles.glassCardNohover} style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: '#f8fafc' }}>Tercihler & İletişim</h2>
            <p style={{ color: '#a1a1aa', fontSize: '0.85rem', marginBottom: '2rem' }}>Eğitim deneyimini kişiselleştir.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              


              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Düello İstekleri</div>
                  <div style={{ color: '#71717a', fontSize: '0.8rem', marginTop: '0.2rem' }}>Sınıf arkadaşlarından gelen anlık düello davetlerini al.</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={duelloIstek}
                  onChange={(e) => setDuelloIstek(e.target.checked)}
                  style={{ width: '20px', height: '20px', accentColor: '#6366f1' }}
                />
              </label>

              <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Veli & Öğretmen Bildirimleri</div>
                  <div style={{ color: '#71717a', fontSize: '0.8rem', marginTop: '0.2rem' }}>Sana atanan yeni ödevleri ve uyarıları e-posta ile al.</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={bildirimler}
                  onChange={(e) => setBildirimler(e.target.checked)}
                  style={{ width: '20px', height: '20px', accentColor: '#6366f1' }}
                />
              </label>

            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
            <button 
              type="submit" 
              disabled={kaydediliyor}
              className={styles.btnPrimary}
              style={{ padding: '0.8rem 2.5rem', fontSize: '1rem', fontWeight: 800, opacity: kaydediliyor ? 0.7 : 1 }}
            >
              {kaydediliyor ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </button>
            {mesaj.text && (
              <span style={{ color: mesaj.type === 'success' ? '#10b981' : '#ef4444', fontSize: '0.9rem', fontWeight: 600, animation: 'fadeIn 0.3s ease' }}>
                {mesaj.text}
              </span>
            )}
          </div>

        </form>
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
