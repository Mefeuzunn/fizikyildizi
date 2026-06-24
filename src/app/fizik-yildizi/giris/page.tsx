'use client';
import { apiFetch } from '@/lib/fizik-yildizi/apiFetch';
import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '@/app/fizik-yildizi/fizik.module.css';
import { getKullanicilar, syncWithServer } from '@/lib/fizik-yildizi/db';
import { Storage } from '@/lib/storage';
import { useEffect } from 'react';

type Rol = 'ogrenci' | 'ogretmen';


export default function GirisPage() {
  const router = useRouter();
  const [rol, setRol] = useState<Rol>('ogrenci');
  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState('');
  const [sifreGoster, setSifreGoster] = useState(false);

  useEffect(() => {
    syncWithServer();
  }, []);

  const handleGiris = async (e: FormEvent) => {
    e.preventDefault();
    setHata('');
    setYukleniyor(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Basic validation
    if (!email.trim() || !email.includes('@')) {
      setHata('Geçerli bir e-posta adresi giriniz.');
      setYukleniyor(false);
      return;
    }
    if (sifre.length < 6) {
      setHata('Şifre en az 6 karakter olmalıdır.');
      setYukleniyor(false);
      return;
    }

    let kullanici = null;
    let token = '';
    try {
      const res = await apiFetch('/api/fizik-yildizi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          data: { email: email.trim().toLowerCase(), sifre, rol }
        })
      });
      const resData = await res.json();
      if (resData.success) {
        kullanici = resData.kullanici;
        token = resData.token;
      } else {
        setHata(resData.message || 'Hatalı e-posta veya şifre.');
        setYukleniyor(false);
        return;
      }
    } catch (e) {
      console.error('Server login error:', e);
      setHata('Sunucu bağlantı hatası.');
      setYukleniyor(false);
      return;
    }

    // Store auth in native storage
    await Storage.set('fizik_token', token);
    await Storage.set('fizik_kullanici', kullanici);

    setYukleniyor(false);

    // Redirect to appropriate dashboard
    if (kullanici.rol === 'ogretmen') {
      router.push('/fizik-yildizi/ogretmen/dashboard');
    } else {
      router.push('/fizik-yildizi/ogrenci/dashboard');
    }
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
          top: '20%',
          left: '10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          bottom: '20%',
          right: '10%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)',
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
            <span style={{ fontSize: '1.75rem', animation: 'float 3s ease-in-out infinite', display: 'inline-block' }}>
              ⭐
            </span>
            <span style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Fizik Yıldızı
            </span>
          </Link>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Hesabına giriş yap ve öğrenmeye devam et
          </p>
        </div>

        {/* Card */}
        <div
          className={styles.glassCardNohover}
          style={{ padding: '2rem', boxShadow: '0 30px 60px rgba(0,0,0,0.4)' }}
        >
          {/* Role tabs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.4rem',
            background: 'rgba(255,255,255,0.04)',
            borderRadius: '12px',
            padding: '0.3rem',
            marginBottom: '1.75rem',
          }}>
            {(['ogrenci', 'ogretmen'] as Rol[]).map((r) => (
              <button
                key={r}
                onClick={() => { setRol(r); setHata(''); }}
                style={{
                  padding: '0.65rem',
                  borderRadius: '9px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  transition: 'all 0.2s',
                  background: rol === r
                    ? 'linear-gradient(135deg, #7c3aed, #06b6d4)'
                    : 'transparent',
                  color: rol === r ? 'white' : '#64748b',
                  boxShadow: rol === r ? '0 4px 15px rgba(124,58,237,0.3)' : 'none',
                }}
              >
                {r === 'ogrenci' ? '🎓 Öğrenci' : '📚 Öğretmen'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleGiris} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
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
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label className={styles.label} style={{ margin: 0 }}>Şifre</label>
                <Link
                  href="/fizik-yildizi/sifremi-unuttum"
                  style={{ fontSize: '0.78rem', color: '#7c3aed', textDecoration: 'none', fontWeight: 500 }}
                >
                  Şifremi unuttum
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={sifreGoster ? 'text' : 'password'}
                  className={styles.inputField}
                  placeholder="••••••••"
                  value={sifre}
                  onChange={(e) => setSifre(e.target.value)}
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  onClick={() => setSifreGoster(!sifreGoster)}
                  style={{
                    position: 'absolute',
                    right: '0.875rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#64748b',
                    fontSize: '1rem',
                    padding: '0.25rem',
                    lineHeight: 1,
                  }}
                  aria-label={sifreGoster ? 'Şifreyi gizle' : 'Şifreyi göster'}
                >
                  {sifreGoster ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {/* Error message */}
            {hata && (
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                background: 'rgba(239,68,68,0.12)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#fca5a5',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                animation: 'fadeInUp 0.3s ease',
              }}>
                <span>⚠️</span> {hata}
              </div>
            )}

            {/* Submit button */}
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
                  {' '}Giriş yapılıyor...
                </>
              ) : (
                <>🔐 Giriş Yap</>
              )}
            </button>
          </form>
        </div>

        {/* Register link */}
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#64748b', fontSize: '0.9rem' }}>
          Hesabın yok mu?{' '}
          <Link
            href="/fizik-yildizi/kayit"
            style={{ color: '#8b5cf6', fontWeight: 600, textDecoration: 'none' }}
          >
            Ücretsiz Kayıt Ol →
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
