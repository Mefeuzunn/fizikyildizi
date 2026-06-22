'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import styles from '../fizik.module.css';

export default function IletisimPage() {
  const [ad, setAd] = useState('');
  const [email, setEmail] = useState('');
  const [mesaj, setMesaj] = useState('');
  const [gonderildi, setGonderildi] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setYukleniyor(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    setYukleniyor(false);
    setGonderildi(true);
    setAd('');
    setEmail('');
    setMesaj('');
  };

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5rem 1.5rem 3rem',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div style={{ width: '100%', maxWidth: '600px', animation: 'fadeInUp 0.5s ease' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 900,
              marginBottom: '0.75rem',
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            ✉️ İletişim
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>
            Sorularınız, önerileriniz veya teknik destek talepleriniz için bize ulaşın.
          </p>
        </div>

        {/* Content Card */}
        <div
          className={styles.glassCardNohover}
          style={{
            padding: '2.5rem',
            boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
          }}
        >
          {gonderildi ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1rem' }}>✨</span>
              <h2 style={{ color: '#f8fafc', fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Mesajınız Gönderildi!
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: 1.6 }}>
                Bizimle iletişime geçtiğiniz için teşekkür ederiz. En kısa sürede e-posta adresiniz üzerinden dönüş
                yapacağız.
              </p>
              <button
                onClick={() => setGonderildi(false)}
                className={styles.btnPrimary}
                style={{ padding: '0.75rem 2rem' }}
              >
                Yeni Mesaj Yaz
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className={styles.label}>Adınız Soyadınız</label>
                <input
                  type="text"
                  required
                  className={styles.inputField}
                  placeholder="Ahmet Yılmaz"
                  value={ad}
                  onChange={(e) => setAd(e.target.value)}
                />
              </div>

              <div>
                <label className={styles.label}>E-posta Adresiniz</label>
                <input
                  type="email"
                  required
                  className={styles.inputField}
                  placeholder="ahmet@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className={styles.label}>Mesajınız</label>
                <textarea
                  required
                  rows={4}
                  className={styles.inputField}
                  placeholder="Mesajınızı buraya yazınız..."
                  style={{ resize: 'vertical', minHeight: '100px' }}
                  value={mesaj}
                  onChange={(e) => setMesaj(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={yukleniyor}
                className={styles.btnPrimary}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  cursor: yukleniyor ? 'not-allowed' : 'pointer',
                  opacity: yukleniyor ? 0.8 : 1,
                  marginTop: '0.5rem',
                }}
              >
                {yukleniyor ? 'Gönderiliyor...' : '✉️ Mesajı Gönder'}
              </button>
            </form>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <Link
              href="/fizik-yildizi"
              style={{ color: '#94a3b8', fontSize: '0.9rem', textDecoration: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#8b5cf6')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
            >
              ← Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
