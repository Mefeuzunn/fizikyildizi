'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../fizik.module.css';

export default function SifremiUnuttumPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);
  const [gonderildi, setGonderildi] = useState(false);
  const [hata, setHata] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleGonder = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setHata('');

    if (!email.trim() || !email.includes('@')) {
      setHata('Lütfen geçerli bir e-posta adresi giriniz.');
      return;
    }

    setYukleniyor(true);
    try {
      const res = await fetch('/api/fizik-yildizi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generateVerifyCode', data: { email: email.trim().toLowerCase() } }),
      });
      const data = await res.json();

      if (!data.success) {
        setHata(data.message || 'E-posta gönderilemedi. Lütfen tekrar deneyin.');
        setYukleniyor(false);
        return;
      }

      setGonderildi(true);
      setCountdown(60);

      // Redirect to email verification page with reset mode
      router.push(`/fizik-yildizi/email-dogrula?email=${encodeURIComponent(email.trim().toLowerCase())}&mode=reset`);
    } catch {
      setHata('Sunucu bağlantı hatası. Lütfen tekrar deneyin.');
      setYukleniyor(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    await handleGonder();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Ambient glow orbs */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: '15%',
          left: '8%',
          width: '480px',
          height: '480px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.13) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          bottom: '15%',
          right: '8%',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: '55%',
          left: '55%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ width: '100%', maxWidth: '440px', animation: 'fadeInUp 0.5s ease' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link
            href="/fizik-yildizi"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
              marginBottom: '0.5rem',
            }}
          >
            <span
              style={{
                fontSize: '1.75rem',
                animation: 'float 3s ease-in-out infinite',
                display: 'inline-block',
              }}
            >
              ⭐
            </span>
            <span
              style={{
                fontSize: '1.35rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Fizik Yıldızı
            </span>
          </Link>
          <h1
            style={{
              fontSize: '1.55rem',
              fontWeight: 800,
              color: '#f4f4f5',
              margin: '0.5rem 0 0.4rem',
            }}
          >
            Şifremi Unuttum
          </h1>
          <p style={{ color: '#71717a', fontSize: '0.875rem', lineHeight: 1.6 }}>
            E-posta adresinizi girin, sıfırlama kodu gönderelim.
          </p>
        </div>

        {/* Card */}
        <div
          className={styles.glassCardNohover}
          style={{ padding: '2rem', boxShadow: '0 30px 60px rgba(0,0,0,0.4)' }}
        >
          {!gonderildi ? (
            /* Email input form */
            <form onSubmit={handleGonder} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Icon centered */}
              <div style={{ textAlign: 'center', marginBottom: '0.25rem' }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(124,58,237,0.1))',
                    border: '1px solid rgba(99,102,241,0.25)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.75rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  🔑
                </div>
              </div>

              <div>
                <label className={styles.label}>E-posta Adresi</label>
                <input
                  type="email"
                  className={styles.inputField}
                  placeholder="ornek@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>

              {/* Error message */}
              {hata && (
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    background: 'rgba(244,63,94,0.1)',
                    border: '1px solid rgba(244,63,94,0.25)',
                    color: '#fca5a5',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    animation: 'fadeInUp 0.3s ease',
                  }}
                >
                  <span>⚠️</span> {hata}
                </div>
              )}

              <button
                type="submit"
                disabled={yukleniyor}
                className={styles.btnPrimary}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  opacity: yukleniyor ? 0.8 : 1,
                  cursor: yukleniyor ? 'not-allowed' : 'pointer',
                  marginTop: '0.25rem',
                }}
              >
                {yukleniyor ? (
                  <>
                    <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span>
                    {' '}Gönderiliyor...
                  </>
                ) : (
                  <>📧 Kodu Gönder</>
                )}
              </button>
            </form>
          ) : (
            /* Success state */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'center' }}>
              <div>
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.08))',
                    border: '1px solid rgba(16,185,129,0.3)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    marginBottom: '1rem',
                    animation: 'scaleIn 0.4s ease',
                  }}
                >
                  ✅
                </div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f4f4f5', marginBottom: '0.5rem' }}>
                  Kod Gönderildi!
                </h2>
                <p style={{ color: '#71717a', fontSize: '0.875rem', lineHeight: 1.65 }}>
                  Sıfırlama kodu{' '}
                  <span style={{ color: '#818cf8', fontWeight: 600 }}>{email}</span>{' '}
                  adresinize gönderildi. Geliyor olabilir, birkaç dakika bekleyin.
                </p>
              </div>

              {/* Info box */}
              <div
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  background: 'rgba(99,102,241,0.07)',
                  border: '1px solid rgba(99,102,241,0.18)',
                  fontSize: '0.82rem',
                  color: '#a1a1aa',
                  lineHeight: 1.6,
                  textAlign: 'left',
                }}
              >
                <span style={{ color: '#818cf8', fontWeight: 600 }}>💡 İpucu:</span>{' '}
                Spam/Junk klasörünüzü de kontrol etmeyi unutmayın. Kod 10 dakika geçerlidir.
              </div>

              {/* Resend button with countdown */}
              <button
                type="button"
                onClick={handleResend}
                disabled={countdown > 0}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: '1px dashed rgba(99,102,241,0.35)',
                  background: countdown > 0 ? 'rgba(99,102,241,0.04)' : 'rgba(99,102,241,0.09)',
                  color: countdown > 0 ? '#52525b' : '#818cf8',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: countdown > 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                {countdown > 0 ? (
                  <>⏱ Tekrar göndermek için {countdown}s bekleyin</>
                ) : (
                  <>🔄 Kodu Tekrar Gönder</>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Back to login */}
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#52525b', fontSize: '0.875rem' }}>
          <Link
            href="/fizik-yildizi/giris"
            style={{
              color: '#6366f1',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            ← Giriş sayfasına dön
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
