'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Beaker, User, Store } from 'lucide-react';
import styles from '@/app/fizik-yildizi/fizik.module.css';

export default function MobileBottomNav() {
  const pathname = usePathname();

  const isSim = pathname?.includes('/simulasyonlar');
  const isProfile = pathname?.includes('/profil');
  const isStore = pathname?.includes('/magaza');
  const isHome = !isSim && !isProfile && !isStore && pathname?.startsWith('/fizik-yildizi');

  return (
    <nav className={styles.bottomNav}>
      <div className={styles.bottomNavInner}>
        <Link href="/fizik-yildizi" className={`${styles.bottomNavItem} ${isHome ? styles.active : ''}`}>
          <Home size={24} />
          <span>Ana Sayfa</span>
        </Link>
        <Link href="/fizik-yildizi/simulasyonlar" className={`${styles.bottomNavItem} ${isSim ? styles.active : ''}`}>
          <Beaker size={24} />
          <span>Laboratuvar</span>
        </Link>
        <Link href="/fizik-yildizi/magaza" className={`${styles.bottomNavItem} ${isStore ? styles.active : ''}`}>
          <Store size={24} />
          <span>Mağaza</span>
        </Link>
        <Link href="/fizik-yildizi/profil" className={`${styles.bottomNavItem} ${isProfile ? styles.active : ''}`}>
          <User size={24} />
          <span>Profil</span>
        </Link>
      </div>
    </nav>
  );
}
