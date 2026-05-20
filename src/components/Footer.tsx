import Link from "next/link";
import { categories } from "@/data/calculators";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div className={styles.brandContainer}>
              <div className={styles.brandIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2.5" fill="var(--accent-glow)" />
                  <path d="M8 6v12M16 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className={styles.brandText}>Kalkula</span>
            </div>
            <p className={styles.brandDesc}>
              Kalkula, Türkiye&apos;nin en kapsamlı ücretsiz hesaplama platformudur. Finanstan eğitime, sağlıktan muhasebeye kadar 160&apos;tan fazla profesyonel hesaplama aracını tek bir yerde sunuyoruz.
            </p>
            <div className={styles.statusRow}>
              <div className={styles.statusDot}></div>
              <span className={styles.statusText}>Tüm sistemler çalışıyor</span>
            </div>
          </div>

          {/* Kategoriler */}
          <div>
            <h4 className={styles.sectionTitle}>Kategoriler</h4>
            <ul className={styles.list}>
              {categories.slice(0, 6).map(cat => (
                <li key={cat.id}>
                  <Link href={`/kategori/${cat.slug}`} className="footer-link">{cat.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Araçlar */}
          <div>
            <h4 className={styles.sectionTitle}>Hızlı Araçlar</h4>
            <ul className={styles.list}>
              {[
                { href: "/calculator", label: "Hesap Makinesi" },
                { href: "/notepad", label: "Not Defteri" },
                { href: "/counters", label: "Kronometre" },
                { href: "/converter", label: "Belge Dönüştürücü" },
                { href: "/password-generator", label: "Şifre Oluşturucu" },
              ].map(t => (
                <li key={t.href}>
                  <Link href={t.href} className="footer-link">{t.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Bilgi */}
          <div>
            <h4 className={styles.sectionTitle}>Bilgi</h4>
            <ul className={styles.list}>
              {[
                { label: "Hakkımızda", href: "/hakkimizda" },
                { label: "Gizlilik Politikası", href: "/gizlilik" },
                { label: "SSS", href: "/sss" },
                { label: "İletişim", href: "/iletisim" },
                { label: "Hesap Makinesi", href: "/calculator" },
                { label: "Takvim", href: "/calendar" },
              ].map(item => (
                <li key={item.href}>
                  <Link href={item.href} className="footer-link">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.bottomSection}>
          <div className={styles.metaRow}>
             <p className={styles.copyright}>
               © 2026 Kalkula SaaS Hub. Tüm hakları saklıdır. Bu platformdaki tüm hesaplama motorları ve görsel bileşenler fikri mülkiyet koruması altındadır. | Geliştirici: <Link href="/hakkimizda" style={{ color: "var(--accent-primary)", fontWeight: 700 }}>Mehmet Efe Uzun</Link>
             </p>
             <div className={styles.badges}>
                <div title="SSL Secured" className={`${styles.badge} ${styles.badgeSsl}`}>
                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                   SSL SECURED
                </div>
                <div title="KVKK Compliant" className={`${styles.badge} ${styles.badgeKvkk}`}>
                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                   KVKK / GDPR
                </div>
                <div title="Privacy First" className={`${styles.badge} ${styles.badgeLocal}`}>
                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17" /></svg>
                   LOCAL CALC
                </div>
             </div>
          </div>
          
          <div className={styles.disclaimerRow}>
             <p className={styles.disclaimer}>
               * Kalkula, girilen hiçbir veriyi sunucularında saklamaz. Tüm hesaplamalar uçtan uca şifreli bir şekilde tarayıcınızda (Client-side) gerçekleşir. Gizliliğiniz bizim için en üst önceliktir.
             </p>
             <div className={styles.links}>
                <Link href="/gizlilik" className={styles.bottomLink}>Gizlilik Politikası</Link>
                <Link href="/kullanim-sartlari" className={styles.bottomLink}>Kullanım Şartları</Link>
                <Link href="/iletisim" className={styles.bottomLink}>İletişim</Link>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
