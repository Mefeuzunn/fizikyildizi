'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Storage } from '@/lib/storage';
import { motion } from 'framer-motion';
import { Award, Target, BookOpen, Settings, LogOut } from 'lucide-react';
import styles from '../fizik.module.css';

interface Kullanici {
  id: string;
  ad: string;
  soyad: string;
  email: string;
  rol: 'ogrenci' | 'ogretmen';
  sinif?: number;
}

const profileStyles = {
  container: { padding: '20px', paddingBottom: '100px' },
  header: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' },
  avatar: { width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold', color: '#fff' },
  name: { fontSize: '24px', fontWeight: 'bold', color: '#fff', marginBottom: '5px' },
  email: { fontSize: '14px', color: '#94a3b8' },
  statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' },
  statCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' },
  statValue: { fontSize: '28px', fontWeight: 'bold', color: '#fff', margin: '10px 0 5px 0' },
  statLabel: { fontSize: '14px', color: '#94a3b8' },
  sectionTitle: { fontSize: '18px', fontWeight: 'bold', color: '#fff', marginBottom: '15px' },
  actionBtn: { display: 'flex', alignItems: 'center', gap: '15px', width: '100%', padding: '16px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: 'none', color: '#e2e8f0', fontSize: '16px', textAlign: 'left' as const, marginBottom: '10px' },
  dangerBtn: { display: 'flex', alignItems: 'center', gap: '15px', width: '100%', padding: '16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', fontSize: '16px', textAlign: 'left' as const, marginTop: '20px' }
};

export default function ProfilPage() {
  const router = useRouter();
  const [kullanici, setKullanici] = useState<Kullanici | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const k = await Storage.get<Kullanici>('fizik_kullanici');
      if (k) {
        setKullanici(k);
      } else {
        router.push('/fizik-yildizi/giris');
      }
    };
    loadProfile();
  }, [router]);

  const handleCikis = async () => {
    await Storage.remove('fizik_token');
    await Storage.remove('fizik_kullanici');
    router.push('/fizik-yildizi/giris');
  };

  if (!kullanici) return <div style={{ padding: '20px', color: '#fff', textAlign: 'center' }}>Yükleniyor...</div>;

  const initials = `${kullanici.ad[0]}${kullanici.soyad[0]}`.toUpperCase();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={profileStyles.container}
    >
      <div style={profileStyles.header}>
        <div style={profileStyles.avatar}>{initials}</div>
        <div>
          <div style={profileStyles.name}>{kullanici.ad} {kullanici.soyad}</div>
          <div style={profileStyles.email}>{kullanici.email}</div>
          <div style={{ fontSize: '12px', color: '#8b5cf6', marginTop: '5px', fontWeight: 'bold', textTransform: 'uppercase' }}>
            {kullanici.rol === 'ogrenci' ? `ÖĞRENCİ - ${kullanici.sinif || 9}. SINIF` : 'ÖĞRETMEN'}
          </div>
        </div>
      </div>

      <div style={profileStyles.statsGrid}>
        <div style={profileStyles.statCard}>
          <Target color="#06b6d4" size={32} />
          <div style={profileStyles.statValue}>12</div>
          <div style={profileStyles.statLabel}>Simülasyon</div>
        </div>
        <div style={profileStyles.statCard}>
          <BookOpen color="#8b5cf6" size={32} />
          <div style={profileStyles.statValue}>8</div>
          <div style={profileStyles.statLabel}>Ders Modülü</div>
        </div>
        <div style={{ ...profileStyles.statCard, gridColumn: 'span 2', flexDirection: 'row', gap: '20px', justifyContent: 'flex-start' }}>
          <Award color="#f59e0b" size={40} />
          <div>
            <div style={{ ...profileStyles.statValue, margin: 0, fontSize: '24px' }}>1,250 XP</div>
            <div style={profileStyles.statLabel}>Altın Ligi - 4. Sıra</div>
          </div>
        </div>
      </div>

      <div>
        <div style={profileStyles.sectionTitle}>Ayarlar ve Hesap</div>
        <button style={profileStyles.actionBtn}>
          <Settings size={20} color="#94a3b8" />
          Uygulama Ayarları
        </button>
        <button style={profileStyles.dangerBtn} onClick={handleCikis}>
          <LogOut size={20} />
          Çıkış Yap
        </button>
      </div>
    </motion.div>
  );
}
