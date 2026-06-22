'use client';

import { useState } from 'react';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Student {
  id: string;
  name: string;
  lastLogin: string;
  topicsCompleted: number;
  testAvg: number;
}

interface ClassData {
  id: string;
  name: string;
  code: string;
  studentCount: number;
  avgScore: number;
  created: string;
  students: Student[];
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const INITIAL_CLASSES: ClassData[] = [
  {
    id: 'c1',
    name: '10-A Fizik',
    code: 'FY-2A3B',
    studentCount: 3,
    avgScore: 74,
    created: '01 Eyl 2025',
    students: [
      { id: 's1', name: 'Ahmet Yılmaz', lastLogin: '2 saat önce', topicsCompleted: 12, testAvg: 91 },
      { id: 's4', name: 'Zeynep Öz', lastLogin: '3 saat önce', topicsCompleted: 10, testAvg: 83 },
      { id: 's7', name: 'Burak Çelik', lastLogin: '2 gün önce', topicsCompleted: 8, testAvg: 75 },
    ],
  },
  {
    id: 'c2',
    name: '11-B Fizik',
    code: 'FY-9C1D',
    studentCount: 3,
    avgScore: 61,
    created: '01 Eyl 2025',
    students: [
      { id: 's3', name: 'Mert Aydın', lastLogin: 'Dün', topicsCompleted: 9, testAvg: 85 },
      { id: 's6', name: 'Selin Arslan', lastLogin: 'Dün', topicsCompleted: 7, testAvg: 78 },
      { id: 's9', name: 'Emre Kara', lastLogin: '3 gün önce', topicsCompleted: 5, testAvg: 69 },
    ],
  },
  {
    id: 'c3',
    name: '12-C Fizik',
    code: 'FY-7E4F',
    studentCount: 3,
    avgScore: 82,
    created: '01 Eyl 2025',
    students: [
      { id: 's2', name: 'Elif Şahin', lastLogin: '1 saat önce', topicsCompleted: 14, testAvg: 88 },
      { id: 's5', name: 'Can Demirtaş', lastLogin: '5 saat önce', topicsCompleted: 11, testAvg: 80 },
      { id: 's8', name: 'Nisan Güler', lastLogin: 'Bugün', topicsCompleted: 9, testAvg: 72 },
    ],
  },
];

// ─── Styles ───────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#050a1a',
    color: '#f8fafc',
    fontFamily: 'var(--font-outfit, Outfit, sans-serif)',
    padding: '2rem 2rem 3rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap' as const,
    gap: '1rem',
  },
  title: { fontSize: '1.75rem', fontWeight: 800 },
  classGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.25rem',
    marginBottom: '2.5rem',
  },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: '18px',
    padding: '1.5rem',
    backdropFilter: 'blur(12px)',
    cursor: 'pointer',
    transition: 'all 0.25s',
  },
  cardSelected: {
    border: '1px solid rgba(124,58,237,0.5)',
    background: 'rgba(124,58,237,0.08)',
    boxShadow: '0 0 30px rgba(124,58,237,0.2)',
  },
  codeBlock: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    background: 'rgba(124,58,237,0.1)',
    border: '1px solid rgba(124,58,237,0.3)',
    borderRadius: '8px',
    padding: '0.3rem 0.7rem',
    fontSize: '0.82rem',
    fontFamily: 'monospace',
    color: '#a78bfa',
    cursor: 'pointer',
  },
  btnPrimary: {
    padding: '0.7rem 1.5rem',
    background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
    border: 'none',
    borderRadius: '10px',
    color: 'white',
    fontWeight: 700,
    fontSize: '0.9rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  btnSecondary: {
    padding: '0.7rem 1.5rem',
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '10px',
    color: '#f8fafc',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  modal: {
    position: 'fixed' as const,
    inset: 0,
    background: 'rgba(0,0,0,0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
    backdropFilter: 'blur(6px)',
  },
  modalBox: {
    background: 'rgba(10,18,40,0.98)',
    border: '1px solid rgba(124,58,237,0.3)',
    borderRadius: '20px',
    padding: '2rem',
    width: '420px',
    maxWidth: '90vw',
    boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 40px rgba(124,58,237,0.15)',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '10px',
    color: '#f8fafc',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    boxSizing: 'border-box' as const,
    outline: 'none',
  },
  label: { fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '0.4rem' },
  studentTable: { width: '100%', borderCollapse: 'collapse' as const },
  th: {
    textAlign: 'left' as const,
    padding: '0.75rem 1rem',
    fontSize: '0.78rem',
    fontWeight: 700,
    color: '#64748b',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.06em',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  td: { padding: '0.85rem 1rem', fontSize: '0.875rem', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#cbd5e1' },
};

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return 'FY-' + Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SinifPage() {
  const [classes, setClasses] = useState<ClassData[]>(INITIAL_CLASSES);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [addCodeInput, setAddCodeInput] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  const handleCreateClass = () => {
    if (!newClassName.trim()) return;
    const newClass: ClassData = {
      id: `c${Date.now()}`,
      name: newClassName.trim(),
      code: generateCode(),
      studentCount: 0,
      avgScore: 0,
      created: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }),
      students: [],
    };
    setClasses((prev) => [...prev, newClass]);
    setNewClassName('');
    setShowModal(false);
    showNotif('✅ Sınıf başarıyla oluşturuldu!');
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const removeStudent = (studentId: string) => {
    if (!selectedClass) return;
    const updated = classes.map((cls) => {
      if (cls.id !== selectedClass.id) return cls;
      const filtered = cls.students.filter((s) => s.id !== studentId);
      return { ...cls, students: filtered, studentCount: filtered.length };
    });
    setClasses(updated);
    const updatedClass = updated.find((c) => c.id === selectedClass.id)!;
    setSelectedClass(updatedClass);
    showNotif('🗑️ Öğrenci sınıftan çıkarıldı.');
  };

  return (
    <div style={s.page}>
      {/* Notification */}
      {notification && (
        <div style={{
          position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 500,
          background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)',
          borderRadius: '12px', padding: '0.75rem 1.25rem', color: '#6ee7b7',
          fontWeight: 600, fontSize: '0.9rem', backdropFilter: 'blur(10px)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        }}>
          {notification}
        </div>
      )}

      {/* Header */}
      <div style={s.header}>
        <div>
          <Link href="/fizik-yildizi/ogretmen/dashboard" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.85rem' }}>
            ← Panele Dön
          </Link>
          <h1 style={{ ...s.title, marginTop: '0.25rem' }}>
            🏫{' '}
            <span style={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Sınıflarım
            </span>
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' as const }}>
          <button style={s.btnSecondary} onClick={() => setShowCodeModal(true)}>🔑 Koda Göre Ekle</button>
          <button style={s.btnPrimary} onClick={() => setShowModal(true)}>+ Yeni Sınıf Oluştur</button>
        </div>
      </div>

      {/* Class Cards */}
      <div style={s.classGrid}>
        {classes.map((cls) => (
          <div
            key={cls.id}
            style={{ ...s.card, ...(selectedClass?.id === cls.id ? s.cardSelected : {}) }}
            onClick={() => setSelectedClass(selectedClass?.id === cls.id ? null : cls)}
            onMouseEnter={(e) => { if (selectedClass?.id !== cls.id) (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(124,58,237,0.3)'; }}
            onMouseLeave={(e) => { if (selectedClass?.id !== cls.id) (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.09)'; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.25rem' }}>{cls.name}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Oluşturuldu: {cls.created}</div>
              </div>
              <span style={{
                padding: '0.25rem 0.6rem', borderRadius: '20px',
                background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.3)',
                color: '#67e8f9', fontSize: '0.75rem', fontWeight: 700
              }}>{cls.studentCount} öğrenci</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Ort. Puan</div>
              <div style={{ fontWeight: 700, color: cls.avgScore >= 75 ? '#10b981' : cls.avgScore >= 60 ? '#f59e0b' : '#ef4444' }}>
                %{cls.avgScore}
              </div>
            </div>

            <div style={{ height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden', marginBottom: '1rem' }}>
              <div style={{ height: '100%', width: `${cls.avgScore}%`, background: 'linear-gradient(90deg, #7c3aed, #06b6d4)', borderRadius: '3px', transition: 'width 0.6s' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' as const }}>
              <div
                style={s.codeBlock}
                onClick={(e) => { e.stopPropagation(); copyCode(cls.code); }}
                title="Kodu kopyala"
              >
                🔑 {cls.code} {copiedCode === cls.code ? '✓' : '📋'}
              </div>
              <button
                style={{ marginLeft: 'auto', padding: '0.35rem 0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#94a3b8', fontSize: '0.78rem', cursor: 'pointer' }}
                onClick={(e) => { e.stopPropagation(); setSelectedClass(cls); }}
              >
                {selectedClass?.id === cls.id ? 'Kapat ▲' : 'Öğrenciler ▼'}
              </button>
            </div>
          </div>
        ))}

        {/* Empty state */}
        {classes.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: '#64748b' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏫</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Henüz sınıf oluşturmadınız</div>
            <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Yukarıdaki &quot;Yeni Sınıf Oluştur&quot; butonuna tıklayın</div>
          </div>
        )}
      </div>

      {/* Student List */}
      {selectedClass && (
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(124,58,237,0.25)',
          borderRadius: '18px',
          overflow: 'hidden',
          marginBottom: '2rem',
          animation: 'fadeIn 0.3s ease',
        }}>
          <div style={{
            padding: '1.25rem 1.5rem',
            background: 'rgba(124,58,237,0.08)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>👩‍🎓 {selectedClass.name} — Öğrenci Listesi</span>
              <span style={{ marginLeft: '0.75rem', color: '#64748b', fontSize: '0.82rem' }}>{selectedClass.students.length} öğrenci</span>
            </div>
            <button
              style={{ ...s.btnSecondary, padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
              onClick={() => { copyCode(selectedClass.code); }}
            >
              📤 Davet Kodu: {selectedClass.code}
            </button>
          </div>

          {selectedClass.students.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>👤</div>
              <div>Bu sınıfta henüz öğrenci yok.</div>
            </div>
          ) : (
            <table style={s.studentTable}>
              <thead>
                <tr>
                  <th style={s.th}>Öğrenci Adı</th>
                  <th style={s.th}>Son Giriş</th>
                  <th style={s.th}>Tamamlanan Konu</th>
                  <th style={s.th}>Test Ortalaması</th>
                  <th style={s.th}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {selectedClass.students.map((student) => (
                  <tr key={student.id}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ ...s.td, fontWeight: 600, color: '#f8fafc' }}>
                      <Link href={`/fizik-yildizi/ogretmen/ogrenci/${student.id}`}
                        style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{
                          width: '32px', height: '32px', borderRadius: '50%',
                          background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.8rem', fontWeight: 800, flexShrink: 0,
                        }}>
                          {student.name.charAt(0)}
                        </span>
                        {student.name}
                      </Link>
                    </td>
                    <td style={{ ...s.td, color: '#64748b' }}>{student.lastLogin}</td>
                    <td style={s.td}>
                      <span style={{ padding: '0.2rem 0.5rem', borderRadius: '6px', background: 'rgba(6,182,212,0.12)', color: '#67e8f9', fontWeight: 600 }}>
                        {student.topicsCompleted} konu
                      </span>
                    </td>
                    <td style={s.td}>
                      <span style={{
                        padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: 700,
                        background: student.testAvg >= 80 ? 'rgba(16,185,129,0.15)' : student.testAvg >= 65 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                        color: student.testAvg >= 80 ? '#10b981' : student.testAvg >= 65 ? '#f59e0b' : '#ef4444',
                      }}>%{student.testAvg}</span>
                    </td>
                    <td style={s.td}>
                      <button
                        onClick={() => removeStudent(student.id)}
                        style={{
                          padding: '0.35rem 0.75rem', borderRadius: '7px',
                          background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
                          color: '#ef4444', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                        }}
                      >
                        Çıkar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Create Class Modal */}
      {showModal && (
        <div style={s.modal} onClick={() => setShowModal(false)}>
          <div style={s.modalBox} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontWeight: 800, fontSize: '1.3rem', marginBottom: '1.5rem' }}>🏫 Yeni Sınıf Oluştur</h2>
            <label style={s.label}>Sınıf Adı</label>
            <input
              style={{ ...s.input, marginBottom: '1.5rem' }}
              placeholder="Örn: 10-A Fizik"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateClass()}
              autoFocus
            />
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button style={{ ...s.btnPrimary, flex: 1, justifyContent: 'center' }} onClick={handleCreateClass}>
                Oluştur
              </button>
              <button style={{ ...s.btnSecondary, flex: 1, justifyContent: 'center' }} onClick={() => setShowModal(false)}>
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Code Join Modal */}
      {showCodeModal && (
        <div style={s.modal} onClick={() => setShowCodeModal(false)}>
          <div style={s.modalBox} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontWeight: 800, fontSize: '1.3rem', marginBottom: '0.5rem' }}>🔑 Koda Göre Öğrenci Ekle</h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Öğrencinin katılmak istediği sınıf kodunu girin.
            </p>
            <label style={s.label}>Sınıf Kodu</label>
            <input
              style={{ ...s.input, marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'monospace' }}
              placeholder="FY-XXXX"
              value={addCodeInput}
              onChange={(e) => setAddCodeInput(e.target.value.toUpperCase())}
              maxLength={7}
            />
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button style={{ ...s.btnPrimary, flex: 1, justifyContent: 'center' }} onClick={() => {
                const found = classes.find((c) => c.code === addCodeInput.trim());
                if (found) { setSelectedClass(found); setShowCodeModal(false); showNotif(`✅ "${found.name}" sınıfı bulundu!`); }
                else showNotif('❌ Kod bulunamadı. Kontrol edip tekrar deneyin.');
                setAddCodeInput('');
              }}>
                Ara
              </button>
              <button style={{ ...s.btnSecondary, flex: 1, justifyContent: 'center' }} onClick={() => setShowCodeModal(false)}>
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
