'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CookieConsent } from '@/components/CookieConsent';

export default function GlobalLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFizikYildizi = pathname?.startsWith('/fizik-yildizi');

  if (isFizikYildizi) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "64px", minHeight: "calc(100vh - 200px)" }}>
        {children}
      </main>
      <Footer />
      <CookieConsent />
    </>
  );
}
