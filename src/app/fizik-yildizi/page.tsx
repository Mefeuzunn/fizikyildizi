'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styles from './fizik.module.css';

/* ---- Floating formula elements ---- */
const FORMULAS = [
  { text: 'E = mc²', x: '8%', y: '20%', size: 1.1, delay: 0 },
  { text: 'F = ma', x: '85%', y: '15%', size: 1.0, delay: 0.5 },
  { text: 'v = λf', x: '5%', y: '65%', size: 0.95, delay: 1.0 },
  { text: 'PV = nRT', x: '88%', y: '55%', size: 0.9, delay: 1.5 },
  { text: 'W = Fd', x: '12%', y: '80%', size: 0.85, delay: 0.7 },
  { text: 'τ = Iα', x: '80%', y: '78%', size: 0.85, delay: 1.2 },
  { text: 'p = mv', x: '50%', y: '8%', size: 0.9, delay: 0.3 },
  { text: 'ΔU = Q + W', x: '70%', y: '90%', size: 0.8, delay: 1.8 },
];

/* ---- Stats data ---- */
const STATS = [
  { value: '500+', label: 'Soru Bankası', icon: '📝' },
  { value: '4', label: 'Sınıf Düzeyi', icon: '🏫' },
  { value: '20+', label: 'Konu Başlığı', icon: '📚' },
  { value: 'Yapay Zeka', label: 'Adaptif Öğrenme', icon: '🤖' },
];

/* ---- Features ---- */
const FEATURES = [
  {
    icon: '🧪',
    title: 'Etkileşimli Simülasyonlar',
    desc: 'Fizik deneylerini ekranda yaşa. Serbest düşme, eğik atış, harmonik hareket ve daha fazlasını görsel olarak keşfet.',
    color: '#7c3aed',
    glow: 'rgba(124,58,237,0.25)',
  },
  {
    icon: '🤖',
    title: 'Adaptif Öğrenme',
    desc: 'Yapay zeka algoritmamız zayıf yönlerini tespit eder, sana özel çalışma planı oluşturur ve eksiklerini kapatır.',
    color: '#06b6d4',
    glow: 'rgba(6,182,212,0.25)',
  },
  {
    icon: '📊',
    title: 'Detaylı Analiz',
    desc: 'Öğretmenin sınıfını takip eder, konu bazlı başarı grafiklerin ve ilerlemen anlık raporlanır.',
    color: '#10b981',
    glow: 'rgba(16,185,129,0.25)',
  },
];

/* ---- Class topics ---- */
const SINIFLAR = [
  {
    sinif: 9,
    emoji: '🌱',
    renk: '#10b981',
    topicCount: 8,
    topics: ['Fizik Bilimine Giriş', 'Madde ve Özellikleri', 'Kuvvet ve Hareket', 'Enerji ve İş', 'Isı ve Sıcaklık', 'Elektrostatik', 'Optik Temel', 'Dalgalar'],
  },
  {
    sinif: 10,
    emoji: '⚡',
    renk: '#f59e0b',
    topicCount: 7,
    topics: ['Newton Yasaları', 'Basit Harmonik Hareket', 'Elektrik Akımı', 'Manyetizma', 'Optik', 'Basıncın Özellikleri', 'Kaldırma Kuvveti'],
  },
  {
    sinif: 11,
    emoji: '🔬',
    renk: '#7c3aed',
    topicCount: 6,
    topics: ['Çembersel Hareket', 'Yerçekimi', 'İmpuls-Momentum', 'Tork ve Denge', 'Elektromanyetik Endüksiyon', 'Termodinamik'],
  },
  {
    sinif: 12,
    emoji: '🚀',
    renk: '#06b6d4',
    topicCount: 5,
    topics: ['Modern Fizik', 'Atom Fiziği', 'Nükleer Fizik', 'Dalga Mekaniği', 'Özel Görelilik'],
  },
];

/* ---- How it works ---- */
const STEPS = [
  { no: '01', icon: '📝', title: 'Kayıt Ol', desc: 'Ücretsiz hesap oluştur, sınıfını seç' },
  { no: '02', icon: '📖', title: 'Konuyu Öğren', desc: 'İnteraktif anlatımlar ve simülasyonlar' },
  { no: '03', icon: '✅', title: 'Test Çöz', desc: 'Adaptif sorularla kendini sına' },
  { no: '04', icon: '📈', title: 'Analiz Et', desc: 'Eksiklerini gör, gelişimini takip et' },
];

/* ---- CTA cards ---- */
const CTA_CARDS = [
  {
    icon: '🎓',
    title: 'Öğrenciyim',
    color: '#7c3aed',
    glow: 'rgba(124,58,237,0.3)',
    link: '/fizik-yildizi/kayit?rol=ogrenci',
    btnLabel: 'Hemen Başla',
    features: [
      'Konu anlatımları ve video dersler',
      'Yapay zeka destekli soru çözümü',
      'Sınav simülasyonları (YKS/TYT)',
      'Kişisel gelişim grafiği',
      '500+ soru bankası',
    ],
  },
  {
    icon: '📚',
    title: 'Öğretmenim',
    color: '#06b6d4',
    glow: 'rgba(6,182,212,0.3)',
    link: '/fizik-yildizi/kayit?rol=ogretmen',
    btnLabel: 'Sınıfımı Oluştur',
    features: [
      'Sınıf yönetim paneli',
      'Öğrenci ilerlemesi takibi',
      'Ödev ve test atama',
      'Detaylı performans raporları',
      'Özelleştirilebilir müfredat',
    ],
  },
];

/* ---- Tiny hero star field (inline CSS) ---- */
const heroStarPositions = Array.from({ length: 120 }, (_, i) => {
  const seed = (i + 1) * 4133;
  return {
    x: (seed * 7 % 100),
    y: (seed * 11 % 100),
    size: i % 5 === 0 ? 2.5 : i % 3 === 0 ? 1.5 : 1,
    dur: 2 + (i % 4) + (i % 7) * 0.4,
    del: (i * 0.12) % 5,
    op: 0.2 + (i % 6) * 0.12,
  };
});

export default function FizikYildizPage() {
  const [visible, setVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ color: '#f8fafc', overflowX: 'hidden' }}>

      {/* ======================================================
          HERO SECTION
         ====================================================== */}
      <section
        ref={heroRef}
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6rem 1.5rem 4rem',
          overflow: 'hidden',
        }}
      >
        {/* Hero star field */}
        <div
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}
        >
          {heroStarPositions.map((s, i) => (
            <span
              key={i}
              style={{
                position: 'absolute',
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                borderRadius: '50%',
                background: 'white',
                opacity: s.op,
                animation: `twinkle ${s.dur}s ${s.del}s ease-in-out infinite`,
              }}
            />
          ))}
          {/* Gradient orbs */}
          <div style={{
            position: 'absolute', top: '10%', left: '-10%',
            width: '500px', height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
          }} />
          <div style={{
            position: 'absolute', bottom: '5%', right: '-10%',
            width: '400px', height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
          }} />
        </div>

        {/* Floating formula elements */}
        {FORMULAS.map((f, i) => (
          <div
            key={i}
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: f.x,
              top: f.y,
              fontSize: `${f.size}rem`,
              color: i % 2 === 0 ? 'rgba(167,139,250,0.35)' : 'rgba(103,232,249,0.3)',
              fontWeight: 700,
              fontFamily: 'monospace',
              animation: `float ${4 + i * 0.5}s ${f.delay}s ease-in-out infinite`,
              userSelect: 'none',
              pointerEvents: 'none',
              zIndex: 0,
              letterSpacing: '0.05em',
              textShadow: i % 2 === 0 ? '0 0 20px rgba(167,139,250,0.4)' : '0 0 20px rgba(103,232,249,0.3)',
            }}
          >
            {f.text}
          </div>
        ))}

        {/* Hero content */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            maxWidth: '900px',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div className={`${styles.badge} ${styles.badgeCyan}`} style={{ marginBottom: '1.5rem' }}>
            🚀 Türkiye&apos;nin En İyi Fizik Eğitim Platformu
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.4rem, 7vw, 5rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              letterSpacing: '-0.02em',
            }}
          >
            <span className={styles.shimmerText}>✨ Fiziği Yıldız Gibi</span>
            <br />
            <span style={{ color: '#f8fafc', display: 'inline-block', marginTop: '0.25em' }}>Öğren!</span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              color: '#94a3b8',
              maxWidth: '650px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.75,
              opacity: visible ? 1 : 0,
              transition: 'opacity 0.8s 0.3s',
            }}
          >
            Lise fizik müfredatı, etkileşimli simülasyonlar ve kişisel
            adaptif testlerle öğrenmek hiç bu kadar eğlenceli olmamıştı.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              opacity: visible ? 1 : 0,
              transition: 'opacity 0.8s 0.5s',
            }}
          >
            <Link href="/fizik-yildizi/kayit" className={styles.btnPrimary} style={{ fontSize: '1.05rem', padding: '1rem 2.25rem' }}>
              🚀 Hemen Başla (Bedava)
            </Link>
            <Link href="#nasil-calisir" className={styles.btnSecondary} style={{ fontSize: '1.05rem', padding: '1rem 2.25rem' }}>
              ▶ Nasıl Çalışır?
            </Link>
          </div>

          {/* Social proof */}
          <div
            style={{
              marginTop: '3rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              opacity: visible ? 1 : 0,
              transition: 'opacity 0.8s 0.7s',
            }}
          >
            <div style={{ display: 'flex', gap: '-0.5rem' }}>
              {['🟣', '🔵', '🟢', '🟡'].map((emoji, i) => (
                <span
                  key={i}
                  style={{
                    width: '32px', height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                    border: '2px solid #050a1a',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem',
                    marginLeft: i > 0 ? '-8px' : 0,
                    position: 'relative',
                    zIndex: 4 - i,
                  }}
                >
                  {emoji}
                </span>
              ))}
            </div>
            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              <strong style={{ color: '#f8fafc' }}>2.400+</strong> öğrenci zaten aramızda
            </span>
            <span style={{ color: '#f59e0b', fontSize: '0.9rem' }}>⭐⭐⭐⭐⭐ 4.9/5</span>
          </div>
        </div>
      </section>

      {/* ======================================================
          STATS BAR
         ====================================================== */}
      <section style={{ padding: '0 1.5rem 5rem', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div
            className={styles.glassCardNohover}
            style={{
              padding: '0.5rem',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '20px',
            }}
          >
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0',
            }}>
              {STATS.map((stat, i) => (
                <div
                  key={i}
                  style={{
                    textAlign: 'center',
                    padding: '1.75rem 1rem',
                    borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                  }}
                >
                  <div style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>{stat.icon}</div>
                  <div style={{
                    fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                    fontWeight: 900,
                    background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    lineHeight: 1.2,
                  }}>
                    {stat.value}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.25rem', fontWeight: 500 }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr className={styles.gradientDivider} />

      {/* ======================================================
          FEATURES SECTION
         ====================================================== */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={`${styles.badge} ${styles.badgeCyan}`} style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>✨ Neden Fizik Yıldızı?</span>
          </div>
          <h2 className={styles.sectionTitle}>
            <span className={styles.gradientText}>Öğrenmeyi</span> Farklı Yapan
          </h2>
          <p className={styles.sectionSubtitle}>
            Geleneksel ezber yöntemlerini bırak. Etkileşimli, adaptif ve kişiselleştirilmiş
            öğrenme deneyimini keşfet.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}>
            {FEATURES.map((feat, i) => (
              <div
                key={i}
                className={styles.glassCard}
                style={{ padding: '2rem' }}
              >
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: `${feat.glow}`,
                  border: `1px solid ${feat.color}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.75rem',
                  marginBottom: '1.25rem',
                  boxShadow: `0 8px 25px ${feat.glow}`,
                }}>
                  {feat.icon}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '0.6rem', color: '#f8fafc' }}>
                  {feat.title}
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.7 }}>
                  {feat.desc}
                </p>
                <div style={{
                  marginTop: '1.5rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: feat.color,
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}>
                  Daha fazla bilgi →
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className={styles.gradientDivider} />

      {/* ======================================================
          CLASS TOPICS PREVIEW
         ====================================================== */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.gradientText}>Sınıfa Göre</span> Konular
          </h2>
          <p className={styles.sectionSubtitle}>
            9. sınıftan 12. sınıfa kadar tüm müfredat konuları, simülasyonlar ve testlerle seni bekliyor.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
          }}>
            {SINIFLAR.map((sinif) => (
              <Link
                key={sinif.sinif}
                href={`/fizik-yildizi/ogrenci/konular?sinif=${sinif.sinif}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  className={styles.glassCard}
                  style={{ padding: '1.75rem', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <span style={{ fontSize: '2rem' }}>{sinif.emoji}</span>
                    <div>
                      <div style={{
                        fontWeight: 800,
                        fontSize: '1.2rem',
                        color: sinif.renk,
                      }}>
                        {sinif.sinif}. Sınıf
                      </div>
                      <div style={{ color: '#64748b', fontSize: '0.8rem' }}>
                        {sinif.topicCount} konu
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {sinif.topics.slice(0, 4).map((topic) => (
                      <span
                        key={topic}
                        style={{
                          fontSize: '0.72rem',
                          padding: '0.25rem 0.6rem',
                          borderRadius: '6px',
                          background: `${sinif.renk}18`,
                          border: `1px solid ${sinif.renk}30`,
                          color: sinif.renk,
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {topic}
                      </span>
                    ))}
                    {sinif.topics.length > 4 && (
                      <span style={{
                        fontSize: '0.72rem',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '6px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#64748b',
                        fontWeight: 600,
                      }}>
                        +{sinif.topics.length - 4} daha
                      </span>
                    )}
                  </div>

                  <div style={{
                    marginTop: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <span style={{ color: '#64748b', fontSize: '0.82rem' }}>Konulara göz at</span>
                    <span style={{ color: sinif.renk, fontSize: '1rem' }}>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <hr className={styles.gradientDivider} />

      {/* ======================================================
          HOW IT WORKS
         ====================================================== */}
      <section className={styles.section} id="nasil-calisir">
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.gradientText}>Nasıl</span> Çalışır?
          </h2>
          <p className={styles.sectionSubtitle}>
            4 adımda başarıya giden yolu keşfet. Kayıt olmak 30 saniye sürer.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            position: 'relative',
          }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{ position: 'relative' }}>
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      top: '40px',
                      right: '-0.75rem',
                      width: '1.5rem',
                      height: '2px',
                      background: 'linear-gradient(90deg, rgba(124,58,237,0.4), rgba(6,182,212,0.4))',
                      zIndex: 0,
                    }}
                  />
                )}
                <div
                  className={styles.glassCardNohover}
                  style={{
                    padding: '1.75rem',
                    textAlign: 'center',
                    position: 'relative',
                  }}
                >
                  <div style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    color: '#7c3aed',
                    marginBottom: '0.75rem',
                    textTransform: 'uppercase',
                  }}>
                    ADIM {step.no}
                  </div>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    margin: '0 auto 1rem',
                    borderRadius: '16px',
                    background: 'rgba(124,58,237,0.15)',
                    border: '1px solid rgba(124,58,237,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.6rem',
                    animation: `float ${3 + i * 0.4}s ${i * 0.3}s ease-in-out infinite`,
                  }}>
                    {step.icon}
                  </div>
                  <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1rem' }}>
                    {step.title}
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.6 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className={styles.gradientDivider} />

      {/* ======================================================
          CTA SECTION — Öğrenci mi, Öğretmen mi?
         ====================================================== */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>
            Öğrenci misin,{' '}
            <span className={styles.gradientText}>Öğretmen mi?</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Her iki rol için de güçlü araçlar hazır. Rolünü seç, hemen başla.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            maxWidth: '800px',
            margin: '0 auto',
          }}>
            {CTA_CARDS.map((card, i) => (
              <div
                key={i}
                className={styles.glassCardNohover}
                style={{
                  padding: '2.25rem',
                  border: `1px solid ${card.color}30`,
                  boxShadow: `0 20px 50px ${card.glow}`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Background glow blob */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: '-40px',
                    right: '-40px',
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${card.glow} 0%, transparent 70%)`,
                  }}
                />

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{card.icon}</div>
                  <h3 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: '1.25rem', color: card.color }}>
                    {card.title}
                  </h3>

                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.75rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {card.features.map((feat, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
                        <span style={{ color: card.color, flexShrink: 0 }}>✓</span>
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={card.link}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      width: '100%',
                      padding: '0.875rem',
                      borderRadius: '12px',
                      background: `linear-gradient(135deg, ${card.color}, ${i === 0 ? '#06b6d4' : '#7c3aed'})`,
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '1rem',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                      boxShadow: `0 6px 20px ${card.glow}`,
                    }}
                  >
                    {card.btnLabel} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================
          FINAL CTA BANNER
         ====================================================== */}
      <section style={{ padding: '4rem 1.5rem', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div
            style={{
              padding: '3rem 2rem',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.15))',
              border: '1px solid rgba(124,58,237,0.3)',
              boxShadow: '0 30px 60px rgba(124,58,237,0.2)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at top right, rgba(6,182,212,0.1) 0%, transparent 60%)',
              }}
            />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{
                fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
                fontWeight: 900,
                marginBottom: '1rem',
                background: 'linear-gradient(135deg, #f8fafc, #a78bfa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Fiziği Yıldız Gibi Öğrenmeye Hazır mısın? 🌟
              </h2>
              <p style={{ color: '#94a3b8', marginBottom: '2rem', fontSize: '1.05rem', lineHeight: 1.7 }}>
                Ücretsiz kaydol, adaptif öğrenme yolculuğuna başla. Kredi kartı gerekmez.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/fizik-yildizi/kayit" className={styles.btnPrimary}>
                  🚀 Ücretsiz Başla
                </Link>
                <Link href="/fizik-yildizi/giris" className={styles.btnSecondary}>
                  Giriş Yap
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          FOOTER
         ====================================================== */}
      <footer
        style={{
          borderTop: '1px solid rgba(255,255,255,0.07)',
          padding: '2rem 1.5rem',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.3rem', animation: 'float 3s ease-in-out infinite' }}>⭐</span>
            <span style={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Fizik Yıldızı
            </span>
          </div>
          <div style={{ color: '#475569', fontSize: '0.85rem' }}>
            © 2025 Fizik Yıldızı. Tüm hakları saklıdır.
          </div>
          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              ['Gizlilik', '/fizik-yildizi/gizlilik'],
              ['Kullanım Şartları', '/fizik-yildizi/kosullar'],
              ['Hakkımızda', '/fizik-yildizi/hakkimizda'],
              ['İletişim', '/fizik-yildizi/iletisim'],
            ].map(([label, href]) => (
              <Link key={label} href={href} style={{ color: '#475569', fontSize: '0.82rem', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#8b5cf6')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </footer>

      {/* Inline CSS for twinkle animation (used by hero stars) */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-12px) rotate(2deg); }
          66% { transform: translateY(-6px) rotate(-1deg); }
        }
      `}</style>
    </div>
  );
}
