export type GuideSection = {
  what: string;
  how: string;
  why: string;
  faq: { q: string; a: string }[];
};

export type CalculatorGuideMap = Record<string, GuideSection>;

export const calculatorGuides: CalculatorGuideMap = {

  "vucut-kitle-endeksi": {
    what: `Vücut Kitle Endeksi (BMI), bir kişinin kilo ve boy ilişkisini sayısal bir değere dönüştüren, dünyada en yaygın kullanılan sağlık tarama göstergelerinden biridir. Dünya Sağlık Örgütü (WHO) tarafından standart olarak kabul edilen bu değer; 18,5 ile 24,9 arasında olduğunda sağlıklı kiloyu, 25 ve üzerinde fazla kiloyu, 30 ve üzerinde obeziteyi gösterir. BMI, tek başına bir tanı aracı değil; sağlık riskini değerlendirmek için kullanılan pratik bir ön gösterge niteliği taşır.`,
    how: `BMI hesaplamak için tek bir formül kullanılır: kilogram cinsinden ağırlık, metre cinsinden boyun karesiyle bölünür. Örneğin 70 kg ve 1,75 m boyunda biri için hesaplama şöyledir: 70 ÷ (1,75 × 1,75) = 22,9. Bu değer 18,5–24,9 aralığına düştüğü için kişi "normal kilolu" olarak sınıflandırılır. Aracımız bu hesaplamayı anlık olarak yapar, sonucu kategorize eder ve sizi ilgili sağlık aralıkları hakkında bilgilendirir.`,
    why: `BMI değerini bilmek, sizi beklenmedik sağlık risklerine karşı önceden uyarabilir. Yüksek BMI; tip 2 diyabet, hipertansiyon, kalp-damar hastalıkları ve eklem sorunlarıyla güçlü bir korelasyon gösterir. Düşük BMI ise yetersiz beslenme ve kemik erimesi gibi risklere işaret eder. Düzenli takip, kilo yönetimi sürecinizi nesnel verilere dayandırmanızı sağlar.`,
    faq: [
      {
        q: "BMI hesaplaması kası dikkate alıyor mu?",
        a: "Hayır. BMI yalnızca kilo ve boyu kullanır. Bu nedenle yüksek kas kütlesine sahip sporcular aynı formülle fazla kilolu görünebilir. Daha doğru bir vücut kompozisyonu analizi için vücut yağ oranı ölçümü tercih edilmelidir.",
      },
      {
        q: "Çocuklar için BMI hesaplaması farklı mıdır?",
        a: "Evet. 2–19 yaş arası çocuklar için yaşa ve cinsiyete özel persentil tabloları (büyüme eğrileri) kullanılır. Yetişkinlere yönelik sabit sınırlar çocuklara uygulanamaz.",
      },
      {
        q: "Sağlıklı bir BMI aralığına gelmek için ne kadar kilo vermem gerekiyor?",
        a: "Aracımız hesaplama sonucunda, sağlıklı kilo aralığına girebilmek için boyunuza göre hedef kilo aralığını da gösterir. Bu bilgiyi sağlık uzmanınızla paylaşarak kişiselleştirilmiş bir plan oluşturabilirsiniz.",
      },
    ],
  },

  "ideal-kilo": {
    what: `İdeal kilo, belirli bir boya sahip yetişkinin sağlıklı sayılabilmesi için bulunması gereken ağırlık aralığını ifade eder. Tıbbi literatürde Lorentz, Devine ve Robinson gibi farklı formüller bulunmakla birlikte, günümüzde en çok başvurulan standart WHO'nun BMI'ya dayalı yaklaşımıdır. Bu yaklaşıma göre 18,5–24,9 BMI aralığına karşılık gelen kilo değerleri, ideal kilo aralığı olarak kabul edilir.`,
    how: `Aracımız, girdiğiniz boy bilgisini ve cinsiyetinizi kullanarak hem alt hem de üst ideal kilo sınırlarını hesaplar. Hesaplama; boyun karesiyle sağlıklı BMI aralığının (18,5 ve 24,9) çarpılması esasına dayanır. Örneğin 1,70 m boyunda bir kişi için alt sınır: 1,70² × 18,5 ≈ 53,5 kg; üst sınır: 1,70² × 24,9 ≈ 71,9 kg olarak bulunur.`,
    why: `İdeal kilonuzu bilmek; diyet planlaması, egzersiz hedefi belirleme ve sağlık takibi açısından somut bir referans noktası sunar. Yalnızca "kilo vermek istiyorum" demek yerine, tıbbi standartlara dayalı net bir hedef belirlemek motivasyonu artırır ve sağlıklı olmayan düzeyde zayıflamayı önler.`,
    faq: [
      {
        q: "İdeal kilo herkes için aynı mı?",
        a: "Hayır. Boy, cinsiyet ve yaş ideal kiloyu etkiler. Aynı boyda olsa bile geniş kemik yapısına sahip kişilerin sağlıklı kilo aralığının üst sınırına yakın olması oldukça normaldir.",
      },
      {
        q: "İdeal kiloma ulaşmak için günde kaç kalori tüketmeliyim?",
        a: "Bu, bazal metabolizma hızınıza (BMR) ve fiziksel aktivite düzeyinize bağlıdır. Kalori ihtiyacı hesaplama aracımızı kullanarak kişiselleştirilmiş bir değer elde edebilirsiniz.",
      },
      {
        q: "Kas yaparken ideal kilo aralığımın dışına çıkabilir miyim?",
        a: "Evet. Yüksek kas kitlesi, BMI'ya dayalı hesaplamalarda sizi matematiksel olarak fazla kilolu kategorisine sokabilir. Ancak vücut yağ oranınız sağlıklı aralıkta ise bu durum sorun teşkil etmez.",
      },
    ],
  },

  "kredi-hesaplama": {
    what: `Kredi hesaplama; belirli bir anapara tutarı, faiz oranı ve vade kombinasyonundan doğan aylık ödeme miktarını ve toplam geri ödeme tutarını önceden hesaplama işlemidir. Bu bilgi, ihtiyaç, konut veya taşıt kredisi almayı düşünen tüm bireylerin bankaya gitmeden önce sahip olması gereken temel finansal rehberdir.`,
    how: `Aylık taksit tutarı, "eşit taksit" yöntemi (Fransız amortismanı) ile hesaplanır. Formül: M = P × [r(1+r)ⁿ] / [(1+r)ⁿ - 1]. Burada P anapara, r aylık faiz oranı, n vade sayısıdır. Aracımıza anaparanızı, yıllık faiz oranını ve vadeyi girmeniz yeterlidir; tüm hesaplama anında yapılır ve aylık dökümü içeren amortizasyon tablosu gösterilir.`,
    why: `Kredi maliyetini önceden bilmek; farklı bankaların tekliflerini karşılaştırmanıza, bütçenize uygun vade seçmenize ve toplam faiz yükünü minimize etmenize olanak tanır. Aylık taksit tutarı net gelirinizin %40'ını aşmaması, sağlıklı bir borç yönetiminin temel kuralıdır.`,
    faq: [
      {
        q: "Yıllık faiz oranı ile aylık faiz oranı arasındaki fark nedir?",
        a: "Bankalar faizi genellikle aylık olarak açıklar. Aylık oranı 12 ile çarparak yıllık nominal orana ulaşabilirsiniz. Ancak bileşik faiz etkisiyle gerçek yıllık maliyet (APR) biraz daha yüksek olur.",
      },
      {
        q: "KKDF ve BSMV nedir ve maliyeti nasıl etkiler?",
        a: "KKDF ve BSMV, kredi faizi üzerine eklenen yasal vergi ve fondur. Güncel oranlara göre toplam vade maliyetini %15 oranında artırabilir.",
      },
      {
        q: "Erken ödeme yaparsam ne kadar tasarruf ederim?",
        a: "Erken ödeme, kalan anapara üzerindeki gelecek faiz yükünü ortadan kaldırır. Ancak bankalar yasal limite kadar (anapara üzerinde %2) erken kapatma cezası uygulayabilir.",
      },
    ],
  },

  "kdv": {
    what: `Katma Değer Vergisi (KDV), Türkiye'de mal ve hizmet teslimleri üzerinden alınan dolaylı bir tüketim vergisidir. 2026 yılı itibarıyla üç temel oran uygulanmaktadır: gıda ve temel ihtiyaçlar için %1, çeşitli hizmetler için %10 ve genel mal ve hizmetler için %20. KDV hesaplama, hem fatura kesen satıcıların hem de maliyet analizi yapan alıcıların en sık ihtiyaç duyduğu işlemlerden biridir.`,
    how: `KDV dahil fiyat hesaplamak için net tutara oranın eklenmesi yeterlidir: Brüt Tutar = Net Tutar × (1 + KDV Oranı). Tersi yönde, KDV dahil fiyattan net tutara ulaşmak için: Net Tutar = Brüt Tutar ÷ (1 + KDV Oranı). Aracımız her iki yönü de destekler; oran, dahil/hariç seçimi ve tevkifat oranını girerek saniyeler içinde doğru sonuca ulaşabilirsiniz.`,
    why: `Yanlış KDV hesaplaması; e-ticaret satıcıları için cezaya, muhasebe kayıtlarında hatalara ve kar marjı analizlerinde sapmalara yol açar. Faturanızın yasal otoriteler tarafından kabul görmesi için KDV tutarının tam ve doğru hesaplanması zorunludur.`,
    faq: [
      {
        q: "Tevkifatlı KDV nedir?",
        a: "Bazı hizmetlerde (örneğin taşımacılık, yapı işleri) KDV'nin bir kısmı hizmet alan tarafından beyan edilir. Bu orana 'tevkifat' denir. Aracımız tevkifat oranını ayrı bir giriş alanı olarak destekler.",
      },
      {
        q: "KDV iadesi nasıl alınır?",
        a: "KDV mükellefleri, ödedikleri KDV'yi indirim konusu yapabilir ve devreden KDV iade alabilirler. Beyannameye dahil etmeniz gereken tutarı hesaplamak için indirilen ve hesaplanan KDV farkını bulmanız yeterlidir.",
      },
      {
        q: "%10 KDV'ye tabi olan ürünler nelerdir?",
        a: "Restoran hizmetleri, konut kira geliri, bazı tekstil ürünleri ve belirli sağlık hizmetleri %10 KDV'ye tabidir. Spesifik ürün ve hizmetler için Gelir İdaresi Başkanlığı'nın güncel tebliğlerini incelemenizi öneririz.",
      },
    ],
  },

  "gelir-vergisi": {
    what: `Gelir vergisi; bireylerin elde ettikleri ücret, kira, faiz ve ticari kazanç gibi gelirler üzerinden devlete ödedikleri doğrudan bir vergidir. Türkiye'de ücret gelirleri için kümülatif dilim sistemi uygulanır. Çalışanlar bu vergiyi işverenler aracılığıyla "stopaj" yöntemiyle öder.`,
    how: `Vergi hesaplaması, brüt maaştan SGK ve işsizlik sigortası primlerinin düşülmesiyle bulunan matrah üzerinden gerçekleştirilir. Yıllık kümülatif matrah hangi dilime düşüyorsa o dilimin oranı uygulanır (%15, %20, %27, %35, %40). Aracımız vergi dilimlerini otomatik olarak uygular ve net ele geçen tutarı gösterir.`,
    why: `Gelir vergisi hesabını anlamak; maaş pazarlığı sürecinde net ve brüt kavramları arasındaki farkı kavramanızı sağlar. Doğru hesaplama yapamamış çalışanlar, yıl sonunda vergi farkı ödemekle yüz yüze gelebilir.`,
    faq: [
      {
        q: "Brüt ve net maaş arasındaki fark neden bu kadar fazla?",
        a: "Brüt maaştan SGK işçi payı (%14), işsizlik sigortası (%1) ve kümülatif gelir vergisi düşülünce net maaşa ulaşılır. Yüksek maaş dilimlerinde bu kesintiler brüt'ün %35'ini aşabilir.",
      },
      {
        q: "Yıl içinde iki işyerinde çalışırsam ne olur?",
        a: "Vergi dilimi yıllık kümülatif matrah üzerinden hesaplanır. Farklı işverenler altında çalışıldığında matrahlar birleştirilmez; yıl sonu beyannamesi verilmesi gerekebilir.",
      },
      {
        q: "İşveren prim yükü nedir?",
        a: "İşveren, çalışan adına ek olarak SGK payı (%20,5) ve işsizlik sigortası (%2) öder. Bu nedenle bir çalışanın işverene maliyeti, brüt maaşın yaklaşık %22,5 üzerindedir.",
      },
    ],
  },

  "yks-puan": {
    what: `Yükseköğretim Kurumları Sınavı (YKS), Türkiye'de üniversiteye yerleşme sürecini belirleyen iki aşamalı merkezi sınavdır. Birinci aşamada Temel Yeterlilik Testi (TYT), ikinci aşamada ise Alan Yeterlilik Testleri (AYT / YDT) uygulanır. Her puan türü farklı ağırlıklandırma formülüyle hesaplanır.`,
    how: `TYT ham puanı, doğru sayısından yanlış sayısının dörtte birinin çıkarılmasıyla elde edilir. AYT'de ise her alan ayrı ham puana çevrilir, ardından ÖSYM'nin katsayı tablosu uygulanarak ağırlıklı puana ulaşılır. Son adımda ortaöğretim başarı puanı (OBP) eklenerek yerleştirme puanı oluşur.`,
    why: `Sınav öncesi puan simülasyonu yapmak; çalışma stratejisini netleştirmek, hangi derslere öncelik verilmesi gerektiğini anlamak ve gerçekçi tercih listeleri oluşturmak açısından kritik önem taşır.`,
    faq: [
      {
        q: "TYT barajını geçememek ne anlama gelir?",
        a: "TYT'den 150 puanın altında kalan adaylar AYT'ye girse dahi üniversiteye yerleştirme kapsamı dışında kalır. TYT barajı tüm puan türleri için zorunlu ön koşuldur.",
      },
      {
        q: "OBP ne kadar etkilidir?",
        a: "Ortaöğretim Başarı Puanı (OBP), yerleştirme puanına katkı sağlar. Yakın puanlar arasındaki farkı kapatan önemli bir etken olabilir.",
      },
      {
        q: "Hesaplama yaparken yanlış net sayımı nasıl doğrularım?",
        a: "Cevap anahtarını ÖSYM'nin resmi sitesinden indirerek kontrol edebilirsiniz. Aracımız girdiğiniz doğru ve yanlış sayıyı kullanarak puanı hesaplar.",
      },
    ],
  },

  "lgs-puan": {
    what: `Liselere Geçiş Sistemi (LGS), sekizinci sınıf öğrencilerinin liseye yerleşme sürecini belirleyen merkezi sınavdır. Sınav; Türkçe, Matematik, Fen Bilimleri, İnkılap Tarihi, Din Kültürü ve yabancı dil alanlarını kapsar.`,
    how: `LGS'de her doğru yanıt 1 puan değerindedir; yanlış yanıtlar negatif etki yaratmaz. Ham puan, MEB'in dönüşüm tablosuna göre 100–500 arasındaki standart puan skalasına çevrilir. Matematik ve Türkçe diğer derslere oranla daha ağırlıklıdır.`,
    why: `LGS puanını önceden simüle etmek, hangi liselere başvurulabileceğini anlamak ve çalışma takvimini buna göre düzenlemek açısından öğrenciler ve veliler için pratik bir rehber niteliği taşır.`,
    faq: [
      {
        q: "LGS'de yanlış cevaplar puanı düşürür mü?",
        a: "Hayır. LGS'de yanlış cevaplar için negatif puan uygulaması yoktur. Boş bırakmak ile yanlış yanıtlamak arasında puan farkı yoktur.",
      },
      {
        q: "500 puan almak için kaç net yapmam lazım?",
        a: "Tam puana genellikle tüm sorularda doğru yanıt gerekmektedir. Her yıl sınav güçlüğüne göre değişkenlik gösterebilir.",
      },
      {
        q: "Tercihte yüzdelik dilim mi puan mı dikkate alınır?",
        a: "Anadolu ve fen lisesi yerleştirmelerinde ham puan değil standart skor (100–500) ve okul kontenjanı birlikte değerlendirilir.",
      },
    ],
  },

  "kpss-puan": {
    what: `Kamu Personeli Seçme Sınavı (KPSS), Türkiye'de devlet memurluğuna atanmak isteyen adayların katıldığı merkezi bir yeterlilik sınavıdır. Lisans, önlisans ve ortaöğretim düzeyinde ayrı sınavlar düzenlenir. Puan türleri (P3, P93, P94, P10) atanmak istenen kurum ve pozisyona göre farklılık gösterir.`,
    how: `Her puan türü; Genel Yetenek (GY) ve Genel Kültür (GK) netlerinin belirli ağırlıklarla toplanması ve Eğitim Bilimleri (EB) netinin eklenmesiyle oluşur. Net sayısı, doğru sayısından yanlış sayısının dörtte birinin çıkarılmasıyla bulunur.`,
    why: `KPSS puanını önceden bilmek; hangi kadrolara başvurulabileceğini, atanmak için kaç net yapılması gerektiğini ve hangi konu gruplarına öncelik verilmesi gerektiğini netleştirir.`,
    faq: [
      {
        q: "P3 ile P93 arasındaki fark nedir?",
        a: "P3 lisans düzeyindeki KPSS için kullanılan genel puan türüdür. P93 ve P94 ise özellikle öğretmen atamaları için kullanılan, eğitim bilgisi ağırlıklı puan türleridir.",
      },
      {
        q: "KPSS sınavına kaç yılda bir girilir?",
        a: "ÖSYM lisans KPSS sınavını genellikle yılda bir kez yapar. Güncel takvim için ÖSYM resmi sitesini takip etmeniz önerilir.",
      },
      {
        q: "Sözlü mülakat olmadan atanabilir miyim?",
        a: "Bir kısım kadro doğrudan KPSS puanıyla (sözlüsüz) atama yaparken diğer kadrolar mülakat aşaması öngörür. İlgili kurumun duyurusunu dikkatlice incelemeniz gerekir.",
      },
    ],
  },

  "enflasyon": {
    what: `Enflasyon, bir ekonomideki genel fiyat seviyesinin zaman içinde artış oranını ifade eder. Türkiye'de bu oran, TÜİK tarafından aylık yayımlanan Tüketici Fiyat Endeksi (TÜFE) verileriyle ölçülür. Enflasyon hesaplama araçları; paranın satın alma gücünün geçmişe veya geleceğe göre nasıl değiştiğini sayısal olarak gösterir.`,
    how: `Temel formül: Geleceğin Değeri = Bugünkü Değer × [(1 + Enflasyon Oranı)ⁿ]. Geçmiş satın alma gücünü bulmak için ise: Geçmişin Değeri = Bugünkü Değer ÷ Bileşik Enflasyon Katsayısı. Araç, girdiğiniz tutar ve yıl aralığına göre bu hesabı otomatik yapar.`,
    why: `Enflasyonun etkisini somutlaştırmak; birikim ve yatırım kararlarında daha bilinçli olmayı sağlar. Yastık altında tutulan para, negatif reel getiri nedeniyle her yıl değer yitirir. Bu araç, o değer kaybını sayılarla görünür kılar.`,
    faq: [
      {
        q: "TÜFE ve ÜFE arasındaki fark nedir?",
        a: "TÜFE hane halkının tükettiği ürün ve hizmetlerin fiyat artışını ölçerken, ÜFE fabrika çıkış fiyatlarındaki değişimi yansıtır.",
      },
      {
        q: "Enflasyon oranı açıklanandan farklı hissettiriyorsa bu normal mi?",
        a: "Evet. Resmi enflasyon geniş bir tüketici sepeti ortalamasıdır. Kira, gıda ve eğitim gibi belirli harcama kalemlerindeki artış, genel ortalamadan farklı olabilir.",
      },
      {
        q: "Paramın reel değerini nasıl koruyabilirim?",
        a: "Enflasyonu aşan bir getiri sağlamak için altın, döviz veya enflasyona endeksli mevduat gibi araçlara yönelmek gerekir. Reel getiri hesaplama aracımızla yatırımınızın enflasyondan arındırılmış getirisini görebilirsiniz.",
      },
    ],
  },

  "kidem-tazminati": {
    what: `Kıdem tazminatı; işyerinde en az bir yıl çalışmış bir çalışanın iş sözleşmesinin belirli koşullar altında sona ermesi durumunda işverence ödenmesi gereken yasal bir haktır. Her tam çalışma yılı için bir aylık brüt maaşa eşdeğer tazminat ödenir ve bu tazminata yasal bir tavan uygulanır.`,
    how: `Hesaplama şu formülle yapılır: Kıdem Tazminatı = (Brüt Maaş × Tam Çalışma Yılı). Brüt maaş kapsamına yalnızca temel ücret değil, düzenli olarak ödenen yemek, yol ve diğer yan ödemeler de dahil edilir.`,
    why: `Kıdem tazminatı hakkını bilen çalışanlar; işten çıkarılma, istifa veya emeklilik süreçlerinde alacaklarını önceden hesaplayabilir ve işverenle bilinçli müzakere edebilir.`,
    faq: [
      {
        q: "İstifa edersem kıdem tazminatı alabilir miyim?",
        a: "Genel kural olarak istifa eden çalışan kıdem tazminatı alamaz. Ancak askerlik, evlilik (kadın işçiler için) ve emeklilik hakkı kazanma gibi özel durumlarda istifada da tazminat hakkı doğabilir.",
      },
      {
        q: "Part-time çalışanlar için kıdem tazminatı nasıl hesaplanır?",
        a: "Part-time çalışanlarda tazminat, çalışılan süreyle orantılı olarak hesaplanır. Tam zamanlı muadilinin kazanacağı tazminata, çalışılan saat oranı uygulanır.",
      },
      {
        q: "İşverenin kıdem tazminatını ödememesi durumunda ne yapmalıyım?",
        a: "İşverenin haksız şekilde ödeme yapmadığı durumlarda öncelikle Arabuluculuk yoluna başvurulmalıdır. Uzlaşma sağlanamaması halinde İş Mahkemesi'nde dava açılabilir.",
      },
    ],
  },

  "gunluk-kalori-ihtiyaci": {
    what: `Günlük kalori ihtiyacı; bir kişinin ağırlığını koruyabilmesi için 24 saatte alması gereken toplam enerji miktarını ifade eder. Bu değer, yaş, cinsiyet, boy, kilo ve fiziksel aktivite düzeyine göre kişiden kişiye önemli ölçüde farklılık gösterir.`,
    how: `Hesaplama iki aşamadan oluşur. İlk aşamada bazal metabolizma hızı (BMR) Mifflin-St Jeor formülüyle bulunur. İkinci aşamada BMR, aktivite katsayısıyla çarpılarak Toplam Günlük Enerji Harcaması (TDEE) elde edilir. Örneğin orta aktif bir bireyin TDEE'si BMR × 1,55 olarak hesaplanır.`,
    why: `Kalori ihtiyacını bilmeden yapılan diyetler ya çok kısıtlayıcı olup kas kaybına yol açar ya da yetersiz kalori açığı nedeniyle hiç etki göstermez. Bilimsel temele dayanan kişiselleştirilmiş bir kalori hedefi, sürdürülebilir ve sağlıklı kilo yönetiminin temelidir.`,
    faq: [
      {
        q: "Yavaş metabolizma diye bir şey gerçekten var mı?",
        a: "Evet, metabolizma hızı bireyler arasında farklılık gösterir. Yaş ilerledikçe ve kas kütlesi azaldıkça kalori ihtiyacı düşer.",
      },
      {
        q: "1 kg yağ kaç kaloriye eşittir?",
        a: "Yaklaşık 7.700 kalori. Bu da haftada 500 kalorilik açık oluşturarak teorik olarak haftada yarım kilogram kilo verileceği anlamına gelir.",
      },
      {
        q: "Egzersiz yaparsam ne kadar daha yiyebilirim?",
        a: "Yanıt yaptığınız egzersizin türüne ve yoğunluğuna göre değişir. Orta tempolu 45 dakikalık yürüyüş yaklaşık 200–300 kalori yakar.",
      },
    ],
  },

  "netten-brute": {
    what: `Netten brüte maaş hesaplama; "ele geçen" olarak bilinen net maaş tutarından başlayarak, üzerindeki yasal kesintiler geri eklenerek brüt maaşa ulaşma işlemidir. Bu hesaplama; iş tekliflerini değerlendirirken, sözleşme görüşmelerinde ve bordro kontrolünde kritik bir araçtır.`,
    how: `Brüt maaştan sırasıyla; SGK işçi payı (%14), işsizlik sigortası işçi payı (%1) ve kümülatif gelir vergisi dilimi düşülerek net maaşa ulaşılır. Tersine işlem için bu kesintileri sırayla geri eklemek gerekir. Aracımız yıllık kümülatif matrahı da dikkate alır.`,
    why: `"Maaşınız 30.000 TL brüt" dendiğinde sevinmeden önce net tutarı hesaplamak şarttır. Gelir vergisi diliminin yüksek olduğu senaryolarda brüt ile net arasındaki fark %35'i aşabilir.`,
    faq: [
      {
        q: "Maaş bordromda 'vergi matrahı' ne anlama gelir?",
        a: "Vergi matrahı, SGK ve işsizlik sigortası kesintileri düşüldükten sonra kalan ve üzerine gelir vergisi uygulanan tutardır.",
      },
      {
        q: "İşverenin prim yükü toplamda ne kadar?",
        a: "İşveren, çalışan adına ek olarak SGK payı (%20,5) ve işsizlik sigortası (%2) öder. Brüt 30.000 TL maaşlı bir çalışanın işverene toplam maliyeti yaklaşık 36.750 TL'dir.",
      },
      {
        q: "AGİ kaldırıldı mı?",
        a: "Asgari Geçim İndirimi (AGİ) sistemi 2022 itibarıyla kaldırılmış ve asgari ücretin vergi dışında tutulması uygulamasına geçilmiştir.",
      },
    ],
  },

  "yuzde": {
    what: `Yüzde hesaplama; bir sayının belli bir oranını bulmak, iki değer arasındaki oransal farkı tespit etmek ya da bir toplamın içindeki payı hesaplamak için kullanılan temel matematiksel işlemdir.`,
    how: `Üç temel yüzde işlemi vardır: (1) Bir sayının %X'ini bulmak: Sayı × (X ÷ 100). (2) Bir sayının diğerinin yüzde kaçı olduğunu bulmak: (A ÷ B) × 100. (3) Yüzde değişimini bulmak: [(Yeni - Eski) ÷ |Eski|] × 100.`,
    why: `Günlük alışverişten kurumsal raporlamaya kadar pek çok alanda yüzde hesabını hızlı ve doğru yapabilmek; zaman tasarrufu sağlar ve hesap hatalarını önler.`,
    faq: [
      {
        q: "İndirimli fiyatı nasıl hesaplarım?",
        a: "Orijinal fiyatı (1 - indirim oranı / 100) ile çarpın. Örnek: 500 TL ürün, %20 indirimle → 500 × 0,80 = 400 TL.",
      },
      {
        q: "KDV dahil fiyattan KDV'yi nasıl ayırırım?",
        a: "Net tutar = Brüt tutar ÷ (1 + KDV oranı). %20 KDV için: Net = Brüt ÷ 1,20.",
      },
      {
        q: "Yüzde artış ve yüzde puan farkı aynı şey mi?",
        a: "Hayır. %50'den %55'e çıkmak hem +5 puan hem de +%10 değişim anlamına gelir. Finansal analizde bu iki ifade birbirinden farklı kavramlardır.",
      },
    ],
  },

  "birikim": {
    what: `Birikim hesaplama, belirli bir başlangıç sermayesiyle ve gösterilen periyodik katkılarla, belirli bir faiz oranı altında gelecekte oluşacak toplam tutarın öngörülmesi işlemidir. Vadeli mevduat, bireysel emeklilik sistemi (BES) veya düzenli tasarruf planları için ideal bir projeksiyon aracıdır.`,
    how: `Bileşik faiz formülü kullanılır: FV = P × (1 + r)ⁿ + PMT × [(1 + r)ⁿ - 1] / r. Burada P başlangıç tutarı, PMT aylık katkı, r dönemlik faiz oranı, n dönem sayısıdır. Aracımız hem brüt hem net birikimi gösterir.`,
    why: `"Ayda 1.000 TL biriktirirsem 10 yıl sonra ne kadar para yaparım?" sorusunun somut cevabını vermek; erken tasarrufa başlamanın gücünü ve ertelemenin maliyetini görünür kılar.`,
    faq: [
      {
        q: "Vadeli mevduat faiz geliri vergilendirilir mi?",
        a: "Evet. TL vadeli mevduat faiz gelirleri stopaj vergisine tabidir. Aracımız net getiriyi göstermek için stopaj kesintisini otomatik uygulamaktadır.",
      },
      {
        q: "Enflasyonun üzerinde getiri elde etmek için ne yapmam lazım?",
        a: "Reel getiri; nominal getiri eksi enflasyon olarak hesaplanır. Enflasyonun üzerinde reel getiri için alternatif yatırım araçları değerlendirilmelidir.",
      },
      {
        q: "BES katkı payı hesabı için bu araç kullanılabilir mi?",
        a: "Evet. Aylık katkı tutarınızı ve beklenen fon getirisini girerek uzun vadeli BES birikimini simüle edebilirsiniz.",
      },
    ],
  },

  "mtv-hesaplama": {
    what: `Motorlu Taşıtlar Vergisi (MTV), Türkiye'de araç sahiplerinin Ocak ve Temmuz aylarında iki taksit halinde ödediği yıllık bir servet vergisidir. Vergi tutarı; aracın motor hacmi (cc), yaşı ve taşıt türüne göre belirlenir.`,
    how: `MTV, belirli motor hacmi aralıkları ve yaş kategorileri için Hazine ve Maliye Bakanlığı tarafından yayımlanan tarifedeki sabit tutara karşılık gelir. Aracımız 2026 yılı güncel tarifesini kullanarak taksit tutarlarınızı anında gösterir.`,
    why: `Ocak ve Temmuz ayı öncesinde MTV tutarını bilmek, bütçe planlaması açısından önemlidir. Araç alımında da ödenmesi gereken yıllık MTV, toplam sahiplik maliyetinin hesaplanmasında göz ardı edilemez.`,
    faq: [
      {
        q: "MTV ödeme tarihleri nedir?",
        a: "MTV yılda iki eşit taksitle ödenir: Birinci taksit Ocak ayı sonuna, ikinci taksit Temmuz ayı sonuna kadar ödenmesi gerekir.",
      },
      {
        q: "Motorsikletler için MTV nasıl hesaplanır?",
        a: "Her taşıt türünün ayrı bir tarife tablosu bulunmaktadır. Aracımız binek araç, kamyonet, otobüs ve motorsiklet gibi kategoriler için farklı tarife tablolarını desteklemektedir.",
      },
      {
        q: "Engelli vatandaşlar MTV'den muaf mı?",
        a: "Evet. %90 ve üzeri engel oranına sahip vatandaşlar adlarına kayıtlı tek araçtan MTV'den muaf tutulmaktadır.",
      },
    ],
  },

  "kira-artisi": {
    what: `Kira artış oranı hesaplama, mevcut kira sözleşmelerinde yasal sınırlar dahilinde uygulanabilecek azami artış tutarını bulmak amacıyla kullanılır. Türkiye'de konut kira artışları; 12 aylık TÜFE ortalamasına göre belirlenen yasal tavanla sınırlandırılmıştır.`,
    how: `Yeni Kira = Mevcut Kira × (1 + Artış Oranı / 100). 12 aylık TÜFE ortalaması her ay TÜİK tarafından açıklanır. Aracımız güncel yasal tavan oranını kullanarak hem TL hem de yüzde artış değerini hesaplar.`,
    why: `Kiraya veren ve kiracıların kira artış hakkını ve sınırını bilmesi; anlaşmazlıkları önler ve tarafları yasal yükümlülükler konusunda aydınlatır.`,
    faq: [
      {
        q: "Yasal tavanı aşan kira sözleşmesi geçersiz sayılır mı?",
        a: "Yasaya aykırı artış oranı hukuki geçerlilik taşımaz. Kiracı, aşılan kısmı mahkeme yoluyla geri alabilir.",
      },
      {
        q: "İş yeri kirası için de aynı tavan geçerli mi?",
        a: "İş yeri kiraları için dönemsel olarak farklı yasal düzenlemeler yapılmıştır. Güncel dönem için sözleşme tarihine bakılması gerekir.",
      },
      {
        q: "Kira artış oranını ne zaman bildirmeliyim?",
        a: "Artış, kira dönemi başlamadan makul bir süre önce yazılı olarak bildirilmelidir.",
      },
    ],
  },

  "hisse-senedi-ortalama-maliyet": {
    what: `Hisse senedi ortalama maliyet hesaplama; bir yatırımcının farklı fiyatlardan kademeli olarak satın aldığı hisse senetlerinin toplam ağırlıklı ortalama alış fiyatını bulmak için kullanılan bir finansal analiz aracıdır.`,
    how: `Formül basittir: Ortalama Maliyet = Toplam Harcanan Tutar ÷ Toplam Lot Sayısı. Aracımız ayrıca komisyon giderlerini de dahil ederek gerçek ortalama maliyeti hesaplar.`,
    why: `Net ortalama maliyeti bilmek; hangi fiyatta kâra geçileceğini, stop-loss seviyesini ve portföy yönetimini nesnel hale getirir.`,
    faq: [
      {
        q: "Komisyon maliyetini ortalamaya dahil etmeli miyim?",
        a: "Evet. Komisyon, ortalama maliyeti yükseltir ve kâra geçiş fiyatını yukarı taşır. Aracımız bu hesabı otomatik yapar.",
      },
      {
        q: "Ortalama düşürme her zaman mantıklı mı?",
        a: "Hayır. Ortalama düşürme; yalnızca şirketin temellerinde kalıcı bir bozulma olmadığına inanıldığında tercih edilmelidir.",
      },
      {
        q: "Farklı borsalardaki aynı hissenin ortalamasını hesaplayabilir miyim?",
        a: "Evet. Aracımız farklı alım noktalarını serbest olarak girmenize imkân verir.",
      },
    ],
  },

  "dolar-maliyet-ortalamasi": {
    what: `Dolar Maliyet Ortalaması (Dollar-Cost Averaging / DCA), yatırımcının piyasa koşullarından bağımsız olarak düzenli ve sabit tutarda yatırım yaptığı bir stratejidir. Bu strateji; fiyat yüksekken daha az, fiyat düşükken daha fazla birim satın alınmasını otomatik olarak sağlar.`,
    how: `Her dönem sabit tutar, o dönemin varlık fiyatına bölünür ve elde edilen birimler toplanır. Ortalama maliyet = Toplam Yatırılan Tutar ÷ Toplam Satın Alınan Birim Sayısı. Aracımız tüm bu simülasyonu yaparak portföyünüzün büyümesini grafik olarak gösterir.`,
    why: `Piyasayı tam zamanlamak neredeyse imkânsızdır. DCA, bu "doğru zamanı yakalama" baskısını ortadan kaldırır ve uzun vadeli yatırımcıların tutarlı birikimini mümkün kılar.`,
    faq: [
      {
        q: "DCA mı yoksa tek seferde yatırım mı daha iyi?",
        a: "Piyasanın yükseliş trendindeyken tek seferlik yatırım genellikle üstün performans gösterir. Ancak belirsizlikte DCA riski dağıtarak daha güvenli bir alternatif sunar.",
      },
      {
        q: "DCA için en uygun varlık sınıfı hangisidir?",
        a: "DCA; yüksek volatiliteye sahip kripto paralar, hisse senetleri ve emtia gibi varlık sınıflarında en belirgin avantajını gösterir.",
      },
      {
        q: "Ne kadar sıklıkla alım yapmalıyım?",
        a: "Aylık veya haftalık alımlar, işlem maliyetleri ile optimizasyon arasında iyi bir denge sağlar.",
      },
    ],
  },

  "yas-hesaplama": {
    what: `Yaş hesaplama; doğum tarihinizden bugüne kadar geçen süreyi yıl, ay ve gün cinsinden kesin olarak hesaplayan bir araçtır. Pasaport, sürücü belgesi, sigorta poliçesi ve iş başvuruları gibi resmi belgelerde tam yaş bilgisi gün hassasiyetinde istenir.`,
    how: `Hesaplama, doğum tarihinden başlayarak bugünün tarihine kadar geçen tam takvim yıllarını, kalan ayları ve kalan günleri bulma esasına dayanır. 29 Şubat gibi artık yıl gün farklılıkları da dahil edilir.`,
    why: `Emeklilik hesaplamaları, miras davaları, burs başvuruları ve yaş sınırı olan yarışma veya sınavlarda tam yaş bilgisi doğrudan belirleyicidir.`,
    faq: [
      {
        q: "Doğum tarihim 29 Şubat ise yaşım nasıl hesaplanır?",
        a: "Artık olmayan yıllarda doğumgünü, kullanılan takvim sistemine göre 28 Şubat veya 1 Mart olarak kabul edilebilir.",
      },
      {
        q: "Aylık doğum günü ne kadar önemli?",
        a: "Sigorta poliçeleri ve emeklilik hesapları gibi resmi işlemlerde ay bazında doğum günü belirleyicidir.",
      },
      {
        q: "Toplam kaç saat veya dakika yaşadım?",
        a: "Aracımız toplam gün sayısını gösterir. Toplam saati bulmak için gün sayısını 24 ile çarpabilirsiniz.",
      },
    ],
  },

  "bmr": {
    what: `Bazal Metabolizma Hızı (BMR); vücudun tam istirahat halindeyken yalnızca temel yaşamsal fonksiyonları sürdürebilmek için harcadığı minimum kalori miktarını ifade eder. BMR, kilo yönetiminin matematiksel temelidir.`,
    how: `En yaygın kullanılan formül Mifflin-St Jeor denklemleridir. Erkek: BMR = 10 × kilo + 6,25 × boy − 5 × yaş + 5. Kadın: BMR = 10 × kilo + 6,25 × boy − 5 × yaş − 161. Aracımız aktivite katsayısını ekleyerek TDEE'yi de hesaplar.`,
    why: `BMR'nizi bilmeden kilo verme hesabı yapmak, temel bilinmeyen eksik bir denklem kurmak gibidir. Çok düşük kalorili diyet uygulayanlar BMR'nin altına düşebilir; bu kas kaybına ve metabolizmanın yavaşlamasına yol açar.`,
    faq: [
      {
        q: "BMR uyku sırasında da aynı mı kalır?",
        a: "Evet, uykuda da metabolik hız sıfırlanmaz. BMR; uyku dahil mutlak dinlenim durumundaki enerji ihtiyacını yansıtır.",
      },
      {
        q: "BMR'mi artırmak için ne yapabilirim?",
        a: "Kas kütlesi artırmak BMR'yi yükseltmenin en etkili yöntemidir. Direnç antremanları ve yeterli protein alımı bu sürecin temelidir.",
      },
      {
        q: "BMR ile TDEE arasındaki fark nedir?",
        a: "BMR mutlak dinlenim durumundaki kalori ihtiyacıdır. TDEE = BMR × Aktivite Katsayısı olarak hesaplanır ve gün içindeki tüm aktiviteleri kapsar.",
      },
    ],
  },

  "ihtiyac-kredisi": {
    what: `İhtiyaç kredisi, bireylerin eğitim, seyahat, tadilat veya acil nakit ihtiyacı gibi kişisel harcamalarını finanse etmek amacıyla bankalardan kullandıkları teminatsız bir tüketici kredisidir. Konut veya taşıt kredisinin aksine, kredi tutarı herhangi bir varlığa bağlı değildir ve kullanım amacı serbesttir.`,
    how: `Hesaplama, Fransız amortismanı (eşit taksit) yöntemiyle yapılır. Aylık taksit formülü: M = P × [r(1+r)ⁿ] / [(1+r)ⁿ - 1]. Anapara (P), aylık faiz oranı (r) ve vade sayısı (n) girilerek toplam geri ödeme ve faiz tutarı bulunur. KKDF (%15) ve BSMV (%10) faiz üzerine eklenerek gerçek maliyet hesaplanır.`,
    why: `İhtiyaç kredisi faiz oranları bankadan bankaya büyük farklılık gösterebilir. Kredi almadan önce farklı vade ve oran senaryolarını simüle etmek, toplam maliyeti minimize etmenin ve bütçe planlamasının en etkili yoludur.`,
    faq: [
      { q: "İhtiyaç kredisi için minimum gelir şartı var mı?", a: "Evet. Bankalar genellikle asgari ücretin belirli bir katı kadar gelir belgelendirmesi ister. Her bankanın kendi limit politikası vardır." },
      { q: "KKDF ve BSMV nedir?", a: "KKDF (Kaynak Kullanımını Destekleme Fonu) ve BSMV (Banka ve Sigorta Muameleleri Vergisi), kredi faizi üzerine eklenen yasal kesintilerdir. Toplam maliyeti yaklaşık %15 artırırlar." },
      { q: "Kredi notu düşükse ihtiyaç kredisi alabilir miyim?", a: "Düşük kredi notu (Findeks skoru) onay şansını azaltır ve daha yüksek faiz oranıyla karşılaşmanıza neden olabilir. Kredi notunuzu yükseltmek için mevcut borçlarınızı düzenli ödemeniz önerilir." },
    ],
  },

  "konut-kredisi": {
    what: `Konut kredisi (mortgage), ev satın almak veya inşa ettirmek isteyen bireylerin bankalardan uzun vadeli ve taşınmaz teminatlı olarak kullandığı bir kredi türüdür. Türkiye'de konut kredisi vadeleri 120 aya (10 yıl) kadar uzayabilir ve taşınmaz üzerine ipotek tesis edilir.`,
    how: `Konut kredisi hesaplamasında anapara, yıllık faiz oranı ve vade (ay) girilir. Eşit taksit formülü uygulanarak aylık ödeme bulunur. Ek olarak; dosya masrafı, ekspertiz ücreti, DASK (zorunlu deprem sigortası) ve ipotek tesis harcı gibi yan maliyetler toplam maliyete eklenir.`,
    why: `Konut kredisi, çoğu insanın hayatındaki en büyük finansal taahhüttür. 1 puanlık faiz farkı bile 10 yıllık vadede on binlerce TL fark yaratabilir. Bu nedenle farklı bankaların tekliflerini detaylı karşılaştırmak kritik önem taşır.`,
    faq: [
      { q: "Konut kredisinde peşinat zorunlu mu?", a: "Evet. Bankalar genellikle konut değerinin en az %20'si kadar peşinat ister. Kalan %80'lik kısım kredi olarak kullandırılır." },
      { q: "Sabit faiz mi değişken faiz mi tercih etmeliyim?", a: "Sabit faiz, taksit tutarınızın vade boyunca değişmemesini sağlar. Değişken faiz başlangıçta düşük olabilir ancak piyasa koşullarına göre artabilir. Türkiye'de çoğunlukla sabit faizli konut kredisi tercih edilmektedir." },
      { q: "DASK sigortası ne kadar tutar?", a: "DASK primi; konutun bulunduğu il, yapı tarzı ve metrekareye göre değişir. Yıllık 200–1.500 TL arasında değişebilir ve konut kredisi için zorunludur." },
    ],
  },

  "faiz": {
    what: `Faiz hesaplama, belirli bir anapara tutarının belirli bir süre ve oran dahilinde ürettiği getiriyi veya borçlanma maliyetini bulmak için kullanılan temel finansal işlemdir. Vadeli mevduat, kredi ve yatırım kararlarının matematiksel temelini oluşturur.`,
    how: `Basit faiz formülü: Faiz = Anapara × Oran × Süre. Bileşik faiz formülü: Gelecek Değer = Anapara × (1 + r)ⁿ. Vadeli mevduatta brüt faiz üzerinden stopaj (%15 TL, %0 döviz) düşülerek net getiriye ulaşılır.`,
    why: `Faiz oranını doğru hesaplamak; tasarruflarınızın gerçek getirisini, kredinizin gerçek maliyetini ve yatırım alternatiflerinin karşılaştırmasını sağlar. Net ve brüt getiri arasındaki farkı bilmemek, yanıltıcı kararlar almanıza yol açabilir.`,
    faq: [
      { q: "Basit faiz ile bileşik faiz arasındaki fark nedir?", a: "Basit faizde getiri yalnızca anaparaya uygulanır. Bileşik faizde ise her dönemin faizi anaparaya eklenir ve sonraki dönemde bu yeni toplam üzerinden faiz işler. Uzun vadede bileşik faiz önemli ölçüde daha yüksek getiri sağlar." },
      { q: "Vadeli mevduat faizinden vergi kesilir mi?", a: "Evet. TL vadeli mevduattan %15, döviz mevduatından %25 oranında stopaj (gelir vergisi kesintisi) uygulanır." },
      { q: "Faiz oranları neye göre belirlenir?", a: "TCMB politika faizi, enflasyon beklentileri ve piyasa koşulları bankaların mevduat ve kredi faiz oranlarını doğrudan etkiler." },
    ],
  },

  "vadeli-mevduat": {
    what: `Vadeli mevduat, belirli bir süre boyunca bankaya yatırılan paranın önceden belirlenen bir faiz oranıyla değerlendirildiği, en yaygın ve düşük riskli yatırım aracıdır. Vade sonunda anapara ve faiz birlikte hesaba aktarılır.`,
    how: `Net getiri = Anapara × (Yıllık Faiz Oranı / 365) × Gün Sayısı × (1 - Stopaj Oranı). Aracımız girilen tutara, vadeye ve faiz oranına göre hem brüt hem net getiriyi hesaplar. Kırık vade (32, 60, 90, 180 gün vb.) seçenekleri desteklenir.`,
    why: `Vadeli mevduat en güvenli yatırım aracı olmakla birlikte, enflasyonun altında kalan faiz oranları reel kayba yol açabilir. Farklı vade ve oran senaryolarını karşılaştırarak paranızın gerçek büyümesini önceden görmek önemlidir.`,
    faq: [
      { q: "Vadeli mevduatı vadesinden önce bozabilir miyim?", a: "Evet, ancak vadesinden önce bozulursa banka cari faiz oranı (genellikle çok düşük) uygular ve beklenen getirinin büyük kısmını kaybedersiniz." },
      { q: "Mevduat sigortası limiti nedir?", a: "TMSF (Tasarruf Mevduatı Sigorta Fonu) kapsamında kişi başına banka başına 150.000 TL'ye kadar mevduat güvence altındadır." },
      { q: "KKM (Kur Korumalı Mevduat) ile vadeli mevduat arasındaki fark nedir?", a: "KKM'de vade sonunda TL faizi ile döviz kuru artışından hangisi yüksekse o ödenir. Vadeli mevduatta ise yalnızca sabit TL faizi uygulanır." },
    ],
  },

  "gebelik": {
    what: `Gebelik hesaplama, son adet tarihinden (SAT) yola çıkarak tahmini doğum tarihini, mevcut gebelik haftasını ve trimester bilgisini hesaplayan bir sağlık aracıdır. Hesaplama Naegele kuralına dayanır.`,
    how: `Naegele kuralı: Son adet tarihine 7 gün eklenir, 3 ay çıkarılır ve 1 yıl eklenir. Örneğin SAT 1 Ocak ise tahmini doğum 8 Ekim olur. Normal gebelik süresi 280 gün (40 hafta) olarak kabul edilir. Aracımız hafta ve gün bazında detaylı bilgi verir.`,
    why: `Gebelik haftasını bilmek, doğum öncesi kontrollerin zamanlaması, ultrason takvimleri ve olası komplikasyonların erken tespiti açısından hayati önem taşır. Doğru hesaplama, sağlık profesyonellerinin takip planı oluşturmasını kolaylaştırır.`,
    faq: [
      { q: "Tahmini doğum tarihi kesin midir?", a: "Hayır. Tahmini doğum tarihi bir yaklaşımdır; bebeklerin yalnızca %5'i tam hesaplanan tarihte doğar. Normal doğum 37-42. haftalar arasında gerçekleşebilir." },
      { q: "Son adet tarihimi bilmiyorsam ne yapmalıyım?", a: "İlk trimesterde yapılan ultrason ölçümü ile gebelik haftası yüksek doğrulukla belirlenebilir. Doktorunuzla görüşmeniz önerilir." },
      { q: "Trimester nedir?", a: "Gebelik 3 trimestere ayrılır: 1. trimester (0-13 hafta), 2. trimester (14-27 hafta), 3. trimester (28-40 hafta). Her dönemde farklı gelişimsel süreçler ve kontroller önem kazanır." },
    ],
  },

  "su-ihtiyaci": {
    what: `Günlük su ihtiyacı hesaplama, kişinin vücut ağırlığı, fiziksel aktivite düzeyi ve iklim koşullarına göre günde tüketmesi gereken minimum su miktarını litre ve bardak cinsinden belirleyen bir sağlık aracıdır.`,
    how: `Temel formül: Günlük Su (ml) = Vücut Ağırlığı (kg) × 33. Egzersiz yapan bireyler için her 30 dakikalık aktiviteye 350 ml eklenir. Sıcak iklimlerde ve hamilelik/emzirme dönemlerinde ihtiyaç %20-30 oranında artar.`,
    why: `Dehidratasyon; baş ağrısı, yorgunluk, konsantrasyon kaybı ve böbrek sorunlarına yol açabilir. Günlük su ihtiyacınızı bilmek ve düzenli takip etmek, metabolizmanızın verimli çalışması için temel bir sağlık adımıdır.`,
    faq: [
      { q: "Çay ve kahve su ihtiyacına dahil mi?", a: "Kısmen. Kafeinli içecekler hafif diüretik etkiye sahip olsa da sıvı alımına katkı sağlar. Ancak saf su tüketiminin en az toplam ihtiyacın %60-70'ini oluşturması önerilir." },
      { q: "Fazla su içmek zararlı mı?", a: "Çok nadir durumlarda aşırı su tüketimi hiponatremiye (kan sodyum düşüklüğü) yol açabilir. Günde 4-5 litreden fazla tüketimde dikkatli olunmalıdır." },
      { q: "Çocuklar için su ihtiyacı nasıl hesaplanır?", a: "Çocuklarda su ihtiyacı yaşa göre değişir: 1-3 yaş ~1,3 litre, 4-8 yaş ~1,7 litre, 9-13 yaş ~2,1-2,4 litre olarak önerilmektedir." },
    ],
  },

  "not-ortalamasi": {
    what: `Ders notu ortalaması hesaplama, öğrencilerin aldıkları notları ve ders kredilerini (veya saatlerini) kullanarak ağırlıklı genel not ortalamasını (AGNO/GANO) bulan bir eğitim aracıdır. Üniversite, lise ve ortaokul düzeyinde kullanılır.`,
    how: `Ağırlıklı Ortalama = Σ(Not × Kredi) / Σ(Kredi). Örneğin 3 kredilik bir dersten AA (4.0) ve 4 kredilik bir dersten BA (3.5) alındığında: (4.0×3 + 3.5×4) / (3+4) = 3.71. Harf notu sistemi üniversiteden üniversiteye farklılık gösterebilir.`,
    why: `Not ortalaması; burs başvuruları, yatay/dikey geçiş, mezuniyet derecesi ve lisansüstü programlara başvuru gibi akademik kararlarda belirleyici bir kriterdir. Dönem içinde ortalama takibi, akademik hedeflere ulaşmayı kolaylaştırır.`,
    faq: [
      { q: "4'lük ve 100'lük not sistemi arasındaki fark nedir?", a: "4'lük sistemde notlar AA (4.0) ile FF (0.0) arasında harf notu olarak verilir. 100'lük sistemde sayısal puan kullanılır. Üniversiteler genellikle 4'lük sistemi tercih eder." },
      { q: "GANO ile dönem ortalaması aynı mı?", a: "Hayır. Dönem ortalaması yalnızca o dönemin derslerini kapsar. GANO ise tüm dönemlerin kümülatif ortalamasıdır." },
      { q: "Dersten kaldığımda ortalamam nasıl etkilenir?", a: "FF veya DD gibi düşük notlar ağırlıklı ortalamayı ciddi şekilde düşürür. Dersi tekrar alıp geçtiğinizde yeni not eski notun yerine geçer." },
    ],
  },

  "damga-vergisi": {
    what: `Damga vergisi, resmi belge ve kâğıtlar üzerinden alınan dolaylı bir vergidir. Kira sözleşmeleri, ihale kararları, taahhütnameler ve maaş bordroları gibi belgeler damga vergisine tabidir. 2026 yılı oranları Hazine ve Maliye Bakanlığı tarafından belirlenir.`,
    how: `Damga vergisi iki şekilde hesaplanır: (1) Nispi vergi — belge tutarının belirli bir yüzdesi (örneğin sözleşmelerde binde 9,48). (2) Maktu vergi — belge türüne göre sabit tutar. Aracımız belge türü ve tutarını girerek vergi miktarını otomatik hesaplar.`,
    why: `Damga vergisini yanlış hesaplamak veya beyan etmemek; cezai yaptırımlara, faiz uygulamasına ve vergi denetimlerinde sorunlara yol açar. Sözleşme öncesi doğru tutarı bilmek, her iki taraf için de yasal güvence sağlar.`,
    faq: [
      { q: "Kira sözleşmesinde damga vergisini kim öder?", a: "Yasal olarak damga vergisi sözleşmenin her iki tarafından da tahsil edilebilir. Ancak uygulamada genellikle kiracı tarafından ödenir." },
      { q: "Dijital sözleşmelerde damga vergisi uygulanır mı?", a: "Evet. Elektronik ortamda düzenlenen ve imzalanan sözleşmeler de damga vergisine tabidir." },
      { q: "Damga vergisinden muaf belgeler var mı?", a: "Evet. Eğitim ve sağlık kurumlarının bazı belgeleri, kredi sözleşmelerinin bazı türleri ve devlet ihale kanunu kapsamındaki belgeler muafiyet kapsamında olabilir." },
    ],
  },

  "tasit-kredisi": {
    what: `Taşıt kredisi, sıfır veya ikinci el araç satın almak isteyen bireylerin bankalardan kullandığı, araç üzerine rehin tesis edilen bir tüketici kredisidir.`,
    how: `Hesaplama eşit taksit formülüyle yapılır. Anapara, faiz oranı ve vade girilerek aylık taksit bulunur. Araç yaşına göre kredi/değer oranı değişir: sıfır araçlarda %80'e, ikinci elde %70'e kadar finansman sağlanır.`,
    why: `Araç alımında toplam sahiplik maliyetini (kredi + kasko + MTV + yakıt) önceden bilmek, bütçe planlaması ve doğru araç seçimi için kritiktir.`,
    faq: [
      { q: "İkinci el araç kredisinde faiz daha yüksek mi?", a: "Genellikle evet. İkinci el araç kredilerinde faiz oranları sıfır araç kampanyalarına göre %1-3 puan daha yüksek olabilir." },
      { q: "Araç yaşı sınırı var mı?", a: "Bankalar genellikle vade sonunda araç yaşının 10'u aşmamasını şart koşar." },
      { q: "Taşıt kredisinde kasko zorunlu mu?", a: "Evet. Kredi süresince araç üzerinde tam kasko sigortası bulundurulması bankalar tarafından zorunlu tutulur." },
    ],
  },

  "kredi-karti-asgari": {
    what: `Kredi kartı asgari ödeme hesaplama, kart borcunuzun tamamını ödeyemediğinizde bankaya yapmanız gereken minimum ödeme tutarını ve bu durumda oluşacak faiz yükünü gösteren bir finansal araçtır.`,
    how: `Asgari ödeme = Toplam Borç × Asgari Ödeme Oranı (genellikle %20-40). Kalan borç üzerine aylık akdi faiz + BSMV uygulanır. Aracımız kalan borcun kaç ayda kapanacağını ve toplam faiz maliyetini hesaplar.`,
    why: `Yalnızca asgari ödeme yapmak, borcun katlanarak büyümesine neden olur. 10.000 TL'lik bir borç, sadece asgari ödemeyle kapatıldığında toplam maliyet 15.000-20.000 TL'yi aşabilir.`,
    faq: [
      { q: "Asgari ödeme yapmazsam ne olur?", a: "Gecikme faizi uygulanır, kredi notunuz düşer ve yasal takip süreci başlayabilir." },
      { q: "Asgari ödeme oranı tüm bankalarda aynı mı?", a: "Hayır. BDDK düzenlemesiyle minimum %20 olarak belirlenmiştir ancak bankalar daha yüksek oran uygulayabilir." },
      { q: "Taksitli harcamalar asgari ödemeye dahil mi?", a: "Evet. O ay vadesi gelen taksit tutarları asgari ödeme hesabına dahil edilir." },
    ],
  },

  "repo": {
    what: `Repo, yatırımcının elindeki devlet tahvilini belirli bir süre için bankaya satıp, vade sonunda geri almayı taahhüt ettiği kısa vadeli bir yatırım aracıdır. Gecelik veya vadeli olarak işlem görür.`,
    how: `Repo Getirisi = Anapara × (Repo Faizi / 365) × Gün Sayısı × (1 - Stopaj Oranı). Stopaj oranı %15'tir. Aracımız brüt ve net getiriyi ayrı ayrı hesaplar.`,
    why: `Repo, 1 günlük bile olsa atıl paranızı değerlendirmenin en güvenli yollarından biridir. Özellikle kurumsal yatırımcılar nakit yönetiminde repo işlemlerini yoğun olarak kullanır.`,
    faq: [
      { q: "Repo ile vadeli mevduat arasındaki fark nedir?", a: "Repo devlet tahviline dayalıdır ve genellikle daha kısa vadelidir. Vadeli mevduat ise bankaya emanet edilen paradır." },
      { q: "Repo güvenli mi?", a: "Evet. Repoda teminat devlet iç borçlanma senetleridir ve Takasbank güvencesi altındadır." },
      { q: "Minimum repo tutarı var mı?", a: "Bankaya göre değişmekle birlikte genellikle 1.000-10.000 TL minimum tutar uygulanır." },
    ],
  },

  "temettu": {
    what: `Temettü (kâr payı) hesaplama, hisse senedi yatırımcısının sahip olduğu hisselerden elde edeceği yıllık kâr payı getirisini ve temettü verimini analiz eden bir finansal araçtır.`,
    how: `Temettü Verimi = (Hisse Başına Temettü / Hisse Fiyatı) × 100. Toplam Getiri = Sahip Olunan Lot × Hisse Başına Temettü. Stopaj (%10) düşülerek net temettü geliri hesaplanır.`,
    why: `Temettü verimi, hisse senedi seçiminde önemli bir kriterdir. Yüksek temettü veren şirketler, düzenli gelir arayan yatırımcılar için cazip olabilir.`,
    faq: [
      { q: "Temettü her yıl ödenir mi?", a: "Zorunlu değildir. Şirketin kâr etmesi ve genel kurulun dağıtım kararı alması gerekir." },
      { q: "Temettü gelirinden vergi kesilir mi?", a: "Evet. Hisse senedi temettü gelirinden %10 oranında stopaj kesilir." },
      { q: "Temettü tarihinde hisse almak yeterli mi?", a: "Hayır. Temettü hakkı, son işlem gününde hisseye sahip olanlara aittir. Bu tarihten sonra hisse fiyatı temettü kadar düşer." },
    ],
  },

  "aof-harf-notu": {
    what: `AÖF harf notu hesaplama, Açıköğretim Fakültesi öğrencilerinin vize ve final sınavı notlarından yola çıkarak bağıl değerlendirme (çan eğrisi) sonucunda alacakları tahmini harf notunu gösteren bir eğitim aracıdır.`,
    how: `Ham puan = (Vize × 0,30) + (Final × 0,70). Bu ham puan, sınıf ortalaması ve standart sapma kullanılarak bağıl değerlendirmeye tabi tutulur. Aracımız farklı senaryo ortalamaları ile AA'dan FF'ye kadar tahmini harf notunu gösterir.`,
    why: `AÖF'te bağıl değerlendirme sistemi nedeniyle aynı ham puan farklı dönemlerde farklı harf notuna karşılık gelebilir. Önceden simülasyon yapmak, final hedefini belirlemeye yardımcı olur.`,
    faq: [
      { q: "AÖF'te geçme notu kaçtır?", a: "DD ve üzeri harf notu alan öğrenciler dersi geçmiş sayılır. Ancak mezuniyet için genel ortalama en az 2.0 olmalıdır." },
      { q: "Büt sınavı notu nasıl hesaplanır?", a: "Bütünleme sınavında alınan not, final notu yerine geçer. Vize ağırlığı değişmez." },
      { q: "Çan eğrisi her ders için aynı mı?", a: "Hayır. Her dersin sınıf ortalaması ve standart sapması farklıdır, bu nedenle çan eğrisi de değişir." },
    ],
  },

  "universite-not-ortalamasi": {
    what: `Üniversite not ortalaması (GANO) hesaplama, tüm dönemlerde alınan harf notlarını ve AKTS/kredi bilgilerini kullanarak kümülatif ağırlıklı genel not ortalamasını bulan bir akademik araçtır.`,
    how: `GANO = Σ(Harf Notu Katsayısı × AKTS) / Σ(AKTS). AA=4.0, BA=3.5, BB=3.0, CB=2.5, CC=2.0, DC=1.5, DD=1.0, FF=0.0. Aracımız sınırsız ders eklemenize ve dönem bazlı ayrıştırmaya imkân tanır.`,
    why: `GANO; onur/yüksek onur derecesi, burs hakları, yatay geçiş başvuruları ve lisansüstü programlara kabul süreçlerinde en temel değerlendirme kriteridir.`,
    faq: [
      { q: "3.0 GANO ile onur belgesi alabilir miyim?", a: "Çoğu üniversitede 3.0-3.49 arası onur, 3.5 ve üzeri yüksek onur belgesi verilir. Ancak her üniversitenin kendi kriterleri vardır." },
      { q: "Tekrar alınan derste eski not silinir mi?", a: "Evet. Çoğu üniversitede tekrar edilen derste yeni not eski notun yerine geçer ve GANO buna göre yeniden hesaplanır." },
      { q: "AKTS ile kredi arasındaki fark nedir?", a: "AKTS (Avrupa Kredi Transfer Sistemi) öğrencinin toplam iş yükünü ölçer. Yerel kredi ise genellikle haftalık ders saatine dayanır." },
    ],
  },

  "ne-zaman-emekli-olurum": {
    what: `Emeklilik hesaplama, SGK'ya tabi çalışanların yaş, prim gün sayısı ve sigorta başlangıç tarihine göre en erken emeklilik tarihini belirleyen bir muhasebe aracıdır. EYT (Emeklilikte Yaşa Takılanlar) düzenlemesi de dahil edilir.`,
    how: `Emeklilik şartları üç kriteri birlikte sağlamayı gerektirir: (1) Yaş şartı, (2) Minimum prim gün sayısı (7200 veya 9000 gün), (3) Minimum sigortalılık süresi (20-25 yıl). Aracımız bu üç koşulu birlikte değerlendirerek en erken emeklilik tarihinizi hesaplar.`,
    why: `Emeklilik planlaması, kariyer ve finansal kararları doğrudan etkiler. Kalan prim gün sayısını ve beklenen emeklilik tarihini bilmek, ek isteğe bağlı prim ödeme stratejisi geliştirmenize olanak tanır.`,
    faq: [
      { q: "EYT'den nasıl yararlanabilirim?", a: "9 Eylül 1999 öncesi sigorta başlangıcı olan ve yaş şartını sağlayan kişiler EYT kapsamında başvurabilir." },
      { q: "Prim gün sayımı nereden öğrenebilirim?", a: "e-Devlet üzerinden SGK hizmet dökümü sorgulayarak toplam prim gün sayınızı öğrenebilirsiniz." },
      { q: "Askerlik borçlanması emekliliği öne çeker mi?", a: "Evet. Askerlik süresini SGK'ya borçlanarak prim gün sayınıza ekleyebilir ve emeklilik tarihinizi öne çekebilirsiniz." },
    ],
  },

  "doviz-altin-hesaplama": {
    what: `Döviz ve altın hesaplama, güncel piyasa kurlarını kullanarak TL ile Dolar, Euro ve çeşitli altın birimleri (Gram, Çeyrek, Yarım, Tam) arasında anlık dönüşüm yapan bir finans aracıdır.`,
    how: `Dönüşüm formülü: TL Karşılığı = Miktar × Güncel Kur. Altın için gram fiyatı baz alınır ve çeyrek (1,75 gr), yarım (3,5 gr), tam (7 gr) altın ağırlıklarıyla çarpılır. Aracımız alış ve satış fiyatlarını ayrı gösterir.`,
    why: `Döviz ve altın fiyatları sürekli değiştiğinden, anlık hesaplama yapabilmek tasarruf, yatırım ve alışveriş kararlarında doğru bilgiye ulaşmanın en hızlı yoludur.`,
    faq: [
      { q: "Gram altın ile çeyrek altın arasındaki fark nedir?", a: "Gram altın 1 gram saf altındır. Çeyrek altın ise 1,75 gram ağırlığında ve %91,6 saflıkta darphane basımı altındır. İşçilik farkı nedeniyle çeyrek altın gram fiyatının üzerindedir." },
      { q: "Döviz alış ve satış fiyatı neden farklı?", a: "Aradaki fark (spread) bankanın veya döviz bürosunun kâr marjıdır. Alış fiyatı her zaman satış fiyatından düşüktür." },
      { q: "En uygun kur nereden bulunur?", a: "Bankalar, döviz büroları ve dijital platformlar arasında kur farkları olabilir. Karşılaştırmalı arama yapmanız önerilir." },
    ],
  },
};

export function getGuideBySlug(slug: string): GuideSection | null {
  return calculatorGuides[slug] ?? null;
}
