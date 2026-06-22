'use client';

import Link from 'next/link';
import styles from '../fizik.module.css';

export default function GizlilikPage() {
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
      <div style={{ width: '100%', maxWidth: '800px', animation: 'fadeInUp 0.5s ease' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
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
            🔒 Gizlilik Politikası
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>
            Kişisel verilerinizin korunması ve güvenliği bizim için önemlidir.
          </p>
        </div>

        {/* Content Card */}
        <div
          className={styles.glassCardNohover}
          style={{
            padding: '2.5rem',
            boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
            lineHeight: 1.8,
            color: '#cbd5e1',
          }}
        >
          <h2 style={{ color: '#f8fafc', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            1. Toplanan Veriler
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Fizik Yıldızı platformuna üye olurken adınız, soyadınız, e-posta adresiniz, okul numaranız ve sınıf
            düzeyiniz gibi temel bilgileri kaydederiz. Bu veriler, size adaptif öğrenme deneyimini sunabilmek ve
            ilerlemenizi takip edebilmek adına kullanılır.
          </p>

          <h2 style={{ color: '#f8fafc', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            2. Verilerin Kullanımı
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Toplanan veriler yalnızca öğrenme motorumuz tarafından performans analizinizi yapmak, eksiklerinizi
            belirlemek ve sınıf öğretmeninizin ilerlemenizi takip edebilmesini sağlamak amacıyla kullanılır. Üçüncü
            şahıslarla asla paylaşılmaz veya satılmaz.
          </p>

          <h2 style={{ color: '#f8fafc', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            3. Çerezler (Cookies)
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Platformumuzda yalnızca oturum yönetimi ve kullanıcı tercihlerini hatırlamak amacıyla gerekli çerezler
            kullanılmaktadır. Reklam veya pazarlama amaçlı izleme çerezleri barındırılmamaktadır.
          </p>

          <h2 style={{ color: '#f8fafc', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            4. Güvenlik
          </h2>
          <p style={{ marginBottom: '2rem' }}>
            Kullanıcı şifreleriniz ve verileriniz güvenli hashing algoritmalarıyla korunmakta ve tarayıcınız ile
            sunucularımız arasındaki veri trafiği SSL şifreleme protokolüyle güvence altına alınmaktadır.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link
              href="/fizik-yildizi"
              className={styles.btnSecondary}
              style={{ padding: '0.75rem 2rem' }}
            >
              ← Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
