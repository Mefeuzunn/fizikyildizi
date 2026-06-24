import type { ReactNode } from 'react';
import FizikNavbar from '@/components/fizik-yildizi/FizikNavbar';
import MobileBottomNav from '@/components/fizik-yildizi/MobileBottomNav';
import NativeMobileInit from '@/components/fizik-yildizi/NativeMobileInit';
import styles from './fizik.module.css';
import PageTransitionWrapper from '@/components/fizik-yildizi/PageTransitionWrapper';

export const metadata = {
  title: {
    default: 'Fizik Yıldızı | Lise Fizik Eğitim Platformu',
    template: '%s | Fizik Yıldızı',
  },
  description: 'Türk lise öğrencileri için etkileşimli fizik öğrenme platformu. Adaptif testler, simülasyonlar ve kişisel analiz.',
};

/** Generates 80 star particle data points server-side */
function generateStars(count: number) {
  // Use deterministic pseudo-random based on index for SSR consistency
  const stars = [];
  for (let i = 0; i < count; i++) {
    const seed = i * 7919;
    const x = ((seed * 3 + 17) % 100);
    const y = ((seed * 5 + 11) % 100);
    const size = (i % 3 === 0) ? 2 : (i % 3 === 1) ? 1.5 : 1;
    const duration = 2 + (i % 5) + (i % 3) * 0.7;
    const delay = (i * 0.13) % 4;
    const opacity = 0.3 + ((i % 7) * 0.1);
    stars.push({ x, y, size, duration, delay, opacity });
  }
  return stars;
}

const STARS = generateStars(80);

export default function FizikYildizLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.wrapper}>
      <NativeMobileInit />
      {/* Fixed star field background */}
      <div className={styles.starField} aria-hidden="true">
        {STARS.map((star, i) => (
          <span
            key={i}
            className={styles.star}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>

      {/* Own Navbar - replaces global Navbar/Footer */}
      <FizikNavbar />

      {/* Page content */}
      <main className={styles.main}>
        <PageTransitionWrapper>
          {children}
        </PageTransitionWrapper>
      </main>

      <MobileBottomNav />
    </div>
  );
}
