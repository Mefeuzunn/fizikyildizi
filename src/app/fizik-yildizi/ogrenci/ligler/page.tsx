'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FizikNavbar from '@/components/fizik-yildizi/FizikNavbar';
import { syncWithServer } from '@/lib/fizik-yildizi/db';

interface OgrenciPuan {
  ogrenciId: string;
  ogrenciAdi: string;
  toplamXp: number;
  lig: string;
  testSayisi: number;
  dogruCevapSayisi: number;
  sira: number;
}

const LIG_CONFIG: Record<string, { icon: string; color: string; bgColor: string; minXp: number; maxXp: number }> = {
  'Bronz': { icon: '🥉', color: '#a16207', bgColor: 'rgba(161,98,7,0.12)', minXp: 0, maxXp: 499 },
  'Gümüş': { icon: '🥈', color: '#71717a', bgColor: 'rgba(113,113,122,0.12)', minXp: 500, maxXp: 1999 },
  'Altın': { icon: '🥇', color: '#d97706', bgColor: 'rgba(217,119,6,0.12)', minXp: 2000, maxXp: 4999 },
  'Platin': { icon: '💎', color: '#06b6d4', bgColor: 'rgba(6,182,212,0.12)', minXp: 5000, maxXp: 9999 },
  'Yıldızlar': { icon: '⭐', color: '#f59e0b', bgColor: 'rgba(245,158,11,0.12)', minXp: 10000, maxXp: 99999 },
};

export default function LiglerPage() {
  const router = useRouter();
  const [kullanici, setKullanici] = useState<any>(null);
  const [puanlar, setPuanlar] = useState<OgrenciPuan[]>([]);
  const [seciliLig, setSeciliLig] = useState<string>('Bronz');
  const [yukleniyor, setYukleniyor] = useState(true);
  const [benimSiram, setBenimSiram] = useState<OgrenciPuan | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('fizik_token');
    const kData = localStorage.getItem('fizik_kullanici');
    if (!token || !kData) { router.push('/fizik-yildizi/giris'); return; }
    const k = JSON.parse(kData);
    setKullanici(k);

    // Load from server
    syncWithServer().then(() => {
      const stored = JSON.parse(localStorage.getItem('fizik_kullanicilar') || '[]');
      const sonuclar = JSON.parse(localStorage.getItem('fizik_test_sonuclari') || '[]');

      // Build leaderboard from local data — only students in the same class
      const ogrenciler = stored.filter((u: any) =>
        u.rol === 'ogrenci' &&
        u.onayDurumu === 'onaylandi' &&
        (k.ogretmenId ? u.ogretmenId === k.ogretmenId : true)
      );
      const ligPuanlari: OgrenciPuan[] = ogrenciler.map((u: any, idx: number) => {
        const kisiSonuclari = sonuclar.filter((s: any) => s.ogrenciId === u.id);
        const totalDogru = kisiSonuclari.reduce((acc: number, s: any) => acc + (s.dogru || 0), 0);
        const xp = (u.toplamXp || 0) || totalDogru * 10;
        const lig = xp >= 10000 ? 'Yıldızlar' : xp >= 5000 ? 'Platin' : xp >= 2000 ? 'Altın' : xp >= 500 ? 'Gümüş' : 'Bronz';
        return {
          ogrenciId: u.id,
          ogrenciAdi: `${u.ad} ${u.soyad}`.trim() || 'Öğrenci',
          toplamXp: xp,
          lig,
          testSayisi: kisiSonuclari.length,
          dogruCevapSayisi: totalDogru,
          sira: idx + 1,
        };
      });

      // Sort by XP
      ligPuanlari.sort((a, b) => b.toplamXp - a.toplamXp);
      ligPuanlari.forEach((p, i) => p.sira = i + 1);

      setPuanlar(ligPuanlari);
      const benimLig = ligPuanlari.find(p => p.ogrenciId === k.id);
      setBenimSiram(benimLig || null);
      setSeciliLig(benimLig?.lig || 'Bronz');

      setYukleniyor(false);
    });
  }, [router]);

  const filteredPuanlar = puanlar.filter(p => p.lig === seciliLig);
  const totalXpForNextLig = LIG_CONFIG[seciliLig]?.maxXp + 1 || 999999;
  const currentUserXp = benimSiram?.toplamXp || 0;
  const currentLigMin = LIG_CONFIG[benimSiram?.lig || 'Bronz']?.minXp || 0;
  const currentLigMax = LIG_CONFIG[benimSiram?.lig || 'Bronz']?.maxXp || 499;
  const xpProgress = ((currentUserXp - currentLigMin) / (currentLigMax - currentLigMin)) * 100;

  return (
    <div style={{ background: '#09090b', minHeight: '100vh', color: '#f4f4f5' }}>
      <FizikNavbar />
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '6rem 1.5rem 4rem' }}>

        {/* Hero header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>🏆 Sınıf Ligi</h1>
          <p style={{ color: '#71717a', fontSize: '0.95rem' }}>
            Test çöz, XP kazan, lig atla — sınıfın zirvesine ulaş.
          </p>
        </div>

        {/* User XP card */}
        {benimSiram && (
          <div style={{
            background: '#111113', border: '1px solid #27272a', borderRadius: '20px',
            padding: '1.5rem 2rem', marginBottom: '2.5rem',
            display: 'grid', gridTemplateColumns: '1fr auto',
            gap: '1.5rem', alignItems: 'center',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: '2rem' }}>{LIG_CONFIG[benimSiram.lig]?.icon}</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.2rem', color: LIG_CONFIG[benimSiram.lig]?.color }}>
                    {benimSiram.lig} Ligi
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#71717a' }}>
                    Sıralaman: #{benimSiram.sira}
                  </div>
                </div>
              </div>
              {/* XP Bar */}
              <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.78rem', color: '#71717a' }}>Mevcut XP</span>
                <span style={{ fontSize: '0.78rem', fontFamily: 'monospace', fontWeight: 700, color: '#f4f4f5' }}>
                  {benimSiram.toplamXp.toLocaleString()} XP
                </span>
              </div>
              <div style={{ background: '#1c1c1f', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: '999px',
                  width: `${Math.min(xpProgress, 100)}%`,
                  background: `linear-gradient(90deg, ${LIG_CONFIG[benimSiram.lig]?.color}, ${benimSiram.lig === 'Yıldızlar' ? '#f59e0b' : '#6366f1'})`,
                  transition: 'width 1s ease',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.35rem' }}>
                <span style={{ fontSize: '0.7rem', color: '#52525b' }}>{currentLigMin.toLocaleString()}</span>
                <span style={{ fontSize: '0.7rem', color: '#52525b' }}>{currentLigMax.toLocaleString()}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '0.75rem', textAlign: 'center' }}>
              <div style={{ background: '#18181b', borderRadius: '12px', padding: '0.875rem 1.25rem' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#6366f1', fontFamily: 'monospace' }}>{benimSiram.testSayisi}</div>
                <div style={{ fontSize: '0.72rem', color: '#71717a' }}>Test</div>
              </div>
              <div style={{ background: '#18181b', borderRadius: '12px', padding: '0.875rem 1.25rem' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981', fontFamily: 'monospace' }}>{benimSiram.dogruCevapSayisi}</div>
                <div style={{ fontSize: '0.72rem', color: '#71717a' }}>Doğru</div>
              </div>
            </div>
          </div>
        )}

        {/* League tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {Object.entries(LIG_CONFIG).map(([ligAdi, config]) => {
            const count = puanlar.filter(p => p.lig === ligAdi).length;
            return (
              <button
                key={ligAdi}
                onClick={() => setSeciliLig(ligAdi)}
                style={{
                  flexShrink: 0,
                  padding: '0.5rem 1.25rem', borderRadius: '12px', fontSize: '0.85rem',
                  fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                  border: `1px solid ${seciliLig === ligAdi ? config.color : '#27272a'}`,
                  background: seciliLig === ligAdi ? config.bgColor : '#18181b',
                  color: seciliLig === ligAdi ? config.color : '#71717a',
                  display: 'flex', alignItems: 'center', gap: '0.45rem',
                }}
              >
                {config.icon} {ligAdi}
                <span style={{
                  fontSize: '0.68rem', padding: '0.1rem 0.45rem', borderRadius: '20px',
                  background: seciliLig === ligAdi ? 'rgba(255,255,255,0.1)' : '#27272a',
                }}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Leaderboard */}
        <div style={{ background: '#111113', border: '1px solid #27272a', borderRadius: '20px', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #1c1c1f', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 700, fontSize: '1rem' }}>{LIG_CONFIG[seciliLig]?.icon} {seciliLig} Ligi</span>
              <span style={{ marginLeft: '0.75rem', fontSize: '0.8rem', color: '#71717a' }}>
                {LIG_CONFIG[seciliLig]?.minXp.toLocaleString()} – {LIG_CONFIG[seciliLig]?.maxXp.toLocaleString()} XP
              </span>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#52525b' }}>{filteredPuanlar.length} öğrenci</span>
          </div>

          {yukleniyor ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#52525b' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem', animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</div>
              <div>Yükleniyor...</div>
            </div>
          ) : filteredPuanlar.length === 0 ? (
            <div style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏆</div>
              <div style={{ fontWeight: 700, color: '#f4f4f5', marginBottom: '0.5rem' }}>
                Bu ligde henüz kimse yok
              </div>
              <p style={{ color: '#52525b', fontSize: '0.82rem', lineHeight: 1.6, maxWidth: '280px', margin: '0 auto' }}>
                {seciliLig} ligi boş. Test çözerek XP kazan ve bu ligde ilk sen görün!
              </p>
            </div>
          ) : filteredPuanlar.map((p, idx) => {
            const config = LIG_CONFIG[p.lig];
            const isMe = p.ogrenciId === kullanici?.id;
            const podiumIcons = ['🥇', '🥈', '🥉'];
            return (
              <div
                key={p.ogrenciId}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '3rem 1fr auto',
                  gap: '1rem',
                  padding: '1rem 1.5rem',
                  alignItems: 'center',
                  borderBottom: '1px solid #1c1c1f',
                  background: isMe ? 'rgba(99,102,241,0.06)' : 'transparent',
                  borderLeft: isMe ? '3px solid #6366f1' : '3px solid transparent',
                  transition: 'background 0.15s',
                }}
              >
                {/* Rank */}
                <div style={{ textAlign: 'center', fontWeight: 800, fontSize: idx < 3 ? '1.3rem' : '0.9rem', color: idx < 3 ? config.color : '#52525b', fontFamily: 'monospace' }}>
                  {idx < 3 ? podiumIcons[idx] : `#${p.sira}`}
                </div>

                {/* Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '34px', height: '34px', borderRadius: '50%',
                    background: isMe ? '#6366f1' : config.bgColor,
                    border: `2px solid ${isMe ? '#6366f1' : config.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.875rem', fontWeight: 700, color: isMe ? 'white' : config.color,
                    flexShrink: 0,
                  }}>
                    {p.ogrenciAdi.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: isMe ? '#818cf8' : '#f4f4f5' }}>
                      {p.ogrenciAdi}
                      {isMe && <span style={{ fontSize: '0.7rem', marginLeft: '0.5rem', color: '#6366f1' }}>(Sen)</span>}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#52525b' }}>
                      {p.testSayisi} test · {p.dogruCevapSayisi} doğru
                    </div>
                  </div>
                </div>

                {/* XP */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: config.color, fontFamily: 'monospace' }}>
                    {p.toplamXp.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#52525b' }}>XP</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* XP earning guide */}
        <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
          {[
            { icon: '✅', title: 'Doğru Cevap', xp: '+10 XP', color: '#10b981' },
            { icon: '📝', title: 'Test Tamamla', xp: '+50 XP', color: '#6366f1' },
            { icon: '💬', title: 'Forum Cevabı', xp: '+50 XP', color: '#f59e0b' },
            { icon: '▲', title: 'Beğeni Al', xp: '+100 XP', color: '#f43f5e' },
          ].map(item => (
            <div key={item.title} style={{
              background: '#111113', border: '1px solid #27272a', borderRadius: '12px',
              padding: '1rem', textAlign: 'center', transition: 'border-color 0.15s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = item.color + '60'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#27272a'; }}
            >
              <div style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>{item.icon}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a1a1aa', marginBottom: '0.25rem' }}>{item.title}</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: item.color, fontFamily: 'monospace' }}>{item.xp}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
