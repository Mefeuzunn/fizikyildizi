'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getKullanicilar, saveKullanici, kullaniciSil, Kullanici } from '@/lib/fizik-yildizi/db';
import FizikNavbar from '@/components/fizik-yildizi/FizikNavbar';
import styles from '@/app/fizik-yildizi/fizik.module.css';

interface TestSonuc {
  score?: number;
  dogru?: number;
  yanlis?: number;
  bos?: number;
  sure?: number;
  tarih?: string;
  konuId?: string;
}

const AVATAR_COLORS = [
  { name: 'Uzay Moru',     value: '#7c3aed' },
  { name: 'Gök Mavisi',    value: '#06b6d4' },
  { name: 'Kozmik Zümrüt', value: '#10b981' },
  { name: 'Güneş Sarısı',  value: '#f59e0b' },
  { name: 'Kızıl Dev',     value: '#ef4444' },
  { name: 'Galaksi Pembe', value: '#ec4899' },
];

const LEAGUE_RANKS = [
  { min: 0,    max: 499,  name: 'Meteor',   icon: '🪨', color: '#9ca3af' },
  { min: 500,  max: 1499, name: 'Yıldız',   icon: '⭐', color: '#60a5fa' },
  { min: 1500, max: 3499, name: 'Gezegen',  icon: '🪐', color: '#a78bfa' },
  { min: 3500, max: 6999, name: 'Nebula',   icon: '🌌', color: '#f59e0b' },
  { min: 7000, max: Infinity, name: 'Kara Delik', icon: '🕳️', color: '#f43f5e' },
];

function getLeague(xp: number) {
  return LEAGUE_RANKS.find((r) => xp >= r.min && xp <= r.max) || LEAGUE_RANKS[0];
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('tr-TR', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export default function OgrenciProfilPage() {
  const router = useRouter();
  const [kullanici, setKullanici] = useState<Kullanici | null>(null);
  const [activeTab, setActiveTab] = useState<'profil' | 'sifre' | 'rozetler'>('profil');

  // Profile form
  const [ad, setAd] = useState('');
  const [soyad, setSoyad] = useState('');
  const [sinif, setSinif] = useState('9');
  const [okulIsmi, setOkulIsmi] = useState('');
  const [okulNo, setOkulNo] = useState('');
  const [avatarRenk, setAvatarRenk] = useState('#06b6d4');

  // Password form
  const [mevcutSifre, setMevcutSifre] = useState('');
  const [yeniSifre, setYeniSifre] = useState('');
  const [yeniSifreTekrar, setYeniSifreTekrar] = useState('');
  const [sifreGoster, setSifreGoster] = useState(false);
  const [yeniSifreGoster, setYeniSifreGoster] = useState(false);

  const [profilYukleniyor, setProfilYukleniyor] = useState(false);
  const [sifreYukleniyor, setSifreYukleniyor] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Stats from localStorage
  const [stats, setStats] = useState({ testSayisi: 0, ortScore: 0, totalXp: 0 });

  useEffect(() => {
    const token = localStorage.getItem('fizik_token');
    const raw = localStorage.getItem('fizik_kullanici');
    if (!token || !raw) { router.push('/fizik-yildizi/giris'); return; }

    let sessionUser: Kullanici;
    try { sessionUser = JSON.parse(raw); } catch { router.push('/fizik-yildizi/giris'); return; }

    if (sessionUser.rol !== 'ogrenci') { router.push('/fizik-yildizi/ogretmen/dashboard'); return; }

    // Sync with DB
    const allUsers = getKullanicilar();
    const k = allUsers.find((u) => u.id === sessionUser.id) || sessionUser;
    if (JSON.stringify(k) !== JSON.stringify(sessionUser)) {
      localStorage.setItem('fizik_kullanici', JSON.stringify(k));
    }

    setKullanici(k);
    setAd(k.ad);
    setSoyad(k.soyad);
    setSinif(String(k.sinif || 9));
    setOkulIsmi(k.okulIsmi || '');
    setOkulNo(k.okulNo || '');
    setAvatarRenk(k.avatarRenk || '#06b6d4');

    // Compute stats from localStorage test results
    try {
      const raw2 = localStorage.getItem('fizik_test_sonuclari');
      if (raw2) {
        const sonuclar = JSON.parse(raw2).filter((r: any) => r && r.ogrenciId === k.id);
        const total = sonuclar.length;
        const avgScore = total > 0
          ? Math.round(sonuclar.reduce((s: number, r: any) => s + (r.puan ?? 0), 0) / total)
          : 0;
        setStats({ testSayisi: total, ortScore: avgScore, totalXp: (k as any).toplamXp ?? 0 });
      } else {
        setStats({ testSayisi: 0, ortScore: 0, totalXp: (k as any).toplamXp ?? 0 });
      }
    } catch { /* ignore */ }
  }, [router]);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handleProfilKaydet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kullanici) return;
    if (!ad.trim() || !soyad.trim()) {
      showToast('error', 'Ad ve soyad alanları boş bırakılamaz.');
      return;
    }
    setProfilYukleniyor(true);
    await new Promise((r) => setTimeout(r, 700));

    const updated: Kullanici = {
      ...kullanici,
      ad: ad.trim(),
      soyad: soyad.trim(),
      sinif: parseInt(sinif),
      okulIsmi: okulIsmi.trim(),
      okulNo: okulNo.trim(),
      avatarRenk,
    };

    try {
      const res = await fetch('/api/fizik-yildizi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'saveKullanici', data: updated }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Kayıt hatası');
    } catch {
      // Fallback to local save
      saveKullanici(updated);
    }

    localStorage.setItem('fizik_kullanici', JSON.stringify(updated));
    setKullanici(updated);
    setProfilYukleniyor(false);
    showToast('success', 'Profil bilgileriniz başarıyla güncellendi.');
  };

  const handleSifreDegistir = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kullanici) return;

    if (!mevcutSifre) { showToast('error', 'Mevcut şifrenizi girmelisiniz.'); return; }
    if (yeniSifre.length < 6) { showToast('error', 'Yeni şifre en az 6 karakter olmalıdır.'); return; }
    if (yeniSifre !== yeniSifreTekrar) { showToast('error', 'Yeni şifreler birbiriyle eşleşmiyor.'); return; }

    setSifreYukleniyor(true);
    await new Promise((r) => setTimeout(r, 700));

    try {
      const res = await fetch('/api/fizik-yildizi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'changePassword',
          data: { id: kullanici.id, mevcutSifre, yeniSifre },
        }),
      });
      const data = await res.json();
      if (!data.success) {
        showToast('error', data.message || 'Mevcut şifre hatalı.');
        setSifreYukleniyor(false);
        return;
      }
    } catch {
      // If endpoint doesn't exist, check locally
      if (kullanici.sifre && kullanici.sifre !== mevcutSifre) {
        showToast('error', 'Mevcut şifre hatalı.');
        setSifreYukleniyor(false);
        return;
      }
      const updated = { ...kullanici, sifre: yeniSifre };
      saveKullanici(updated);
      localStorage.setItem('fizik_kullanici', JSON.stringify(updated));
      setKullanici(updated);
    }

    setMevcutSifre('');
    setYeniSifre('');
    setYeniSifreTekrar('');
    setSifreYukleniyor(false);
    showToast('success', 'Şifreniz başarıyla değiştirildi.');
  };

  const handleProfilSil = () => {
    if (!kullanici) return;
    const onay = confirm(
      'Profilinizi ve tüm verilerinizi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.'
    );
    if (!onay) return;
    kullaniciSil(kullanici.id);
    localStorage.removeItem('fizik_token');
    localStorage.removeItem('fizik_kullanici');
    router.push('/fizik-yildizi');
  };

  if (!kullanici) {
    return (
      <div className={styles.wrapper} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ width: 44, height: 44, border: '3px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const initials = `${kullanici.ad[0] || '?'}${kullanici.soyad[0] || ''}`.toUpperCase();
  const xp = (kullanici as any).xp ?? 0;
  const league = getLeague(xp);
  const isPremium = (kullanici as any).premium === true;

  return (
    <div className={styles.wrapper}>
      <FizikNavbar />
      <main className={styles.main} style={{ padding: '2rem 1.5rem' }}>
        {/* Toast */}
        {toast && (
          <div
            style={{
              position: 'fixed',
              top: '5.5rem',
              right: '1.5rem',
              zIndex: 1000,
              background: toast.type === 'success' ? 'rgba(16,185,129,0.13)' : 'rgba(244,63,94,0.13)',
              border: `1px solid ${toast.type === 'success' ? 'rgba(16,185,129,0.35)' : 'rgba(244,63,94,0.35)'}`,
              borderRadius: '12px',
              padding: '0.85rem 1.25rem',
              color: toast.type === 'success' ? '#6ee7b7' : '#fda4af',
              fontWeight: 600,
              fontSize: '0.9rem',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              animation: 'slideInRight 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              maxWidth: '340px',
            }}
          >
            <span>{toast.type === 'success' ? '✅' : '⚠️'}</span>
            {toast.msg}
          </div>
        )}

        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '2rem', animation: 'fadeInUp 0.4s ease' }}>
            <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#f4f4f5', marginBottom: '0.3rem' }}>
              Profilim
            </h1>
            <p style={{ color: '#71717a', fontSize: '0.9rem' }}>
              Hesap bilgilerinizi ve güvenlik ayarlarınızı yönetin.
            </p>
          </div>

          {/* Profile hero card */}
          <div
            className={styles.glassCardNohover}
            style={{
              padding: '1.75rem',
              marginBottom: '1.5rem',
              animation: 'fadeInUp 0.45s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              flexWrap: 'wrap',
            }}
          >
            {/* Avatar */}
            <div style={{ flexShrink: 0 }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${kullanici.avatarRenk || '#6366f1'}, ${kullanici.avatarRenk || '#7c3aed'}cc)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  color: 'white',
                  border: '3px solid rgba(99,102,241,0.35)',
                  boxShadow: `0 0 24px ${kullanici.avatarRenk || '#6366f1'}40`,
                  letterSpacing: '-0.02em',
                }}
              >
                {initials}
              </div>
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f4f4f5' }}>
                  {kullanici.ad} {kullanici.soyad}
                </span>
                {isPremium ? (
                  <span className={styles.premiumBadge}>⚡ Premium</span>
                ) : (
                  <span className={styles.badge}>Standard</span>
                )}
              </div>
              <p style={{ color: '#71717a', fontSize: '0.85rem', marginBottom: '0.6rem' }}>
                {kullanici.email}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.2rem 0.7rem',
                    borderRadius: '9999px',
                    background: 'rgba(99,102,241,0.1)',
                    border: '1px solid rgba(99,102,241,0.2)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#818cf8',
                  }}
                >
                  📅 Katılım: {formatDate(kullanici.kayitTarihi)}
                </span>
                {kullanici.sinif && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: '0.2rem 0.7rem',
                      borderRadius: '9999px',
                      background: 'rgba(6,182,212,0.08)',
                      border: '1px solid rgba(6,182,212,0.2)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#67e8f9',
                    }}
                  >
                    🎓 {kullanici.sinif === 13 ? 'Mezun' : `${kullanici.sinif}. Sınıf`}
                  </span>
                )}
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {[
                { label: 'XP Puanı', value: xp.toLocaleString('tr-TR'), icon: '⚡', color: '#818cf8' },
                { label: 'Lig Sırası', value: `${league.icon} ${league.name}`, icon: '', color: league.color },
                { label: 'Toplam Test', value: stats.testSayisi, icon: '📝', color: '#6ee7b7' },
                { label: 'Ort. Puan', value: stats.testSayisi > 0 ? `%${stats.ortScore}` : '—', icon: '📊', color: '#fcd34d' },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid #27272a',
                    borderRadius: 12,
                    padding: '0.75rem 1.1rem',
                    textAlign: 'center',
                    minWidth: 90,
                  }}
                >
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: '0.72rem', color: '#52525b', marginTop: '0.15rem' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '0.4rem',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '12px',
              padding: '0.3rem',
              marginBottom: '1.5rem',
              width: 'fit-content',
              animation: 'fadeInUp 0.5s ease',
            }}
          >
            {([
              { id: 'profil', label: '👤 Profil Bilgileri' },
              { id: 'sifre', label: '🔒 Şifre Değiştir' },
              { id: 'rozetler', label: '🏆 Kupa Odası' },
            ] as const).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: '9px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  transition: 'all 0.2s',
                  background: activeTab === tab.id
                    ? 'linear-gradient(135deg, #6366f1, #7c3aed)'
                    : 'transparent',
                  color: activeTab === tab.id ? 'white' : '#71717a',
                  boxShadow: activeTab === tab.id ? '0 4px 15px rgba(99,102,241,0.3)' : 'none',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB: Profil */}
          {activeTab === 'profil' && (
            <form
              onSubmit={handleProfilKaydet}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem',
                animation: 'fadeInUp 0.35s ease',
              }}
            >
              {/* Kişisel Bilgiler */}
              <div className={styles.glassCardNohover} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f4f4f5', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  👤 Kişisel Bilgiler
                </h3>

                {/* Avatar renk */}
                <div>
                  <label className={styles.label}>Avatar Rengi</label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                    {AVATAR_COLORS.map((c) => (
                      <button
                        type="button"
                        key={c.value}
                        title={c.name}
                        onClick={() => setAvatarRenk(c.value)}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: '50%',
                          background: c.value,
                          cursor: 'pointer',
                          border: avatarRenk === c.value ? '2.5px solid white' : '1px solid rgba(255,255,255,0.15)',
                          boxShadow: avatarRenk === c.value ? `0 0 10px ${c.value}` : 'none',
                          transition: 'all 0.15s',
                          flexShrink: 0,
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                  <div>
                    <label className={styles.label}>
                      Ad <span style={{ color: '#6366f1' }}>*</span>
                    </label>
                    <input
                      type="text"
                      className={styles.inputField}
                      value={ad}
                      onChange={(e) => setAd(e.target.value)}
                      placeholder="Adınız"
                    />
                  </div>
                  <div>
                    <label className={styles.label}>
                      Soyad <span style={{ color: '#6366f1' }}>*</span>
                    </label>
                    <input
                      type="text"
                      className={styles.inputField}
                      value={soyad}
                      onChange={(e) => setSoyad(e.target.value)}
                      placeholder="Soyadınız"
                    />
                  </div>
                </div>

                <div>
                  <label className={styles.label}>E-posta (Değiştirilemez)</label>
                  <input
                    type="email"
                    className={styles.inputField}
                    value={kullanici.email}
                    disabled
                    style={{ opacity: 0.5, cursor: 'not-allowed' }}
                  />
                </div>
              </div>

              {/* Okul Bilgileri */}
              <div className={styles.glassCardNohover} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f4f4f5', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🏫 Okul Bilgileri
                </h3>

                <div>
                  <label className={styles.label}>Okul Adı</label>
                  <input
                    type="text"
                    className={styles.inputField}
                    value={okulIsmi}
                    onChange={(e) => setOkulIsmi(e.target.value)}
                    placeholder="Okulunuzun adı"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                  <div>
                    <label className={styles.label}>Sınıf</label>
                    <select className={styles.inputField} value={sinif} onChange={(e) => setSinif(e.target.value)}>
                      <option value="9">9. Sınıf</option>
                      <option value="10">10. Sınıf</option>
                      <option value="11">11. Sınıf</option>
                      <option value="12">12. Sınıf</option>
                      <option value="13">Mezun</option>
                    </select>
                  </div>
                  <div>
                    <label className={styles.label}>Okul Numarası</label>
                    <input
                      type="text"
                      className={styles.inputField}
                      value={okulNo}
                      onChange={(e) => setOkulNo(e.target.value)}
                      placeholder="Okul no"
                    />
                  </div>
                </div>

                {/* Save button */}
                <button
                  type="submit"
                  disabled={profilYukleniyor}
                  className={styles.btnPrimary}
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    marginTop: 'auto',
                    opacity: profilYukleniyor ? 0.8 : 1,
                    cursor: profilYukleniyor ? 'not-allowed' : 'pointer',
                  }}
                >
                  {profilYukleniyor ? (
                    <><span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span> Kaydediliyor...</>
                  ) : '💾 Değişiklikleri Kaydet'}
                </button>
              </div>

              {/* Veli Bağlantı Kodu */}
              <div className={styles.glassCardNohover} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f4f4f5', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  👨‍👩‍👦 Veli Bağlantı Kodu
                </h3>
                <p style={{ color: '#a1a1aa', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '0.5rem' }}>
                  Aileniz kayıt olurken bu kodu girerek gelişim raporlarınızı izleyebilir.
                </p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.04)', padding: '1rem', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)', width: 'max-content' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#10b981', letterSpacing: '4px' }}>
                    {kullanici.veliKodu || 'YÜKLENİYOR...'}
                  </span>
                </div>
              </div>

              {/* Danger Zone */}
              <div
                className={styles.glassCardNohover}
                style={{
                  padding: '1.5rem',
                  border: '1px solid rgba(244,63,94,0.2)',
                  gridColumn: '1 / -1',
                }}
              >
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f43f5e', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  ⚠️ Tehlikeli Alan
                </h3>
                <p style={{ color: '#71717a', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                  Hesabınızı sildiğinizde tüm çalışma verileriniz, testleriniz ve başarı geçmişiniz kalıcı olarak silinecektir. Bu işlem geri alınamaz.
                </p>
                <button
                  type="button"
                  onClick={handleProfilSil}
                  style={{
                    padding: '0.65rem 1.25rem',
                    borderRadius: '10px',
                    border: '1px solid rgba(244,63,94,0.35)',
                    background: 'rgba(244,63,94,0.06)',
                    color: '#fda4af',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(244,63,94,0.12)';
                    e.currentTarget.style.borderColor = 'rgba(244,63,94,0.55)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(244,63,94,0.06)';
                    e.currentTarget.style.borderColor = 'rgba(244,63,94,0.35)';
                  }}
                >
                  🗑️ Hesabımı Kalıcı Olarak Sil
                </button>
              </div>
            </form>
          )}

          {/* TAB: Rozetler / Kupa Odası */}
          {activeTab === 'rozetler' && (
            <div style={{ animation: 'fadeInUp 0.35s ease' }}>
              <div className={styles.glassCardNohover} style={{ padding: '1.75rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute', top: -50, right: -50, width: 150, height: 150,
                  background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none'
                }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fbbf24', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🏆 Kupa Odası
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2rem' }}>
                  Başarıların ve kazandığın özel madalyalar burada sergilenir.
                </p>

                {(() => {
                  const k: any = kullanici;
                  const r = k.rozetler ? (typeof k.rozetler === 'string' ? JSON.parse(k.rozetler) : k.rozetler) : [];
                  if (r.length === 0) {
                    return (
                      <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px dashed rgba(255,255,255,0.1)' }}>
                        <div style={{ fontSize: '2rem', opacity: 0.5, marginBottom: '0.5rem' }}>🎖️</div>
                        <div style={{ color: '#94a3b8' }}>Henüz hiç rozet kazanmadın.<br/>Test çözmeye başlayarak ilk rozetini alabilirsin!</div>
                      </div>
                    );
                  }
                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
                      {r.map((rozet: any, idx: number) => (
                        <div key={idx} style={{
                          background: 'linear-gradient(145deg, rgba(245,158,11,0.1), rgba(245,158,11,0.02))',
                          border: '1px solid rgba(245,158,11,0.2)',
                          borderRadius: 16,
                          padding: '1.5rem 1rem',
                          textAlign: 'center',
                          transition: 'all 0.3s ease',
                          cursor: 'default',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(245,158,11,0.15)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                          <div style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))', marginBottom: '0.5rem' }}>{rozet.ikon}</div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fcd34d' }}>{rozet.baslik}</div>
                          <div style={{ fontSize: '0.7rem', color: '#928461', marginTop: '0.25rem' }}>{new Date(rozet.tarih).toLocaleDateString('tr-TR')}</div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* TAB: Şifre */}
          {activeTab === 'sifre' && (
            <div style={{ animation: 'fadeInUp 0.35s ease', maxWidth: 480 }}>
              <div className={styles.glassCardNohover} style={{ padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f4f4f5', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🔒 Şifre Değiştir
                </h3>

                <form onSubmit={handleSifreDegistir} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  <div>
                    <label className={styles.label}>Mevcut Şifre</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={sifreGoster ? 'text' : 'password'}
                        className={styles.inputField}
                        value={mevcutSifre}
                        onChange={(e) => setMevcutSifre(e.target.value)}
                        placeholder="••••••••"
                        style={{ paddingRight: '3rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => setSifreGoster(!sifreGoster)}
                        style={{
                          position: 'absolute', right: '0.875rem', top: '50%',
                          transform: 'translateY(-50%)', background: 'none', border: 'none',
                          cursor: 'pointer', color: '#52525b', fontSize: '1rem', padding: '0.25rem',
                        }}
                      >
                        {sifreGoster ? '🙈' : '👁'}
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      height: '1px',
                      background: 'linear-gradient(90deg, transparent, #27272a, transparent)',
                    }}
                  />

                  <div>
                    <label className={styles.label}>Yeni Şifre</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={yeniSifreGoster ? 'text' : 'password'}
                        className={styles.inputField}
                        value={yeniSifre}
                        onChange={(e) => setYeniSifre(e.target.value)}
                        placeholder="En az 6 karakter"
                        style={{ paddingRight: '3rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => setYeniSifreGoster(!yeniSifreGoster)}
                        style={{
                          position: 'absolute', right: '0.875rem', top: '50%',
                          transform: 'translateY(-50%)', background: 'none', border: 'none',
                          cursor: 'pointer', color: '#52525b', fontSize: '1rem', padding: '0.25rem',
                        }}
                      >
                        {yeniSifreGoster ? '🙈' : '👁'}
                      </button>
                    </div>
                    {/* Strength indicator */}
                    {yeniSifre.length > 0 && (
                      <div style={{ marginTop: '0.4rem', display: 'flex', gap: '0.25rem' }}>
                        {[1, 2, 3, 4].map((n) => (
                          <div
                            key={n}
                            style={{
                              flex: 1,
                              height: 3,
                              borderRadius: 2,
                              background: yeniSifre.length >= n * 3
                                ? n <= 1 ? '#f43f5e' : n <= 2 ? '#f59e0b' : n <= 3 ? '#6366f1' : '#10b981'
                                : '#27272a',
                              transition: 'background 0.2s',
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className={styles.label}>Yeni Şifre Tekrar</label>
                    <input
                      type="password"
                      className={styles.inputField}
                      value={yeniSifreTekrar}
                      onChange={(e) => setYeniSifreTekrar(e.target.value)}
                      placeholder="••••••••"
                    />
                    {yeniSifreTekrar && yeniSifre !== yeniSifreTekrar && (
                      <p style={{ color: '#f43f5e', fontSize: '0.78rem', marginTop: '0.35rem' }}>
                        ⚠️ Şifreler eşleşmiyor
                      </p>
                    )}
                    {yeniSifreTekrar && yeniSifre === yeniSifreTekrar && yeniSifre.length >= 6 && (
                      <p style={{ color: '#10b981', fontSize: '0.78rem', marginTop: '0.35rem' }}>
                        ✅ Şifreler eşleşiyor
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={sifreYukleniyor}
                    className={styles.btnPrimary}
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      marginTop: '0.25rem',
                      opacity: sifreYukleniyor ? 0.8 : 1,
                      cursor: sifreYukleniyor ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {sifreYukleniyor ? (
                      <><span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span> Değiştiriliyor...</>
                    ) : '🔒 Şifremi Değiştir'}
                  </button>
                </form>
              </div>

              {/* Security tips */}
              <div
                style={{
                  marginTop: '1rem',
                  padding: '1rem 1.25rem',
                  borderRadius: '12px',
                  background: 'rgba(99,102,241,0.06)',
                  border: '1px solid rgba(99,102,241,0.15)',
                }}
              >
                <p style={{ fontSize: '0.8rem', color: '#71717a', lineHeight: 1.65 }}>
                  <span style={{ color: '#818cf8', fontWeight: 600 }}>🛡️ Güvenlik İpuçları:</span>
                  <br />• En az 8 karakter kullanın
                  <br />• Büyük/küçük harf ve sayı karıştırın
                  <br />• Şifrenizi kimseyle paylaşmayın
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
