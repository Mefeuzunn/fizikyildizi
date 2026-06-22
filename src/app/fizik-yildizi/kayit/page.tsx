'use client';

import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import styles from '@/app/fizik-yildizi/fizik.module.css';
import { getOgretmenler, saveKullanici } from '@/lib/fizik-yildizi/db';

type Rol = 'ogrenci' | 'ogretmen' | 'veli';

interface OgrenciForm {
  ad: string;
  soyad: string;
  email: string;
  sifre: string;
  sifreTekrar: string;
  sinif: string;
  okulNo: string;
  okulIsmi: string;
  ogretmenId: string;
  ogretmenAdi: string;
}

interface OgretmenForm {
  ad: string;
  soyad: string;
  email: string;
  sifre: string;
  sifreTekrar: string;
  okulAdi: string;
  brans: string;
}

interface VeliForm {
  ad: string;
  soyad: string;
  email: string;
  sifre: string;
  sifreTekrar: string;
  veliKodu: string;
}

const BRANSLAR = [
  'Fizik', 'Matematik', 'Kimya', 'Biyoloji', 'Astronomi', 'Diğer'
];

function KayitForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rolParam = searchParams.get('rol') as Rol | null;

  const [rol, setRol] = useState<Rol>(rolParam === 'ogretmen' ? 'ogretmen' : 'ogrenci');
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState('');
  const [hatalar, setHatalar] = useState<Record<string, string>>({});
  const [sifreGoster, setSifreGoster] = useState(false);
  const [adim, setAdim] = useState(1);

  const [ogrenciForm, setOgrenciForm] = useState<OgrenciForm>({
    ad: '', soyad: '', email: '', sifre: '', sifreTekrar: '', sinif: '9', okulNo: '',
    okulIsmi: '', ogretmenId: '', ogretmenAdi: '',
  });

  const [ogretmenListesi, setOgretmenListesi] = useState<any[]>([]);

  useEffect(() => {
    setOgretmenListesi(getOgretmenler());
  }, []);

  const [ogretmenForm, setOgretmenForm] = useState<OgretmenForm>({
    ad: '', soyad: '', email: '', sifre: '', sifreTekrar: '', okulAdi: '', brans: 'Fizik',
  });

  const [veliForm, setVeliForm] = useState<VeliForm>({
    ad: '', soyad: '', email: '', sifre: '', sifreTekrar: '', veliKodu: '',
  });

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    const form = rol === 'ogrenci' ? ogrenciForm : rol === 'ogretmen' ? ogretmenForm : veliForm;

    if (!form.ad.trim() || form.ad.trim().length < 2) errors.ad = 'Ad en az 2 karakter olmalıdır.';
    if (!form.soyad.trim() || form.soyad.trim().length < 2) errors.soyad = 'Soyad en az 2 karakter olmalıdır.';
    if (!form.email.trim() || !form.email.includes('@') || !form.email.includes('.')) {
      errors.email = 'Geçerli bir e-posta adresi giriniz.';
    }
    if (form.sifre.length < 6) errors.sifre = 'Şifre en az 6 karakter olmalıdır.';
    if (form.sifre !== form.sifreTekrar) errors.sifreTekrar = 'Şifreler eşleşmiyor.';

    if (rol === 'ogrenci') {
      if (!ogrenciForm.okulNo.trim()) errors.okulNo = 'Okul numarası gereklidir.';
      if (!ogrenciForm.okulIsmi.trim()) errors.okulIsmi = 'Okul adı gereklidir.';
      if (ogrenciForm.ogretmenId === 'manuel' && !ogrenciForm.ogretmenAdi.trim()) {
        errors.ogretmenAdi = 'Öğretmen ismi gereklidir.';
      }
    } else if (rol === 'ogretmen') {
      if (!ogretmenForm.okulAdi.trim()) errors.okulAdi = 'Okul adı gereklidir.';
    } else if (rol === 'veli') {
      if (!veliForm.veliKodu.trim() || veliForm.veliKodu.length < 6) errors.veliKodu = 'Geçerli bir veli kodu giriniz.';
    }

    setHatalar(errors);
    return Object.keys(errors).length === 0;
  };

  const handleKayit = async (e: FormEvent) => {
    e.preventDefault();
    setHata('');

    if (!validate()) return;

    setYukleniyor(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const form = rol === 'ogrenci' ? ogrenciForm : rol === 'ogretmen' ? ogretmenForm : veliForm;

    const kullanici = {
      id: `${rol}_${Date.now()}`,
      ad: form.ad.trim(),
      soyad: form.soyad.trim(),
      email: form.email.trim().toLowerCase(),
      sifre: form.sifre,
      rol,
      ...(rol === 'ogrenci'
        ? {
            sinif: parseInt(ogrenciForm.sinif),
            okulNo: ogrenciForm.okulNo,
            okulIsmi: ogrenciForm.okulIsmi,
            ogretmenId: ogrenciForm.ogretmenId !== 'manuel' && ogrenciForm.ogretmenId !== '' ? ogrenciForm.ogretmenId : undefined,
            ogretmenAdi: ogrenciForm.ogretmenId === 'manuel' ? ogrenciForm.ogretmenAdi : undefined,
            onayDurumu: 'bekliyor',
          }
        : rol === 'ogretmen'
        ? { okulAdi: ogretmenForm.okulAdi, brans: ogretmenForm.brans }
        : { bagliOgrenciId: veliForm.veliKodu.trim().toUpperCase() } // Storing code in bagliOgrenciId temp, will link on backend
      ),
      kayitTarihi: new Date().toISOString(),
      avatarRenk: rol === 'ogrenci' ? '#06b6d4' : rol === 'ogretmen' ? '#7c3aed' : '#10b981',
    };

    // Save to local registry database
    saveKullanici(kullanici as any);

    const token = btoa(`${kullanici.id}:${Date.now()}:fizik_yildizi`);
    localStorage.setItem('fizik_token', token);
    localStorage.setItem('fizik_kullanici', JSON.stringify(kullanici));

    setYukleniyor(false);
    setYukleniyor(false);
    if (kullanici.rol === 'ogretmen') {
      router.push('/fizik-yildizi/ogretmen/dashboard');
    } else if (kullanici.rol === 'veli') {
      router.push('/fizik-yildizi/veli/dashboard');
    } else {
      router.push(`/fizik-yildizi/email-dogrula?email=${encodeURIComponent(form.email.trim().toLowerCase())}`);
    }
  };

  const updateOgrenci = (field: keyof OgrenciForm, value: string) => {
    setOgrenciForm((prev) => ({ ...prev, [field]: value }));
    if (hatalar[field]) setHatalar((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const updateOgretmen = (field: keyof OgretmenForm, value: string) => {
    setOgretmenForm((prev) => ({ ...prev, [field]: value }));
    if (hatalar[field]) setHatalar((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const inputError = (field: string) => hatalar[field] ? (
    <span style={{ color: '#fca5a5', fontSize: '0.78rem', marginTop: '0.25rem', display: 'block' }}>
      ⚠ {hatalar[field]}
    </span>
  ) : null;

  const fieldStyle = (field: string): React.CSSProperties => ({
    borderColor: hatalar[field] ? 'rgba(239,68,68,0.5)' : undefined,
    boxShadow: hatalar[field] ? '0 0 0 3px rgba(239,68,68,0.15)' : undefined,
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Ambient orbs */}
      <div aria-hidden="true" style={{
        position: 'fixed', top: '15%', right: '8%',
        width: '350px', height: '350px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.11) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div aria-hidden="true" style={{
        position: 'fixed', bottom: '15%', left: '5%',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.09) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: '500px', animation: 'fadeInUp 0.5s ease' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <Link href="/fizik-yildizi" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <span style={{ fontSize: '1.6rem', animation: 'float 3s ease-in-out infinite', display: 'inline-block' }}>⭐</span>
            <span style={{
              fontSize: '1.25rem', fontWeight: 800,
              background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Fizik Yıldızı
            </span>
          </Link>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Ücretsiz hesap oluştur, hemen başla
          </p>
        </div>

        {/* Card */}
        <div className={styles.glassCardNohover} style={{ padding: '2rem', boxShadow: '0 30px 60px rgba(0,0,0,0.4)' }}>
          {/* Role tabs */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem',
            background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '0.3rem', marginBottom: '1.75rem',
          }}>
            {(['ogrenci', 'ogretmen', 'veli'] as Rol[]).map((r) => (
              <button
                key={r}
                onClick={() => { setRol(r); setHatalar({}); setHata(''); setAdim(1); }}
                style={{
                  padding: '0.65rem', borderRadius: '9px', border: 'none', cursor: 'pointer',
                  fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s',
                  background: rol === r ? 'linear-gradient(135deg, #7c3aed, #06b6d4)' : 'transparent',
                  color: rol === r ? 'white' : '#64748b',
                  boxShadow: rol === r ? '0 4px 15px rgba(124,58,237,0.3)' : 'none',
                }}
              >
                {r === 'ogrenci' ? '🎓 Öğrenci' : r === 'ogretmen' ? '📚 Öğretmen' : '👨‍👩‍👦 Veli'}
              </button>
            ))}
          </div>

          {/* Progress indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {[1, 2].map((s) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: s < 2 ? 1 : 'none' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: adim >= s ? 'linear-gradient(135deg, #7c3aed, #06b6d4)' : 'rgba(255,255,255,0.07)',
                  border: `2px solid ${adim >= s ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 700,
                  color: adim >= s ? 'white' : '#475569',
                  transition: 'all 0.3s',
                  flexShrink: 0,
                }}>
                  {adim > s ? '✓' : s}
                </div>
                {s < 2 && (
                  <div style={{
                    flex: 1, height: '2px',
                    background: adim > s ? 'linear-gradient(90deg, #7c3aed, #06b6d4)' : 'rgba(255,255,255,0.07)',
                    borderRadius: '1px', transition: 'all 0.3s',
                  }} />
                )}
              </div>
            ))}
            <span style={{ color: '#64748b', fontSize: '0.78rem', marginLeft: '0.5rem', flexShrink: 0 }}>
              Adım {adim}/2
            </span>
          </div>

          <form onSubmit={handleKayit}>
            {/* ===== STEP 1: Common fields ===== */}
            {adim === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                  <div>
                    <label className={styles.label}>Ad <span style={{ color: '#7c3aed' }}>*</span></label>
                    <input
                      type="text"
                      className={styles.inputField}
                      placeholder="Adınız"
                      style={fieldStyle('ad')}
                      value={rol === 'ogrenci' ? ogrenciForm.ad : ogretmenForm.ad}
                      onChange={(e) => rol === 'ogrenci' ? updateOgrenci('ad', e.target.value) : updateOgretmen('ad', e.target.value)}
                    />
                    {inputError('ad')}
                  </div>
                  <div>
                    <label className={styles.label}>Soyad <span style={{ color: '#7c3aed' }}>*</span></label>
                    <input
                      type="text"
                      className={styles.inputField}
                      placeholder="Soyadınız"
                      style={fieldStyle('soyad')}
                      value={rol === 'ogrenci' ? ogrenciForm.soyad : ogretmenForm.soyad}
                      onChange={(e) => rol === 'ogrenci' ? updateOgrenci('soyad', e.target.value) : updateOgretmen('soyad', e.target.value)}
                    />
                    {inputError('soyad')}
                  </div>
                </div>

                <div>
                  <label className={styles.label}>E-posta <span style={{ color: '#7c3aed' }}>*</span></label>
                  <input
                    type="email"
                    className={styles.inputField}
                    placeholder="ornek@email.com"
                    style={fieldStyle('email')}
                    autoComplete="email"
                    value={rol === 'ogrenci' ? ogrenciForm.email : ogretmenForm.email}
                    onChange={(e) => rol === 'ogrenci' ? updateOgrenci('email', e.target.value) : updateOgretmen('email', e.target.value)}
                  />
                  {inputError('email')}
                </div>

                <div>
                  <label className={styles.label}>Şifre <span style={{ color: '#7c3aed' }}>*</span></label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={sifreGoster ? 'text' : 'password'}
                      className={styles.inputField}
                      placeholder="En az 6 karakter"
                      style={{ ...fieldStyle('sifre'), paddingRight: '3rem' }}
                      autoComplete="new-password"
                      value={rol === 'ogrenci' ? ogrenciForm.sifre : ogretmenForm.sifre}
                      onChange={(e) => rol === 'ogrenci' ? updateOgrenci('sifre', e.target.value) : updateOgretmen('sifre', e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setSifreGoster(!sifreGoster)}
                      style={{
                        position: 'absolute', right: '0.875rem', top: '50%',
                        transform: 'translateY(-50%)', background: 'none', border: 'none',
                        cursor: 'pointer', color: '#64748b', fontSize: '1rem', padding: '0.25rem',
                      }}
                    >
                      {sifreGoster ? '🙈' : '👁'}
                    </button>
                  </div>
                  {inputError('sifre')}
                  {/* Strength bar */}
                  {(rol === 'ogrenci' ? ogrenciForm.sifre : ogretmenForm.sifre).length > 0 && (
                    <div style={{ marginTop: '0.4rem', display: 'flex', gap: '0.25rem' }}>
                      {[1, 2, 3, 4].map((level) => {
                        const len = (rol === 'ogrenci' ? ogrenciForm.sifre : ogretmenForm.sifre).length;
                        const strength = len < 6 ? 1 : len < 8 ? 2 : len < 10 ? 3 : 4;
                        const colors = ['#ef4444', '#f59e0b', '#10b981', '#06b6d4'];
                        return (
                          <div key={level} style={{
                            flex: 1, height: '3px', borderRadius: '2px',
                            background: level <= strength ? colors[strength - 1] : 'rgba(255,255,255,0.07)',
                            transition: 'all 0.3s',
                          }} />
                        );
                      })}
                    </div>
                  )}
                </div>

                <div>
                  <label className={styles.label}>Şifre Tekrar <span style={{ color: '#7c3aed' }}>*</span></label>
                  <input
                    type={sifreGoster ? 'text' : 'password'}
                    className={styles.inputField}
                    placeholder="Şifrenizi tekrar girin"
                    style={fieldStyle('sifreTekrar')}
                    autoComplete="new-password"
                    value={rol === 'ogrenci' ? ogrenciForm.sifreTekrar : ogretmenForm.sifreTekrar}
                    onChange={(e) => rol === 'ogrenci' ? updateOgrenci('sifreTekrar', e.target.value) : updateOgretmen('sifreTekrar', e.target.value)}
                  />
                  {inputError('sifreTekrar')}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    // Quick validate step 1 fields
                    const errs: Record<string, string> = {};
                    const form = rol === 'ogrenci' ? ogrenciForm : rol === 'ogretmen' ? ogretmenForm : veliForm;
                    if (!form.ad.trim() || form.ad.trim().length < 2) errs.ad = 'Ad en az 2 karakter olmalıdır.';
                    if (!form.soyad.trim() || form.soyad.trim().length < 2) errs.soyad = 'Soyad en az 2 karakter olmalıdır.';
                    if (!form.email.includes('@')) errs.email = 'Geçerli e-posta giriniz.';
                    if (form.sifre.length < 6) errs.sifre = 'Şifre en az 6 karakter.';
                    if (form.sifre !== form.sifreTekrar) errs.sifreTekrar = 'Şifreler eşleşmiyor.';
                    setHatalar(errs);
                    if (Object.keys(errs).length === 0) setAdim(2);
                  }}
                  className={styles.btnPrimary}
                  style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                >
                  Devam Et →
                </button>
              </div>
            )}

            {/* ===== STEP 2: Role-specific fields ===== */}
            {adim === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {rol === 'ogrenci' ? (
                  <>
                    <div>
                      <label className={styles.label}>Sınıf <span style={{ color: '#7c3aed' }}>*</span></label>
                      <select
                        className={styles.inputField}
                        value={ogrenciForm.sinif}
                        onChange={(e) => updateOgrenci('sinif', e.target.value)}
                      >
                        <option value="9">9. Sınıf</option>
                        <option value="10">10. Sınıf</option>
                        <option value="11">11. Sınıf</option>
                        <option value="12">12. Sınıf</option>
                        <option value="13">Mezun</option>
                      </select>
                    </div>
                    <div>
                      <label className={styles.label}>Okul Numarası <span style={{ color: '#7c3aed' }}>*</span></label>
                      <input
                        type="text"
                        className={styles.inputField}
                        placeholder="Okul numaranız"
                        style={fieldStyle('okulNo')}
                        value={ogrenciForm.okulNo}
                        onChange={(e) => updateOgrenci('okulNo', e.target.value)}
                      />
                      {inputError('okulNo')}
                    </div>
                    <div>
                      <label className={styles.label}>Okul Adı <span style={{ color: '#7c3aed' }}>*</span></label>
                      <input
                        type="text"
                        className={styles.inputField}
                        placeholder="Okulunuzun adı"
                        style={fieldStyle('okulIsmi')}
                        value={ogrenciForm.okulIsmi}
                        onChange={(e) => updateOgrenci('okulIsmi', e.target.value)}
                      />
                      {inputError('okulIsmi')}
                    </div>
                    <div>
                      <label className={styles.label}>Fizik Öğretmeni <span style={{ color: '#7c3aed' }}>*</span></label>
                      <select
                        className={styles.inputField}
                        value={ogrenciForm.ogretmenId}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateOgrenci('ogretmenId', val);
                          if (val !== 'manuel') {
                            updateOgrenci('ogretmenAdi', '');
                          }
                        }}
                      >
                        <option value="">Öğretmen Seçin</option>
                        {ogretmenListesi.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.ad} {t.soyad} ({t.okulAdi})
                          </option>
                        ))}
                        <option value="manuel">➕ Listede Yok (Elle Ekle)</option>
                      </select>
                    </div>
                    {ogrenciForm.ogretmenId === 'manuel' && (
                      <div>
                        <label className={styles.label}>Öğretmen Adı Soyadı <span style={{ color: '#7c3aed' }}>*</span></label>
                        <input
                          type="text"
                          className={styles.inputField}
                          placeholder="Öğretmeninizin adı soyadı"
                          style={fieldStyle('ogretmenAdi')}
                          value={ogrenciForm.ogretmenAdi}
                          onChange={(e) => updateOgrenci('ogretmenAdi', e.target.value)}
                        />
                        {inputError('ogretmenAdi')}
                      </div>
                    )}
                  </>
                ) : rol === 'ogretmen' ? (
                  <>
                    <div>
                      <label className={styles.label}>Okul Adı <span style={{ color: '#7c3aed' }}>*</span></label>
                      <input
                        type="text"
                        className={styles.inputField}
                        placeholder="Çalıştığınız okul"
                        style={fieldStyle('okulAdi')}
                        value={ogretmenForm.okulAdi}
                        onChange={(e) => updateOgretmen('okulAdi', e.target.value)}
                      />
                      {inputError('okulAdi')}
                    </div>
                    <div>
                      <label className={styles.label}>Branş <span style={{ color: '#7c3aed' }}>*</span></label>
                      <select
                        className={styles.inputField}
                        value={ogretmenForm.brans}
                        onChange={(e) => updateOgretmen('brans', e.target.value)}
                      >
                        {BRANSLAR.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className={styles.label}>Öğrenci Veli Kodu <span style={{ color: '#7c3aed' }}>*</span></label>
                      <input
                        type="text"
                        className={styles.inputField}
                        placeholder="Öğrencinizin sistem kodu (örn: A7X9K2)"
                        style={fieldStyle('veliKodu')}
                        value={veliForm.veliKodu}
                        onChange={(e) => {
                          setVeliForm(prev => ({...prev, veliKodu: e.target.value.toUpperCase()}));
                          if(hatalar['veliKodu']) setHatalar(prev => { const n = {...prev}; delete n['veliKodu']; return n; });
                        }}
                        maxLength={6}
                      />
                      {inputError('veliKodu')}
                      <p style={{fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.35rem'}}>Öğrencinin profil panelinden öğrenebilirsiniz.</p>
                    </div>
                  </>
                )}

                {/* Terms */}
                <p style={{ color: '#475569', fontSize: '0.78rem', lineHeight: 1.6 }}>
                  Kayıt olarak{' '}
                  <Link href="/fizik-yildizi/kosullar" style={{ color: '#8b5cf6', textDecoration: 'none' }}>
                    Kullanım Şartları
                  </Link>
                  {' '}ve{' '}
                  <Link href="/fizik-yildizi/gizlilik" style={{ color: '#8b5cf6', textDecoration: 'none' }}>
                    Gizlilik Politikası
                  </Link>
                  &apos;nı kabul etmiş olursunuz.
                </p>

                {/* Error */}
                {hata && (
                  <div style={{
                    padding: '0.75rem 1rem', borderRadius: '10px',
                    background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
                    color: '#fca5a5', fontSize: '0.875rem',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                  }}>
                    ⚠️ {hata}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                  <button
                    type="button"
                    onClick={() => setAdim(1)}
                    className={styles.btnSecondary}
                    style={{ flex: '0 0 auto', padding: '0.875rem 1.25rem' }}
                  >
                    ← Geri
                  </button>
                  <button
                    type="submit"
                    disabled={yukleniyor}
                    className={styles.btnPrimary}
                    style={{
                      flex: 1, justifyContent: 'center',
                      opacity: yukleniyor ? 0.8 : 1,
                      cursor: yukleniyor ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {yukleniyor ? (
                      <><span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span> Kaydediliyor...</>
                    ) : (
                      '🚀 Kaydı Tamamla'
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Login link */}
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#64748b', fontSize: '0.9rem' }}>
          Zaten hesabın var mı?{' '}
          <Link href="/fizik-yildizi/giris" style={{ color: '#8b5cf6', fontWeight: 600, textDecoration: 'none' }}>
            Giriş Yap →
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Wrap with Suspense because useSearchParams requires it in Next.js App Router
export default function KayitPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
        Yükleniyor...
      </div>
    }>
      <KayitForm />
    </Suspense>
  );
}
