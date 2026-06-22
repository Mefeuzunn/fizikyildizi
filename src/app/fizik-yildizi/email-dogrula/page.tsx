'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function EmailDogrulamaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';

  const [kod, setKod] = useState(['', '', '', '', '', '']);
  const [simuleKod, setSimuleKod] = useState<string | null>(null); // demo: shown in UI
  const [durum, setDurum] = useState<'bekleniyor' | 'yukleniyor' | 'basarili' | 'hata'>('bekleniyor');
  const [hataMsg, setHataMsg] = useState('');
  const [geriSayim, setGeriSayim] = useState(120);
  const [yenidenGonder, setYenidenGonder] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!emailParam) { router.push('/fizik-yildizi/giris'); return; }
    // Auto-generate verification code on page load
    generateCode();
  }, []);

  useEffect(() => {
    if (geriSayim <= 0) { setYenidenGonder(true); return; }
    const timer = setTimeout(() => setGeriSayim(g => g - 1), 1000);
    return () => clearTimeout(timer);
  }, [geriSayim]);

  const generateCode = async () => {
    try {
      const res = await fetch('/api/fizik-yildizi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generateVerifyCode', data: { email: emailParam } })
      });
      const data = await res.json();
      if (data.success) {
        setGeriSayim(120);
        setYenidenGonder(false);
      }
    } catch {}
  };

  const handleDigitChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newKod = [...kod];
    newKod[idx] = val.slice(-1);
    setKod(newKod);
    if (val && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
    if (newKod.every(d => d !== '') && newKod.join('').length === 6) {
      handleVerify(newKod.join(''));
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !kod[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const digits = pasted.split('');
      setKod(digits);
      handleVerify(pasted);
    }
  };

  const handleVerify = async (kodStr: string) => {
    setDurum('yukleniyor');
    setHataMsg('');

    try {
      const res = await fetch('/api/fizik-yildizi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verifyEmail', data: { email: emailParam, kod: kodStr } })
      });
      const data = await res.json();

      if (data.success) {
        setDurum('basarili');
        // Update local user data
        const kData = localStorage.getItem('fizik_kullanici');
        if (kData) {
          const k = JSON.parse(kData);
          k.mailOnayli = 1;
          localStorage.setItem('fizik_kullanici', JSON.stringify(k));
        }
        setTimeout(() => router.push('/fizik-yildizi/ogrenci'), 2500);
      } else {
        setDurum('hata');
        setHataMsg('Kod hatalı. Lütfen tekrar dene.');
        setKod(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        setTimeout(() => setDurum('bekleniyor'), 2000);
      }
    } catch {
      setDurum('hata');
      setHataMsg('Bağlantı hatası. Lütfen tekrar dene.');
      setTimeout(() => setDurum('bekleniyor'), 2000);
    }
  };

  const maskEmail = (email: string) => {
    const [user, domain] = email.split('@');
    return `${user.slice(0, 3)}***@${domain}`;
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#09090b',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', fontFamily: "'Inter', sans-serif",
    }}>
      {/* Background grid */}
      <div style={{
        position: 'fixed', inset: 0, opacity: 0.03,
        backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)',
        backgroundSize: '48px 48px', pointerEvents: 'none',
      }} />

      {/* Logo */}
      <Link href="/fizik-yildizi" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', textDecoration: 'none' }}>
        <span style={{ fontSize: '1.5rem' }}>⭐</span>
        <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#f4f4f5' }}>Fizik Yıldızı</span>
      </Link>

      {/* Main card */}
      <div style={{
        background: '#111113', border: '1px solid #27272a', borderRadius: '24px',
        padding: '2.5rem', width: '100%', maxWidth: '440px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
      }}>
        {durum === 'basarili' ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981', marginBottom: '0.5rem' }}>
              E-posta Doğrulandı!
            </h1>
            <p style={{ color: '#71717a', marginBottom: '1.5rem' }}>
              Hesabın aktif. Panele yönlendiriliyorsun...
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                border: '4px solid rgba(16,185,129,0.2)',
                borderTopColor: '#10b981',
                animation: 'spin 0.8s linear infinite',
              }} />
            </div>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{
                width: '64px', height: '64px', margin: '0 auto 1rem',
                background: 'rgba(99,102,241,0.1)', borderRadius: '50%',
                border: '2px solid rgba(99,102,241,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.75rem',
              }}>
                📧
              </div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f4f4f5', marginBottom: '0.5rem' }}>
                E-postanı doğrula
              </h1>
              <p style={{ color: '#71717a', fontSize: '0.875rem', lineHeight: 1.6 }}>
                <strong style={{ color: '#a1a1aa' }}>{maskEmail(emailParam)}</strong> adresine gönderilen<br />
                6 haneli kodu gir.
              </p>
            </div>

            {/* Code input */}
            <div style={{ display: 'flex', gap: '0.625rem', justifyContent: 'center', marginBottom: '1.5rem' }} onPaste={handlePaste}>
              {kod.map((digit, idx) => (
                <input
                  key={idx}
                  ref={el => { inputRefs.current[idx] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleDigitChange(idx, e.target.value)}
                  onKeyDown={e => handleKeyDown(idx, e)}
                  style={{
                    width: '52px', height: '60px', textAlign: 'center',
                    fontSize: '1.5rem', fontWeight: 900, fontFamily: 'monospace',
                    borderRadius: '12px',
                    border: `2px solid ${
                      durum === 'hata' ? '#f43f5e' :
                      digit ? '#6366f1' : '#27272a'
                    }`,
                    background: digit ? 'rgba(99,102,241,0.08)' : '#18181b',
                    color: '#f4f4f5',
                    outline: 'none',
                    transition: 'all 0.15s',
                    cursor: 'text',
                  }}
                />
              ))}
            </div>

            {/* Status */}
            {hataMsg && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)',
                borderRadius: '10px', padding: '0.75rem', marginBottom: '1rem',
                fontSize: '0.82rem', color: '#f87171',
              }}>
                ❌ {hataMsg}
              </div>
            )}

            {/* Verify button */}
            <button
              onClick={() => handleVerify(kod.join(''))}
              disabled={kod.some(d => !d) || durum === 'yukleniyor'}
              style={{
                width: '100%', padding: '0.875rem', borderRadius: '12px', border: 'none',
                background: kod.every(d => d) && durum !== 'yukleniyor'
                  ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                  : '#27272a',
                color: 'white', fontWeight: 700, fontSize: '0.95rem', cursor: kod.every(d => d) ? 'pointer' : 'not-allowed',
                marginBottom: '1rem', transition: 'all 0.15s',
              }}
            >
              {durum === 'yukleniyor' ? 'Doğrulanıyor...' : '✓ Kodu Doğrula'}
            </button>

            {/* Resend */}
            <div style={{ textAlign: 'center', fontSize: '0.82rem', color: '#71717a' }}>
              {yenidenGonder ? (
                <button
                  onClick={generateCode}
                  style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'underline' }}
                >
                  Kodu tekrar gönder
                </button>
              ) : (
                <span>Tekrar göndermek için <span style={{ color: '#a1a1aa', fontFamily: 'monospace', fontWeight: 700 }}>
                  {Math.floor(geriSayim / 60)}:{String(geriSayim % 60).padStart(2, '0')}
                </span> bekle</span>
              )}
            </div>
          </>
        )}
      </div>

      <Link href="/fizik-yildizi/giris" style={{ marginTop: '1.5rem', color: '#52525b', fontSize: '0.82rem', textDecoration: 'none' }}>
        ← Girişe dön
      </Link>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default function EmailDogrulamaPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#09090b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #27272a', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <EmailDogrulamaContent />
    </Suspense>
  );
}
