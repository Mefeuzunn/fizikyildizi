'use client';
import { apiFetch } from '@/lib/fizik-yildizi/apiFetch';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import FizikNavbar from '@/components/fizik-yildizi/FizikNavbar';
import styles from '@/app/fizik-yildizi/fizik.module.css';

interface Flashcard {
  id: string;
  kategori: string;
  onYuz: string;
  arkaYuz: string;
  seviye: number;
  sonrakiGosterim: number;
}

const ORNEK_KARTLAR: Omit<Flashcard, 'seviye' | 'sonrakiGosterim'>[] = [
  { id: 'f1', kategori: 'Mekanik', onYuz: "Newton'un 2. Yasası", arkaYuz: 'F = m \\cdot a' },
  { id: 'f2', kategori: 'Mekanik', onYuz: 'Kinetik Enerji', arkaYuz: 'E_k = 1/2 m v^2' },
  { id: 'f3', kategori: 'Elektrik', onYuz: 'Ohm Yasası', arkaYuz: 'V = I \\cdot R' },
  { id: 'f4', kategori: 'Termodinamik', onYuz: 'Isı Alışverişi', arkaYuz: 'Q = m c \\Delta T' },
  { id: 'f5', kategori: 'Optik', onYuz: 'Kırılma İndisi', arkaYuz: 'n = c / v' },
  { id: 'f6', kategori: 'Modern Fizik', onYuz: 'Fotonun Enerjisi', arkaYuz: 'E = h f' }
];

export default function FluidFlashcardsPage() {
  const router = useRouter();
  const [kullanici, setKullanici] = useState<any>(null);
  const [kartlar, setKartlar] = useState<Flashcard[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [kategori, setKategori] = useState<string>('Tümü');
  
  const controls = useAnimation();

  useEffect(() => {
    const raw = localStorage.getItem('fizik_kullanici');
    if (!raw) {
      router.push('/fizik-yildizi/giris');
      return;
    }
    const user = JSON.parse(raw);
    setKullanici(user);

    const saved = localStorage.getItem(`fizik_flashcards_${user.id}`);
    if (saved) {
      setKartlar(JSON.parse(saved));
    } else {
      const init = ORNEK_KARTLAR.map(k => ({ ...k, seviye: 0, sonrakiGosterim: Date.now() }));
      setKartlar(init);
      localStorage.setItem(`fizik_flashcards_${user.id}`, JSON.stringify(init));
    }
  }, [router]);

  const filtrelenmisKartlar = kartlar
    .filter(k => kategori === 'Tümü' || k.kategori === kategori)
    .sort((a, b) => a.sonrakiGosterim - b.sonrakiGosterim);

  const gosterilecekKart = filtrelenmisKartlar.length > 0 ? filtrelenmisKartlar[0] : null;

  const playTTS = (text: string) => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    
    // Convert math symbols loosely for reading
    let readText = text.replace(/\\cdot/g, 'çarpı')
                       .replace(/\\Delta/g, 'delta')
                       .replace(/_/g, ' alt indis ')
                       .replace(/\\/g, '');

    const utterance = new SpeechSynthesisUtterance(readText);
    utterance.lang = 'tr-TR';
    utterance.rate = 0.9;
    
    // Check if user has premium voice package (mocked via aiSes in settings)
    const settings = JSON.parse(localStorage.getItem(`fizik_ayarlar_${kullanici?.id}`) || '{}');
    if (settings.aiSes === 'robot') {
      utterance.pitch = 0.1;
    } else {
      utterance.pitch = 1.1; // Default
    }
    
    window.speechSynthesis.speak(utterance);
  };

  const handleCevap = async (biliyor: boolean) => {
    if (!gosterilecekKart) return;
    
    // Swipe animation
    await controls.start({ 
      x: biliyor ? 500 : -500, 
      opacity: 0, 
      rotate: biliyor ? 15 : -15, 
      transition: { duration: 0.3 } 
    });
    
    setIsFlipped(false);
    
    const yeniKartlar = [...kartlar];
    const gercekIdx = yeniKartlar.findIndex(k => k.id === gosterilecekKart.id);
    const k = yeniKartlar[gercekIdx];
    
    if (biliyor) {
      k.seviye += 1;
      const saatGecikme = Math.pow(2, k.seviye); 
      k.sonrakiGosterim = Date.now() + (saatGecikme * 60 * 60 * 1000);
      
      // Award XP
      apiFetch('/api/fizik-yildizi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'addXp', data: { ogrenciId: kullanici.id, xp: 5 } })
      }).catch(() => {});
    } else {
      k.seviye = 0;
      k.sonrakiGosterim = Date.now() + (5 * 60 * 1000);
    }

    setKartlar(yeniKartlar);
    localStorage.setItem(`fizik_flashcards_${kullanici.id}`, JSON.stringify(yeniKartlar));
    
    // Reset position for next card
    controls.set({ x: 0, opacity: 1, rotate: 0 });
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      handleCevap(true);
    } else if (info.offset.x < -threshold) {
      handleCevap(false);
    } else {
      // Snap back
      controls.start({ x: 0, opacity: 1, rotate: 0 });
    }
  };

  const handleFlip = () => {
    if (!isFlipped && gosterilecekKart) {
      playTTS(gosterilecekKart.arkaYuz);
    }
    setIsFlipped(!isFlipped);
  };

  if (!kullanici) return null;

  const kategoriler = ['Tümü', ...Array.from(new Set(kartlar.map(k => k.kategori)))];

  return (
    <div style={{ background: '#09090b', minHeight: '100vh', color: '#f4f4f5', fontFamily: "'Inter', sans-serif", overflow: 'hidden' }}>
      <FizikNavbar />

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', background: 'linear-gradient(135deg, #a855f7, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            🎴 Fluid Flashcards
          </h1>
          <p style={{ color: '#a1a1aa', fontSize: '1rem', maxWidth: '500px', margin: '0 auto' }}>
            Kartı Biliyorum demek için Sağa (→), Bilemedim demek için Sola (←) sürükle.
          </p>
        </div>

        {/* Kategori Filtresi */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '3rem' }}>
          {kategoriler.map(kat => (
            <button
              key={kat}
              onClick={() => { setKategori(kat); setIsFlipped(false); }}
              style={{
                padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                background: kategori === kat ? '#6366f1' : 'rgba(255,255,255,0.05)',
                color: kategori === kat ? '#fff' : '#a1a1aa',
                border: 'none',
              }}
            >
              {kat}
            </button>
          ))}
        </div>

        {/* Kart Konteyner */}
        <div style={{ width: '100%', maxWidth: '400px', perspective: '1000px', marginBottom: '2.5rem', position: 'relative', height: '450px' }}>
          {gosterilecekKart ? (
            <motion.div
              drag={isFlipped ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              animate={controls}
              style={{
                width: '100%', height: '100%', cursor: isFlipped ? 'grab' : 'pointer',
                position: 'absolute', transformStyle: 'preserve-3d', touchAction: 'none'
              }}
              whileTap={{ cursor: isFlipped ? 'grabbing' : 'pointer' }}
            >
              <motion.div 
                onClick={handleFlip}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                style={{ width: '100%', height: '100%', transformStyle: 'preserve-3d', position: 'relative' }}
              >
                {/* Ön Yüz */}
                <div className={styles.glassCardNohover} style={{
                  position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  padding: '2rem', textAlign: 'center', border: '2px solid rgba(168,85,247,0.4)',
                  background: 'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(0,0,0,0.8))',
                  borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                }}>
                  <span style={{ position: 'absolute', top: 20, right: 25, fontSize: '0.85rem', color: '#a855f7', fontWeight: 800 }}>
                    {gosterilecekKart.kategori}
                  </span>
                  <span style={{ fontSize: '4rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 10px rgba(168,85,247,0.5))' }}>❓</span>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1.3 }}>
                    {gosterilecekKart.onYuz}
                  </h2>
                  <div style={{ position: 'absolute', bottom: 20, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#71717a' }}>
                    <span className={styles.animPulseGlow}>👆</span> Çevirmek için tıkla
                  </div>
                </div>

                {/* Arka Yüz */}
                <div className={styles.glassCardNohover} style={{
                  position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  padding: '2rem', textAlign: 'center', border: '2px solid rgba(16,185,129,0.4)',
                  background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(0,0,0,0.8))',
                  transform: 'rotateY(180deg)', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                }}>
                  <span style={{ position: 'absolute', top: 20, right: 25, fontSize: '0.85rem', color: '#10b981', fontWeight: 800 }}>
                    CEVAP 🔊
                  </span>
                  <div style={{ 
                    fontSize: '2.5rem', fontWeight: 900, color: '#10b981', fontFamily: 'monospace',
                    background: 'rgba(0,0,0,0.4)', padding: '2rem', borderRadius: '20px', border: '1px dashed rgba(16,185,129,0.5)',
                  }}>
                    {gosterilecekKart.arkaYuz}
                  </div>
                  
                  <div style={{ position: 'absolute', bottom: 20, display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0 2rem' }}>
                    <div style={{ color: '#f43f5e', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>←</span> Bilemedim
                    </div>
                    <div style={{ color: '#10b981', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      Biliyordum <span>→</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <div className={styles.glassCardNohover} style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem', borderRadius: '24px' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>Harika İş Çıkardın!</h2>
              <p style={{ color: '#a1a1aa', fontSize: '1rem', marginTop: '1rem' }}>Bu kategori için şu an tekrar etmen gereken kart yok.</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
