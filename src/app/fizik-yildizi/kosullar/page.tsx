'use client';

import Link from 'next/link';
import styles from '../fizik.module.css';

export default function KosullarPage() {
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
            📋 Kullanım Şartları
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>
            Platformumuzu kullanırken uymanız gereken temel kurallar ve şartlar.
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
            1. Kabul Edilme
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Fizik Yıldızı platformuna üye olarak ve hizmetlerimizden yararlanarak, bu belgede yer alan tüm kullanım
            şartlarını kabul etmiş sayılırsınız. Şartları kabul etmiyorsanız lütfen platformu kullanmayınız.
          </p>

          <h2 style={{ color: '#f8fafc', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            2. Fikri Mülkiyet
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Fizik Yıldızı içerisindeki tüm konu anlatımları, soru bankaları, özel formüller, simülasyon motorları ve
            grafik tasarımları platformumuzun fikri mülkiyetidir. Ticari amaçlarla kopyalanamaz, çoğaltılamaz veya
            paylaşılamaz.
          </p>

          <h2 style={{ color: '#f8fafc', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            3. Hesap Güvenliği
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Üyelerimizin hesap bilgilerinin ve şifrelerinin gizliliğini korumak kendi sorumluluğundadır. Hesabınızın
            yetkisiz kullanımı durumunda hemen yöneticilerimizle iletişime geçmelisiniz.
          </p>

          <h2 style={{ color: '#f8fafc', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            4. Hizmet Değişiklikleri
          </h2>
          <p style={{ marginBottom: '2rem' }}>
            Fizik Yıldızı platformu, müfredat değişiklikleri veya teknik güncellemeler doğrultusunda eğitim
            içeriklerini, simülasyonları veya test formatlarını önceden bildirmeksizin değiştirme veya askıya alma
            hakkını saklı tutar.
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
