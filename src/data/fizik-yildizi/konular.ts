// ============================================================
// Fizik Yıldızı – Konu (Topic) Veri Katmanı
// Türkiye MEB Lise Fizik Müfredatı ve YKS Kapsamı (9-12. Sınıf)
// ============================================================

export interface AltKonu {
  id: string;
  baslik: string;
  aciklama: string;
  kazanimlar: string[];
  sinif: 9 | 10 | 11 | 12;
  simulasyonTipi?: 'serbest-dusme' | 'atis-hareketi' | 'dalga' | 'elektrik' | 'optik' | 'yay' | 'sarkac' | 'none';
  onKosul?: string[]; // önkoşul konu ID'leri
}

export interface Konu {
  id: string;
  baslik: string;
  aciklama: string;
  sinif: 9 | 10 | 11 | 12;
  renk: string; // Konu rengi (hex)
  ikon: string; // Emoji ikon
  altKonular: AltKonu[];
  toplamSoru: number;
}

// ============================================================
// 9. SINIF KONULARI (TYT)
// ============================================================

const fizikBilimine9: Konu = {
  id: 'fizik-bilimi-9',
  baslik: 'Fizik Bilimine Giriş',
  aciklama: 'Fiziğin alt dalları, temel ve türetilmiş büyüklükler, birim sistemleri, skaler/vektörel ayrımı.',
  sinif: 9,
  renk: '#7c3aed',
  ikon: '🔬',
  toplamSoru: 40,
  altKonular: [
    {
      id: 'fizik-alt-dallari',
      baslik: 'Fiziğin Alt Dalları ve Bilimsel Araştırma Merkezleri',
      aciklama: 'Mekanik, elektromanyetizma, termodinamik, optik vb. ile CERN, NASA, TÜBİTAK gibi kurumlar.',
      sinif: 9,
      simulasyonTipi: 'none',
      kazanimlar: [
        'Fiziğin alt dallarını (Kamyonet kısaltması ile) açıklar ve günlük hayattaki karşılıklarını bulur.',
        'Ulusal ve uluslararası bilimsel araştırma merkezlerinin isimlerini ve temel çalışma alanlarını bilir.'
      ]
    },
    {
      id: 'olcme-birimler',
      baslik: 'Ölçme ve Birim Sistemleri',
      aciklama: 'SI birim sistemi, temel ve türetilmiş büyüklükler, birim dönüşümleri.',
      sinif: 9,
      simulasyonTipi: 'none',
      kazanimlar: [
        'SI birim sistemindeki temel büyüklükleri (KISAMAL) ve birimlerini tanımlar.',
        'Fiziksel büyüklükleri temel ve türetilmiş büyüklük olarak sınıflandırır.'
      ]
    },
    {
      id: 'vektorler',
      baslik: 'Vektörler',
      aciklama: 'Skaler ve vektörel büyüklükler, vektör toplama ve bileşenleri.',
      sinif: 9,
      simulasyonTipi: 'none',
      kazanimlar: [
        'Skaler ve vektörel büyüklükleri yön bilgisine göre ayırt eder.',
        'Aynı doğrultudaki vektörleri geometrik olarak toplar.'
      ]
    }
  ]
};

const maddeOzellikleri9: Konu = {
  id: 'madde-ozellikleri-9',
  baslik: 'Madde ve Özellikleri',
  aciklama: 'Kütle, hacim, yoğunluk, katıların dayanıklılığı, yüzey gerilimi, adezyon ve kohezyon.',
  sinif: 9,
  renk: '#06b6d4',
  ikon: '⚗️',
  toplamSoru: 45,
  altKonular: [
    {
      id: 'kutle-hacim-yogunluk',
      baslik: 'Kütle, Hacim ve Yoğunluk',
      aciklama: 'Maddenin kütlesini, hacmini ve yoğunluğunu tanımlama ve hesaplama.',
      sinif: 9,
      simulasyonTipi: 'none',
      kazanimlar: [
        'ρ = m/V formülünü kullanarak yoğunluk hesaplamaları yapar.',
        'Karışımların özkütlelerini hesaplar ve yorumlar.'
      ]
    },
    {
      id: 'dayaniklilik',
      baslik: 'Katılarda Dayanıklılık',
      aciklama: 'Boyutlar değiştikçe katıların kendi ağırlığına karşı dayanıklılığının değişimi.',
      sinif: 9,
      simulasyonTipi: 'none',
      kazanimlar: [
        'Katıların kesit alanının hacmine oranını (1/h) dayanıklılıkla ilişkilendirir.',
        'Boyutları artan canlıların kendi ağırlıklarını taşımakta zorlanma nedenini açıklar.'
      ]
    },
    {
      id: 'adezyon-kohezyon',
      baslik: 'Adezyon, Kohezyon ve Yüzey Gerilimi',
      aciklama: 'Kılcallık etkisi, yüzey gerilimini etkileyen faktörler ve adezyon/kohezyon.',
      sinif: 9,
      simulasyonTipi: 'none',
      kazanimlar: [
        'Adezyon (yapışma) ve kohezyon (birbirini tutma) kuvvetlerini karşılaştırır.',
        'Yüzey gerilimi ve kılcallık olaylarının günlük hayattaki örneklerini açıklar.'
      ]
    }
  ]
};

const isiSicaklik9: Konu = {
  id: 'isi-sicaklik-9',
  baslik: 'Isı, Sıcaklık ve Genleşme',
  aciklama: 'Isı ve sıcaklık kavramları, hal değişimi, ısıl denge, ısı iletimi ve ısıl genleşme.',
  sinif: 9,
  renk: '#ef4444',
  ikon: '🌡️',
  toplamSoru: 40,
  altKonular: [
    {
      id: 'isi-sicaklik-temel',
      baslik: 'Isı, Sıcaklık ve Termometreler',
      aciklama: 'Isı ve sıcaklık farkı, termometre çeşitleri ve Celsius/Kelvin dönüşümleri.',
      sinif: 9,
      simulasyonTipi: 'none',
      kazanimlar: [
        'Isı, sıcaklık ve iç enerji kavramlarını ayırt eder.',
        'Termometrelerin hassasiyetini etkileyen faktörleri açıklar ve sıcaklık dönüşümü yapar.'
      ]
    },
    {
      id: 'hal-degisimi-denge',
      baslik: 'Hal Değişimi ve Isıl Denge',
      aciklama: 'Erime, donma, buharlaşma, yoğuşma ve ısıl denge ($Q=mc\\Delta T$, $Q=mL$).',
      sinif: 9,
      simulasyonTipi: 'none',
      kazanimlar: [
        'Hal değişimi ve ısınma-soğuma grafiklerini yorumlar.',
        'Isıca yalıtılmış bir ortamda karıştırılan maddelerin denge sıcaklığını hesaplar.'
      ]
    },
    {
      id: 'isi-iletilimi-genlesme',
      baslik: 'Isı İletimi ve Genleşme',
      aciklama: 'İletim, konveksiyon, ışıma yolları ve katı/sıvı/gazlarda ısıl genleşme.',
      sinif: 9,
      simulasyonTipi: 'none',
      kazanimlar: [
        'Isı iletim yollarını ve yalıtım malzemelerini değerlendirir.',
        'Katı ve sıvıların genleşme/büzülme olaylarını günlük hayat örnekleriyle açıklar.'
      ]
    }
  ]
};

const kuvvetHareket9: Konu = {
  id: 'kuvvet-hareket-9',
  baslik: 'Hareket ve Kuvvet',
  aciklama: 'Konum, hız, ivme grafikleri, dengelenmiş kuvvetler ve Newton\'ın hareket yasaları.',
  sinif: 9,
  renk: '#10b981',
  ikon: '🚀',
  toplamSoru: 55,
  altKonular: [
    {
      id: 'kinematik-temel',
      baslik: 'Doğrusal Hareket',
      aciklama: 'Konum-zaman, hız-zaman grafikleri ile düzgün doğrusal hareket.',
      sinif: 9,
      simulasyonTipi: 'serbest-dusme',
      kazanimlar: [
        'Sürat ve hız kavramlarını ayırt eder.',
        'Konum-zaman ve hız-zaman grafiklerini çizerek yorumlar.'
      ]
    },
    {
      id: 'newton-yasalar-9',
      baslik: 'Newton\'ın Hareket Yasaları',
      aciklama: 'Eylemsizlik, dinamiğin temel prensibi ($F=ma$) ve etki-tepki kuvvetleri.',
      sinif: 9,
      simulasyonTipi: 'none',
      kazanimlar: [
        'Dengelenmiş ve dengelenmemiş kuvvetlerin hareket üzerindeki etkisini ayırt eder.',
        'Newton\'ın üç temel hareket yasasını açıklar ve uygular.'
      ]
    },
    {
      id: 'surtunme-kuvveti-9',
      baslik: 'Sürtünme Kuvveti',
      aciklama: 'Statik ve kinetik sürtünme kuvveti, sürtünmeyi etkileyen faktörler.',
      sinif: 9,
      simulasyonTipi: 'none',
      kazanimlar: [
        'Statik ve kinetik sürtünme kuvvetlerini hesaplar.',
        'Sürtünmenin günlük hayattaki avantaj ve dezavantajlarını örnekler.'
      ]
    }
  ]
};

const enerji9: Konu = {
  id: 'enerji-9',
  baslik: 'Enerji',
  aciklama: 'İş, güç, kinetik enerji, potansiyel enerji, enerjinin korunumu ve verim.',
  sinif: 9,
  renk: '#f59e0b',
  ikon: '⚡',
  toplamSoru: 50,
  altKonular: [
    {
      id: 'is-ve-guc',
      baslik: 'İş ve Güç',
      aciklama: 'Fiziksel anlamda iş kavramı ($W = F\\cdot d\\cdot\\cos\\theta$) ve güç ($P = W/t$).',
      sinif: 9,
      simulasyonTipi: 'none',
      kazanimlar: [
        'Kuvvetin iş yapabilmesi için gereken hareket koşulunu açıklar.',
        'İş ve güç bağıntılarını kullanarak problemler çözer.'
      ]
    },
    {
      id: 'mekanik-enerji-9',
      baslik: 'Kinetik, Potansiyel Enerji ve Korunum',
      aciklama: 'Öteleme kinetik enerjisi ($E_k = \\frac{1}{2}mv^2$) ve kütle çekim potansiyel enerjisi ($E_p = mgh$).',
      sinif: 9,
      simulasyonTipi: 'serbest-dusme',
      kazanimlar: [
        'Kinetik ve potansiyel enerji formüllerini uygular.',
        'Mekanik enerjinin korunduğu ve sürtünmeyle ısıya dönüştüğü durumları analiz eder.'
      ]
    },
    {
      id: 'verim-enerji-kaynaklari',
      baslik: 'Verim ve Enerji Kaynakları',
      aciklama: 'Enerji verimliliği, yenilenebilir ve yenilenemez enerji kaynakları.',
      sinif: 9,
      simulasyonTipi: 'none',
      kazanimlar: [
        'Gerçekleşen enerji dönüşümlerinde verimi hesaplar.',
        'Fosil yakıtlar ile güneş, rüzgar, jeotermal gibi temiz enerji kaynaklarını karşılaştırır.'
      ]
    }
  ]
};

const elektrostatik9: Konu = {
  id: 'elektrostatik-9',
  baslik: 'Elektrostatik',
  aciklama: 'Elektrik yükleri, sürtünme/dokunma/etki ile elektriklenme, elektroskop ve Coulomb kuvveti.',
  sinif: 9,
  renk: '#ec4899',
  ikon: '🎈',
  toplamSoru: 30,
  altKonular: [
    {
      id: 'elektriklenme-yontemleri',
      baslik: 'Elektrik Yükleri ve Elektriklenme',
      aciklama: 'Elementer yük, iletken-yalıtkan maddeler, sürtünme, dokunma ve etki ile elektriklenme.',
      sinif: 9,
      simulasyonTipi: 'none',
      kazanimlar: [
        'Yük korunumu ilkesini kullanarak dokunma ile elektriklenen cisimlerin son yüklerini hesaplar.',
        'Etki (indüksiyon) ile elektriklenmede yük kutuplanmasını açıklar.'
      ]
    },
    {
      id: 'elektroskop',
      baslik: 'Elektroskop ve Coulomb Yasası',
      aciklama: 'Elektroskobun çalışma mantığı, yüklerin birbirini itmesi ve Coulomb çekim yasası.',
      sinif: 9,
      simulasyonTipi: 'none',
      kazanimlar: [
        'Yüklü bir cisim yaklaştırılan veya dokundurulan elektroskobun yaprak hareketlerini yorumlar.',
        'Coulomb kuvvetini ($F = k\\frac{q_1q_2}{r^2}$) nitel olarak analiz eder.'
      ]
    }
  ]
};

// ============================================================
// 10. SINIF KONULARI (TYT)
// ============================================================

const basinc10: Konu = {
  id: 'basinc-10',
  baslik: 'Basınç ve Kaldırma Kuvveti',
  aciklama: 'Katılarda, sıvılarda ve gazlarda basınç, Pascal prensibi, Bernoulli ilkesi ve Archimedes kaldırma kuvveti.',
  sinif: 10,
  renk: '#0ea5e9',
  ikon: '💧',
  toplamSoru: 45,
  altKonular: [
    {
      id: 'kati-sivi-basinc',
      baslik: 'Katı ve Sıvı Basıncı',
      aciklama: 'Katılarda basınç ($P=F/A$) ve sıvılarda hidrostatik basınç ($P=hdg$).',
      sinif: 10,
      simulasyonTipi: 'none',
      kazanimlar: [
        'Katıların basıncının yüzey alanıyla ilişkisini açıklar.',
        'Sıvı basıncının derinlik ve yoğunluğa bağlılığını formüle eder, Pascal prensibini açıklar.'
      ]
    },
    {
      id: 'gaz-basinc-akiskanlar',
      baslik: 'Gaz Basıncı ve Akışkanların Hareketi',
      aciklama: 'Açık hava basıncı, kapalı kaplardaki gaz basıncı ve Bernoulli akışkan yasası.',
      sinif: 10,
      simulasyonTipi: 'none',
      kazanimlar: [
        'Toriçelli deneyini ve açık hava basıncını etkileyen faktörleri açıklar.',
        'Kesit alanı azalan akışkanın hızının artması ve basıncının düşmesi (Bernoulli) olayını yorumlar.'
      ]
    },
    {
      id: 'archimedes-kaldirma',
      baslik: 'Kaldırma Kuvveti ve Archimedes İlkesi',
      aciklama: 'Sıvıların cisimlere uyguladığı kaldırma kuvveti ($F_K = V_{batan}\\cdot d_{sivi}\\cdot g$).',
      sinif: 10,
      simulasyonTipi: 'none',
      kazanimlar: [
        'Yüzme, askıda kalma ve batma durumlarında kaldırma kuvveti ile ağırlık ilişkisini kurar.',
        'Taşırma kaplarındaki kütle ağırlaşma problemlerini analiz eder.'
      ]
    }
  ]
};

const elektrikManyetizma10: Konu = {
  id: 'elektrik-manyetizma-10',
  baslik: 'Elektrik ve Manyetizma',
  aciklama: 'Elektrik akımı, Ohm kanunu, basit devreler, elektriksel güç, mıknatıslar ve manyetik alan.',
  sinif: 10,
  renk: '#eab308',
  ikon: '⚡',
  toplamSoru: 55,
  altKonular: [
    {
      id: 'akim-direnc-ohm',
      baslik: 'Elektrik Akımı ve Ohm Yasası',
      aciklama: 'Akım ($I=q/t$), direnç ($R=\\rho L/A$) ve Ohm kanunu ($V=IR$).',
      sinif: 10,
      simulasyonTipi: 'elektrik',
      kazanimlar: [
        'İletken tellerin direnç formülünü kullanır.',
        'Basit elektrik devrelerinde akım ve gerilim değerlerini hesaplar.'
      ]
    },
    {
      id: 'seri-paralel-devreler',
      baslik: 'Seri/Paralel Bağlama ve Güç',
      aciklama: 'Dirençlerin seri ve paralel bağlanması, elektriksel güç ($P=V\\cdot I$).',
      sinif: 10,
      simulasyonTipi: 'elektrik',
      kazanimlar: [
        'Eşdeğer direnç hesaplar, seri/paralel kollardaki akım paylaşımını belirler.',
        'Devredeki lambaların parlaklıklarını güçlerine göre kıyaslar.'
      ]
    },
    {
      id: 'miknatislar-manyetik',
      baslik: 'Mıknatıslar ve Manyetik Alan',
      aciklama: 'Mıknatısların kutupları, manyetik alan çizgileri ve Dünya\'nın manyetik alanı.',
      sinif: 10,
      simulasyonTipi: 'none',
      kazanimlar: [
        'Mıknatısların birbirine uyguladığı manyetik kuvveti açıklar.',
        'Akım taşıyan düz telin etrafında oluşan manyetik alanı sağ el kuralıyla bulur.'
      ]
    }
  ]
};

const dalgalar10: Konu = {
  id: 'dalgalar-10',
  baslik: 'Dalgalar',
  aciklama: 'Periyot, frekans, hız, yay, su, ses ve deprem dalgalarının özellikleri.',
  sinif: 10,
  renk: '#8b5cf6',
  ikon: '🌊',
  toplamSoru: 50,
  altKonular: [
    {
      id: 'dalga-temel-ozellikler',
      baslik: 'Dalgaların Temel Özellikleri',
      aciklama: 'Genlik, periyot, frekans, dalga boyu ve dalga hızı ($v = \\lambda\\cdot f$).',
      sinif: 10,
      simulasyonTipi: 'dalga',
      kazanimlar: [
        'Dalganın yayılma hızının yalnızca ortama bağlı olduğunu bilir.',
        'Enine ve boyuna dalgaları sınıflandırır.'
      ]
    },
    {
      id: 'yay-ve-su-dalgalari',
      baslik: 'Yay ve Su Dalgaları',
      aciklama: 'Atmaların yansıması, iletilmesi ve su dalgalarının derinliğe göre davranışı.',
      sinif: 10,
      simulasyonTipi: 'dalga',
      kazanimlar: [
        'Yay dalgalarında sabit/serbest uçtan yansımayı açıklar.',
        'Derin ortamdan sığ ortama geçen su dalgalarının hız, frekans ve dalga boyu değişimini yorumlar.'
      ]
    },
    {
      id: 'ses-deprem-dalgalari',
      baslik: 'Ses ve Deprem Dalgaları',
      aciklama: 'Ses dalgalarında yükseklik (frekans), tını ve rezonans.',
      sinif: 10,
      simulasyonTipi: 'dalga',
      kazanimlar: [
        'Sesin inceliğini frekansla, şiddetini genlikle ilişkilendirir.',
        'Deprem dalgalarının korunma önlemlerini ve deprem büyüklüğünü bilir.'
      ]
    }
  ]
};

const optik10: Konu = {
  id: 'optik-10',
  baslik: 'Optik',
  aciklama: 'Gölge, aydınlanma, yansıma yasaları, düzlem/küresel aynalar, kırılma, mercekler ve renkler.',
  sinif: 10,
  renk: '#10b981',
  ikon: '🔭',
  toplamSoru: 45,
  altKonular: [
    {
      id: 'aydinlanma-golge',
      baslik: 'Aydınlanma ve Gölge',
      aciklama: 'Işık şiddeti (I), ışık akısı (Φ), aydınlanma şiddeti (E) ve gölge oluşumu.',
      sinif: 10,
      simulasyonTipi: 'optik',
      kazanimlar: [
        'Noktasal ışık kaynaklarının oluşturduğu tam gölge ve yarı gölge alanlarını çizer.',
        'Aydınlanma şiddeti formülünü ($E = I/d^2\\cos\\theta$) yorumlar.'
      ]
    },
    {
      id: 'aynalar',
      baslik: 'Düzlem ve Küresel Aynalar',
      aciklama: 'Düz, çukur ve tümsek aynalarda yansıma kuralları ve görüntü oluşumu.',
      sinif: 10,
      simulasyonTipi: 'optik',
      kazanimlar: [
        'Küresel aynalardaki özel ışınları çizer.',
        'Oluşan görüntülerin özelliklerini (gerçek/sanal, düz/ters, boyut) belirler.'
      ]
    },
    {
      id: 'kirilma-mercekler-renk',
      baslik: 'Kırılma, Mercekler ve Renk',
      aciklama: 'Işığın kırılması, Snell yasası, tam yansıma, ince/kalın kenarlı mercekler ve renk karışımları.',
      sinif: 10,
      simulasyonTipi: 'optik',
      kazanimlar: [
        'Işığın çok yoğun ortamdan az yoğun ortama geçişindeki sınır açısını ve tam yansımayı açıklar.',
        'İnce ve kalın kenarlı merceklerin görüntü çizimlerini yapar, renklerin soğurulması ve yansımasını açıklar.'
      ]
    }
  ]
};

// ============================================================
// 11. SINIF KONULARI (AYT)
// ============================================================

const newtonIleri11: Konu = {
  id: 'newton-ileri-11',
  baslik: 'Newton Kanunları ve Atışlar',
  aciklama: 'İleri düzey dinamik (makaralar, eğik düzlem), bir ve iki boyutta sabit ivmeli hareketler (atışlar).',
  sinif: 11,
  renk: '#a855f7',
  ikon: '🎯',
  toplamSoru: 45,
  altKonular: [
    {
      id: 'newton-ileri-dinamik',
      baslik: 'İleri Düzey Dinamik',
      aciklama: 'Sürtünmeli eğik düzlemler, üst üste cisimler, eylemsiz referans sistemleri.',
      sinif: 11,
      simulasyonTipi: 'none',
      kazanimlar: [
        'Cisimlerin ivmesini net kuvvet ve kütle ilişkisiyle hesaplar.',
        'Üst üste konulan cisimlerin kaymadan hareket edebilmesi için gereken sürtünme şartını hesaplar.'
      ]
    },
    {
      id: 'atislar-dikey',
      baslik: 'Bir Boyutta Sabit İvmeli Hareket (Düşey Atışlar)',
      aciklama: 'Serbest düşme, aşağı/yukarı dikey atış ve limit hız kavramı.',
      sinif: 11,
      simulasyonTipi: 'serbest-dusme',
      kazanimlar: [
        'Hava direnci olan ortamda düşen cismin limit hız formülünü ($v_{lim} = \\sqrt{\\frac{mg}{k A}}$) uygular.',
        'Dikey fırlatılan cisimlerin konum-zaman ve hız-zaman denklemlerini kurar.'
      ]
    },
    {
      id: 'atislar-iki-boyut',
      baslik: 'İki Boyutta Hareket (Yatay ve Eğik Atış)',
      aciklama: 'Yatay atış ve eğik atış hareketleri, menzil ve maksimum yükseklik hesapları.',
      sinif: 11,
      simulasyonTipi: 'atis-hareketi',
      kazanimlar: [
        'Yataydaki ivmesiz hareket ile düşeydeki yerçekimi ivmeli hareketi birbirinden bağımsız analiz eder.',
        'Eğik atışta havada kalma süresini, menzili ve çıkılan maksimum yüksekliği hesaplar.'
      ]
    }
  ]
};

const isGucEnerji11: Konu = {
  id: 'is-guc-enerji-11',
  baslik: 'İş, Güç ve Enerji (İleri)',
  aciklama: 'Yay potansiyel enerjisi, iş-enerji teoremi, sürtünmeli sistemlerde enerji korunumu ve momentum.',
  sinif: 11,
  renk: '#f97316',
  ikon: '⚙️',
  toplamSoru: 40,
  altKonular: [
    {
      id: 'is-enerji-teoremi-ileri',
      baslik: 'İş-Enerji Teoremi ve Yay Enerjisi',
      aciklama: 'Değişken kuvvetlerin yaptığı iş, yay potansiyel enerjisi ($E_p = \\frac{1}{2}kx^2$).',
      sinif: 11,
      simulasyonTipi: 'yay',
      kazanimlar: [
        'Kuvvet-konum grafiğinin alanından yapılan işi hesaplar.',
        'Yaylı sistemlerde mekanik enerjinin korunumunu uygular.'
      ]
    },
    {
      id: 'itme-momentum',
      baslik: 'İtme (İmpuls) ve Çizgisel Momentum',
      aciklama: 'İtme ile momentum değişimi ilişkisi ($F\\cdot\\Delta t = \\Delta p$) ve momentumun korunumu.',
      sinif: 11,
      simulasyonTipi: 'none',
      kazanimlar: [
        'İtme ve çizgisel momentum değişimini hesaplar.',
        'Çarpışmalarda ve patlamalarda çizgisel momentumun korunduğunu gösteren denklemleri kurar.'
      ]
    },
    {
      id: 'carpismalar-analiz',
      baslik: 'Esnek ve Esnek Olmayan Çarpışmalar',
      aciklama: 'Tek ve iki boyutta esnek, esnek olmayan ve tamamen esnek olmayan çarpışmalar.',
      sinif: 11,
      simulasyonTipi: 'none',
      kazanimlar: [
        'Merkezi esnek çarpışmada kinetik enerji ve çizgisel momentumun korunumunu birlikte uygular.',
        'Tamamen esnek olmayan çarpışmada çarpışan cisimlerin ortak hızlarını ve enerji kaybını hesaplar.'
      ]
    }
  ]
};

const torkDengeMakineler11: Konu = {
  id: 'tork-denge-makineler-11',
  baslik: 'Tork, Denge ve Basit Makineler',
  aciklama: 'Kuvvetin döndürme etkisi (tork), rijit cisimlerin dengesi, kütle merkezi ve basit makineler.',
  sinif: 11,
  renk: '#3b82f6',
  ikon: '🔧',
  toplamSoru: 35,
  altKonular: [
    {
      id: 'tork-ve-denge',
      baslik: 'Tork ve Denge Koşulları',
      aciklama: 'Tork kavramı, yönü (sağ el kuralı), dengelenmiş kuvvetlerin moment dengesi.',
      sinif: 11,
      simulasyonTipi: 'none',
      kazanimlar: [
        'Cisimlerin statik denge şartlarını ($\\sum F=0$, $\\sum \\tau =0$) problemlere uygular.',
        'Lami teoremi yardımıyla kesişen kuvvetlerin dengesini analiz eder.'
      ]
    },
    {
      id: 'kutle-agirlik-merkezi-11',
      baslik: 'Kütle ve Ağırlık Merkezi',
      aciklama: 'Geometrik şekillerin kütle merkezi, koordinat sistemiyle kütle merkezi bulma.',
      sinif: 11,
      simulasyonTipi: 'none',
      kazanimlar: [
        'Kütle merkezi ve ağırlık merkezinin yerçekimi ivmesi değişimine bağlı olarak farkını açıklar.',
        'Bir levhadan parça kesilmesi veya parça eklenmesi durumlarında kütle merkezinin kayma miktarını hesaplar.'
      ]
    },
    {
      id: 'lise-basit-makineler',
      baslik: 'Basit Makineler ve Mekanik Avantaj',
      aciklama: 'Kaldıraçlar, makara/palangalar, eğik düzlem, çıkrık, vida, dişliler ve kasnaklar.',
      sinif: 11,
      simulasyonTipi: 'none',
      kazanimlar: [
        'Basit makinelerde kuvvetten kazanç (mekanik avantaj) ve yoldan kayıp ilişkilerini kurar.',
        'Karmaşık basit makine sistemlerinde verim ve tur sayısı hesaplamaları yapar.'
      ]
    }
  ]
};

const elektrikDevreleri12: Konu = {
  id: 'elektrik-devreleri-12',
  baslik: 'Elektriksel Potansiyel ve Sığaçlar',
  aciklama: 'Elektriksel kuvvet, alan, potansiyel enerji, paralel levhalar ve sığaçlar.',
  sinif: 11, // MEB AYT 11. Sınıf Elektrik
  renk: '#ef4444',
  ikon: '🔋',
  toplamSoru: 60,
  altKonular: [
    {
      id: 'elektriksel-kuvvet-alan',
      baslik: 'Elektriksel Kuvvet ve Elektrik Alan',
      aciklama: 'Nokta yüklerin birbirine uyguladığı Coulomb kuvveti ve elektrik alan vektörü.',
      sinif: 11,
      simulasyonTipi: 'elektrik',
      kazanimlar: [
        'İki veya daha fazla nokta yükün oluşturduğu bileşke elektrik alanı hesaplar.',
        'Elektrik alan çizgilerinin özelliklerini açıklar.'
      ]
    },
    {
      id: 'paralel-levhalar',
      baslik: 'Düzgün Elektrik Alan (Paralel Levhalar)',
      aciklama: 'Gerilim uygulanan paralel levhalar arasındaki düzgün elektrik alan ve yüklü parçacıkların hareketi.',
      sinif: 11,
      simulasyonTipi: 'elektrik',
      kazanimlar: [
        'Levhalar arasındaki elektrik alanı ($E=V/d$) ve parçacığa etki eden kuvveti ($F=qE$) bulur.',
        'Yüklü parçacığın ivmesini ve karşı levhaya ulaşma süresini hesaplar.'
      ]
    },
    {
      id: 'sigaclar-enerji',
      baslik: 'Sığaçlar (Kondansatörler)',
      aciklama: 'Sığa kavramı, sığacın yükü, dielektrik katsayısı ve depolanan enerji.',
      sinif: 11,
      simulasyonTipi: 'elektrik',
      kazanimlar: [
        'Paralel plakalı bir sığacın sığasını ($C = \\epsilon \\frac{A}{d}$) hesaplar.',
        'Depolanan elektriksel potansiyel enerjiyi ($E = \\frac{1}{2}CV^2$) hesaplar.'
      ]
    }
  ]
};

const manyetizma12: Konu = {
  id: 'manyetizma-12',
  baslik: 'Manyetizma ve İndüksiyon',
  aciklama: 'Manyetik kuvvet (Lorentz), indüksiyon akımı, Faraday/Lenz kanunları, alternatif akım ve transformatörler.',
  sinif: 11, // MEB AYT 11. Sınıf Manyetizma
  renk: '#3b82f6',
  ikon: '🧲',
  toplamSoru: 55,
  altKonular: [
    {
      id: 'manyetik-kuvvet-lorentz',
      baslik: 'Manyetik Kuvvet ve Lorentz Kuvveti',
      aciklama: 'Manyetik alandaki yüklü parçacıklara ve akım taşıyan tellere etki eden kuvvet.',
      sinif: 11,
      simulasyonTipi: 'none',
      kazanimlar: [
        'Sağ el kuralını kullanarak manyetik kuvvetin yönünü belirler.',
        'Manyetik alana dik giren yüklü parçacığın dairesel yörüngesini analiz eder.'
      ]
    },
    {
      id: 'induksiyon-faraday',
      baslik: 'Elektromanyetik İndüksiyon ve Lenz Kanunu',
      aciklama: 'Manyetik akı değişimi, indüksiyon EMK\'sı ve Lenz yön kuralı.',
      sinif: 11,
      simulasyonTipi: 'none',
      kazanimlar: [
        'Faraday yasasına göre indüklenen EMK\'yı ($\\epsilon = -\\frac{\\Delta \\Phi}{\\Delta t}$) hesaplar.',
        'Lenz yasasına göre indüksiyon akımının yönünü bulur.'
      ]
    },
    {
      id: 'ac-ve-transformatorler',
      baslik: 'Alternatif Akım ve Transformatörler',
      aciklama: 'Sinüsoidal alternatif akım, etkin değerler, empedans ve ideal transformatörler.',
      sinif: 11,
      simulasyonTipi: 'none',
      kazanimlar: [
        'Transformatörlerin gerilim değiştirme prensibini ($V_1/V_2 = N_1/N_2$) uygular.',
        'Alternatif akımda empedans ve rezonans kavramlarını nitel olarak açıklar.'
      ]
    }
  ]
};

// ============================================================
// 12. SINIF KONULARI (AYT)
// ============================================================

const kuvvetHareket11: Konu = {
  id: 'kuvvet-hareket-11',
  baslik: 'Çembersel Hareket ve Basit Harmonik Hareket',
  aciklama: 'Düzgün çembersel hareket, tork dönmesi, açısal momentum, Kepler yasaları ve harmonik hareket.',
  sinif: 12, // MEB AYT 12. Sınıf Mekanik
  renk: '#10b981',
  ikon: '🌀',
  toplamSoru: 50,
  altKonular: [
    {
      id: 'duzgun-cembersel',
      baslik: 'Düzgün Çembersel Hareket',
      aciklama: 'Açısal hız, çizgisel hız, merkezcil ivme/kuvvet ve yatay/düşey dairesel hareket.',
      sinif: 12,
      simulasyonTipi: 'none',
      kazanimlar: [
        'Çizgisel hız ile açısal hız arasındaki ilişkiyi ($v = \\omega \\cdot r$) uygular.',
        'Yatay veya düşey raylarda hareket eden cisimlerin tepki kuvvetlerini hesaplar.'
      ]
    },
    {
      id: 'acisal-momentum-korunumu',
      baslik: 'Açısal Momentum ve Kepler Yasaları',
      aciklama: 'Dönme kinetik enerjisi, eylemsizlik momenti, Kepler\'in üç yasası.',
      sinif: 12,
      simulasyonTipi: 'none',
      kazanimlar: [
        'Dış net tork sıfır olduğunda açısal momentumun korunduğunu açıklar.',
        'Kepler yasalarını kütle çekim ivmesiyle ilişkilendirir.'
      ]
    },
    {
      id: 'harmonik-sarkaclar',
      baslik: 'Basit Harmonik Hareket',
      aciklama: 'BHH özellikleri, yaylı sarkaç ($T=2\\pi\\sqrt{m/k}$) ve basit sarkaç ($T=2\\pi\\sqrt{L/g}$).',
      sinif: 12,
      simulasyonTipi: 'sarkac',
      kazanimlar: [
        'Harmonik harekette uzanım, hız ve ivme bağıntılarını zamanla ilişkilendirir.',
        'Sarkaçların periyodunu etkileyen faktörleri formüle ederek çözer.'
      ]
    }
  ]
};

const dalgalarOptik12: Konu = {
  id: 'dalgalar-optik-12',
  baslik: 'Dalga Mekaniği ve EM Dalgalar',
  aciklama: 'Su dalgalarında girişim/kırınım, ışıkta girişim (Young deneyi), Doppler etkisi ve EM dalgalar.',
  sinif: 12,
  renk: '#ec4899',
  ikon: '🌈',
  toplamSoru: 50,
  altKonular: [
    {
      id: 'dalga-girisimi-kırınım',
      baslik: 'Işıkta Girişim ve Kırınım',
      aciklama: 'Young çift yarık deneyi, tek yarıkta kırınım ve saçak genişliği.',
      sinif: 12,
      simulasyonTipi: 'dalga',
      kazanimlar: [
        'Çift ve tek yarıkta aydınlık/karanlık saçakların yerlerini ve genişlik formülünü ($\\Delta x = \\frac{L\\lambda}{dn}$) kullanır.',
        'Young deneyi parametrelerinin (ortam indisi, yarık aralığı) etkisini analiz eder.'
      ]
    },
    {
      id: 'doppler-em-dalgalar',
      baslik: 'Doppler Etkisi ve Elektromanyetik Spektrum',
      aciklama: 'Doppler frekans kayması ve EM dalgaların spektral sınıflandırılması.',
      sinif: 12,
      simulasyonTipi: 'dalga',
      kazanimlar: [
        'Ses ve ışık dalgalarında Doppler kaymasını açıklar.',
        'Elektromanyetik dalgaları dalga boylarına veya enerjilerine göre spektrum üzerinde sıralar.'
      ]
    }
  ]
};

const modernFizik12: Konu = {
  id: 'modern-fizik-12',
  baslik: 'Modern Fizik',
  aciklama: 'Fotoelektrik olay, Compton saçılması, de Broglie madde dalgaları, atom modelleri ve radyoaktivite.',
  sinif: 12,
  renk: '#f97316',
  ikon: '⚛️',
  toplamSoru: 55,
  altKonular: [
    {
      id: 'fotoelektrik-compton',
      baslik: 'Fotoelektrik Olay ve Compton Saçılması',
      aciklama: 'Işığın tanecik doğası, foton enerjisi ($E=hf$), durdurma gerilimi ve momentum korunumu.',
      sinif: 12,
      simulasyonTipi: 'none',
      kazanimlar: [
        'Fotoelektrik denkleminde ($E_{foton} = E_b + E_k$) eşik enerjisi ve kinetik enerjiyi hesaplar.',
        'Compton saçılmasında saçılan fotonun enerjisinin azalmasını ve dalga boyunun büyümesini açıklar.'
      ]
    },
    {
      id: 'atom-tarih-radyoaktivite',
      baslik: 'Atom Modelleri ve Radyoaktif Bozunmalar',
      aciklama: 'Bohr atom modeli, radyoaktivite, alfa/beta/gama ışımaları, fisyon ve füzyon.',
      sinif: 12,
      simulasyonTipi: 'none',
      kazanimlar: [
        'Bohr modelinde kararlı yörünge yarıçapını ve enerji düzeylerini hesaplar.',
        'Çekirdek reaksiyonlarında yük ve kütle numarası korunumunu kullanarak bozunmaları dengeler.'
      ]
    }
  ]
};

const modernTeknoloji12: Konu = {
  id: 'modern-teknoloji-12',
  baslik: 'Modern Fiziğin Teknolojideki Uygulamaları',
  aciklama: 'Tıbbi görüntüleme cihazları, yarı iletken devre elemanları, süperiletkenler, lazerler ve nanoteknoloji.',
  sinif: 12,
  renk: '#14b8a6',
  ikon: '🤖',
  toplamSoru: 30,
  altKonular: [
    {
      id: 'tıbbi-goruntuleme',
      baslik: 'Tıbbi Görüntüleme ve Lazerler',
      aciklama: 'Röntgen, BT, MR, PET ve ultrason çalışma ilkeleri ile uyarılmış emisyon (lazer).',
      sinif: 12,
      simulasyonTipi: 'optik',
      kazanimlar: [
        'Görüntüleme cihazlarının fiziksel temel ilkelerini (X-ışını, manyetik alan, ses dalgası) karşılaştırır.',
        'Lazer ışığının oluşum sürecini uyarılmış emisyon mekanizmasıyla açıklar.'
      ]
    },
    {
      id: 'yari-iletkenler-nano',
      baslik: 'Yarı İletken Teknolojisi, Süperiletkenlik ve Nanoteknoloji',
      aciklama: 'P-N eklemleri, diyotlar, transistörler, güneş pilleri, kritik sıcaklık ve Meissner etkisi.',
      sinif: 12,
      simulasyonTipi: 'none',
      kazanimlar: [
        'Yarı iletken devre elemanlarının (diyot, transistör) elektron geçişini açıklar.',
        'Süperiletkenlerin sıfır direnç ve manyetik alanı dışlama (Meissner) özelliklerini tanımlar.'
      ]
    }
  ]
};

// ============================================================
// ANA EXPORT: TÜM KONULAR (Toplam 19 Konu)
// ============================================================

export const konular: Konu[] = [
  // 9. Sınıf (6 Konu)
  fizikBilimine9,
  maddeOzellikleri9,
  isiSicaklik9,
  kuvvetHareket9,
  enerji9,
  elektrostatik9,

  // 10. Sınıf (4 Konu)
  basinc10,
  elektrikManyetizma10,
  dalgalar10,
  optik10,

  // 11. Sınıf (5 Konu)
  newtonIleri11,
  isGucEnerji11,
  torkDengeMakineler11,
  elektrikDevreleri12, // AYT Elektriksel Potansiyel
  manyetizma12,        // AYT Manyetizma ve İndüksiyon

  // 12. Sınıf (4 Konu)
  kuvvetHareket11,     // AYT Çembersel Hareket ve BHH
  dalgalarOptik12,     // AYT Dalga Mekaniği
  modernFizik12,       // AYT Modern Fizik
  modernTeknoloji12    // AYT Modern Fiziğin Teknolojideki Uygulamaları
];

// ============================================================
// YARDIMCI FONKSİYONLAR
// ============================================================

export function getKonuBySinif(sinif: number): Konu[] {
  return konular.filter((k) => k.sinif === sinif);
}

export function getKonuById(id: string): Konu | undefined {
  return konular.find((k) => k.id === id);
}

export function getAltKonuById(
  altKonuId: string
): { konu: Konu; altKonu: AltKonu } | undefined {
  for (const konu of konular) {
    const altKonu = konu.altKonular.find((ak) => ak.id === altKonuId);
    if (altKonu) return { konu, altKonu };
  }
  return undefined;
}

export function getAllAltKonular(): AltKonu[] {
  return konular.flatMap((k) => k.altKonular);
}

export function getKonuByRenk(renk: string): Konu | undefined {
  return konular.find((k) => k.renk === renk);
}
