'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FizikNavbar from '@/components/fizik-yildizi/FizikNavbar';
import styles from '@/app/fizik-yildizi/fizik.module.css';

const STORE_ITEMS = [
  { id: 'frame_gold', type: 'frame', name: 'Altın Çerçeve', desc: 'Profilini saf altın rengiyle çerçevele.', price: 50, icon: '🌟', color: '#fbbf24' },
  { id: 'frame_holographic', type: 'frame', name: 'Holografik Çerçeve', desc: 'Siberpunk tarzı ışıklı çerçeve efekti.', price: 150, icon: '💎', color: '#a855f7' },
  { id: 'voice_yoda', type: 'voice', name: 'AstroTutor Yoda Ses Paketi', desc: 'Yapay zeka asistanın seninle usta bir Jedi gibi konuşsun.', price: 300, icon: '👽', color: '#10b981' },
  { id: 'voice_robot', type: 'voice', name: 'Mekanik Ses Paketi', desc: 'Tamamen fütüristik robotik yapay zeka sesi.', price: 100, icon: '🤖', color: '#06b6d4' },
  { id: 'bg_space', type: 'bg', name: 'Uzay İstasyonu Lofi', desc: 'Odak modunda dinleyebileceğin özel bir uzay gemisi ortam sesi.', price: 50, icon: '🚀', color: '#3b82f6' },
  { id: 'bg_cyber', type: 'bg', name: 'Cyberpunk Şehri', desc: 'Odak modunda dinleyebileceğin yağmurlu cyberpunk şehir sesi.', price: 75, icon: '🌆', color: '#f43f5e' }
];

export default function MagazaPage() {
  const router = useRouter();
  const [kullanici, setKullanici] = useState<any>(null);
  const [envanter, setEnvanter] = useState<string[]>([]);
  const [coin, setCoin] = useState(0);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('fizik_kullanici');
    if (!raw) {
      router.push('/fizik-yildizi/giris');
      return;
    }
    const user = JSON.parse(raw);
    setKullanici(user);
    setCoin(user.astroCoin || 0);
    
    try {
      if (user.envanter) {
        setEnvanter(typeof user.envanter === 'string' ? JSON.parse(user.envanter) : user.envanter);
      }
    } catch {}
  }, [router]);

  const handleSatinAl = async (item: any) => {
    if (coin < item.price) {
      alert('Yeterli AstroCoin bulunmuyor! Daha fazla test çözerek coin kazanabilirsin.');
      return;
    }
    
    if (envanter.includes(item.id)) {
      alert('Bu öğeye zaten sahipsin!');
      return;
    }

    setLoadingId(item.id);

    try {
      const res = await fetch('/api/fizik-yildizi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'satinAlim',
          data: { ogrenciId: kullanici.id, fiyat: item.price, itemId: item.id }
        })
      });
      const d = await res.json();
      
      if (d.success) {
        const newCoin = coin - item.price;
        const newEnv = [...envanter, item.id];
        setCoin(newCoin);
        setEnvanter(newEnv);
        
        // Update local storage
        const updatedUser = { ...kullanici, astroCoin: newCoin, envanter: JSON.stringify(newEnv) };
        setKullanici(updatedUser);
        localStorage.setItem('fizik_kullanici', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('storage'));
        
        alert(`${item.name} başarıyla satın alındı! 🎉`);
      } else {
        alert('Satın alım başarısız oldu.');
      }
    } catch (err) {
      alert('Bir hata oluştu.');
    } finally {
      setLoadingId(null);
    }
  };

  if (!kullanici) return null;

  return (
    <div style={{ background: '#09090b', minHeight: '100vh', color: '#f4f4f5', fontFamily: "'Inter', sans-serif" }}>
      <FizikNavbar />

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header & Wallet */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', background: 'linear-gradient(135deg, #10b981, #059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              💎 AstroCoin Mağazası
            </h1>
            <p style={{ color: '#a1a1aa', fontSize: '0.95rem' }}>
              XP kazandıkça hesabına eklenen coinleri harcayarak profilini ve platformu kişiselleştir.
            </p>
          </div>
          
          <div className={styles.glassCardNohover} style={{ padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid rgba(16,185,129,0.3)', background: 'linear-gradient(135deg, rgba(16,185,129,0.1), transparent)' }}>
            <div style={{ fontSize: '2rem' }}>🪙</div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#a1a1aa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Bakiyeniz</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#10b981', lineHeight: 1 }}>{coin} <span style={{ fontSize: '1rem' }}>AC</span></div>
            </div>
          </div>
        </div>

        {/* Store Items Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {STORE_ITEMS.map((item) => {
            const isOwned = envanter.includes(item.id);
            const canAfford = coin >= item.price;
            
            return (
              <div key={item.id} className={styles.glassCard} style={{ 
                padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem',
                borderTop: `4px solid ${item.color}`, position: 'relative', overflow: 'hidden'
              }}>
                {isOwned && (
                  <div style={{ position: 'absolute', top: 15, right: -30, background: '#10b981', color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 3rem', transform: 'rotate(45deg)', boxShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                    SAHİPSİN
                  </div>
                )}
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: `${item.color}20`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: item.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.2rem' }}>
                      {item.type === 'frame' ? 'Profil Çerçevesi' : item.type === 'voice' ? 'Yapay Zeka Sesi' : 'Odak Odası Sesi'}
                    </div>
                  </div>
                </div>
                
                <p style={{ color: '#a1a1aa', fontSize: '0.85rem', lineHeight: 1.5, flex: 1 }}>
                  {item.desc}
                </p>
                
                <button
                  onClick={() => handleSatinAl(item)}
                  disabled={isOwned || (!canAfford && !isOwned) || loadingId === item.id}
                  style={{
                    padding: '0.75rem', borderRadius: '12px', fontWeight: 800, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem',
                    background: isOwned ? 'rgba(255,255,255,0.05)' : canAfford ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.05)',
                    color: isOwned ? '#71717a' : canAfford ? '#fff' : '#71717a',
                    border: isOwned ? '1px solid rgba(255,255,255,0.1)' : 'none',
                    cursor: isOwned || !canAfford ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s', marginTop: 'auto'
                  }}
                >
                  {loadingId === item.id ? 'İşleniyor...' : isOwned ? 'Kullanımda' : (
                    <>
                      <span>{item.price}</span>
                      <span style={{ fontSize: '0.8rem' }}>AC</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
}
