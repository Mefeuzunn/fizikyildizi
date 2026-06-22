'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '@/app/fizik-yildizi/fizik.module.css';

const SOUNDS = [
  { id: 'lofi', name: 'Lofi Beats', icon: '🎵', url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3' },
  { id: 'rain', name: 'Yağmur', icon: '🌧️', url: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_6b5687ab29.mp3?filename=soft-rain-ambient-111154.mp3' },
  { id: 'cafe', name: 'Kafe Ortamı', icon: '☕', url: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_b2fcd1ea5e.mp3?filename=cafe-ambience-111130.mp3' }
];

export default function OdakOdasiPage() {
  const router = useRouter();
  const [kullanici, setKullanici] = useState<any>(null);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  
  // Audio state
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('fizik_kullanici');
    if (!raw) {
      router.push('/fizik-yildizi/giris');
      return;
    }
    setKullanici(JSON.parse(raw));
  }, [router]);

  // Audio effect
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    if (activeSound) {
      const soundObj = SOUNDS.find(s => s.id === activeSound);
      if (soundObj) {
        audioRef.current = new Audio(soundObj.url);
        audioRef.current.loop = true;
        audioRef.current.volume = volume;
        audioRef.current.play().catch(e => console.log('Audio autoplay blocked:', e));
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [activeSound]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      handleTimerComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleTimerComplete = () => {
    setIsActive(false);
    
    // Play bell sound
    const bell = new Audio('https://cdn.pixabay.com/download/audio/2021/08/04/audio_bb630cc098.mp3?filename=bell-ringing-01-111586.mp3');
    bell.play().catch(() => {});

    if (mode === 'work') {
      // Award XP
      fetch('/api/fizik-yildizi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'addXp', data: { ogrenciId: kullanici.id, xp: 10 } })
      }).catch(() => {});

      alert('Tebrikler! Odaklanma seansını tamamladın ve +10 XP kazandın! Şimdi 5 dakikalık molanı hak ettin.');
      setMode('break');
      setTimeLeft(5 * 60);
    } else {
      alert('Mola bitti! Yeni bir odaklanma seansına hazır mısın?');
      setMode('work');
      setTimeLeft(25 * 60);
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'work' 
    ? ((25 * 60 - timeLeft) / (25 * 60)) * 100 
    : ((5 * 60 - timeLeft) / (5 * 60)) * 100;

  if (!kullanici) return null;

  return (
    <div style={{ 
      background: mode === 'work' ? '#09090b' : '#0f172a', 
      minHeight: '100vh', 
      color: '#f4f4f5', 
      fontFamily: "'Inter', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      transition: 'background 1s ease'
    }}>
      
      {/* Minimalist Top Nav */}
      <div style={{ padding: '2rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/fizik-yildizi/ogrenci/dashboard" style={{ color: '#a1a1aa', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
          <span>←</span> Kontrol Paneline Dön
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span className={styles.badgeCyan} style={{ padding: '0.4rem 1rem' }}>
            ✨ Odak Modu
          </span>
        </div>
      </div>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        
        {/* Animated Background Rings */}
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 0, opacity: isActive ? 0.6 : 0.2, transition: 'all 1s ease' }}>
          <div style={{ width: '600px', height: '600px', borderRadius: '50%', border: `1px solid ${mode === 'work' ? 'rgba(99,102,241,0.2)' : 'rgba(16,185,129,0.2)'}`, animation: 'pulse 4s infinite' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '400px', height: '400px', borderRadius: '50%', border: `1px solid ${mode === 'work' ? 'rgba(99,102,241,0.3)' : 'rgba(16,185,129,0.3)'}`, animation: 'spin 15s linear infinite' }} />
        </div>

        {/* Timer UI */}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={() => { setMode('work'); setIsActive(false); setTimeLeft(25 * 60); }}
              style={{
                background: mode === 'work' ? 'rgba(99,102,241,0.15)' : 'transparent',
                color: mode === 'work' ? '#818cf8' : '#a1a1aa',
                border: mode === 'work' ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                padding: '0.5rem 1.5rem', borderRadius: '20px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.3s'
              }}
            >
              Pomodoro
            </button>
            <button
              onClick={() => { setMode('break'); setIsActive(false); setTimeLeft(5 * 60); }}
              style={{
                background: mode === 'break' ? 'rgba(16,185,129,0.15)' : 'transparent',
                color: mode === 'break' ? '#34d399' : '#a1a1aa',
                border: mode === 'break' ? '1px solid rgba(16,185,129,0.3)' : '1px solid transparent',
                padding: '0.5rem 1.5rem', borderRadius: '20px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.3s'
              }}
            >
              Kısa Mola
            </button>
          </div>

          <div style={{ fontSize: '10rem', fontWeight: 900, fontFamily: 'monospace', lineHeight: 1, letterSpacing: '-4px', background: mode === 'work' ? 'linear-gradient(180deg, #fff, #a1a1aa)' : 'linear-gradient(180deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', dropShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            {formatTime(timeLeft)}
          </div>

          <div style={{ width: '400px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', margin: '2rem auto', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: mode === 'work' ? '#6366f1' : '#10b981', transition: 'width 1s linear' }} />
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={toggleTimer}
              className={styles.btnPrimary}
              style={{ padding: '1rem 3rem', fontSize: '1.2rem', background: isActive ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #6366f1, #4f46e5)', border: isActive ? '1px solid rgba(255,255,255,0.2)' : 'none', color: '#fff', borderRadius: '16px', fontWeight: 800 }}
            >
              {isActive ? '⏸️ Duraklat' : '▶️ Başlat'}
            </button>
            <button
              onClick={resetTimer}
              style={{ padding: '1rem', width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#a1a1aa', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            >
              🔄
            </button>
          </div>
        </div>

        {/* Ambient Sounds */}
        <div style={{ position: 'relative', zIndex: 1, marginTop: '5rem', background: 'rgba(24,24,27,0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem 2rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>
            🎧 Odaklanma Sesleri
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {SOUNDS.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSound(activeSound === s.id ? null : s.id)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                  padding: '1rem', width: '100px', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.3s',
                  background: activeSound === s.id ? 'rgba(99,102,241,0.2)' : 'transparent',
                  border: activeSound === s.id ? '1px solid rgba(99,102,241,0.4)' : '1px solid transparent',
                  color: activeSound === s.id ? '#818cf8' : '#a1a1aa'
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{s.name}</span>
              </button>
            ))}
          </div>
          
          {activeSound && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0 1rem' }}>
              <span style={{ fontSize: '0.8rem' }}>🔈</span>
              <input 
                type="range" 
                min="0" max="1" step="0.05" 
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                style={{ flex: 1, accentColor: '#6366f1' }}
              />
              <span style={{ fontSize: '0.8rem' }}>🔊</span>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
