import { SoruSablonu, SoruParametreleri } from '../tipler';

export const sinif10OptikSablonlar: SoruSablonu[] = [
  {
    id: 'optik-aydinlanma-1',
    konuId: 'optik-10',
    altKonuId: 'aydinlanma',
    sinif: 10,
    zorluk: 2,
    parametreler: {
      I: { min: 100, max: 800, adim: 100, birim: 'cd' },
      d: { min: 2, max: 10, adim: 1, birim: 'm' },
    },
    soruSablonu: (p: SoruParametreleri) =>
      `Işık şiddeti ${p.I} cd olan noktasal bir ışık kaynağının, kendisinden ${p.d} metre uzaklıkta, ışınlara dik bir yüzeyde oluşturduğu aydınlanma şiddeti kaç lüks (lx) olur?`,
    hesapla: (p: SoruParametreleri) => {
      const e = p.I / (p.d * p.d);
      return Math.round(e * 100) / 100;
    },
    yanlisCevapStratejisi: 'karekok-hata',
    aciklamaSablonu: (p: SoruParametreleri, dogru: number) =>
      `Aydınlanma şiddeti (E) formülü E = I / d² şeklindedir.\n\n` +
      `Verilenler:\n` +
      `I = ${p.I} cd\n` +
      `d = ${p.d} m\n\n` +
      `E = ${p.I} / (${p.d}²) = ${p.I} / ${p.d * p.d} = ${dogru} lx bulunur.`,
    kazanim: 'Aydınlanma şiddeti kavramını açıklar ve hesaplamalar yapar.',
    ipucuSablonu: 'Aydınlanma şiddeti ışık şiddetinin uzaklığın karesine oranına eşittir (E = I / d²).',
    sure: 60,
  },
  {
    id: 'optik-kuresel-ayna-odak-1',
    konuId: 'optik-10',
    altKonuId: 'kuresel-aynalar',
    sinif: 10,
    zorluk: 1,
    parametreler: {
      r: { min: 20, max: 120, adim: 10, birim: 'cm' },
    },
    soruSablonu: (p: SoruParametreleri) =>
      `Eğrilik yarıçapı ${p.r} cm olan bir çukur aynanın odak uzaklığı (f) kaç cm'dir?`,
    hesapla: (p: SoruParametreleri) => p.r / 2,
    yanlisCevapStratejisi: 'ters-islem',
    aciklamaSablonu: (p: SoruParametreleri, dogru: number) =>
      `Küresel aynalarda odak uzaklığı (f), eğrilik yarıçapının (R) yarısına eşittir.\n` +
      `Formül: f = R / 2\n` +
      `f = ${p.r} / 2 = ${dogru} cm.`,
    kazanim: 'Küresel aynaların odak uzaklığı ile eğrilik yarıçapı arasındaki ilişkiyi açıklar.',
    ipucuSablonu: 'Odak uzaklığı eğrilik yarıçapının tam yarısı kadardır.',
    sure: 30,
  },
  {
    id: 'optik-snell-1',
    konuId: 'optik-10',
    altKonuId: 'kirilma',
    sinif: 10,
    zorluk: 3,
    parametreler: {
      n1: { min: 1, max: 2, adim: 0.2 },
      v2: { min: 1.5, max: 2.5, adim: 0.1, birim: 'x10^8 m/s' },
    },
    soruSablonu: (p: SoruParametreleri) =>
      `Boşluktaki ışık hızı c = 3 x 10⁸ m/s'dir. Kırıcılık indisi n₁ = ${p.n1.toFixed(1)} olan bir ortamdan, ışık hızının v₂ = ${p.v2.toFixed(1)} x 10⁸ m/s olduğu ikinci bir ortama geçen ışık için ikinci ortamın kırıcılık indisi (n₂) nedir?`,
    hesapla: (p: SoruParametreleri) => {
      const n2 = 3 / p.v2;
      return Math.round(n2 * 100) / 100;
    },
    yanlisCevapStratejisi: 'ters-islem',
    aciklamaSablonu: (p: SoruParametreleri, dogru: number) =>
      `Bir ortamın mutlak kırıcılık indisi (n), boşluktaki ışık hızının (c) o ortamdaki ışık hızına (v) oranıdır.\n` +
      `Formül: n = c / v\n` +
      `İkinci ortam için: n₂ = 3 / ${p.v2.toFixed(1)} = ${dogru} olarak bulunur.`,
    kazanim: 'Işığın farklı ortamlardaki hızını kırıcılık indisiyle ilişkilendirir.',
    ipucuSablonu: 'Mutlak kırıcılık indisi ışık hızının ortamdaki hıza bölümüdür (n=c/v).',
    sure: 60,
  },
  {
    id: 'optik-ayna-yansima-1',
    konuId: 'optik-10',
    altKonuId: 'yansima',
    sinif: 10,
    zorluk: 1,
    parametreler: {
      gelme: { min: 20, max: 70, adim: 5, birim: '°' },
    },
    soruSablonu: (p: SoruParametreleri) =>
      `Bir düzlem aynaya gelen ışının yüzeyin normali ile yaptığı açı (gelme açısı) ${p.gelme}° dir. Buna göre yansıyan ışının ayna yüzeyi ile yaptığı açı kaç derecedir?`,
    hesapla: (p: SoruParametreleri) => {
      return 90 - p.gelme;
    },
    yanlisCevapStratejisi: 'aritmetik-hata',
    aciklamaSablonu: (p: SoruParametreleri, dogru: number) =>
      `Yansıma kanunlarına göre gelme açısı, yansıma açısına eşittir (Yansıma açısı = ${p.gelme}°).\n` +
      `Işının normalle yaptığı açı ile ayna yüzeyiyle yaptığı açının toplamı 90° dir.\n` +
      `Bu nedenle yansıyan ışının ayna yüzeyiyle yaptığı açı = 90 - ${p.gelme} = ${dogru}° olur.`,
    kazanim: 'Işığın yansıma kanunlarını uygular.',
    ipucuSablonu: 'Yansıma açısı gelme açısına eşittir ve normalle ayna yüzeyi arasındaki toplam açı 90 derecedir.',
    sure: 40,
  },
  {
    id: 'optik-mercek-odak-1',
    konuId: 'optik-10',
    altKonuId: 'mercekler',
    sinif: 10,
    zorluk: 2,
    parametreler: {
      yakin: { min: 2, max: 10, adim: 0.5, birim: 'D' },
    },
    soruSablonu: (p: SoruParametreleri) =>
      `Yakınsaması (diyoptri) +${p.yakin.toFixed(1)} D olan ince kenarlı bir merceğin odak uzaklığı kaç cm'dir?`,
    hesapla: (p: SoruParametreleri) => {
      return Math.round(100 / p.yakin);
    },
    yanlisCevapStratejisi: 'onlu-hata',
    aciklamaSablonu: (p: SoruParametreleri, dogru: number) =>
      `Yakınsama (Y), odak uzaklığının (metre cinsinden) tersidir. Y = 1 / f(m)\n` +
      `f(m) = 1 / ${p.yakin.toFixed(1)}\n` +
      `Odak uzaklığını cm'ye çevirmek için 100 ile çarparız:\n` +
      `f(cm) = 100 / ${p.yakin.toFixed(1)} = ${dogru} cm.`,
    kazanim: 'Merceklerin odak uzaklığı ile yakınsama arasındaki ilişkiyi açıklar.',
    ipucuSablonu: 'Yakınsama (Diyoptri) metre cinsinden odak uzaklığının tersidir. cm\'ye çevirmeyi unutmayın.',
    sure: 45,
  }
];
