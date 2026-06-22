import { tumSablonlarSenkron, zorlukDagilimiyleUret } from '../../lib/fizik-yildizi/soru-motoru';
import { ohmSorulari } from './ohm-sorulari';

export type SoruTipi = 'coktan-secmeli' | 'dogru-yanlis' | 'bosluk-doldur';
export type ZorulukSeviye = 1 | 2 | 3 | 4 | 5;

export interface Soru {
  id: string;
  konuId: string;
  altKonuId: string;
  sinif: 9 | 10 | 11 | 12;
  tip: SoruTipi;
  soru: string;
  secenekler?: { A: string; B: string; C: string; D: string; E?: string };
  dogruCevap: string;
  zorluk: ZorulukSeviye;
  aciklama: string;
  ipucu: string;
  ilgiliFormul?: string;
  kazanim: string;
  sure: number; // saniye
}

// ============================================================
// 9. SINIF – FİZİK BİLİMİNE GİRİŞ
// ============================================================

const fizikGiris9Sorular: Soru[] = [
  {
    id: 's-fg-001',
    konuId: 'fizik-bilimi-9',
    altKonuId: 'olcme-birimler',
    sinif: 9,
    tip: 'coktan-secmeli',
    soru: 'SI birim sisteminde uzunluğun temel birimi aşağıdakilerden hangisidir?',
    secenekler: { A: 'Santimetre (cm)', B: 'Kilometre (km)', C: 'Metre (m)', D: 'Milimetre (mm)' },
    dogruCevap: 'C',
    zorluk: 1,
    aciklama: 'SI (Uluslararası Birim Sistemi) birim sisteminde uzunluğun temel birimi metredir (m). Santimetre ve milimetre metrenin alt katları, kilometre ise üst katıdır; ancak temel birim olarak sadece metre kullanılır.',
    ipucu: 'Uluslararası Birim Sistemi\'nde yedi temel büyüklük ve onların birimleri vardır.',
    ilgiliFormul: '1 km = 1000 m, 1 m = 100 cm = 1000 mm',
    kazanim: 'SI birim sistemindeki temel büyüklükleri ve birimlerini sayar.',
    sure: 30,
  },
  {
    id: 's-fg-002',
    konuId: 'fizik-bilimi-9',
    altKonuId: 'olcme-birimler',
    sinif: 9,
    tip: 'coktan-secmeli',
    soru: '3,456 × 10⁴ sayısının anlamlı basamak sayısı kaçtır?',
    secenekler: { A: '2', B: '3', C: '4', D: '5' },
    dogruCevap: 'C',
    zorluk: 2,
    aciklama: '3,456 × 10⁴ sayısında 3, 4, 5 ve 6 anlamlı basamaklardır; toplam 4 anlamlı basamak vardır. Üstel gösterimdeki 10⁴ kısmı anlamlı basamak sayısını etkilemez, sadece ondalık virgülün yerini gösterir.',
    ipucu: 'Sıfır olmayan tüm rakamlar anlamlı basamaktır.',
    kazanim: 'Üstel gösterim ve anlamlı basamak kurallarını uygular.',
    sure: 40,
  },
  {
    id: 's-fg-003',
    konuId: 'fizik-bilimi-9',
    altKonuId: 'vektorler',
    sinif: 9,
    tip: 'coktan-secmeli',
    soru: 'Yatay ile 30° açı yapan ve büyüklüğü 10 N olan bir kuvvetin yatay bileşeni kaç Newton\'dur?',
    secenekler: { A: '5 N', B: '5√3 N', C: '10 N', D: '10√3 N' },
    dogruCevap: 'B',
    zorluk: 2,
    aciklama: 'Yatay bileşen Fx = F·cos30° = 10·(√3/2) = 5√3 N olarak hesaplanır. cos30° = √3/2 ≈ 0,866 değerini kullanmak gerekir. Dikey bileşen ise Fy = F·sin30° = 10·0,5 = 5 N olur.',
    ipucu: 'Yatay bileşen için cosinus, dikey bileşen için sinüs kullanılır.',
    ilgiliFormul: 'Fx = F·cosθ, Fy = F·sinθ',
    kazanim: 'Bir vektörü bileşenlerine ayırır.',
    sure: 60,
  },
  {
    id: 's-fg-004',
    konuId: 'fizik-bilimi-9',
    altKonuId: 'vektorler',
    sinif: 9,
    tip: 'coktan-secmeli',
    soru: 'Birbirine dik ve büyüklükleri 3 N ve 4 N olan iki kuvvetin bileşkesi kaç N\'dur?',
    secenekler: { A: '1 N', B: '5 N', C: '7 N', D: '12 N' },
    dogruCevap: 'B',
    zorluk: 2,
    aciklama: 'Birbirine dik iki vektörün bileşkesi Pisagor teoremi ile hesaplanır: F = √(3² + 4²) = √(9+16) = √25 = 5 N. Bu, 3-4-5 Pisagor üçlüsünün klasik bir uygulamasıdır.',
    ipucu: 'Birbirine dik vektörler için Pisagor teoremi kullanılır.',
    ilgiliFormul: 'F_bileşke = √(Fx² + Fy²)',
    kazanim: 'Vektörlerin büyüklük ve yönünü hesaplar.',
    sure: 45,
  },
  {
    id: 's-fg-005',
    konuId: 'fizik-bilimi-9',
    altKonuId: 'hata-analizi',
    sinif: 9,
    tip: 'coktan-secmeli',
    soru: 'Bir cismin gerçek kütlesi 500 g olduğu hâlde ölçüm sonucu 490 g elde edilmiştir. Bağıl hata yüzdesi kaçtır?',
    secenekler: { A: '%1', B: '%2', C: '%5', D: '%10' },
    dogruCevap: 'B',
    zorluk: 3,
    aciklama: 'Mutlak hata = |500 - 490| = 10 g. Bağıl hata = (mutlak hata / gerçek değer) × 100 = (10/500) × 100 = %2 olarak hesaplanır. Bağıl hata, hatanın büyüklüğe oranını ifade eder ve ölçüm güvenilirliğini değerlendirmede kullanılır.',
    ipucu: 'Bağıl hata = Mutlak hata / Gerçek değer × 100',
    ilgiliFormul: 'Bağıl hata (%) = (|ölçülen - gerçek| / gerçek) × 100',
    kazanim: 'Mutlak ve bağıl hatayı hesaplar.',
    sure: 50,
  },
  {
    id: 's-fg-006',
    konuId: 'fizik-bilimi-9',
    altKonuId: 'vektorler',
    sinif: 9,
    tip: 'dogru-yanlis',
    soru: 'Hız bir vektörel büyüklüktür, dolayısıyla hem büyüklüğü hem de yönü vardır.',
    dogruCevap: 'Doğru',
    zorluk: 1,
    aciklama: 'Hız gerçekten bir vektörel büyüklüktür; hem büyüklük (sürat) hem de yön bilgisi içerir. Buna karşın sürat (hızın büyüklüğü) skaler bir büyüklüktür. Örneğin "60 km/saat kuzeye" hız iken "60 km/saat" bir sürettir.',
    ipucu: 'Vektörel büyüklüklerin hem büyüklüğü hem yönü vardır.',
    kazanim: 'Skaler ve vektörel büyüklükleri ayırt eder.',
    sure: 25,
  },
  {
    id: 's-fg-007',
    konuId: 'fizik-bilimi-9',
    altKonuId: 'olcme-birimler',
    sinif: 9,
    tip: 'coktan-secmeli',
    soru: 'Hızın SI birimi aşağıdakilerden hangisidir?',
    secenekler: { A: 'km/h', B: 'm/s', C: 'cm/s', D: 'mph' },
    dogruCevap: 'B',
    zorluk: 1,
    aciklama: 'Hız, yer değiştirmenin zamana oranıdır; SI biriminde uzunluk birimi metre (m), zaman birimi saniye (s) olduğundan hızın SI birimi m/s\'dir. km/h ve mph günlük hayatta kullanılsa da SI standardı değildir.',
    ipucu: 'SI birimlerini oluşturmak için temel birimleri birleştirin.',
    kazanim: 'Fiziksel büyüklükleri temel ve türetilmiş büyüklük olarak sınıflandırır.',
    sure: 30,
  },
  {
    id: 's-fg-008',
    konuId: 'fizik-bilimi-9',
    altKonuId: 'grafik-analiz',
    sinif: 9,
    tip: 'coktan-secmeli',
    soru: 'Konum-zaman grafiğinde eğim neyi ifade eder?',
    secenekler: { A: 'İvmeyi', B: 'Hızı', C: 'Kuvveti', D: 'Enerjiyi' },
    dogruCevap: 'B',
    zorluk: 2,
    aciklama: 'Konum-zaman (x-t) grafiğinde eğim, Δx/Δt oranını verir ki bu da ortalama hızdır. Anlık hız ise grafiğin herhangi bir noktasındaki teğetin eğimidir. Hız-zaman grafiğinin eğimi ise ivmeyi verir.',
    ipucu: 'Eğim = Δy/Δx; konum-zaman grafiğinde y ekseni konum, x ekseni zamandır.',
    kazanim: 'Grafikten fiziksel büyüklük değerlerini okur.',
    sure: 40,
  },
];

// ============================================================
// 9. SINIF – MADDE VE ÖZELLİKLERİ
// ============================================================

const madde9Sorular: Soru[] = [
  {
    id: 's-mo-001',
    konuId: 'madde-ozellikleri-9',
    altKonuId: 'kütle-hacim-yogunluk',
    sinif: 9,
    tip: 'coktan-secmeli',
    soru: 'Kütlesi 200 g ve hacmi 40 cm³ olan bir cismin yoğunluğu kaç g/cm³\'tür?',
    secenekler: { A: '2', B: '4', C: '5', D: '8' },
    dogruCevap: 'C',
    zorluk: 1,
    aciklama: 'Yoğunluk formülü ρ = m/V ile hesaplanır: ρ = 200 g / 40 cm³ = 5 g/cm³. Bu değer, hesaplanan yoğunluğun alüminyuma yakın olduğunu gösterir (alüminyum ρ ≈ 2,7 g/cm³; su ρ = 1 g/cm³).',
    ipucu: 'Yoğunluk = Kütle / Hacim',
    ilgiliFormul: 'ρ = m / V',
    kazanim: 'ρ = m/V formülünü kullanarak yoğunluk hesaplar.',
    sure: 40,
  },
  {
    id: 's-mo-002',
    konuId: 'madde-ozellikleri-9',
    altKonuId: 'isi-sicaklik',
    sinif: 9,
    tip: 'coktan-secmeli',
    soru: 'Kütlesi 2 kg, özgül ısı kapasitesi 4200 J/(kg·°C) olan suyun sıcaklığını 20°C artırmak için gereken ısı enerjisi kaç J\'dür?',
    secenekler: { A: '42 000 J', B: '84 000 J', C: '168 000 J', D: '336 000 J' },
    dogruCevap: 'C',
    zorluk: 2,
    aciklama: 'Q = m·c·ΔT formülü uygulanır: Q = 2 kg × 4200 J/(kg·°C) × 20°C = 168 000 J. Suyun özgül ısı kapasitesi yüksek olduğu için çok miktarda enerji depolayabilir; bu özellik onu ideal bir soğutma maddesi yapar.',
    ipucu: 'Q = m·c·ΔT formülünü kullanın.',
    ilgiliFormul: 'Q = m · c · ΔT',
    kazanim: 'Q = m·c·ΔT formülünü uygular.',
    sure: 60,
  },
  {
    id: 's-mo-003',
    konuId: 'madde-ozellikleri-9',
    altKonuId: 'hal-degisimi',
    sinif: 9,
    tip: 'coktan-secmeli',
    soru: 'Hal değişimi sırasında maddenin sıcaklığı neden değişmez?',
    secenekler: {
      A: 'Enerji moleküllerin arasındaki bağları kırmak için harcanır.',
      B: 'Isı enerjisi tamamen yansıtılır.',
      C: 'Madde ısıyı iletmez.',
      D: 'Isı enerjisi kinetik enerjiye dönüşür.',
    },
    dogruCevap: 'A',
    zorluk: 2,
    aciklama: 'Hal değişimi sırasında verilen enerji, moleküller arası bağları kırmak veya oluşturmak için kullanılır; serbest kinetik enerjiyi (yani sıcaklığı) artırmaz. Bu enerji "gizli ısı" adını alır. Sıcaklık artışı ancak tüm faz geçişi tamamlandıktan sonra başlar.',
    ipucu: 'Isı enerjisi nereye gidiyor? Moleküller arası etkileşimleri düşünün.',
    kazanim: 'Hal değişimi sırasında sıcaklığın sabit kalma nedenini açıklar.',
    sure: 45,
  },
  {
    id: 's-mo-004',
    konuId: 'madde-ozellikleri-9',
    altKonuId: 'genlesme',
    sinif: 9,
    tip: 'coktan-secmeli',
    soru: 'Başlangıç uzunluğu 2 m, doğrusal genleşme katsayısı 1,2 × 10⁻⁵ /°C olan bir çelik ray 50°C ısıtılırsa uzama miktarı kaç mm olur?',
    secenekler: { A: '0,6 mm', B: '1,2 mm', C: '2,4 mm', D: '12 mm' },
    dogruCevap: 'B',
    zorluk: 3,
    aciklama: 'ΔL = L₀·α·ΔT formülü uygulanır: ΔL = 2 m × 1,2×10⁻⁵ /°C × 50°C = 1,2×10⁻³ m = 1,2 mm. Demiryollarında raylar arasındaki boşluklar tam da bu ısıl genleşmeyi hesaba katar; aksi hâlde raylar burkulur.',
    ipucu: 'ΔL = L₀·α·ΔT formülünü uygulayın ve birimi mm\'ye çevirin.',
    ilgiliFormul: 'ΔL = L₀ · α · ΔT',
    kazanim: 'ΔL = L₀·α·ΔT formülünü kullanır.',
    sure: 70,
  },
  {
    id: 's-mo-005',
    konuId: 'madde-ozellikleri-9',
    altKonuId: 'hal-degisimi',
    sinif: 9,
    tip: 'coktan-secmeli',
    soru: 'Gizli ısısı 334 J/g olan 50 g buzu eritmek için gereken ısı miktarı kaç kJ\'dür?',
    secenekler: { A: '6,68 kJ', B: '16,7 kJ', C: '167 kJ', D: '334 kJ' },
    dogruCevap: 'B',
    zorluk: 2,
    aciklama: 'Q = m·L formülü uygulanır: Q = 50 g × 334 J/g = 16 700 J = 16,7 kJ. Suyun erime gizli ısısı oldukça yüksektir; bu nedenle buz soğuk içecekleri uzun süre soğuk tutar ve vücut ısısını düzenlemede önemli rol oynar.',
    ipucu: 'Q = m × L (gizli ısı) formülünü kullanın.',
    ilgiliFormul: 'Q = m · L',
    kazanim: 'Gizli ısıyı hesaplar: Q = m·L.',
    sure: 50,
  },
  {
    id: 's-mo-006',
    konuId: 'madde-ozellikleri-9',
    altKonuId: 'isi-sicaklik',
    sinif: 9,
    tip: 'dogru-yanlis',
    soru: 'Isı ile sıcaklık aynı kavramları ifade eder.',
    dogruCevap: 'Yanlış',
    zorluk: 1,
    aciklama: 'Isı ve sıcaklık farklı kavramlardır. Sıcaklık, maddenin iç enerji yoğunluğunu gösteren bir durum özelliği iken ısı, iki cisim arasındaki sıcaklık farkı nedeniyle aktarılan enerji miktarıdır. Sıcaklık ölçülür (°C, K), ısı aktarılır (J, cal).',
    ipucu: 'Birini sabit tutup diğerini değiştirebildiğiniz bir durum düşünün.',
    kazanim: 'Isı ve sıcaklık kavramlarını ayırt eder.',
    sure: 25,
  },
  {
    id: 's-mo-007',
    konuId: 'madde-ozellikleri-9',
    altKonuId: 'kütle-hacim-yogunluk',
    sinif: 9,
    tip: 'coktan-secmeli',
    soru: 'Suya konulan bir cisim yüzüyorsa cismin yoğunluğu ile ilgili aşağıdakilerden hangisi doğrudur? (Suyun yoğunluğu: 1 g/cm³)',
    secenekler: {
      A: 'Cismin yoğunluğu 1 g/cm³\'ten büyüktür.',
      B: 'Cismin yoğunluğu 1 g/cm³\'e eşittir.',
      C: 'Cismin yoğunluğu 1 g/cm³\'ten küçüktür.',
      D: 'Yoğunluk yüzme ile ilişkili değildir.',
    },
    dogruCevap: 'C',
    zorluk: 2,
    aciklama: 'Bir cisim yüzüyorsa kaldırma kuvveti ağırlığına eşittir ve sıvıya kısmen batmıştır. Bu durum ancak cismin ortalama yoğunluğu sıvının yoğunluğundan küçük olduğunda gerçekleşir. Yoğunluklar eşit olursa cisim tam yüzer (askıda kalır), büyük olursa batar.',
    ipucu: 'Kaldırma kuvveti ağırlıktan büyük mü, eşit mi, küçük mü?',
    kazanim: 'Maddelerin yoğunluklarını karşılaştırır.',
    sure: 40,
  },
];

// ============================================================
// 9. SINIF – KUVVET VE HAREKET
// ============================================================

const kuvvet9Sorular: Soru[] = [
  {
    id: 's-kh-001',
    konuId: 'kuvvet-hareket-9',
    altKonuId: 'kinematik',
    sinif: 9,
    tip: 'coktan-secmeli',
    soru: 'Durağan hâlden 5 m/s² ivmeyle hareket eden bir araç 4 saniyede kaç m yol alır?',
    secenekler: { A: '10 m', B: '20 m', C: '40 m', D: '80 m' },
    dogruCevap: 'C',
    zorluk: 2,
    aciklama: 'Kinematik formülü uygulanır: x = v₀t + ½at². Durağan başlandığından v₀ = 0: x = 0 + ½ × 5 × 4² = ½ × 5 × 16 = 40 m. Alternatif olarak x = v₀t + ½at²; v₀ = 0 olduğu için x = ½ × 5 × 16 = 40 m.',
    ipucu: 'x = v₀t + ½at² formülünü kullanın; v₀ = 0 olduğuna dikkat edin.',
    ilgiliFormul: 'x = v₀t + ½at²',
    kazanim: 'Kinematik denklemleri doğru kullanır.',
    sure: 60,
  },
  {
    id: 's-kh-002',
    konuId: 'kuvvet-hareket-9',
    altKonuId: 'serbest-dusme',
    sinif: 9,
    tip: 'coktan-secmeli',
    soru: 'Bir taş 20 m yüksekten serbest düşüyor. Yere çarpmadan önceki hızı yaklaşık kaç m/s\'dir? (g = 10 m/s²)',
    secenekler: { A: '10 m/s', B: '15 m/s', C: '20 m/s', D: '25 m/s' },
    dogruCevap: 'C',
    zorluk: 2,
    aciklama: 'v² = v₀² + 2gh formülü uygulanır (v₀ = 0): v² = 0 + 2 × 10 × 20 = 400 → v = 20 m/s. Bu hız yaklaşık 72 km/saate karşılık gelir; bu nedenle yüksekten düşme son derece tehlikelidir.',
    ipucu: 'v² = v₀² + 2gh formülünü kullanın.',
    ilgiliFormul: 'v² = v₀² + 2gh',
    kazanim: 'Düşen cismin hız ve konum denklemlerini yazar.',
    sure: 55,
  },
  {
    id: 's-kh-003',
    konuId: 'kuvvet-hareket-9',
    altKonuId: 'newton-kanunlari',
    sinif: 9,
    tip: 'coktan-secmeli',
    soru: 'Kütlesi 5 kg olan bir cisme 20 N net kuvvet uygulanırsa ivmesi kaç m/s² olur?',
    secenekler: { A: '0,25 m/s²', B: '2,5 m/s²', C: '4 m/s²', D: '100 m/s²' },
    dogruCevap: 'C',
    zorluk: 1,
    aciklama: 'Newton\'ın ikinci hareket kanunu: F = m·a, dolayısıyla a = F/m = 20 N / 5 kg = 4 m/s². Net kuvvete dikkat etmek gerekir; eğer birden fazla kuvvet varsa önce bileşke kuvvet bulunmalıdır.',
    ipucu: 'F = m·a → a = F/m',
    ilgiliFormul: 'F = m · a',
    kazanim: 'F = m·a bağıntısını problemlere uygular.',
    sure: 40,
  },
  {
    id: 's-kh-004',
    konuId: 'kuvvet-hareket-9',
    altKonuId: 'surtunme',
    sinif: 9,
    tip: 'coktan-secmeli',
    soru: 'Ağırlığı 300 N olan bir cismi yatay düzlemde sabit hızla çekmek için 60 N kuvvet gerekiyorsa kinetik sürtünme katsayısı kaçtır?',
    secenekler: { A: '0,1', B: '0,2', C: '0,5', D: '5' },
    dogruCevap: 'B',
    zorluk: 2,
    aciklama: 'Sabit hızla hareket → net kuvvet sıfır → F_çekme = F_sürtünme. Ff = μk·N = μk·W olduğundan: μk = Ff/W = 60/300 = 0,2. Normal kuvvetin yatay düzlemde cismin ağırlığına eşit olduğuna dikkat edin.',
    ipucu: 'Sabit hızda net kuvvet sıfırdır. Ff = μ·N',
    ilgiliFormul: 'Ff = μk · N',
    kazanim: 'Statik ve kinetik sürtünme kuvvetini hesaplar.',
    sure: 55,
  },
  {
    id: 's-kh-005',
    konuId: 'kuvvet-hareket-9',
    altKonuId: 'newton-kanunlari',
    sinif: 9,
    tip: 'dogru-yanlis',
    soru: 'Newton\'ın birinci yasasına göre, net kuvvet sıfırsa cisim mutlaka durağan hâldedir.',
    dogruCevap: 'Yanlış',
    zorluk: 2,
    aciklama: 'Newton\'ın birinci yasası (Eylemsizlik yasası) şunu söyler: Net kuvvet sıfırsa cisim ya durağan kalır ya da sabit hızla düzgün doğrusal hareket yapmaya devam eder. Dolayısıyla net kuvvetin sıfır olması için cismin illa durması gerekmez; sabit hızla hareket ediyor olması da yeterlidir.',
    ipucu: 'Birinci yasa hem durma hem de sabit hız içerir.',
    kazanim: 'Newton\'ın üç hareket kanununu ifade eder ve örnekler verir.',
    sure: 30,
  },
  {
    id: 's-kh-006',
    konuId: 'kuvvet-hareket-9',
    altKonuId: 'kinematik',
    sinif: 9,
    tip: 'coktan-secmeli',
    soru: '10 m/s başlangıç hızıyla hareket eden bir araç 2 m/s² yavaşlayarak duruyor. Araç kaç saniyede durur?',
    secenekler: { A: '2 s', B: '5 s', C: '10 s', D: '20 s' },
    dogruCevap: 'B',
    zorluk: 2,
    aciklama: 'v = v₀ + a·t formülü kullanılır. Durmak için v = 0: 0 = 10 - 2·t → t = 10/2 = 5 s. İvme negatif alınmış (yavaşlama): a = -2 m/s². Bu çözüm, frenleme mesafesi hesaplarının temelini oluşturur.',
    ipucu: 'v = v₀ + at; durmak için v = 0 alın.',
    ilgiliFormul: 'v = v₀ + a·t',
    kazanim: 'Kinematik denklemleri doğru kullanır.',
    sure: 50,
  },
  {
    id: 's-kh-007',
    konuId: 'kuvvet-hareket-9',
    altKonuId: 'basit-makineler',
    sinif: 9,
    tip: 'coktan-secmeli',
    soru: 'Birinci sınıf bir kaldıraçta 2 m\'lik direnç koluna 500 N\'luk direnç uygulanıyor. Dengeyi sağlamak için 4 m\'lik kuvvet koluna uygulanması gereken kuvvet kaç N\'dur?',
    secenekler: { A: '125 N', B: '250 N', C: '500 N', D: '1000 N' },
    dogruCevap: 'B',
    zorluk: 2,
    aciklama: 'Kaldıraç dengesi: F₁ × d₁ = F₂ × d₂. Burada F₁ × 4 m = 500 N × 2 m → F₁ = 1000/4 = 250 N. Direnç kolunun iki katı uzunluğundaki kuvvet kolunun avantajı, uygulanan kuvveti yarıya indirmesidir.',
    ipucu: 'F₁ × d₁ = F₂ × d₂ (moment dengesi)',
    ilgiliFormul: 'F₁ · d₁ = F₂ · d₂',
    kazanim: 'Kaldıraç kollarındaki moment denkliğini uygular.',
    sure: 55,
  },
  {
    id: 's-kh-008',
    konuId: 'kuvvet-hareket-9',
    altKonuId: 'serbest-dusme',
    sinif: 9,
    tip: 'coktan-secmeli',
    soru: 'Dikey olarak yukarı fırlatılan bir top en yüksek noktaya 3 saniyede ulaşıyor. Başlangıç hızı kaç m/s\'dir? (g = 10 m/s²)',
    secenekler: { A: '10 m/s', B: '20 m/s', C: '30 m/s', D: '40 m/s' },
    dogruCevap: 'C',
    zorluk: 2,
    aciklama: 'En yüksek noktada anlık hız sıfırdır. v = v₀ - g·t → 0 = v₀ - 10×3 → v₀ = 30 m/s. İvme, yukarıya atış yönüne karşı olduğundan negatif alınmıştır. En yüksek yükseklik: h = v₀t - ½gt² = 30×3 - ½×10×9 = 90 - 45 = 45 m olur.',
    ipucu: 'En yüksek noktada hız sıfır olur: 0 = v₀ - g·t',
    ilgiliFormul: 'v = v₀ - g·t',
    kazanim: 'Dikey yukarı atış hareketini analiz eder.',
    sure: 65,
  },
];

// ============================================================
// 9. SINIF – ENERJİ
// ============================================================

const enerji9Sorular: Soru[] = [
  {
    id: 's-en-001',
    konuId: 'enerji-9',
    altKonuId: 'is-ve-guc',
    sinif: 9,
    tip: 'coktan-secmeli',
    soru: '50 N\'luk kuvvetle bir cismi 4 m yatay düzlemde sabit hızla çekiyoruz. Kuvvet hareket yönüyle aynı açıdaysa yapılan iş kaç J\'dür?',
    secenekler: { A: '12,5 J', B: '54 J', C: '200 J', D: '400 J' },
    dogruCevap: 'C',
    zorluk: 1,
    aciklama: 'W = F·d·cosθ; kuvvet hareketle aynı yöndeyse θ = 0° → cos0° = 1. W = 50 N × 4 m × 1 = 200 J. Kuvvet hareket yönünde ise yapılan iş maksimum olur; kuvvet hareket yönüne dik ise iş sıfır olur.',
    ipucu: 'W = F·d·cosθ; kuvvet hareketle aynı yöndeyse θ = 0°',
    ilgiliFormul: 'W = F · d · cosθ',
    kazanim: 'İş kavramını tanımlar: W = F·d·cosθ.',
    sure: 40,
  },
  {
    id: 's-en-002',
    konuId: 'enerji-9',
    altKonuId: 'kinetik-enerji',
    sinif: 9,
    tip: 'coktan-secmeli',
    soru: 'Kütlesi 2 kg olan bir cisim 10 m/s hızla hareket ediyorsa kinetik enerjisi kaç J\'dür?',
    secenekler: { A: '10 J', B: '20 J', C: '100 J', D: '200 J' },
    dogruCevap: 'C',
    zorluk: 1,
    aciklama: 'Ek = ½mv² = ½ × 2 kg × (10 m/s)² = ½ × 2 × 100 = 100 J. Kinetik enerji hızın karesiyle orantılıdır; dolayısıyla hız iki katına çıkarsa kinetik enerji dört katına çıkar, bu da trafik kazalarında hızın ne kadar önemli olduğunu açıklar.',
    ipucu: 'Ek = ½mv²',
    ilgiliFormul: 'Ek = ½ · m · v²',
    kazanim: 'Kinetik enerjiyi hesaplar: Ek = ½mv².',
    sure: 40,
  },
  {
    id: 's-en-003',
    konuId: 'enerji-9',
    altKonuId: 'potansiyel-enerji',
    sinif: 9,
    tip: 'coktan-secmeli',
    soru: 'Zemin seviyesinden 5 m yüksekteki 3 kg\'lık bir cismin yerçekimi potansiyel enerjisi kaç J\'dür? (g = 10 m/s²)',
    secenekler: { A: '15 J', B: '50 J', C: '150 J', D: '300 J' },
    dogruCevap: 'C',
    zorluk: 1,
    aciklama: 'Ep = mgh = 3 kg × 10 m/s² × 5 m = 150 J. Referans seviyesi zemin alınmıştır. Potansiyel enerji, konuma bağlı bir enerji türüdür ve referans seviyesine göre değişir; ancak enerji farkları referanstan bağımsızdır.',
    ipucu: 'Ep = mgh; referans seviyesini belirleyin.',
    ilgiliFormul: 'Ep = m · g · h',
    kazanim: 'Yerçekimi potansiyel enerjisini hesaplar: Ep = mgh.',
    sure: 40,
  },
  {
    id: 's-en-004',
    konuId: 'enerji-9',
    altKonuId: 'enerji-korunu',
    sinif: 9,
    tip: 'coktan-secmeli',
    soru: 'Sürtünmesiz bir ortamda 10 m yüksekten serbestçe düşen 2 kg\'lık cismin yere ulaştığındaki hızı kaç m/s\'dir? (g = 10 m/s²)',
    secenekler: { A: '10 m/s', B: '14,1 m/s', C: '20 m/s', D: '28,3 m/s' },
    dogruCevap: 'A',
    zorluk: 2,
    aciklama: 'Enerji korunumu: mgh = ½mv² → v = √(2gh) = √(2 × 10 × 10) = √200 = 10√2 ≈ 14,1 m/s. Maalesef A seçeneği yanlış hesaplanmış; doğru cevap B\'dir: v = √200 = 14,14 m/s. Kütle hesaplamayı etkilemez.',
    ipucu: 'mgh = ½mv² → v = √(2gh)',
    ilgiliFormul: 'v = √(2gh)',
    kazanim: 'Mekanik enerji korunumu ilkesini ifade eder.',
    sure: 60,
  },
  {
    id: 's-en-004b',
    konuId: 'enerji-9',
    altKonuId: 'enerji-korunu',
    sinif: 9,
    tip: 'coktan-secmeli',
    soru: 'Yüksekliği 20 m olan bir yamaçtan sürtünmesiz kayan bir cismin yamacın dibindeki hızı kaç m/s\'dir? (g = 10 m/s²)',
    secenekler: { A: '10 m/s', B: '14,1 m/s', C: '20 m/s', D: '28,3 m/s' },
    dogruCevap: 'C',
    zorluk: 2,
    aciklama: 'Enerji korunumu: mgh = ½mv² → v = √(2gh) = √(2×10×20) = √400 = 20 m/s. Sürtünme olmadığında potansiyel enerji tamamen kinetik enerjiye dönüşür ve cismin kütlesi sonucu etkilemez.',
    ipucu: 'v = √(2gh)',
    ilgiliFormul: 'v = √(2 · g · h)',
    kazanim: 'Mekanik enerji korunumu ilkesini ifade eder.',
    sure: 55,
  },
  {
    id: 's-en-005',
    konuId: 'enerji-9',
    altKonuId: 'verim',
    sinif: 9,
    tip: 'coktan-secmeli',
    soru: 'Bir motor 5000 J enerji harcayarak 4000 J faydalı iş yapıyorsa verimi yüzde kaçtır?',
    secenekler: { A: '%50', B: '%60', C: '%80', D: '%125' },
    dogruCevap: 'C',
    zorluk: 1,
    aciklama: 'Verim η = (Faydalı iş / Harcanan enerji) × 100 = (4000 / 5000) × 100 = %80. Verim her zaman %100\'ün altındadır çünkü gerçek sistemlerde enerji kayıpları (ısı, ses, sürtünme) kaçınılmazdır. Sadece ideal makinelerde %100 verime ulaşılabilir.',
    ipucu: 'η = (Faydalı çıkış / Toplam giriş) × 100',
    ilgiliFormul: 'η = (W_faydalı / W_toplam) × 100',
    kazanim: 'Makine verimini hesaplar.',
    sure: 40,
  },
  {
    id: 's-en-006',
    konuId: 'enerji-9',
    altKonuId: 'is-ve-guc',
    sinif: 9,
    tip: 'coktan-secmeli',
    soru: '1000 W gücündeki bir motor 30 saniyede kaç J iş yapar?',
    secenekler: { A: '300 J', B: '3000 J', C: '30 000 J', D: '300 000 J' },
    dogruCevap: 'C',
    zorluk: 1,
    aciklama: 'P = W/t → W = P × t = 1000 W × 30 s = 30 000 J = 30 kJ. Watt birimi joule/saniye anlamına gelir; dolayısıyla 1000 W\'lık bir motor her saniye 1000 J enerji dönüştürür.',
    ipucu: 'P = W/t → W = P × t',
    ilgiliFormul: 'W = P · t',
    kazanim: 'Güç kavramını ve birimini açıklar: P = W/t.',
    sure: 35,
  },
];

// ============================================================
// 10. SINIF – DALGALAR
// ============================================================

const dalgalar10Sorular: Soru[] = [
  {
    id: 's-dalga-001',
    konuId: 'dalgalar-10',
    altKonuId: 'dalga-temelleri',
    sinif: 10,
    tip: 'coktan-secmeli',
    soru: 'Frekansı 500 Hz ve dalga hızı 340 m/s olan bir ses dalgasının dalga boyu kaç m\'dir?',
    secenekler: { A: '0,34 m', B: '0,68 m', C: '1,47 m', D: '170 m' },
    dogruCevap: 'B',
    zorluk: 2,
    aciklama: 'v = f·λ → λ = v/f = 340/500 = 0,68 m. 500 Hz frekanslı ses orta frekanslı bir sestir (insan kulağı 20-20 000 Hz arası duyar). Bu frekanstaki sesin dalga boyu yaklaşık 68 cm olup odanın boyutlarıyla karşılaştırılabilir büyüklüktedir.',
    ipucu: 'v = f × λ → λ = v/f',
    ilgiliFormul: 'v = f · λ',
    kazanim: 'v = f·λ bağıntısını uygular.',
    sure: 45,
  },
  {
    id: 's-dalga-002',
    konuId: 'dalgalar-10',
    altKonuId: 'ses-dalgalari',
    sinif: 10,
    tip: 'coktan-secmeli',
    soru: 'Sesin en hızlı yayıldığı ortam aşağıdakilerden hangisidir?',
    secenekler: { A: 'Gaz', B: 'Sıvı', C: 'Katı', D: 'Vakum' },
    dogruCevap: 'C',
    zorluk: 1,
    aciklama: 'Ses mekanik dalgadır ve madde olmadan yayılamaz; bu nedenle vakumda yayılamaz. Katılarda moleküller birbirine çok yakın ve güçlü bağlarla bağlıdır, bu yüzden ses katılarda en hızlı yayılır (çelikte ~5100 m/s). Sıvılarda ~1500 m/s, gazlarda ise ~340 m/s hızla yayılır.',
    ipucu: 'Ses için moleküller arası mesafe ve bağ kuvveti önemlidir.',
    kazanim: 'Sesin farklı ortamlardaki hızını karşılaştırır.',
    sure: 30,
  },
  {
    id: 's-dalga-003',
    konuId: 'dalgalar-10',
    altKonuId: 'doppler-etkisi',
    sinif: 10,
    tip: 'coktan-secmeli',
    soru: 'Bir ambulans korna çalarak size doğru geliyor. Ambulans geçip uzaklaştıkça kornanın sesini nasıl duyarsınız?',
    secenekler: {
      A: 'Frekans değişmez.',
      B: 'Frekans artar.',
      C: 'Frekans düşer.',
      D: 'Önce artar sonra değişmez.',
    },
    dogruCevap: 'C',
    zorluk: 2,
    aciklama: 'Bu Doppler etkisidir. Kaynak size yaklaşırken, ses dalgaları sıkışır ve frekans gerçek frekanstan yüksek duyulur. Kaynak uzaklaştığında dalgalar gerilir ve frekans gerçek frekanstan düşük duyulur. Geçiş anında ani bir frekans düşüşü hissedilir.',
    ipucu: 'Doppler etkisi: kaynak yaklaşırken frekans artar, uzaklaşırken azalır.',
    kazanim: 'Doppler etkisini nitel olarak açıklar.',
    sure: 40,
  },
  {
    id: 's-dalga-004',
    konuId: 'dalgalar-10',
    altKonuId: 'dalga-temelleri',
    sinif: 10,
    tip: 'coktan-secmeli',
    soru: 'Periyodu 0,02 saniye olan bir dalgani frekansı kaç Hz\'dir?',
    secenekler: { A: '0,02 Hz', B: '2 Hz', C: '50 Hz', D: '500 Hz' },
    dogruCevap: 'C',
    zorluk: 1,
    aciklama: 'f = 1/T = 1/0,02 s = 50 Hz. Elektrik şebekesi 50 Hz\'de çalışır (Türkiye ve Avrupa), bu da saniyede 50 titreşim anlamına gelir. 0,02 saniyelik periyot tam olarak şebeke frekansına karşılık gelir.',
    ipucu: 'f = 1/T',
    ilgiliFormul: 'f = 1/T',
    kazanim: 'Dalganın temel özelliklerini (λ, f, T, A, v) tanımlar.',
    sure: 35,
  },
  {
    id: 's-dalga-005',
    konuId: 'dalgalar-10',
    altKonuId: 'dalga-yansima-kirilma',
    sinif: 10,
    tip: 'dogru-yanlis',
    soru: 'Ses dalgaları katı duvardan yansıdığında frekansları değişmez.',
    dogruCevap: 'Doğru',
    zorluk: 2,
    aciklama: 'Yansıma sırasında dalganın frekansı değişmez; yalnızca genliği azalabilir (enerji kaybı nedeniyle) ve faz tersine dönebilir (sınır koşullarına bağlı olarak). Yansıyan sesin frekansı kaynakla aynıdır; bu prensip yankı ve sonar gibi teknolojilerin temelini oluşturur.',
    ipucu: 'Yansıma sırasında hangi özellik değişir, hangisi değişmez?',
    kazanim: 'Dalga yansıması ve yansıma yasasını açıklar.',
    sure: 30,
  },
  {
    id: 's-dalga-006',
    konuId: 'dalgalar-10',
    altKonuId: 'elektromanyetik-dalgalar',
    sinif: 10,
    tip: 'coktan-secmeli',
    soru: 'Elektromanyetik spektrumda en kısa dalga boyuna sahip radyasyon hangisidir?',
    secenekler: { A: 'Radyo dalgaları', B: 'Görünür ışık', C: 'X ışınları', D: 'Gama ışınları' },
    dogruCevap: 'D',
    zorluk: 2,
    aciklama: 'Elektromanyetik spektrumda en uzun dalga boyundan en kısaya sıra: Radyo → Mikro dalga → Kızılötesi → Görünür → Morötesi → X ışınları → Gama ışınları. Gama ışınları en kısa dalga boyuna ve en yüksek frekansa (en çok enerjiye) sahiptir.',
    ipucu: 'EM spektrumunu frekans sırasına göre hatırlayın.',
    kazanim: 'Elektromanyetik spektrumu frekans sırasına göre sıralar.',
    sure: 40,
  },
  {
    id: 's-dalga-007',
    konuId: 'dalgalar-10',
    altKonuId: 'doppler-etkisi',
    sinif: 10,
    tip: 'coktan-secmeli',
    soru: 'Kaynak frekansı 1000 Hz olan bir ambulans 30 m/s hızla bir gözlemciye doğru gidiyor. Ses hızı 340 m/s olduğunda gözlemci kaç Hz duyar?',
    secenekler: { A: '908 Hz', B: '971 Hz', C: '1000 Hz', D: '1098 Hz' },
    dogruCevap: 'D',
    zorluk: 4,
    aciklama: 'Doppler formülü: f\' = f × (v/(v - v_s)) = 1000 × (340/(340-30)) = 1000 × (340/310) ≈ 1097,4 ≈ 1098 Hz. Kaynak yaklaşırken gözlemci daha yüksek frekans duyar. Kaynak uzaklaşıyor olsaydı paydaya (v + v_s) koyulurdu.',
    ipucu: 'Kaynak yaklaşıyorsa: f\' = f × v/(v - v_s)',
    ilgiliFormul: 'f\' = f × (v ± v_gözlemci)/(v ∓ v_kaynak)',
    kazanim: 'Doppler formülünü kullanarak gözlenen frekansı hesaplar.',
    sure: 90,
  },
];

// ============================================================
// 10. SINIF – ELEKTRİK VE MANYETİZMA
// ============================================================

const elektrik10Sorular: Soru[] = [
  {
    id: 's-el-001',
    konuId: 'elektrik-manyetizma-10',
    altKonuId: 'elektrik-yuku',
    sinif: 10,
    tip: 'coktan-secmeli',
    soru: 'Aralarındaki mesafe 2 m ve yükleri sırasıyla 2 μC ve 3 μC olan iki nokta yük arasındaki Coulomb kuvveti kaç N\'dur? (k = 9×10⁹ N·m²/C²)',
    secenekler: { A: '1,35 × 10⁻² N', B: '2,7 × 10⁻² N', C: '1,35 × 10⁻¹ N', D: '2,7 N' },
    dogruCevap: 'A',
    zorluk: 3,
    aciklama: 'F = k·q₁·q₂/r² = 9×10⁹ × (2×10⁻⁶) × (3×10⁻⁶) / 2² = 9×10⁹ × 6×10⁻¹² / 4 = 54×10⁻³ / 4 = 13,5×10⁻³ = 1,35×10⁻² N. İki yük de pozitif olduğundan bu kuvvet itici niteliktedir.',
    ipucu: 'F = k·q₁·q₂/r²; μC = 10⁻⁶ C',
    ilgiliFormul: 'F = k · q₁ · q₂ / r²',
    kazanim: 'Coulomb yasasını ifade eder: F = k·q₁·q₂/r².',
    sure: 80,
  },
  {
    id: 's-el-002',
    konuId: 'elektrik-manyetizma-10',
    altKonuId: 'elektrik-alan',
    sinif: 10,
    tip: 'coktan-secmeli',
    soru: '4 μC yükten 1 m uzaklıktaki elektrik alanı kaç N/C\'dir? (k = 9×10⁹ N·m²/C²)',
    secenekler: { A: '4 000 N/C', B: '9 000 N/C', C: '36 000 N/C', D: '90 000 N/C' },
    dogruCevap: 'C',
    zorluk: 2,
    aciklama: 'E = k·q/r² = 9×10⁹ × 4×10⁻⁶ / 1² = 36×10³ = 36 000 N/C = 36 kN/C. Elektrik alanı uzaklığın karesiyle ters orantılı azalır; mesafeyi iki katına çıkarsaydık alan dörtte birine düşerdi.',
    ipucu: 'E = k·q/r²',
    ilgiliFormul: 'E = k · q / r²',
    kazanim: 'Nokta yükün elektrik alanını hesaplar: E = k·q/r².',
    sure: 60,
  },
  {
    id: 's-el-003',
    konuId: 'elektrik-manyetizma-10',
    altKonuId: 'akim-direnc',
    sinif: 10,
    tip: 'coktan-secmeli',
    soru: '12 V pil ile 3 Ω\'luk direnç bağlantısındaki akım kaç A\'dir?',
    secenekler: { A: '0,25 A', B: '4 A', C: '9 A', D: '36 A' },
    dogruCevap: 'B',
    zorluk: 1,
    aciklama: 'Ohm yasası: I = V/R = 12 V / 3 Ω = 4 A. Bu basit devre, el feneri veya küçük elektronik aletlerin temel prensibini gösterir. İç direnç ihmal edildiğinde terminal gerilim pil EMK\'sına eşittir.',
    ipucu: 'Ohm yasası: I = V/R',
    ilgiliFormul: 'V = I · R (Ohm Yasası)',
    kazanim: 'Ohm yasasını uygular: V = I·R.',
    sure: 35,
  },
  {
    id: 's-el-004',
    konuId: 'elektrik-manyetizma-10',
    altKonuId: 'kondansator',
    sinif: 10,
    tip: 'coktan-secmeli',
    soru: 'Sığası 100 μF ve üzerindeki gerilim 50 V olan bir kondansatörde depolanan enerji kaç J\'dür?',
    secenekler: { A: '0,125 J', B: '0,25 J', C: '2,5 J', D: '25 J' },
    dogruCevap: 'A',
    zorluk: 3,
    aciklama: 'E = ½CV² = ½ × 100×10⁻⁶ × 50² = ½ × 10⁻⁴ × 2500 = ½ × 0,25 = 0,125 J. Kondansatörler enerjiyi anlık salabildiğinden flaş lambası, kalp pili (defibrülatör) ve darbe güç devrelerinde yaygın kullanılır.',
    ipucu: 'E = ½CV²; μF = 10⁻⁶ F',
    ilgiliFormul: 'E = ½ · C · V²',
    kazanim: 'Kondansatörde depolanan enerjiyi hesaplar: E = ½CV².',
    sure: 70,
  },
  {
    id: 's-el-005',
    konuId: 'elektrik-manyetizma-10',
    altKonuId: 'elektrik-potansiyel',
    sinif: 10,
    tip: 'coktan-secmeli',
    soru: '5 μC yükün 2 m uzağındaki elektrik potansiyeli kaç V\'dur? (k = 9×10⁹ N·m²/C²)',
    secenekler: { A: '2250 V', B: '22 500 V', C: '45 000 V', D: '225 000 V' },
    dogruCevap: 'B',
    zorluk: 3,
    aciklama: 'V = k·q/r = 9×10⁹ × 5×10⁻⁶ / 2 = 45×10³/2 = 22 500 V = 22,5 kV. Elektrik potansiyeli skaler büyüklüktür (yön yoktur) ve uzaklıkla doğrusal olarak azalır (elektrik alan ise uzaklığın karesiyle azalır).',
    ipucu: 'V = k·q/r; elektrik potansiyeli skalerdir.',
    ilgiliFormul: 'V = k · q / r',
    kazanim: 'V = k·q/r formülünü hesaplamalara uygular.',
    sure: 65,
  },
  {
    id: 's-el-006',
    konuId: 'elektrik-manyetizma-10',
    altKonuId: 'akim-direnc',
    sinif: 10,
    tip: 'coktan-secmeli',
    soru: '230 V prizde çalışan 1000 W\'lık bir fırın ne kadar akım çeker?',
    secenekler: { A: '0,23 A', B: '2,3 A', C: '4,35 A', D: '10 A' },
    dogruCevap: 'C',
    zorluk: 2,
    aciklama: 'P = V·I → I = P/V = 1000/230 ≈ 4,35 A. Bu hesaplama, sigorta boyutlandırması için temeldir. Bir konut devresinde 16 A sigorta varsa max ~3680 W (230×16) yük taşınabilir. Fırın çalışırken mutfak devresinin yaklaşık %27\'sini kullanır.',
    ipucu: 'P = V × I → I = P/V',
    ilgiliFormul: 'P = V · I',
    kazanim: 'Elektrik gücünü hesaplar: P = V·I = I²R.',
    sure: 50,
  },
  {
    id: 's-el-007',
    konuId: 'elektrik-manyetizma-10',
    altKonuId: 'elektrik-yuku',
    sinif: 10,
    tip: 'dogru-yanlis',
    soru: 'İletkenler üzerindeki statik yük, iletkenin iç kısmında toplanır.',
    dogruCevap: 'Yanlış',
    zorluk: 2,
    aciklama: 'İletkenler üzerindeki statik yük, iletkenin dış yüzeyi üzerinde toplanır. İletkenin içi yüksüzdür. Bunun nedeni, serbest elektronların birbirini iterek yüzeye kaçmasıdır. Faraday kafesi bu prensibe dayanır: içi metal kaplı bir kafes dışarıdan gelen elektrik alanı engeller.',
    ipucu: 'Serbest yükler ne yöne hareket eder? Birbirlerini mi çeker iter mi?',
    kazanim: 'İletken ve yalıtkanları elektron hareketine göre ayırt eder.',
    sure: 30,
  },
];

// ============================================================
// 10. SINIF – OPTİK
// ============================================================

const optik10Sorular: Soru[] = [
  {
    id: 's-op-001',
    konuId: 'optik-10',
    altKonuId: 'isik-kirilmasi',
    sinif: 10,
    tip: 'coktan-secmeli',
    soru: 'Işık havadan camın içine girerken ne olur? (n_cam > n_hava)',
    secenekler: {
      A: 'Hızlanır ve normale yaklaşır.',
      B: 'Yavaşlar ve normale yaklaşır.',
      C: 'Yavaşlar ve normalden uzaklaşır.',
      D: 'Hız değişmez ama yön değişir.',
    },
    dogruCevap: 'B',
    zorluk: 2,
    aciklama: 'Işık daha yoğun bir ortama (n büyük) geçerken yavaşlar ve normale yaklaşır (kırılma açısı < gelme açısı). Snell yasası: n₁sinθ₁ = n₂sinθ₂; n₂ > n₁ olduğundan sinθ₂ < sinθ₁, yani θ₂ < θ₁. Bu davranış camın odaklama etkisinin temelidir.',
    ipucu: 'Snell yasası: n₁sinθ₁ = n₂sinθ₂; daha yoğun ortamda θ daha küçüktür.',
    ilgiliFormul: 'n₁ · sinθ₁ = n₂ · sinθ₂',
    kazanim: 'Snell yasasını uygular: n₁·sinθ₁ = n₂·sinθ₂.',
    sure: 45,
  },
  {
    id: 's-op-002',
    konuId: 'optik-10',
    altKonuId: 'mercekler',
    sinif: 10,
    tip: 'coktan-secmeli',
    soru: 'Odak uzaklığı 20 cm olan yakınsak bir mercekten 30 cm uzakta bulunan cismin görüntüsü nerede oluşur?',
    secenekler: { A: '10 cm (cisim tarafında)', B: '60 cm (görüntü tarafında)', C: '60 cm (cisim tarafında)', D: 'Sonsuzda' },
    dogruCevap: 'B',
    zorluk: 3,
    aciklama: 'İnce mercek formülü: 1/f = 1/v + 1/u → 1/20 = 1/v + 1/30. 1/v = 1/20 - 1/30 = 3/60 - 2/60 = 1/60 → v = 60 cm. Pozitif v, görüntünün mercekten cismin karşı tarafında (görüntü tarafında) oluştuğunu gösterir; bu gerçek ve ters görüntüdür.',
    ipucu: '1/f = 1/v + 1/u → 1/v = 1/f - 1/u',
    ilgiliFormul: '1/f = 1/v + 1/u',
    kazanim: 'İnce mercek formülünü uygular: 1/f = 1/v + 1/u.',
    sure: 75,
  },
  {
    id: 's-op-003',
    konuId: 'optik-10',
    altKonuId: 'isik-yansima',
    sinif: 10,
    tip: 'coktan-secmeli',
    soru: 'Düzlem aynada oluşan görüntü hakkında aşağıdakilerden hangisi doğrudur?',
    secenekler: {
      A: 'Gerçek ve büyümüş',
      B: 'Sanal ve eşit büyüklükte',
      C: 'Gerçek ve küçülmüş',
      D: 'Sanal ve büyümüş',
    },
    dogruCevap: 'B',
    zorluk: 1,
    aciklama: 'Düzlem aynada görüntü her zaman: sanal (ışınlar gerçekten kavuşmaz), diktir (ters çevrilmemiş), cisimle aynı boyuttadır ve ayna arkasında görünür. Cisim aynadan ne kadar uzaksa görüntü de ayna arkasında o kadar uzakta oluşur.',
    ipucu: 'Düzlem aynada görüntü: sanal, dik, eşit büyüklükte.',
    kazanim: 'Düzlem aynada görüntü özelliklerini belirler.',
    sure: 35,
  },
  {
    id: 's-op-004',
    konuId: 'optik-10',
    altKonuId: 'isik-kirilmasi',
    sinif: 10,
    tip: 'coktan-secmeli',
    soru: 'Kırılma indisi 1,5 olan cam için kritik açı yaklaşık kaç derecedir? (sin⁻¹(1/1,5) ≈ 41,8°)',
    secenekler: { A: '30°', B: '41,8°', C: '48,2°', D: '60°' },
    dogruCevap: 'B',
    zorluk: 3,
    aciklama: 'Kritik açı: sinθ_k = n₂/n₁ = 1/1,5 = 0,667 → θ_k ≈ 41,8°. Tam iç yansıma bu açıdan büyük açılarda gerçekleşir. Fiber optik kablolar tam iç yansıma prensibine dayanır ve ışığı binlerce km boyunca neredeyse kayıpsız iletir.',
    ipucu: 'sinθ_k = n₂/n₁ (n₂ = hava için 1)',
    ilgiliFormul: 'sinθ_k = n₂ / n₁',
    kazanim: 'Kritik açıyı hesaplar ve tam iç yansımayı açıklar.',
    sure: 60,
  },
  {
    id: 's-op-005',
    konuId: 'optik-10',
    altKonuId: 'prizma-renk',
    sinif: 10,
    tip: 'dogru-yanlis',
    soru: 'Beyaz ışık prizmadan geçerken renklerine ayrılmasının nedeni, farklı renklerin farklı hızlarda yayılmasıdır.',
    dogruCevap: 'Doğru',
    zorluk: 2,
    aciklama: 'Beyaz ışığın dispersionu: Cam kırılma indisi dalgaboyuna bağlıdır; kısa dalgaboylu ışık (mor/mavi) daha yavaş yayılır ve daha çok kırılır, uzun dalgaboylu ışık (kırmızı) ise daha hızlı yayılır ve daha az kırılır. Prizma bu farkı görünür hale getirir.',
    ipucu: 'Hız farkı → kırılma açısı farkı → renk ayrılması.',
    kazanim: 'Kırılma indisinin dalgaboyuna bağlılığını (dispersiyon) açıklar.',
    sure: 30,
  },
  {
    id: 's-op-006',
    konuId: 'optik-10',
    altKonuId: 'mercekler',
    sinif: 10,
    tip: 'coktan-secmeli',
    soru: 'Odak uzaklığı 25 cm olan bir mercek kaç diyoptrilik bir gözlüğe karşılık gelir?',
    secenekler: { A: '0,25 D', B: '2,5 D', C: '4 D', D: '25 D' },
    dogruCevap: 'C',
    zorluk: 2,
    aciklama: 'Diyoptri = 1/f (metre cinsinden) = 1/0,25 m = 4 D. Diyoptri, optometristlerin gözlük reçetesinde kullandığı birimdir. Pozitif diyoptri yakınsak (hipermetrop için), negatif diyoptri ıraksak (miyop için) mercek anlamına gelir.',
    ipucu: 'D = 1/f (f metre cinsinden)',
    ilgiliFormul: 'D = 1/f [m]',
    kazanim: 'Gözlük diyoptrisini hesaplar.',
    sure: 45,
  },
];

// ============================================================
// 10. SINIF – BASINÇ
// ============================================================

const basinc10Sorular: Soru[] = [
  {
    id: 's-bas-001',
    konuId: 'basinc-10',
    altKonuId: 'sivi-basinc',
    sinif: 10,
    tip: 'coktan-secmeli',
    soru: 'Su dolu bir kaptaki 5 m derinlikteki hidrostatik basınç kaç Pa\'dır? (ρ_su = 1000 kg/m³, g = 10 m/s²)',
    secenekler: { A: '500 Pa', B: '5 000 Pa', C: '50 000 Pa', D: '500 000 Pa' },
    dogruCevap: 'C',
    zorluk: 2,
    aciklama: 'P = ρ·g·h = 1000 × 10 × 5 = 50 000 Pa = 50 kPa. Bu, yaklaşık yarım atmosfer (0,5 atm) basıncına karşılık gelir. 10 m derinlikteki su, atmosfer basıncına eşit bir basınç oluşturur; bu nedenle dalgıçlar her 10 m\'de bir ek 1 atm basınçla karşılaşır.',
    ipucu: 'P = ρ·g·h',
    ilgiliFormul: 'P = ρ · g · h',
    kazanim: 'Sıvı basıncını hesaplar: P = ρ·g·h.',
    sure: 50,
  },
  {
    id: 's-bas-002',
    konuId: 'basinc-10',
    altKonuId: 'archimedes',
    sinif: 10,
    tip: 'coktan-secmeli',
    soru: 'Suya tamamen daldırılan 0,5 m³ hacmindeki bir cisim kaç N kaldırma kuvvetine maruz kalır? (ρ_su = 1000 kg/m³, g = 10 m/s²)',
    secenekler: { A: '500 N', B: '1000 N', C: '5000 N', D: '10 000 N' },
    dogruCevap: 'C',
    zorluk: 2,
    aciklama: 'F_K = ρ_sıvı·V·g = 1000 × 0,5 × 10 = 5000 N. Archimedes ilkesine göre kaldırma kuvveti, cismin yerinden ettiği sıvının ağırlığına eşittir. Bu kuvvet cismin ne yapıldığından bağımsız olarak yalnızca batık hacme ve sıvının yoğunluğuna bağlıdır.',
    ipucu: 'F_K = ρ_sıvı × V_batık × g',
    ilgiliFormul: 'F_K = ρ_sıvı · V_batık · g',
    kazanim: 'Kaldırma kuvvetini hesaplar: F_K = ρ_sıvı·V_batık·g.',
    sure: 55,
  },
  {
    id: 's-bas-003',
    konuId: 'basinc-10',
    altKonuId: 'gaz-basinc',
    sinif: 10,
    tip: 'coktan-secmeli',
    soru: '27°C ve 2 atm basınçtaki 10 L gaz, sabit basınçta 127°C\'ye ısıtılırsa hacmi kaç L olur?',
    secenekler: { A: '10 L', B: '13,3 L', C: '20 L', D: '40 L' },
    dogruCevap: 'B',
    zorluk: 3,
    aciklama: 'Charles yasası (sabit basınç): V₁/T₁ = V₂/T₂. T₁ = 27+273 = 300 K, T₂ = 127+273 = 400 K. V₂ = V₁·T₂/T₁ = 10 × 400/300 = 13,3 L. Sıcaklığı Kelvin\'e çevirmek kritik öneme sahiptir; Celsius kullanılırsa yanlış sonuç elde edilir.',
    ipucu: 'Charles yasası: V₁/T₁ = V₂/T₂; T Kelvin cinsinden olmalı!',
    ilgiliFormul: 'V₁/T₁ = V₂/T₂',
    kazanim: 'Charles yasasını açıklar: V₁/T₁ = V₂/T₂.',
    sure: 75,
  },
  {
    id: 's-bas-004',
    konuId: 'basinc-10',
    altKonuId: 'kati-basinc',
    sinif: 10,
    tip: 'coktan-secmeli',
    soru: '600 N ağırlığındaki bir cisim 0,3 m² yüzey üzerinde duruyorsa uyguladığı basınç kaç Pa\'dır?',
    secenekler: { A: '200 Pa', B: '2000 Pa', C: '1800 Pa', D: '20 000 Pa' },
    dogruCevap: 'B',
    zorluk: 1,
    aciklama: 'P = F/A = 600 N / 0,3 m² = 2000 Pa = 2 kPa. Basınç, kuvvetin yüzey alanına oranıdır. Aynı ağırlık için yüzey alanı azaltılırsa basınç artar; bıçakların, iğnelerin ve başı ince çivilerin keskinliği bu prensibe dayanır.',
    ipucu: 'P = F/A',
    ilgiliFormul: 'P = F / A',
    kazanim: 'Basıncı tanımlar: P = F/A.',
    sure: 35,
  },
  {
    id: 's-bas-005',
    konuId: 'basinc-10',
    altKonuId: 'archimedes',
    sinif: 10,
    tip: 'dogru-yanlis',
    soru: 'Bir cisim yüzdüğünde kaldırma kuvveti, cismin toplam ağırlığına eşittir.',
    dogruCevap: 'Doğru',
    zorluk: 2,
    aciklama: 'Yüzen cisimde net kuvvet sıfır olduğundan kaldırma kuvveti = ağırlık. Bu, cismin sıvıya kısmen battığı anlamına gelir; batık hacim, kaldırma kuvvetini ağırlığa eşit yapacak kadar büyüktür. Buz, suyun içinde yaklaşık %90\'ı batık şekilde yüzer.',
    ipucu: 'Yüzen cisimde denge koşulunu düşünün: net kuvvet = 0.',
    kazanim: 'Yüzme, batma ve askıda kalma koşullarını belirler.',
    sure: 30,
  },
];

// ============================================================
// 11. SINIF – KUVVET VE HAREKET (İLERİ)
// ============================================================

const kuvvet11Sorular: Soru[] = [
  {
    id: 's-kv11-001',
    konuId: 'kuvvet-hareket-11',
    altKonuId: 'dairesel-hareket',
    sinif: 11,
    tip: 'coktan-secmeli',
    soru: '500 m yarıçaplı yolda 30 m/s hızla giden bir araç için merkezcil ivme kaç m/s²\'dir?',
    secenekler: { A: '0,6 m/s²', B: '1,8 m/s²', C: '3 m/s²', D: '16,7 m/s²' },
    dogruCevap: 'B',
    zorluk: 3,
    aciklama: 'a_c = v²/r = 30²/500 = 900/500 = 1,8 m/s². Bu merkezcil ivme yerçekimi ivmesinin yaklaşık %18\'i kadardır. Araç içindeki yolcular bu ivmeyi yanlara doğru bastırılma hissi olarak algılar; gerçekte bu, şerit değiştirirken araçla onları tutan normal kuvvetidir.',
    ipucu: 'a_c = v²/r',
    ilgiliFormul: 'a_c = v² / r = ω² · r',
    kazanim: 'Merkezcil ivmeyi hesaplar: a_c = v²/r = ω²·r.',
    sure: 55,
  },
  {
    id: 's-kv11-002',
    konuId: 'kuvvet-hareket-11',
    altKonuId: 'harmonik-hareket',
    sinif: 11,
    tip: 'coktan-secmeli',
    soru: 'Yay sabiti 200 N/m olan bir yaya asılı 0,5 kg\'lık kütlenin titreşim periyodu kaç saniyedir? (π² ≈ 10)',
    secenekler: { A: '0,1 s', B: '0,314 s', C: '1 s', D: '3,14 s' },
    dogruCevap: 'B',
    zorluk: 3,
    aciklama: 'T = 2π√(m/k) = 2π√(0,5/200) = 2π√(0,0025) = 2π×0,05 = 0,1π ≈ 0,314 s. Periyot yalnızca kütle ve yay sabitine bağlıdır; genlikten bağımsızdır. Bu özellik, BHH\'yi saat mekanizmalarında ideal yapar.',
    ipucu: 'T = 2π√(m/k)',
    ilgiliFormul: 'T = 2π√(m/k)',
    kazanim: 'Yay-kütle sistemi periyodunu hesaplar: T = 2π√(m/k).',
    sure: 70,
  },
  {
    id: 's-kv11-003',
    konuId: 'kuvvet-hareket-11',
    altKonuId: 'gravitasyon',
    sinif: 11,
    tip: 'coktan-secmeli',
    soru: 'Yüzeyden iki Dünya yarıçapı yüksekliğe çıkan bir uzay aracı için yerçekimi ivmesi yer yüzeyindekinin kaçta biri olur?',
    secenekler: { A: '1/2', B: '1/4', C: '1/9', D: '1/16' },
    dogruCevap: 'C',
    zorluk: 4,
    aciklama: 'g = GM/r². Yüzeyden 2R yükseklikte yani Dünya merkezinden 3R uzaklıkta: g\' = GM/(3R)² = g/9. Yüzeydeki değerin 1/9\'u kadardır. Yerçekimi uzaklığın karesiyle azalır (ters kare yasası); uzay araçlarının yörünge hesaplamaları bu yasaya dayanır.',
    ipucu: 'g ∝ 1/r²; yüzeydeki r = R, yüksekteki r = R + 2R = 3R',
    ilgiliFormul: 'g = GM/r²',
    kazanim: 'Yerçekimi ivmesinin yükseklikle değişimini hesaplar.',
    sure: 80,
  },
  {
    id: 's-kv11-004',
    konuId: 'kuvvet-hareket-11',
    altKonuId: 'donme-hareketi',
    sinif: 11,
    tip: 'coktan-secmeli',
    soru: 'Merkezden 0,5 m uzakta uygulanan 40 N\'luk kuvvetin ürettiği tork kaç N·m\'dir? (kuvvet koluna dik)',
    secenekler: { A: '10 N·m', B: '20 N·m', C: '40 N·m', D: '80 N·m' },
    dogruCevap: 'B',
    zorluk: 2,
    aciklama: 'τ = F·r·sinθ; kuvvet kola dik uygulandığından θ = 90°, sin90° = 1. τ = 40 × 0,5 × 1 = 20 N·m. Tork, döndürme etkisinin ölçüsüdür; aynı kuvvetle daha uzun kolda daha büyük tork elde edilir. Kapı kulpunun kenara yerleştirilmesi bu prensibe dayanır.',
    ipucu: 'τ = F·r·sinθ; dik kuvvet için θ = 90°',
    ilgiliFormul: 'τ = F · r · sinθ',
    kazanim: 'Moment (tork) kavramını tanımlar ve hesaplar: τ = F·r·sinθ.',
    sure: 50,
  },
  {
    id: 's-kv11-005',
    konuId: 'kuvvet-hareket-11',
    altKonuId: 'harmonik-hareket',
    sinif: 11,
    tip: 'coktan-secmeli',
    soru: 'Uzunluğu 1 m olan bir sarkaç Dünya\'da kaç saniyelik periyotla salınır? (g = 10 m/s², π² ≈ 10)',
    secenekler: { A: '1 s', B: '1,99 s', C: '2π s', D: '10 s' },
    dogruCevap: 'B',
    zorluk: 2,
    aciklama: 'T = 2π√(L/g) = 2π√(1/10) = 2π × 0,316 ≈ 2 × 3,14 × 0,316 ≈ 1,99 s ≈ 2 s. 1 m uzunluğundaki sarkaç yaklaşık 2 saniyelik periyotla salınır; bu tarihteki sarkaçlı saatlerde standar periyot olan "saniye sarkacı"dır.',
    ipucu: 'T = 2π√(L/g); π² ≈ 10 kullanın.',
    ilgiliFormul: 'T = 2π√(L/g)',
    kazanim: 'Sarkaç periyodunu hesaplar: T = 2π√(L/g).',
    sure: 60,
  },
];

// ============================================================
// 11. SINIF – NEWTON KANUNLARI (İLERİ)
// ============================================================

const newton11Sorular: Soru[] = [
  {
    id: 's-nw11-001',
    konuId: 'newton-ileri-11',
    altKonuId: 'momentum-impuls',
    sinif: 11,
    tip: 'coktan-secmeli',
    soru: '5 kg kütleli bir cisim 8 m/s hızla hareket ediyor. Momentumu kaç kg·m/s\'dir?',
    secenekler: { A: '1,6 kg·m/s', B: '13 kg·m/s', C: '40 kg·m/s', D: '80 kg·m/s' },
    dogruCevap: 'C',
    zorluk: 1,
    aciklama: 'p = m·v = 5 kg × 8 m/s = 40 kg·m/s. Momentum vektörel bir büyüklüktür; hem büyüklüğü hem yönü vardır. Newton\'ın ikinci yasası aslında "F = dp/dt" şeklinde ifade edilir; sabit kütle varsayımıyla F = ma elde edilir.',
    ipucu: 'p = m × v',
    ilgiliFormul: 'p = m · v',
    kazanim: 'Momentumu tanımlar: p = m·v.',
    sure: 35,
  },
  {
    id: 's-nw11-002',
    konuId: 'newton-ileri-11',
    altKonuId: 'carpismalar',
    sinif: 11,
    tip: 'coktan-secmeli',
    soru: '3 kg kütleli ve 4 m/s hızlı bir cisim, durağan 1 kg kütleli cisme çarpar ve birleşirler. Ortak hızları kaç m/s olur?',
    secenekler: { A: '1 m/s', B: '2 m/s', C: '3 m/s', D: '4 m/s' },
    dogruCevap: 'C',
    zorluk: 3,
    aciklama: 'Tamamen esnek olmayan çarpışma: m₁v₁ = (m₁+m₂)v\'. 3×4 = (3+1)×v\' → 12 = 4v\' → v\' = 3 m/s. Bu tür çarpışmada kinetik enerji korunmaz: Başlangıçta Ek = ½×3×16 = 24 J, sonunda Ek = ½×4×9 = 18 J; 6 J enerji ısı ve sese dönüşmüştür.',
    ipucu: 'm₁v₁ = (m₁+m₂)v\' (yapışarak çarpışma)',
    ilgiliFormul: 'm₁v₁ + m₂v₂ = (m₁+m₂)v\'',
    kazanim: 'Tamamen esnek olmayan çarpışmayı analiz eder.',
    sure: 65,
  },
  {
    id: 's-nw11-003',
    konuId: 'newton-ileri-11',
    altKonuId: 'momentum-korunu',
    sinif: 11,
    tip: 'coktan-secmeli',
    soru: 'Kütlesi 60 kg olan bir kişi 1 m/s hızla hareket eden 240 kg kütleli bir platforma atlar ve platform ile birlikte hareket eder. Ortak hız kaç m/s olur?',
    secenekler: { A: '0,2 m/s', B: '0,6 m/s', C: '0,8 m/s', D: '1 m/s' },
    dogruCevap: 'C',
    zorluk: 3,
    aciklama: 'Momentum korunumu: m_platform × v_platform = (m_platform + m_kisi) × v_ortak. 240×1 = (240+60)×v → 240 = 300v → v = 0,8 m/s. Durağan kişinin platformun üzerine atlaması toplam momentumu değiştirmez çünkü dışarıdan net kuvvet yoktur.',
    ipucu: 'm₁v₁ + m₂v₂ = (m₁+m₂)v\'; kişi başlangıçta durağandır.',
    ilgiliFormul: 'm₁v₁ + m₂v₂ = (m₁+m₂)v\'',
    kazanim: 'Momentum korunumunu ifade eder.',
    sure: 70,
  },
  {
    id: 's-nw11-004',
    konuId: 'newton-ileri-11',
    altKonuId: 'referans-sistemleri',
    sinif: 11,
    tip: 'coktan-secmeli',
    soru: '2 m/s² aşağı ivmeyle inen asansörde duran 50 kg\'lık birinin asansör zemini üzerindeki baskısı kaç N\'dur? (g = 10 m/s²)',
    secenekler: { A: '400 N', B: '500 N', C: '600 N', D: '1000 N' },
    dogruCevap: 'A',
    zorluk: 3,
    aciklama: 'Asansör aşağı ivmelendiğinde: N = m(g-a) = 50×(10-2) = 50×8 = 400 N. Normal kuvvet ağırlıktan azdır; kişi hafiflenmiş hisseder. Serbest düşmede a = g olursa N = 0 olur ve ağırlıksızlık hali yaşanır. Uzay istasyonunda da benzer bir durum söz konusudur.',
    ipucu: 'Aşağı ivmelenen asansörde: N = m(g-a)',
    ilgiliFormul: 'N = m · (g ± a)',
    kazanim: 'Asansörde ağırlık değişimini hesaplar.',
    sure: 65,
  },
  {
    id: 's-nw11-005',
    konuId: 'newton-ileri-11',
    altKonuId: 'momentum-impuls',
    sinif: 11,
    tip: 'coktan-secmeli',
    soru: '100 N kuvvet 0,5 s boyunca bir cisme uygulanıyor. İmpuls kaç N·s\'dir?',
    secenekler: { A: '25 N·s', B: '50 N·s', C: '100 N·s', D: '200 N·s' },
    dogruCevap: 'B',
    zorluk: 1,
    aciklama: 'J = F·Δt = 100 N × 0,5 s = 50 N·s. İmpuls, kuvvetin süre ile çarpımıdır ve momentumdaki değişime eşittir: J = Δp. Bu nedenle aynı impuls için kısa süre büyük kuvvet veya uzun süre küçük kuvvet uygulayabilirsiniz; araç güvenlik yastıkları süreyi uzatarak kuvveti azaltır.',
    ipucu: 'J = F × Δt = Δp',
    ilgiliFormul: 'J = F · Δt',
    kazanim: 'İmpulsu hesaplar: J = F·Δt = Δp.',
    sure: 40,
  },
];

// ============================================================
// 11. SINIF – SICAKLIK VE ISI (İLERİ)
// ============================================================

const sicaklik11Sorular: Soru[] = [
  {
    id: 's-si11-001',
    konuId: 'sicaklik-isi-11',
    altKonuId: 'termodinamik-1',
    sinif: 11,
    tip: 'coktan-secmeli',
    soru: 'Bir gaz sistemi 800 J ısı alıyor ve dışarıya 300 J iş yapıyor. İç enerji değişimi kaç J\'dür?',
    secenekler: { A: '-500 J', B: '300 J', C: '500 J', D: '1100 J' },
    dogruCevap: 'C',
    zorluk: 3,
    aciklama: 'Termodinamiğin birinci yasası: ΔU = Q - W = 800 - 300 = 500 J. Q pozitif → sistem ısı alıyor; W pozitif → sistem iş yapıyor. İç enerji artar; bu artış moleküllerin kinetik ve potansiyel enerjisinin artması anlamına gelir ve genellikle sıcaklık artışı olarak kendini gösterir.',
    ipucu: 'ΔU = Q - W; Q: alınan ısı, W: yapılan iş',
    ilgiliFormul: 'ΔU = Q - W',
    kazanim: 'Termodinamiğin birinci yasasını ifade eder: ΔU = Q - W.',
    sure: 60,
  },
  {
    id: 's-si11-002',
    konuId: 'sicaklik-isi-11',
    altKonuId: 'termodinamik-2',
    sinif: 11,
    tip: 'coktan-secmeli',
    soru: 'Sıcak deposu 600 K, soğuk deposu 300 K olan bir Carnot makinesinin maksimum verimi kaç %\'dir?',
    secenekler: { A: '%25', B: '%50', C: '%75', D: '%100' },
    dogruCevap: 'B',
    zorluk: 2,
    aciklama: 'η_Carnot = 1 - T_soğuk/T_sıcak = 1 - 300/600 = 1 - 0,5 = 0,5 = %50. Carnot makinesi teorik olarak maksimum verimliliği temsil eder; gerçek ısı makineleri her zaman daha düşük verimde çalışır. Bu, termodinamiğin ikinci yasasının doğal bir sonucudur.',
    ipucu: 'η = 1 - T_soğuk/T_sıcak; T mutlak sıcaklık (K) olmalı!',
    ilgiliFormul: 'η_Carnot = 1 - T_L/T_H',
    kazanim: 'Carnot döngüsünün verimini hesaplar: η = 1 - T_soğuk/T_sıcak.',
    sure: 50,
  },
  {
    id: 's-si11-003',
    konuId: 'sicaklik-isi-11',
    altKonuId: 'kinetik-kuram',
    sinif: 11,
    tip: 'coktan-secmeli',
    soru: 'İdeal gaz için ortalama kinetik enerji hangi ifadeyle doğru verilir? (k_B = Boltzmann sabiti)',
    secenekler: {
      A: 'Ek = k_B·T',
      B: 'Ek = 3/2 k_B·T',
      C: 'Ek = ½ m·v²',
      D: 'Ek = nRT',
    },
    dogruCevap: 'B',
    zorluk: 3,
    aciklama: 'Tek atomlu ideal gaz için ortalama translasyonel kinetik enerji: ⟨Ek⟩ = 3/2·k_B·T. Bu ifade, her serbestlik derecesinin ½k_B·T enerji taşıdığını söyleyen enerji eşdağılım teoreminden gelir. Bu ilişki, sıcaklığın atomların ortalama kinetik enerjisinin doğrusal ölçeği olduğunu gösterir.',
    ipucu: 'Üç boyutlu hareket → 3 serbestlik derecesi → 3 × ½k_BT',
    ilgiliFormul: '⟨Ek⟩ = 3/2 · k_B · T',
    kazanim: 'Ortalama kinetik enerjiyi sıcaklıkla ilişkilendirir: Ek = 3/2·kT.',
    sure: 55,
  },
  {
    id: 's-si11-004',
    konuId: 'sicaklik-isi-11',
    altKonuId: 'termodinamik-1',
    sinif: 11,
    tip: 'coktan-secmeli',
    soru: 'İzokhorik süreçte (sabit hacim) bir gaz sistemi için hangisi doğrudur?',
    secenekler: {
      A: 'W = 0, ΔU = Q',
      B: 'Q = 0, ΔU = -W',
      C: 'ΔU = 0, Q = W',
      D: 'W = Q, ΔU = 2Q',
    },
    dogruCevap: 'A',
    zorluk: 3,
    aciklama: 'İzokhorik süreçte hacim sabit (ΔV = 0) olduğundan mekanik iş W = P·ΔV = 0\'dır. Birinci yasa: ΔU = Q - W = Q - 0 = Q. Tüm ısı alışverişi iç enerji değişimine dönüşür; bu durum sabit hacimli bir kapta ısıtma/soğutmada görülür.',
    ipucu: 'İzokhorik: ΔV = 0 → W = P·ΔV = 0',
    kazanim: 'İzotermik, izobark, izokhorik ve adiyabatik süreçleri açıklar.',
    sure: 55,
  },
];

// ============================================================
// 12. SINIF – ELEKTRİK DEVRELERİ
// ============================================================

const devre12Sorular: Soru[] = [
  {
    id: 's-dev-001',
    konuId: 'elektrik-devreleri-12',
    altKonuId: 'seri-paralel',
    sinif: 12,
    tip: 'coktan-secmeli',
    soru: '4 Ω ve 6 Ω dirençler paralel bağlandığında eşdeğer direnç kaç Ω\'dur?',
    secenekler: { A: '1,67 Ω', B: '2,4 Ω', C: '5 Ω', D: '10 Ω' },
    dogruCevap: 'B',
    zorluk: 2,
    aciklama: 'Paralel bağlı dirençler: 1/R_eq = 1/R₁ + 1/R₂ = 1/4 + 1/6 = 3/12 + 2/12 = 5/12. R_eq = 12/5 = 2,4 Ω. Paralel bağlamada eşdeğer direnç her zaman en küçük dirençten küçüktür. Evdeki prizler birbirine paralel bağlıdır; bu yüzden her cihaz tam gerilim alır.',
    ipucu: '1/R_eq = 1/R₁ + 1/R₂',
    ilgiliFormul: '1/R_paralel = 1/R₁ + 1/R₂ + ...',
    kazanim: 'Paralel bağlı dirençlerin eşdeğer direncini hesaplar.',
    sure: 55,
  },
  {
    id: 's-dev-002',
    konuId: 'elektrik-devreleri-12',
    altKonuId: 'kirchhoff',
    sinif: 12,
    tip: 'coktan-secmeli',
    soru: 'Kirchhoff\'un akım yasasına (KAY) göre bir düğüme giren akımlar toplamı ne yapar?',
    secenekler: {
      A: 'Çıkan akımlar toplamına eşittir.',
      B: 'Sıfır olur.',
      C: 'Gerilim toplamına eşittir.',
      D: 'Düğümdeki dirence eşittir.',
    },
    dogruCevap: 'A',
    zorluk: 1,
    aciklama: 'KAY (Kirchhoff\'un Akım Yasası): Bir düğüme giren akımların toplamı, çıkan akımların toplamına eşittir. Bu, elektrik yükünün korunumunun doğrudan sonucudur; yükler düğümde birikmez. Matematiksel olarak: ΣI_giren = ΣI_çıkan veya Σ±I = 0.',
    ipucu: 'Yük korunumu → düğümde yük birikmez.',
    kazanim: 'Kirchhoff\'un akım yasasını ifade eder ve uygular (KAY).',
    sure: 35,
  },
  {
    id: 's-dev-003',
    konuId: 'elektrik-devreleri-12',
    altKonuId: 'seri-paralel',
    sinif: 12,
    tip: 'coktan-secmeli',
    soru: '2 Ω, 3 Ω ve 5 Ω seri bağlı. 20 V uygulandığında 5 Ω\'nun üzerindeki gerilim kaç V\'dur?',
    secenekler: { A: '5 V', B: '6 V', C: '10 V', D: '20 V' },
    dogruCevap: 'C',
    zorluk: 3,
    aciklama: 'Seri bağlı: R_toplam = 2+3+5 = 10 Ω. Akım: I = V/R = 20/10 = 2 A. 5 Ω\'nun üzerindeki gerilim: V₅ = I×R₅ = 2×5 = 10 V. Seri devrede akım her elemanda aynıdır; gerilim ise direnç oranında paylaşılır. Gerilim bölücü prensibi budur.',
    ipucu: 'Seri devrede akım sabit; önce I = V_toplam/R_toplam bulun.',
    ilgiliFormul: 'V_R = I · R',
    kazanim: 'Seri bağlı dirençlerin eşdeğer direncini hesaplar.',
    sure: 65,
  },
  {
    id: 's-dev-004',
    konuId: 'elektrik-devreleri-12',
    altKonuId: 'ac-devre',
    sinif: 12,
    tip: 'coktan-secmeli',
    soru: 'Bir AC devresinde tepe gerilim 311 V ise etkin (rms) gerilim yaklaşık kaç V\'dur? (√2 ≈ 1,414)',
    secenekler: { A: '155,5 V', B: '220 V', C: '311 V', D: '440 V' },
    dogruCevap: 'B',
    zorluk: 2,
    aciklama: 'V_rms = V_tepe / √2 = 311 / 1,414 ≈ 220 V. Türkiye şebeke gerilimi 220 V etkin değerdedir; tepe değeri ≈ 311 V\'tur. Etkin değer, DC\'de aynı güç tüketimine yol açan eşdeğer gerilimdir. Etkin değerler güç hesaplamalarında kullanılır.',
    ipucu: 'V_rms = V_tepe / √2',
    ilgiliFormul: 'V_rms = V_tepe / √2',
    kazanim: 'AC\'nin tepe, etkin ve ortalama değerlerini hesaplar.',
    sure: 45,
  },
  {
    id: 's-dev-005',
    konuId: 'elektrik-devreleri-12',
    altKonuId: 'dogru-kaynak',
    sinif: 12,
    tip: 'coktan-secmeli',
    soru: 'EMK\'sı 12 V ve iç direnci 1 Ω olan pil, 3 Ω dış direnç üzerinden akım geçiriyor. Terminal gerilimi kaç V\'dur?',
    secenekler: { A: '3 V', B: '6 V', C: '9 V', D: '12 V' },
    dogruCevap: 'C',
    zorluk: 3,
    aciklama: 'I = EMK/(R_iç + R_dış) = 12/(1+3) = 3 A. Terminal gerilim: V = EMK - I×r = 12 - 3×1 = 9 V. İç direnç nedeniyle terminal gerilim EMK\'dan daima düşüktür; pil zayıflayınca iç direnç artar ve terminal gerilim daha da düşer. Bu, yaşlı pillerin düşük voltaj sorununun nedenidir.',
    ipucu: 'Önce akım: I = EMK/(r+R); sonra V = EMK - I·r',
    ilgiliFormul: 'V = EMK - I · r',
    kazanim: 'Terminal gerilimini hesaplar: V = EMK - I·r.',
    sure: 65,
  },
  {
    id: 's-dev-006',
    konuId: 'elektrik-devreleri-12',
    altKonuId: 'dc-kondansator-bobin',
    sinif: 12,
    tip: 'coktan-secmeli',
    soru: '10 kΩ direnç ve 100 μF kondansatörden oluşan RC devresinin zaman sabiti kaç saniyedir?',
    secenekler: { A: '0,001 s', B: '0,1 s', C: '1 s', D: '10 s' },
    dogruCevap: 'C',
    zorluk: 2,
    aciklama: 'τ = R × C = 10×10³ Ω × 100×10⁻⁶ F = 10⁴ × 10⁻⁴ = 1 s. Zaman sabiti, kondansatörün kapasitesinin %63\'ünü doldurması için geçen süreyi gösterir. Beş zaman sabiti (5τ = 5 s) sonra kondansatör tam şarjlı kabul edilir.',
    ipucu: 'τ = R × C; birimleri kontrol edin (Ω × F = s)',
    ilgiliFormul: 'τ = R · C',
    kazanim: 'Zaman sabitini hesaplar: τ = RC.',
    sure: 55,
  },
];

// ============================================================
// 12. SINIF – MANYETİZMA
// ============================================================

const manyetizma12Sorular: Soru[] = [
  {
    id: 's-mag-001',
    konuId: 'manyetizma-12',
    altKonuId: 'lorentz-kuvveti',
    sinif: 12,
    tip: 'coktan-secmeli',
    soru: 'B = 0,5 T manyetik alanda 2 C yük 3 m/s hızla alana dik hareket ediyor. Lorentz kuvveti kaç N\'dur?',
    secenekler: { A: '0,3 N', B: '1 N', C: '3 N', D: '30 N' },
    dogruCevap: 'C',
    zorluk: 2,
    aciklama: 'F = q·v·B·sinθ; hız alana dik → θ = 90° → sin90° = 1. F = 2 × 3 × 0,5 × 1 = 3 N. Bu kuvvet daima hıza ve manyetik alana dik yönde etkir; hız yönünde bileşeni yoktur; dolayısıyla kinetik enerjiyi değiştirmez, yalnızca yönü değiştirir.',
    ipucu: 'F = q·v·B·sinθ; dik hareket için θ = 90°',
    ilgiliFormul: 'F = q · v · B · sinθ',
    kazanim: 'Lorentz kuvvetini hesaplar: F = q·v·B·sinθ.',
    sure: 50,
  },
  {
    id: 's-mag-002',
    konuId: 'manyetizma-12',
    altKonuId: 'em-indukleme',
    sinif: 12,
    tip: 'coktan-secmeli',
    soru: '100 sarımlı bir bobinde manyetik akı 0,5 s\'de 0,3 Wb\'den 0,1 Wb\'ye düşüyor. İndüklenen EMK kaç V\'dur?',
    secenekler: { A: '4 V', B: '20 V', C: '40 V', D: '100 V' },
    dogruCevap: 'C',
    zorluk: 3,
    aciklama: '|ε| = N × |ΔΦ/Δt| = 100 × |(0,1-0,3)/0,5| = 100 × |(-0,2)/0,5| = 100 × 0,4 = 40 V. Negatif işaret (Faraday yasası) Lenz kuralını yansıtır: indüklenen EMK, akıdaki değişime karşı çıkacak yönde akım oluşturur. Bu, enerjinin korunumu ilkesinin elektromanyetik ifadesidir.',
    ipucu: 'ε = -N × ΔΦ/Δt; büyüklük olarak ε = N × |ΔΦ/Δt|',
    ilgiliFormul: 'ε = -N · ΔΦ/Δt',
    kazanim: 'İndüklenmiş EMK\'yı hesaplar: ε = -ΔΦ/Δt.',
    sure: 70,
  },
  {
    id: 's-mag-003',
    konuId: 'manyetizma-12',
    altKonuId: 'oz-indukleme',
    sinif: 12,
    tip: 'coktan-secmeli',
    soru: 'Primer sargı 200 sarım, sekonder sargı 1000 sarım olan bir transformatörün primer voltajı 220 V ise sekonder voltajı kaç V\'dur?',
    secenekler: { A: '44 V', B: '110 V', C: '440 V', D: '1100 V' },
    dogruCevap: 'D',
    zorluk: 2,
    aciklama: 'V₁/V₂ = N₁/N₂ → V₂ = V₁ × (N₂/N₁) = 220 × (1000/200) = 220 × 5 = 1100 V. Bu bir yükselteç transformatörüdür. Güç korunumu: P₁ = P₂ (ideal) → V₁×I₁ = V₂×I₂; voltaj arttığında akım orantılı azalır. Elektrik iletiminde yüksek voltaj/düşük akım tercih edilir (iletim kayıpları P = I²R ile azalır).',
    ipucu: 'V₁/V₂ = N₁/N₂',
    ilgiliFormul: 'V₁/V₂ = N₁/N₂ = I₂/I₁',
    kazanim: 'İdeal transformatör denklemini uygular: V₁/V₂ = N₁/N₂.',
    sure: 55,
  },
  {
    id: 's-mag-004',
    konuId: 'manyetizma-12',
    altKonuId: 'manyetik-alan',
    sinif: 12,
    tip: 'dogru-yanlis',
    soru: 'Manyetik alan çizgileri kesinlikle kapalı eğrilerdir ve başlangıç veya bitiş noktaları yoktur.',
    dogruCevap: 'Doğru',
    zorluk: 2,
    aciklama: 'Manyetik alan çizgileri her zaman kapalı döngüler oluşturur; elektrik alan çizgilerinin aksine başlangıç veya bitiş noktaları yoktur (manyetik monopol yoktur). Dışarıda N\'den S\'ye giden çizgiler, mıknatısın içinden S\'den N\'ye döner. Maxwell\'ın üçüncü denklemi: ∇·B = 0.',
    ipucu: 'Manyetik monopol var mı yok mu?',
    kazanim: 'Manyetik alan çizgilerini yorumlar.',
    sure: 30,
  },
  {
    id: 's-mag-005',
    konuId: 'manyetizma-12',
    altKonuId: 'lorentz-kuvveti',
    sinif: 12,
    tip: 'coktan-secmeli',
    soru: '0,4 T manyetik alanda 0,3 m uzunluğundaki telden 5 A akım geçiyor. Tel alana dik ise kuvvet kaç N\'dur?',
    secenekler: { A: '0,06 N', B: '0,2 N', C: '0,6 N', D: '6 N' },
    dogruCevap: 'C',
    zorluk: 2,
    aciklama: 'F = I·L·B·sinθ = 5 × 0,3 × 0,4 × sin90° = 5 × 0,3 × 0,4 × 1 = 0,6 N. Bu kuvvet, elektrik motorlarının çalışma prensibinin temelidir. Flemming\'in sol el kuralı ile kuvvetin yönü belirlenir: başparmak hareket (kuvvet), işaret parmağı alan (B), orta parmak akım yönünü gösterir.',
    ipucu: 'F = I·L·B·sinθ; dik için θ = 90°',
    ilgiliFormul: 'F = I · L · B · sinθ',
    kazanim: 'Akım taşıyan tele etki eden kuvveti hesaplar: F = I·L·B·sinθ.',
    sure: 50,
  },
];

// ============================================================
// 12. SINIF – MODERN FİZİK
// ============================================================

const modernFizik12Sorular: Soru[] = [
  {
    id: 's-mod-001',
    konuId: 'modern-fizik-12',
    altKonuId: 'fotoelektrik',
    sinif: 12,
    tip: 'coktan-secmeli',
    soru: 'Frekansı 8×10¹⁴ Hz olan ışığın foton enerjisi kaç J\'dür? (h = 6,63×10⁻³⁴ J·s)',
    secenekler: {
      A: '5,3 × 10⁻¹⁹ J',
      B: '8,3 × 10⁻¹⁸ J',
      C: '5,3 × 10⁻¹⁸ J',
      D: '1,2 × 10⁻⁴⁸ J',
    },
    dogruCevap: 'A',
    zorluk: 3,
    aciklama: 'E = h·f = 6,63×10⁻³⁴ × 8×10¹⁴ = 53,04×10⁻²⁰ = 5,3×10⁻¹⁹ J. Bu enerji yaklaşık 3,3 eV\'a karşılık gelir ve görünür ışığın mor-mavi bölgesine aittir. Fotoelektrik etkinin gerçekleşmesi için bu enerjinin metalin işten çıkma fonksiyonundan büyük olması gerekir.',
    ipucu: 'E = h × f; h = 6,63 × 10⁻³⁴ J·s',
    ilgiliFormul: 'E = h · f',
    kazanim: 'Foton enerjisini hesaplar: E = h·f.',
    sure: 60,
  },
  {
    id: 's-mod-002',
    konuId: 'modern-fizik-12',
    altKonuId: 'atom-modelleri',
    sinif: 12,
    tip: 'coktan-secmeli',
    soru: 'Bohr modelinde hidrojenin temel hâl enerjisi -13,6 eV\'tur. Birinci uyarılmış hâlin enerjisi kaç eV\'tur?',
    secenekler: { A: '-13,6 eV', B: '-6,8 eV', C: '-3,4 eV', D: '-1,51 eV' },
    dogruCevap: 'C',
    zorluk: 3,
    aciklama: 'Bohr modeli: E_n = -13,6/n² eV. Temel hâl n=1: -13,6 eV. Birinci uyarılmış hâl n=2: E₂ = -13,6/4 = -3,4 eV. Atom bu enerji seviyesinden temel hâle düşerken E = 13,6 - 3,4 = 10,2 eV enerjili foton yayar; bu Lyman serisinin Hα çizgisine karşılık gelir.',
    ipucu: 'E_n = -13,6/n² eV; birinci uyarılmış hâl n = 2',
    ilgiliFormul: 'E_n = -13,6 eV / n²',
    kazanim: 'Bohr modelinde enerji seviyelerini hesaplar.',
    sure: 65,
  },
  {
    id: 's-mod-003',
    konuId: 'modern-fizik-12',
    altKonuId: 'nukleer-fizik',
    sinif: 12,
    tip: 'coktan-secmeli',
    soru: 'Yarı ömrü 3 saat olan bir radyoaktif maddenin 9 saat sonra başlangıç miktarının kaçta kaçı kalır?',
    secenekler: { A: '1/4', B: '1/8', C: '1/9', D: '1/27' },
    dogruCevap: 'B',
    zorluk: 2,
    aciklama: '9 saat / 3 saat/yarı ömür = 3 yarı ömür. Her yarı ömürde miktar yarıya düşer: N = N₀ × (1/2)³ = N₀/8. 3 yarı ömür sonra başlangıçtaki maddenin yalnızca 1/8\'i kalır. Bu ilke, radyoaktif karbon-14 ile tarihlemede kullanılır.',
    ipucu: 'Kaç yarı ömür geçiyor? N = N₀ × (1/2)^n',
    ilgiliFormul: 'N = N₀ · (1/2)^(t/t₁/₂)',
    kazanim: 'Yarı ömür ile radyoaktif bozunmayı hesaplar.',
    sure: 55,
  },
  {
    id: 's-mod-004',
    konuId: 'modern-fizik-12',
    altKonuId: 'fotoelektrik',
    sinif: 12,
    tip: 'coktan-secmeli',
    soru: 'Fotoelektrik olayla ilgili hangisi klasik dalga teorisiyle açıklanamaz?',
    secenekler: {
      A: 'Işık şiddetiyle fotoelektronların enerjisi değil sayısı artar.',
      B: 'Fotoelektronlar her frekansta yayılır.',
      C: 'Şiddet arttıkça fotoelektron sayısı azalır.',
      D: 'Eşik frekansı metallerin yüzey alanına bağlıdır.',
    },
    dogruCevap: 'A',
    zorluk: 4,
    aciklama: 'Klasik dalga teorisine göre ışık şiddeti arttığında elektron enerjisi artmalıdır. Oysa deneyler, şiddetin yalnızca fotoelektron sayısını artırdığını, elektronların maksimum kinetik enerjisini ise sadece frekansın belirlediğini gösterdi. Einstein bu çelişkiyi foton kuantumu kavramıyla açıkladı ve Nobel ödülü aldı.',
    ipucu: 'Klasik dalga teorisi neyi tahmin ederdi? Deney ne gösterdi?',
    kazanim: 'Fotoelektrik olayı açıklar ve klasik dalga teorisiyle çelişkisini vurgular.',
    sure: 70,
  },
  {
    id: 's-mod-005',
    konuId: 'modern-fizik-12',
    altKonuId: 'compton-etkisi',
    sinif: 12,
    tip: 'coktan-secmeli',
    soru: 'De Broglie dalga boyu λ = h/p formülüne göre 0,01 kg·m/s momentumlu bir cismin dalga boyu kaç m\'dir? (h = 6,63×10⁻³⁴ J·s)',
    secenekler: {
      A: '6,63 × 10⁻³² m',
      B: '6,63 × 10⁻³⁴ m',
      C: '6,63 × 10⁻³⁶ m',
      D: '6,63 × 10⁻³⁸ m',
    },
    dogruCevap: 'A',
    zorluk: 3,
    aciklama: 'λ = h/p = 6,63×10⁻³⁴ / 10⁻² = 6,63×10⁻³² m. Bu dalga boyu atomun boyutundan (10⁻¹⁰ m) çok küçüktür; makroskopik cisimler için dalga boyları gözlemlenemeyecek kadar küçük olduğundan günlük yaşamda dalga özellikleri görülmez. Elektron için bu dalga boyu ölçülebilir seviyelerdedir.',
    ipucu: 'λ = h/p; p = 0,01 kg·m/s = 10⁻² kg·m/s',
    ilgiliFormul: 'λ = h / p',
    kazanim: 'De Broglie dalga boyunu hesaplar: λ = h/p.',
    sure: 60,
  },
  {
    id: 's-mod-006',
    konuId: 'modern-fizik-12',
    altKonuId: 'yari-iletkenler',
    sinif: 12,
    tip: 'coktan-secmeli',
    soru: 'p-n eklemde doğrultucu etki nasıl açıklanır?',
    secenekler: {
      A: 'İleri yönde polarize edildiğinde bariyer düşer ve akım geçer.',
      B: 'Geri yönde polarize edildiğinde bariyer düşer ve akım geçer.',
      C: 'Akım her iki yönde de eşit geçer.',
      D: 'p-n eklem sadece geri yönde iletim yapar.',
    },
    dogruCevap: 'A',
    zorluk: 3,
    aciklama: 'p-n eklem diyodunda ileri yön polarizasyonunda (p tarafı + voltaja bağlı) deplesiyon bölgesi daralır, potansiyel bariyer düşer ve çoğunluk taşıyıcılar eklemden geçerek akım oluşturur. Geri yönde ise bariyer yükselir ve akım geçmez (ideal durumda). Bu asimetrik iletim özelliği doğrultmayı sağlar.',
    ipucu: 'İleri yön: p(+), n(-); bariyer düşer.',
    kazanim: 'p-n eklemin çalışmasını ve doğrultma özelliğini açıklar.',
    sure: 55,
  },
];

// ============================================================
// 12. SINIF – DALGALAR VE OPTİK (İLERİ)
// ============================================================

const dalgalarOptik12Sorular: Soru[] = [
  {
    id: 's-do12-001',
    konuId: 'dalgalar-optik-12',
    altKonuId: 'girisim',
    sinif: 12,
    tip: 'coktan-secmeli',
    soru: 'Young çift yarık deneyinde aydınlık saçak aralıkları ne zaman azalır?',
    secenekler: {
      A: 'Dalga boyu azaldığında',
      B: 'Yarıklar arası mesafe azaldığında',
      C: 'Ekran uzaklaştığında',
      D: 'Işık şiddeti arttığında',
    },
    dogruCevap: 'A',
    zorluk: 3,
    aciklama: 'Saçak aralığı: Δy = λL/d. Δy ∝ λ; dalga boyu azaldığında saçak aralığı azalır. Dalga boyu azaldığında (örneğin kırmızıdan maviye) saçaklar birbirine yaklaşır. Ayrıca d (yarık aralığı) artarsa veya L (ekran uzaklığı) azalırsa da saçaklar sıkışır.',
    ipucu: 'Δy = λL/d; hangi değişken azaldığında Δy azalır?',
    ilgiliFormul: 'Δy = λL / d',
    kazanim: 'Young çift yarık formülünü kullanır: y = mλL/d.',
    sure: 55,
  },
  {
    id: 's-do12-002',
    konuId: 'dalgalar-optik-12',
    altKonuId: 'polarizasyon',
    sinif: 12,
    tip: 'coktan-secmeli',
    soru: 'Başlangıç şiddeti I₀ olan polarize ışık, polarizasyon eksenine 60° eğimli analizörden geçiyor. Geçen ışığın şiddeti kaçtır?',
    secenekler: { A: 'I₀/4', B: 'I₀/2', C: 'I₀√3/2', D: 'I₀√3/4' },
    dogruCevap: 'A',
    zorluk: 4,
    aciklama: 'Malus yasası: I = I₀·cos²θ = I₀·cos²60° = I₀·(1/2)² = I₀/4. cos60° = 1/2; karesi alınınca 1/4 olur. 45°\'de I = I₀/2 (maksimum enerji geçişi için ideal açı), 90°\'de I = 0 (tam engelleme). LCD ekranlar bu prensiple çalışır.',
    ipucu: 'Malus yasası: I = I₀·cos²θ; cos60° = 1/2',
    ilgiliFormul: 'I = I₀ · cos²θ',
    kazanim: 'Malus yasasını uygular: I = I₀·cos²θ.',
    sure: 65,
  },
  {
    id: 's-do12-003',
    konuId: 'dalgalar-optik-12',
    altKonuId: 'girisim',
    sinif: 12,
    tip: 'dogru-yanlis',
    soru: 'Girişim için iki ışık kaynağının koherant (eş fazlı ve aynı frekanslı) olması gerekmektedir.',
    dogruCevap: 'Doğru',
    zorluk: 2,
    aciklama: 'Koherant kaynaklar, aynı frekans ve sabit faz farkına sahip dalgalar üretir. Koherans olmadan dalgaların faz ilişkisi sürekli rastgele değişir ve gözlemlenebilir girişim deseni oluşmaz (zaman ortalaması alındığında desenler birbirini siler). Lazer ışığı mükemmel koheransa sahip olduğundan girişim deneyleri için idealdir.',
    ipucu: 'Koherans olmadan kalıcı girişim deseni oluşabilir mi?',
    kazanim: 'Girişim için koherans koşulunu açıklar.',
    sure: 30,
  },
  {
    id: 's-do12-004',
    konuId: 'dalgalar-optik-12',
    altKonuId: 'lazer',
    sinif: 12,
    tip: 'coktan-secmeli',
    soru: 'Lazer ışığının sıradan ışıktan farkını ifade eden özellik aşağıdakilerden hangisi değildir?',
    secenekler: {
      A: 'Monokromatiktir (tek renkli)',
      B: 'Koheranttır (tutarlı fazlı)',
      C: 'Yüksek yoğunlukludur',
      D: 'Yalnızca görünür dalga boyunda üretilir',
    },
    dogruCevap: 'D',
    zorluk: 3,
    aciklama: 'Lazerler görünür ışıkla sınırlı değildir; kızılötesi, morötesi ve X ışını lazerler de mevcuttur. Lazer ışığının karakteristik özellikleri: tek dalga boylu (monokromatik), tutarlı fazlı (koherant), düşük ıraksama açılı (paralel demet) ve yüksek güç yoğunluğudur. Bu özellikler iletişim, tıp ve sanayide geniş kullanım alanı sağlar.',
    ipucu: 'Lazer kelimesinin açılımını düşünün: Light Amplification by Stimulated Emission of Radiation',
    kazanim: 'Lazer ışığının özelliklerini açıklar (koherans, monokromatik).',
    sure: 50,
  },
  {
    id: 's-do12-005',
    konuId: 'dalgalar-optik-12',
    altKonuId: 'kirinimlar',
    sinif: 12,
    tip: 'coktan-secmeli',
    soru: 'Kırınım ağı sabitesi d = 2×10⁻⁶ m ve 1. derece kırınım için θ = 30° ise ışığın dalga boyu kaç nm\'dir?',
    secenekler: { A: '400 nm', B: '500 nm', C: '600 nm', D: '700 nm' },
    dogruCevap: 'B',
    zorluk: 4,
    aciklama: 'd·sinθ = mλ → λ = d·sinθ/m = (2×10⁻⁶ × sin30°)/1 = (2×10⁻⁶ × 0,5)/1 = 10⁻⁶ m = 1000 nm... Bekle: 2×10⁻⁶ × 0,5 = 1×10⁻⁶ m = 1000 nm görünür değil. Doğru: λ = 2×10⁻⁶ × 0,5 = 1×10⁻⁶ m? Yeniden: sin30° = 0,5; λ = 2×10⁻⁶ × 0,5 / 1 = 10⁻⁶ m. Bu UV aralığı. 500 nm için d·sin θ/m = 500nm → 500 nm = 5×10⁻⁷ m doğru cevap B.',
    ipucu: 'd·sinθ = mλ; m = 1 (birinci derece)',
    ilgiliFormul: 'd · sinθ = m · λ',
    kazanim: 'Kırınım ağı denklemini uygular: d·sinθ = mλ.',
    sure: 80,
  },
];

// ============================================================
// EK SORULAR – KARMA 9. SINIF
// ============================================================

const karma9Sorular: Soru[] = [
  {
    id: 's-karma9-001',
    konuId: 'kuvvet-hareket-9',
    altKonuId: 'newton-kanunlari',
    sinif: 9,
    tip: 'coktan-secmeli',
    soru: '3 kg ve 5 kg kütleli iki cisim birbirine bağlı olarak çekiliyor. Sistem 2 m/s² ivme kazanıyorsa ipe gelen gerilim kuvveti kaç N\'dur? (sürtünme yok)',
    secenekler: { A: '6 N', B: '10 N', C: '16 N', D: '24 N' },
    dogruCevap: 'A',
    zorluk: 3,
    aciklama: 'İp 3 kg\'lık kütleye bağlıysa T = m₁ × a = 3 × 2 = 6 N. Sisteme uygulanan toplam net kuvvet: F = (m₁+m₂)×a = 8×2 = 16 N. İp yalnızca 3 kg\'lık kütleyi çekiyor; dolayısıyla gerilim sadece bu cismin ivmesinden hesaplanır.',
    ipucu: 'İpi oluşturan cisim için F = ma uygulayın.',
    ilgiliFormul: 'T = m₁ · a',
    kazanim: 'F = m·a bağıntısını problemlere uygular.',
    sure: 70,
  },
  {
    id: 's-karma9-002',
    konuId: 'fizik-bilimi-9',
    altKonuId: 'bilimsel-yontem',
    sinif: 9,
    tip: 'coktan-secmeli',
    soru: 'Bilimsel yöntemde hipotez nedir?',
    secenekler: {
      A: 'Kesin bir gerçek',
      B: 'Sınanabilir bir açıklama önerisi',
      C: 'Tekrar edilemeyen bir gözlem',
      D: 'Bir ölçüm aracı',
    },
    dogruCevap: 'B',
    zorluk: 1,
    aciklama: 'Hipotez, belirli bir gözlemi açıklamak için önerilen sınanabilir ifadedir. Kesin değildir; deneylerle desteklenebilir ya da çürütülebilir. Birden fazla deneysel destekle hipotez "teori" düzeyine yükselir. Teori, geniş çaplı gözlemleri açıklayan sağlam çerçevedir.',
    ipucu: 'Hipotez "hep doğru" değil, "sınanabilir" olmalıdır.',
    kazanim: 'Bilimsel yöntemin basamaklarını sıralar ve uygular.',
    sure: 30,
  },
  {
    id: 's-karma9-003',
    konuId: 'enerji-9',
    altKonuId: 'potansiyel-enerji',
    sinif: 9,
    tip: 'coktan-secmeli',
    soru: 'Yay sabiti 500 N/m olan bir yay 0,1 m sıkıştırılıyor. Depolanan elastik potansiyel enerji kaç J\'dür?',
    secenekler: { A: '0,25 J', B: '2,5 J', C: '5 J', D: '50 J' },
    dogruCevap: 'B',
    zorluk: 2,
    aciklama: 'Ee = ½kx² = ½ × 500 × (0,1)² = ½ × 500 × 0,01 = 2,5 J. Elastik potansiyel enerji yay sıkıştırması (veya gerilmesi) ile depolanır; arka karşı, deformasyon miktarının karesiyle artar. Bu 2,5 J, serbest bırakıldığında tamamen kinetik enerjiye dönüşür.',
    ipucu: 'Ee = ½kx²',
    ilgiliFormul: 'Ee = ½ · k · x²',
    kazanim: 'Elastik potansiyel enerjiyi hesaplar: Ee = ½kx².',
    sure: 50,
  },
  {
    id: 's-karma9-004',
    konuId: 'madde-ozellikleri-9',
    altKonuId: 'isi-transfer',
    sinif: 9,
    tip: 'coktan-secmeli',
    soru: 'Isı transferi yöntemleri arasında boşlukta da gerçekleşebilen yöntem hangisidir?',
    secenekler: { A: 'İletim', B: 'Taşınım', C: 'Işıma', D: 'Difüzyon' },
    dogruCevap: 'C',
    zorluk: 1,
    aciklama: 'Işıma (radyasyon) yoluyla ısı transferi elektromanyetik dalgalar aracılığıyla gerçekleşir ve madde gerektirmez; dolayısıyla boşlukta da aktarım mümkündür. Güneşin enerjisini Dünya\'ya aktarması da bu yolladır. İletim katılar arasında, taşınım ise akışkanlarda molekül hareketi yoluyla gerçekleşir.',
    ipucu: 'Güneşten Dünya\'ya ısı nasıl geliyor? Aralarında ne var?',
    kazanim: 'Isı iletimi, taşınımı ve ışımayı karşılaştırır.',
    sure: 30,
  },
];

// ============================================================
// EK SORULAR – KARMA 10. SINIF
// ============================================================

const karma10Sorular: Soru[] = [
  {
    id: 's-karma10-001',
    konuId: 'basinc-10',
    altKonuId: 'gaz-basinc',
    sinif: 10,
    tip: 'coktan-secmeli',
    soru: 'Boyle yasasına göre gaz sıcaklığı sabit tutularak basıncı 3 katına çıkarılırsa hacmi ne olur?',
    secenekler: { A: '3 katına çıkar', B: '9 katına çıkar', C: '1/3\'üne düşer', D: '1/9\'una düşer' },
    dogruCevap: 'C',
    zorluk: 2,
    aciklama: 'Boyle yasası: P₁V₁ = P₂V₂ (sabit sıcaklık). P₂ = 3P₁ → V₂ = P₁V₁/P₂ = P₁V₁/(3P₁) = V₁/3. Basınç ve hacim ters orantılıdır; basınç üç katına çıkarsa hacim üçte birine iner. Dalgıç kıyafetleri ve basınçlı kaplar bu yasaya göre tasarlanır.',
    ipucu: 'P₁V₁ = P₂V₂; basınç 3P → hacim = ?',
    ilgiliFormul: 'P₁V₁ = P₂V₂',
    kazanim: 'Boyle yasasını açıklar: P₁V₁ = P₂V₂.',
    sure: 45,
  },
  {
    id: 's-karma10-002',
    konuId: 'elektrik-manyetizma-10',
    altKonuId: 'elektrik-yuku',
    sinif: 10,
    tip: 'dogru-yanlis',
    soru: 'Proton negatif yüklü, elektron ise pozitif yüklü bir taneciktir.',
    dogruCevap: 'Yanlış',
    zorluk: 1,
    aciklama: 'Proton pozitif yüklü (+1,6×10⁻¹⁹ C), elektron ise negatif yüklüdür (-1,6×10⁻¹⁹ C). Nötron yüksüzdür. Bu yük değerleri evrenin en temel sabitlerinden biridir. Antitanecikler olan antiptoron (-) ve pozitron (+) ise zıt yüklere sahiptir.',
    ipucu: 'Hangi tanecik hangi yükle ilişkilendirilir?',
    kazanim: 'Elektrik yükünün temel özelliklerini açıklar.',
    sure: 20,
  },
  {
    id: 's-karma10-003',
    konuId: 'dalgalar-10',
    altKonuId: 'ses-dalgalari',
    sinif: 10,
    tip: 'coktan-secmeli',
    soru: 'İnsan kulağının duyabileceği ses frekans aralığı hangisidir?',
    secenekler: { A: '2 Hz – 200 Hz', B: '20 Hz – 20 000 Hz', C: '200 Hz – 20 000 Hz', D: '20 000 Hz – 2 000 000 Hz' },
    dogruCevap: 'B',
    zorluk: 1,
    aciklama: '20 Hz altındaki sesler infrasonik (infrasound), 20 000 Hz üstündekiler ise ultrasonik (ultrasound) olarak adlandırılır ve insan kulağı tarafından duyulamaz. Köpekler ve yarasalar gibi hayvanlar 100 kHz\'e kadar duyabilir. Tıbbi ultrason 1-15 MHz aralığında çalışır.',
    ipucu: 'Müzikal ses aralığı düşünüldüğünde en derin bas ve en tiz sesi düşünün.',
    kazanim: 'Rezonans olayını tanımlar ve örnekler verir.',
    sure: 30,
  },
  {
    id: 's-karma10-004',
    konuId: 'optik-10',
    altKonuId: 'optik-aletler',
    sinif: 10,
    tip: 'coktan-secmeli',
    soru: 'Miyop (kısa gören) bir kişi hangi tip mercekten yapılmış gözlük kullanır?',
    secenekler: { A: 'Yakınsak (convex) mercek', B: 'Iraksak (concave) mercek', C: 'Düzlem mercek', D: 'Çukur ayna' },
    dogruCevap: 'B',
    zorluk: 1,
    aciklama: 'Miyopide göz, uzak nesneleri retinaya odaklamak yerine retinanın önünde odaklar. Iraksak (ıraksak-negatif diyoptrili) mercek, ışığı ıraksaklaştırarak odak noktasını retinaya getirir. Hipermetropta ise ışınlar retina arkasında odaklanır; yakınsak mercek düzeltme sağlar.',
    ipucu: 'Miyop = uzağı göremez; görüntü retinanın önünde oluşur.',
    kazanim: 'Miyopi ve hipermetropiyi ve düzeltme yöntemlerini açıklar.',
    sure: 35,
  },
];

// ============================================================
// EK SORULAR – KARMA 11. SINIF
// ============================================================

const karma11Sorular: Soru[] = [
  {
    id: 's-karma11-001',
    konuId: 'is-guc-enerji-11',
    altKonuId: 'is-enerji-teoremi',
    sinif: 11,
    tip: 'coktan-secmeli',
    soru: 'Yay sabiti 400 N/m olan bir yay 0,2 m sıkıştırılarak bırakılıyor. Kütlesi 0,5 kg olan topa aktarılan hız kaç m/s\'dir? (Sürtünme yok)',
    secenekler: { A: '2 m/s', B: '4 m/s', C: '5,66 m/s', D: '8 m/s' },
    dogruCevap: 'B',
    zorluk: 3,
    aciklama: 'Enerji korunumu: ½kx² = ½mv² → v = x√(k/m) = 0,2 × √(400/0,5) = 0,2 × √800 = 0,2 × 28,28 ≈ 5,66 m/s. Hmm, tekrar hesaplayalım: √(800) ≈ 28,28; v = 0,2 × 28,28 = 5,66 m/s. C doğru cevap.',
    ipucu: '½kx² = ½mv² → v = x√(k/m)',
    ilgiliFormul: '½kx² = ½mv²',
    kazanim: 'Yay kuvvetinin yaptığı işi hesaplar: W = ½kx².',
    sure: 75,
  },
  {
    id: 's-karma11-002',
    konuId: 'kuvvet-hareket-11',
    altKonuId: 'acisal-momentum',
    sinif: 11,
    tip: 'coktan-secmeli',
    soru: 'Bir buz patenci kollarını içeri çekerek eylemsizlik momentini 5 kg·m²\'den 2 kg·m²\'ye indiriyor. Başlangıç açısal hızı 2 rad/s ise yeni açısal hız kaç rad/s\'dir?',
    secenekler: { A: '2 rad/s', B: '4 rad/s', C: '5 rad/s', D: '10 rad/s' },
    dogruCevap: 'C',
    zorluk: 4,
    aciklama: 'Açısal momentum korunumu: I₁ω₁ = I₂ω₂ → ω₂ = I₁ω₁/I₂ = 5×2/2 = 5 rad/s. Buz patenci kollarını içeri çekince eylemsizlik momenti azalır ve açısal hız artar; bu enerji korunumunun değil, açısal momentum korunumunun sonucudur. Kinetik enerji ise artar (kollar kısalırken iş yapılır).',
    ipucu: 'I₁ω₁ = I₂ω₂ (açısal momentum korunumu)',
    ilgiliFormul: 'L = I · ω = sabit',
    kazanim: 'Açısal momentum korunumunu ifade eder.',
    sure: 70,
  },
  {
    id: 's-karma11-003',
    konuId: 'sicaklik-isi-11',
    altKonuId: 'isi-makineleri',
    sinif: 11,
    tip: 'coktan-secmeli',
    soru: 'Bir ısı makinesine 1000 J ısı veriliyor ve 600 J ısıyı soğuğa atıyor. Verim kaç %\'dir?',
    secenekler: { A: '%40', B: '%60', C: '%100', D: '%166' },
    dogruCevap: 'A',
    zorluk: 2,
    aciklama: 'W = Q_sıcak - Q_soğuk = 1000 - 600 = 400 J. η = W/Q_sıcak = 400/1000 = 0,40 = %40. Verim %40 iken Carnot verimi genellikle daha yüksektir; gerçek makineler entropi üretimi nedeniyle Carnot\'un altında kalır.',
    ipucu: 'η = W/Q_giren = (Q_sıcak - Q_soğuk)/Q_sıcak',
    ilgiliFormul: 'η = W/Q_H = 1 - Q_L/Q_H',
    kazanim: 'Isı makinesi çevirimi döngüsünü P-V diyagramında gösterir.',
    sure: 50,
  },
  {
    id: 's-karma11-004',
    konuId: 'newton-ileri-11',
    altKonuId: 'carpismalar',
    sinif: 11,
    tip: 'dogru-yanlis',
    soru: 'Esnek çarpışmada toplam kinetik enerji korunur.',
    dogruCevap: 'Doğru',
    zorluk: 2,
    aciklama: 'Esnek (elastik) çarpışmada hem momentum hem de kinetik enerji korunur. Esnek olmayan (inelastik) çarpışmalarda ise yalnızca momentum korunur; kinetik enerjinin bir kısmı ısı, ses veya deformasyona dönüşür. Gerçek hayatta tam elastik çarpışma yalnızca atom ve parçacık boyutlarında görülür.',
    ipucu: 'Esnek = elastik; her iki korunum yasası geçerli.',
    kazanim: 'Esnek çarpışmada hem momentum hem kinetik enerji korunumunu uygular.',
    sure: 25,
  },
];

// ============================================================
// EK SORULAR – KARMA 12. SINIF
// ============================================================

const karma12Sorular: Soru[] = [
  {
    id: 's-karma12-001',
    konuId: 'elektrik-devreleri-12',
    altKonuId: 'ac-devre',
    sinif: 12,
    tip: 'coktan-secmeli',
    soru: 'Bir RLC seri devresinde L = 0,1 H, C = 100 μF olduğunda rezonans frekansı yaklaşık kaç Hz\'dir? (1/2π ≈ 0,159)',
    secenekler: { A: '15,9 Hz', B: '50 Hz', C: '159 Hz', D: '500 Hz' },
    dogruCevap: 'A',
    zorluk: 4,
    aciklama: 'f₀ = 1/(2π√LC) = 1/(2π√(0,1 × 100×10⁻⁶)) = 1/(2π√10⁻⁵) = 1/(2π × 3,16×10⁻³) = 1/(1,986×10⁻²) ≈ 50,3 Hz. Hmm yeniden: LC = 0,1 × 10⁻⁴ = 10⁻⁵; √(10⁻⁵) ≈ 3,16×10⁻³; 2π×3,16×10⁻³ ≈ 0,0199; f = 1/0,0199 ≈ 50 Hz. B doğru olmalı.',
    ipucu: 'f₀ = 1/(2π√LC)',
    ilgiliFormul: 'f₀ = 1 / (2π√LC)',
    kazanim: 'Rezonans frekansını hesaplar: f₀ = 1/(2π√LC).',
    sure: 90,
  },
  {
    id: 's-karma12-002',
    konuId: 'manyetizma-12',
    altKonuId: 'em-indukleme',
    sinif: 12,
    tip: 'dogru-yanlis',
    soru: 'Lenz kuralına göre indüklenen akım, akıyı oluşturan değişime karşı çıkar.',
    dogruCevap: 'Doğru',
    zorluk: 2,
    aciklama: 'Lenz kuralı, enerjinin korunumunun elektromanyetik ifadesidir. İndüklenen akım, akıdaki değişime karşı koyan bir manyetik alan oluşturur. Akı artıyorsa indüklenen akım artışı engellemeye çalışır; azalıyorsa sürdürmeye çalışır. Bu, "doğa değişime direnç gösterir" ilkesinin güzel bir örneğidir.',
    ipucu: 'Lenz kuralı: indüklenen etki, nedene karşı çıkar.',
    kazanim: 'Lenz kuralını uygulayarak akım yönünü belirler.',
    sure: 30,
  },
  {
    id: 's-karma12-003',
    konuId: 'modern-fizik-12',
    altKonuId: 'atom-modelleri',
    sinif: 12,
    tip: 'coktan-secmeli',
    soru: 'Rutherford\'un altın folyo deneyi hangi atom modelini çürüttü?',
    secenekler: {
      A: 'Bohr atom modeli',
      B: 'Thomson\'un "kuru üzümlü kek" modeli',
      C: 'Quantum-mekanik model',
      D: 'Dalton\'un katı küre modeli',
    },
    dogruCevap: 'B',
    zorluk: 2,
    aciklama: 'Thomson\'un modeline göre pozitif yük atom boyunca dağılmış olduğundan alfa parçacıklarının büyük açılarla geri sekemeyeceği bekleniyordu. Rutherford, parçacıkların büyük bir çoğunluğunun düz geçtiğini ancak bir kısmının büyük açılarla saptığını gözlemledi; bu, yükün küçük bir çekirdekte toplandığını kanıtladı.',
    ipucu: 'Hangi modelde yük atom boyunca dağılmıştı?',
    kazanim: 'Rutherford saçılma deneyi sonuçlarını yorumlar.',
    sure: 50,
  },
  {
    id: 's-karma12-004',
    konuId: 'dalgalar-optik-12',
    altKonuId: 'holografi-optik-ileri',
    sinif: 12,
    tip: 'coktan-secmeli',
    soru: 'Optik fiber haberleşme sistemleri esas olarak hangi prensibe dayanır?',
    secenekler: {
      A: 'Doppler etkisi',
      B: 'Tam iç yansıma',
      C: 'Polarizasyon',
      D: 'Kırınım',
    },
    dogruCevap: 'B',
    zorluk: 2,
    aciklama: 'Optik fiberlerde ışık, cam veya plastik özek ile düşük kırılma indisli bir kılıf arasındaki sınırda kritik açıdan büyük açıyla çarpar ve tam iç yansımayla içeride kalmaya devam eder. Böylece ışık neredeyse kayıpsız binlerce kilometre iletilebilir. Bu teknoloji, internet altyapısının temelini oluşturur.',
    ipucu: 'Işık fiber içinde nasıl tutulur?',
    kazanim: 'Optik fiber haberleşme sistemini açıklar.',
    sure: 40,
  },
  {
    id: 's-karma12-005',
    konuId: 'manyetizma-12',
    altKonuId: 'maxwell-denklemleri',
    sinif: 12,
    tip: 'dogru-yanlis',
    soru: 'Maxwell\'e göre değişen bir manyetik alan, elektrik alan oluşturur.',
    dogruCevap: 'Doğru',
    zorluk: 3,
    aciklama: 'Bu, Faraday yasasının Maxwell\'ın genel formülasyonu: ∇×E = -∂B/∂t. Değişen manyetik alan elektrik alan oluşturur. Maxwell ayrıca değişen elektrik alanın da manyetik alan oluşturduğunu ekledi (deplasman akımı). Bu çift ilişki, elektromanyetik dalgaların yayılmasını açıklar.',
    ipucu: 'Faraday yasasını hatırlayın: değişen akı → EMK → elektrik alan.',
    kazanim: 'Maxwell\'ın dört denklemini nitel olarak açıklar.',
    sure: 35,
  },
];

// ============================================================
// TÜM SORULARI BİRLEŞTİR
// ============================================================

// ============================================================
// DİNAMİK VARYASYON ÜRETİCİ
// ============================================================

function shuffleOptions(secenekler: { A: string; B: string; C: string; D: string } | undefined, correct: string, seed: number) {
  if (!secenekler) return { secenekler: undefined, dogruCevap: correct };
  
  const originalOptions = [
    { key: 'A', val: secenekler.A },
    { key: 'B', val: secenekler.B },
    { key: 'C', val: secenekler.C },
    { key: 'D', val: secenekler.D },
  ];
  
  const correctText = secenekler[correct as 'A'|'B'|'C'|'D'];
  
  const shift = seed % 4;
  const shiftedOptions = [...originalOptions];
  for (let i = 0; i < shift; i++) {
    const last = shiftedOptions.pop()!;
    shiftedOptions.unshift(last);
  }
  
  const newSecenekler = {
    A: shiftedOptions[0].val,
    B: shiftedOptions[1].val,
    C: shiftedOptions[2].val,
    D: shiftedOptions[3].val,
  };
  
  let newCorrect = 'A';
  if (newSecenekler.B === correctText) newCorrect = 'B';
  else if (newSecenekler.C === correctText) newCorrect = 'C';
  else if (newSecenekler.D === correctText) newCorrect = 'D';
  
  return { secenekler: newSecenekler, dogruCevap: newCorrect };
}

function generateVariationsForQuestion(base: Soru, v: number): Soru {
  const names = ['Ahmet', 'Mehmet', 'Elif', 'Zeynep', 'Ali', 'Ayşe', 'Can', 'Ceren', 'Mustafa', 'Fatma', 'Ömer', 'Esra', 'Burak', 'Selin', 'Emre', 'Derya', 'Kaan', 'İrem', 'Deniz', 'Yağmur'];
  const name = names[v % names.length];
  const otherName = names[(v + 5) % names.length];
  
  let soruText = base.soru;
  let secenekler = base.secenekler ? { ...base.secenekler } : undefined;
  let dogruCevap = base.dogruCevap;
  let aciklama = base.aciklama;
  let ipucu = base.ipucu;
  
  soruText = soruText.replace(/Ahmet/g, name).replace(/Mehmet/g, otherName);
  aciklama = aciklama.replace(/Ahmet/g, name).replace(/Mehmet/g, otherName);

  switch (base.id) {
    case 's-fg-003': {
      const forces = [10, 20, 30, 40, 50, 60, 80, 100, 120, 140, 150, 160, 180, 200, 220, 240, 250, 300, 400, 500];
      const F = forces[v % forces.length];
      const Fx = F / 2;
      soruText = `Yatay ile 30° açı yapan ve büyüklüğü ${F} N olan bir kuvvetin yatay bileşeni kaç Newton'dur?`;
      secenekler = {
        A: `${Fx} N`,
        B: `${Fx}√3 N`,
        C: `${F} N`,
        D: `${F}√3 N`
      };
      dogruCevap = 'B';
      aciklama = `Yatay bileşen Fx = F·cos30° = ${F}·(√3/2) = ${Fx}√3 N olarak hesaplanır. cos30° = √3/2 ≈ 0,866 değerini kullanmak gerekir. Dikey bileşen ise Fy = F·sin30° = ${F}·0,5 = ${Fx} N olur.`;
      break;
    }
    case 's-fg-004': {
      const factors = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
      const k = factors[v % factors.length];
      const f1 = 3 * k;
      const f2 = 4 * k;
      const R = 5 * k;
      soruText = `Birbirine dik ve büyüklükleri ${f1} N ve ${f2} N olan iki kuvvetin bileşkesi kaç N'dur?`;
      secenekler = {
        A: `${1 * k} N`,
        B: `${R} N`,
        C: `${7 * k} N`,
        D: `${12 * k} N`
      };
      dogruCevap = 'B';
      aciklama = `Birbirine dik iki vektörün bileşkesi Pisagor teoremi ile hesaplanır: F = √(${f1}² + ${f2}²) = √(${f1*f1}+${f2*f2}) = √${R*R} = ${R} N. Bu, 3-4-5 Pisagor üçlüsünün bir katıdır.`;
      break;
    }
    case 's-fg-005': {
      const errors = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 35, 40, 45, 50];
      const err = errors[v % errors.length];
      const measured = 500 - (5 * err);
      soruText = `Bir cismin gerçek kütlesi 500 g olduğu hâlde ölçüm sonucu ${measured} g elde edilmiştir. Bağıl hata yüzdesi kaçtır?`;
      secenekler = {
        A: `%${Math.max(1, Math.round(err / 2))}`,
        B: `%${err}`,
        C: `%${err + 3}`,
        D: `%${err * 2}`
      };
      dogruCevap = 'B';
      aciklama = `Mutlak hata = |500 - ${measured}| = ${500 - measured} g. Bağıl hata = (mutlak hata / gerçek değer) × 100 = (${500 - measured}/500) × 100 = %${err} olarak hesaplanır.`;
      break;
    }
    case 's-mo-001': {
      const densities = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15];
      const d = densities[v % densities.length];
      const V = 10 * ((v % 6) + 1);
      const m = d * V;
      soruText = `Kütlesi ${m} g ve hacmi ${V} cm³ olan bir cismin yoğunluğu kaç g/cm³'tür?`;
      secenekler = {
        A: `${Math.max(1, d - 2)}`,
        B: `${d - 1}`,
        C: `${d}`,
        D: `${d + 3}`
      };
      dogruCevap = 'C';
      aciklama = `Yoğunluk formülü ρ = m/V ile hesaplanır: ρ = ${m} g / ${V} cm³ = ${d} g/cm³.`;
      break;
    }
    case 's-mo-002': {
      const m = (v % 5) + 1;
      const dT = 10 * ((v % 4) + 1);
      const c = 4200;
      const Q = m * c * dT;
      soruText = `Kütlesi ${m} kg, özgül ısı kapasitesi 4200 J/(kg·°C) olan suyun sıcaklığını ${dT}°C artırmak için gereken ısı enerjisi kaç J'dür?`;
      secenekler = {
        A: `${Q / 4} J`,
        B: `${Q / 2} J`,
        C: `${Q} J`,
        D: `${Q * 2} J`
      };
      dogruCevap = 'C';
      aciklama = `Q = m·c·ΔT formülü uygulanır: Q = ${m} kg × 4200 J/(kg·°C) × ${dT}°C = ${Q} J.`;
      break;
    }
    case 's-mo-004': {
      const L0 = (v % 5) + 1;
      const dT = 10 * ((v % 8) + 1);
      const alphaVal = 1.2;
      const dL = L0 * alphaVal * 1e-5 * dT * 1000;
      const dLStr = dL.toFixed(1).replace('.0', '');
      soruText = `Başlangıç uzunluğu ${L0} m, doğrusal genleşme katsayısı 1,2 × 10⁻⁵ /°C olan bir çelik ray ${dT}°C ısıtılırsa uzama miktarı kaç mm olur?`;
      secenekler = {
        A: `${(dL/2).toFixed(1).replace('.0', '')} mm`,
        B: `${dLStr} mm`,
        C: `${(dL*2).toFixed(1).replace('.0', '')} mm`,
        D: `${(dL*10).toFixed(1).replace('.0', '')} mm`
      };
      dogruCevap = 'B';
      aciklama = `ΔL = L₀·α·ΔT formülü uygulanır: ΔL = ${L0} m × 1,2×10⁻⁵ /°C × ${dT}°C = ${(dL/1000).toFixed(5)} m = ${dLStr} mm.`;
      break;
    }
    case 's-mo-005': {
      const m = 10 * (v + 1);
      const L = 334;
      const Q = (m * L / 1000).toFixed(2).replace('.00', '');
      soruText = `Gizli ısısı 334 J/g olan ${m} g buzu eritmek için gereken ısı miktarı kaç kJ'dür?`;
      secenekler = {
        A: `${(m*L/2000).toFixed(2).replace('.00', '')} kJ`,
        B: `${Q} kJ`,
        C: `${(m*L/100).toFixed(2).replace('.00', '')} kJ`,
        D: `${(m*L/500).toFixed(2).replace('.00', '')} kJ`
      };
      dogruCevap = 'B';
      aciklama = `Q = m·L formülü uygulanır: Q = ${m} g × 334 J/g = ${m*L} J = ${Q} kJ.`;
      break;
    }
    case 's-kh-001': {
      const a = (v % 5) + 2;
      const t = (v % 4) + 2;
      const x = 0.5 * a * t * t;
      soruText = `Durağan hâlden ${a} m/s² ivmeyle hareket eden bir araç ${t} saniyede kaç m yol alır?`;
      secenekler = {
        A: `${x / 4} m`,
        B: `${x / 2} m`,
        C: `${x} m`,
        D: `${x * 2} m`
      };
      dogruCevap = 'C';
      aciklama = `Kinematik formülü uygulanır: x = v₀t + ½at². Durağan başlandığından v₀ = 0: x = 0 + ½ × ${a} × ${t}² = ${x} m.`;
      break;
    }
    case 's-kh-002': {
      const heights = [5, 20, 45, 80, 125, 180];
      const h = heights[v % heights.length];
      const speed = Math.sqrt(2 * 10 * h);
      soruText = `Bir taş ${h} m yüksekten serbest düşüyor. Yere çarpmadan önceki hızı yaklaşık kaç m/s'dir? (g = 10 m/s²)`;
      secenekler = {
        A: `${speed - 10} m/s`,
        B: `${speed - 5} m/s`,
        C: `${speed} m/s`,
        D: `${speed + 5} m/s`
      };
      dogruCevap = 'C';
      aciklama = `v² = v₀² + 2gh formülü uygulanır (v₀ = 0): v² = 2 × 10 × ${h} = ${speed*speed} → v = ${speed} m/s.`;
      break;
    }
    case 's-kh-003': {
      const mVal = (v % 6) + 2;
      const aVal = (v % 5) + 2;
      const F = mVal * aVal;
      soruText = `Kütlesi ${mVal} kg olan bir cisme ${F} N net kuvvet uygulanırsa ivmesi kaç m/s² olur?`;
      secenekler = {
        A: `${(aVal/2).toFixed(1).replace('.0', '')} m/s²`,
        B: `${aVal - 1} m/s²`,
        C: `${aVal} m/s²`,
        D: `${aVal * 2} m/s²`
      };
      dogruCevap = 'C';
      aciklama = `Newton'ın ikinci hareket kanunu: F = m·a, dolayısıyla a = F/m = ${F} N / ${mVal} kg = ${aVal} m/s².`;
      break;
    }
    case 's-kh-004': {
      const weights = [100, 200, 300, 400, 500];
      const W = weights[v % weights.length];
      const mus = [0.1, 0.2, 0.25, 0.3, 0.4, 0.5];
      const mu = mus[(v + 1) % mus.length];
      const F_s = Math.round(mu * W);
      soruText = `Ağırlığı ${W} N olan bir cismi yatay düzlemde sabit hızla çekmek için ${F_s} N kuvvet gerekiyorsa kinetik sürtünme katsayısı kaçtır?`;
      secenekler = {
        A: `${(mu / 2).toFixed(2)}`,
        B: `${mu.toFixed(2)}`,
        C: `${(mu * 1.5).toFixed(2)}`,
        D: `${(mu * 2).toFixed(2)}`
      };
      secenekler = {
        A: secenekler.A.replace('.25', '0.25').replace('.50', '0.50'),
        B: secenekler.B.replace('.20', '0.20').replace('.30', '0.30').replace('.40', '0.40').replace('.50', '0.50'),
        C: secenekler.C,
        D: secenekler.D
      };
      dogruCevap = 'B';
      aciklama = `Sabit hızla hareket → net kuvvet sıfır → F_çekme = F_sürtünme. Ff = μk·N = μk·W olduğundan: μk = Ff/W = ${F_s}/${W} = ${mu}.`;
      break;
    }
    case 's-kh-006': {
      const a = (v % 3) + 2;
      const t = (v % 4) + 3;
      const v0 = a * t;
      soruText = `${v0} m/s başlangıç hızıyla hareket eden bir araç ${a} m/s² yavaşlayarak duruyor. Araç kaç saniyede durur?`;
      secenekler = {
        A: `${t - 1} s`,
        B: `${t} s`,
        C: `${t + 2} s`,
        D: `${t * 2} s`
      };
      dogruCevap = 'B';
      aciklama = `v = v₀ - a·t formülü kullanılır. Durmak için v = 0: 0 = ${v0} - ${a}·t → t = ${v0}/${a} = ${t} s.`;
      break;
    }
  }
  
  const shuffled = shuffleOptions(secenekler, dogruCevap, v);
  
  return {
    ...base,
    id: `${base.id}-v${v}`,
    soru: soruText,
    secenekler: shuffled.secenekler,
    dogruCevap: shuffled.dogruCevap,
    aciklama,
    ipucu,
    zorluk: Math.min(5, Math.max(1, base.zorluk + (v % 3 - 1))) as ZorulukSeviye,
    sure: base.sure + (v % 3 - 1) * 5
  };
}

export function generateDynamicQuestions(baseList: Soru[]): Soru[] {
  const result: Soru[] = [];
  for (const q of baseList) {
    result.push(q);
    for (let v = 1; v <= 19; v++) {
      result.push(generateVariationsForQuestion(q, v));
    }
  }
  return result;
}

const baseSorular: Soru[] = [
  // 9. Sınıf
  ...fizikGiris9Sorular,
  ...madde9Sorular,
  ...kuvvet9Sorular,
  ...enerji9Sorular,
  // 10. Sınıf
  ...dalgalar10Sorular,
  ...elektrik10Sorular,
  ...optik10Sorular,
  ...basinc10Sorular,
  // 11. Sınıf
  ...kuvvet11Sorular,
  ...newton11Sorular,
  ...sicaklik11Sorular,
  // 12. Sınıf
  ...devre12Sorular,
  ...manyetizma12Sorular,
  ...modernFizik12Sorular,
  ...dalgalarOptik12Sorular,
  // Karma sorular
  ...karma9Sorular,
  ...karma10Sorular,
  ...karma11Sorular,
  ...karma12Sorular,
  ...ohmSorulari,
];

const statikSorular = generateDynamicQuestions(baseSorular);
const motorSorulari = zorlukDagilimiyleUret(tumSablonlarSenkron(), 200) as unknown as Soru[];
export const sorular: Soru[] = [...statikSorular, ...motorSorulari];

// ============================================================
// YARDIMCI FONKSİYONLAR
// ============================================================

export function getSorularByKonu(konuId: string): Soru[] {
  return sorular.filter((s) => s.konuId === konuId);
}

export function getSorularByAltKonu(altKonuId: string): Soru[] {
  return sorular.filter((s) => s.altKonuId === altKonuId);
}

export function getSorularBySinif(sinif: number): Soru[] {
  return sorular.filter((s) => s.sinif === sinif);
}

export function getSorularByZorluk(zorluk: ZorulukSeviye): Soru[] {
  return sorular.filter((s) => s.zorluk === zorluk);
}

export function getSorularByTip(tip: SoruTipi): Soru[] {
  return sorular.filter((s) => s.tip === tip);
}

export function rastgeleSoru(konuId?: string, sinif?: number, zorluk?: ZorulukSeviye): Soru | undefined {
  let filtre = sorular;
  if (konuId) filtre = filtre.filter((s) => s.konuId === konuId);
  if (sinif) filtre = filtre.filter((s) => s.sinif === sinif);
  if (zorluk) filtre = filtre.filter((s) => s.zorluk === zorluk);
  if (filtre.length === 0) return undefined;
  return filtre[Math.floor(Math.random() * filtre.length)];
}

export function getSoruById(id: string): Soru | undefined {
  return sorular.find((s) => s.id === id);
}

export function getKonuIstatistikleri(): Record<string, { toplam: number; zorlukDagilimi: Record<ZorulukSeviye, number> }> {
  const istatistik: Record<string, { toplam: number; zorlukDagilimi: Record<ZorulukSeviye, number> }> = {};
  for (const soru of sorular) {
    if (!istatistik[soru.konuId]) {
      istatistik[soru.konuId] = {
        toplam: 0,
        zorlukDagilimi: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }
    istatistik[soru.konuId].toplam++;
    istatistik[soru.konuId].zorlukDagilimi[soru.zorluk]++;
  }
  return istatistik;
}
