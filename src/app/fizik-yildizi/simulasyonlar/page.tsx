'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import SerbrestDusme from '@/components/fizik-yildizi/simulations/SerbrestDusme';
import AtisHareketi from '@/components/fizik-yildizi/simulations/AtisHareketi';
import DalgaHareketi from '@/components/fizik-yildizi/simulations/DalgaHareketi';
import ElektrikDevresi from '@/components/fizik-yildizi/simulations/ElektrikDevresi';
import OptikMercek from '@/components/fizik-yildizi/simulations/OptikMercek';

const PendulumSim = dynamic(() => import('@/components/fizik-yildizi/simulations/PendulumSim'), { ssr: false });
const SpringSim = dynamic(() => import('@/components/fizik-yildizi/simulations/SpringSim'), { ssr: false });
const KeplerYorungeler = dynamic(() => import('@/components/fizik-yildizi/simulations/KeplerYorungeler'), { ssr: false });
const FotoelektrikEtki = dynamic(() => import('@/components/fizik-yildizi/simulations/FotoelektrikEtki'), { ssr: false });
const CarpismaLaboratuvari = dynamic(() => import('@/components/fizik-yildizi/simulations/CarpismaLaboratuvari'), { ssr: false });
const MekanikEnerjiKorunumu = dynamic(() => import('@/components/fizik-yildizi/simulations/MekanikEnerjiKorunumu'), { ssr: false });
const ArsimedKuvveti = dynamic(() => import('@/components/fizik-yildizi/simulations/ArsimedKuvveti'), { ssr: false });
const GazYasalari = dynamic(() => import('@/components/fizik-yildizi/simulations/GazYasalari'), { ssr: false });

type SimType = 'serbest-dusme' | 'atis-hareketi' | 'dalga' | 'elektrik' | 'optik' | 'sarkac' | 'yay' | 'kepler' | 'fotoelektrik' | 'carpisma' | 'enerji' | 'arsimed' | 'gaz';

interface SimItem {
  id: SimType;
  title: string;
  desc: string;
  icon: string;
  color: string;
  grade: string;
}

const SIMULATIONS: SimItem[] = [
  {
    id: 'serbest-dusme',
    title: 'Serbest Düşme',
    desc: 'Yerçekimi ivmesi ve hava direncinin düşen cisimler üzerindeki etkisini inceleyin.',
    icon: '☄️',
    color: '#06b6d4',
    grade: '9. Sınıf',
  },
  {
    id: 'atis-hareketi',
    title: 'Eğik Atış Hareketi',
    desc: 'Farklı hız ve açılarla fırlatılan cisimlerin parabolik yörüngelerini gözlemleyin.',
    icon: '🚀',
    color: '#7c3aed',
    grade: '9. & 11. Sınıf',
  },
  {
    id: 'dalga',
    title: 'Dalga Hareketi',
    desc: 'Enine ve boyuna dalgaların yayılımını, genlik ve frekans ilişkisini test edin.',
    icon: '🌊',
    color: '#10b981',
    grade: '10. Sınıf',
  },
  {
    id: 'elektrik',
    title: 'Elektrik Devreleri',
    desc: 'Seri, paralel ve karma devrelerde Ohm Kanunu ile Kirchhoff yasalarını test edin.',
    icon: '⚡',
    color: '#fbbf24',
    grade: '10. & 12. Sınıf',
  },
  {
    id: 'optik',
    title: 'Mercek Optiği',
    desc: 'İnce ve kalın kenarlı merceklerde kırılan ışınları ve görüntü oluşumunu çizin.',
    icon: '🔍',
    color: '#ec4899',
    grade: '10. Sınıf',
  },
  {
    id: 'sarkac',
    title: 'Basit Sarkaç',
    desc: 'Farklı uzunluk, kütle ve gezegen yerçekimlerinde sarkaç hareketini ve periyodunu keşfedin.',
    icon: '🕰️',
    color: '#6366f1',
    grade: '10. & 11. Sınıf',
  },
  {
    id: 'yay',
    title: 'Yay-Kütle Sistemi',
    desc: 'Hooke yasasını, basit harmonik hareketi ve enerji korunumunu interaktif simülasyonla gözlemleyin.',
    icon: '🌀',
    color: '#a855f7',
    grade: '11. Sınıf',
  },
  {
    id: 'kepler',
    title: 'Kepler ve Yörüngeler',
    desc: 'Gezegenlerin yörünge hareketlerini kütleçekim kuvveti ile modelleyin.',
    icon: '🪐',
    color: '#38bdf8',
    grade: '12. Sınıf',
  },
  {
    id: 'fotoelektrik',
    title: 'Fotoelektrik Etki',
    desc: 'Işığın metal yüzeyden elektron koparmasını ve enerji korunumu ilişkisini inceleyin.',
    icon: '💡',
    color: '#eab308',
    grade: '12. Sınıf',
  },
  {
    id: 'carpisma',
    title: 'Çarpışma Laboratuvarı',
    desc: 'Esnek ve esnek olmayan çarpışmalarda momentum ve enerji korunumunu test edin.',
    icon: '💥',
    color: '#f43f5e',
    grade: '11. Sınıf',
  },
  {
    id: 'enerji',
    title: 'Mekanik Enerji Korunumu',
    desc: 'Sürtünmesiz sistemlerde potansiyel ve kinetik enerji dönüşümlerini grafiklerle izleyin.',
    icon: '🎢',
    color: '#22c55e',
    grade: '9. & 11. Sınıf',
  },
  {
    id: 'arsimed',
    title: 'Arşimet Kuvveti (Kaldırma)',
    desc: 'Sıvıların cisimlere uyguladığı kaldırma kuvvetini yoğunluk değiştirerek gözlemleyin.',
    icon: '🚢',
    color: '#0ea5e9',
    grade: '10. Sınıf',
  },
  {
    id: 'gaz',
    title: 'İdeal Gaz Yasaları',
    desc: 'Basınç, hacim ve sıcaklık ilişkilerini izotermal ve izobarik süreçlerde keşfedin.',
    icon: '🎈',
    color: '#d946ef',
    grade: '11. Sınıf',
  },
];

export default function SimulasyonLaboratuvariPage() {
  const [activeSim, setActiveSim] = useState<SimType>('serbest-dusme');

  const activeInfo = SIMULATIONS.find(s => s.id === activeSim)!;

  const renderSimComponent = () => {
    switch (activeSim) {
      case 'serbest-dusme': return <SerbrestDusme />;
      case 'atis-hareketi': return <AtisHareketi />;
      case 'dalga': return <DalgaHareketi />;
      case 'elektrik': return <ElektrikDevresi />;
      case 'optik': return <OptikMercek />;
      case 'sarkac': return <PendulumSim />;
      case 'yay': return <SpringSim />;
      case 'kepler': return <KeplerYorungeler />;
      case 'fotoelektrik': return <FotoelektrikEtki />;
      case 'carpisma': return <CarpismaLaboratuvari />;
      case 'enerji': return <MekanikEnerjiKorunumu />;
      case 'arsimed': return <ArsimedKuvveti />;
      case 'gaz': return <GazYasalari />;
      default: return null;
    }
  };

  const renderTheory = () => {
    switch (activeSim) {
      case 'serbest-dusme':
        return (
          <>
            <h4 style={{ color: '#06b6d4', fontWeight: 700, marginBottom: '0.5rem' }}>📐 Fizik Teorisi: Serbest Düşme</h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              Serbest düşme, bir cismin sadece yerçekimi kuvveti (ağırlık) etkisi altında yaptığı harekettir. Hava direncinin olmadığı
              ortamlarda tüm cisimler kütlelerinden bağımsız olarak aynı ivmeyle (yerçekimi ivmesi: <strong>g</strong>) düşer.
            </p>
            <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#e2e8f0', marginBottom: '0.75rem' }}>
              Yükseklik: h(t) = h₀ - 1/2 · g · t² <br />
              Hız: v(t) = g · t <br />
              Hava Direnci (Varsa): F_d = k · A · v²
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>
              * Limit Hız (Terminal Velocity): Hava dirençli ortamda limit hıza ulaşan cismin ivmesi sıfır olur ve cisim sabit hızla düşer.
            </p>
          </>
        );
      case 'atis-hareketi':
        return (
          <>
            <h4 style={{ color: '#7c3aed', fontWeight: 700, marginBottom: '0.5rem' }}>📐 Fizik Teorisi: İki Boyutta Atış</h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              Eğik atış, yerçekimi ivmesinin sabit olduğu sürtünmesiz ortamda iki boyutta gerçekleşen ivmeli harekettir.
              Cisim yatay eksende sabit hızlı (hız değişmez: <strong>vx = v₀ · cosθ</strong>), düşey eksende ise yerçekimi etkisiyle
              aşağı yönlü sabit ivmeli (<strong>g</strong>) hareket yapar.
            </p>
            <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#e2e8f0', marginBottom: '0.75rem' }}>
              Yatay Konum: x(t) = v₀ · cos(θ) · t <br />
              Düşey Konum: y(t) = v₀ · sin(θ) · t - 1/2 · g · t² <br />
              Maksimum Yükseklik: h_max = (v₀ · sinθ)² / (2g)
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>
              * Menzil: Sürtünmesiz ortamda fırlatılan cisim 45 derecelik açıyla atıldığında maksimum menzile (erişim mesafesine) ulaşır.
            </p>
          </>
        );
      case 'dalga':
        return (
          <>
            <h4 style={{ color: '#10b981', fontWeight: 700, marginBottom: '0.5rem' }}>📐 Fizik Teorisi: Dalgalar</h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              Dalga, bir ortamda oluşan sarsıntının veya titreşimin bir noktadan diğerine enerji taşıyarak yayılmasıdır.
              Maddesel ortam gerektiren dalgalara mekanik dalgalar (ses, deprem, su dalgası), gerektirmeyenlere elektromanyetik dalgalar denir.
            </p>
            <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#e2e8f0', marginBottom: '0.75rem' }}>
              Periyot (T): Bir tam dalganın oluşması için geçen süre. <br />
              Frekans (f = 1/T): Bir saniyede üretilen dalga sayısı. <br />
              Dalga Hızı: v = λ · f (λ: Dalga boyu)
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>
              * Enine Dalga: Titreşim doğrultusu yayılma doğrultusuna diktir. (Işık dalgası)<br />
              * Boyuna Dalga: Titreşim doğrultusu yayılma doğrultusuna paraleldir. (Ses dalgası)
            </p>
          </>
        );
      case 'elektrik':
        return (
          <>
            <h4 style={{ color: '#fbbf24', fontWeight: 700, marginBottom: '0.5rem' }}>📐 Fizik Teorisi: Doğru Akım Devreleri</h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              Bir elektrik devresinde akım, gerilim ve direnç arasındaki ilişkiyi Ohm Kanunu açıklar. Kirchhoff Akım Yasası
              düğümlerdeki yük korunumunu, Kirchhoff Gerilim Yasası ise ilmeklerdeki enerjinin korunumunu tanımlar.
            </p>
            <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#e2e8f0', marginBottom: '0.75rem' }}>
              Ohm Kanunu: V = I · R <br />
              Seri Bağlantı: R_toplam = R₁ + R₂ + R₃ <br />
              Paralel Bağlantı: 1/R_toplam = 1/R₁ + 1/R₂ + 1/R₃
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>
              * Kısa Devre: Akımın, direnci çok küçük olan paralel koldan geçerek sistemi devre dışı bırakması olayıdır.
            </p>
          </>
        );
      case 'optik':
        return (
          <>
            <h4 style={{ color: '#ec4899', fontWeight: 700, marginBottom: '0.5rem' }}>📐 Fizik Teorisi: Geometrik Optik ve Mercekler</h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              Mercekler, ışığı kırarak görüntü oluşturmaya yarayan en az bir yüzeyi küresel olan saydam ortamlardır.
              İnce kenarlı (yakınsak) mercekler ışığı toplarken, kalın kenarlı (iraksak) mercekler ışığı dağıtır.
            </p>
            <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#e2e8f0', marginBottom: '0.75rem' }}>
              Mercek Bağıntısı: 1/f = 1/d_o + 1/d_i <br />
              Büyütme Oranı (m): m = - d_i / d_o <br />
              Görüntü Boyu: h_i = m · h_o
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>
              * Sanal Görüntü: Kırılan ışınların uzantılarının kesişmesiyle oluşur ve düzdür. (İnce kenarlı mercekte cisim odak içindeyken)<br />
              * Gerçek Görüntü: Kırılan ışınların kendilerinin kesişmesiyle oluşur ve terstir. (Lensin diğer tarafında oluşur)
            </p>
          </>
        );
      case 'kepler':
        return (
          <>
            <h4 style={{ color: '#38bdf8', fontWeight: 700, marginBottom: '0.5rem' }}>📐 Fizik Teorisi: Kütleçekim ve Kepler Yasaları</h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              Gezegenler, odaklarından birinde Güneş bulunan eliptik yörüngelerde dolanırlar. Kütleçekim kuvveti, yörünge hareketini sağlayan merkezcil kuvvettir.
            </p>
            <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#e2e8f0', marginBottom: '0.75rem' }}>
              Kütleçekim Kuvveti: F = G · (M₁ · M₂) / r² <br />
              Merkezcil İvme: a = v² / r <br />
              Kaçış Hızı: v_kaçış = √(2GM / r)
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>
              * Yörünge Hızı: Dairesel yörüngede dolanan bir gezegenin hızı, merkeze olan uzaklığın kareköküyle ters orantılıdır.
            </p>
          </>
        );
      case 'fotoelektrik':
        return (
          <>
            <h4 style={{ color: '#eab308', fontWeight: 700, marginBottom: '0.5rem' }}>📐 Fizik Teorisi: Fotoelektrik Olay</h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              Işığın (fotonların) bir metal yüzeyine çarparak elektron sökmesi olayına fotoelektrik etki denir. Einstein bu olayla ışığın tanecikli yapısını kanıtlamıştır.
            </p>
            <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#e2e8f0', marginBottom: '0.75rem' }}>
              Foton Enerjisi: E = h · f = h · c / λ <br />
              Einstein Denklemi: E_foton = W_bağlanma + K.E._maks <br />
              Kesme Potansiyeli: V_kesme = K.E._maks / e
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>
              * Eşik Frekansı: Elektrona sadece yüzeyden kopması için yeten enerjiye bağlanma (eşik) enerjisi, bu frekansa da eşik frekansı denir.
            </p>
          </>
        );
      case 'carpisma':
        return (
          <>
            <h4 style={{ color: '#f43f5e', fontWeight: 700, marginBottom: '0.5rem' }}>📐 Fizik Teorisi: Çarpışmalar ve İtme-Momentum</h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              İzole bir sistemde (dış kuvvet yoksa) her türlü çarpışmada çizgisel momentum korunur. Çarpışmalar esnek ve esnek olmayan olarak ikiye ayrılır.
            </p>
            <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#e2e8f0', marginBottom: '0.75rem' }}>
              Momentum: P = m · v <br />
              Momentum Korunumu: m₁v₁ + m₂v₂ = m₁v₁' + m₂v₂' <br />
              Kinetik Enerji: K.E = 1/2 · m · v²
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>
              * Esnek Çarpışma: Momentum ve kinetik enerji korunur.<br />
              * Esnek Olmayan Çarpışma: Sadece momentum korunur, kinetik enerjinin bir kısmı ısıya/şekil değişikliğine harcanır.
            </p>
          </>
        );
      case 'enerji':
        return (
          <>
            <h4 style={{ color: '#22c55e', fontWeight: 700, marginBottom: '0.5rem' }}>📐 Fizik Teorisi: Mekanik Enerji Korunumu</h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              Dışarıdan bir kuvvet (sürtünme gibi) iş yapmıyorsa, sistemin mekanik enerjisi (kinetik ve potansiyel enerjilerin toplamı) daima sabit kalır.
            </p>
            <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#e2e8f0', marginBottom: '0.75rem' }}>
              Kinetik Enerji (K.E.): 1/2 · m · v² <br />
              Yerçekimi Potansiyel E. (P.E.): m · g · h <br />
              Mekanik Enerji Korunumu: E_ilk = E_son
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>
              * Enerji Dönüşümü: Yukarı atılan cisim yavaşlarken kinetik enerjisi potansiyel enerjiye dönüşür. Toplam enerji aynı kalır.
            </p>
          </>
        );
      case 'arsimed':
        return (
          <>
            <h4 style={{ color: '#0ea5e9', fontWeight: 700, marginBottom: '0.5rem' }}>📐 Fizik Teorisi: Kaldırma Kuvveti</h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              Sıvı içine batan cisme, sıvı tarafından yerini değiştirdiği sıvının ağırlığına eşit büyüklükte ve yukarı yönde bir kuvvet etki eder.
            </p>
            <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#e2e8f0', marginBottom: '0.75rem' }}>
              Kaldırma Kuvveti: F_k = V_batan · d_sıvı · g <br />
              Cisim Ağırlığı: G = m · g = V_cisim · d_cisim · g <br />
              Denge Şartı: Yüzen veya askıda kalan cisimde F_k = G
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>
              * Yüzme Şartı: Cismin özkütlesi sıvının özkütlesinden küçükse (d_cisim &lt; d_sıvı) cisim yüzer.
            </p>
          </>
        );
      case 'gaz':
        return (
          <>
            <h4 style={{ color: '#d946ef', fontWeight: 700, marginBottom: '0.5rem' }}>📐 Fizik Teorisi: İdeal Gaz Yasaları</h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              Gazların basıncı, hacmi ve sıcaklığı arasındaki ilişki ideal gaz denklemi ile ifade edilir. Sıcaklık mutlaka Kelvin cinsinden alınmalıdır.
            </p>
            <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#e2e8f0', marginBottom: '0.75rem' }}>
              İdeal Gaz Denklemi: P · V = n · R · T <br />
              Boyle Yasası (Sabit T): P₁ · V₁ = P₂ · V₂ <br />
              Charles Yasası (Sabit P): V₁ / T₁ = V₂ / T₂
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>
              * Mutlak Sıfır (-273.15 °C): Teorik olarak gaz hacminin ve basıncının sıfıra indiği en düşük sıcaklıktır.
            </p>
          </>
        );
    }
  };

  return (
    <div style={{ background: '#050a1a', minHeight: '100vh', color: '#f8fafc', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '0.5rem' }}>
            🧪 Fizik Yıldızı Sanal Laboratuvarı
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
            Fizik kurallarını interaktif olarak deneyimleyin, parametreleri değiştirerek sonuçları grafiksel ve sayısal olarak analiz edin.
          </p>
        </div>

        {/* Layout Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem', alignItems: 'start' }}>
          
          {/* Simulation Selectors Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', padding: '0 0.5rem' }}>
              Deney Listesi
            </div>
            {SIMULATIONS.map((sim) => {
              const isActive = activeSim === sim.id;
              return (
                <button
                  key={sim.id}
                  onClick={() => setActiveSim(sim.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '1.1rem',
                    borderRadius: '16px',
                    border: '1px solid',
                    borderColor: isActive ? sim.color + '60' : 'rgba(255, 255, 255, 0.06)',
                    background: isActive ? sim.color + '10' : 'rgba(255, 255, 255, 0.02)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>{sim.icon}</span>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: isActive ? sim.color : '#f8fafc', flex: 1 }}>{sim.title}</span>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.05)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                      {sim.grade}
                    </span>
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.78rem', lineHeight: 1.4 }}>{sim.desc}</div>
                </button>
              );
            })}
          </div>

          {/* Active Simulation & Theory Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* The Simulation Component Container */}
            <div style={{ background: 'rgba(255,255,255,0.01)', borderRadius: '24px', overflow: 'hidden' }}>
              {renderSimComponent()}
            </div>

            {/* Theory Card */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '1.5rem', backdropFilter: 'blur(10px)' }}>
              {renderTheory()}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
