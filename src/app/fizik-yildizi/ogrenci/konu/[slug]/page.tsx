'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getKonuById, Konu, AltKonu } from '@/data/fizik-yildizi/konular';
import FizikNavbar from '@/components/fizik-yildizi/FizikNavbar';

// Lazy load simulations
import SerbrestDusme from '@/components/fizik-yildizi/simulations/SerbrestDusme';
import AtisHareketi from '@/components/fizik-yildizi/simulations/AtisHareketi';
import DalgaHareketi from '@/components/fizik-yildizi/simulations/DalgaHareketi';
import ElektrikDevresi from '@/components/fizik-yildizi/simulations/ElektrikDevresi';
import OptikMercek from '@/components/fizik-yildizi/simulations/OptikMercek';

type Tab = 'anlatim' | 'simulasyon' | 'notlar';

export default function KonuDetayPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  
  const [konu, setKonu] = useState<Konu | null>(null);
  const [aktifTab, setAktifTab] = useState<Tab>('anlatim');
  const [okumaIlerlemesi, setOkumaIlerlemesi] = useState(0);
  const [not, setNot] = useState('');
  const [kullanici, setKullanici] = useState<any>(null);
  const [tamamlandi, setTamamlandi] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('fizik_token');
    const kullaniciData = localStorage.getItem('fizik_kullanici');
    if (!token || !kullaniciData) {
      router.push('/fizik-yildizi/giris');
      return;
    }
    setKullanici(JSON.parse(kullaniciData));

    const kData = getKonuById(slug);
    if (!kData) {
      router.push('/fizik-yildizi/ogrenci/konular');
      return;
    }
    setKonu(kData);

    // Load saved notes
    const savedNotes = localStorage.getItem(`fizik_not_${slug}`) || '';
    setNot(savedNotes);

    // Check completion status
    const status = localStorage.getItem(`fizik_konu_${slug}`) === '100';
    setTamamlandi(status);
  }, [slug, router]);

  // Track scroll position for reading progress
  useEffect(() => {
    if (aktifTab !== 'anlatim') return;
    
    const handleScroll = () => {
      const el = contentRef.current;
      if (!el) return;
      
      const rect = el.getBoundingClientRect();
      const elementHeight = el.scrollHeight;
      const windowHeight = window.innerHeight;
      
      // Calculate percentage read based on viewport position
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      const elementTop = el.offsetTop;
      const totalScrollable = elementHeight - windowHeight;
      
      if (totalScrollable <= 0) {
        setOkumaIlerlemesi(100);
        return;
      }
      
      const relativeScroll = scrollPosition - elementTop + windowHeight;
      const percentage = Math.min(100, Math.max(0, Math.round((relativeScroll / elementHeight) * 100)));
      setOkumaIlerlemesi(percentage);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    // Trigger once initially
    setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [aktifTab]);

  const notuKaydet = (text: string) => {
    setNot(text);
    localStorage.setItem(`fizik_not_${slug}`, text);
  };

  const konuyuTamamla = () => {
    setTamamlandi(true);
    localStorage.setItem(`fizik_konu_${slug}`, '100');
    
    // Increment completed topics counter
    const currentCompleted = parseInt(localStorage.getItem('fizik_tamamlanan_konu') || '0');
    if (!tamamlandi) {
      localStorage.setItem('fizik_tamamlanan_konu', (currentCompleted + 1).toString());
    }
  };

  if (!konu || !kullanici) return null;

  // Render proper simulation based on topic type
  const renderSimulation = () => {
    // Determine simulation type by looking at altKonular
    const simType = konu.altKonular.find(ak => ak.simulasyonTipi && ak.simulasyonTipi !== 'none')?.simulasyonTipi;
    
    switch (simType) {
      case 'serbest-dusme':
        return <SerbrestDusme />;
      case 'atis-hareketi':
        return <AtisHareketi />;
      case 'dalga':
        return <DalgaHareketi />;
      case 'elektrik':
        return <ElektrikDevresi />;
      case 'optik':
        return <OptikMercek />;
      default:
        return (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(255,255,255,0.02)', border: '1.5px dashed rgba(255,255,255,0.1)', borderRadius: '20px' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🧪</span>
            <h3 style={{ color: '#f8fafc', fontWeight: 700 }}>Simülasyon Geliştiriliyor</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem', maxWidth: '400px', margin: '0.5rem auto 0' }}>
              Bu konu için tasarlanan özel interaktif simülasyon şu an yapım aşamasındadır. En kısa sürede eklenecektir!
            </p>
          </div>
        );
    }
  };

  // Generate mock lesson text
  const renderLessonContent = () => {
    switch (konu.id) {
      case 'fizik-bilimi-9':
        return (
          <>
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.75rem' }}>1. Fizik Biliminin Doğası ve Alt Dalları</h2>
              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                Fizik, uzay, zaman, madde ve enerji arasındaki ilişkileri inceleyen, gözlem ve deneye dayalı temel bir bilim dalıdır. Fiziğin incelediği konular mikroskobik parçacıklardan (kuarklar, atomlar) makroskobik sistemlere (galaksiler, evren) kadar geniş bir yelpazeyi kapsar. Bu geniş çalışma alanını daha düzenli inceleyebilmek için fizik bilimini <strong>8 alt dala</strong> ayırırız:
              </p>
              
              <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', padding: '1.25rem', borderRadius: '12px', margin: '1.5rem 0' }}>
                <h4 style={{ fontWeight: 700, color: '#a78bfa', marginBottom: '0.75rem' }}>🔍 Fiziğin Alt Dalları (KAMYONET Kısaltması):</h4>
                <ul style={{ listStyleType: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
                  <li>• <strong>K</strong>atıhal Fiziği: Kristal yapılı maddeleri, süperiletkenleri ve yarı iletkenleri (nanoteknoloji, mikroçipler) inceler.</li>
                  <li>• <strong>A</strong>tom Fiziği: Atomun yapısını, elektron dizilimlerini, atomlar arası etkileşimleri ve nanoteknolojiyi inceler.</li>
                  <li>• <strong>M</strong>ekanik: Kuvvet, hareket ve denge ilişkisini inceler. Statik, dinamik ve kinematik olmak üzere üçe ayrılır.</li>
                  <li>• <strong>Y</strong>üksek Enerji ve Plazma Fiziği: Atom altı parçacıkları, bu parçacıkların yüksek enerjili etkileşimlerini ve maddenin 4. hali olan plazmayı inceler.</li>
                  <li>• <strong>O</strong>ptik: Işık olaylarını, yansıma, kırılma, girişim ve mercekleri inceler.</li>
                  <li>• <strong>N</strong>ükleer Fizik (Çekirdek Fiziği): Atom çekirdeğini, kararsız çekirdeklerin radyoaktif ışımalarını, fisyon ve füzyon reaksiyonlarını inceler.</li>
                  <li>• <strong>E</strong>lektromanyetizma: Elektrik yüklerini, manyetik alanları, mıknatısları ve elektromanyetik dalgaları inceler.</li>
                  <li>• <strong>T</strong>ermodinamik: Isı enerjisini, sıcaklığı, ısıl dengeyi ve enerjinin maddeler arasındaki aktarımını inceler.</li>
                </ul>
              </div>

              <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderLeft: '4px solid #f59e0b', padding: '1rem', borderRadius: '12px', margin: '1.5rem 0' }}>
                <h4 style={{ fontWeight: 700, color: '#fbbf24', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                  ⚠️ YKS ODAKLI BİLGİ / TUZAK
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0, lineHeight: 1.6 }}>
                  Atom Fiziği atomun genel yapısını (elektronların davranışlarını vb.) incelerken; Nükleer Fizik doğrudan <strong>atom çekirdeğini</strong>, radyoaktiviteyi ve nükleer enerjiyi inceler. Sorularda çekirdek reaksiyonları (fisyon/füzyon) veya radyasyon görürseniz doğru cevap daima Nükleer Fizik olacaktır!
                </p>
              </div>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.75rem' }}>2. Fiziksel Büyüklüklerin Sınıflandırılması</h2>
              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                Fizikteki büyüklükler iki farklı kritere göre sınıflandırılır:
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1.5rem 0' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '1.25rem', borderRadius: '12px' }}>
                  <h4 style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>📏 Temel Büyüklükler (KISAMAL)</h4>
                  <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                    Kendinden başka bir büyüklük yardımıyla tanımlanamayan büyüklüklerdir:
                  </p>
                  <ul style={{ fontSize: '0.8rem', color: '#94a3b8', paddingLeft: '1rem', marginTop: '0.4rem' }}>
                    <li><strong>K</strong>ütle (Kilogram - kg)</li>
                    <li><strong>I</strong>şık Şiddeti (Candela - cd)</li>
                    <li><strong>S</strong>ıcaklık (Kelvin - K)</li>
                    <li><strong>A</strong>kım Şiddeti (Amper - A)</li>
                    <li><strong>M</strong>adde Miktarı (Mol - mol)</li>
                    <li><strong>U</strong>zunluk (Metre - m)</li>
                    <li><strong>Z</strong>aman (Saniye - s)</li>
                  </ul>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '1.25rem', borderRadius: '12px' }}>
                  <h4 style={{ fontWeight: 700, color: '#7c3aed', marginBottom: '0.5rem' }}>➡️ Vektörel Büyüklükler</h4>
                  <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                    Sayısal değer ve birimin yanında mutlaka <strong>yön ve doğrultu</strong> bilgisi gerektiren büyüklüklerdir:
                  </p>
                  <ul style={{ fontSize: '0.8rem', color: '#94a3b8', paddingLeft: '1rem', marginTop: '0.4rem' }}>
                    <li>Kuvvet (F), Hız (v), İvme (a)</li>
                    <li>Yer Değiştirme (Δx)</li>
                    <li>Ağırlık (G)</li>
                    <li>Elektrik Alan (E), Manyetik Alan (B)</li>
                  </ul>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', margin: '1.5rem 0', overflow: 'hidden' }}>
                <div style={{ background: 'rgba(124,58,237,0.15)', borderLeft: '4px solid #7c3aed', padding: '0.75rem 1rem', fontWeight: 700, color: '#a78bfa', fontSize: '0.9rem' }}>
                  📝 ÖRNEK SORU
                </div>
                <div style={{ padding: '1rem', color: '#cbd5e1', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  Aşağıdaki fiziksel büyüklüklerden hangisi hem <strong>temel</strong> hem de <strong>skaler</strong> bir büyüklüktür?
                  <br /><br />
                  A) Hız &nbsp;&nbsp;&nbsp;&nbsp; B) Kuvvet &nbsp;&nbsp;&nbsp;&nbsp; C) Sıcaklık &nbsp;&nbsp;&nbsp;&nbsp; D) İvme &nbsp;&nbsp;&nbsp;&nbsp; E) Ağırlık
                </div>
                <div style={{ background: 'rgba(16,185,129,0.05)', borderLeft: '4px solid #10b981', padding: '0.75rem 1rem', fontWeight: 700, color: '#34d399', fontSize: '0.9rem' }}>
                  💡 ÇÖZÜM
                </div>
                <div style={{ padding: '1rem', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Temel büyüklükler "KISAMAL" kısaltmasıyla kodlanır ve bu büyüklüklerin tamamı skalerdir. Seçeneklerdeki Sıcaklık (KISAMAL'ın S'si) temel ve skaler bir büyüklüktür. Hız, kuvvet, ivme ve ağırlık ise türetilmiş ve vektörel büyüklüklerdir.
                  <br />
                  <strong>Doğru Cevap: C</strong>
                </div>
              </div>
            </section>
          </>
        );
      case 'madde-ozellikleri-9':
        return (
          <>
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.75rem' }}>1. Özkütle (Yoğunluk) ve Karışımlar</h2>
              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                Özkütle, sabit sıcaklık ve basınçta bir maddenin birim hacminin kütlesidir. Maddeler için ayırt edici bir özelliktir. Kütle (m) ve Hacim (V) değerleri bilinen bir cismin özkütlesi (d) şu formülle hesaplanır:
              </p>
              
              <div style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.15)', borderLeft: '4px solid #06b6d4', padding: '1rem', borderRadius: '12px', margin: '1rem 0', fontFamily: 'monospace' }}>
                <div style={{ fontSize: '1.25rem', color: '#cbd5e1', fontWeight: 700 }}>
                  {"d = \\frac{m}{V}"}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontFamily: 'sans-serif', marginTop: '0.3rem' }}>
                  d: Özkütle (g/cm³), m: Kütle (g), V: Hacim (cm³)
                </div>
              </div>

              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                Birden fazla saf madde karıştırıldığında, oluşan homojen karışımın özkütlesi karıştırılan maddelerin özkütlelerinin arasında bir değer alır. Karışımın özkütlesi formülü:
                <br />
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#a78bfa' }}>{"d_{kar} = (m_1 + m_2) / (V_1 + V_2)"}</span>
              </p>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', margin: '1.5rem 0', overflow: 'hidden' }}>
                <div style={{ background: 'rgba(124,58,237,0.15)', borderLeft: '4px solid #7c3aed', padding: '0.75rem 1rem', fontWeight: 700, color: '#a78bfa', fontSize: '0.9rem' }}>
                  📝 ÖRNEK SORU
                </div>
                <div style={{ padding: '1rem', color: '#cbd5e1', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  Özkütlesi 1 g/cm³ olan su ile özkütlesi 3 g/cm³ olan sıvı homojen olarak karıştırılıyor. Oluşan karışımın özkütlesi aşağıdakilerden hangisi <strong>olamaz</strong>?
                  <br /><br />
                  A) 1.2 g/cm³ &nbsp;&nbsp;&nbsp;&nbsp; B) 1.5 g/cm³ &nbsp;&nbsp;&nbsp;&nbsp; C) 2.0 g/cm³ &nbsp;&nbsp;&nbsp;&nbsp; D) 2.8 g/cm³ &nbsp;&nbsp;&nbsp;&nbsp; E) 3.0 g/cm³
                </div>
                <div style={{ background: 'rgba(16,185,129,0.05)', borderLeft: '4px solid #10b981', padding: '0.75rem 1rem', fontWeight: 700, color: '#34d399', fontSize: '0.9rem' }}>
                  💡 ÇÖZÜM
                </div>
                <div style={{ padding: '1rem', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Karışımın özkütlesi, karıştırılan sıvıların özkütlelerinin sayısal değerleri arasında olmalıdır. Yani {"1 < d_{kar} < 3"} aralığında yer almalıdır. Sıvıların özkütlelerine (1 veya 3) eşit olamaz. Bu nedenle karışımın özkütlesi 3.0 g/cm³ olamaz.
                  <br />
                  <strong>Doğru Cevap: E</strong>
                </div>
              </div>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.75rem' }}>2. Dayanıklılık, Kohezyon, Adezyon ve Yüzey Gerilimi</h2>
              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                Katılarda dayanıklılık, cismin kendi ağırlığına karşı gösterdiği dirençtir. Geometrik olarak düzgün katı cisimlerde dayanıklılık cismin boyutuyla ters orantılıdır:
                <br />
                <span style={{ color: '#06b6d4', fontWeight: 700 }}>{"Dayanıklılık \\propto \\frac{Kesit\\ Alanı}{Hacim} \\propto \\frac{1}{h}"}</span>
              </p>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '1.25rem', borderRadius: '12px', margin: '1.5rem 0' }}>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingLeft: '1rem', color: '#cbd5e1', fontSize: '0.9rem' }}>
                  <li>• <strong>Adezyon (Yapışma):</strong> Farklı cins moleküller arasındaki çekim kuvvetidir. Yağmur damlasının cama tutunması buna örnektir.</li>
                  <li>• <strong>Kohezyon (Birbirini Tutma):</strong> Aynı cins moleküller arasındaki çekim kuvvetidir. Suyun bir arada kalarak damla şeklini almasını sağlar.</li>
                  <li>• <strong>Yüzey Gerilimi:</strong> Sıvı yüzeyindeki kohezyon kuvveti etkisiyle yüzeyin gergin bir zar gibi davranmasıdır. Sıcaklık arttıkça yüzey gerilimi <strong>azalır</strong>. Sıvıya deterjan veya sabun eklenmesi yüzey gerilimini <strong>azaltır</strong>, tuz eklenmesi ise <strong>artırır</strong>.</li>
                  <li>• <strong>Kılcallık:</strong> Sıvıların dar borularda adezyon veya kohezyon farkına bağlı olarak yükselmesi ya da alçalmasıdır.</li>
                </ul>
              </div>

              <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderLeft: '4px solid #f59e0b', padding: '1rem', borderRadius: '12px', margin: '1.5rem 0' }}>
                <h4 style={{ fontWeight: 700, color: '#fbbf24', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                  ⚠️ YKS ODAKLI BİLGİ / TUZAK
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0, lineHeight: 1.6 }}>
                  Sıcak su ve deterjan kirlerin temizlenmesini kolaylaştırır; çünkü her ikisi de suyun <strong>yüzey gerilimini düşürerek</strong> kumaşın gözeneklerine suyun daha rahat girmesini (kılcallığı) sağlar.
                </p>
              </div>
            </section>
          </>
        );
      case 'isi-sicaklik-9':
        return (
          <>
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.75rem' }}>1. Isı, Sıcaklık ve Termodinamik Prensipler</h2>
              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                Sıcaklık, bir maddedeki moleküllerin ortalama kinetik enerjilerinin bir göstergesidir. Birimi Kelvin'dir (K) ve termometreyle ölçülür. Isı ise sıcaklıkları farklı maddeler arasında transfer edilen enerjidir. Birimi Joule veya Kalori'dir, kalorimetre kabı ile ölçülür.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1.5rem 0' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '1.25rem', borderRadius: '12px' }}>
                  <h4 style={{ fontWeight: 700, color: '#cbd5e1', marginBottom: '0.4rem' }}>🔥 Sıcaklık Değişimi (Isınma/Soğuma)</h4>
                  <div style={{ fontSize: '1.2rem', color: '#06b6d4', fontWeight: 700, fontFamily: 'monospace', margin: '0.5rem 0' }}>
                    {"Q = m \\cdot c \\cdot \\Delta T"}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>
                    c: Öz ısı (ayırt edici), m: Kütle, m·c: Isı sığası (madde miktarına bağlıdır).
                  </p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '1.25rem', borderRadius: '12px' }}>
                  <h4 style={{ fontWeight: 700, color: '#cbd5e1', marginBottom: '0.4rem' }}>❄️ Hal Değişimi</h4>
                  <div style={{ fontSize: '1.2rem', color: '#7c3aed', fontWeight: 700, fontFamily: 'monospace', margin: '0.5rem 0' }}>
                    {"Q = m \\cdot L"}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>
                    L: Hal değiştirme ısısı (erime/buharlaşma ısısı). Hal değişimi sırasında sıcaklık sabit kalır.
                  </p>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', margin: '1.5rem 0', overflow: 'hidden' }}>
                <div style={{ background: 'rgba(124,58,237,0.15)', borderLeft: '4px solid #7c3aed', padding: '0.75rem 1rem', fontWeight: 700, color: '#a78bfa', fontSize: '0.9rem' }}>
                  📝 ÖRNEK SORU
                </div>
                <div style={{ padding: '1rem', color: '#cbd5e1', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  Isıca yalıtılmış bir kapta bulunan suya ısı verildiğinde suyun sıcaklığının değişmediği gözleniyor. Bu olayla ilgili;
                  <br />
                  I. Su hal değiştirmektedir.
                  <br />
                  II. Suyun iç enerjisi artmaktadır.
                  <br />
                  III. Suyun özkütlesi azalmaktadır.
                  <br />
                  yargılarından hangileri <strong>kesinlikle</strong> doğrudur?
                  <br /><br />
                  A) Yalnız I &nbsp;&nbsp;&nbsp;&nbsp; B) Yalnız II &nbsp;&nbsp;&nbsp;&nbsp; C) I ve II &nbsp;&nbsp;&nbsp;&nbsp; D) II ve III &nbsp;&nbsp;&nbsp;&nbsp; E) I, II ve III
                </div>
                <div style={{ background: 'rgba(16,185,129,0.05)', borderLeft: '4px solid #10b981', padding: '0.75rem 1rem', fontWeight: 700, color: '#34d399', fontSize: '0.9rem' }}>
                  💡 ÇÖZÜM
                </div>
                <div style={{ padding: '1rem', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Suya ısı verildiği halde sıcaklığı değişmiyorsa su kesinlikle hal değiştirmektedir (kaynamakta veya donma noktasında ise erimektedir). Sisteme ısı enerjisi verildiği için iç enerjisi kesinlikle artar. Ancak suyun hacmi hal değişimine göre artabileceği veya azalabileceği için özkütlesinin değişimi hakkında kesin bir şey söylenemez.
                  <br />
                  <strong>Doğru Cevap: C</strong>
                </div>
              </div>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.75rem' }}>2. Suyun Özel Durumu ve Isıl Genleşme</h2>
              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                Genel olarak maddeler ısıtıldığında genleşir (hacimleri artar, özkütleleri azalır). Ancak suyun bu kurala uymayan özel bir durumu vardır. Suyun hacmi <strong>{"+4^\\circ C"}</strong> sıcaklıkta minimum, özkütlesi ise maksimumdur (1 g/cm³).
              </p>

              <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderLeft: '4px solid #f59e0b', padding: '1rem', borderRadius: '12px', margin: '1.5rem 0' }}>
                <h4 style={{ fontWeight: 700, color: '#fbbf24', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                  ⚠️ YKS ODAKLI BİLGİ / TUZAK
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0, lineHeight: 1.6 }}>
                  Suyun bu özel durumu sayesinde donan göllerin buz tabakası suyun yüzeyinde kalır. Üstten donan göllerde, tabandaki suyun sıcaklığı daima <strong>{"+4^\\circ C"}</strong> civarında kalır ve bu sayede sudaki canlı yaşamı korunur.
                </p>
              </div>
            </section>
          </>
        );
      case 'kuvvet-hareket-9':
        return (
          <>
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.75rem' }}>1. Hareket Grafikleri ve Yorumlanması</h2>
              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                Bir cismin konumunun zamanla değişmesine hareket denir. Hız, birim zamandaki yer değiştirmedir (vektörel); sürat ise birim zamanda alınan yoldur (skaler). İvme ise birim zamandaki hız değişimidir (vektörel).
              </p>

              <div style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.15)', borderLeft: '4px solid #06b6d4', padding: '1rem', borderRadius: '12px', margin: '1.5rem 0', fontFamily: 'monospace' }}>
                <h4 style={{ fontWeight: 700, color: '#a78bfa', marginBottom: '0.5rem', fontFamily: 'sans-serif' }}>📊 Grafik İpuçları:</h4>
                <ul style={{ listStyleType: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: '#cbd5e1', fontFamily: 'sans-serif' }}>
                  <li>• <strong>Konum-Zaman (x-t) Grafiği:</strong> Eğimi bize cismin <strong>hızını</strong> verir. Grafiğin yön değiştirdiği (tepe ve çukur) noktalar cismin hareket yönünü değiştirdiği anlardır.</li>
                  <li>• <strong>Hız-Zaman (v-t) Grafiği:</strong> Grafiğin zaman ekseniyle sınırladığı alan cismin <strong>yer değiştirmesini (Δx)</strong> verir. Grafiğin eğimi ise <strong>ivmeyi (a)</strong> verir.</li>
                </ul>
              </div>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.75rem' }}>2. Newton'ın Hareket Yasaları ve Sürtünme Kuvveti</h2>
              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                Newton'ın üç temel hareket yasası vardır:
              </p>
              
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '1.25rem', borderRadius: '12px', margin: '1.5rem 0' }}>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingLeft: '1rem', color: '#cbd5e1', fontSize: '0.9rem' }}>
                  <li><strong>1. Eylemsizlik Yasası:</strong> Cisme etki eden net kuvvet sıfırsa ({"\\Sigma F = 0"}), duran cisim durmaya devam eder, hareketli cisim ise sabit hızla yoluna devam eder.</li>
                  <li><strong>2. Dinamiğin Temel Yasası:</strong> Net bir kuvvet etki eden cisim ivmeli hareket yapar: <span style={{ color: '#06b6d4', fontWeight: 700 }}>{"F_{net} = m \\cdot a"}</span>.</li>
                  <li><strong>3. Etki-Tepki Yasası:</strong> Her etki kuvvetine karşı eşit büyüklükte ve zıt yönde bir tepki kuvveti oluşur. Etki ve tepki kuvvetleri farklı cisimler üzerindedir.</li>
                </ul>
              </div>

              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                <strong>Sürtünme Kuvveti (Fs):</strong> Temas halindeki yüzeyler arasında harekete zıt yönde oluşan kuvvettir.
                <br />
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#a78bfa' }}>{"F_s = k \\cdot N"}</span> (Burada k sürtünme katsayısı, N yüzey tepki kuvvetidir).
                <br />
                Statik sürtünme kuvveti (duran cisimler için) uygulanan kuvvete göre değişir ve maksimum değeri kinetik sürtünme kuvvetinden daima büyüktür.
              </p>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', margin: '1.5rem 0', overflow: 'hidden' }}>
                <div style={{ background: 'rgba(124,58,237,0.15)', borderLeft: '4px solid #7c3aed', padding: '0.75rem 1rem', fontWeight: 700, color: '#a78bfa', fontSize: '0.9rem' }}>
                  📝 ÖRNEK SORU
                </div>
                <div style={{ padding: '1rem', color: '#cbd5e1', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  Sürtünme katsayısı k = 0.5 olan yatay düzlemde duran 4 kg kütleli bir cisme yatay doğrultuda F = 15 N kuvvet uygulanıyor. Buna göre cisme etki eden sürtünme kuvveti kaç N'dur? (g = 10 m/s²)
                  <br /><br />
                  A) 10 &nbsp;&nbsp;&nbsp;&nbsp; B) 15 &nbsp;&nbsp;&nbsp;&nbsp; C) 20 &nbsp;&nbsp;&nbsp;&nbsp; D) 25 &nbsp;&nbsp;&nbsp;&nbsp; E) 30
                </div>
                <div style={{ background: 'rgba(16,185,129,0.05)', borderLeft: '4px solid #10b981', padding: '0.75rem 1rem', fontWeight: 700, color: '#34d399', fontSize: '0.9rem' }}>
                  💡 ÇÖZÜM
                </div>
                <div style={{ padding: '1rem', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Öncelikle cismin harekete geçip geçemeyeceğini anlamak için maksimum statik sürtünme kuvvetini hesaplamalıyız:
                  <br />
                  {"F_{s,max} = k \\cdot N = k \\cdot m \\cdot g = 0.5 \\cdot 4 \\cdot 10 = 20\\ N"}.
                  <br />
                  Uygulanan dış kuvvet F = 15 N'dur. Uygulanan kuvvet, maksimum statik sürtünme kuvvetinden (20 N) küçük olduğu için cisim <strong>harekete geçemez</strong>. Hareketsiz cisimlerde sürtünme kuvveti, uygulanan net dış kuvvete eşit büyüklükte olur. Dolayısıyla sürtünme kuvveti 15 N'dur.
                  <br />
                  <strong>Doğru Cevap: B</strong>
                </div>
              </div>
            </section>
          </>
        );
      case 'enerji-9':
        return (
          <>
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.75rem' }}>1. İş, Güç ve Mekanik Enerji Dönüşümleri</h2>
              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                Fiziksel anlamda iş (W), bir kuvvete maruz kalan cismin kuvvet doğrultusunda yer değiştirmesidir. Güç (P) ise birim zamanda yapılan iştir.
              </p>

              <div style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.15)', borderLeft: '4px solid #06b6d4', padding: '1rem', borderRadius: '12px', margin: '1.5rem 0', fontFamily: 'monospace' }}>
                <div style={{ fontSize: '1.15rem', color: '#cbd5e1', fontWeight: 700 }}>
                  {"W = F \\cdot \\Delta x"} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {"P = \\frac{W}{t} = F \\cdot v_{ort}"}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontFamily: 'sans-serif', marginTop: '0.3rem' }}>
                  W: İş (Joule - J), F: Kuvvet (Newton), Δx: Yer değiştirme (m), P: Güç (Watt - W)
                </div>
              </div>

              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                <strong>Mekanik Enerji (E):</strong> Kinetik enerji ve potansiyel enerjilerin toplamıdır:
                <br />
                • Kinetik Enerji: {"E_k = \\frac{1}{2} m v^2"}
                <br />
                • Çekim Potansiyel Enerjisi: {"E_p = m g h"}
              </p>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', margin: '1.5rem 0', overflow: 'hidden' }}>
                <div style={{ background: 'rgba(124,58,237,0.15)', borderLeft: '4px solid #7c3aed', padding: '0.75rem 1rem', fontWeight: 700, color: '#a78bfa', fontSize: '0.9rem' }}>
                  📝 ÖRNEK SORU
                </div>
                <div style={{ padding: '1rem', color: '#cbd5e1', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  Kütlesi 2 kg olan bir cisim 45 metre yükseklikten serbest bırakılıyor. Hava direncinin önemsiz olduğu ortamda cisim yere çarptığı anda kinetik enerjisi kaç Joule olur? (g = 10 m/s²)
                  <br /><br />
                  A) 300 &nbsp;&nbsp;&nbsp;&nbsp; B) 450 &nbsp;&nbsp;&nbsp;&nbsp; C) 600 &nbsp;&nbsp;&nbsp;&nbsp; D) 900 &nbsp;&nbsp;&nbsp;&nbsp; E) 1200
                </div>
                <div style={{ background: 'rgba(16,185,129,0.05)', borderLeft: '4px solid #10b981', padding: '0.75rem 1rem', fontWeight: 700, color: '#34d399', fontSize: '0.9rem' }}>
                  💡 ÇÖZÜM
                </div>
                <div style={{ padding: '1rem', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Sürtünmesiz ortamlarda mekanik enerji korunur. Cismin başlangıçta sadece çekim potansiyel enerjisi vardır. Yere çarptığı anda ise bu potansiyel enerjinin tamamı kinetik enerjiye dönüşür:
                  <br />
                  {"E_k = E_p = m \\cdot g \\cdot h = 2 \\cdot 10 \\cdot 45 = 900\\ Joule"}.
                  <br />
                  <strong>Doğru Cevap: D</strong>
                </div>
              </div>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.75rem' }}>2. Enerjinin Korunumu ve Verim</h2>
              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                Sistemlerde enerji yok olamaz, ancak sürtünme nedeniyle bir kısmı ısı veya ses enerjisine dönüşebilir. Yapılan işin veya harcanan enerjinin ne kadarının hedeflenen yararlı işe dönüştüğünün ölçüsüne <strong>verim</strong> denir:
                <br />
                <span style={{ color: '#06b6d4', fontWeight: 700 }}>{"Verim = \\frac{Alınan\\ Yararlı\\ Enerji}{Harcanan\\ Toplam\\ Enerji}"}</span>
              </p>

              <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderLeft: '4px solid #f59e0b', padding: '1rem', borderRadius: '12px', margin: '1.5rem 0' }}>
                <h4 style={{ fontWeight: 700, color: '#fbbf24', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                  ⚠️ YKS ODAKLI BİLGİ / TUZAK
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0, lineHeight: 1.6 }}>
                  Gerçek hayatta hiçbir makinenin verimi %100 olamaz. Çünkü sürtünmeler nedeniyle enerjinin bir kısmı mutlaka ısı enerjisine dönüşür.
                </p>
              </div>
            </section>
          </>
        );
      case 'elektrostatik-9':
        return (
          <>
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.75rem' }}>1. Elektrik Yükleri ve Elektriklenme Türleri</h2>
              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                Elektrostatik, durgun elektrik yüklerini ve bu yükler arasındaki etkileşimleri inceler. Doğada pozitif (+) ve negatif (-) olmak üzere iki çeşit elektrik yükü vardır. Cisimler üç farklı yöntemle yüklenebilir:
              </p>

              <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', padding: '1.25rem', borderRadius: '12px', margin: '1.5rem 0' }}>
                <ul style={{ listStyleType: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
                  <li>• <strong>Sürtünme ile Elektriklenme:</strong> Yalıtkan iki cisim birbirine sürtüldüğünde elektron geçişi olur. Cisimler eşit miktarda ve zıt cins yükle yüklenir. Ebonit (plastik) çubuk yün kumaşa sürtüldüğünde (-), cam çubuk ipek kumaşa sürtüldüğünde (+) yüklenir.</li>
                  <li>• <strong>Dokunma ile Elektriklenme:</strong> İletken iki cisim dokundurulduğunda toplam yükü yarıçapları oranında paylaşırlar. Yük paylaşımı tamamlandığında cisimlerin yük işaretleri aynı olur.</li>
                  <li>• <strong>Etki (İndüksiyon) ile Elektriklenme:</strong> Yüklü bir cisim iletken cisme yaklaştırıldığında, zıt yükleri kendine çeker, aynı yükleri en uzak noktaya iter. Temas yoktur, geçici bir kutuplanma oluşur.</li>
                </ul>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', margin: '1.5rem 0', overflow: 'hidden' }}>
                <div style={{ background: 'rgba(124,58,237,0.15)', borderLeft: '4px solid #7c3aed', padding: '0.75rem 1rem', fontWeight: 700, color: '#a78bfa', fontSize: '0.9rem' }}>
                  📝 ÖRNEK SORU
                </div>
                <div style={{ padding: '1rem', color: '#cbd5e1', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  Yarıçapları sırasıyla r ve 3r olan iletken K ve L kürelerinin yükleri sırasıyla +10q ve -2q'dur. Küreler birbirine dokundurulup ayrıldıktan sonra son yükleri ne olur?
                  <br /><br />
                  A) +4q, +4q &nbsp;&nbsp;&nbsp;&nbsp; B) +2q, +6q &nbsp;&nbsp;&nbsp;&nbsp; C) +3q, +9q &nbsp;&nbsp;&nbsp;&nbsp; D) +5q, +3q &nbsp;&nbsp;&nbsp;&nbsp; E) +1q, +3q
                </div>
                <div style={{ background: 'rgba(16,185,129,0.05)', borderLeft: '4px solid #10b981', padding: '0.75rem 1rem', fontWeight: 700, color: '#34d399', fontSize: '0.9rem' }}>
                  💡 ÇÖZÜM
                </div>
                <div style={{ padding: '1rem', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Dokunma ile elektriklenmede toplam yük korunur.
                  <br />
                  {"Q_{toplam} = +10q + (-2q) = +8q"}.
                  <br />
                  Bu toplam yük, kürelerin yarıçapları oranında paylaşılır. Toplam yarıçap {"r + 3r = 4r"}'dir.
                  <br />
                  K'nin son yükü: {"Q'_K = Q_{toplam} \\cdot \\frac{r}{4r} = +8q \\cdot \\frac{1}{4} = +2q"}.
                  <br />
                  L'nin son yükü: {"Q'_L = Q_{toplam} \\cdot \\frac{3r}{4r} = +8q \\cdot \\frac{3}{4} = +6q"}.
                  <br />
                  <strong>Doğru Cevap: B</strong>
                </div>
              </div>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.75rem' }}>2. Elektroskop ve Coulomb Kanunu</h2>
              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                Cisimlerin yüklü olup olmadığını, yüklü ise hangi cins yükle yüklü olduğunu anlamamızı sağlayan araca <strong>elektroskop</strong> denir. Yüklü iki cismin birbirine uyguladığı itme veya çekme kuvveti Coulomb Yasası ile açıklanır:
              </p>

              <div style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.15)', borderLeft: '4px solid #06b6d4', padding: '1rem', borderRadius: '12px', margin: '1.5rem 0', fontFamily: 'monospace' }}>
                <div style={{ fontSize: '1.25rem', color: '#cbd5e1', fontWeight: 700 }}>
                  {"F = k \\cdot \\frac{|q_1 \\cdot q_2|}{r^2}"}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontFamily: 'sans-serif', marginTop: '0.3rem' }}>
                  F: Elektriksel kuvvet (N), k: Coulomb sabiti, q1, q2: Yük miktarları, r: Yükler arası uzaklık
                </div>
              </div>

              <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderLeft: '4px solid #f59e0b', padding: '1rem', borderRadius: '12px', margin: '1.5rem 0' }}>
                <h4 style={{ fontWeight: 700, color: '#fbbf24', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                  ⚠️ YKS ODAKLI BİLGİ / TUZAK
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0, lineHeight: 1.6 }}>
                  Coulomb kuvveti etki-tepki çiftidir. İki yükün birbirine uyguladığı kuvvetler <strong>eşit büyüklükte fakat zıt yönlüdür</strong>. Yüklerin miktarları ne kadar farklı olursa olsun, birbirlerine uyguladıkları kuvvetlerin büyüklükleri daima eşittir!
                </p>
              </div>
            </section>
          </>
        );
      case 'basinc-10':
        return (
          <>
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.75rem' }}>1. Katı, Sıvı ve Gaz Basıncı</h2>
              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                Basınç (P), birim yüzeye dik etki eden net kuvvet büyüklüğüdür. Katılarda basınç kuvveti cismin ağırlığına eşittir. Durgun sıvılarda ise sıvının derinliği ve yoğunluğu basıncı belirler.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', margin: '1.5rem 0' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '1rem', borderRadius: '12px' }}>
                  <h4 style={{ fontWeight: 700, color: '#cbd5e1', fontSize: '0.85rem' }}>🧱 Katı Basıncı</h4>
                  <div style={{ fontSize: '1.1rem', color: '#06b6d4', fontWeight: 700, fontFamily: 'monospace', margin: '0.35rem 0' }}>
                    {"P = \\frac{G}{S}"}
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '1rem', borderRadius: '12px' }}>
                  <h4 style={{ fontWeight: 700, color: '#cbd5e1', fontSize: '0.85rem' }}>💧 Sıvı Basıncı</h4>
                  <div style={{ fontSize: '1.1rem', color: '#7c3aed', fontWeight: 700, fontFamily: 'monospace', margin: '0.35rem 0' }}>
                    {"P = h \\cdot d \\cdot g"}
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '1rem', borderRadius: '12px' }}>
                  <h4 style={{ fontWeight: 700, color: '#cbd5e1', fontSize: '0.85rem' }}>💨 Açık Hava</h4>
                  <div style={{ fontSize: '1.1rem', color: '#10b981', fontWeight: 700, fontFamily: 'monospace', margin: '0.35rem 0' }}>
                    {"P_0 = 76\\ cmHg"}
                  </div>
                </div>
              </div>

              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                <strong>Bernoulli İlkesi:</strong> Akışkanların (sıvı ve gaz) akış hızı arttıkça, çeperlerine uyguladıkları basınç azalır. Uçak kanatlarının altındaki ve üstündeki basınç farkı bu sayede kaldırma kuvveti oluşturur.
              </p>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', margin: '1.5rem 0', overflow: 'hidden' }}>
                <div style={{ background: 'rgba(124,58,237,0.15)', borderLeft: '4px solid #7c3aed', padding: '0.75rem 1rem', fontWeight: 700, color: '#a78bfa', fontSize: '0.9rem' }}>
                  📝 ÖRNEK SORU
                </div>
                <div style={{ padding: '1rem', color: '#cbd5e1', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  Ağzı kapalı, içinde bir miktar su ve hava bulunan bir şişe ters çevriliyor. Bu işlem sonucunda;
                  <br />
                  I. Şişenin tabanına etki eden sıvı basıncı değişmez.
                  <br />
                  II. Şişedeki gazın basıncı değişmez.
                  <br />
                  III. Şişenin zemine uyguladığı katı basıncı artar.
                  <br />
                  yargılarından hangileri doğrudur? (Şişenin ağız kısmı tabanından dardır.)
                  <br /><br />
                  A) Yalnız I &nbsp;&nbsp;&nbsp;&nbsp; B) Yalnız II &nbsp;&nbsp;&nbsp;&nbsp; C) I ve II &nbsp;&nbsp;&nbsp;&nbsp; D) II ve III &nbsp;&nbsp;&nbsp;&nbsp; E) I, II ve III
                </div>
                <div style={{ background: 'rgba(16,185,129,0.05)', borderLeft: '4px solid #10b981', padding: '0.75rem 1rem', fontWeight: 700, color: '#34d399', fontSize: '0.9rem' }}>
                  💡 ÇÖZÜM
                </div>
                <div style={{ padding: '1rem', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Şişe ters çevrildiğinde dar ağız kısmı alta geleceğinden suyun yüksekliği (h) artacaktır. Dolayısıyla tabana yapılan sıvı basıncı (hdg) artar (I yanlış). Gazın ve suyun toplam hacmi değişmediği için gazın kapladığı hacim ve basıncı değişmez (II doğru). Şişenin temas ettiği zemin alanı (S) azaldığından, zemine uygulanan katı basıncı (G/S) artar (III doğru).
                  <br />
                  <strong>Doğru Cevap: D</strong>
                </div>
              </div>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.75rem' }}>2. Archimedes İlkesi ve Kaldırma Kuvveti</h2>
              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                Sıvı içindeki bir cisme, yerini değiştirdiği sıvının ağırlığına eşit büyüklükte yukarı yönlü bir kaldırma kuvveti etki eder:
                <br />
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#a78bfa' }}>{"F_K = V_{batan} \\cdot d_{sıvı} \\cdot g"}</span>
              </p>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '1.25rem', borderRadius: '12px', margin: '1.5rem 0', fontSize: '0.9rem', color: '#cbd5e1' }}>
                • <strong>Yüzen ve Askıda Kalan Cisimler:</strong> Cisim dengededir ve etki eden kaldırma kuvveti cismin kendi ağırlığına eşittir ({"F_K = G"}).
                <br />
                • <strong>Batan Cisimler:</strong> Cisim dibe çöker. Kaldırma kuvveti cismin ağırlığından küçüktür ({"F_K < G"}).
              </div>
            </section>
          </>
        );
      case 'elektrik-manyetizma-10':
        return (
          <>
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.75rem' }}>1. Elektrik Akımı, Dirençler ve Ohm Yasası</h2>
              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                Elektrik akımı (I), bir iletkenin kesitinden birim zamanda geçen net yük miktarıdır. Bir iletkenin uçları arasındaki potansiyel farkının (V), üzerinden geçen akıma oranı sabittir ve bu sabit değer iletkenin <strong>direncidir (R)</strong>:
              </p>

              <div style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.15)', borderLeft: '4px solid #06b6d4', padding: '1rem', borderRadius: '12px', margin: '1.5rem 0', fontFamily: 'monospace' }}>
                <div style={{ fontSize: '1.25rem', color: '#cbd5e1', fontWeight: 700 }}>
                  {"V = I \\cdot R"} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {"R = \\rho \\cdot \\frac{L}{A}"}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontFamily: 'sans-serif', marginTop: '0.3rem' }}>
                  V: Potansiyel fark (Volt), I: Akım (Amper), R: Direnç (Ohm), ρ: Öz direnç, L: Boy, A: Kesit alanı
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', margin: '1.5rem 0', overflow: 'hidden' }}>
                <div style={{ background: 'rgba(124,58,237,0.15)', borderLeft: '4px solid #7c3aed', padding: '0.75rem 1rem', fontWeight: 700, color: '#a78bfa', fontSize: '0.9rem' }}>
                  📝 ÖRNEK SORU
                </div>
                <div style={{ padding: '1rem', color: '#cbd5e1', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  Aralarında 6 Ω ve 3 Ω dirençler bulunan paralel bağlı iki kola 12 V gerilime sahip ideal bir üreteç bağlanıyor. Bu devrenin ana kolundan çekilen toplam akım kaç Amper'dir?
                  <br /><br />
                  A) 2 &nbsp;&nbsp;&nbsp;&nbsp; B) 3 &nbsp;&nbsp;&nbsp;&nbsp; C) 4 &nbsp;&nbsp;&nbsp;&nbsp; D) 6 &nbsp;&nbsp;&nbsp;&nbsp; E) 8
                </div>
                <div style={{ background: 'rgba(16,185,129,0.05)', borderLeft: '4px solid #10b981', padding: '0.75rem 1rem', fontWeight: 700, color: '#34d399', fontSize: '0.9rem' }}>
                  💡 ÇÖZÜM
                </div>
                <div style={{ padding: '1rem', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Dirençler paralel bağlı olduğundan öncelikle eşdeğer direnci (Reş) bulmalıyız:
                  <br />
                  {"\\frac{1}{R_{eş}} = \\frac{1}{R_1} + \\frac{1}{R_2} = \\frac{1}{6} + \\frac{1}{3} = \\frac{3}{6} = \\frac{1}{2} \\implies R_{eş} = 2\\ \\Omega"}.
                  <br />
                  Ohm Yasasını kullanarak ana kol akımını hesaplarız:
                  <br />
                  {"I_{toplam} = \\frac{V}{R_{eş}} = \\frac{12}{2} = 6\\ Amper"}.
                  <br />
                  <strong>Doğru Cevap: D</strong>
                </div>
              </div>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.75rem' }}>2. Elektriksel Güç ve Lambaların Parlaklığı</h2>
              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                Bir elektrik devresinde birim zamanda harcanan elektrik enerjisine güç denir:
                <br />
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#a78bfa' }}>{"P = V \\cdot I = I^2 \\cdot R = \\frac{V^2}{R}"}</span>
              </p>

              <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderLeft: '4px solid #f59e0b', padding: '1rem', borderRadius: '12px', margin: '1.5rem 0' }}>
                <h4 style={{ fontWeight: 700, color: '#fbbf24', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                  ⚠️ YKS ODAKLI BİLGİ / TUZAK
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0, lineHeight: 1.6 }}>
                  Özdeş lambaların parlaklığı doğrudan lambaların <strong>güçleriyle</strong> (ve dolayısıyla üzerlerinden geçen akımın karesiyle) doğru orantılıdır. Bir üretecin ömrü ise üreteçten çekilen akımla ters orantılıdır; devreden çok akım çekilirse piller hızlı tükenir.
                </p>
              </div>
            </section>
          </>
        );
      case 'dalgalar-10':
        return (
          <>
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.75rem' }}>1. Dalgaların Temel Özellikleri</h2>
              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                Dalga, esnek bir ortamda oluşturulan sarsıntının (titreşimin) ortam boyunca enerji taşıyarak ilerlemesidir. Dalga hareketi sırasında madde ötelenmez, sadece enerji iletilir. Dalga denklemi şu şekildedir:
              </p>

              <div style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.15)', borderLeft: '4px solid #06b6d4', padding: '1rem', borderRadius: '12px', margin: '1.5rem 0', fontFamily: 'monospace' }}>
                <div style={{ fontSize: '1.25rem', color: '#cbd5e1', fontWeight: 700 }}>
                  {"v = \\lambda \\cdot f = \\frac{\\lambda}{T}"}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontFamily: 'sans-serif', marginTop: '0.3rem' }}>
                  v: Dalga hızı (yalnızca ortama bağlıdır), λ: Dalga boyu, f: Frekans (yalnızca kaynağa bağlıdır)
                </div>
              </div>

              <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderLeft: '4px solid #f59e0b', padding: '1rem', borderRadius: '12px', margin: '1.5rem 0' }}>
                <h4 style={{ fontWeight: 700, color: '#fbbf24', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                  ⚠️ YKS ODAKLI BİLGİ / TUZAK
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0, lineHeight: 1.6 }}>
                  Dalgaların hızı <strong>sadece yayıldığı ortama</strong> bağlıdır; ortam değişmedikçe hız değişmez. Dalgaların frekansı ise <strong>sadece kaynağa</strong> bağlıdır; kaynak değişmedikçe dalgaların frekansı asla değişmez!
                </p>
              </div>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.75rem' }}>2. Yay, Su, Ses ve Deprem Dalgaları</h2>
              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                Mekanik dalgaların yayılması için maddesel bir ortam şarttır:
              </p>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '1.25rem', borderRadius: '12px', margin: '1.5rem 0', fontSize: '0.9rem', color: '#cbd5e1' }}>
                • <strong>Yay Dalgaları:</strong> Hafif (ince) yaydan ağır (kalın) yaya geçen atma, sabit uca çarpmış gibi davranarak <strong>baş aşağı döner</strong>. Ağır yaydan hafif yaya geçen atma ise serbest uç etkisiyle <strong>düz yansır</strong>.
                <br /><br />
                • <strong>Su Dalgaları:</strong> Su dalgaları derin ortamda <strong>hızlı</strong>, sığ ortamda ise <strong>yavaş</strong> yayılır. Ortam sığlaştıkça dalga boyu küçülür.
                <br /><br />
                • <strong>Ses Dalgaları:</strong> Boyuna dalgalardır, boşlukta yayılamazlar. Sesin hızı ortamın sıcaklığı arttıkça artar. Sesin inceliği frekansla (yükseklikle), gürlüğü ise genlikle (şiddetle) ilişkilidir.
              </div>
            </section>
          </>
        );
      case 'optik-10':
        return (
          <>
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.75rem' }}>1. Yansıma Kuralları ve Aynalar</h2>
              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                Işığın parlak bir yüzeye çarparak doğrultu değiştirmesine yansıma denir. Yansıma kanunlarına göre; gelme açısı yansıma açısına daima eşittir.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', margin: '1.5rem 0' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '1rem', borderRadius: '12px' }}>
                  <h4 style={{ fontWeight: 700, color: '#cbd5e1', fontSize: '0.85rem' }}>🪞 Düzlem Ayna</h4>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0.25rem 0' }}>
                    Sanal, düz, simetrik ve cisimle eşit boyda görüntüler oluşturur.
                  </p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '1rem', borderRadius: '12px' }}>
                  <h4 style={{ fontWeight: 700, color: '#cbd5e1', fontSize: '0.85rem' }}>🥣 Çukur Ayna</h4>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0.25rem 0' }}>
                    Yakınsak aynadır. Cismin odağa mesafesine göre ters-gerçek veya düz-sanal görüntüler kurabilir.
                  </p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '1rem', borderRadius: '12px' }}>
                  <h4 style={{ fontWeight: 700, color: '#cbd5e1', fontSize: '0.85rem' }}>🚗 Tümsek Ayna</h4>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0.25rem 0' }}>
                    Iraksak aynadır. Daima düz, sanal ve cisimden daha küçük görüntüler oluşturur.
                  </p>
                </div>
              </div>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.75rem' }}>2. Kırılma Yasaları ve Mercekler</h2>
              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                Işığın yoğunluğu farklı saydam bir ortama geçerken hızının ve doğrultusunun değişmesine kırılma denir. Snell Yasası ile açıklanır:
                <br />
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#a78bfa' }}>{"n_1 \\cdot \\sin(\\theta_1) = n_2 \\cdot \\sin(\\theta_2)"}</span>
              </p>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', margin: '1.5rem 0', overflow: 'hidden' }}>
                <div style={{ background: 'rgba(124,58,237,0.15)', borderLeft: '4px solid #7c3aed', padding: '0.75rem 1rem', fontWeight: 700, color: '#a78bfa', fontSize: '0.9rem' }}>
                  📝 ÖRNEK SORU
                </div>
                <div style={{ padding: '1rem', color: '#cbd5e1', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  Kırılma indisi n = 2.0 olan camdan, kırılma indisi n = 1.0 olan havaya geçiş yapan tek renkli bir ışık ışını için sınır açısının sinüsü kaç olmalıdır?
                  <br /><br />
                  A) 0.25 &nbsp;&nbsp;&nbsp;&nbsp; B) 0.50 &nbsp;&nbsp;&nbsp;&nbsp; C) 0.70 &nbsp;&nbsp;&nbsp;&nbsp; D) 0.86 &nbsp;&nbsp;&nbsp;&nbsp; E) 1.00
                </div>
                <div style={{ background: 'rgba(16,185,129,0.05)', borderLeft: '4px solid #10b981', padding: '0.75rem 1rem', fontWeight: 700, color: '#34d399', fontSize: '0.9rem' }}>
                  💡 ÇÖZÜM
                </div>
                <div style={{ padding: '1rem', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Sınır açısında, az yoğun ortama geçen ışık normalle 90° açı yapacak şekilde kırılır (yüzeyi yalayarak gider). Snell Yasasını uygularsak:
                  <br />
                  {"n_{cam} \\cdot \\sin(\\theta_{sınır}) = n_{hava} \\cdot \\sin(90^\\circ)"}
                  <br />
                  {"2 \\cdot \\sin(\\theta_{sınır}) = 1 \\cdot 1 \\implies \\sin(\\theta_{sınır}) = 0.50"}.
                  <br />
                  <strong>Doğru Cevap: B</strong>
                </div>
              </div>
            </section>
          </>
        );
      case 'newton-ileri-11':
        return (
          <>
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.75rem' }}>1. Sürtünmeli Eğik Düzlem Analizi (AYT)</h2>
              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                AYT dinamiğinde cisimlerin hareket denklemleri serbest cisim diyagramları üzerinden vektörel bileşenler çizilerek analiz edilir. Eğik düzlemde bir cisme etki eden yerçekimi kuvveti iki bileşene ayrılır:
              </p>

              <div style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.15)', borderLeft: '4px solid #06b6d4', padding: '1rem', borderRadius: '12px', margin: '1.5rem 0', fontFamily: 'monospace' }}>
                <ul style={{ listStyleType: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: '#cbd5e1', fontFamily: 'sans-serif' }}>
                  <li>• Eğik düzleme paralel (kaydırıcı) kuvvet bileşeni: {"F_{kaydırıcı} = m \\cdot g \\cdot \\sin(\\theta)"}</li>
                  <li>• Eğik düzleme dik (baskı yapan) kuvvet bileşeni: {"F_{dik} = m \\cdot g \\cdot \\cos(\\theta)"}</li>
                  <li>• Sürtünme Kuvveti (sürtünmeli ise): {"F_s = k \\cdot N = k \\cdot m \\cdot g \\cdot \\cos(\\theta)"}</li>
                </ul>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', margin: '1.5rem 0', overflow: 'hidden' }}>
                <div style={{ background: 'rgba(124,58,237,0.15)', borderLeft: '4px solid #7c3aed', padding: '0.75rem 1rem', fontWeight: 700, color: '#a78bfa', fontSize: '0.9rem' }}>
                  📝 ÖRNEK SORU
                </div>
                <div style={{ padding: '1rem', color: '#cbd5e1', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  Eğim açısı 37° olan sürtünmesiz eğik düzlemin tepesinden serbest bırakılan bir cismin ivmesi kaç m/s² olur? (g = 10 m/s², sin(37°) = 0.6, cos(37°) = 0.8)
                  <br /><br />
                  A) 3 &nbsp;&nbsp;&nbsp;&nbsp; B) 4 &nbsp;&nbsp;&nbsp;&nbsp; C) 5 &nbsp;&nbsp;&nbsp;&nbsp; D) 6 &nbsp;&nbsp;&nbsp;&nbsp; E) 8
                </div>
                <div style={{ background: 'rgba(16,185,129,0.05)', borderLeft: '4px solid #10b981', padding: '0.75rem 1rem', fontWeight: 700, color: '#34d399', fontSize: '0.9rem' }}>
                  💡 ÇÖZÜM
                </div>
                <div style={{ padding: '1rem', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Sürtünmesiz eğik düzlemde cisme etki eden tek net kuvvet yerçekiminin eğik düzleme paralel bileşenidir:
                  <br />
                  {"F_{net} = m \\cdot g \\cdot \\sin(37^\\circ)"}.
                  <br />
                  Newton'ın ikinci yasasını (F = m·a) uygularsak:
                  <br />
                  {"m \\cdot a = m \\cdot g \\cdot \\sin(37^\\circ) \\implies a = g \\cdot \\sin(37^\\circ) = 10 \\cdot 0.6 = 6\\ m/s^2"}.
                  <br />
                  Görüldüğü üzere sürtünmesiz eğik düzlemde kayma ivmesi cismin kütlesine bağlı değildir!
                  <br />
                  <strong>Doğru Cevap: D</strong>
                </div>
              </div>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.75rem' }}>2. İki Boyutta Sabit İvmeli Atış Hareketleri</h2>
              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                Hava direncinin önemsiz olduğu ortamda yerçekimi ivmesinin ($g \approx 10$ m/s²) etkisinde yapılan iki boyutlu hareketlerdir:
              </p>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '1.25rem', borderRadius: '12px', margin: '1.5rem 0', fontSize: '0.9rem', color: '#cbd5e1' }}>
                • <strong>Yatay Atış:</strong> Yatay doğrultuda sabit hızlı hareket ($x = v_0 \cdot t$) yapılırken; düşey doğrultuda serbest düşme ($y = \frac{1}{2}gt^2$) hareketi gerçekleşir.
                <br /><br />
                • <strong>Eğik Atış:</strong> Hız iki bileşene ayrılır. Yatay hız ($v_x = v_0 \cdot \cos\theta$) hareket boyunca sabit kalır. Düşey hız ($v_y = v_0 \cdot \sin\theta - gt$) ise yerçekimi ivmesiyle düzgün yavaşlayıp, tepe noktasında sıfır olduktan sonra aşağı yönlü hızlanır.
              </div>
            </section>
          </>
        );
      case 'is-guc-enerji-11':
        return (
          <>
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.75rem' }}>1. İş-Enerji Teoremi ve Esneklik Potansiyeli</h2>
              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                Üzerinde net kuvvet tarafından yapılan iş, cismin kinetik enerjisindeki değişime eşittir: {"W_{net} = \\Delta E_k"}. Değişken kuvvetlerin (örn: yaylar) depoladığı potansiyel enerji Hooke Yasası ile hesaplanır:
              </p>

              <div style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.15)', borderLeft: '4px solid #06b6d4', padding: '1rem', borderRadius: '12px', margin: '1.5rem 0', fontFamily: 'monospace' }}>
                <div style={{ fontSize: '1.25rem', color: '#cbd5e1', fontWeight: 700 }}>
                  {"E_{yay} = \\frac{1}{2} \\cdot k \\cdot x^2"} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {"F_{geri\\ çağırıcı} = -k \\cdot x"}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontFamily: 'sans-serif', marginTop: '0.3rem' }}>
                  k: Yay sabiti (N/m), x: Sıkışma veya uzama miktarı (m)
                </div>
              </div>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.75rem' }}>2. İtme (İmpuls) ve Çizgisel Momentum Korunumu</h2>
              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                Cisme etki eden net kuvvet ile bu kuvvetin uygulanma süresinin çarpımına <strong>itme (I)</strong> denir. İtme vektörel bir büyüklüktür ve cismin çizgisel momentumundaki değişime eşittir:
              </p>

              <div style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.15)', borderLeft: '4px solid #06b6d4', padding: '1.15rem', borderRadius: '12px', margin: '1.5rem 0', fontFamily: 'monospace' }}>
                <div style={{ fontSize: '1.2rem', color: '#cbd5e1', fontWeight: 700 }}>
                  {"I = F \\cdot \\Delta t = \\Delta p = m \\cdot v_{son} - m \\cdot v_{ilk}"}
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', margin: '1.5rem 0', overflow: 'hidden' }}>
                <div style={{ background: 'rgba(124,58,237,0.15)', borderLeft: '4px solid #7c3aed', padding: '0.75rem 1rem', fontWeight: 700, color: '#a78bfa', fontSize: '0.9rem' }}>
                  📝 ÖRNEK SORU
                </div>
                <div style={{ padding: '1rem', color: '#cbd5e1', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  Kütlesi 0.5 kg olan bir tenis topu 20 m/s hızla duvara çarparak doğrultusunu değiştirmeden aynı büyüklükte hızla geri dönüyor. Duvarın topa uyguladığı itme kaç N·s'dir?
                  <br /><br />
                  A) 0 &nbsp;&nbsp;&nbsp;&nbsp; B) 10 &nbsp;&nbsp;&nbsp;&nbsp; C) 15 &nbsp;&nbsp;&nbsp;&nbsp; D) 20 &nbsp;&nbsp;&nbsp;&nbsp; E) 40
                </div>
                <div style={{ background: 'rgba(16,185,129,0.05)', borderLeft: '4px solid #10b981', padding: '0.75rem 1rem', fontWeight: 700, color: '#34d399', fontSize: '0.9rem' }}>
                  💡 ÇÖZÜM
                </div>
                <div style={{ padding: '1rem', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Duvara doğru gidiş yönünü pozitif (+), dönüş yönünü ise negatif (-) kabul edelim.
                  <br />
                  • İlk momentum: {"p_{ilk} = m \\cdot v_{ilk} = 0.5 \\cdot (+20) = +10\\ kg \\cdot m/s"}
                  <br />
                  • Son momentum: {"p_{son} = m \\cdot v_{son} = 0.5 \\cdot (-20) = -10\\ kg \\cdot m/s"}
                  <br />
                  İtme momentum değişimine eşittir:
                  <br />
                  {"I = \\Delta p = p_{son} - p_{ilk} = -10 - 10 = -20\\ N \\cdot s"}.
                  <br />
                  İtme büyüklüğü 20 N·s olur.
                  <br />
                  <strong>Doğru Cevap: D</strong>
                </div>
              </div>
            </section>
          </>
        );
      case 'tork-denge-makineler-11':
        return (
          <>
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.75rem' }}>1. Tork (Kuvvet Momenti) ve Denge Koşulları</h2>
              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                Tork, bir kuvvetin rijit cismi belirli bir eksen etrafında döndürme etkisidir. Vektörel bir büyüklüktür ve sağ el kuralı yardımıyla yönü bulunur:
                <br />
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#a78bfa' }}>{"\\tau = F \\cdot d \\cdot \\sin(\\theta)"}</span>
              </p>

              <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', padding: '1.25rem', borderRadius: '12px', margin: '1.5rem 0' }}>
                <h4 style={{ fontWeight: 700, color: '#a78bfa', marginBottom: '0.5rem' }}>⚖️ Statik Denge Şartları:</h4>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                  Bir cismin statik dengede olabilmesi için şu iki temel şartı sağlaması gerekir:
                  <br />
                  1. <strong>Öteleme Dengesi:</strong> Cisme etki eden net kuvvet sıfır olmalıdır ({"\\Sigma F = 0"}).
                  <br />
                  2. <strong>Dönme Dengesi:</strong> Cismin herhangi bir eksene göre net torku sıfır olmalıdır ({"\\Sigma \\tau = 0"}).
                </p>
              </div>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.75rem' }}>2. Basit Makineler ve Mekanik Avantaj</h2>
              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                Kuvvetten kazanç sağlayarak iş yapma kolaylığı sunan düzeneklere basit makine denir. Sürtünmesiz ideal sistemlerde mekanik avantaj (kuvvet kazancı) şu oranla hesaplanır:
                <br />
                <span style={{ color: '#06b6d4', fontWeight: 700 }}>{"Kuvvet\\ Kazancı = \\frac{Yük\\ (P)}{Kuvvet\\ (F)}"}.</span>
              </p>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', margin: '1.5rem 0', overflow: 'hidden' }}>
                <div style={{ background: 'rgba(124,58,237,0.15)', borderLeft: '4px solid #7c3aed', padding: '0.75rem 1rem', fontWeight: 700, color: '#a78bfa', fontSize: '0.9rem' }}>
                  📝 ÖRNEK SORU
                </div>
                <div style={{ padding: '1rem', color: '#cbd5e1', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  Aşağıda özellikleri belirtilen basit makinelerden hangisinde <strong>kuvvetten kazanç veya yoldan kayıp kesinlikle yoktur</strong>?
                  <br /><br />
                  A) Hareketli Makara &nbsp;&nbsp;&nbsp;&nbsp; B) Sabit Makara &nbsp;&nbsp;&nbsp;&nbsp; C) Eğik Düzlem &nbsp;&nbsp;&nbsp;&nbsp; D) Çıkrık &nbsp;&nbsp;&nbsp;&nbsp; E) El Arabası
                </div>
                <div style={{ background: 'rgba(16,185,129,0.05)', borderLeft: '4px solid #10b981', padding: '0.75rem 1rem', fontWeight: 700, color: '#34d399', fontSize: '0.9rem' }}>
                  💡 ÇÖZÜM
                </div>
                <div style={{ padding: '1rem', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Sabit makaralarda kuvvetin büyüklüğü yükün büyüklüğüne eşittir (F = P). Sadece kuvvetin yönünü değiştirerek iş kolaylığı sağlar. Dolayısıyla kuvvetten veya yoldan kazanç ya da kayıp yoktur. Hareketli makara, eğik düzlem ve çıkrıkta ise daima kuvvetten kazanç (yoldan kayıp) mevcuttur.
                  <br />
                  <strong>Doğru Cevap: B</strong>
                </div>
              </div>

              <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderLeft: '4px solid #f59e0b', padding: '1rem', borderRadius: '12px', margin: '1.5rem 0' }}>
                <h4 style={{ fontWeight: 700, color: '#fbbf24', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                  ⚠️ YKS ODAKLI BİLGİ / TUZAK
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0, lineHeight: 1.6 }}>
                  Hiçbir basit makine <strong>işten veya enerjiden kazanç sağlamaz</strong>. Yapılan toplam iş aynı kalırken, sadece uygulanan kuvvet küçültülebilir (bu durumda yol uzar).
                </p>
              </div>
            </section>
          </>
        );
      case 'elektrik-devreleri-12':
        return (
          <>
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.75rem' }}>1. Elektriksel Potansiyel Enerji ve Potansiyel</h2>
              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                Elektriksel potansiyel (V), birim yük başına düşen elektriksel potansiyel enerjidir. Skaler bir büyüklüktür ve referans noktası sonsuz kabul edilerek hesaplanır:
              </p>

              <div style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.15)', borderLeft: '4px solid #06b6d4', padding: '1.15rem', borderRadius: '12px', margin: '1.5rem 0', fontFamily: 'monospace' }}>
                <div style={{ fontSize: '1.25rem', color: '#cbd5e1', fontWeight: 700, marginBottom: '0.4rem' }}>
                  {"V = k \\cdot \\frac{q}{r}"} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {"E_p = k \\cdot \\frac{q_1 \\cdot q_2}{r}"}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontFamily: 'sans-serif' }}>
                  V: Elektriksel potansiyel (Volt), Ep: Potansiyel enerji (Joule)
                </div>
              </div>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.75rem' }}>2. Paralel Levhalar ve Kondansatörler (Sığaçlar)</h2>
              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                Gerilim uygulanan paralel iki levha arasında düzgün bir elektrik alan oluşur. Bu alanın değeri levhalar arasındaki her noktada aynıdır ve formülü şudur:
                <br />
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#a78bfa' }}>{"E = \\frac{V}{d}"}</span> (V: Gerilim, d: Uzaklık).
              </p>

              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                Elektrik yükü depolamaya yarayan devre elemanlarına <strong>sığaç (kondansatör)</strong> denir. Bir sığacın kapasitesi (C) ve depolayabileceği maksimum yük (Q) şu bağıntılarla hesaplanır:
              </p>

              <div style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.15)', borderLeft: '4px solid #06b6d4', padding: '1rem', borderRadius: '12px', margin: '1.5rem 0', fontFamily: 'monospace' }}>
                <div style={{ fontSize: '1.2rem', color: '#cbd5e1', fontWeight: 700 }}>
                  {"C = \\epsilon \\cdot \\frac{A}{d}"} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {"Q = C \\cdot V"}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontFamily: 'sans-serif', marginTop: '0.3rem' }}>
                  C: Sığa (Farad), ε: Dielektrik katsayısı, A: Levha yüzey alanı, d: Levhalar arası uzaklık
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', margin: '1.5rem 0', overflow: 'hidden' }}>
                <div style={{ background: 'rgba(124,58,237,0.15)', borderLeft: '4px solid #7c3aed', padding: '0.75rem 1rem', fontWeight: 700, color: '#a78bfa', fontSize: '0.9rem' }}>
                  📝 ÖRNEK SORU
                </div>
                <div style={{ padding: '1rem', color: '#cbd5e1', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  Bir üretece bağlı olan paralel levhalı sığacın levhaları arasındaki uzaklık 2 katına çıkarılıyor. Buna göre;
                  <br />
                  I. Sığacın kapasitesi (C) yarıya iner.
                  <br />
                  II. Sığaçta depolanan yük (Q) yarıya iner.
                  <br />
                  III. Sığacın levhaları arasındaki gerilim (V) sabit kalır.
                  <br />
                  yargılarından hangileri doğrudur?
                  <br /><br />
                  A) Yalnız I &nbsp;&nbsp;&nbsp;&nbsp; B) Yalnız II &nbsp;&nbsp;&nbsp;&nbsp; C) I ve II &nbsp;&nbsp;&nbsp;&nbsp; D) II ve III &nbsp;&nbsp;&nbsp;&nbsp; E) I, II ve III
                </div>
                <div style={{ background: 'rgba(16,185,129,0.05)', borderLeft: '4px solid #10b981', padding: '0.75rem 1rem', fontWeight: 700, color: '#34d399', fontSize: '0.9rem' }}>
                  💡 ÇÖZÜM
                </div>
                <div style={{ padding: '1rem', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Sığaç üretece bağlı kaldığı sürece uçlarındaki gerilim (V) üretecin gerilimine eşit ve sabit kalır (III doğru).
                  <br />
                  Sığa formülünden: {"C = \\epsilon \\frac{A}{d}"} bağıntısına göre d 2 katına çıkarsa sığa C yarıya iner (I doğru).
                  <br />
                  Yük formülünden: {"Q = C \\cdot V"} bağıntısına göre V sabitken C yarıya inerse yük Q da yarıya iner (II doğru).
                  <br />
                  <strong>Doğru Cevap: E</strong>
                </div>
              </div>
            </section>
          </>
        );
      case 'manyetizma-12':
        return (
          <>
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.75rem' }}>1. Manyetik Alan ve Elektromanyetik İndüksiyon</h2>
              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                Üzerinden akım geçen bir telin etrafında manyetik alan (B) oluşur. Telin etrafında oluşan manyetik alan çizgileri halka şeklindedir ve yönü <strong>sağ el kuralı</strong> ile belirlenir.
              </p>

              <div style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.15)', borderLeft: '4px solid #06b6d4', padding: '1.15rem', borderRadius: '12px', margin: '1.5rem 0', fontFamily: 'monospace' }}>
                <h4 style={{ fontWeight: 700, color: '#cbd5e1', fontSize: '0.85rem', fontFamily: 'sans-serif', marginBottom: '0.4rem' }}>📐 İndüksiyon Elektromotor Kuvveti (EMK):</h4>
                <div style={{ fontSize: '1.2rem', color: '#cbd5e1', fontWeight: 700 }}>
                  {"\\epsilon = -\\frac{\\Delta \\Phi}{\\Delta t} = -\\frac{\\Phi_{son} - \\Phi_{ilk}}{\\Delta t}"}
                </div>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'sans-serif', margin: '0.25rem 0' }}>
                  Φ: Manyetik akı (B·A·cosθ). Formüldeki eksi işareti Lenz Yasası'ndan gelir.
                </p>
              </div>

              <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderLeft: '4px solid #f59e0b', padding: '1rem', borderRadius: '12px', margin: '1.5rem 0' }}>
                <h4 style={{ fontWeight: 700, color: '#fbbf24', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                  ⚠️ YKS ODAKLI BİLGİ / TUZAK
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0, lineHeight: 1.6 }}>
                  <strong>Lenz Yasası:</strong> İndüksiyon akımı, kendisini oluşturan neden olan akı değişimine <strong>karşı koyacak (zıt) yönde</strong> oluşur. Manyetik akı artıyorsa onu azaltacak yönde; azalıyorsa onu destekleyecek yönde bir manyetik alan yaratır.
                </p>
              </div>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.75rem' }}>2. Alternatif Akım ve Transformatörler</h2>
              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                Alternatif Akım (AC), yönü ve büyüklüğü zamanla sinüsoidal olarak değişen akımdır. Transformatörler ise alternatif gerilimi yükseltmek veya düşürmek amacıyla kullanılan cihazlardır.
              </p>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', margin: '1.5rem 0', overflow: 'hidden' }}>
                <div style={{ background: 'rgba(124,58,237,0.15)', borderLeft: '4px solid #7c3aed', padding: '0.75rem 1rem', fontWeight: 700, color: '#a78bfa', fontSize: '0.9rem' }}>
                  📝 ÖRNEK SORU
                </div>
                <div style={{ padding: '1rem', color: '#cbd5e1', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  Giriş sarım sayısı 200, çıkış sarım sayısı 600 olan ideal bir transformatörün girişine 12 V büyüklüğünde <strong>doğru akım (DC)</strong> kaynağı bağlanıyor. Buna göre transformatörün çıkış gerilimi kaç V olur?
                  <br /><br />
                  A) 0 &nbsp;&nbsp;&nbsp;&nbsp; B) 4 &nbsp;&nbsp;&nbsp;&nbsp; C) 12 &nbsp;&nbsp;&nbsp;&nbsp; D) 36 &nbsp;&nbsp;&nbsp;&nbsp; E) 72
                </div>
                <div style={{ background: 'rgba(16,185,129,0.05)', borderLeft: '4px solid #10b981', padding: '0.75rem 1rem', fontWeight: 700, color: '#34d399', fontSize: '0.9rem' }}>
                  💡 ÇÖZÜM
                </div>
                <div style={{ padding: '1rem', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Transformatörler elektromanyetik indüksiyon prensibiyle çalışır. İndüksiyon oluşabilmesi için manyetik akının zamanla değişmesi gerekir. Doğru Akım (DC) kaynağı zamanla değişmeyen sabit bir manyetik alan yaratır, dolayısıyla akı değişimi sıfırdır. Bu nedenle çıkışta herhangi bir indüksiyon EMK'sı oluşmaz ve çıkış gerilimi 0 Volt olur.
                  <br />
                  <strong>Doğru Cevap: A</strong>
                </div>
              </div>
            </section>
          </>
        );
      case 'kuvvet-hareket-11':
        return (
          <>
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.75rem' }}>1. Düzgün Çembersel Hareket ve Merkezcil Kuvvet</h2>
              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                Bir cismin dairesel bir yörüngede sabit süratle dönmesine düzgün çembersel hareket denir. Cismin sürati sabit olsa da hız vektörünün yönü sürekli değiştiği için hareket ivmelidir. Bu ivmeye <strong>merkezcil ivme</strong> denir ve yörünge merkezine doğrudur:
              </p>

              <div style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.15)', borderLeft: '4px solid #06b6d4', padding: '1rem', borderRadius: '12px', margin: '1.5rem 0', fontFamily: 'monospace' }}>
                <div style={{ fontSize: '1.25rem', color: '#cbd5e1', fontWeight: 700 }}>
                  {"F_{merkezcil} = m \\cdot a_{merkezcil} = m \\cdot \\frac{v^2}{r} = m \\cdot \\omega^2 \\cdot r"}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontFamily: 'sans-serif', marginTop: '0.3rem' }}>
                  v: Çizgisel hız, ω: Açısal hız, r: Yörünge yarıçapı
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', margin: '1.5rem 0', overflow: 'hidden' }}>
                <div style={{ background: 'rgba(124,58,237,0.15)', borderLeft: '4px solid #7c3aed', padding: '0.75rem 1rem', fontWeight: 700, color: '#a78bfa', fontSize: '0.9rem' }}>
                  📝 ÖRNEK SORU
                </div>
                <div style={{ padding: '1rem', color: '#cbd5e1', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  Sürtünmeli yatay bir virajı dönmekte olan 1000 kg kütleli bir aracın virajı emniyetle dönebileceği maksimum hız limitini bulmak için aşağıdakilerden hangisine <strong>ihtiyaç yoktur</strong>? (g = 10 m/s²)
                  <br /><br />
                  A) Lastik ile yol arasındaki sürtünme katsayısı (k)
                  <br />
                  B) Virajın yarıçapı (r)
                  <br />
                  C) Aracın kütlesi (m)
                  <br />
                  D) Yerçekimi ivmesi (g)
                  <br />
                  E) Hepsine ihtiyaç vardır.
                </div>
                <div style={{ background: 'rgba(16,185,129,0.05)', borderLeft: '4px solid #10b981', padding: '0.75rem 1rem', fontWeight: 700, color: '#34d399', fontSize: '0.9rem' }}>
                  💡 ÇÖZÜM
                </div>
                <div style={{ padding: '1rem', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Aracın savrulmadan virajı güvenle dönebilmesi için sürtünme kuvveti, merkezcil kuvvete en az eşit olmalıdır:
                  <br />
                  {"F_s \\ge F_{merkezcil} \\implies k \\cdot m \\cdot g \\ge m \\cdot \\frac{v^2}{r}"}
                  <br />
                  Denklemdeki kütleler (m) birbirini götürür:
                  <br />
                  {"v^2 \\le k \\cdot g \\cdot r \\implies v_{max} = \\sqrt{k \\cdot g \\cdot r}"}.
                  <br />
                  Dolayısıyla, maksimum güvenli dönme hızı aracın kütlesine bağlı değildir!
                  <br />
                  <strong>Doğru Cevap: C</strong>
                </div>
              </div>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.75rem' }}>2. Basit Harmonik Hareket ve Periyot Sarkaçları</h2>
              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                İki nokta arasında periyodik olarak tekrarlanan salınım hareketine basit harmonik hareket denir. Sarkaç periyodu formülleri MEB müfredatında geniş yer tutar:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1.5rem 0' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '1.25rem', borderRadius: '12px' }}>
                  <h4 style={{ fontWeight: 700, color: '#cbd5e1', marginBottom: '0.4rem' }}>🪱 Yay Sarkacı Periyodu</h4>
                  <div style={{ fontSize: '1.25rem', color: '#06b6d4', fontWeight: 700, fontFamily: 'monospace', margin: '0.5rem 0' }}>
                    {"T = 2\\pi \\cdot \\sqrt{\\frac{m}{k}}"}
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
                    m: Kütle, k: Yay sabiti. Periyot yerçekimi ivmesine bağlı değildir.
                  </p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '1.25rem', borderRadius: '12px' }}>
                  <h4 style={{ fontWeight: 700, color: '#cbd5e1', marginBottom: '0.4rem' }}>🧵 Basit Sarkaç Periyodu</h4>
                  <div style={{ fontSize: '1.25rem', color: '#7c3aed', fontWeight: 700, fontFamily: 'monospace', margin: '0.5rem 0' }}>
                    {"T = 2\\pi \\cdot \\sqrt{\\frac{L}{g}}"}
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
                    L: İpin boyu, g: Yerçekimi ivmesi. Periyot sarkaç kütlesine bağlı değildir.
                  </p>
                </div>
              </div>
            </section>
          </>
        );
      case 'dalgalar-optik-12':
        return (
          <>
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.75rem' }}>1. Işıkta Girişim ve Kırınım Deneyleri</h2>
              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                Young Deneyi (çift yarıkta girişim), ışığın dalga doğasını kanıtlayan en önemli klasik fizik deneylerinden biridir. Yarıklar arasındaki mesafenin, ekran ile fant arasındaki ortamın kırılma indisinin saçak genişliğine etkileri şu bağıntıyla açıklanır:
              </p>

              <div style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.15)', borderLeft: '4px solid #06b6d4', padding: '1rem', borderRadius: '12px', margin: '1.5rem 0', fontFamily: 'monospace' }}>
                <div style={{ fontSize: '1.25rem', color: '#cbd5e1', fontWeight: 700 }}>
                  {"\\Delta x = \\frac{\\lambda \\cdot L}{d \\cdot n}"}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontFamily: 'sans-serif', marginTop: '0.3rem' }}>
                  Δx: Saçak genişliği (iki aydınlık saçak arası mesafe), λ: Işık dalga boyu, L: Ekran uzaklığı, d: Yarık aralığı, n: Ortamın kırılma indisi
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', margin: '1.5rem 0', overflow: 'hidden' }}>
                <div style={{ background: 'rgba(124,58,237,0.15)', borderLeft: '4px solid #7c3aed', padding: '0.75rem 1rem', fontWeight: 700, color: '#a78bfa', fontSize: '0.9rem' }}>
                  📝 ÖRNEK SORU
                </div>
                <div style={{ padding: '1rem', color: '#cbd5e1', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  Çift yarıkla yapılan girişim deneyinde yeşil ışık yerine kırmızı ışık kullanıldığında aydınlık saçakların genişliği nasıl değişir?
                  <br /><br />
                  A) Azalır &nbsp;&nbsp;&nbsp;&nbsp; B) Artar &nbsp;&nbsp;&nbsp;&nbsp; C) Değişmez &nbsp;&nbsp;&nbsp;&nbsp; D) Önce artar, sonra azalır &nbsp;&nbsp;&nbsp;&nbsp; E) Tamamen kaybolur
                </div>
                <div style={{ background: 'rgba(16,185,129,0.05)', borderLeft: '4px solid #10b981', padding: '0.75rem 1rem', fontWeight: 700, color: '#34d399', fontSize: '0.9rem' }}>
                  💡 ÇÖZÜM
                </div>
                <div style={{ padding: '1rem', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Görünür ışık spektrumunda kırmızı ışığın dalga boyu (λ), yeşil ışığın dalga boyundan büyüktür ({"\\lambda_{kırmızı} > \\lambda_{yeşil}"}).
                  <br />
                  Saçak genişliği formülüne bakıldığında: {"\\Delta x = \\frac{\\lambda \\cdot L}{d \\cdot n}"} saçak genişliği dalga boyuyla doğru orantılıdır. Işığın dalga boyu büyüdüğü için saçak genişliği artacaktır.
                  <br />
                  <strong>Doğru Cevap: B</strong>
                </div>
              </div>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.75rem' }}>2. Doppler Kayması ve Elektromanyetik Dalgalar</h2>
              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                Doppler Etkisi, dalga kaynağı veya gözlemcinin birbirlerine göre hareket etmesi durumunda gözlemlenen frekansın değişmesidir.
                <br />
                Elektromanyetik Dalgalar ise ivmeli hareket eden yüklerin oluşturduğu, boşlukta ışık hızıyla yayılan enine dalgalardır. Dalga boyuna veya enerjisine göre sıralanan yapıya <strong>elektromanyetik spektrum</strong> denir.
              </p>
            </section>
          </>
        );
      case 'modern-fizik-12':
        return (
          <>
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.75rem' }}>1. Fotoelektrik Olay ve Enerji Korunumu</h2>
              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                Fotoelektrik Olay, metal yüzeye gönderilen yeterince yüksek enerjili fotonların yüzeyden elektron sökmesidir. Işığın tanecikli kuantum yapısını destekler. Einstein'ın fotoelektrik denklemi enerji korunumuna dayanır:
              </p>

              <div style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.15)', borderLeft: '4px solid #06b6d4', padding: '1rem', borderRadius: '12px', margin: '1.5rem 0', fontFamily: 'monospace' }}>
                <div style={{ fontSize: '1.25rem', color: '#cbd5e1', fontWeight: 700 }}>
                  {"E_{foton} = E_b + E_k"} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {"h \\cdot f = h \\cdot f_0 + E_k"}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontFamily: 'sans-serif', marginTop: '0.3rem' }}>
                  Eb: Metalin eşik (bağlanma) enerjisi (yalnızca metalin cinsine bağlıdır), Ek: Sökülen elektronun maksimum kinetik enerjisi
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', margin: '1.5rem 0', overflow: 'hidden' }}>
                <div style={{ background: 'rgba(124,58,237,0.15)', borderLeft: '4px solid #7c3aed', padding: '0.75rem 1rem', fontWeight: 700, color: '#a78bfa', fontSize: '0.9rem' }}>
                  📝 ÖRNEK SORU
                </div>
                <div style={{ padding: '1rem', color: '#cbd5e1', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  Bağlanma enerjisi 2.0 eV olan bir metal yüzeye enerjisi 5.0 eV olan fotonlar gönderiliyor. Buna göre metalden sökülen elektronların maksimum kinetik enerjisi kaç eV olur?
                  <br /><br />
                  A) 1.5 &nbsp;&nbsp;&nbsp;&nbsp; B) 2.0 &nbsp;&nbsp;&nbsp;&nbsp; C) 3.0 &nbsp;&nbsp;&nbsp;&nbsp; D) 5.0 &nbsp;&nbsp;&nbsp;&nbsp; E) 7.0
                </div>
                <div style={{ background: 'rgba(16,185,129,0.05)', borderLeft: '4px solid #10b981', padding: '0.75rem 1rem', fontWeight: 700, color: '#34d399', fontSize: '0.9rem' }}>
                  💡 ÇÖZÜM
                </div>
                <div style={{ padding: '1rem', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Einstein'ın Fotoelektrik denklemini yazarsak:
                  <br />
                  {"E_{foton} = E_b + E_k"}
                  <br />
                  {"5.0\\ eV = 2.0\\ eV + E_k \\implies E_k = 3.0\\ eV"}.
                  <br />
                  <strong>Doğru Cevap: C</strong>
                </div>
              </div>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.75rem' }}>2. Compton Saçılması ve Bohr Atom Modeli</h2>
              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                • <strong>Compton Olayı:</strong> Yüksek enerjili bir X-ışını fotonunun durgun bir serbest elektronla esnek çarpışması olayıdır. Çarpışma sonucunda momentum korunur. Saçılan fotonun enerjisi azaldığı için dalga boyu artar, ancak <strong>hızı değişmez (ışık hızı c)</strong>.
                <br /><br />
                • <strong>Bohr Atom Modeli:</strong> Çekirdek çevresindeki elektronların sadece açısal momentumunun belirli katları olan kararlı yörüngelerde ({"L = n \\cdot \\frac{h}{2\\pi}"}) ışıma yapmadan dolandığını öne sürer.
              </p>
            </section>
          </>
        );
      case 'modern-teknoloji-12':
        return (
          <>
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.75rem' }}>1. Yarı İletkenler ve Devre Elemanları</h2>
              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                Katkılama yöntemiyle iletkenlik özellikleri değiştirilebilen maddelere yarı iletken denir (Silisyum, Germanyum). Modern elektroniğin ve entegre devrelerin (çiplerin) yapı taşları bunlardır:
              </p>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '1.25rem', borderRadius: '12px', margin: '1.5rem 0', fontSize: '0.9rem', color: '#cbd5e1' }}>
                • <strong>Diyot:</strong> Akımı yalnızca tek bir yönde geçiren yarı iletken devre elemanıdır. Alternatif akımı doğrultmada (AC to DC) kullanılır.
                <br /><br />
                • <strong>Transistör:</strong> Girişine uygulanan küçük bir elektrik sinyalini (akımı/gerilimi) yükseltmeye yarayan ya da anahtarlama elemanı olarak çalışan üç terminalli yarı iletken elemandır.
                <br /><br />
                • <strong>LED:</strong> Üzerinden akım geçtiğinde doğrudan görünür bölgede ışık yayan diyottur. Elektrik enerjisini yüksek verimle ışığa dönüştürür.
              </div>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.75rem' }}>2. Süperiletkenlik ve Tıbbi Görüntüleme Teknolojisi</h2>
              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                Belirli bir kritik sıcaklığın altında dirençleri tamamen sıfır olan ve içlerindeki manyetik alanı dışlayan (Meissner Etkisi) malzemelere <strong>süperiletken</strong> denir.
              </p>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', margin: '1.5rem 0', overflow: 'hidden' }}>
                <div style={{ background: 'rgba(124,58,237,0.15)', borderLeft: '4px solid #7c3aed', padding: '0.75rem 1rem', fontWeight: 700, color: '#a78bfa', fontSize: '0.9rem' }}>
                  📝 ÖRNEK SORU
                </div>
                <div style={{ padding: '1rem', color: '#cbd5e1', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  Aşağıdaki tıbbi görüntüleme cihazlarından hangisinde çalışma prensibi olarak <strong>radyasyon (X-ışını veya gama) kullanılmaz</strong>?
                  <br /><br />
                  A) Bilgisayarlı Tomografi (BT) &nbsp;&nbsp;&nbsp;&nbsp; B) Röntgen &nbsp;&nbsp;&nbsp;&nbsp; C) PET (Pozitron Emisyon Tomografisi) &nbsp;&nbsp;&nbsp;&nbsp; D) MR (Manyetik Rezonans) &nbsp;&nbsp;&nbsp;&nbsp; E) Floroskopi
                </div>
                <div style={{ background: 'rgba(16,185,129,0.05)', borderLeft: '4px solid #10b981', padding: '0.75rem 1rem', fontWeight: 700, color: '#34d399', fontSize: '0.9rem' }}>
                  💡 ÇÖZÜM
                </div>
                <div style={{ padding: '1rem', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Röntgen ve Bilgisayarlı Tomografi cihazlarında X-ışınları, PET cihazında ise radyoaktif maddelerden yayılan pozitronlar ve gama ışınları kullanılır. MR cihazında ise güçlü manyetik alanlar ve radyo dalgaları kullanılarak hidrojen atomlarının rezonansı ölçülür. MR ve ultrason (ses dalgaları) cihazlarında radyasyon yoktur.
                  <br />
                  <strong>Doğru Cevap: D</strong>
                </div>
              </div>
            </section>
          </>
        );
      default:
        return (
          <>
            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.75rem' }}>1. Konunun Temelleri</h2>
              <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '1rem' }}>
                Bu ünitede fizik biliminin temel prensipleri, formülleri ve bunların deneysel uygulamaları ele alınmaktadır. Konunun kavranması için formüllerin mantığını anlamak ve bol soru çözmek kritik öneme sahiptir.
              </p>
              <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', padding: '1rem', borderRadius: '12px', margin: '1rem 0' }}>
                <h4 style={{ fontWeight: 700, color: '#a78bfa', marginBottom: '0.5rem' }}>💡 Önemli İpucu:</h4>
                <p style={{ fontSize: '0.875rem', color: '#cbd5e1', margin: 0, lineHeight: 1.6 }}>
                  Simülasyon sekmesini kullanarak parametreleri değiştirip olayların eş zamanlı olarak nasıl tepki verdiğini inceleyebilirsiniz. Bu, formülleri ezberlemek yerine görsel hafıza oluşturmanıza yardımcı olacaktır.
                </p>
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div style={{ background: '#050a1a', minHeight: '100vh', color: '#f8fafc' }}>
      {/* Reading Progress bar */}
      {aktifTab === 'anlatim' && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', zIndex: 9999 }}>
          <div style={{ width: `${okumaIlerlemesi}%`, height: '100%', background: 'linear-gradient(90deg, #7c3aed, #06b6d4)', transition: 'width 0.1s ease' }} />
        </div>
      )}

      <FizikNavbar />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 1.5rem 4rem' }}>
        {/* Back Link */}
        <Link href="/fizik-yildizi/ogrenci/konular" style={{ color: '#64748b', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
          ← Konulara Dön
        </Link>

        {/* Header Section */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '2.5rem' }}>{konu.ikon}</span>
              <div>
                <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderRadius: '6px', background: `${konu.renk}20`, border: `1px solid ${konu.renk}40`, color: konu.renk, fontWeight: 700 }}>
                  {konu.sinif}. Sınıf
                </span>
                <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#f8fafc', marginTop: '0.35rem' }}>{konu.baslik}</h1>
              </div>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '700px' }}>{konu.aciklama}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
              Konu Tamamlama Durumu
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ color: tamamlandi ? '#10b981' : '#64748b', fontSize: '1rem', fontWeight: 700 }}>
                {tamamlandi ? '100% (Tamamlandı)' : '0%'}
              </span>
              <button 
                onClick={konuyuTamamla} 
                disabled={tamamlandi}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: tamamlandi ? 'default' : 'pointer',
                  background: tamamlandi ? 'rgba(16,185,129,0.15)' : 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                  color: tamamlandi ? '#10b981' : 'white',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  transition: 'opacity 0.2s',
                }}
              >
                {tamamlandi ? '✓ Tamamlandı' : 'Tamamladım'}
              </button>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }}>
          {/* Main Area */}
          <div>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.4rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
              {[
                { id: 'anlatim', label: '📖 Konu Anlatımı' },
                { id: 'simulasyon', label: '🧪 Etkileşimli Simülasyon' },
                { id: 'notlar', label: '📝 Notlarım' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setAktifTab(tab.id as Tab)}
                  style={{
                    padding: '0.5rem 1.25rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    background: aktifTab === tab.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                    color: aktifTab === tab.id ? '#06b6d4' : '#64748b',
                    transition: 'all 0.2s',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Panels */}
            <div className="fy-card" style={{ padding: '2rem', minHeight: '400px' }}>
              {aktifTab === 'anlatim' && (
                <div ref={contentRef} style={{ animation: 'fadeIn 0.3s ease' }}>
                  {renderLessonContent()}
                  
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '2rem', marginTop: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Sayfanın sonuna ulaştınız. Konuyu bitirdiyseniz tamamla tuşuna basın.</p>
                    <button 
                      onClick={konuyuTamamla} 
                      disabled={tamamlandi}
                      style={{
                        padding: '0.65rem 1.25rem',
                        borderRadius: '10px',
                        border: 'none',
                        cursor: tamamlandi ? 'default' : 'pointer',
                        background: tamamlandi ? 'rgba(16,185,129,0.15)' : 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                        color: tamamlandi ? '#10b981' : 'white',
                        fontWeight: 700,
                      }}
                    >
                      {tamamlandi ? '✓ Konu Bitirildi' : 'Konuyu Bitir'}
                    </button>
                  </div>
                </div>
              )}

              {aktifTab === 'simulasyon' && (
                <div style={{ animation: 'fadeIn 0.3s ease' }}>
                  {renderSimulation()}
                </div>
              )}

              {aktifTab === 'notlar' && (
                <div style={{ animation: 'fadeIn 0.3s ease' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.75rem' }}>📝 Konu Not Defteri</h3>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                    Çalışırken aldığın kişisel notlar tarayıcında saklanır. İstediğin zaman buradan ulaşabilirsin.
                  </p>
                  <textarea
                    value={not}
                    onChange={(e) => notuKaydet(e.target.value)}
                    placeholder="Konu ile ilgili notlarınızı buraya yazın..."
                    style={{
                      width: '100%',
                      height: '220px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                      padding: '1rem',
                      color: '#f8fafc',
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                    <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 600 }}>✓ Otomatik Kaydedildi</span>
                    <button 
                      onClick={() => notuKaydet('')}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                    >
                      Notu Temizle
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Quick Test */}
            <div className="fy-card" style={{ padding: '1.25rem', border: '1px solid rgba(124,58,237,0.25)', background: 'rgba(124,58,237,0.05)' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.4rem', color: '#a78bfa' }}>⚡ Kendini Sına!</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.78rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                Bu konuya özel adaptif sorulardan hazırlanan 10 soruluk testi çöz, eksiklerini anında tespit et.
              </p>
              <Link
                href={`/fizik-yildizi/ogrenci/test/${konu.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  textAlign: 'center',
                  boxShadow: '0 4px 15px rgba(124,58,237,0.3)',
                }}
              >
                Test Çözmeye Başla
              </Link>
            </div>

            {/* Alt Konular */}
            <div className="fy-card" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem', color: '#f8fafc' }}>📌 Alt Konular</h3>
              <ul style={{ listStyleType: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {konu.altKonular.map((ak) => (
                  <li key={ak.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                    <div style={{ color: '#cbd5e1', fontSize: '0.82rem', fontWeight: 600 }}>{ak.baslik}</div>
                    <div style={{ color: '#64748b', fontSize: '0.72rem' }}>{ak.aciklama}</div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kazanımlar */}
            <div className="fy-card" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem', color: '#06b6d4' }}>🎯 MEB Kazanımları</h3>
              <ul style={{ listStyleType: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {konu.altKonular.flatMap(ak => ak.kazanimlar).slice(0, 6).map((k, idx) => (
                  <li key={idx} style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.5, display: 'flex', gap: '0.4rem' }}>
                    <span style={{ color: '#06b6d4' }}>•</span>
                    <span>{k}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}


