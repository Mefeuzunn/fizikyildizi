'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import FizikNavbar from '@/components/fizik-yildizi/FizikNavbar';
import { sorular } from '@/data/fizik-yildizi/sorular';

// ─── Types ───────────────────────────────────────────────────────────────────
type ExamType = 'TYT' | 'AYT';
type ExamPhase = 'setup' | 'active' | 'finished';

interface Question {
  id: string;
  text: string;
  options: string[];
  correct: number; // 0-indexed
  konu: string;
  alt_konu: string;
  zorluk: 'kolay' | 'orta' | 'zor';
}

interface AnswerMap {
  [qid: string]: number; // -1 = boş
}

// ─── Timer hook ───────────────────────────────────────────────────────────────
function useTimer(initialSeconds: number, running: boolean) {
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(interval);
  }, [running]);
  const reset = () => setSeconds(initialSeconds);
  return { seconds, reset };
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function DenemeNaviPage() {
  const router = useRouter();
  const [kullanici, setKullanici] = useState<any>(null);
  const [phase, setPhase] = useState<ExamPhase>('setup');
  const [examType, setExamType] = useState<ExamType>('TYT');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [results, setResults] = useState<{ dogru: number; yanlis: number; bos: number; puan: number; konuAnaliz: Record<string, { dogru: number; yanlis: number }> } | null>(null);
  const [showGrid, setShowGrid] = useState(false);

  const DURATIONS = { TYT: 135 * 60, AYT: 180 * 60 }; // seconds
  const { seconds, reset: resetTimer } = useTimer(DURATIONS[examType], phase === 'active');

  useEffect(() => {
    const kData = localStorage.getItem('fizik_kullanici');
    if (!kData) { router.push('/fizik-yildizi/giris'); return; }
    setKullanici(JSON.parse(kData));
  }, [router]);

  useEffect(() => {
    if (seconds === 0 && phase === 'active') finishExam();
  }, [seconds, phase]);

  const startExam = () => {
    // Filter base questions by class/curriculum
    // TYT covers 9th and 10th grade
    // AYT covers 11th and 12th grade
    const filteredBase = sorular.filter(s => {
      if (examType === 'TYT') {
        return s.sinif === 9 || s.sinif === 10;
      } else {
        return s.sinif === 11 || s.sinif === 12;
      }
    });

    // Shuffle and pick 10 questions
    const shuffledBase = [...filteredBase].sort(() => Math.random() - 0.5);
    const selectedBase = shuffledBase.slice(0, 10);

    // Map Soru to Question interface
    const qs: Question[] = selectedBase.map(s => {
      const options = s.tip === 'dogru-yanlis'
        ? ['Doğru', 'Yanlış']
        : (s.secenekler ? [s.secenekler.A, s.secenekler.B, s.secenekler.C, s.secenekler.D] : ['A', 'B', 'C', 'D']);
      
      let correct = 0;
      if (s.tip === 'dogru-yanlis') {
        correct = s.dogruCevap === 'Doğru' ? 0 : 1;
      } else {
        correct = ['A', 'B', 'C', 'D'].indexOf(s.dogruCevap);
        if (correct === -1) correct = 0;
      }

      const getKonuName = (konuId: string) => {
        if (konuId.includes('fizik-bilimi')) return 'Fizik Bilimi';
        if (konuId.includes('madde-ozellikleri')) return 'Madde ve Özellikleri';
        if (konuId.includes('kuvvet-hareket') || konuId.includes('newton') || konuId.includes('kuvvet')) return 'Kuvvet ve Hareket';
        if (konuId.includes('enerji')) return 'Enerji';
        if (konuId.includes('dalga')) return 'Dalgalar';
        if (konuId.includes('elektrik') || konuId.includes('devre')) return 'Elektrik';
        if (konuId.includes('optik')) return 'Optik';
        if (konuId.includes('basinc')) return 'Basınç';
        if (konuId.includes('sicaklik')) return 'Isı ve Sıcaklık';
        if (konuId.includes('manyetizma')) return 'Manyetizma';
        if (konuId.includes('modern-fizik') || konuId.includes('modern')) return 'Modern Fizik';
        return 'Genel Fizik';
      };

      return {
        id: s.id,
        text: s.soru,
        options,
        correct,
        konu: getKonuName(s.konuId),
        alt_konu: s.altKonuId.toUpperCase().replace(/-/g, ' '),
        zorluk: s.zorluk <= 2 ? 'kolay' : (s.zorluk <= 4 ? 'orta' : 'zor')
      };
    });

    setQuestions(qs);
    const initialAnswers: AnswerMap = {};
    qs.forEach(q => { initialAnswers[q.id] = -1; });
    setAnswers(initialAnswers);
    setCurrentIdx(0);
    setFlagged(new Set());
    setPhase('active');
    resetTimer();
  };

  const finishExam = useCallback(() => {
    if (questions.length === 0) return;
    let dogru = 0, yanlis = 0, bos = 0;
    const konuAnaliz: Record<string, { dogru: number; yanlis: number }> = {};

    questions.forEach(q => {
      const ans = answers[q.id];
      if (!konuAnaliz[q.konu]) konuAnaliz[q.konu] = { dogru: 0, yanlis: 0 };
      if (ans === -1) { bos++; }
      else if (ans === q.correct) {
        dogru++;
        konuAnaliz[q.konu].dogru++;
      } else {
        yanlis++;
        konuAnaliz[q.konu].yanlis++;
      }
    });

    const puan = dogru * 1 - yanlis * 0.25;
    setResults({ dogru, yanlis, bos, puan, konuAnaliz });
    setPhase('finished');

    // Save to localStorage
    const sonuc = {
      id: `deneme_${Date.now()}`,
      ogrenciId: kullanici?.id,
      tur: examType,
      tarih: new Date().toISOString(),
      dogru, yanlis, bos, puan,
      sure: DURATIONS[examType] - seconds,
    };
    const existing = JSON.parse(localStorage.getItem('fizik_deneme_sonuclari') || '[]');
    existing.unshift(sonuc);
    localStorage.setItem('fizik_deneme_sonuclari', JSON.stringify(existing.slice(0, 50)));
  }, [questions, answers, kullanici, examType, seconds]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return h > 0
      ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
      : `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const answeredCount = Object.values(answers).filter(v => v !== -1).length;
  const currentQ = questions[currentIdx];
  const timeWarning = seconds < 300;

  if (!kullanici) return null;

  // ─── SETUP PHASE ─────────────────────────────────────────────────────────────
  if (phase === 'setup') {
    const prevResults = JSON.parse(localStorage.getItem('fizik_deneme_sonuclari') || '[]').slice(0, 5);

    return (
      <div style={{ background: '#09090b', minHeight: '100vh', color: '#f4f4f5' }}>
        <FizikNavbar />
        <main style={{ maxWidth: '900px', margin: '0 auto', padding: '6rem 1.5rem 4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>📝 Deneme Sınavı</h1>
            <p style={{ color: '#71717a', fontSize: '0.95rem' }}>
              YKS fizik konularını gerçek sınav formatında çöz, performansını analiz et.
            </p>
          </div>

          {/* Exam type selector */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            {(['TYT', 'AYT'] as ExamType[]).map(type => (
              <div
                key={type}
                onClick={() => setExamType(type)}
                style={{
                  background: examType === type ? 'rgba(99,102,241,0.07)' : '#111113',
                  border: `2px solid ${examType === type ? '#6366f1' : '#27272a'}`,
                  borderRadius: '20px', padding: '2rem', cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{type === 'TYT' ? '🎯' : '🚀'}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: examType === type ? '#818cf8' : '#f4f4f5', marginBottom: '0.25rem' }}>
                  {type === 'TYT' ? 'TYT Fizik' : 'AYT Fizik'}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#71717a', lineHeight: 1.5 }}>
                  {type === 'TYT'
                    ? '10 Soru · 135 dakika · Temel konular'
                    : '10 Soru · 180 dakika · İleri düzey konular'}
                </div>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {(type === 'TYT'
                    ? ['Mekanik', 'Elektrik', 'Dalgalar', 'Enerji']
                    : ['Modern Fizik', 'Termodinamik', 'Elektromanyetizma']
                  ).map(tag => (
                    <span key={tag} style={{
                      fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '20px',
                      background: 'rgba(99,102,241,0.1)', color: '#818cf8', fontWeight: 600,
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Exam info */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.875rem', marginBottom: '2rem' }}>
            {[
              { icon: '❓', val: '10', label: 'Soru Sayısı' },
              { icon: '⏱️', val: examType === 'TYT' ? '135 dk' : '180 dk', label: 'Süre' },
              { icon: '✅', val: '+1', label: 'Doğru' },
              { icon: '❌', val: '-0.25', label: 'Yanlış' },
            ].map(item => (
              <div key={item.label} style={{ background: '#111113', border: '1px solid #27272a', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{item.icon}</div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', fontFamily: 'monospace', color: '#f4f4f5' }}>{item.val}</div>
                <div style={{ fontSize: '0.72rem', color: '#71717a' }}>{item.label}</div>
              </div>
            ))}
          </div>

          <button
            onClick={startExam}
            style={{
              width: '100%', padding: '1rem', borderRadius: '14px', border: 'none',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: 'white', fontWeight: 700, fontSize: '1.05rem',
              cursor: 'pointer', boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
              marginBottom: '2.5rem',
            }}
          >
            🚀 Denemeyi Başlat
          </button>

          {/* Previous results */}
          {prevResults.length > 0 && (
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#a1a1aa', marginBottom: '1rem' }}>Son Denemeler</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {prevResults.map((r: any) => (
                  <div key={r.id} style={{ background: '#111113', border: '1px solid #27272a', borderRadius: '10px', padding: '0.875rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontWeight: 700, color: '#f4f4f5', marginRight: '0.75rem' }}>{r.tur}</span>
                      <span style={{ fontSize: '0.78rem', color: '#52525b' }}>{new Date(r.tarih).toLocaleDateString('tr-TR')}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem' }}>
                      <span style={{ color: '#10b981' }}>✅ {r.dogru}</span>
                      <span style={{ color: '#f43f5e' }}>❌ {r.yanlis}</span>
                      <span style={{ color: '#f59e0b', fontWeight: 700, fontFamily: 'monospace' }}>{r.puan.toFixed(2)} puan</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // ─── ACTIVE EXAM ─────────────────────────────────────────────────────────────
  if (phase === 'active' && currentQ) {
    return (
      <div style={{ background: '#09090b', minHeight: '100vh', color: '#f4f4f5', fontFamily: "'Inter', sans-serif" }}>
        {/* Header bar */}
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          background: 'rgba(9,9,11,0.95)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #27272a', padding: '0.875rem 1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#6366f1' }}>
            {examType} Fizik Denemesi
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {/* Progress */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#71717a' }}>
              <span>{answeredCount}/{questions.length}</span>
              <div style={{ width: '80px', height: '4px', background: '#27272a', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: '#6366f1', width: `${(answeredCount / questions.length) * 100}%`, transition: 'width 0.3s' }} />
              </div>
            </div>

            {/* Timer */}
            <div style={{
              fontFamily: 'monospace', fontWeight: 800, fontSize: '1.1rem',
              color: timeWarning ? '#f43f5e' : '#f4f4f5',
              animation: timeWarning && seconds % 2 === 0 ? 'none' : 'none',
              padding: '0.375rem 0.75rem', background: timeWarning ? 'rgba(244,63,94,0.1)' : '#18181b',
              borderRadius: '8px', border: `1px solid ${timeWarning ? 'rgba(244,63,94,0.3)' : '#27272a'}`,
            }}>
              ⏱ {formatTime(seconds)}
            </div>

            {/* Grid toggle */}
            <button
              onClick={() => setShowGrid(g => !g)}
              style={{ padding: '0.375rem 0.75rem', borderRadius: '8px', border: '1px solid #27272a', background: '#18181b', color: '#a1a1aa', fontSize: '0.78rem', cursor: 'pointer' }}
            >
              📊 Soru Tablosu
            </button>

            <button
              onClick={finishExam}
              style={{ padding: '0.375rem 0.875rem', borderRadius: '8px', background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)', color: '#f43f5e', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 700 }}
            >
              Bitir
            </button>
          </div>
        </div>

        <main style={{ display: 'grid', gridTemplateColumns: showGrid ? '1fr 260px' : '1fr', gap: 0, paddingTop: '70px', maxWidth: '1100px', margin: '0 auto', minHeight: '100vh' }}>
          {/* Question panel */}
          <div style={{ padding: '2rem 1.5rem' }}>
            {/* Question header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ padding: '0.25rem 0.75rem', borderRadius: '6px', background: 'rgba(99,102,241,0.1)', color: '#818cf8', fontSize: '0.78rem', fontWeight: 700 }}>
                  {currentQ.konu}
                </span>
                <span style={{ padding: '0.25rem 0.75rem', borderRadius: '6px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', fontSize: '0.72rem', fontWeight: 600 }}>
                  {currentQ.zorluk}
                </span>
                {flagged.has(currentQ.id) && (
                  <span style={{ padding: '0.25rem 0.75rem', borderRadius: '6px', background: 'rgba(244,63,94,0.1)', color: '#f43f5e', fontSize: '0.72rem', fontWeight: 600 }}>
                    🚩 İşaretli
                  </span>
                )}
              </div>
              <span style={{ fontSize: '0.82rem', color: '#52525b', fontFamily: 'monospace' }}>
                {currentIdx + 1} / {questions.length}
              </span>
            </div>

            {/* Question text */}
            <div style={{ background: '#111113', border: '1px solid #27272a', borderRadius: '16px', padding: '1.75rem', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: '#f4f4f5' }}>
                <strong style={{ color: '#a1a1aa', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>Soru {currentIdx + 1}</strong>
                {currentQ.text}
              </p>
            </div>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '2rem' }}>
              {currentQ.options.map((opt, idx) => {
                const isSelected = answers[currentQ.id] === idx;
                const letters = ['A', 'B', 'C', 'D', 'E'];
                return (
                  <div
                    key={idx}
                    onClick={() => setAnswers(prev => ({ ...prev, [currentQ.id]: idx }))}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      padding: '1rem 1.25rem', borderRadius: '12px',
                      background: isSelected ? 'rgba(99,102,241,0.1)' : '#111113',
                      border: `2px solid ${isSelected ? '#6366f1' : '#27272a'}`,
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = '#3f3f46'; }}
                    onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = '#27272a'; }}
                  >
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: '0.85rem',
                      background: isSelected ? '#6366f1' : '#18181b',
                      border: `2px solid ${isSelected ? '#6366f1' : '#3f3f46'}`,
                      color: isSelected ? 'white' : '#71717a',
                    }}>
                      {letters[idx]}
                    </div>
                    <span style={{ color: '#f4f4f5', fontSize: '0.95rem' }}>{opt}</span>
                  </div>
                );
              })}
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
                disabled={currentIdx === 0}
                style={{
                  padding: '0.625rem 1.25rem', borderRadius: '10px',
                  border: '1px solid #27272a', background: '#18181b',
                  color: currentIdx === 0 ? '#52525b' : '#a1a1aa',
                  cursor: currentIdx === 0 ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '0.875rem',
                }}
              >
                ← Önceki
              </button>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setFlagged(prev => { const n = new Set(prev); if (n.has(currentQ.id)) n.delete(currentQ.id); else n.add(currentQ.id); return n; })}
                  style={{
                    padding: '0.625rem 1rem', borderRadius: '10px',
                    border: `1px solid ${flagged.has(currentQ.id) ? 'rgba(244,63,94,0.4)' : '#27272a'}`,
                    background: flagged.has(currentQ.id) ? 'rgba(244,63,94,0.08)' : '#18181b',
                    color: flagged.has(currentQ.id) ? '#f43f5e' : '#71717a',
                    cursor: 'pointer', fontSize: '0.875rem',
                  }}
                >
                  🚩 {flagged.has(currentQ.id) ? 'Kaldır' : 'İşaretle'}
                </button>

                {answers[currentQ.id] !== -1 && (
                  <button
                    onClick={() => setAnswers(prev => ({ ...prev, [currentQ.id]: -1 }))}
                    style={{ padding: '0.625rem 0.875rem', borderRadius: '10px', border: '1px solid #27272a', background: '#18181b', color: '#71717a', cursor: 'pointer', fontSize: '0.875rem' }}
                  >
                    ⊘ Boş Bırak
                  </button>
                )}
              </div>

              <button
                onClick={() => setCurrentIdx(i => Math.min(questions.length - 1, i + 1))}
                disabled={currentIdx === questions.length - 1}
                style={{
                  padding: '0.625rem 1.25rem', borderRadius: '10px',
                  border: 'none', background: currentIdx === questions.length - 1 ? '#27272a' : 'linear-gradient(135deg,#6366f1,#4f46e5)',
                  color: 'white', cursor: currentIdx === questions.length - 1 ? 'not-allowed' : 'pointer',
                  fontWeight: 700, fontSize: '0.875rem',
                }}
              >
                Sonraki →
              </button>
            </div>
          </div>

          {/* Question grid panel */}
          {showGrid && (
            <div style={{ borderLeft: '1px solid #1c1c1f', padding: '1.5rem', background: '#0d0d10' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem', color: '#a1a1aa' }}>Soru Tablosu</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '0.375rem' }}>
                {questions.map((q, idx) => {
                  const isAnswered = answers[q.id] !== -1;
                  const isFlagged = flagged.has(q.id);
                  const isCurrent = idx === currentIdx;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIdx(idx)}
                      style={{
                        width: '36px', height: '36px', borderRadius: '8px',
                        background: isCurrent ? '#6366f1' : isFlagged ? 'rgba(244,63,94,0.15)' : isAnswered ? 'rgba(16,185,129,0.15)' : '#18181b',
                        color: isCurrent ? 'white' : isFlagged ? '#f43f5e' : isAnswered ? '#10b981' : '#52525b',
                        fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
                        border: isCurrent ? '2px solid #6366f1' : isFlagged ? '1px solid rgba(244,63,94,0.3)' : '1px solid transparent',
                      }}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { color: '#10b981', label: `Cevaplanan (${answeredCount})` },
                  { color: '#52525b', label: `Boş (${questions.length - answeredCount})` },
                  { color: '#f43f5e', label: `İşaretli (${flagged.size})` },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#71717a' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: item.color + '40', border: `1px solid ${item.color}` }} />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // ─── RESULTS ─────────────────────────────────────────────────────────────────
  if (phase === 'finished' && results) {
    const pct = Math.round((results.dogru / questions.length) * 100);
    return (
      <div style={{ background: '#09090b', minHeight: '100vh', color: '#f4f4f5' }}>
        <FizikNavbar />
        <main style={{ maxWidth: '800px', margin: '0 auto', padding: '6rem 1.5rem 4rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
            {pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '📚'}
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            {pct >= 80 ? 'Mükemmel!' : pct >= 50 ? 'İyi Çalışma!' : 'Daha Fazla Pratik!'}
          </h1>
          <p style={{ color: '#71717a', marginBottom: '2.5rem' }}>
            {examType} Fizik Denemesi tamamlandı
          </p>

          {/* Score summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { label: 'Doğru', value: results.dogru, color: '#10b981', icon: '✅' },
              { label: 'Yanlış', value: results.yanlis, color: '#f43f5e', icon: '❌' },
              { label: 'Boş', value: results.bos, color: '#71717a', icon: '⬜' },
              { label: 'Net Puan', value: results.puan.toFixed(2), color: '#6366f1', icon: '⭐' },
            ].map(item => (
              <div key={item.label} style={{ background: '#111113', border: '1px solid #27272a', borderRadius: '16px', padding: '1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: item.color, fontFamily: 'monospace' }}>{item.value}</div>
                <div style={{ fontSize: '0.78rem', color: '#71717a', marginTop: '0.25rem' }}>{item.label}</div>
              </div>
            ))}
          </div>

          {/* Topic breakdown */}
          <div style={{ background: '#111113', border: '1px solid #27272a', borderRadius: '16px', padding: '1.5rem', textAlign: 'left', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#a1a1aa', marginBottom: '1rem' }}>Konu Bazlı Performans</h2>
            {Object.entries(results.konuAnaliz).map(([konu, { dogru, yanlis }]) => {
              const total = dogru + yanlis;
              const pct = total > 0 ? (dogru / total) * 100 : 0;
              return (
                <div key={konu} style={{ marginBottom: '0.875rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#f4f4f5' }}>{konu}</span>
                    <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: pct >= 70 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#f43f5e', fontWeight: 700 }}>
                      {dogru}/{total} ({pct.toFixed(0)}%)
                    </span>
                  </div>
                  <div style={{ background: '#1c1c1f', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: pct >= 70 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#f43f5e', borderRadius: '4px', transition: 'width 1s' }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Answer review */}
          <div style={{ background: '#111113', border: '1px solid #27272a', borderRadius: '16px', padding: '1.5rem', textAlign: 'left', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#a1a1aa', marginBottom: '1rem' }}>Cevap Anahtarı</h2>
            {questions.map((q, idx) => {
              const given = answers[q.id];
              const isCorrect = given === q.correct;
              const isBos = given === -1;
              const letters = ['A', 'B', 'C', 'D', 'E'];
              return (
                <div key={q.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', marginBottom: '0.875rem', padding: '0.875rem', borderRadius: '10px', background: '#18181b', borderLeft: `4px solid ${isBos ? '#3f3f46' : isCorrect ? '#10b981' : '#f43f5e'}` }}>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#52525b', minWidth: '16px', marginTop: '2px' }}>{idx + 1}.</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.82rem', color: '#a1a1aa', marginBottom: '0.4rem' }}>{q.text.slice(0, 80)}...</div>
                    <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.78rem' }}>
                      <span style={{ color: isCorrect ? '#10b981' : isBos ? '#52525b' : '#f43f5e' }}>
                        Verilen: {isBos ? '—' : letters[given]}
                      </span>
                      <span style={{ color: '#10b981' }}>Doğru: {letters[q.correct]}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '1rem' }}>{isBos ? '⬜' : isCorrect ? '✅' : '❌'}</div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={() => setPhase('setup')}
              style={{ padding: '0.875rem 2rem', borderRadius: '12px', border: '1px solid #27272a', background: '#18181b', color: '#a1a1aa', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}
            >
              Yeni Deneme
            </button>
            <button
              onClick={() => router.push('/fizik-yildizi/ogrenci/analiz')}
              style={{ padding: '0.875rem 2rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: 'white', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}
            >
              Analizi Gör →
            </button>
          </div>
        </main>
      </div>
    );
  }

  return null;
}
