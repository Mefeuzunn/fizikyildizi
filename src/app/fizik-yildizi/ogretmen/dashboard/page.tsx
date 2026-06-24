'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { 
  getOnayliOgrenciler, 
  getOnayBekleyenOgrenciler, 
  ogrenciOnayla, 
  ogrenciReddet,
  getAtananTestler,
  saveAtananTest,
  deleteAtananTest,
  getDersIcerikleri,
  saveDersIcerigi,
  deleteDersIcerigi,
  saveKullanici,
  getKullanicilar,
  getOgretmenBildirimleri,
  bildirimOnayla,
  bildirimReddet,
  OgretmenBildirimi,
  AtananTest,
  DersIcerigi,
  Kullanici
} from '@/lib/fizik-yildizi/db';
import { konular } from '@/data/fizik-yildizi/konular';

// ─── Constants ───

const BAR_COLORS = ['#7c3aed', '#8b5cf6', '#06b6d4', '#0ea5e9', '#f59e0b', '#ef4444', '#10b981'];

// ─── Sidebar Nav ─────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { icon: '🏠', label: 'Ana Sayfa', href: '#', view: 'dashboard' },
  { icon: '🏫', label: 'Sınıflarım', href: '/fizik-yildizi/ogretmen/sinif' },
  { icon: '👩‍🎓', label: 'Öğrenciler', href: '#', view: 'ogrenciler' },
  { icon: '📊', label: 'Raporlar', href: '#', view: 'raporlar' },
  { icon: '⚙️', label: 'Ayarlar', href: '#', view: 'ayarlar' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function todayTR() {
  return new Date().toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const s: Record<string, React.CSSProperties> = {
  page: {
    display: 'flex',
    minHeight: '100vh',
    background: '#050a1a',
    color: '#f8fafc',
    fontFamily: 'var(--font-outfit, Outfit, sans-serif)',
  },
  sidebar: {
    width: '260px',
    flexShrink: 0,
    background: 'rgba(255,255,255,0.03)',
    borderRight: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    flexDirection: 'column',
    padding: '1.5rem 1rem',
    position: 'sticky' as const,
    top: '0',
    height: '100vh',
    overflowY: 'auto',
  },
  avatarWrap: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1.5rem 0 1.5rem',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    marginBottom: '1rem',
  },
  avatar: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.75rem',
    fontWeight: 800,
    color: 'white',
    boxShadow: '0 0 20px rgba(124,58,237,0.4)',
  },
  teacherName: { fontWeight: 700, fontSize: '0.95rem', color: '#f8fafc', textAlign: 'center' as const },
  schoolName: { fontSize: '0.75rem', color: '#64748b', textAlign: 'center' as const },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.65rem 0.875rem',
    borderRadius: '10px',
    color: '#94a3b8',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 500,
    transition: 'all 0.2s',
    marginBottom: '0.15rem',
    cursor: 'pointer',
  },
  navItemActive: {
    background: 'rgba(124,58,237,0.18)',
    color: '#a78bfa',
  },
  sidebarBottom: {
    marginTop: 'auto',
    paddingTop: '1rem',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem',
  },
  main: { flex: 1, overflowY: 'auto', padding: '2rem' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap' as const,
    gap: '1rem',
  },
  headerTitle: { fontSize: '1.6rem', fontWeight: 800 },
  headerDate: { fontSize: '0.875rem', color: '#64748b' },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  statCard: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: '16px',
    padding: '1.25rem',
    backdropFilter: 'blur(10px)',
  },
  statIcon: { fontSize: '1.75rem', marginBottom: '0.5rem' },
  statValue: { fontSize: '1.75rem', fontWeight: 800, lineHeight: 1 },
  statLabel: { fontSize: '0.78rem', color: '#64748b', marginTop: '0.25rem' },
  sectionTitle: {
    fontSize: '1.15rem',
    fontWeight: 700,
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '1.5rem',
  },
  classGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  classCard: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: '16px',
    padding: '1.25rem',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.25s',
  },
  progressBar: { height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden', marginTop: '0.4rem', marginBottom: '0.75rem' },
  progressFill: { height: '100%', borderRadius: '3px', background: 'linear-gradient(90deg, #7c3aed, #06b6d4)', transition: 'width 0.5s ease' },
  table: { width: '100%', borderCollapse: 'collapse' as const, marginBottom: '2rem' },
  th: {
    textAlign: 'left' as const,
    padding: '0.75rem 1rem',
    fontSize: '0.78rem',
    fontWeight: 700,
    color: '#64748b',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.07em',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  td: { padding: '0.85rem 1rem', fontSize: '0.875rem', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#cbd5e1' },
  rank: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    fontWeight: 700,
    fontSize: '0.8rem',
  },
  chartWrap: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: '16px',
    padding: '1.5rem',
    marginBottom: '2rem',
    backdropFilter: 'blur(10px)',
  },
  quickActions: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap' as const, marginBottom: '2rem' },
  btnPrimary: {
    padding: '0.75rem 1.5rem',
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
    transition: 'transform 0.2s',
  },
  btnSecondary: {
    padding: '0.75rem 1.5rem',
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
    transition: 'all 0.2s',
  },
  uploadArea: {
    border: '2px dashed rgba(255, 255, 255, 0.15)',
    borderRadius: '12px',
    padding: '1.5rem',
    textAlign: 'center' as const,
    cursor: 'pointer',
    background: 'rgba(255, 255, 255, 0.02)',
    transition: 'all 0.2s',
    marginBottom: '1rem',
  },
  formGroup: {
    marginBottom: '1.25rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.4rem',
  },
  inputField: {
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '10px',
    color: '#f8fafc',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    boxSizing: 'border-box' as const,
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  label: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#94a3b8',
  },
  modal: {
    position: 'fixed' as const,
    inset: 0,
    background: 'rgba(0,0,0,0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
    backdropFilter: 'blur(8px)',
  },
  modalBox: {
    background: 'rgba(10,18,40,0.98)',
    border: '1px solid rgba(124,58,237,0.3)',
    borderRadius: '20px',
    padding: '2rem',
    width: '460px',
    maxWidth: '95vw',
    boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 40px rgba(124,58,237,0.15)',
    position: 'relative' as const,
  },
  dangerBadge: {
    padding: '0.2rem 0.5rem',
    borderRadius: '6px',
    background: 'rgba(239,68,68,0.15)',
    border: '1px solid rgba(239,68,68,0.3)',
    color: '#fca5a5',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  successBadge: {
    padding: '0.2rem 0.5rem',
    borderRadius: '6px',
    background: 'rgba(16,185,129,0.15)',
    border: '1px solid rgba(16,185,129,0.3)',
    color: '#6ee7b7',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  warningBadge: {
    padding: '0.2rem 0.5rem',
    borderRadius: '6px',
    background: 'rgba(245,158,11,0.15)',
    border: '1px solid rgba(245,158,11,0.3)',
    color: '#fcd34d',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
};

const rankStyle = (i: number): React.CSSProperties => ({
  ...s.rank,
  background: i === 0 ? 'rgba(245,158,11,0.25)' : i === 1 ? 'rgba(148,163,184,0.2)' : i === 2 ? 'rgba(180,100,60,0.2)' : 'rgba(255,255,255,0.06)',
  color: i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : i === 2 ? '#cd7f32' : '#64748b',
});

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'rgba(10,18,40,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.75rem 1rem' }}>
        <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.25rem' }}>{label}</p>
        <p style={{ color: '#f59e0b', fontWeight: 700 }}>Hata Oranı: %{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function TeacherDashboard() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [teacher, setTeacher] = useState<any>(null);
  const [onayliOgrenciler, setOnayliOgrenciler] = useState<any[]>([]);
  const [onayBekleyenOgrenciler, setOnayBekleyenOgrenciler] = useState<any[]>([]);
  const [bildirimler, setBildirimler] = useState<OgretmenBildirimi[]>([]);
  const [showBildirimModal, setShowBildirimModal] = useState(false);
  const [realReports, setRealReports] = useState<any[]>([]);
  const [CLASSES, setClasses] = useState<any[]>([]);
  const [topicDifficulty, setTopicDifficulty] = useState<any[]>([]);
  
  // Shared files & Assigned tests states
  const [sharedFiles, setSharedFiles] = useState<DersIcerigi[]>([]);
  const [assignedTests, setAssignedTests] = useState<AtananTest[]>([]);
  
  // Form states for Content Sharing
  const [shareClass, setShareClass] = useState<number>(12);
  const [shareTitle, setShareTitle] = useState('');
  const [shareDesc, setShareDesc] = useState('');
  const [shareFileName, setShareFileName] = useState('');
  const [shareFileSize, setShareFileSize] = useState('');
  
  // Form states for Test Assignment
  const [assignClass, setAssignClass] = useState<number>(12);
  const [assignTopicId, setAssignTopicId] = useState('fizik-bilimi-9');
  const [assignDesc, setAssignDesc] = useState('');
  const [assignDeadline, setAssignDeadline] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Settings form states
  const [setAd, setSetAd] = useState('');
  const [setSoyad, setSetSoyad] = useState('');
  const [setOkulAdi, setSetOkulAdi] = useState('');
  const [setBrans, setSetBrans] = useState('');
  const [setSifre, setSetSifre] = useState('');
  const [setYeniSifre, setSetYeniSifre] = useState('');
  const [setProfilResmiVal, setSetProfilResmiVal] = useState('');

  // General student filter
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  
  // Report filter
  const [reportClassFilter, setReportClassFilter] = useState('12');

  const [toast, setToast] = useState<{ tip: 'success' | 'error'; icerik: string } | null>(null);

  const showToast = (tip: 'success' | 'error', icerik: string) => {
    setToast({ tip, icerik });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = useCallback(async () => {
    if (teacher) {
      const approved = await getOnayliOgrenciler(teacher.id);
      setOnayliOgrenciler(approved);
      setOnayBekleyenOgrenciler(await getOnayBekleyenOgrenciler(teacher.id));
      
      const files = (await getDersIcerikleri()).filter(f => f.ogretmenId === teacher.id);
      setSharedFiles(files);
      
      const tests = (await getAtananTestler()).filter(t => t.ogretmenId === teacher.id);
      setAssignedTests(tests);

      setBildirimler(await getOgretmenBildirimleri(teacher.id));

      // Fetch student results and convert them to report objects
      const allResultsRaw = localStorage.getItem('fizik_test_sonuclari');
      const allResults = allResultsRaw ? JSON.parse(allResultsRaw) : [];
      const teacherStudentResults = allResults.filter((r: any) => 
        approved.some((std: any) => std.id === r.ogrenciId)
      ).map((r: any) => {
        const student = approved.find((std: any) => std.id === r.ogrenciId);
        return {
          name: `${student?.ad} ${student?.soyad}`,
          class: student?.sinif || 9,
          topic: r.konuBaslik,
          score: r.puan,
          date: r.tarih,
          correct: r.dogru,
          incorrect: r.yanlis
        };
      });
      setRealReports(teacherStudentResults);

      // Generate dynamic classes status
      const dynamicClasses = [9, 10, 11, 12, 13].map((gradeNum) => {
        const studentsInGrade = approved.filter((s: any) => s.sinif === gradeNum);
        const studentCount = studentsInGrade.length;
        
        const gradeResults = teacherStudentResults.filter((r: any) => r.class === gradeNum);
        const avgSuccess = gradeResults.length > 0
          ? Math.round(gradeResults.reduce((sum: number, r: any) => sum + r.score, 0) / gradeResults.length)
          : 0;
          
        const topicScores: Record<string, { sum: number; count: number }> = {};
        gradeResults.forEach((r: any) => {
          if (!topicScores[r.topic]) topicScores[r.topic] = { sum: 0, count: 0 };
          topicScores[r.topic].sum += r.score;
          topicScores[r.topic].count += 1;
        });
        let hardestTopic = 'Yok';
        let minAvg = 101;
        Object.entries(topicScores).forEach(([topic, data]) => {
          const avg = data.sum / data.count;
          if (avg < minAvg) {
            minAvg = avg;
            hardestTopic = topic;
          }
        });
        if (hardestTopic === 'Yok') {
          hardestTopic = gradeNum === 9 ? 'Isı ve Sıcaklık' 
                       : gradeNum === 10 ? 'Optik' 
                       : gradeNum === 11 ? 'Elektrik ve Manyetizma' 
                       : gradeNum === 12 ? 'Modern Fizik' 
                       : 'Fizik Bilimine Giriş';
        }

        const codes = { 9: 'FY-9XYZ', 10: 'FY-2A3B', 11: 'FY-9C1D', 12: 'FY-7E4F', 13: 'FY-MZ13' };

        return {
          id: crypto.randomUUID(),
          name: gradeNum === 13 ? 'Mezun Fizik' : `${gradeNum}. Sınıf Fizik`,
          code: (codes as any)[gradeNum] || 'FY-XXXX',
          studentCount,
          avgSuccess,
          hardestTopic,
          created: '01 Eyl 2025'
        };
      });
      
      // Filter out empty classes for a newly registered teacher, but keep at least 9-12 classes listed to keep structure intact
      setClasses(dynamicClasses);

      // Compute topic difficulty levels
      const topicErrors: Record<string, { correct: number; total: number }> = {};
      teacherStudentResults.forEach((r: any) => {
        const key = r.topic;
        if (!topicErrors[key]) topicErrors[key] = { correct: 0, total: 0 };
        topicErrors[key].correct += r.correct;
        topicErrors[key].total += (r.correct + r.incorrect);
      });
      
      const difficultyData = Object.entries(topicErrors).map(([topic, stats]) => {
        const errorPct = stats.total > 0 ? Math.round(((stats.total - stats.correct) / stats.total) * 100) : 0;
        return { topic, hataPct: errorPct };
      });
      
      if (difficultyData.length === 0) {
        setTopicDifficulty([
          { topic: 'Kuvvet & Hareket', hataPct: 0 },
          { topic: 'Elektrik & Manyetizma', hataPct: 0 },
          { topic: 'Dalgalar', hataPct: 0 },
          { topic: 'Optik', hataPct: 0 },
          { topic: 'Modern Fizik', hataPct: 0 }
        ]);
      } else {
        setTopicDifficulty(difficultyData);
      }
    }
  }, [teacher]);

  useEffect(() => {
    const token = localStorage.getItem('fizik_token');
    const kullaniciData = localStorage.getItem('fizik_kullanici');
    if (!token || !kullaniciData) {
      router.push('/fizik-yildizi/giris');
      return;
    }
    const sessionUser = JSON.parse(kullaniciData);
    if (sessionUser.rol !== 'ogretmen') {
      router.push('/fizik-yildizi/ogrenci/dashboard');
      return;
    }

    const initializeAndSync = async () => {
      // Retrieve from Supabase
      const allUsers = await getKullanicilar();
      const k = allUsers.find((u: any) => u.id === sessionUser.id) || sessionUser;

      setTeacher(k);
      
      // Init settings form
      setSetAd(k.ad);
      setSetSoyad(k.soyad);
      setSetOkulAdi(k.okulAdi || '');
      setSetBrans(k.brans || 'Fizik');
      setSetProfilResmiVal(k.profilResmi || '');
    };

    initializeAndSync();
  }, [router]);

  useEffect(() => {
    loadData();
  }, [teacher, loadData]);

  const handleOnayla = (id: string) => {
    ogrenciOnayla(id);
    loadData();
    showToast('success', 'Öğrenci kaydı onaylandı.');
  };

  const handleReddet = (id: string) => {
    ogrenciReddet(id);
    loadData();
    showToast('error', 'Öğrenci kaydı reddedildi.');
  };

  const handleBildirimOnayla = (id: string) => {
    bildirimOnayla(id);
    loadData();
    showToast('success', 'Öğrenci kaydı onaylandı ve sınıfa eklendi.');
  };

  const handleBildirimReddet = (id: string) => {
    bildirimReddet(id);
    loadData();
    showToast('error', 'Öğrenci talebi reddedildi.');
  };

  const handleCikis = () => {
    localStorage.removeItem('fizik_token');
    localStorage.removeItem('fizik_kullanici');
    router.push('/fizik-yildizi');
  };

  // Content Sharing handler
  const handleShareContent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shareTitle.trim() || !shareFileName) {
      showToast('error', 'Lütfen başlık girin ve bir dosya seçin.');
      return;
    }
    const newIcerik = {
      id: crypto.randomUUID(),
      ogretmenId: teacher.id,
      ogretmenAdi: `${teacher.ad} ${teacher.soyad}`,
      sinif: shareClass,
      baslik: shareTitle.trim(),
      aciklama: shareDesc.trim(),
      dosyaAdi: shareFileName,
      dosyaIcerik: '', // Default empty file content
      dosyaBoyutu: shareFileSize || '1.5 MB',
      tarih: new Date().toISOString()
    };
    saveDersIcerigi(newIcerik);
    setShareTitle('');
    setShareDesc('');
    setShareFileName('');
    setShareFileSize('');
    loadData();
    showToast('success', 'Ders içeriği başarıyla paylaşıldı.');
  };

  // Test Assignment handler
  const handleAssignTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignDeadline) {
      showToast('error', 'Lütfen son teslim tarihi seçin.');
      return;
    }
    const selectedTopic = konular.find(k => k.id === assignTopicId);
    const yeniOdev: AtananTest = {
      id: crypto.randomUUID(),
      ogretmenId: teacher.id,
      sinif: assignClass,
      konuId: assignTopicId,
      konuBaslik: selectedTopic ? selectedTopic.baslik : 'Fizik Testi',
      aciklama: assignDesc.trim(),
      tarih: new Date().toISOString(),
      sonTarih: assignDeadline
    };
    saveAtananTest(yeniOdev);
    setAssignDesc('');
    setAssignDeadline('');
    setShowAssignModal(false);
    loadData();
    showToast('success', 'Yeni test başarıyla atandı.');
  };

  // Test deletion handler
  const handleCancelAssignment = (id: string) => {
    deleteAtananTest(id);
    loadData();
    showToast('error', 'Test ataması iptal edildi.');
  };

  // Content deletion handler
  const handleDeleteContent = (id: string) => {
    deleteDersIcerigi(id);
    loadData();
    showToast('error', 'Paylaşılan içerik silindi.');
  };

  // Settings Save handler
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!setAd.trim() || !setSoyad.trim() || !setOkulAdi.trim()) {
      showToast('error', 'Ad, soyad ve okul alanları zorunludur.');
      return;
    }
    
    // Check password if changing
    if (setYeniSifre.trim() && setSifre !== teacher.sifre) {
      showToast('error', 'Mevcut şifrenizi yanlış girdiniz.');
      return;
    }

    const updatedTeacher: Kullanici = {
      ...teacher,
      ad: setAd.trim(),
      soyad: setSoyad.trim(),
      okulAdi: setOkulAdi.trim(),
      brans: setBrans.trim(),
      sifre: setYeniSifre.trim() ? setYeniSifre.trim() : teacher.sifre,
      profilResmi: setProfilResmiVal
    };

    saveKullanici(updatedTeacher);
    localStorage.setItem('fizik_kullanici', JSON.stringify(updatedTeacher));
    setTeacher(updatedTeacher);
    setSetSifre('');
    setSetYeniSifre('');
    showToast('success', 'Ayarlarınız başarıyla kaydedildi.');
  };

  const handleSimulateReportDownload = () => {
    showToast('success', `${reportClassFilter === '13' ? 'Mezun' : `${reportClassFilter}. Sınıf`} başarı raporu PDF olarak hazırlanıyor...`);
    setTimeout(() => {
      showToast('success', 'PDF Raporu başarıyla indirildi!');
    }, 1500);
  };

  if (!teacher) {
    return (
      <div style={{ minHeight: '100vh', background: '#050a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 48, height: 48, border: '3px solid #7c3aed', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  // Calculate dynamic stats
  const totalStudents = onayliOgrenciler.length;

  // Filter students for the Öğrenciler tab
  const filteredStudents = onayliOgrenciler.filter(std => {
    const matchesSearch = `${std.ad} ${std.soyad}`.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (std.okulNo || '').includes(searchQuery);
    const matchesClass = classFilter === 'all' || String(std.sinif) === classFilter;
    return matchesSearch && matchesClass;
  });

  const filteredReports = realReports.filter(r => String(r.class) === reportClassFilter);

  // Render Sub-Views
  const renderDashboard = () => (
    <>
      {/* Stats */}
      <div style={s.statsGrid}>
        {[
          { icon: '👩‍🎓', value: totalStudents, label: 'Toplam Öğrenci', color: '#8b5cf6' },
          { icon: '🏫', value: CLASSES.length, label: 'Aktif Sınıf', color: '#06b6d4' },
          { icon: '📝', value: assignedTests.length, label: 'Atanan Testler', color: '#f59e0b' },
          { icon: '📁', value: sharedFiles.length, label: 'Paylaşılan Dosyalar', color: '#10b981' },
          { icon: '⚡', value: onayBekleyenOgrenciler.length, label: 'Onay Bekleyenler', color: '#ef4444' },
        ].map((stat) => (
          <div key={stat.label} style={s.statCard}>
            <div style={s.statIcon}>{stat.icon}</div>
            <div style={{ ...s.statValue, color: stat.color }}>{stat.value}</div>
            <div style={s.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Grid: Classes & Content Sharing */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.5rem', marginBottom: '2rem' }}>
        
        <div>
          {/* Sınıf Görünümü */}
          <div style={s.sectionTitle}>🏫 Sınıf Görünümü</div>
          <div style={s.classGrid}>
            {CLASSES.map((cls) => {
              const countInDb = onayliOgrenciler.filter(std => String(std.sinif) === cls.name.split('.')[0]).length;
              return (
                <div key={cls.id} style={s.classCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem' }}>{cls.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.15rem' }}>
                        Katılım Kodu: <span style={{ color: '#a78bfa', fontWeight: 700, fontFamily: 'monospace' }}>{cls.code}</span>
                      </div>
                    </div>
                    <span style={{
                      padding: '0.25rem 0.6rem', borderRadius: '20px',
                      background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.3)',
                      color: '#67e8f9', fontSize: '0.75rem', fontWeight: 700
                    }}>{countInDb > 0 ? countInDb : cls.studentCount} Öğrenci</span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.25rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Ortalama Başarı</span>
                    <span style={{ fontWeight: 700, color: cls.avgSuccess >= 75 ? '#10b981' : cls.avgSuccess >= 60 ? '#f59e0b' : '#ef4444' }}>
                      %{cls.avgSuccess}
                    </span>
                  </div>
                  <div style={s.progressBar}>
                    <div style={{ ...s.progressFill, width: `${cls.avgSuccess}%` }} />
                  </div>

                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1rem' }}>
                    ⚠️ En Zor Konu: <span style={{ color: '#fcd34d' }}>{cls.hardestTopic}</span>
                  </div>

                  <button 
                    onClick={() => {
                      setReportClassFilter(cls.name.split('.')[0]);
                      setActiveNav('raporlar');
                    }}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                      padding: '0.5rem 1rem', borderRadius: '8px',
                      background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)',
                      color: '#a78bfa', fontSize: '0.8rem', fontWeight: 600, borderStyle: 'solid',
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                  >
                    Detaylı Rapor →
                  </button>
                </div>
              );
            })}
          </div>

          {/* Topic Difficulty Chart */}
          <div style={s.sectionTitle}>静态 Gelişim & Zorluk Grafiği</div>
          <div style={s.chartWrap}>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '1rem' }}>Müfredattaki en çok güçlük çekilen konuların dağılımı (%)</p>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={topicDifficulty} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="topic" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} unit="%" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="hataPct" radius={[6, 6, 0, 0]}>
                  {topicDifficulty.map((_, i) => (
                    <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Content Sharing Column */}
        <div>
          <div style={s.sectionTitle}>📁 Ders İçeriği Paylaşımı</div>
          <div style={s.statCard}>
            <form onSubmit={handleShareContent}>
              <div style={s.formGroup}>
                <label style={s.label}>Sınıf Seçin</label>
                <select 
                  style={s.inputField}
                  value={shareClass} 
                  onChange={(e) => setShareClass(Number(e.target.value))}
                >
                  <option value={9}>9. Sınıf</option>
                  <option value={10}>10. Sınıf</option>
                  <option value={11}>11. Sınıf</option>
                  <option value={12}>12. Sınıf</option>
                  <option value={13}>Mezun</option>
                </select>
              </div>

              <div style={s.formGroup}>
                <label style={s.label}>Başlık</label>
                <input 
                  type="text" 
                  style={s.inputField}
                  placeholder="Örn: Newton Yasaları Ders Notu"
                  value={shareTitle}
                  onChange={(e) => setShareTitle(e.target.value)}
                />
              </div>

              <div style={s.formGroup}>
                <label style={s.label}>Açıklama (Ödev/Not detayı)</label>
                <textarea 
                  style={{ ...s.inputField, height: '70px', resize: 'none' }}
                  placeholder="Öğrencileriniz için kısa bir not yazın..."
                  value={shareDesc}
                  onChange={(e) => setShareDesc(e.target.value)}
                />
              </div>

              <div style={s.formGroup}>
                <label style={s.label}>Dosya Seç</label>
                <input 
                  type="file" 
                  id="teacher-file-upload-main" 
                  style={{ display: 'none' }} 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setShareFileName(file.name);
                      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
                      setShareFileSize(`${sizeMB} MB`);
                    }
                  }}
                />
                <div 
                  style={s.uploadArea}
                  onClick={() => document.getElementById('teacher-file-upload-main')?.click()}
                >
                  <span style={{ fontSize: '1.5rem' }}>📁</span>
                  <div style={{ fontWeight: 600, fontSize: '0.8rem', marginTop: '0.35rem' }}>
                    {shareFileName ? shareFileName : 'Dosya Seç'}
                  </div>
                  {shareFileSize && <div style={{ fontSize: '0.7rem', color: '#06b6d4' }}>{shareFileSize}</div>}
                </div>
              </div>

              <button type="submit" style={{ ...s.btnPrimary, width: '100%', justifyContent: 'center' }}>
                🚀 İçeriği Gönder
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* Onay Bekleyen Öğrenciler (Show if any) */}
      {onayBekleyenOgrenciler.length > 0 && (
        <>
          <div style={s.sectionTitle}>⌛ Onay Bekleyen Öğrenciler</div>
          <div style={{ ...s.chartWrap, padding: 0, overflow: 'hidden', marginBottom: '2rem', border: '1px solid rgba(245,158,11,0.3)' }}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Öğrenci Adı</th>
                  <th style={s.th}>Sınıf</th>
                  <th style={s.th}>Okul No</th>
                  <th style={{ ...s.th, textAlign: 'right' }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {onayBekleyenOgrenciler.map((student) => (
                  <tr key={student.id}>
                    <td style={{ ...s.td, color: '#f8fafc', fontWeight: 600 }}>{student.ad} {student.soyad}</td>
                    <td style={s.td}>{student.sinif === 13 ? 'Mezun' : `${student.sinif}. Sınıf`}</td>
                    <td style={s.td}>{student.okulNo || '—'}</td>
                    <td style={{ ...s.td, textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleOnayla(student.id)}
                          style={{
                            padding: '0.4rem 0.8rem', borderRadius: '6px', border: 'none',
                            background: '#10b981', color: 'white', fontWeight: 700,
                            fontSize: '0.75rem', cursor: 'pointer'
                          }}
                        >
                          ✓ Onayla
                        </button>
                        <button
                          onClick={() => handleReddet(student.id)}
                          style={{
                            padding: '0.4rem 0.8rem', borderRadius: '6px', border: 'none',
                            background: '#ef4444', color: 'white', fontWeight: 700,
                            fontSize: '0.75rem', cursor: 'pointer'
                          }}
                        >
                          ✗ Reddet
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Shared Files & Assigned Tests Tables (Dashboard view) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Atanan Testler Listesi */}
        <div style={s.chartWrap}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>📋 Aktif Test Atamaları</h3>
            <button onClick={() => setShowAssignModal(true)} style={{ ...s.btnPrimary, padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>
              + Test Ata
            </button>
          </div>
          {assignedTests.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
              Henüz atanmış bir test bulunmuyor.
            </div>
          ) : (
            <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
              {assignedTests.map(t => (
                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', marginBottom: '0.5rem' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{t.konuBaslik}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.15rem' }}>
                      Sınıf: {t.sinif === 13 ? 'Mezun' : `${t.sinif}. Sınıf`} • Son Tarih: {new Date(t.sonTarih).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleCancelAssignment(t.id)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem' }}
                    title="Atamayı İptal Et"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Gönderilen İçerikler Listesi */}
        <div style={s.chartWrap}>
          <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem' }}>📂 Paylaşılan Dosyalar</h3>
          {sharedFiles.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
              Henüz paylaşılan bir dosya bulunmuyor.
            </div>
          ) : (
            <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
              {sharedFiles.map(f => (
                <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', marginBottom: '0.5rem' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{f.baslik}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.15rem' }}>
                      Sınıf: {f.sinif === 13 ? 'Mezun' : `${f.sinif}. Sınıf`} • Dosya: <span style={{ color: '#06b6d4' }}>{f.dosyaAdi}</span> ({f.dosyaBoyutu})
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteContent(f.id)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem' }}
                    title="İçeriği Sil"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </>
  );

  // Render Öğrenciler tab
  const renderOgrenciler = () => (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={s.sectionTitle}>👩‍🎓 Öğrenci Yönetimi</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            type="text" 
            placeholder="İsim veya Okul No Ara..."
            style={{ ...s.inputField, width: '200px', padding: '0.5rem 0.75rem' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select 
            style={{ ...s.inputField, width: '130px', padding: '0.5rem 0.75rem' }}
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
          >
            <option value="all">Tüm Sınıflar</option>
            <option value="9">9. Sınıf</option>
            <option value="10">10. Sınıf</option>
            <option value="11">11. Sınıf</option>
            <option value="12">12. Sınıf</option>
            <option value="13">Mezun</option>
          </select>
        </div>
      </div>

      {/* Onay Bekleyenler (If any) */}
      {onayBekleyenOgrenciler.length > 0 && (
        <div style={s.chartWrap}>
          <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem', color: '#f59e0b' }}>⌛ Onay Bekleyen Öğrenciler</h3>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Öğrenci Adı</th>
                <th style={s.th}>Sınıf</th>
                <th style={s.th}>Okul Numarası</th>
                <th style={s.th}>E-posta</th>
                <th style={{ ...s.th, textAlign: 'right' }}>Onay</th>
              </tr>
            </thead>
            <tbody>
              {onayBekleyenOgrenciler.map((student) => (
                <tr key={student.id}>
                  <td style={{ ...s.td, fontWeight: 600 }}>{student.ad} {student.soyad}</td>
                  <td style={s.td}>{student.sinif === 13 ? 'Mezun' : `${student.sinif}. Sınıf`}</td>
                  <td style={s.td}>{student.okulNo || '—'}</td>
                  <td style={s.td}>{student.email}</td>
                  <td style={{ ...s.td, textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <button onClick={() => handleOnayla(student.id)} style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', background: '#10b981', border: 'none', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Onayla</button>
                      <button onClick={() => handleReddet(student.id)} style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', background: '#ef4444', border: 'none', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Reddet</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Approved Students List */}
      <div style={s.chartWrap}>
        <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem' }}>🏆 Kayıtlı Öğrenciler ({filteredStudents.length})</h3>
        {filteredStudents.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            Arama kriterlerine uygun onaylı öğrenci bulunamadı.
          </div>
        ) : (
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Sıra</th>
                <th style={s.th}>Öğrenci Adı</th>
                <th style={s.th}>Sınıf</th>
                <th style={s.th}>Okul Numarası</th>
                <th style={s.th}>Kayıt Tarihi</th>
                <th style={{ ...s.th, textAlign: 'right' }}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, i) => (
                <tr key={student.id}>
                  <td style={s.td}><span style={rankStyle(i)}>{i + 1}</span></td>
                  <td style={{ ...s.td, fontWeight: 600, color: '#f8fafc' }}>{student.ad} {student.soyad}</td>
                  <td style={s.td}>{student.sinif === 13 ? 'Mezun' : `${student.sinif}. Sınıf`}</td>
                  <td style={s.td}>{student.okulNo || '—'}</td>
                  <td style={s.td}>{student.kayitTarihi ? new Date(student.kayitTarihi).toLocaleDateString('tr-TR') : '—'}</td>
                  <td style={{ ...s.td, textAlign: 'right' }}>
                    <button 
                      onClick={() => handleReddet(student.id)} 
                      style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Sistemden Çıkar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );

  // Render Raporlar tab
  const renderRaporlar = () => (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={s.sectionTitle}>📊 Başarı Raporları</h2>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Sınıf Raporu:</span>
          <select 
            style={{ ...s.inputField, width: '130px', padding: '0.5rem 0.75rem' }}
            value={reportClassFilter}
            onChange={(e) => setReportClassFilter(e.target.value)}
          >
            <option value="9">9. Sınıf</option>
            <option value="10">10. Sınıf</option>
            <option value="11">11. Sınıf</option>
            <option value="12">12. Sınıf</option>
            <option value="13">Mezun</option>
          </select>
          <button onClick={handleSimulateReportDownload} style={s.btnPrimary}>
            📥 PDF Rapor İndir
          </button>
        </div>
      </div>

      {/* Reports stats overview */}
      <div style={s.statsGrid}>
        {[
          { label: 'Sınıf Başarı Oranı', value: reportClassFilter === '12' ? '82%' : reportClassFilter === '11' ? '68%' : '74%', color: '#10b981' },
          { label: 'Çözülen Toplam Test', value: reportClassFilter === '12' ? '146' : '92', color: '#06b6d4' },
          { label: 'Kritik Konu', value: reportClassFilter === '12' ? 'Modern Fizik' : 'Elektrik', color: '#ef4444' },
        ].map((stat, i) => (
          <div key={i} style={s.statCard}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>{stat.label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: stat.color, marginTop: '0.5rem' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Solved tests list for this class */}
      <div style={s.chartWrap}>
        <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem' }}>📋 Son Çözülen Test Sonuçları ({reportClassFilter === '13' ? 'Mezun' : `${reportClassFilter}. Sınıf`})</h3>
        {filteredReports.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
            Bu sınıfta henüz test çözen öğrenci bulunmuyor.
          </div>
        ) : (
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Öğrenci</th>
                <th style={s.th}>Konu</th>
                <th style={s.th}>Tarih</th>
                <th style={s.th}>Doğru/Yanlış</th>
                <th style={s.th}>Puan / Başarı</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((r, i) => (
                <tr key={i}>
                  <td style={{ ...s.td, fontWeight: 600 }}>{r.name}</td>
                  <td style={s.td}>{r.topic}</td>
                  <td style={s.td}>{new Date(r.date).toLocaleDateString('tr-TR')}</td>
                  <td style={s.td}>
                    <span style={{ color: '#10b981' }}>{r.correct}✓</span> / <span style={{ color: '#ef4444' }}>{r.incorrect}✗</span>
                  </td>
                  <td style={s.td}>
                    <span style={r.score >= 80 ? s.successBadge : r.score >= 60 ? s.warningBadge : s.dangerBadge}>
                      %{r.score}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );

  // Render Ayarlar tab
  const renderAyarlar = () => (
    <>
      <h2 style={s.sectionTitle}>⚙️ Hesap Ayarları</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        
        {/* Profile Info Form */}
        <div style={s.chartWrap}>
          <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.5rem', color: '#a78bfa' }}>Profil Bilgilerini Güncelle</h3>
          <form onSubmit={handleSaveSettings}>
            
            {/* Teacher Profile Image Upload UI */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
              <div style={{ position: 'relative' }}>
                {setProfilResmiVal ? (
                  <img src={setProfilResmiVal} alt="Profil Önizleme" style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', border: '3px solid #7c3aed', boxShadow: '0 0 15px rgba(124,58,237,0.3)' }} />
                ) : (
                  <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 800, color: 'white', border: '3px solid #7c3aed', boxShadow: '0 0 15px rgba(124,58,237,0.3)' }}>
                    {teacher.ad[0]}{teacher.soyad[0]}
                  </div>
                )}
                <label htmlFor="teacher-profil-resmi-upload" style={{ position: 'absolute', bottom: 0, right: 0, background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid #050a1a', fontSize: '0.8rem' }} title="Profil Resmi Yükle">
                  📷
                </label>
                <input 
                  type="file" 
                  id="teacher-profil-resmi-upload" 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 2 * 1024 * 1024) {
                        showToast('error', 'Profil resmi boyutu 2MB\'tan küçük olmalıdır.');
                        return;
                      }
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setSetProfilResmiVal(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
              {setProfilResmiVal && (
                <button 
                  type="button" 
                  onClick={() => setSetProfilResmiVal('')}
                  style={{ background: 'none', border: 'none', color: '#fca5a5', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Resmi Kaldır
                </button>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={s.label}>Ad</label>
                <input 
                  type="text" 
                  style={s.inputField} 
                  value={setAd} 
                  onChange={(e) => setSetAd(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={s.label}>Soyad</label>
                <input 
                  type="text" 
                  style={s.inputField} 
                  value={setSoyad} 
                  onChange={(e) => setSetSoyad(e.target.value)}
                />
              </div>
            </div>

            <div style={{ ...s.formGroup, marginBottom: '1rem' }}>
              <label style={s.label}>Okul Adı</label>
              <input 
                type="text" 
                style={s.inputField} 
                value={setOkulAdi} 
                onChange={(e) => setSetOkulAdi(e.target.value)}
              />
            </div>

            <div style={{ ...s.formGroup, marginBottom: '1rem' }}>
              <label style={s.label}>Branş</label>
              <input 
                type="text" 
                style={s.inputField} 
                value={setBrans} 
                onChange={(e) => setSetBrans(e.target.value)}
              />
            </div>

            <div style={{ ...s.formGroup, marginBottom: '1.5rem' }}>
              <label style={s.label}>E-posta (Değiştirilemez)</label>
              <input 
                type="email" 
                style={{ ...s.inputField, opacity: 0.6, cursor: 'not-allowed' }} 
                value={teacher.email}
                disabled
              />
            </div>

            <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '1.5rem', marginBottom: '1rem', color: '#a78bfa' }}>Şifre Değiştir</h3>
            
            <div style={{ ...s.formGroup, marginBottom: '1rem' }}>
              <label style={s.label}>Mevcut Şifre</label>
              <input 
                type="password" 
                style={s.inputField} 
                placeholder="Şifreyi değiştirmek için girin"
                value={setSifre} 
                onChange={(e) => setSetSifre(e.target.value)}
              />
            </div>

            <div style={{ ...s.formGroup, marginBottom: '1.5rem' }}>
              <label style={s.label}>Yeni Şifre</label>
              <input 
                type="password" 
                style={s.inputField} 
                placeholder="Yeni şifreniz"
                value={setYeniSifre} 
                onChange={(e) => setSetYeniSifre(e.target.value)}
              />
            </div>

            <button type="submit" style={{ ...s.btnPrimary, width: '100%', justifyContent: 'center' }}>
              💾 Ayarları Kaydet
            </button>
          </form>
        </div>

        {/* Info card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={s.statCard}>
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem' }}>🏫 Zonguldak Fen Lisesi Fizik Zümresi</h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              Bu panel üzerinden Zonguldak Fen Lisesi öğrencilerinin performanslarını takip edebilir, müfredata uygun testler atayabilir ve interaktif çalışma föyleri gönderebilirsiniz.
            </p>
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Kayıtlı öğrencileriniz profil ayarlarından sizi seçtiğinde onay ekranınıza düşer. Onayladıktan sonra başarı analizleri anlık olarak ekranınıza yansıyacaktır.
            </p>
          </div>
          
          <div style={s.statCard}>
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem', color: '#06b6d4' }}>🔑 Öğrenci Sınıf Kodları</h3>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div>• 10. Sınıf Kodu: <strong style={{ color: '#f8fafc', fontFamily: 'monospace' }}>FY-2A3B</strong></div>
              <div>• 11. Sınıf Kodu: <strong style={{ color: '#f8fafc', fontFamily: 'monospace' }}>FY-9C1D</strong></div>
              <div>• 12. Sınıf Kodu: <strong style={{ color: '#f8fafc', fontFamily: 'monospace' }}>FY-7E4F</strong></div>
            </div>
          </div>
        </div>

      </div>
    </>
  );

  return (
    <div style={s.page}>
      
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

      {/* ── Sidebar ── */}
      <aside style={s.sidebar}>
        <div style={s.avatarWrap}>
          {teacher.profilResmi ? (
            <img src={teacher.profilResmi} alt="Profil Resmi" style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 0 20px rgba(124,58,237,0.4)', border: '2px solid #7c3aed' }} />
          ) : (
            <div style={s.avatar}>{teacher.ad[0]}{teacher.soyad[0]}</div>
          )}
          <div style={s.teacherName}>{teacher.ad} {teacher.soyad}</div>
          <div style={s.schoolName}>{teacher.okulAdi}</div>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.6rem',
            borderRadius: '20px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
            color: '#6ee7b7', fontSize: '0.7rem', fontWeight: 700
          }}>✓ Öğretmen</span>
        </div>

        {NAV_ITEMS.map((item) => {
          const isActive = activeNav === (item.view || '');
          return (
            <Link
              key={item.label}
              href={item.href}
              style={{
                ...s.navItem,
                ...(isActive ? s.navItemActive : {}),
              }}
              onClick={(e) => {
                if (item.href === '#') {
                  e.preventDefault();
                  if (item.view) {
                    setActiveNav(item.view);
                  }
                }
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div style={s.sidebarBottom}>
          <Link href="/fizik-yildizi/simulasyonlar" style={{ ...s.navItem }}>
            <span>🧪</span><span>Simülasyon Lab</span>
          </Link>
          <Link href="/fizik-yildizi/soru-bankasi" style={{ ...s.navItem }}>
            <span>📚</span><span>Soru Bankası</span>
          </Link>
          <button onClick={handleCikis} style={{ ...s.navItem, background: 'none', border: 'none', width: '100%', color: '#ef4444', textAlign: 'left' }}>
            <span>🚪</span><span>Çıkış</span>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={s.main}>
        {/* Header */}
        <div style={s.header}>
          <div>
            <h1 style={s.headerTitle}>
              Hoş Geldiniz,{' '}
              <span style={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {teacher.ad} Öğretmen!
              </span>
            </h1>
            <div style={s.headerDate}>📅 {todayTR()}</div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => setShowBildirimModal(true)} 
              style={{
                ...s.btnSecondary,
                position: 'relative',
              }}
            >
              🔔 Bildirimler
              {bildirimler.filter(b => b.onayDurumu === 'bekliyor').length > 0 && (
                <span style={{
                  position: 'absolute', top: '-6px', right: '-6px',
                  background: '#ef4444', color: 'white', fontSize: '0.7rem',
                  fontWeight: 800, padding: '0.15rem 0.4rem', borderRadius: '10px',
                  boxShadow: '0 0 8px rgba(239,68,68,0.6)', border: '2px solid #050a1a'
                }}>
                  {bildirimler.filter(b => b.onayDurumu === 'bekliyor').length}
                </span>
              )}
            </button>
            <button onClick={() => setShowAssignModal(true)} style={s.btnPrimary}>+ Yeni Test Ata</button>
          </div>
        </div>

        {/* Render Active View */}
        {activeNav === 'dashboard' && renderDashboard()}
        {activeNav === 'ogrenciler' && renderOgrenciler()}
        {activeNav === 'raporlar' && renderRaporlar()}
        {activeNav === 'ayarlar' && renderAyarlar()}
      </main>

      {/* ── Test Assignment Modal ── */}
      {showAssignModal && (
        <div style={s.modal} onClick={() => setShowAssignModal(false)}>
          <div style={s.modalBox} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '1.25rem', color: '#a78bfa' }}>📝 Yeni Test Ataması</h2>
            <form onSubmit={handleAssignTest}>
              <div style={s.formGroup}>
                <label style={s.label}>Sınıf / Sene</label>
                <select 
                  style={s.inputField}
                  value={assignClass}
                  onChange={(e) => setAssignClass(Number(e.target.value))}
                >
                  <option value={9}>9. Sınıf</option>
                  <option value={10}>10. Sınıf</option>
                  <option value={11}>11. Sınıf</option>
                  <option value={12}>12. Sınıf</option>
                  <option value={13}>Mezun</option>
                </select>
              </div>

              <div style={s.formGroup}>
                <label style={s.label}>Konu Seçin</label>
                <select 
                  style={s.inputField}
                  value={assignTopicId}
                  onChange={(e) => setAssignTopicId(e.target.value)}
                >
                  {konular.map(k => (
                    <option key={k.id} value={k.id}>[{k.sinif}. Sınıf] {k.baslik}</option>
                  ))}
                </select>
              </div>

              <div style={s.formGroup}>
                <label style={s.label}>Son Teslim Tarihi</label>
                <input 
                  type="date" 
                  style={s.inputField}
                  value={assignDeadline}
                  onChange={(e) => setAssignDeadline(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div style={s.formGroup}>
                <label style={s.label}>Açıklama / Notlar (Opsiyonel)</label>
                <textarea 
                  style={{ ...s.inputField, height: '70px', resize: 'none' }}
                  placeholder="Öğrencileriniz için ekstra yönerge..."
                  value={assignDesc}
                  onChange={(e) => setAssignDesc(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="submit" style={{ ...s.btnPrimary, flex: 1, justifyContent: 'center' }}>Testi Tanımla</button>
                <button type="button" onClick={() => setShowAssignModal(false)} style={{ ...s.btnSecondary, flex: 1, justifyContent: 'center' }}>İptal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Notifications Modal ── */}
      {showBildirimModal && (
        <div style={s.modal} onClick={() => setShowBildirimModal(false)}>
          <div style={{ ...s.modalBox, width: '550px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.25rem', color: '#a78bfa', margin: 0 }}>🔔 Öğrenci Kayıt Bildirimleri</h2>
              <button 
                onClick={() => setShowBildirimModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.25rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '0.25rem' }}>
              {bildirimler.length === 0 ? (
                <div style={{ padding: '2rem 0', textAlign: 'center', color: '#64748b' }}>
                  Henüz bir bildirim bulunmuyor.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {bildirimler.slice().reverse().map((b) => (
                    <div 
                      key={b.id} 
                      style={{ 
                        padding: '1rem', 
                        background: 'rgba(255,255,255,0.03)', 
                        border: `1px solid ${b.onayDurumu === 'bekliyor' ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.06)'}`, 
                        borderRadius: '12px' 
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f8fafc' }}>
                          {b.ogrenciAd} {b.ogrenciSoyad}
                        </div>
                        {b.onayDurumu === 'bekliyor' ? (
                          <span style={s.warningBadge}>Onay Bekliyor</span>
                        ) : b.onayDurumu === 'onaylandi' ? (
                          <span style={s.successBadge}>Onaylandı</span>
                        ) : (
                          <span style={s.dangerBadge}>Reddedildi</span>
                        )}
                      </div>
                      
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '0.75rem' }}>
                        <div><strong>Sınıf:</strong> {b.ogrenciSinif === 13 ? 'Mezun' : `${b.ogrenciSinif}. Sınıf`}</div>
                        <div><strong>Okul No:</strong> {b.ogrenciNo || '—'}</div>
                        <div><strong>Okul:</strong> {b.okulIsmi || '—'}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.15rem' }}>
                          Tarih: {new Date(b.tarih).toLocaleString('tr-TR')}
                        </div>
                      </div>
                      
                      {b.onayDurumu === 'bekliyor' && (
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleBildirimReddet(b.id)}
                            style={{
                              padding: '0.4rem 0.8rem', borderRadius: '6px', border: 'none',
                              background: '#ef4444', color: 'white', fontWeight: 700,
                              fontSize: '0.75rem', cursor: 'pointer'
                            }}
                          >
                            ✗ Reddet
                          </button>
                          <button
                            onClick={() => handleBildirimOnayla(b.id)}
                            style={{
                              padding: '0.4rem 0.8rem', borderRadius: '6px', border: 'none',
                              background: '#10b981', color: 'white', fontWeight: 700,
                              fontSize: '0.75rem', cursor: 'pointer'
                            }}
                          >
                            ✓ Onayla
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

