'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FizikNavbar from '@/components/fizik-yildizi/FizikNavbar';
import { syncWithServer } from '@/lib/fizik-yildizi/db';
import SerbrestDusme from '@/components/fizik-yildizi/simulations/SerbrestDusme';
import AtisHareketi from '@/components/fizik-yildizi/simulations/AtisHareketi';

interface Tartisma {
  id: string;
  ogrenciId: string;
  ogrenciAdi: string;
  ogrenciAvatarRenk: string;
  baslik: string;
  icerik: string;
  konuId: string;
  sinif: number;
  ogretmenId: string;
  tarih: string;
  cevapSayisi: number;
}

interface Cevap {
  id: string;
  tartisId: string;
  yazarId: string;
  yazarAdi: string;
  yazarRol: string;
  yazarAvatarRenk: string;
  icerik: string;
  simulasyonParametreleri?: string;
  begeniler: number;
  tarih: string;
}

const KONU_TAGLARI = [
  { id: 'hepsi', label: 'Hepsi', color: '#6366f1' },
  { id: 'mekanik', label: '⚙️ Mekanik', color: '#6366f1' },
  { id: 'elektrik', label: '⚡ Elektrik', color: '#f59e0b' },
  { id: 'optik', label: '🔭 Optik', color: '#10b981' },
  { id: 'dalgalar', label: '🌊 Dalgalar', color: '#06b6d4' },
  { id: 'modern', label: '⚛️ Modern Fizik', color: '#a855f7' },
];

export default function SinifForumPage() {
  const router = useRouter();
  const [kullanici, setKullanici] = useState<any>(null);
  const [tartismalar, setTartismalar] = useState<Tartisma[]>([]);
  const [seciliTartisma, setSeciliTartisma] = useState<Tartisma | null>(null);
  const [cevaplar, setCevaplar] = useState<Cevap[]>([]);
  const [aktifTag, setAktifTag] = useState('hepsi');
  const [yukleniyor, setYukleniyor] = useState(true);

  // New post form
  const [yeniBaslik, setYeniBaslik] = useState('');
  const [yeniIcerik, setYeniIcerik] = useState('');
  const [yeniKonu, setYeniKonu] = useState('mekanik');
  const [forumAcik, setForumAcik] = useState(false);
  const [gondermeyukleniyor, setGondermeyukleniyor] = useState(false);

  // New answer form
  const [cevapIcerik, setCevapIcerik] = useState('');
  const [cevapGonderiliyor, setCevapGonderiliyor] = useState(false);

  // Simulation attach states for reply
  const [ekliSim, setEkliSim] = useState<'none' | 'serbest-dusme' | 'atis-hareketi'>('none');
  
  // Serbest düşme parameters
  const [fdHeight, setFdHeight] = useState(50);
  const [fdPlanet, setFdPlanet] = useState(0);
  const [fdDrag, setFdDrag] = useState(false);
  const [fdMass, setFdMass] = useState(1.0);
  
  // Atış hareketi parameters
  const [ahMode, setAhMode] = useState<'egik' | 'yatay' | 'dusey'>('egik');
  const [ahV0, setAhV0] = useState(30);
  const [ahAngle, setAhAngle] = useState(45);
  const [ahHeight, setAhHeight] = useState(30);

  // Active viewing simulation (modal state)
  const [aktifSimCevap, setAktifSimCevap] = useState<Cevap | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('fizik_token');
    const kData = localStorage.getItem('fizik_kullanici');
    if (!token || !kData) { router.push('/fizik-yildizi/giris'); return; }
    const k = JSON.parse(kData);
    setKullanici(k);

    // Load from syncWithServer then localStorage
    syncWithServer().then(() => {
      const stored = localStorage.getItem('fizik_sinif_tartismalar') || '[]';
      const parsed: Tartisma[] = JSON.parse(stored);
      // Filter by same class group
      const sinifTartismalar = parsed.filter(t =>
        t.ogretmenId === k.ogretmenId || t.ogrenciId === k.id
      );
      setTartismalar(sinifTartismalar);
      setYukleniyor(false);
    });
  }, [router]);

  const loadCevaplar = async (tartisma: Tartisma) => {
    setSeciliTartisma(tartisma);
    try {
      const res = await fetch('/api/fizik-yildizi?tartisId=' + tartisma.id);
      const data = await res.json();
      if (data.sinifCevaplari) setCevaplar(data.sinifCevaplari);
      else setCevaplar([]);
    } catch {
      setCevaplar([]);
    }
  };

  const handleYeniTartisma = async () => {
    if (!yeniBaslik.trim() || !yeniIcerik.trim() || !kullanici) return;
    setGondermeyukleniyor(true);

    const tartisma: Tartisma = {
      id: `tartis_${Date.now()}_${kullanici.id}`,
      ogrenciId: kullanici.id,
      ogrenciAdi: `${kullanici.ad} ${kullanici.soyad}`,
      ogrenciAvatarRenk: kullanici.avatarRenk || '#6366f1',
      baslik: yeniBaslik.trim(),
      icerik: yeniIcerik.trim(),
      konuId: yeniKonu,
      sinif: kullanici.sinif || 11,
      ogretmenId: kullanici.ogretmenId || '',
      tarih: new Date().toISOString(),
      cevapSayisi: 0,
    };

    try {
      await fetch('/api/fizik-yildizi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'saveTartis', data: tartisma })
      });

      const stored = JSON.parse(localStorage.getItem('fizik_sinif_tartismalar') || '[]');
      stored.unshift(tartisma);
      localStorage.setItem('fizik_sinif_tartismalar', JSON.stringify(stored));
      setTartismalar(prev => [tartisma, ...prev]);

      setYeniBaslik('');
      setYeniIcerik('');
      setForumAcik(false);
    } catch {}

    setGondermeyukleniyor(false);
  };

  const handleCevapGonder = async () => {
    if (!cevapIcerik.trim() || !kullanici || !seciliTartisma) return;
    setCevapGonderiliyor(true);

    let simulasyonParametreleri: string | undefined = undefined;
    if (ekliSim === 'serbest-dusme') {
      simulasyonParametreleri = JSON.stringify({
        type: 'serbest-dusme',
        height: fdHeight,
        planetIdx: fdPlanet,
        airResistance: fdDrag,
        mass: fdMass
      });
    } else if (ekliSim === 'atis-hareketi') {
      simulasyonParametreleri = JSON.stringify({
        type: 'atis-hareketi',
        mode: ahMode,
        v0: ahV0,
        angleDeg: ahAngle,
        height: ahHeight
      });
    }

    const cevap: Cevap = {
      id: `cevap_${Date.now()}_${kullanici.id}`,
      tartisId: seciliTartisma.id,
      yazarId: kullanici.id,
      yazarAdi: `${kullanici.ad} ${kullanici.soyad}`,
      yazarRol: kullanici.rol,
      yazarAvatarRenk: kullanici.avatarRenk || '#6366f1',
      icerik: cevapIcerik.trim(),
      simulasyonParametreleri,
      begeniler: 0,
      tarih: new Date().toISOString(),
    };

    await fetch('/api/fizik-yildizi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'saveCevap', data: cevap })
    });

    setCevaplar(prev => [...prev, cevap]);
    setCevapIcerik('');
    setEkliSim('none'); // Reset simulation selection
    setCevapGonderiliyor(false);

    // Update answer count
    setTartismalar(prev => prev.map(t =>
      t.id === seciliTartisma.id ? { ...t, cevapSayisi: t.cevapSayisi + 1 } : t
    ));
  };

  const handleUpvote = async (cevap: Cevap) => {
    await fetch('/api/fizik-yildizi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'upvoteCevap', data: { tartisId: cevap.tartisId, cevapId: cevap.id } })
    });
    setCevaplar(prev => prev.map(c => c.id === cevap.id ? { ...c, begeniler: c.begeniler + 1 } : c));
  };

  const filteredTartismalar = aktifTag === 'hepsi'
    ? tartismalar
    : tartismalar.filter(t => t.konuId === aktifTag);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 60000);
    if (diff < 1) return 'Az önce';
    if (diff < 60) return `${diff} dk önce`;
    if (diff < 1440) return `${Math.floor(diff / 60)} saat önce`;
    return d.toLocaleDateString('tr-TR');
  };

  if (!kullanici) return null;


  return (
    <div style={{ background: '#09090b', minHeight: '100vh', color: '#f4f4f5' }}>
      <FizikNavbar />
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '6rem 1.5rem 4rem', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>

        {/* Left column */}
        <div>
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f4f4f5', marginBottom: '0.375rem' }}>
                  🏛️ Sınıf Forumu
                </h1>
                <p style={{ color: '#71717a', fontSize: '0.9rem' }}>
                  Sınıf arkadaşlarınla fizik soruları sor, cevapla, açıkla.
                </p>
              </div>
              <button
                onClick={() => setForumAcik(!forumAcik)}
                style={{
                  padding: '0.625rem 1.25rem', borderRadius: '10px', border: 'none',
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  color: 'white', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(99,102,241,0.35)',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                }}
              >
                ✏️ Yeni Soru
              </button>
            </div>

            {/* New post form */}
            {forumAcik && (
              <div style={{ background: '#111113', border: '1px solid #27272a', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#f4f4f5' }}>
                  Yeni Soru Sor
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#71717a', marginBottom: '0.35rem' }}>
                      Başlık
                    </label>
                    <input
                      type="text"
                      value={yeniBaslik}
                      onChange={e => setYeniBaslik(e.target.value)}
                      placeholder="Sorunuzu kısaca özetleyin..."
                      style={{
                        width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
                        border: '1px solid #27272a', background: '#18181b',
                        color: '#f4f4f5', fontSize: '0.9rem', outline: 'none',
                        fontFamily: 'inherit', boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#71717a', marginBottom: '0.35rem' }}>
                      Konu
                    </label>
                    <select
                      value={yeniKonu}
                      onChange={e => setYeniKonu(e.target.value)}
                      style={{
                        padding: '0.75rem 1rem', borderRadius: '10px',
                        border: '1px solid #27272a', background: '#18181b',
                        color: '#f4f4f5', fontSize: '0.9rem', outline: 'none',
                      }}
                    >
                      {KONU_TAGLARI.filter(k => k.id !== 'hepsi').map(k => (
                        <option key={k.id} value={k.id}>{k.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#71717a', marginBottom: '0.35rem' }}>
                      Detay
                    </label>
                    <textarea
                      value={yeniIcerik}
                      onChange={e => setYeniIcerik(e.target.value)}
                      placeholder="Problemi ve ne denediğinizi açıklayın..."
                      rows={4}
                      style={{
                        width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
                        border: '1px solid #27272a', background: '#18181b',
                        color: '#f4f4f5', fontSize: '0.9rem', outline: 'none', resize: 'vertical',
                        fontFamily: 'inherit', boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => setForumAcik(false)}
                      style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #27272a', background: '#18181b', color: '#a1a1aa', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}
                    >
                      İptal
                    </button>
                    <button
                      onClick={handleYeniTartisma}
                      disabled={!yeniBaslik.trim() || !yeniIcerik.trim() || gondermeyukleniyor}
                      style={{
                        padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none',
                        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                        color: 'white', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 700,
                        opacity: gondermeyukleniyor ? 0.7 : 1,
                      }}
                    >
                      {gondermeyukleniyor ? 'Gönderiliyor...' : '🚀 Gönder'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tag filter */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {KONU_TAGLARI.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => setAktifTag(tag.id)}
                  style={{
                    padding: '0.35rem 0.875rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600,
                    border: `1px solid ${aktifTag === tag.id ? tag.color : '#27272a'}`,
                    background: aktifTag === tag.id ? `${tag.color}15` : '#18181b',
                    color: aktifTag === tag.id ? tag.color : '#71717a',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tartışma listesi */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {yukleniyor ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#52525b' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem', animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</div>
                <div>Yükleniyor...</div>
              </div>
            ) : filteredTartismalar.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3.5rem 2rem', background: '#111113', border: '1px solid #27272a', borderRadius: '16px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏛️</div>
                <div style={{ fontWeight: 700, color: '#f4f4f5', marginBottom: '0.5rem' }}>Forum henüz boş</div>
                <p style={{ color: '#52525b', fontSize: '0.85rem', lineHeight: 1.6, maxWidth: '300px', margin: '0 auto 1.5rem' }}>
                  {aktifTag === 'hepsi'
                    ? 'Sınıfında henüz hiç soru sorulmamış. İlk soruyu sen sor!'
                    : `${KONU_TAGLARI.find(t => t.id === aktifTag)?.label || aktifTag} kategorisinde henüz soru yok.`}
                </p>
                <button
                  onClick={() => setForumAcik(true)}
                  style={{
                    padding: '0.625rem 1.5rem', borderRadius: '10px', border: 'none',
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    color: 'white', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
                  }}
                >
                  ✏️ İlk Soruyu Sor
                </button>
              </div>
            ) : filteredTartismalar.map(tartisma => {
              const tag = KONU_TAGLARI.find(t => t.id === tartisma.konuId);
              return (
                <div
                  key={tartisma.id}
                  onClick={() => loadCevaplar(tartisma)}
                  style={{
                    background: seciliTartisma?.id === tartisma.id ? '#15151a' : '#111113',
                    border: `1px solid ${seciliTartisma?.id === tartisma.id ? '#6366f1' : '#27272a'}`,
                    borderLeft: `4px solid ${tag?.color || '#6366f1'}`,
                    borderRadius: '12px',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (seciliTartisma?.id !== tartisma.id) (e.currentTarget as HTMLElement).style.borderColor = '#3f3f46'; }}
                  onMouseLeave={e => { if (seciliTartisma?.id !== tartisma.id) (e.currentTarget as HTMLElement).style.borderColor = '#27272a'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                    {/* Avatar */}
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: tartisma.ogrenciAvatarRenk,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.875rem', fontWeight: 700, color: 'white', flexShrink: 0,
                    }}>
                      {tartisma.ogrenciAdi.charAt(0)}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#a1a1aa' }}>{tartisma.ogrenciAdi}</span>
                        <span style={{ fontSize: '0.72rem', color: '#52525b' }}>·</span>
                        <span style={{ fontSize: '0.72rem', color: '#52525b' }}>{formatDate(tartisma.tarih)}</span>
                        {tag && (
                          <span style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem', borderRadius: '20px', background: `${tag.color}15`, color: tag.color, fontWeight: 700 }}>
                            {tag.label}
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f4f4f5', marginBottom: '0.35rem' }}>
                        {tartisma.baslik}
                      </h3>
                      <p style={{ fontSize: '0.82rem', color: '#71717a', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {tartisma.icerik}
                      </p>
                      <div style={{ marginTop: '0.625rem', display: 'flex', gap: '1rem' }}>
                        <span style={{ fontSize: '0.75rem', color: '#52525b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          💬 {tartisma.cevapSayisi} cevap
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column — selected thread detail */}
        <div style={{ position: 'sticky', top: '5rem' }}>
          {seciliTartisma ? (
            <div style={{ background: '#111113', border: '1px solid #27272a', borderRadius: '16px', overflow: 'hidden' }}>
              {/* Thread header */}
              <div style={{ padding: '1.25rem', borderBottom: '1px solid #1c1c1f' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f4f4f5', marginBottom: '0.5rem' }}>
                  {seciliTartisma.baslik}
                </h2>
                <p style={{ fontSize: '0.82rem', color: '#71717a', lineHeight: 1.6 }}>
                  {seciliTartisma.icerik}
                </p>
                <div style={{ marginTop: '0.75rem', fontSize: '0.72rem', color: '#52525b' }}>
                  {seciliTartisma.ogrenciAdi} · {formatDate(seciliTartisma.tarih)}
                </div>
              </div>

              {/* Answers */}
              <div style={{ maxHeight: '280px', overflowY: 'auto', padding: '0.875rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {cevaplar.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#52525b', fontSize: '0.82rem', padding: '1.5rem 0' }}>
                    Henüz cevap yok. İlk cevabı sen ver!
                  </div>
                ) : cevaplar.map(cevap => (
                  <div key={cevap.id} style={{ background: '#18181b', borderRadius: '10px', padding: '0.875rem', borderLeft: '3px solid #6366f1' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: cevap.yazarAvatarRenk, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: 'white' }}>
                          {cevap.yazarAdi.charAt(0)}
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa' }}>{cevap.yazarAdi}</span>
                        {cevap.yazarRol === 'ogretmen' && (
                          <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: 'rgba(16,185,129,0.15)', color: '#10b981', fontWeight: 700 }}>Öğretmen</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleUpvote(cevap)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', fontWeight: 700,
                          padding: '0.2rem 0.5rem', borderRadius: '6px',
                          border: '1px solid #27272a', background: '#111113', color: '#71717a',
                          cursor: 'pointer', transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#6366f1'; (e.currentTarget as HTMLElement).style.borderColor = '#6366f1'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#71717a'; (e.currentTarget as HTMLElement).style.borderColor = '#27272a'; }}
                      >
                        ▲ {cevap.begeniler}
                      </button>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#f4f4f5', lineHeight: 1.6 }}>{cevap.icerik}</p>
                    
                    {/* Render attached simulation card */}
                    {cevap.simulasyonParametreleri && (() => {
                      try {
                        const params = JSON.parse(cevap.simulasyonParametreleri);
                        const isFd = params.type === 'serbest-dusme';
                        return (
                          <div style={{
                            margin: '0.625rem 0', padding: '0.75rem', borderRadius: '8px',
                            background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)',
                            display: 'flex', flexDirection: 'column', gap: '0.5rem'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: '#a78bfa' }}>
                              <span>🔬 Deney Kurulumu:</span>
                              <span style={{ color: '#f4f4f5' }}>{isFd ? 'Serbest Düşme' : 'Atış Hareketi'}</span>
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#a1a1aa', fontFamily: 'monospace' }}>
                              {isFd ? (
                                `Yükseklik: ${params.height}m · ${params.planetIdx === 0 ? 'Dünya' : params.planetIdx === 1 ? 'Ay' : 'Mars'} · ${params.airResistance ? 'Hava Dirençli' : 'Sürtünmesiz'}`
                              ) : (
                                `Mod: ${params.mode === 'egik' ? 'Eğik' : params.mode === 'yatay' ? 'Yatay' : 'Düşey'} · V₀: ${params.v0}m/s · ${params.mode === 'egik' ? `Açı: ${params.angleDeg}°` : `Yükseklik: ${params.height}m`}`
                              )}
                            </div>
                            <button
                              onClick={() => setAktifSimCevap(cevap)}
                              style={{
                                width: '100%', padding: '0.4rem', borderRadius: '6px', border: 'none',
                                background: '#6366f1', color: 'white', fontSize: '0.72rem', fontWeight: 700,
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem',
                                transition: 'all 0.15s'
                              }}
                              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#4f46e5'}
                              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#6366f1'}
                            >
                              ▶️ İnteraktif Deneyi Çalıştır
                            </button>
                          </div>
                        );
                      } catch { return null; }
                    })()}

                    <div style={{ fontSize: '0.68rem', color: '#52525b', marginTop: '0.35rem' }}>{formatDate(cevap.tarih)}</div>
                  </div>
                ))}
              </div>

              {/* Reply form */}
              <div style={{ padding: '0.875rem 1rem', borderTop: '1px solid #1c1c1f' }}>
                <textarea
                  value={cevapIcerik}
                  onChange={e => setCevapIcerik(e.target.value)}
                  placeholder="Cevabını yaz..."
                  rows={3}
                  style={{
                    width: '100%', padding: '0.625rem 0.875rem', borderRadius: '10px',
                    border: '1px solid #27272a', background: '#18181b',
                    color: '#f4f4f5', fontSize: '0.82rem', outline: 'none', resize: 'none',
                    fontFamily: 'inherit', marginBottom: '0.625rem', boxSizing: 'border-box',
                  }}
                />

                {/* Simulation attachment options */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#a1a1aa' }}>🔬 İnteraktif Deney Ekle</span>
                    <select
                      value={ekliSim}
                      onChange={e => setEkliSim(e.target.value as any)}
                      style={{
                        padding: '0.35rem 0.5rem', borderRadius: '6px',
                        border: '1px solid #27272a', background: '#111113',
                        color: '#f4f4f5', fontSize: '0.75rem', outline: 'none', cursor: 'pointer'
                      }}
                    >
                      <option value="none">Yok (Sadece Metin)</option>
                      <option value="serbest-dusme">☄️ Serbest Düşme</option>
                      <option value="atis-hareketi">🚀 Atış Hareketi</option>
                    </select>
                  </div>

                  {ekliSim === 'serbest-dusme' && (
                    <div style={{ padding: '0.75rem', background: '#111113', border: '1px solid #27272a', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.625rem', marginTop: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.72rem', color: '#71717a' }}>Yükseklik: {fdHeight}m</span>
                        <input type="range" min={10} max={100} value={fdHeight} onChange={e => setFdHeight(+e.target.value)} style={{ width: '120px', accentColor: '#6366f1' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.72rem', color: '#71717a' }}>Gezegen: {fdPlanet === 0 ? 'Dünya' : fdPlanet === 1 ? 'Ay' : 'Mars'}</span>
                        <select value={fdPlanet} onChange={e => setFdPlanet(+e.target.value)} style={{ padding: '0.2rem', background: '#18181b', border: '1px solid #27272a', color: 'white', fontSize: '0.7rem', borderRadius: '4px' }}>
                          <option value={0}>Dünya (g=9.8)</option>
                          <option value={1}>Ay (g=1.6)</option>
                          <option value={2}>Mars (g=3.7)</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.72rem', color: '#71717a' }}>Hava Direnci</span>
                        <input type="checkbox" checked={fdDrag} onChange={e => setFdDrag(e.target.checked)} />
                      </div>
                    </div>
                  )}

                  {ekliSim === 'atis-hareketi' && (
                    <div style={{ padding: '0.75rem', background: '#111113', border: '1px solid #27272a', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.625rem', marginTop: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.72rem', color: '#71717a' }}>Hız (V₀): {ahV0} m/s</span>
                        <input type="range" min={5} max={50} value={ahV0} onChange={e => setAhV0(+e.target.value)} style={{ width: '120px', accentColor: '#6366f1' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.72rem', color: '#71717a' }}>Mod: {ahMode === 'egik' ? 'Eğik' : ahMode === 'yatay' ? 'Yatay' : 'Düşey'}</span>
                        <select value={ahMode} onChange={e => setAhMode(e.target.value as any)} style={{ padding: '0.2rem', background: '#18181b', border: '1px solid #27272a', color: 'white', fontSize: '0.7rem', borderRadius: '4px' }}>
                          <option value="egik">Eğik Atış</option>
                          <option value="yatay">Yatay Atış</option>
                          <option value="dusey">Düşey Atış</option>
                        </select>
                      </div>
                      {ahMode === 'egik' && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.72rem', color: '#71717a' }}>Açı (θ): {ahAngle}°</span>
                          <input type="range" min={5} max={85} value={ahAngle} onChange={e => setAhAngle(+e.target.value)} style={{ width: '120px', accentColor: '#6366f1' }} />
                        </div>
                      )}
                      {ahMode !== 'egik' && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.72rem', color: '#71717a' }}>Yükseklik (h): {ahHeight}m</span>
                          <input type="range" min={0} max={60} value={ahHeight} onChange={e => setAhHeight(+e.target.value)} style={{ width: '120px', accentColor: '#6366f1' }} />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleCevapGonder}
                  disabled={!cevapIcerik.trim() || cevapGonderiliyor}
                  style={{
                    width: '100%', padding: '0.6rem', borderRadius: '8px', border: 'none',
                    background: cevapIcerik.trim() ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : '#27272a',
                    color: cevapIcerik.trim() ? 'white' : '#52525b',
                    fontWeight: 700, fontSize: '0.875rem',
                    cursor: cevapIcerik.trim() && !cevapGonderiliyor ? 'pointer' : 'not-allowed',
                  }}
                >
                  {cevapGonderiliyor ? 'Gönderiliyor...' : '💬 Cevapla (+50 XP)'}
                </button>
              </div>
            </div>
          ) : (
            <div style={{ background: '#111113', border: '1px solid #27272a', borderRadius: '16px', padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💬</div>
              <div style={{ fontWeight: 700, color: '#f4f4f5', marginBottom: '0.5rem' }}>Bir soru seç</div>
              <p style={{ color: '#52525b', fontSize: '0.82rem', lineHeight: 1.6 }}>
                Sol taraftaki listeden bir soruya tıklayarak cevaplar görüntüle ve ekle.
              </p>
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#18181b', borderRadius: '10px', border: '1px solid #1c1c1f' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6366f1', marginBottom: '0.5rem' }}>💡 Nasıl XP Kazanırsın?</div>
                <div style={{ fontSize: '0.78rem', color: '#71717a', lineHeight: 1.6 }}>
                  ✓ Soru sor → <span style={{ color: '#f59e0b' }}>10 XP</span><br />
                  ✓ Cevap yaz → <span style={{ color: '#10b981' }}>50 XP</span><br />
                  ✓ Cevabın beğenilirse → <span style={{ color: '#6366f1' }}>100 XP</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Simulation Modal Overlay */}
      {aktifSimCevap && (() => {
        try {
          const params = JSON.parse(aktifSimCevap.simulasyonParametreleri || '{}');
          return (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(9,9,11,0.92)', backdropFilter: 'blur(10px)',
              zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '2rem'
            }}>
              <div style={{
                background: '#050a1a', border: '1px solid #27272a', borderRadius: '24px',
                width: '100%', maxWidth: '850px', display: 'flex', flexDirection: 'column',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', overflow: 'hidden'
              }}>
                {/* Modal Header */}
                <div style={{
                  padding: '1.25rem 1.75rem', borderBottom: '1px solid #1c1c1f',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: 'rgba(255,255,255,0.02)'
                }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6366f1', marginBottom: '0.15rem' }}>🔬 İNTERAKTİF DENEY LABORATUVARI</div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#f4f4f5' }}>
                      {aktifSimCevap.yazarAdi} Tarafından Hazırlanan Anlatım Deneyi
                    </h3>
                  </div>
                  <button
                    onClick={() => setAktifSimCevap(null)}
                    style={{
                      width: '32px', height: '32px', borderRadius: '50%', border: 'none',
                      background: 'rgba(255,255,255,0.06)', color: '#a1a1aa',
                      fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.2)'; (e.currentTarget as HTMLElement).style.color = '#ef4444'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.color = '#a1a1aa'; }}
                  >
                    ✕
                  </button>
                </div>

                {/* Modal Body */}
                <div style={{ padding: '1.5rem', maxHeight: '75vh', overflowY: 'auto' }}>
                  {params.type === 'serbest-dusme' ? (
                    <SerbrestDusme 
                      initialParams={{
                        height: params.height,
                        planetIdx: params.planetIdx,
                        airResistance: params.airResistance,
                        mass: params.mass
                      }}
                      isLocked={true}
                    />
                  ) : params.type === 'atis-hareketi' ? (
                    <AtisHareketi 
                      initialParams={{
                        mode: params.mode,
                        v0: params.v0,
                        angleDeg: params.angleDeg,
                        height: params.height
                      }}
                      isLocked={true}
                    />
                  ) : (
                    <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>Geçersiz simülasyon tipi.</div>
                  )}

                  {/* Explaining Text */}
                  <div style={{
                    marginTop: '1.5rem', padding: '1.25rem', borderRadius: '14px',
                    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)'
                  }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a78bfa', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      💬 {aktifSimCevap.yazarAdi} Açıklaması:
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                      {aktifSimCevap.icerik}
                    </p>
                  </div>
                </div>

                {/* Modal Footer */}
                <div style={{
                  padding: '1rem 1.5rem', borderTop: '1px solid #1c1c1f',
                  display: 'flex', justifyContent: 'flex-end', background: 'rgba(255,255,255,0.01)'
                }}>
                  <button
                    onClick={() => setAktifSimCevap(null)}
                    style={{
                      padding: '0.5rem 1.25rem', borderRadius: '8px', border: '1px solid #27272a',
                      background: '#18181b', color: '#a1a1aa', fontSize: '0.85rem', fontWeight: 600,
                      cursor: 'pointer', transition: 'all 0.15s'
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#27272a'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#18181b'}
                  >
                    Kapat
                  </button>
                </div>
              </div>
            </div>
          );
        } catch { return null; }
      })()}
    </div>
  );
}
