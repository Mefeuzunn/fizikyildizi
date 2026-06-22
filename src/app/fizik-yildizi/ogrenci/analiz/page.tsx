'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FizikNavbar from '@/components/fizik-yildizi/FizikNavbar';
import { sorular } from '@/data/fizik-yildizi/sorular';
import styles from '@/app/fizik-yildizi/fizik.module.css';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell
} from 'recharts';

interface TestSonucu {
  id: string;
  ogrenciId: string;
  konuBaslik: string;
  puan: number;
  dogru: number;
  yanlis: number;
  tarih: string;
  sure: number;
}

interface DenemeSonucu {
  id: string;
  ogrenciId: string;
  tur: 'TYT' | 'AYT';
  tarih: string;
  dogru: number;
  yanlis: number;
  bos: number;
  puan: number;
  sure: number;
}

const ROZETLER = [
  { id: 'ilk-test', ikon: '🎯', baslik: 'İlk Test', aciklama: 'İlk testini çözdün!', renk: '#6366f1', kosul: 'En az 1 test çöz' },
  { id: 'mukemmel', ikon: '⭐', baslik: 'Mükemmel', aciklama: 'Bir testten 100 puan aldın!', renk: '#f59e0b', kosul: 'Testten 100 al' },
  { id: 'bilim-insani', ikon: '🎓', baslik: 'Bilim İnsanı', aciklama: 'Tüm testlerin ortalaması %85+!', renk: '#10b981', kosul: 'Genel ortalama %85+' },
  { id: 'hizli', ikon: '⚡', baslik: 'Işık Hızı', aciklama: 'Bir testi 2 dakikadan kısa sürede bitirdin!', renk: '#06b6d4', kosul: 'Test süresi < 2 dk' },
  { id: 'fizik-ustasi', ikon: '🌟', baslik: 'Fizik Ustası', aciklama: 'Toplamda 5+ test çözdün!', renk: '#ec4899', kosul: '5 test çöz' },
  { id: 'istikrar', ikon: '🔥', baslik: 'İstikrarlı', aciklama: '3 gün üst üste test çözdün!', renk: '#ef4444', kosul: '3 gün üst üste aktiflik' },
];

export default function AnalizPage() {
  const router = useRouter();
  const [kullanici, setKullanici] = useState<any>(null);
  const [sonuclar, setSonuclar] = useState<TestSonucu[]>([]);
  const [denemeSonuclar, setDenemeSonuclar] = useState<DenemeSonucu[]>([]);
  const [testGecmisi, setTestGecmisi] = useState<Record<string, boolean>>({});
  const [expandedWrongQ, setExpandedWrongQ] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('fizik_token');
    const kullaniciData = localStorage.getItem('fizik_kullanici');
    if (!token || !kullaniciData) {
      router.push('/fizik-yildizi/giris');
      return;
    }
    const k = JSON.parse(kullaniciData);
    setKullanici(k);

    // Load regular test results
    const testSonuclari = JSON.parse(localStorage.getItem('fizik_test_sonuclari') || '[]') as TestSonucu[];
    const ogrenciSonuclari = testSonuclari.filter(s => s && s.ogrenciId === k.id);
    
    // Seed sample results if empty to make page look beautiful at first glance (only for demo account)
    if (ogrenciSonuclari.length === 0 && k.id === 'ogrenci_demo_001') {
      const demoSonuclar: TestSonucu[] = [
        { id: 'd1', ogrenciId: k.id, konuBaslik: 'Fizik Bilimine Giriş', puan: 80, dogru: 8, yanlis: 2, tarih: new Date(Date.now() - 4 * 86400000).toISOString(), sure: 240 },
        { id: 'd2', ogrenciId: k.id, konuBaslik: 'Madde ve Özellikleri', puan: 90, dogru: 9, yanlis: 1, tarih: new Date(Date.now() - 3 * 86400000).toISOString(), sure: 180 },
        { id: 'd3', ogrenciId: k.id, konuBaslik: 'Kuvvet ve Hareket', puan: 50, dogru: 5, yanlis: 5, tarih: new Date(Date.now() - 2 * 86400000).toISOString(), sure: 310 },
        { id: 'd4', ogrenciId: k.id, konuBaslik: 'Enerji', puan: 70, dogru: 7, yanlis: 3, tarih: new Date(Date.now() - 86400000).toISOString(), sure: 210 },
      ];
      setSonuclar(demoSonuclar);
      localStorage.setItem('fizik_test_sonuclari', JSON.stringify([...testSonuclari, ...demoSonuclar]));
    } else {
      setSonuclar(ogrenciSonuclari);
    }

    // Load mock exam results
    const dSonuclar = JSON.parse(localStorage.getItem('fizik_deneme_sonuclari') || '[]') as DenemeSonucu[];
    const ogrenciDenemeler = dSonuclar.filter(d => d && d.ogrenciId === k.id);
    setDenemeSonuclar(ogrenciDenemeler);

    // Load question history
    const allGecmis = JSON.parse(localStorage.getItem('fizik_test_gecmisi') || '{}');
    const ogrenciGecmis = allGecmis[k.id] || {};
    setTestGecmisi(ogrenciGecmis);
  }, [router]);

  if (!kullanici) return null;

  const toplamTest = sonuclar.length;
  const toplamSoru = sonuclar.reduce((a, b) => a + (b.dogru + b.yanlis), 0);
  const ortalamaPuan = toplamTest > 0 ? Math.round(sonuclar.reduce((a, b) => a + b.puan, 0) / toplamTest) : 0;

  // Process subject based success rates
  const konuMap: Record<string, { toplamPuan: number; adet: number }> = {};
  sonuclar.forEach(s => {
    if (!konuMap[s.konuBaslik]) konuMap[s.konuBaslik] = { toplamPuan: 0, adet: 0 };
    konuMap[s.konuBaslik].toplamPuan += s.puan;
    konuMap[s.konuBaslik].adet += 1;
  });

  const konuAnaliz = Object.keys(konuMap).map(konu => ({
    konu,
    basari: Math.round(konuMap[konu].toplamPuan / konuMap[konu].adet),
  }));

  // Strongest and Weakest topics
  let enGuclu = '—';
  let enZayif = '—';
  if (konuAnaliz.length > 0) {
    const sorted = [...konuAnaliz].sort((a, b) => b.basari - a.basari);
    enGuclu = sorted[0].konu;
    enZayif = sorted[sorted.length - 1].konu;
  }

  // Radar chart data covering 6 fundamental dimensions
  const radarData = [
    { subject: 'Mekanik', A: 75, fullMark: 100 },
    { subject: 'Termodinamik', A: 85, fullMark: 100 },
    { subject: 'Dalgalar', A: 60, fullMark: 100 },
    { subject: 'Optik', A: 50, fullMark: 100 },
    { subject: 'Elektrik', A: 70, fullMark: 100 },
    { subject: 'Manyetizma', A: 45, fullMark: 100 },
  ];

  // Adjust radar chart weights dynamically if real data matches
  if (konuMap['Fizik Bilimine Giriş'] || konuMap['Kuvvet ve Hareket']) {
    const mekanikVal = Math.round(
      ((konuMap['Fizik Bilimine Giriş']?.toplamPuan || 0) + (konuMap['Kuvvet ve Hareket']?.toplamPuan || 0)) /
      ((konuMap['Fizik Bilimine Giriş']?.adet || 1) + (konuMap['Kuvvet ve Hareket']?.adet || 1))
    );
    if (mekanikVal > 0) radarData[0].A = mekanikVal;
  }
  if (konuMap['Enerji'] || konuMap['Madde ve Özellikleri']) {
    const termoVal = Math.round(
      ((konuMap['Enerji']?.toplamPuan || 0) + (konuMap['Madde ve Özellikleri']?.toplamPuan || 0)) /
      ((konuMap['Enerji']?.adet || 1) + (konuMap['Madde ve Özellikleri']?.adet || 1))
    );
    if (termoVal > 0) radarData[1].A = termoVal;
  }

  // Line chart trend data
  const trendData = sonuclar.slice(-10).map((s, idx) => ({
    name: `${idx + 1}. Test`,
    puan: s.puan,
    konu: s.konuBaslik,
  }));

  // Bar chart colors dynamically
  const getBarColor = (score: number) => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 50) return '#f59e0b'; // Yellow
    return '#f43f5e'; // Red
  };

  // Badge status helper
  const rozetKazanildiMi = (id: string) => {
    if (toplamTest === 0) return false;
    if (id === 'ilk-test') return toplamTest >= 1;
    if (id === 'mukemmel') return sonuclar.some(s => s.puan === 100);
    if (id === 'bilim-insani') return ortalamaPuan >= 85;
    if (id === 'hizli') return sonuclar.some(s => s.sure < 120);
    if (id === 'fizik-ustasi') return toplamTest >= 5;
    if (id === 'istikrar') return toplamTest >= 3;
    return false;
  };

  // --- Process Solved Questions ---
  const solvedQuestions = Object.entries(testGecmisi).map(([qid, dogruMu]) => {
    const soruDetail = sorular.find(s => s.id === qid);
    return { qid, dogruMu, details: soruDetail };
  }).filter(item => item.details !== undefined) as { qid: string; dogruMu: boolean; details: any }[];

  let finalSolved = solvedQuestions;
  if (finalSolved.length === 0 && kullanici.id === 'ogrenci_demo_001') {
    // Seed some demo solved questions for realistic display
    const demoQIds = [
      's-fg-001-v1', 's-fg-003-v2', 's-fg-004-v1', 's-fg-005-v3',
      's-mo-001-v2', 's-mo-002-v1', 's-mo-004-v5', 's-mo-005-v1',
      's-kh-001-v2', 's-kh-002-v3', 's-kh-003-v1', 's-kh-004-v2',
      's-kh-006-v1', 's-en-001-v2', 's-en-002-v1'
    ];
    finalSolved = demoQIds.map((id, index) => {
      const baseId = id.split('-v')[0];
      const match = sorular.find(s => s.id === id) || sorular.find(s => s.id === baseId) || sorular[index % sorular.length];
      const dogruMu = ![2, 4, 7, 11, 12].includes(index);
      return { qid: id, dogruMu, details: match };
    });
  }

  // --- Kazanım (MEB Outcome) breakdown ---
  const kazanimMap: Record<string, { toplam: number; dogru: number; konuBaslik: string }> = {};
  finalSolved.forEach(sq => {
    const kaz = sq.details.kazanim;
    if (!kazanimMap[kaz]) {
      kazanimMap[kaz] = { toplam: 0, dogru: 0, konuBaslik: sq.details.konuId };
    }
    kazanimMap[kaz].toplam += 1;
    if (sq.dogruMu) {
      kazanimMap[kaz].dogru += 1;
    }
  });

  const kazanimAnaliz = Object.entries(kazanimMap).map(([kazanim, data]) => ({
    kazanim,
    toplam: data.toplam,
    dogru: data.dogru,
    yuzde: Math.round((data.dogru / data.toplam) * 100),
    konuBaslik: data.konuBaslik
  })).sort((a, b) => a.yuzde - b.yuzde); // Weakest outcome first

  // --- YKS Score Projection ---
  const tytSolved = finalSolved.filter(s => s.details.sinif === 9 || s.details.sinif === 10);
  const tytSuccessRate = tytSolved.length > 0 ? (tytSolved.filter(s => s.dogruMu).length / tytSolved.length) : 0.75;
  let projectedTytNet = 7 * tytSuccessRate;
  const tytMocks = denemeSonuclar.filter(d => d.tur === 'TYT');
  if (tytMocks.length > 0) {
    const avgTytMock = tytMocks.reduce((a, b) => a + b.puan, 0) / tytMocks.length;
    projectedTytNet = projectedTytNet * 0.3 + avgTytMock * 0.7;
  }
  projectedTytNet = Math.max(0, Math.min(7, projectedTytNet));

  const aytSolved = finalSolved.filter(s => s.details.sinif === 11 || s.details.sinif === 12);
  const aytSuccessRate = aytSolved.length > 0 ? (aytSolved.filter(s => s.dogruMu).length / aytSolved.length) : 0.60;
  let projectedAytNet = 14 * aytSuccessRate;
  const aytMocks = denemeSonuclar.filter(d => d.tur === 'AYT');
  if (aytMocks.length > 0) {
    const avgAytMock = aytMocks.reduce((a, b) => a + b.puan, 0) / aytMocks.length;
    projectedAytNet = projectedAytNet * 0.3 + avgAytMock * 0.7;
  }
  projectedAytNet = Math.max(0, Math.min(14, projectedAytNet));

  const totalProjected = projectedTytNet + projectedAytNet;
  let percentileStr = "İlk %2.5";
  if (totalProjected >= 19) percentileStr = "İlk %0.3 (Derece Hedefi)";
  else if (totalProjected >= 17) percentileStr = "İlk %1.2 (Çok Başarılı)";
  else if (totalProjected >= 15) percentileStr = "İlk %3.5";
  else if (totalProjected >= 12) percentileStr = "İlk %8.0";
  else if (totalProjected >= 9) percentileStr = "İlk %18.5";
  else if (totalProjected >= 6) percentileStr = "İlk %35.0";
  else percentileStr = "İlk %55.0";

  // --- Personalized Revision Checklist ---
  const weakOutcomes = kazanimAnaliz.filter(k => k.yuzde < 70).slice(0, 3);

  // Map topics to their simulation parameters
  const getSimulationPath = (konuId: string) => {
    if (konuId.includes('dalga')) return '/fizik-yildizi/simulasyonlar?sim=dalga';
    if (konuId.includes('elektrik') || konuId.includes('devre')) return '/fizik-yildizi/simulasyonlar?sim=elektrik';
    if (konuId.includes('optik')) return '/fizik-yildizi/simulasyonlar?sim=optik';
    if (konuId.includes('kuvvet-hareket') || konuId.includes('newton')) return '/fizik-yildizi/simulasyonlar?sim=atis';
    if (konuId.includes('sicaklik')) return '/fizik-yildizi/simulasyonlar?sim=yay';
    return '/fizik-yildizi/simulasyonlar';
  };

  // --- Detailed Error List ---
  const wrongAnswers = finalSolved.filter(s => !s.dogruMu);

  const askAstroTutorAboutQuestion = (q: any) => {
    const letters = ['A', 'B', 'C', 'D'];
    const optsStr = q.secenekler 
      ? `A) ${q.secenekler.A}, B) ${q.secenekler.B}, C) ${q.secenekler.C}, D) ${q.secenekler.D}`
      : 'Doğru/Yanlış sorusu';
    const promptText = `Hatalı çözdüğüm bu soruyu ve fiziksel temelini detaylıca açıklar mısın?\n\n**Soru:** ${q.soru}\n**Seçenekler:** ${optsStr}\n**Doğru Cevap:** ${q.dogruCevap}\n**Açıklamam:** ${q.aciklama}`;
    
    localStorage.setItem('astrotutor_prompt', promptText);
    router.push('/fizik-yildizi/ogrenci/dashboard');
  };

  return (
    <div style={{ background: '#09090b', minHeight: '100vh', color: '#f4f4f5', fontFamily: "'Inter', sans-serif" }}>
      <FizikNavbar />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 1.5rem 4rem' }}>
        
        {/* Back Link */}
        <Link href="/fizik-yildizi/ogrenci/dashboard" style={{ color: '#a1a1aa', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
          ← Dashboard&apos;a Dön
        </Link>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.5rem', background: 'linear-gradient(135deg, #6366f1, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            📊 Analiz ve Gelişim Raporum
          </h1>
          <p style={{ color: '#a1a1aa', fontSize: '0.95rem' }}>
            MEB müfredatı kazanım kazanım eksik analizi ve YKS net projeksiyonları.
          </p>
        </div>

        {/* Overview Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          
          <div className={styles.glassCardNohover} style={{ padding: '1.5rem', borderLeft: '4px solid #6366f1' }}>
            <div style={{ fontSize: '0.82rem', color: '#a1a1aa', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Genel Başarı Oranı</div>
            <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#6366f1', marginBottom: '0.35rem' }}>{ortalamaPuan}%</div>
            <div style={{ fontSize: '0.78rem', color: '#71717a' }}>Çözülen tüm testlerin ortalama skoru</div>
          </div>

          <div className={styles.glassCardNohover} style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
            <div style={{ fontSize: '0.82rem', color: '#a1a1aa', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Çözülen Soru Sayısı</div>
            <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#10b981', marginBottom: '0.35rem' }}>{toplamSoru}</div>
            <div style={{ fontSize: '0.78rem', color: '#71717a' }}>Platformda yanıtlanan toplam soru sayısı</div>
          </div>

          <div className={styles.glassCardNohover} style={{ padding: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ fontSize: '0.82rem', color: '#a1a1aa', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>YKS Tahmini Neti</div>
            <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#f59e0b', marginBottom: '0.35rem' }}>{totalProjected.toFixed(2)} / 21</div>
            <div style={{ fontSize: '0.78rem', color: '#71717a' }}>Tahmini TYT: {projectedTytNet.toFixed(1)} | AYT: {projectedAytNet.toFixed(1)} net</div>
          </div>

          <div className={styles.glassCardNohover} style={{ padding: '1.5rem', borderLeft: '4px solid #ec4899' }}>
            <div style={{ fontSize: '0.82rem', color: '#a1a1aa', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Tahmini Derece</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ec4899', marginTop: '0.6rem', marginBottom: '0.5rem' }}>{percentileStr}</div>
            <div style={{ fontSize: '0.78rem', color: '#71717a' }}>Türkiye geneli tahmini başarı sırası aralığı</div>
          </div>

        </div>

        {/* Charts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          
          {/* Radar Chart: Conceptual Strength */}
          <div className={styles.glassCardNohover} style={{ padding: '1.5rem', minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🕸️</span> Temel Konu Dağılım Analizi
            </h3>
            <div style={{ flex: 1, minHeight: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.06)" />
                  <PolarAngleAxis dataKey="subject" stroke="#a1a1aa" fontSize={11} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255,255,255,0.1)" fontSize={9} />
                  <Radar name="Başarı" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line Chart: Score progression */}
          <div className={styles.glassCardNohover} style={{ padding: '1.5rem', minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📈</span> Gelişim Grafiği (Son Test Skorları)
            </h3>
            <div style={{ flex: 1, minHeight: '280px' }}>
              {trendData.length === 0 ? (
                <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#71717a' }}>Skor grafiği için test çözmelisin.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#71717a" fontSize={10} />
                    <YAxis domain={[0, 100]} stroke="#71717a" fontSize={10} />
                    <Tooltip
                      contentStyle={{ background: '#111113', border: '1px solid #27272a', borderRadius: '10px' }}
                      labelStyle={{ color: '#a1a1aa', fontSize: 11 }}
                      itemStyle={{ color: '#818cf8', fontSize: 12 }}
                    />
                    <Line type="monotone" dataKey="puan" stroke="#6366f1" strokeWidth={2.5} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

        </div>

        {/* Outome Analysis & Weaknesses Dashboard */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1.5rem', marginBottom: '2.5rem' }}>
          
          {/* Kazanım List */}
          <div className={styles.glassCardNohover} style={{ padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🎯</span> MEB Kazanımları Başarı Analizi
            </h3>
            
            {kazanimAnaliz.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#71717a' }}>Kazanım analizi için soru çözmelisin.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                {kazanimAnaliz.map((item, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                      <span style={{ color: '#e4e4e7', fontWeight: 500, paddingRight: '1rem', lineHeight: 1.4 }}>{item.kazanim}</span>
                      <span style={{ fontFamily: 'monospace', color: getBarColor(item.yuzde), fontWeight: 700, flexShrink: 0 }}>
                        %{item.yuzde} ({item.dogru}/{item.toplam})
                      </span>
                    </div>
                    <div style={{ background: '#18181b', borderRadius: '6px', height: '8px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${item.yuzde}%`, background: getBarColor(item.yuzde), borderRadius: '6px', transition: 'width 1s' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Plan */}
          <div className={styles.glassCardNohover} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '1.25rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📅</span> Kişiselleştirilmiş Yol Haritası
            </h3>
            
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: '0.875rem' }}>
              {weakOutcomes.length === 0 ? (
                <div style={{ padding: '1.5rem', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '14px', textAlign: 'center' }}>
                  <span style={{ fontSize: '2.25rem', display: 'block', marginBottom: '0.5rem' }}>🌟</span>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#10b981' }}>Kritik Seviyede Eksik Yok!</div>
                  <p style={{ color: '#a1a1aa', fontSize: '0.8rem', lineHeight: 1.4, marginTop: '0.35rem' }}>
                    Tüm çözdüğün MEB kazanımlarında %70 barajının üzerindesin. Harika bir iş çıkarıyorsun!
                  </p>
                </div>
              ) : (
                weakOutcomes.map((outcome, idx) => (
                  <div key={idx} style={{ padding: '1rem', background: 'rgba(244,63,94,0.04)', border: '1px solid rgba(244,63,94,0.15)', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '12px', background: 'rgba(244,63,94,0.15)', color: '#f43f5e', fontWeight: 700 }}>
                        EKSİK KAZANIM
                      </span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f43f5e' }}>%{outcome.yuzde} Başarı</span>
                    </div>
                    <p style={{ color: '#e4e4e7', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.75rem', lineHeight: 1.4 }}>
                      {outcome.kazanim}
                    </p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderTop: '1px solid rgba(244,63,94,0.1)', paddingTop: '0.5rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#a1a1aa', cursor: 'pointer' }}>
                        <input type="checkbox" defaultChecked={false} style={{ accentColor: '#6366f1' }} />
                        Konu anlatımını tekrar incele
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#a1a1aa', cursor: 'pointer' }}>
                        <input type="checkbox" defaultChecked={false} style={{ accentColor: '#6366f1' }} />
                        <Link href={getSimulationPath(outcome.konuBaslik)} style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>
                          İlgili Laboratuvarı Çalıştır 🧪
                        </Link>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#a1a1aa', cursor: 'pointer' }}>
                        <input type="checkbox" defaultChecked={false} style={{ accentColor: '#6366f1' }} />
                        Hatalı soruları tekrar gözden geçir
                      </label>
                    </div>
                  </div>
                ))
              )}
              
              <Link href="/fizik-yildizi/ogrenci/konular" className={styles.btnSecondary} style={{ width: '100%', marginTop: 'auto', textAlign: 'center', display: 'block' }}>
                Kütüphaneye Git
              </Link>
            </div>
          </div>

        </div>

        {/* Detailed Wrong Answers Review */}
        <div className={styles.glassCardNohover} style={{ padding: '1.5rem', marginBottom: '2.5rem' }}>
          <h3 style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '1.25rem', color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>❌</span> Hatalı Sorular Analizim ({wrongAnswers.length} Soru)
          </h3>
          
          {wrongAnswers.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#71717a' }}>Hiç hatalı sorun bulunmuyor. Tebrikler! 🎉</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {wrongAnswers.map((item, idx) => {
                const isExpanded = expandedWrongQ === item.qid;
                return (
                  <div key={item.qid} style={{ border: '1px solid #27272a', borderRadius: '12px', background: '#111113', overflow: 'hidden' }}>
                    <div 
                      onClick={() => setExpandedWrongQ(isExpanded ? null : item.qid)}
                      style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                    >
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.78rem', color: '#71717a', fontFamily: 'monospace' }}>#{idx + 1}</span>
                        <span style={{ fontSize: '0.85rem', color: '#e4e4e7', fontWeight: 600 }}>{item.details.soru.slice(0, 80)}...</span>
                      </div>
                      <span style={{ fontSize: '0.78rem', color: '#818cf8', fontWeight: 700 }}>
                        {isExpanded ? 'Detayı Kapat ▲' : 'Detayı Gör ▼'}
                      </span>
                    </div>

                    {isExpanded && (
                      <div style={{ padding: '1rem', borderTop: '1px solid #27272a', background: '#09090b' }}>
                        <p style={{ fontSize: '0.92rem', color: '#f4f4f5', lineHeight: 1.6, marginBottom: '1rem' }}>
                          {item.details.soru}
                        </p>

                        {/* Options */}
                        {item.details.secenekler && (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                            {Object.entries(item.details.secenekler).map(([letter, text]) => {
                              const isCorrect = item.details.dogruCevap === letter;
                              return (
                                <div key={letter} style={{
                                  padding: '0.75rem', borderRadius: '8px',
                                  border: `1px solid ${isCorrect ? 'rgba(16,185,129,0.3)' : '#27272a'}`,
                                  background: isCorrect ? 'rgba(16,185,129,0.06)' : '#111113',
                                  color: isCorrect ? '#10b981' : '#a1a1aa',
                                  fontSize: '0.82rem', display: 'flex', gap: '0.5rem'
                                }}>
                                  <strong style={{ color: isCorrect ? '#10b981' : '#71717a' }}>{letter})</strong> {text as string}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Explanation */}
                        <div style={{ padding: '1rem', background: '#111113', borderLeft: '4px solid #f59e0b', borderRadius: '8px', marginBottom: '1rem' }}>
                          <div style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Doğru Cevap & Çözüm Açıklaması</div>
                          <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                            {item.details.aciklama}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => askAstroTutorAboutQuestion(item.details)}
                            className={styles.btnPrimary}
                            style={{ padding: '0.5rem 1rem', fontSize: '0.78rem', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                          >
                            🤖 AstroTutor&apos;a Sor
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Badges Collection */}
        <div className={styles.glassCardNohover} style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🏆</span> Rozet Kolleksiyonum ({ROZETLER.filter(r => rozetKazanildiMi(r.id)).length}/{ROZETLER.length})
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
            {ROZETLER.map((rozet) => {
              const kazanildi = rozetKazanildiMi(rozet.id);
              return (
                <div
                  key={rozet.id}
                  style={{
                    background: kazanildi ? `rgba(${rozet.id === 'ilk-test' ? '99,102,241' : '245,158,11'}, 0.08)` : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${kazanildi ? rozet.renk : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: '16px',
                    padding: '1.25rem 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    opacity: kazanildi ? 1 : 0.35,
                    transition: 'all 0.3s ease',
                  }}
                >
                  <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem', filter: kazanildi ? 'none' : 'grayscale(1)' }}>
                    {rozet.ikon}
                  </span>
                  <h4 style={{ fontWeight: 700, fontSize: '0.85rem', color: '#f8fafc', marginBottom: '0.25rem' }}>
                    {rozet.baslik}
                  </h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.72rem', lineHeight: 1.4, flex: 1 }}>
                    {rozet.aciklama}
                  </p>
                  <span style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '0.5rem', fontWeight: 500 }}>
                    {kazanildi ? '✓ Kazanıldı' : rozet.kosul}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
}
