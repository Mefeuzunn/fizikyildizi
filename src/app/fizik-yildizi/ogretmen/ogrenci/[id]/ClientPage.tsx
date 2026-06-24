'use client';

import { useState, use, useEffect } from 'react';
import Link from 'next/link';
import { getKullanicilar } from '@/lib/fizik-yildizi/db';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TestResult {
  date: string;
  score: number;
  topic: string;
  totalQ: number;
  correct: number;
  questions: { q: string; correct: boolean }[];
}

interface TopicRow {
  topic: string;
  tests: number;
  avgScore: number;
  status: 'İyi' | 'Orta' | 'Zayıf';
}

interface StudentFull {
  id: string;
  name: string;
  class: string;
  schoolNo: string;
  joinDate: string;
  totalTests: number;
  successRate: number;
  studyHours: number;
  topicsCompleted: number;
  radarData: { topic: string; score: number }[];
  trendData: { week: string; score: number }[];
  topicRows: TopicRow[];
  wrongTypes: { type: string; count: number }[];
  recentTests: TestResult[];
}

// ─── Sample Students DB ───────────────────────────────────────────────────────

const STUDENTS: Record<string, StudentFull> = {
  s1: {
    id: 's1', name: 'Ahmet Yılmaz', class: '10-A', schoolNo: '2025-0042', joinDate: '12 Eyl 2025',
    totalTests: 42, successRate: 91, studyHours: 68, topicsCompleted: 12,
    radarData: [
      { topic: 'Kuvvet', score: 95 }, { topic: 'Hareket', score: 88 }, { topic: 'Enerji', score: 92 },
      { topic: 'Dalgalar', score: 84 }, { topic: 'Optik', score: 90 }, { topic: 'Elektrik', score: 87 },
    ],
    trendData: [
      { week: 'Hf.1', score: 72 }, { week: 'Hf.2', score: 78 }, { week: 'Hf.3', score: 81 },
      { week: 'Hf.4', score: 85 }, { week: 'Hf.5', score: 88 }, { week: 'Hf.6', score: 91 },
      { week: 'Hf.7', score: 91 }, { week: 'Hf.8', score: 94 },
    ],
    topicRows: [
      { topic: 'Kuvvet ve Hareket', tests: 14, avgScore: 92, status: 'İyi' },
      { topic: 'Enerji ve İş', tests: 10, avgScore: 89, status: 'İyi' },
      { topic: 'Dalgalar', tests: 8, avgScore: 84, status: 'İyi' },
      { topic: 'Elektrik', tests: 6, avgScore: 87, status: 'İyi' },
      { topic: 'Optik', tests: 4, avgScore: 90, status: 'İyi' },
    ],
    wrongTypes: [
      { type: 'Formül Uygulama', count: 12 },
      { type: 'Kavram Karışıklığı', count: 7 },
      { type: 'Grafik Yorumlama', count: 5 },
    ],
    recentTests: [
      { date: '8 Haz 2026', score: 95, topic: 'Optik', totalQ: 20, correct: 19, questions: [{ q: 'Mercek sorusu', correct: true }, { q: 'Yansıma açısı', correct: false }] },
      { date: '5 Haz 2026', score: 90, topic: 'Kuvvet', totalQ: 20, correct: 18, questions: [{ q: "Newton'un 2. yasası", correct: true }, { q: 'Sürtünme kuvveti', correct: false }] },
      { date: '2 Haz 2026', score: 85, topic: 'Dalgalar', totalQ: 20, correct: 17, questions: [{ q: 'Dalga hızı', correct: true }, { q: 'Doppler etkisi', correct: false }] },
      { date: '29 May 2026', score: 92, topic: 'Enerji', totalQ: 20, correct: 18, questions: [] },
      { date: '26 May 2026', score: 88, topic: 'Hareket', totalQ: 20, correct: 18, questions: [] },
    ],
  },
  s2: {
    id: 's2', name: 'Elif Şahin', class: '12-C', schoolNo: '2025-0018', joinDate: '10 Eyl 2025',
    totalTests: 38, successRate: 88, studyHours: 55, topicsCompleted: 14,
    radarData: [
      { topic: 'Kuvvet', score: 82 }, { topic: 'Hareket', score: 90 }, { topic: 'Enerji', score: 88 },
      { topic: 'Dalgalar', score: 91 }, { topic: 'Optik', score: 85 }, { topic: 'Elektrik', score: 89 },
    ],
    trendData: [
      { week: 'Hf.1', score: 68 }, { week: 'Hf.2', score: 74 }, { week: 'Hf.3', score: 79 },
      { week: 'Hf.4', score: 82 }, { week: 'Hf.5', score: 85 }, { week: 'Hf.6', score: 87 },
      { week: 'Hf.7', score: 88 }, { week: 'Hf.8', score: 90 },
    ],
    topicRows: [
      { topic: 'Dalgalar', tests: 12, avgScore: 91, status: 'İyi' },
      { topic: 'Hareket', tests: 10, avgScore: 90, status: 'İyi' },
      { topic: 'Elektrik', tests: 8, avgScore: 89, status: 'İyi' },
      { topic: 'Enerji', tests: 5, avgScore: 88, status: 'İyi' },
      { topic: 'Kuvvet', tests: 3, avgScore: 82, status: 'İyi' },
    ],
    wrongTypes: [{ type: 'Formül Uygulama', count: 8 }, { type: 'Hesap Hatası', count: 6 }, { type: 'Kavram', count: 3 }],
    recentTests: [
      { date: '9 Haz 2026', score: 90, topic: 'Dalgalar', totalQ: 20, correct: 18, questions: [] },
      { date: '6 Haz 2026', score: 88, topic: 'Elektrik', totalQ: 20, correct: 18, questions: [] },
      { date: '3 Haz 2026', score: 85, topic: 'Optik', totalQ: 20, correct: 17, questions: [] },
      { date: '30 May 2026', score: 92, topic: 'Hareket', totalQ: 20, correct: 18, questions: [] },
      { date: '27 May 2026', score: 87, topic: 'Enerji', totalQ: 20, correct: 17, questions: [] },
    ],
  },
};

// Fallback for unknown IDs
const DEFAULT_STUDENT: StudentFull = {
  id: 'unknown', name: 'Öğrenci', class: '—', schoolNo: '—', joinDate: '—',
  totalTests: 0, successRate: 0, studyHours: 0, topicsCompleted: 0,
  radarData: [], trendData: [], topicRows: [], wrongTypes: [], recentTests: [],
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#050a1a',
    color: '#f8fafc',
    fontFamily: 'var(--font-outfit, Outfit, sans-serif)',
    padding: '2rem 2rem 3rem',
    maxWidth: '1300px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: '18px',
    padding: '1.5rem',
    backdropFilter: 'blur(12px)',
    marginBottom: '1.5rem',
  },
  statGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  statCard: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: '14px',
    padding: '1.25rem',
    backdropFilter: 'blur(10px)',
  },
  sectionTitle: { fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
  table: { width: '100%', borderCollapse: 'collapse' as const },
  th: { textAlign: 'left' as const, padding: '0.75rem 1rem', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '0.06em', borderBottom: '1px solid rgba(255,255,255,0.08)' },
  td: { padding: '0.85rem 1rem', fontSize: '0.875rem', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#cbd5e1' },
  noteTextarea: {
    width: '100%', minHeight: '100px', padding: '0.875rem 1rem',
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '10px', color: '#f8fafc', fontSize: '0.9rem', fontFamily: 'inherit',
    resize: 'vertical' as const, outline: 'none', boxSizing: 'border-box' as const,
  },
  btn: {
    padding: '0.65rem 1.25rem', borderRadius: '9px', border: 'none',
    background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
    color: 'white', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
  },
  btnOutline: {
    padding: '0.65rem 1.25rem', borderRadius: '9px',
    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
    color: '#f8fafc', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
  },
};

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'rgba(10,18,40,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.75rem 1rem' }}>
        <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.2rem' }}>{label}</p>
        <p style={{ color: '#06b6d4', fontWeight: 700 }}>%{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

function statusColor(status: string) {
  if (status === 'İyi') return { bg: 'rgba(16,185,129,0.15)', color: '#10b981' };
  if (status === 'Orta') return { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' };
  return { bg: 'rgba(239,68,68,0.15)', color: '#ef4444' };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function StudentDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const [student, setStudent] = useState<StudentFull | null>(null);

  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState<string[]>([]);
  const [expandedTest, setExpandedTest] = useState<number | null>(null);
  const [notifMsg, setNotifMsg] = useState<string | null>(null);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [suggestedTopic, setSuggestedTopic] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      const users = await getKullanicilar();
      const found = users.find(u => u.id === params.id && u.rol === 'ogrenci');
      if (found) {
        setStudent({
          id: found.id,
          name: `${found.ad} ${found.soyad}`,
          class: `${found.sinif || 9}-A`,
          schoolNo: found.okulNo || '—',
          joinDate: found.kayitTarihi ? new Date(found.kayitTarihi).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }) : '—',
          totalTests: 15,
          successRate: 74,
          studyHours: 22,
          topicsCompleted: 4,
          radarData: [
            { topic: 'Kuvvet', score: 82 }, { topic: 'Hareket', score: 75 }, { topic: 'Enerji', score: 80 },
            { topic: 'Dalgalar', score: 70 }, { topic: 'Optik', score: 65 }, { topic: 'Elektrik', score: 72 },
          ],
          trendData: [
            { week: 'Hf.1', score: 65 }, { week: 'Hf.2', score: 68 }, { week: 'Hf.3', score: 70 },
            { week: 'Hf.4', score: 74 },
          ],
          topicRows: [
            { topic: 'Kuvvet ve Hareket', tests: 6, avgScore: 75, status: 'Orta' },
            { topic: 'Enerji ve İş', tests: 4, avgScore: 80, status: 'İyi' },
            { topic: 'Elektrik', tests: 3, avgScore: 72, status: 'Orta' },
            { topic: 'Dalgalar', tests: 2, avgScore: 70, status: 'Orta' },
          ],
          wrongTypes: [
            { type: 'Formül Uygulama', count: 6 },
            { type: 'Hesap Hatası', count: 4 },
          ],
          recentTests: [
            { date: '9 Haz 2026', score: 80, topic: 'Enerji', totalQ: 10, correct: 8, questions: [] },
            { date: '6 Haz 2026', score: 70, topic: 'Elektrik', totalQ: 10, correct: 7, questions: [] },
          ],
        });
      } else {
        const sample = STUDENTS[params.id];
        if (sample) {
          setStudent(sample);
        } else {
          setStudent({
            ...DEFAULT_STUDENT,
            id: params.id,
            name: `Öğrenci #${params.id}`,
          });
        }
      }
    };
    loadUser();
  }, [params.id]);

  if (!student) {
    return (
      <div style={{ minHeight: '100vh', background: '#050a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 48, height: 48, border: '3px solid #7c3aed', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  const showNotif = (msg: string) => {
    setNotifMsg(msg);
    setTimeout(() => setNotifMsg(null), 2500);
  };

  const addNote = () => {
    if (!noteText.trim()) return;
    setNotes((p) => [...p, noteText.trim()]);
    setNoteText('');
    showNotif('📝 Not eklendi.');
  };

  return (
    <div style={s.page}>
      {notifMsg && (
        <div style={{
          position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 500,
          background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)',
          borderRadius: '12px', padding: '0.75rem 1.25rem', color: '#6ee7b7',
          fontWeight: 600, fontSize: '0.9rem', backdropFilter: 'blur(10px)',
        }}>
          {notifMsg}
        </div>
      )}

      {/* Back link */}
      <Link href="/fizik-yildizi/ogretmen/sinif" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.85rem' }}>← Sınıfa Dön</Link>

      {/* Student Header */}
      <div style={{ ...s.card, marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.75rem', fontWeight: 800, color: 'white',
            boxShadow: '0 0 20px rgba(124,58,237,0.4)',
          }}>
            {student.name.charAt(0)}
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.2rem' }}>{student.name}</h1>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' as const }}>
              {[
                { label: 'Sınıf', value: student.class },
                { label: 'No', value: student.schoolNo },
                { label: 'Katılım', value: student.joinDate },
              ].map((item) => (
                <span key={item.label} style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  <span style={{ color: '#94a3b8', fontWeight: 600 }}>{item.label}:</span> {item.value}
                </span>
              ))}
            </div>
          </div>
        </div>
        <button style={s.btn} onClick={() => setShowTopicModal(true)}>📚 Konu Öner</button>
      </div>

      {/* Stat Cards */}
      <div style={s.statGrid}>
        {[
          { icon: '📝', label: 'Toplam Test', value: student.totalTests, color: '#8b5cf6' },
          { icon: '🎯', label: 'Başarı Oranı', value: `%${student.successRate}`, color: '#10b981' },
          { icon: '⏱️', label: 'Çalışma Süresi', value: `${student.studyHours}s`, color: '#06b6d4' },
          { icon: '📖', label: 'Tamamlanan Konu', value: student.topicsCompleted, color: '#f59e0b' },
        ].map((item) => (
          <div key={item.label} style={s.statCard}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>{item.icon}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: item.color, lineHeight: 1 }}>{item.value}</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem' }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Radar */}
        <div style={s.card}>
          <div style={s.sectionTitle}>🕸️ Konu Hakimiyeti</div>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={student.radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="topic" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Radar dataKey="score" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.25} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Line */}
        <div style={s.card}>
          <div style={s.sectionTitle}>📈 Puan Trendi</div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={student.trendData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="week" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} domain={[50, 100]} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 4, fill: '#06b6d4', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#f59e0b' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Per-topic Table */}
      <div style={s.card}>
        <div style={s.sectionTitle}>📊 Konu Kırılımı</div>
        <table style={s.table}>
          <thead>
            <tr>
              {['Konu', 'Test Sayısı', 'Ort. Puan', 'Durum'].map((h) => (
                <th key={h} style={s.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {student.topicRows.map((row) => {
              const sc = statusColor(row.status);
              return (
                <tr key={row.topic}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ ...s.td, color: '#f8fafc', fontWeight: 600 }}>{row.topic}</td>
                  <td style={s.td}>{row.tests}</td>
                  <td style={{ ...s.td, color: '#06b6d4', fontWeight: 700 }}>%{row.avgScore}</td>
                  <td style={s.td}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, background: sc.bg, color: sc.color }}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Wrong Question Types */}
      <div style={s.card}>
        <div style={s.sectionTitle}>❌ En Çok Yanlış Yapılan Soru Türleri</div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' as const }}>
          {student.wrongTypes.map((wt) => (
            <div key={wt.type} style={{
              padding: '0.75rem 1.25rem', borderRadius: '12px',
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#ef4444' }}>{wt.count}</span>
              <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{wt.type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Tests */}
      <div style={s.card}>
        <div style={s.sectionTitle}>🧾 Son 5 Test Sonucu</div>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.75rem' }}>
          {student.recentTests.map((test, i) => (
            <div key={i}>
              <div
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.875rem 1rem', borderRadius: '10px',
                  background: expandedTest === i ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${expandedTest === i ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.06)'}`,
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                onClick={() => setExpandedTest(expandedTest === i ? null : i)}
              >
                <div>
                  <span style={{ fontWeight: 600, color: '#f8fafc' }}>{test.topic}</span>
                  <span style={{ marginLeft: '0.75rem', fontSize: '0.8rem', color: '#64748b' }}>{test.date}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{
                    padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem',
                    background: test.score >= 80 ? 'rgba(16,185,129,0.15)' : test.score >= 65 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                    color: test.score >= 80 ? '#10b981' : test.score >= 65 ? '#f59e0b' : '#ef4444',
                  }}>%{test.score}</span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{test.correct}/{test.totalQ} doğru</span>
                  <span style={{ color: '#64748b', fontSize: '0.8rem' }}>{expandedTest === i ? '▲' : '▼'}</span>
                </div>
              </div>

              {expandedTest === i && test.questions.length > 0 && (
                <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0 0 10px 10px', border: '1px solid rgba(255,255,255,0.05)', borderTop: 'none' }}>
                  {test.questions.map((q, qi) => (
                    <div key={qi} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0', fontSize: '0.85rem', color: '#94a3b8' }}>
                      <span style={{ color: q.correct ? '#10b981' : '#ef4444' }}>{q.correct ? '✓' : '✗'}</span>
                      <span>{q.q}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Teacher Notes */}
      <div style={s.card}>
        <div style={s.sectionTitle}>📝 Öğretmen Notu Ekle</div>
        {notes.map((note, i) => (
          <div key={i} style={{
            padding: '0.75rem 1rem', borderRadius: '10px',
            background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
            fontSize: '0.875rem', color: '#fcd34d', marginBottom: '0.5rem',
          }}>
            📌 {note}
          </div>
        ))}
        <textarea
          style={s.noteTextarea}
          placeholder="Bu öğrenci için not ekleyin..."
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
        />
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
          <button style={s.btn} onClick={addNote}>💾 Notu Kaydet</button>
        </div>
      </div>

      {/* Topic Suggest Modal */}
      {showTopicModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 200, backdropFilter: 'blur(6px)',
        }} onClick={() => setShowTopicModal(false)}>
          <div style={{
            background: 'rgba(10,18,40,0.98)', border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: '20px', padding: '2rem', width: '420px', maxWidth: '90vw',
            boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '1rem' }}>📚 Konu Öner</h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              <strong style={{ color: '#a78bfa' }}>{student.name}</strong> için çalışmasını istediğiniz konuyu seçin.
            </p>
            <select
              style={{ width: '100%', padding: '0.75rem 1rem', background: '#0a1428', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', color: '#f8fafc', fontSize: '0.9rem', outline: 'none', marginBottom: '1.25rem', cursor: 'pointer' }}
              value={suggestedTopic}
              onChange={(e) => setSuggestedTopic(e.target.value)}
            >
              <option value="">— Konu Seçin —</option>
              {['Kuvvet ve Hareket', 'Enerji ve İş', 'Dalgalar', 'Optik', 'Elektrik ve Manyetizma', 'Termodinamik', 'Modern Fizik'].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button style={{ ...s.btn, flex: 1, justifyContent: 'center' }} onClick={() => {
                if (!suggestedTopic) return;
                showNotif(`✅ "${suggestedTopic}" konusu ${student.name} için önerildi!`);
                setShowTopicModal(false);
                setSuggestedTopic('');
              }}>Gönder</button>
              <button style={{ ...s.btnOutline, flex: 1, justifyContent: 'center' }} onClick={() => setShowTopicModal(false)}>İptal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


