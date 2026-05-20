"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { categories, calculators, getCalculatorBySlug } from "@/data/calculators";
import { AdPlaceholder } from "@/components/AdPlaceholder";
import { CategoryIcon } from "@/components/CategoryIcon";
import styles from "./page.module.css";

const POPULAR_TOOLS = [
  { slug: "doviz-altin-hesaplama", title: "Altın", icon: "🪙" },
  { slug: "gelir-vergisi", title: "Vergi", icon: "🧾" },
  { slug: "mtv-hesaplama", title: "MTV", icon: "🚗" },
  { slug: "vadeli-mevduat", title: "Mevduat", icon: "💰" },
  { slug: "vucut-kitle-endeksi", title: "VKI", icon: "⚖️" },
  { slug: "yks-puan", title: "YKS", icon: "📚" },
  { slug: "lgs-puan", title: "LGS", icon: "🎓" },
  { slug: "kredi-hesaplama", title: "Kredi", icon: "🏦" },
  { slug: "enflasyon", title: "Enflasyon", icon: "📈" },
  { slug: "kelime-sayaci", title: "Kelime", icon: "✍️" },
  { slug: "sifre-olusturucu", title: "Şifre", icon: "🔑" },
  { slug: "2048", title: "2048", icon: "🎮" },
  { slug: "meb-ek-ders-hesaplama", title: "Ek Ders", icon: "👨‍🏫" },
];

const hexToRgb = (hex?: string) => {
  if (!hex) return "37, 99, 235";
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : "37, 99, 235";
};

export default function Home() {
  const [recentTools, setRecentTools] = useState<any[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("recent_calculators") || "[]");
      const mappedTools = stored.map((slug: string) => getCalculatorBySlug(slug)).filter(Boolean);
      setRecentTools(mappedTools);
    } catch (e) {}
  }, []);

  return (
    <div className={styles.homeContainer}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.badgeGlow}>
            <span className={styles.badgeGlowDot}></span>
            Tüm araçlar ücretsiz
          </div>
          <h1 className={styles.title}>
            Türkiye&apos;nin En Kapsamlı<br />Hesaplama Platformu
          </h1>
          <p className={styles.subtitle}>
            Finans, eğitim, sağlık ve daha fazlası. {calculators.length}+ profesyonel araç tek bir çatıda.
          </p>
          <div className={styles.heroActions}>
            <Link href="#tools" className="hero-btn-primary" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>Sistemi Keşfet →</Link>
            <Link href="/converter" className="hero-btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>Belge Dönüştürme</Link>
          </div>
        </div>
      </section>

      <div className="container" style={{ padding: "3rem 1.5rem 1rem" }}>
         <AdPlaceholder type="leaderboard" />
      </div>

      {/* Popular Tools Marquee */}
      <section className={styles.section} style={{ padding: "0 0 2rem" }}>
        <div className="container">
          <h2 className={styles.sectionTitle} style={{ marginBottom: "1.5rem", paddingLeft: "1.5rem" }}>⭐ Popüler Araçlar</h2>
        </div>
        <div className={styles.marqueeContainer}>
          <div className={styles.marqueeRow}>
            {[...POPULAR_TOOLS, ...POPULAR_TOOLS, ...POPULAR_TOOLS].map((tool, index) => (
              <Link key={`${tool.slug}-${index}`} href={`/hesapla/${tool.slug}`} className={styles.popularCard}>
                <div className={styles.popularIcon}>{tool.icon}</div>
                <span className={styles.popularTitle}>{tool.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Category Listings */}
      <section id="tools" className={styles.section} style={{ paddingTop: 0 }}>
        <div className="container">
          <AdPlaceholder type="fluid" style={{ marginBottom: '2.5rem' }} />
          
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Kategorilere Göz Atın</h2>
            <span className={styles.sectionBadge}>{categories.length} Kategori Mevcut</span>
          </div>

          {/* Desktop Responsive Grid */}
          <div className={styles.desktopGrid}>
            {categories.map((cat) => {
              const toolCount = calculators.filter(c => c.categoryId === cat.id).length;
              return (
                <Link
                  key={cat.id}
                  href={`/kategori/${cat.slug}`}
                  className={styles.categoryCard}
                  style={{
                    "--card-accent": cat.color || "var(--accent-primary)",
                    "--card-accent-rgb": hexToRgb(cat.color),
                  } as React.CSSProperties}
                >
                  <div className={styles.cardHeader}>
                     <div className={styles.iconBg}>
                       <CategoryIcon id={cat.id} size={24} color="white" />
                     </div>
                     <span className={styles.cardBadge}>{toolCount} Araç</span>
                  </div>
                  <h3 className={styles.cardName}>{cat.name}</h3>
                  <p className={styles.cardDesc}>{cat.description}</p>
                </Link>
              );
            })}
          </div>

          {/* Mobile Category List */}
          <div className={styles.mobileList}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Kategori Başlıkları</span>
              <Link href="/kategoriler" className={styles.sectionLink}>Tümünü Gör</Link>
            </div>
            {categories.slice(0, 12).map((cat) => {
              const toolCount = calculators.filter(c => c.categoryId === cat.id).length;
              return (
                <Link
                  key={cat.id}
                  href={`/kategori/${cat.slug}`}
                  className={styles.categoryCardCompact}
                  style={{
                    "--card-accent": cat.color || "var(--accent-primary)",
                    "--card-accent-rgb": hexToRgb(cat.color),
                  } as React.CSSProperties}
                >
                  <div className={styles.iconCompact}>
                    <CategoryIcon id={cat.id} size={22} strokeWidth={2.5} color={cat.color} />
                  </div>
                  <div className={styles.metaCompact}>
                    <div className={styles.nameCompact}>{cat.name}</div>
                    <div className={styles.descCompact}>{toolCount} profesyonel araç</div>
                  </div>
                  <div className={styles.arrowCompact}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
          
          <div style={{ marginTop: '4rem' }}>
            <h3 className={styles.recommendedTitle}>Sizin İçin Önerilenler</h3>
            <AdPlaceholder type="multiplex" />
          </div>
        </div>
      </section>

      {/* Floating Bottom Navigation */}
      <div className={styles.floatingNav}>
        <Link href="/" className={`${styles.floatingLink} ${styles.floatingLinkActive}`}>🏠</Link>
        <Link href="/counters" className={styles.floatingLink}>⏱️</Link>
        <Link href="/calendar" className={styles.floatingLink}>📅</Link>
        <Link href="/notepad" className={styles.floatingLink}>📝</Link>
        <Link href="/converter" className={styles.floatingLink}>📄</Link>
      </div>
    </div>
  );
}
