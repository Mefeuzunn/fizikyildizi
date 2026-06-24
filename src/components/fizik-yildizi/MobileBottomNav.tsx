'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Beaker, User, BookOpen } from 'lucide-react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import styles from '@/app/fizik-yildizi/fizik.module.css';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavClick = async (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (err) {
      // Ignore if not on a mobile device or plugin not available
    }
    router.push(path);
  };

  const isSim = pathname?.includes('/simulasyonlar');
  const isProfile = pathname?.includes('/profil');
  const isDers = pathname?.includes('/dersler');
  const isHome = !isSim && !isProfile && !isDers && pathname?.startsWith('/fizik-yildizi');

  return (
    <nav className={styles.bottomNav}>
      <div className={styles.bottomNavInner}>
        <a href="/fizik-yildizi" onClick={(e) => handleNavClick(e, '/fizik-yildizi')} className={`${styles.bottomNavItem} ${isHome ? styles.active : ''}`}>
          <Home size={24} />
          <span>Ana Sayfa</span>
        </a>
        <a href="/fizik-yildizi/simulasyonlar" onClick={(e) => handleNavClick(e, '/fizik-yildizi/simulasyonlar')} className={`${styles.bottomNavItem} ${isSim ? styles.active : ''}`}>
          <Beaker size={24} />
          <span>Laboratuvar</span>
        </a>
        <a href="/fizik-yildizi/dersler" onClick={(e) => handleNavClick(e, '/fizik-yildizi/dersler')} className={`${styles.bottomNavItem} ${isDers ? styles.active : ''}`}>
          <BookOpen size={24} />
          <span>Dersler</span>
        </a>
        <a href="/fizik-yildizi/profil" onClick={(e) => handleNavClick(e, '/fizik-yildizi/profil')} className={`${styles.bottomNavItem} ${isProfile ? styles.active : ''}`}>
          <User size={24} />
          <span>Profil</span>
        </a>
      </div>
    </nav>
  );
}
