'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, FlaskConical } from 'lucide-react';
import { StepByStep, AIParagraf, VideoPlayer } from '@/components/fizik-yildizi/dersler/DersReader';
import { Flashcard } from '@/components/fizik-yildizi/dersler/Flashcard';
import AstroTutor from '@/components/fizik-yildizi/AstroTutor';

export default function NewtonYasalariDers() {
  const [askAstroTutor, setAskAstroTutor] = React.useState<string | null>(null);

  return (
    <div style={{ minHeight: '100vh', background: '#09090b', color: '#f4f4f5', fontFamily: '"Inter", sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        
        {/* Header */}
        <Link href="/fizik-yildizi/ogrenci/odak" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#a1a1aa', textDecoration: 'none', marginBottom: '2rem' }}>
          <ChevronLeft size={16} /> Derslere Dön
        </Link>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', background: 'linear-gradient(90deg, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Newton'un Hareket Yasaları
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#a1a1aa', lineHeight: 1.6, marginBottom: '3rem' }}>
          Kuvvet ve hareketin temelini oluşturan, klasik mekaniğin yapıtaşı olan üç altın yasayı inceliyoruz.
        </p>

        {/* Video Integration */}
        <VideoPlayer title="MEB Fizik: Newton'un Hareket Yasaları Konu Anlatımı" youtubeId="NYVMlmL0BPQ" />

        {/* Interactive Text */}
        <h2 style={{ fontSize: '1.75rem', marginTop: '3rem', marginBottom: '1rem', borderBottom: '1px solid #27272a', paddingBottom: '0.5rem' }}>1. Eylemsizlik Yasası (1. Yasa)</h2>
        <AIParagraf 
          contextData="Öğrenci 1. Yasadaki net kuvvetin sıfır olma durumunu (eylemsizlik) okuyor. Sabit hızla gitme durumunu anlamamış olabilir, ona yardım et."
          onAskTutor={setAskAstroTutor}
        >
          Bir cisme etki eden net kuvvet sıfır ise, cisim duruyorsa durmaya devam eder; eğer hareket halindeyse <strong>sabit hızla</strong> düz bir çizgide hareketini sürdürür. Buna eylemsizlik denir. Yani cisim, mevcut hareket durumunu korumak ister.
        </AIParagraf>

        <h2 style={{ fontSize: '1.75rem', marginTop: '3rem', marginBottom: '1rem', borderBottom: '1px solid #27272a', paddingBottom: '0.5rem' }}>2. Dinamiğin Temel Prensibi (2. Yasa)</h2>
        <p style={{ lineHeight: 1.7, marginBottom: '1.5rem' }}>
          Bir cisme net bir kuvvet etki ettiğinde cisim ivmelenir. İvme, net kuvvetle doğru, kütleyle ters orantılıdır. Ünlü formülümüz: 
          <span style={{ display: 'block', textAlign: 'center', fontSize: '1.5rem', margin: '1rem 0', color: '#6366f1', fontFamily: 'monospace' }}>F<sub>net</sub> = m · a</span>
        </p>

        {/* Mini Simulation Button */}
        <Link href="/fizik-yildizi/simulasyonlar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'rgba(99,102,241,0.1)', border: '1px solid #4f46e5', padding: '1rem', borderRadius: '8px', color: '#818cf8', textDecoration: 'none', fontWeight: 600, margin: '2rem 0' }}>
          <FlaskConical size={20} /> Bu konuyu Çarpışma Laboratuvarı'nda Dene!
        </Link>

        {/* Step-by-Step Solver */}
        <h2 style={{ fontSize: '1.5rem', marginTop: '3rem', marginBottom: '1rem' }}>Çözümlü Örnek</h2>
        <StepByStep steps={[
          <div key="1"><strong>Soru:</strong> Kütlesi 5 kg olan bir bloğa sürtünmesiz yatay düzlemde 20 N'luk sabit bir kuvvet uygulanmaktadır. Bloğun ivmesi nedir?</div>,
          <div key="2"><strong>1. Adım:</strong> Verilenleri yazıyoruz. <br/> m = 5 kg <br/> F<sub>net</sub> = 20 N</div>,
          <div key="3"><strong>2. Adım:</strong> Formülü hatırlayalım. <br/> F<sub>net</sub> = m · a</div>,
          <div key="4"><strong>Sonuç:</strong> 20 = 5 · a <br/> <strong>a = 4 m/s²</strong></div>
        ]} />

        {/* Flashcards Section */}
        <h2 style={{ fontSize: '1.75rem', marginTop: '4rem', marginBottom: '1rem', borderBottom: '1px solid #27272a', paddingBottom: '0.5rem', textAlign: 'center' }}>Hızlı Tekrar (Flashcards)</h2>
        <p style={{ textAlign: 'center', color: '#a1a1aa', marginBottom: '2rem' }}>
          Öğrendiklerini pekiştir. Kartı çevir ve senin için ne kadar zor olduğunu seç!
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', marginBottom: '4rem' }}>
          <Flashcard 
            front={<span>Newton'un <strong>2. Yasasının</strong> temel formülü nedir?</span>}
            back={<span style={{ fontFamily: 'monospace', fontSize: '1.5rem' }}>F_net = m · a</span>}
            onDifficultySelect={(diff) => console.log('Flashcard 1:', diff)}
          />
          <Flashcard 
            front={<span>Net kuvvet sıfırken hareket halindeki bir cisim nasıl davranır?</span>}
            back={<span>Sabit hızla aynı yönde ilerlemeye devam eder (Eylemsizlik).</span>}
            onDifficultySelect={(diff) => console.log('Flashcard 2:', diff)}
          />
        </div>

      </div>

      {/* AstroTutor Integration for AIParagraf */}
      {askAstroTutor && (
        <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 100, width: '350px' }}>
          <div style={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px', padding: '1rem', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontWeight: 600, color: '#e4e4e7' }}>AstroTutor</span>
              <button onClick={() => setAskAstroTutor(null)} style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer' }}>Kapat</button>
            </div>
            {/* The AstroTutor component itself acts as the chat interface */}
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <AstroTutor kullanici={{ ad: 'Öğrenci', soyad: '', id: '1' }} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
