'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '@/app/fizik-yildizi/fizik.module.css';
import { Storage } from '@/lib/storage';

interface Kullanici {
  id: string;
  ad: string;
  soyad: string;
  email: string;
  rol: 'ogrenci' | 'ogretmen';
  sinif?: number;
}

export default function FizikNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [kullanici, setKullanici] = useState<Kullanici | null>(null);
  const [menuAcik, setMenuAcik] = useState(false);
  const [dropdownAcik, setDropdownAcik] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Dynamic Navigation Links
  const getNavLinks = () => {
    if (!kullanici) {
      return [
        { href: '/fizik-yildizi/ogrenci/konular', label: 'Konular' },
        { href: '/fizik-yildizi/simulasyonlar', label: 'Simülasyonlar' },
      ];
    }
    if (kullanici.rol === 'ogretmen') {
      return [
        { href: '/fizik-yildizi/ogretmen/dashboard', label: 'Dashboard' },
        { href: '/fizik-yildizi/ogretmen/sinif', label: 'Sınıflarım' },
        { href: '/fizik-yildizi/ogretmen/odev-ver', label: '📚 Ödev Ver' },
        { href: '/fizik-yildizi/simulasyonlar', label: 'Simülasyonlar' },
      ];
    }
    return [
      { href: '/fizik-yildizi/ogrenci/dashboard', label: 'Dashboard' },
      { href: '/fizik-yildizi/ogrenci/konular', label: 'Konular' },
      { href: '/fizik-yildizi/simulasyonlar', label: 'Simülasyonlar' },
      { href: '/fizik-yildizi/ogrenci/analiz', label: 'Analiz' },
      { href: '/fizik-yildizi/ogrenci/ligler', label: '🏆 Ligler' },
      { href: '/fizik-yildizi/ogrenci/duello', label: '⚔️ Düello' },
    ];
  };

  const navLinks = getNavLinks();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await Storage.get<string>('fizik_token');
      const kullaniciBilgi = await Storage.get<Kullanici>('fizik_kullanici');
      if (token && kullaniciBilgi) {
        setKullanici(kullaniciBilgi);
      } else {
        setKullanici(null);
      }
    };
    checkAuth();
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownAcik(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuAcik(false);
    setDropdownAcik(false);
  }, [pathname]);

  const handleCikis = async () => {
    await Storage.remove('fizik_token');
    await Storage.remove('fizik_kullanici');
    setKullanici(null);
    setDropdownAcik(false);
    router.push('/fizik-yildizi');
  };

  const getInitials = (kullanici: Kullanici) => {
    return `${kullanici.ad[0]}${kullanici.soyad[0]}`.toUpperCase();
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navInner}>
          {/* Logo */}
          <Link href="/fizik-yildizi" className={styles.logo}>
            <span className={styles.logoStar}>⭐</span>
            <span className={styles.logoText}>Fizik Yıldızı</span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className={styles.navLinks}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`${styles.navLink} ${isActive(link.href) ? styles.navLinkActive : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Auth Section */}
          <div className={styles.navAuth}>
            {kullanici ? (
              <div className={styles.userDropdown} ref={dropdownRef}>
                <button
                  onClick={() => setDropdownAcik(!dropdownAcik)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#f8fafc' }}
                >
                  <div className={styles.userAvatar}>
                    {getInitials(kullanici)}
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, display: 'none' }} className="desktop-only">
                    {kullanici.ad}
                  </span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" style={{ opacity: 0.6 }}>
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {dropdownAcik && (
                  <div className={styles.dropdownMenu}>
                    <div style={{ padding: '0.5rem 0.875rem', marginBottom: '0.25rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f8fafc' }}>
                        {kullanici.ad} {kullanici.soyad}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>
                        {kullanici.rol === 'ogrenci' ? `🎓 Öğrenci${kullanici.sinif ? ` · ${kullanici.sinif}. Sınıf` : ''}` : '📚 Öğretmen'}
                      </div>
                    </div>
                    <div className={styles.dropdownDivider} />
                                    {kullanici.rol === 'ogretmen' ? (
                      <>
                        <Link href="/fizik-yildizi/ogretmen/dashboard" className={styles.dropdownItem}>
                          <span>📊</span> Dashboard
                        </Link>
                        <Link href="/fizik-yildizi/ogretmen/sinif" className={styles.dropdownItem}>
                          <span>🏫</span> Sınıflarım
                        </Link>
                        <Link href="/fizik-yildizi/simulasyonlar" className={styles.dropdownItem}>
                          <span>🧪</span> Simülasyonlar
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link href="/fizik-yildizi/ogrenci/dashboard" className={styles.dropdownItem}>
                          <span>📊</span> Dashboard
                        </Link>
                        <Link href="/fizik-yildizi/simulasyonlar" className={styles.dropdownItem}>
                          <span>🧪</span> Simülasyonlar
                        </Link>
                        {kullanici.rol === 'ogrenci' && (
                    <>
                      <Link href="/fizik-yildizi/ogrenci/profil" className={styles.dropdownItem} onClick={() => setDropdownAcik(false)}>
                        <span style={{ fontSize: '1.1rem' }}>👤</span> Profilim
                      </Link>
                      <Link href="/fizik-yildizi/ogrenci/ayarlar" className={styles.dropdownItem} onClick={() => setDropdownAcik(false)}>
                        <span style={{ fontSize: '1.1rem' }}>⚙️</span> Ayarlar
                      </Link>
                    </>
                  )}
                        <Link href="/fizik-yildizi/ogrenci/ligler" className={styles.dropdownItem}>
                          <span>🏆</span> Ligler
                        </Link>
                        <Link href="/fizik-yildizi/ogrenci/duello" className={styles.dropdownItem}>
                          <span>⚔️</span> Bilgi Düellosu
                        </Link>
                      </>
                    )}
                    <div className={styles.dropdownDivider} />
                    <button onClick={handleCikis} className={`${styles.dropdownItem} ${styles.danger}`}>
                      <span>🚪</span> Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/fizik-yildizi/giris" className={styles.btnNavOutline}>
                  Giriş
                </Link>
                <Link href="/fizik-yildizi/kayit" className={styles.btnNavPrimary}>
                  <span>✨</span> Kayıt Ol
                </Link>
              </>
            )}

            {/* Hamburger */}
            <button
              className={styles.hamburger}
              onClick={() => setMenuAcik(!menuAcik)}
              aria-label="Menüyü aç/kapat"
            >
              <span
                className={styles.hamburgerLine}
                style={menuAcik ? { transform: 'rotate(45deg) translate(5px, 5px)' } : {}}
              />
              <span
                className={styles.hamburgerLine}
                style={menuAcik ? { opacity: 0 } : {}}
              />
              <span
                className={styles.hamburgerLine}
                style={menuAcik ? { transform: 'rotate(-45deg) translate(5px, -5px)' } : {}}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuAcik && (
          <>
            <motion.div
              className={styles.mobileMenuOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuAcik(false)}
            />
            <motion.div
              className={styles.mobileMenu}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${styles.mobileNavLink} ${isActive(link.href) ? styles.mobileNavLinkActive : ''}`}
                >
                  {link.label}
                </Link>
              ))}

              {kullanici ? (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ padding: '0.5rem 1rem', marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: 700, color: '#f8fafc' }}>{kullanici.ad} {kullanici.soyad}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{kullanici.email}</div>
                  </div>
                  {kullanici.rol === 'ogretmen' ? (
                    <>
                      <Link href="/fizik-yildizi/ogretmen/dashboard" className={styles.mobileNavLink}>📊 Dashboard</Link>
                      <Link href="/fizik-yildizi/ogretmen/sinif" className={styles.mobileNavLink}>🏫 Sınıflarım</Link>
                    </>
                  ) : (
                    <>
                      <Link href="/fizik-yildizi/ogrenci/dashboard" className={styles.mobileNavLink}>📊 Dashboard</Link>
                      <Link href="/fizik-yildizi/ogrenci/analiz" className={styles.mobileNavLink}>📈 Analizim</Link>
                      <Link href="/fizik-yildizi/ogrenci/sinif-forum" className={styles.mobileNavLink}>💬 Sınıf Forumu</Link>
                      <Link href="/fizik-yildizi/ogrenci/ligler" className={styles.mobileNavLink}>🏆 Ligler</Link>
                      <Link href="/fizik-yildizi/ogrenci/duello" className={styles.mobileNavLink}>⚔️ Bilgi Düellosu</Link>
                    </>
                  )}
                  <button
                    onClick={handleCikis}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '0.75rem 1rem', color: '#ef4444', background: 'none',
                      border: 'none', cursor: 'pointer', fontWeight: 500,
                      borderRadius: 8, fontSize: '0.9rem'
                    }}
                  >
                    🚪 Çıkış Yap
                  </button>
                </div>
              ) : (
                <div className={styles.mobileAuthButtons}>
                  <Link href="/fizik-yildizi/giris" className={styles.btnNavOutline} style={{ justifyContent: 'center' }}>
                    Giriş
                  </Link>
                  <Link href="/fizik-yildizi/kayit" className={styles.btnNavPrimary} style={{ justifyContent: 'center' }}>
                    ✨ Kayıt Ol
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
