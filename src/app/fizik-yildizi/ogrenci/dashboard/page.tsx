'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { konular } from '@/data/fizik-yildizi/konular';
import { getAtananTestler, getDersIcerikleri, getKullanicilar, syncWithServer, AtananTest, DersIcerigi } from '@/lib/fizik-yildizi/db';

const AstroTutor = dynamic(() => import('@/components/fizik-yildizi/AstroTutor'), { ssr: false });
import YksSayaci from '@/components/fizik-yildizi/YksSayaci';

interface Kullanici {
  id: string; ad: string; soyad: string; email: string;
  rol: 'ogrenci' | 'ogretmen'; sinif?: number; avatarRenk?: string;
  profilResmi?: string;
  onayDurumu?: string;
}

interface TestSonucu {
  id: string; konuBaslik: string; puan: number; dogru: number;
  yanlis: number; tarih: string; sure: number;
}

import { sorular } from '@/data/fizik-yildizi/sorular';

const KONULAR = konular;

// Generate daily questions dynamically from question bank
const getGunlukSorular = (sinif?: number) => {
  const today = new Date();
  const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const allSorular = sorular.filter(s => s.tip === 'coktan-secmeli' && s.secenekler && (!sinif || s.sinif === sinif));
  const pool = allSorular.length >= 8 ? allSorular : sorular.filter(s => s.tip === 'coktan-secmeli' && s.secenekler);
  const shuffled = [...pool].sort((a, b) => {
    const ha = (parseInt(a.id.replace(/\D/g, '') || '0') + dateSeed) % 1000;
    const hb = (parseInt(b.id.replace(/\D/g, '') || '0') + dateSeed) % 1000;
    return ha - hb;
  });
  return shuffled.slice(0, 8).map(s => {
    const opts = s.secenekler!;
    const seceneklerArr = [opts.A, opts.B, opts.C, opts.D];
    const cevapMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
    return {
      soru: s.soru,
      secenekler: seceneklerArr,
      cevap: cevapMap[s.dogruCevap] ?? 0,
      aciklama: s.aciklama || `Doğru cevap: ${seceneklerArr[cevapMap[s.dogruCevap] ?? 0]}`
    };
  });
};

const ROZETLER = [
  { id: 'ilk-test', ikon: '🎯', baslik: 'İlk Test', aciklama: 'İlk testini çözdün!', renk: '#7c3aed', kazanildi: (testler: TestSonucu[]) => testler.length >= 1 },
  { id: 'mukemmel', ikon: '⭐', baslik: 'Mükemmel', aciklama: '100 puan aldın!', renk: '#f59e0b', kazanildi: (testler: TestSonucu[]) => testler.some(t => t.puan >= 100) },
  { id: 'seri-5', ikon: '🔥', baslik: '5 Test Serisi', aciklama: '5 test çözdün!', renk: '#ef4444', kazanildi: (testler: TestSonucu[]) => testler.length >= 5 },
  { id: 'konu-tamamla', ikon: '📚', baslik: 'Konu Ustası', aciklama: '10 test çözdün!', renk: '#10b981', kazanildi: (testler: TestSonucu[]) => testler.length >= 10 },
  { id: 'hizli-cevap', ikon: '⚡', baslik: 'Hızlı Çözücü', aciklama: 'Bir testini 2 dakikada çözdün!', renk: '#06b6d4', kazanildi: (testler: TestSonucu[]) => testler.some(t => t.sure <= 120) },
  { id: 'fizik-yildizi', ikon: '🌟', baslik: 'Fizik Yıldızı', aciklama: 'Ortalaman %80+ oldu!', renk: '#8b5cf6', kazanildi: (testler: TestSonucu[]) => testler.length > 3 && testler.reduce((a, b) => a + b.puan, 0) / testler.length >= 80 },
];

export default function OgrenciDashboard() {
  const router = useRouter();
  const [kullanici, setKullanici] = useState<Kullanici | null>(null);
  const [testSonuclari, setTestSonuclari] = useState<TestSonucu[]>([]);
  const [gunlukSorular, setGunlukSorular] = useState<ReturnType<typeof getGunlukSorular>>([]);
  const [gunlukSoruIndex, setGunlukSoruIndex] = useState(0);
  const [secilenCevap, setSecilenCevap] = useState<number | null>(null);
  const [cevapVerildi, setCevapVerildi] = useState(false);
  const [aktifNav, setAktifNav] = useState('ana-sayfa');
  const [mobilMenuAcik, setMobilMenuAcik] = useState(false);
  const [tamamlananKonu, setTamamlananKonu] = useState(0);
  const [konuIlerlemeleri, setKonuIlerlemeleri] = useState<Record<string, number>>({});
  
  // Assigned tests & shared files states
  const [atananTestler, setAtananTestler] = useState<AtananTest[]>([]);
  const [dersIcerikleri, setDersIcerikleri] = useState<DersIcerigi[]>([]);
  const [toast, setToast] = useState<{ tip: 'success' | 'error'; icerik: string } | null>(null);

  const showToast = (tip: 'success' | 'error', icerik: string) => {
    setToast({ tip, icerik });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDownloadFile = (fileName: string) => {
    showToast('success', `${fileName} dosyası indiriliyor...`);
    setTimeout(() => {
      showToast('success', `${fileName} başarıyla indirildi.`);
    }, 1500);
  };

  useEffect(() => {
    const token = localStorage.getItem('fizik_token');
    const kullaniciData = localStorage.getItem('fizik_kullanici');
    if (!token || !kullaniciData) { router.push('/fizik-yildizi/giris'); return; }
    const sessionUser = JSON.parse(kullaniciData) as Kullanici;
    if (sessionUser.rol !== 'ogrenci') { router.push('/fizik-yildizi/ogretmen/dashboard'); return; }
    
    const initializeAndSync = async () => {
      // Synchronize database with SQLite server
      await syncWithServer();

      // Retrieve synced local state
      const allUsers = getKullanicilar();
      const k = allUsers.find(u => u.id === sessionUser.id) || sessionUser;

      setKullanici(k);
      const sonuclar = JSON.parse(localStorage.getItem('fizik_test_sonuclari') || '[]') as TestSonucu[];
      setTestSonuclari(sonuclar.filter((s) => s && (s as unknown as Record<string, unknown>)['ogrenciId'] === k.id).slice(-10));
      
      // Load dynamic daily questions based on student's class
      const dinamikSorular = getGunlukSorular(k.sinif);
      setGunlukSorular(dinamikSorular);
      setGunlukSoruIndex(new Date().getDate() % Math.max(1, dinamikSorular.length));

      const tKonu = parseInt(localStorage.getItem('fizik_tamamlanan_konu') || '0');
      setTamamlananKonu(tKonu);

      const ilerlemeler: Record<string, number> = {};
      KONULAR.forEach((konu) => {
        ilerlemeler[konu.id] = parseInt(localStorage.getItem(`fizik_konu_${konu.id}`) || '0');
      });
      setKonuIlerlemeleri(ilerlemeler);

      // Fetch assigned tests matching student's class
      if (k.sinif) {
        const allTests = getAtananTestler();
        const classTests = allTests.filter(t => t.sinif === k.sinif);
        setAtananTestler(classTests);

        // Fetch shared files matching student's class
        const allFiles = getDersIcerikleri();
        const classFiles = allFiles.filter(f => f.sinif === k.sinif);
        setDersIcerikleri(classFiles);
      }
    };

    initializeAndSync();
  }, [router]);

  const cevapla = (idx: number) => {
    if (cevapVerildi) return;
    setSecilenCevap(idx);
    setCevapVerildi(true);
  };

  const sonrakiGunlukSoru = () => {
    if (gunlukSorular.length === 0) return;
    setGunlukSoruIndex((prev) => (prev + 1) % gunlukSorular.length);
    setSecilenCevap(null);
    setCevapVerildi(false);
  };

  const cikisYap = () => {
    localStorage.removeItem('fizik_token');
    localStorage.removeItem('fizik_kullanici');
    router.push('/fizik-yildizi');
  };

  const toplamTest = testSonuclari.length;
  const ortalamaPuan = toplamTest > 0 ? Math.round(testSonuclari.reduce((a, b) => a + b.puan, 0) / toplamTest) : 0;
  const gunlukSoru = gunlukSorular[gunlukSoruIndex] || null;
  const initials = kullanici ? `${kullanici.ad[0]}${kullanici.soyad[0]}` : 'FY';

  if (!kullanici) return (
    <div style={{ minHeight: '100vh', background: '#050a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 48, height: 48, border: '3px solid #7c3aed', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  const allowedGrades = 
    kullanici.sinif === 9 ? [9] :
    kullanici.sinif === 10 ? [10] :
    kullanici.sinif === 11 ? [9, 10, 11] :
    kullanici.sinif === 12 ? [9, 10, 11, 12] :
    [9, 10, 11, 12];
  
  const sinifKonulari = KONULAR.filter((k) => allowedGrades.includes(k.sinif));
  const panelBaslik = 
    kullanici.sinif === 9 ? "9. Sınıf Konuları" :
    kullanici.sinif === 10 ? "10. Sınıf Konuları" :
    kullanici.sinif === 11 ? "11. Sınıf & TYT Konuları" :
    "Tüm Sınıfların Konuları";
  const tumKonular = KONULAR;

  return (
    <div className="fy-layout" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className="fy-sidebar" style={{ padding: '1.5rem 0', display: 'flex', flexDirection: 'column' }}>
        {/* Logo */}
        <div style={{ padding: '0 1.5rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Link href="/fizik-yildizi" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
            <span style={{ fontSize: '1.5rem' }}>⭐</span>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Fizik Yıldızı
            </span>
          </Link>
        </div>

        {/* User Info */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {kullanici.profilResmi ? (
              <img src={kullanici.profilResmi} alt="Profil Resmi" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
            ) : (
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: kullanici.avatarRenk || 'linear-gradient(135deg, #7c3aed, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem', color: 'white', flexShrink: 0 }}>
                {initials}
              </div>
            )}
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f8fafc' }}>{kullanici.ad} {kullanici.soyad}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{kullanici.sinif === 13 ? 'Mezun' : `${kullanici.sinif}. Sınıf`} Öğrenci</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0.75rem 0' }}>
          {[
            { id: 'ana-sayfa', ikon: '🏠', baslik: 'Ana Sayfa', href: '/fizik-yildizi/ogrenci/dashboard' },
            { id: 'yanlislarim', ikon: '❌', baslik: 'Yanlışlarım', href: '/fizik-yildizi/ogrenci/yanlislarim' },
            { id: 'konular', ikon: '📚', baslik: 'Konular', href: '/fizik-yildizi/ogrenci/konular' },
            { id: 'testler', ikon: '📝', baslik: 'Testlerim', href: '/fizik-yildizi/ogrenci/test/karisik' },
            { id: 'analiz', ikon: '📊', baslik: 'Analizim', href: '/fizik-yildizi/ogrenci/analiz' },
            { id: 'flashcards', ikon: '🎴', baslik: 'Kartlar', href: '/fizik-yildizi/ogrenci/flashcards' },
            { id: 'odak', ikon: '🍅', baslik: 'Odak', href: '/fizik-yildizi/ogrenci/odak' },
            { id: 'program', ikon: '📅', baslik: 'Program', href: '/fizik-yildizi/ogrenci/program' },
            { id: 'sinif-forum', ikon: '💬', baslik: 'Sınıf Forumu', href: '/fizik-yildizi/ogrenci/sinif-forum' },
            { id: 'profil', ikon: '👤', baslik: 'Profilim', href: '/fizik-yildizi/ogrenci/profil' },
          ].map((item) => (
            <Link key={item.id} href={item.href}
              className={`fy-sidebar-nav-item ${aktifNav === item.id ? 'active' : ''}`}
              onClick={() => setAktifNav(item.id)}>
              <span>{item.ikon}</span>
              <span>{item.baslik}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button onClick={cikisYap} className="fy-sidebar-nav-item" style={{ color: '#ef4444', width: '100%' }}>
            <span>🚪</span>
            <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: 260, flex: 1, padding: '2rem', overflowY: 'auto', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.25rem' }}>
              Merhaba, {kullanici.ad}! 👋
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Bugün hangi konuyu keşfedeceksin?
            </p>
          </div>
          <div className="fy-badge fy-badge-cyan">
            {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>

        {/* YKS Sayacı */}
        <YksSayaci />

        {/* Onay Bekliyor / Reddedildi Banner */}
        {kullanici.onayDurumu === 'bekliyor' && (
          <div style={{
            background: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.25)',
            borderRadius: '16px',
            padding: '1.25rem 1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
            animation: 'fadeIn 0.3s ease'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f59e0b', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>⌛</span> Hesap Onayı Bekleniyor
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
              Kayıt isteğiniz seçtiğiniz fizik öğretmenine iletildi. Öğretmeniniz kendi paneli üzerinden onay verdiğinde sınıfa eklenecek, ödevlerinizi ve paylaşılan ders notlarını görebileceksiniz.
            </p>
          </div>
        )}

        {kullanici.onayDurumu === 'reddedildi' && (
          <div style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: '16px',
            padding: '1.25rem 1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
            animation: 'fadeIn 0.3s ease'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ef4444', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>⚠️</span> Kayıt Talebi Reddedildi
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
              Kayıt isteğiniz öğretmeniniz tarafından reddedildi. Lütfen <Link href="/fizik-yildizi/ogrenci/profil" style={{ color: '#a78bfa', fontWeight: 700, textDecoration: 'underline' }}>Profil Ayarlarınızdan</Link> öğretmen bilgilerinizi kontrol ederek güncelleyin.
            </p>
          </div>
        )}

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { ikon: '📝', deger: toplamTest, label: 'Çözülen Test', renk: '#7c3aed' },
            { ikon: '✅', deger: `${ortalamaPuan}%`, label: 'Ortalama Puan', renk: '#10b981' },
            { ikon: '📚', deger: tamamlananKonu, label: 'Tamamlanan Konu', renk: '#06b6d4' },
            { ikon: '🔥', deger: '0 gün', label: 'Çalışma Serisi', renk: '#f59e0b' },
          ].map((stat, i) => (
            <div key={i} className="fy-stat-card" style={{ borderTop: `3px solid ${stat.renk}` }}>
              <span style={{ fontSize: '1.5rem' }}>{stat.ikon}</span>
              <div className="fy-stat-value" style={{ background: `linear-gradient(135deg, ${stat.renk}, #06b6d4)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {stat.deger}
              </div>
              <div className="fy-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Günlük Soru */}
          <div className="fy-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.25rem' }}>🎯</span>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>Günlük Soru</h2>
              <span className="fy-badge fy-badge-warning" style={{ marginLeft: 'auto' }}>Bugünkü</span>
            </div>

            {!gunlukSoru ? (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: '#64748b', fontSize: '0.9rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📚</div>
                Sorular yükleniyor...
              </div>
            ) : (
              <>
                <p style={{ color: '#cbd5e1', fontSize: '0.95rem', marginBottom: '1rem', lineHeight: 1.6 }}>
                  {gunlukSoru.soru}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                  {gunlukSoru.secenekler.map((s, i) => {
                    let bg = 'rgba(255,255,255,0.04)';
                    let border = 'rgba(255,255,255,0.08)';
                    let color = '#cbd5e1';
                    if (cevapVerildi) {
                      if (i === gunlukSoru.cevap) { bg = 'rgba(16,185,129,0.15)'; border = '#10b981'; color = '#6ee7b7'; }
                      else if (i === secilenCevap) { bg = 'rgba(239,68,68,0.15)'; border = '#ef4444'; color = '#fca5a5'; }
                    } else if (secilenCevap === i) { bg = 'rgba(124,58,237,0.15)'; border = '#7c3aed'; }
                    return (
                      <button key={i} onClick={() => cevapla(i)}
                        style={{ padding: '0.6rem 1rem', background: bg, border: `1.5px solid ${border}`, borderRadius: 8, color, fontSize: '0.85rem', fontWeight: 600, cursor: cevapVerildi ? 'default' : 'pointer', textAlign: 'left', transition: 'all 0.2s', fontFamily: 'inherit' }}>
                        <span style={{ marginRight: '0.5rem', opacity: 0.6 }}>{String.fromCharCode(65 + i)})</span>{s}
                      </button>
                    );
                  })}
                </div>

                {cevapVerildi && (
                  <div style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '0.75rem' }}>
                    <p style={{ color: '#c4b5fd', fontSize: '0.82rem', lineHeight: 1.5 }}>💡 {gunlukSoru.aciklama}</p>
                  </div>
                )}

                <button onClick={sonrakiGunlukSoru} className="fy-btn fy-btn-secondary fy-btn-sm" style={{ width: '100%' }}>
                  Sonraki Soru →
                </button>
              </>
            )}
          </div>

          {/* Sınıf Konuları İlerleme */}
          <div className="fy-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.25rem' }}>📊</span>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>{panelBaslik}</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', maxHeight: '350px', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {sinifKonulari.map((konu) => {
                const ilerleme = konuIlerlemeleri[konu.id] || 0;
                return (
                  <Link key={konu.id} href={`/fizik-yildizi/ogrenci/konu/${konu.id}`}
                    style={{ textDecoration: 'none', display: 'block' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                      <span>{konu.ikon}</span>
                      <span style={{ color: '#cbd5e1', fontSize: '0.875rem', fontWeight: 600, flex: 1 }}>{konu.baslik}</span>
                      <span style={{ color: '#64748b', fontSize: '0.75rem' }}>{ilerleme}%</span>
                    </div>
                    <div className="fy-progress" style={{ height: 6 }}>
                      <div className="fy-progress-bar" style={{ width: `${ilerleme}%`, background: `linear-gradient(90deg, ${konu.renk}, #06b6d4)` }} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Öğretmenimden Gelenler (Atanan Testler ve Dosyalar) */}
        {kullanici.onayDurumu === 'onaylandi' && (atananTestler.length > 0 || dersIcerikleri.length > 0) && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            {/* Atanan Testler Card */}
            <div className="fy-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.25rem' }}>📋</span>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>Öğretmenimden Atanan Testler</h2>
                <span className="fy-badge fy-badge-warning" style={{ marginLeft: 'auto' }}>Önemli</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '250px', overflowY: 'auto' }}>
                {atananTestler.map((t) => {
                  const solvedTest = testSonuclari.find(res => res.konuBaslik === t.konuBaslik || res.konuBaslik === 'Karışık Test' && t.konuId === 'karisik');
                  return (
                    <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#cbd5e1' }}>{t.konuBaslik}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.15rem' }}>
                          Son Teslim: {new Date(t.sonTarih).toLocaleDateString('tr-TR')}
                        </div>
                      </div>
                      {solvedTest ? (
                        <span className="fy-badge fy-badge-success" style={{ fontSize: '0.75rem' }}>
                          ✓ Çözüldü (%{solvedTest.puan})
                        </span>
                      ) : (
                        <Link href={`/fizik-yildizi/ogrenci/test/${t.konuId}`} className="fy-btn fy-btn-primary fy-btn-sm" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', textDecoration: 'none' }}>
                          Testi Çöz
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shared Files Card */}
            <div className="fy-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.25rem' }}>📂</span>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>Ders Materyalleri & Dosyalar</h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '250px', overflowY: 'auto' }}>
                {dersIcerikleri.map((f) => (
                  <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#cbd5e1' }}>{f.baslik}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.15rem' }}>
                        Dosya: <span style={{ color: '#06b6d4' }}>{f.dosyaAdi}</span> ({f.dosyaBoyutu})
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDownloadFile(f.dosyaAdi)} 
                      className="fy-btn fy-btn-secondary fy-btn-sm" 
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}
                    >
                      📥 İndir
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Son Testler */}
        <div className="fy-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📋</span> Son Testler
            </h2>
            <Link href="/fizik-yildizi/ogrenci/test/karisik" className="fy-btn fy-btn-primary fy-btn-sm">
              Yeni Test
            </Link>
          </div>

          {testSonuclari.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📝</div>
              <p style={{ fontSize: '0.9rem' }}>Henüz test çözmediniz.</p>
              <Link href="/fizik-yildizi/ogrenci/test/karisik" className="fy-btn fy-btn-primary fy-btn-sm" style={{ marginTop: '0.75rem', display: 'inline-flex' }}>
                İlk Testini Çöz!
              </Link>
            </div>
          ) : (
            <table className="fy-table">
              <thead>
                <tr>
                  <th>Konu</th><th>Puan</th><th>Doğru/Yanlış</th><th>Süre</th><th>Tarih</th>
                </tr>
              </thead>
              <tbody>
                {testSonuclari.slice(-5).reverse().map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 600, color: '#f8fafc' }}>{t.konuBaslik}</td>
                    <td>
                      <span style={{ color: t.puan >= 70 ? '#10b981' : t.puan >= 50 ? '#f59e0b' : '#ef4444', fontWeight: 700 }}>
                        {t.puan}
                      </span>
                    </td>
                    <td><span style={{ color: '#10b981' }}>{t.dogru}✓</span> / <span style={{ color: '#ef4444' }}>{t.yanlis}✗</span></td>
                    <td style={{ color: '#64748b' }}>{Math.round(t.sure / 60)}dk</td>
                    <td style={{ color: '#64748b', fontSize: '0.8rem' }}>
                      {new Date(t.tarih).toLocaleDateString('tr-TR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Rozetler */}
        <div className="fy-card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🏆</span> Rozetlerim
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.75rem' }}>
            {ROZETLER.map((rozet) => {
              const kazanildi = toplamTest > 0 && rozet.id === 'ilk-test';
              return (
                <div key={rozet.id} title={rozet.aciklama}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '0.875rem', borderRadius: 12, background: kazanildi ? `rgba(${rozet.renk === '#7c3aed' ? '124,58,237' : '245,158,11'},0.1)` : 'rgba(255,255,255,0.03)', border: kazanildi ? `1px solid ${rozet.renk}40` : '1px solid rgba(255,255,255,0.06)', opacity: kazanildi ? 1 : 0.4, cursor: 'default', transition: 'all 0.2s' }}>
                  <span style={{ fontSize: '1.75rem', filter: kazanildi ? 'none' : 'grayscale(1)' }}>{rozet.ikon}</span>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: kazanildi ? '#f8fafc' : '#64748b', textAlign: 'center' }}>{rozet.baslik}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1.5rem' }}>
          {[
            { ikon: '📚', baslik: 'Konuları Keşfet', aciklama: 'Tüm sınıf konularını gör', href: '/fizik-yildizi/ogrenci/konular', renk: '#7c3aed' },
            { ikon: '🧪', baslik: 'Simülasyonlar', aciklama: 'Fizik deneyleri', href: '/fizik-yildizi/simulasyonlar', renk: '#06b6d4' },
            { ikon: '📊', baslik: 'Performansım', aciklama: 'Detaylı analiz', href: '/fizik-yildizi/ogrenci/analiz', renk: '#10b981' },
          ].map((item, i) => (
            <Link key={i} href={item.href}
              style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.04)', border: `1px solid ${item.renk}30`, borderRadius: 16, textDecoration: 'none', display: 'block', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = `${item.renk}15`; (e.currentTarget as HTMLElement).style.borderColor = `${item.renk}60`; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLElement).style.borderColor = `${item.renk}30`; }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{item.ikon}</div>
              <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{item.baslik}</div>
              <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{item.aciklama}</div>
            </Link>
          ))}
        </div>

        <AstroTutor kullanici={kullanici ? { ad: kullanici.ad, soyad: kullanici.soyad, id: kullanici.id } : undefined} />
      </main>

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 1000,
          background: toast.tip === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
          border: `1px solid ${toast.tip === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
          borderRadius: '12px', padding: '0.75rem 1.25rem',
          color: toast.tip === 'success' ? '#6ee7b7' : '#fca5a5',
          fontWeight: 600, fontSize: '0.9rem', backdropFilter: 'blur(10px)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          animation: 'fadeIn 0.2s ease',
        }}>
          {toast.tip === 'success' ? '✅' : '⚠️'} {toast.icerik}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          main { margin-left: 0 !important; padding: 1rem !important; }
          .fy-sidebar { display: none; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
