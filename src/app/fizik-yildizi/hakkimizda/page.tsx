'use client';

import Link from 'next/link';
import styles from '../fizik.module.css';

export default function HakkimizdaPage() {
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
            ⭐ Hakkımızda
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>
            Fizik eğitimini daha erişilebilir, eğlenceli ve etkili hale getirmek için buradayız.
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
            Misyonumuz
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Fizik Yıldızı, lise düzeyindeki fizik konularını formüllerin ötesine geçerek etkileşimli
            simülasyonlar vasıtasıyla somutlaştırmayı amaçlar. Öğrencilerin ezber yapmadan fiziksel yasaların
            arkasındaki mantığı anlamalarını sağlarız.
          </p>

          <h2 style={{ color: '#f8fafc', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            Vizyonumuz
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Yapay zeka algoritmalarımız sayesinde her öğrencinin öğrenme hızına ve zayıf yönlerine adapte olan
            bireysel bir eğitim asistanı olmak. Eğitimde fırsat eşitliğini desteklemek amacıyla kaliteli ve
            görselleştirilmiş eğitimi her an her yerde ücretsiz sunmak.
          </p>

          <h2 style={{ color: '#f8fafc', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            Ekibimiz ve Teknoloji
          </h2>
          <p style={{ marginBottom: '2rem' }}>
            Platformumuz, fizik eğitimcileri, bilgisayar mühendisleri ve tasarımcılardan oluşan multidisipliner bir
            ekip tarafından geliştirilmiştir. HTML5 Canvas simülasyonları ve modern adaptif öğrenme algoritmalarıyla
            öğrencilere eşsiz bir deneyim yaşatır.
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
