'use client';
import { apiFetch } from '@/lib/fizik-yildizi/apiFetch';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/app/fizik-yildizi/fizik.module.css';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('fizik_token');
    const raw = localStorage.getItem('fizik_kullanici');
    
    // In a real app, you'd check for a specific admin role. 
    // Here we'll just allow any teacher or specific user to view it, or create a mock admin check.
    // For demonstration, let's assume if they are logged in, they can view it, but in production this must be protected.
    if (!token || !raw) { 
      router.push('/fizik-yildizi/giris'); 
      return; 
    }
    setAdmin(JSON.parse(raw));

    fetchStats();
  }, [router]);

  const fetchStats = async () => {
    try {
      const res = await apiFetch('/api/fizik-yildizi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'adminStats' })
      });
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats');
    }
    setLoading(false);
  };

  const approveTeacher = async (teacherId: string) => {
    try {
      await apiFetch('/api/fizik-yildizi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approveTeacher', data: { teacherId } })
      });
      // Refresh stats
      fetchStats();
    } catch (err) {
      console.error('Failed to approve teacher');
    }
  };

  if (loading || !stats) {
    return (
      <div className={styles.wrapper} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ width: 44, height: 44, border: '3px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      {/* Simple Admin Navbar */}
      <nav className={styles.navbar} style={{ position: 'relative' }}>
        <div className={styles.navInner}>
          <div className={styles.logo} onClick={() => router.push('/fizik-yildizi')} style={{ cursor: 'pointer' }}>
            <span className={styles.logoStar}>✨</span>
            <span className={styles.logoText}>Fizik Yıldızı <span style={{ fontSize: '0.8rem', color: '#f59e0b', marginLeft: 8 }}>Sistem Yönetimi</span></span>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className={styles.btnNavOutline} onClick={() => router.push('/fizik-yildizi')}>
              Çıkış
            </button>
          </div>
        </div>
      </nav>

      <main className={styles.main} style={{ paddingTop: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.5rem', background: 'linear-gradient(135deg, #f59e0b, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            👑 Admin Paneli
          </h1>
          <p style={{ color: '#a1a1aa', fontSize: '0.95rem' }}>
            Platform geneli istatistikler ve yetkilendirme işlemleri.
          </p>
        </div>

        {/* System Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
          
          <div className={styles.glassCardNohover} style={{ padding: '1.5rem', borderLeft: '4px solid #6366f1' }}>
            <div style={{ fontSize: '0.82rem', color: '#a1a1aa', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Toplam Öğrenci</div>
            <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#6366f1', marginBottom: '0.35rem' }}>{stats.ogrenciSayisi}</div>
          </div>

          <div className={styles.glassCardNohover} style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
            <div style={{ fontSize: '0.82rem', color: '#a1a1aa', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Toplam Öğretmen</div>
            <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#10b981', marginBottom: '0.35rem' }}>{stats.ogretmenSayisi}</div>
          </div>

          <div className={styles.glassCardNohover} style={{ padding: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ fontSize: '0.82rem', color: '#a1a1aa', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Atanan Ödev Sayısı</div>
            <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#f59e0b', marginBottom: '0.35rem' }}>{stats.atananTestSayisi}</div>
          </div>

          <div className={styles.glassCardNohover} style={{ padding: '1.5rem', borderLeft: '4px solid #ec4899' }}>
            <div style={{ fontSize: '0.82rem', color: '#a1a1aa', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Platform Toplam XP</div>
            <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#ec4899', marginBottom: '0.35rem' }}>{stats.toplamXp.toLocaleString()}</div>
          </div>

        </div>

        {/* Teacher Approvals */}
        <div className={styles.glassCardNohover} style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f4f4f5', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            👥 Bekleyen Öğretmen Onayları
            <span style={{ background: '#ef4444', color: 'white', padding: '0.1rem 0.6rem', borderRadius: 12, fontSize: '0.8rem' }}>
              {stats.bekleyenOgretmenler.length}
            </span>
          </h3>

          {stats.bekleyenOgretmenler.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px dashed rgba(255,255,255,0.1)', color: '#94a3b8' }}>
              Şu anda onay bekleyen öğretmen bulunmuyor.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {stats.bekleyenOgretmenler.map((t: any) => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '1.05rem', marginBottom: '0.25rem' }}>
                      {t.ad} {t.soyad}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                      ✉️ {t.email} &nbsp;|&nbsp; 🏫 {t.okulIsmi}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                      Kayıt Tarihi: {new Date(t.kayitTarihi).toLocaleString('tr-TR')}
                    </div>
                  </div>
                  <button 
                    onClick={() => approveTeacher(t.id)}
                    style={{ background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.3)', padding: '0.5rem 1.25rem', borderRadius: 8, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(16,185,129,0.25)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(16,185,129,0.15)'}
                  >
                    ✅ Onayla
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
