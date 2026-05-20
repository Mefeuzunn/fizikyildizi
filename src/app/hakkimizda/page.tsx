import Link from "next/link";
import type { Metadata } from "next";
import { calculators, categories } from "@/data/calculators";
import styles from "./hakkimizda.module.css";

export const metadata: Metadata = {
  title: "Hakkımızda | Kalkula",
  description: "Kalkula — Türkiye'nin en kapsamlı ücretsiz hesaplama platformu hakkında bilgi edinin.",
};

export default function Hakkimizda() {
  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>Ana Sayfa</Link>
        <span>›</span>
        <span>Hakkımızda</span>
      </nav>

      {/* Hero */}
      <div className={styles.hero}>
        <h1 className={styles.title}>
          Kalkula Hakkında
        </h1>
        <p className={styles.subtitle}>
          Kalkula, Türkiye&apos;nin en kapsamlı ücretsiz hesaplama platformudur. 
          Finanstan eğitime, sağlıktan muhasebeye kadar {calculators.length}&apos;ten fazla profesyonel 
          hesaplama aracını tek bir yerde sunuyoruz.
        </p>
      </div>

      {/* Mission */}
      <div className={styles.missionCard}>
        <h2 className={styles.missionTitle}>🎯 Misyonumuz</h2>
        <p className={styles.missionText}>
          Karmaşık hesaplamaları herkes için erişilebilir ve anlaşılır kılmak. 
          İster kredi hesaplıyor, ister sınav puanınızı öğreniyor, ister altın yatırımınızı 
          analiz ediyor olun — Kalkula her adımda yanınızda.
        </p>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {[
          { value: `${calculators.length}+`, label: "Hesaplama Aracı", icon: "🧮" },
          { value: `${categories.length}`, label: "Kategori", icon: "📂" },
          { value: "%100", label: "Ücretsiz", icon: "🆓" },
          { value: "%99.9", label: "Doğruluk Oranı", icon: "✅" },
        ].map(s => (
          <div key={s.label} className={styles.statCard}>
            <div className={styles.statIcon}>{s.icon}</div>
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Values */}
      <h2 className={styles.sectionTitle}>Değerlerimiz</h2>
      <div className={styles.valuesGroup}>
        {[
          { title: "🔒 Güvenilirlik", text: "Tüm hesaplama formülleri TCMB, MEB ve ÖSYM gibi resmi kaynaklardan derlenmektedir." },
          { title: "⚡ Hız", text: "Hiçbir hesaplama aracımız sunucu gerektirmez — tüm işlemler anlık tarayıcınızda (Client-side) gerçekleşir." },
          { title: "🆓 Ücretsizlik", text: "Kalkula'daki tüm araçlara kayıt olmadan, sınırsız biçimde erişebilirsiniz." },
          { title: "🔐 Gizlilik", text: "Girdiğiniz veriler hiçbir sunucuya gönderilmez; tüm veriler yalnızca cihazınızda kalır." },
        ].map(v => (
          <div key={v.title} className={styles.valueCard}>
            <h3 className={styles.valueTitle}>{v.title}</h3>
            <p className={styles.valueText}>{v.text}</p>
          </div>
        ))}
      </div>

      {/* Developer & Contact */}
      <h2 className={styles.sectionTitle}>Geliştirici & İletişim</h2>
      <div className={styles.developerCard}>
        <div className={styles.devItem}>
           <div className={styles.devIcon}>👤</div>
           <div>
              <div className={styles.devLabel}>Geliştirici</div>
              <div className={styles.devValue}>MEHMET EFE UZUN</div>
           </div>
        </div>
        <div className={styles.devItem}>
           <div className={styles.devIcon}>✉️</div>
           <div>
              <div className={styles.devLabel}>İletişim</div>
              <Link href="mailto:mefeuzunn@gmail.com" className={styles.devLink}>
                mefeuzunn@gmail.com
              </Link>
           </div>
        </div>
      </div>

      {/* CTA */}
      <div className={styles.ctaCard}>
        <h2 className={styles.ctaTitle}>Hesaplamaya Başlayın</h2>
        <p className={styles.ctaText}>{calculators.length}+ ücretsiz araçtan dilediğinizi hemen kullanın.</p>
        <Link href="/" className={styles.ctaButton}>
          Araçları Keşfet →
        </Link>
      </div>
    </div>
  );
}
