'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../fizik.module.css';

interface CatchAllProps {
  params: {
    notfound: string[];
  };
}

export default function PhysicsCatchAll({ params }: CatchAllProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [show404, setShow404] = useState(false);

  useEffect(() => {
    const segments = params.notfound || [];
    const firstSegment = segments[0]?.toLowerCase();

    const token = localStorage.getItem('fizik_token');
    const kullaniciData = localStorage.getItem('fizik_kullanici');

    // Handle redirection logic
    if (['dashboard', 'konular', 'analiz', 'profil'].includes(firstSegment)) {
      if (!token || !kullaniciData) {
        // Not logged in, redirect to login
        router.replace('/fizik-yildizi/giris');
        return;
      }

      try {
        const kullanici = JSON.parse(kullaniciData);
        const rol = kullanici?.rol;

        if (rol === 'ogretmen') {
          // Teacher routing
          if (firstSegment === 'dashboard') {
            router.replace('/fizik-yildizi/ogretmen/dashboard');
          } else {
            router.replace('/fizik-yildizi/ogretmen/dashboard'); // default fallback for teachers
          }
        } else {
          // Student routing
          if (firstSegment === 'dashboard') {
            router.replace('/fizik-yildizi/ogrenci/dashboard');
          } else if (firstSegment === 'konular') {
            router.replace('/fizik-yildizi/ogrenci/konular');
          } else if (firstSegment === 'analiz') {
            router.replace('/fizik-yildizi/ogrenci/analiz');
          } else {
            router.replace('/fizik-yildizi/ogrenci/dashboard'); // default fallback
          }
        }
      } catch (e) {
        localStorage.removeItem('fizik_token');
        localStorage.removeItem('fizik_kullanici');
        router.replace('/fizik-yildizi/giris');
      }
    } else {
      // Unrecognized path, show 404
      setLoading(false);
      setShow404(true);
    }
  }, [params.notfound, router]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#050a1a',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            border: '3px solid #7c3aed',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (show404) {
    return (
      <div
        style={{
          minHeight: '75vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Glow Effects */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div style={{ maxWidth: '500px', position: 'relative', zIndex: 1 }}>
          <div
            style={{
              fontSize: '8rem',
              fontWeight: 950,
              lineHeight: 1,
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '1rem',
              letterSpacing: '-0.05em',
              filter: 'drop-shadow(0 0 30px rgba(124,58,237,0.3))',
              animation: 'float 4s ease-in-out infinite',
            }}
          >
            404
          </div>

          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              marginBottom: '1rem',
              color: '#f8fafc',
            }}
          >
            Yörüngeden Çıktınız! 🪐
          </h1>

          <p
            style={{
              color: '#94a3b8',
              lineHeight: 1.75,
              marginBottom: '2.5rem',
              fontSize: '1.05rem',
            }}
          >
            Aradığınız sayfa uzay boşluğunda kaybolmuş olabilir ya da henüz yapım aşamasındadır.
            Güvenli yörüngeye dönmek için aşağıdaki butonu kullanabilirsiniz.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link
              href="/fizik-yildizi"
              className={styles.btnPrimary}
              style={{ padding: '0.9rem 2.25rem', fontSize: '1.05rem' }}
            >
              🚀 Yörüngeye Dön (Ana Sayfa)
            </Link>
          </div>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
      </div>
    );
  }

  return null;
}
