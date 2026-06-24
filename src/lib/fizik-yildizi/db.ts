'use client';
import { supabase } from './supabase';

export interface Kullanici {
  id: string;
  ad: string;
  soyad: string;
  email: string;
  sifre: string;
  rol: 'ogrenci' | 'ogretmen' | 'veli';
  sinif?: number;
  okulNo?: string;
  okulIsmi?: string;
  ogretmenId?: string;
  ogretmenAdi?: string;
  onayDurumu?: 'bekliyor' | 'onaylandi' | 'reddedildi' | 'none';
  okulAdi?: string;
  brans?: string;
  kayitTarihi: string;
  avatarRenk?: string;
  profilResmi?: string;
  rozetler?: string;
  veliKodu?: string;
  bagliOgrenciId?: string;
  toplamXp?: number;
  lig?: string;
  envanter?: any;
}

export interface AtananTest {
  id: string;
  ogretmenId: string;
  sinif: number;
  konuId: string;
  konuBaslik: string;
  aciklama?: string;
  soruSayisi?: number;
  sure?: number;
  tarih: string;
  sonTarih: string;
}

export interface DersIcerigi {
  id: string;
  ogretmenId: string;
  ogretmenAdi?: string;
  sinif: number;
  baslik: string;
  aciklama: string;
  dosyaAdi: string;
  dosyaIcerik: string;
  dosyaBoyutu?: string;
  tarih: string;
}

export interface OgretmenBildirimi {
  id: string;
  ogretmenId: string;
  ogrenciId: string;
  ogrenciAd: string;
  ogrenciSoyad: string;
  ogrenciSinif: number;
  ogrenciNo: string;
  okulIsmi: string;
  tarih: string;
  okundu: boolean;
  onayDurumu: 'bekliyor' | 'onaylandi' | 'reddedildi';
}

// --- CORE DATA FETCHING ---

export const syncWithServer = async (): Promise<void> => {};

export const getKullanicilar = async (): Promise<Kullanici[]> => {
  const { data } = await supabase.from('kullanicilar').select('*');
  return data || [];
};

export const getOgretmenler = async (): Promise<Kullanici[]> => {
  const { data } = await supabase.from('kullanicilar').select('*').eq('rol', 'ogretmen');
  return data || [];
};

export const getOgretmenOgrencileri = async (ogretmenId: string): Promise<Kullanici[]> => {
  const { data } = await supabase.from('kullanicilar').select('*').eq('rol', 'ogrenci').eq('ogretmenId', ogretmenId);
  return data || [];
};

export const getOnayBekleyenOgrenciler = async (ogretmenId: string): Promise<Kullanici[]> => {
  const { data } = await supabase.from('kullanicilar').select('*').eq('rol', 'ogrenci').eq('ogretmenId', ogretmenId).eq('onayDurumu', 'bekliyor');
  return data || [];
};

export const getOnayliOgrenciler = async (ogretmenId: string): Promise<Kullanici[]> => {
  const { data } = await supabase.from('kullanicilar').select('*').eq('rol', 'ogrenci').eq('ogretmenId', ogretmenId).eq('onayDurumu', 'onaylandi');
  return data || [];
};

// --- CORE DATA MUTATION ---

export const saveKullanici = async (kullanici: Kullanici): Promise<boolean> => {
  // Automatically bind student to teacher if name matches
  if (kullanici.rol === 'ogretmen') {
    const teacherName = `${kullanici.ad} ${kullanici.soyad}`.toLowerCase().trim();
    const students = await getKullanicilar();
    for (const u of students) {
      if (u.rol === 'ogrenci' && !u.ogretmenId && u.ogretmenAdi && u.ogretmenAdi.toLowerCase().trim() === teacherName) {
        await supabase.from('kullanicilar').update({ ogretmenId: kullanici.id, onayDurumu: 'bekliyor' }).eq('id', u.id);
        const bId = crypto.randomUUID();
        await saveOgretmenBildirimi({
          id: bId, ogretmenId: kullanici.id, ogrenciId: u.id, ogrenciAd: u.ad, ogrenciSoyad: u.soyad,
          ogrenciSinif: u.sinif || 9, ogrenciNo: u.okulNo || '', okulIsmi: u.okulIsmi || u.okulAdi || '',
          tarih: new Date().toISOString(), okundu: false, onayDurumu: 'bekliyor'
        });
      }
    }
  } else if (kullanici.rol === 'ogrenci') {
    if (!kullanici.ogretmenId && kullanici.ogretmenAdi) {
      const studentTeacherName = kullanici.ogretmenAdi.toLowerCase().trim();
      const teachers = await getOgretmenler();
      const foundTeacher = teachers.find(t => `${t.ad} ${t.soyad}`.toLowerCase().trim() === studentTeacherName);
      if (foundTeacher) {
        kullanici.ogretmenId = foundTeacher.id;
        kullanici.onayDurumu = 'bekliyor';
      }
    }

    if (kullanici.ogretmenId && kullanici.onayDurumu === 'bekliyor') {
      const bId = crypto.randomUUID();
      await saveOgretmenBildirimi({
        id: bId, ogretmenId: kullanici.ogretmenId, ogrenciId: kullanici.id, ogrenciAd: kullanici.ad, ogrenciSoyad: kullanici.soyad,
        ogrenciSinif: kullanici.sinif || 9, ogrenciNo: kullanici.okulNo || '', okulIsmi: kullanici.okulIsmi || kullanici.okulAdi || '',
        tarih: new Date().toISOString(), okundu: false, onayDurumu: 'bekliyor'
      });
    }
  }

  const dbKullanici = { ...kullanici };
  if (dbKullanici.rozetler) dbKullanici.rozetler = JSON.stringify(dbKullanici.rozetler) as any;
  if (dbKullanici.envanter) dbKullanici.envanter = JSON.stringify(dbKullanici.envanter) as any;

  const { error } = await supabase.from('kullanicilar').upsert(dbKullanici);
  if (error) {
    console.error('saveKullanici Error:', error);
    return false;
  }
  return true;
};

export const ogrenciOnayla = async (ogrenciId: string) => {
  await supabase.from('kullanicilar').update({ onayDurumu: 'onaylandi' }).eq('id', ogrenciId);
};

export const ogrenciReddet = async (ogrenciId: string) => {
  await supabase.from('kullanicilar').update({ onayDurumu: 'reddedildi', ogretmenId: null, ogretmenAdi: null }).eq('id', ogrenciId);
};

export const kullaniciSil = async (kullaniciId: string) => {
  await supabase.from('kullanicilar').delete().eq('id', kullaniciId);
};

// --- BILDIRIMLER ---

export const getOgretmenBildirimleri = async (ogretmenId: string): Promise<OgretmenBildirimi[]> => {
  const { data } = await supabase.from('bildirimler').select('*').eq('ogretmenId', ogretmenId);
  return (data || []).map(b => ({ ...b, okundu: b.okundu === 1 || b.okundu === true }));
};

export const saveOgretmenBildirimi = async (bildirim: OgretmenBildirimi) => {
  await supabase.from('bildirimler').upsert({ ...bildirim, okundu: bildirim.okundu ? 1 : 0 });
};

export const bildirimOnayla = async (bildirimId: string) => {
  const { data } = await supabase.from('bildirimler').select('ogrenciId').eq('id', bildirimId).single();
  if (data) {
    await supabase.from('bildirimler').update({ onayDurumu: 'onaylandi', okundu: 1 }).eq('id', bildirimId);
    await ogrenciOnayla(data.ogrenciId);
  }
};

export const bildirimReddet = async (bildirimId: string) => {
  const { data } = await supabase.from('bildirimler').select('ogrenciId').eq('id', bildirimId).single();
  if (data) {
    await supabase.from('bildirimler').update({ onayDurumu: 'reddedildi', okundu: 1 }).eq('id', bildirimId);
    await ogrenciReddet(data.ogrenciId);
  }
};

// --- TEST ASSIGNMENTS ---

export const getAtananTestler = async (): Promise<AtananTest[]> => {
  const { data } = await supabase.from('atanan_testler').select('*');
  return data || [];
};

export const saveAtananTest = async (test: AtananTest) => {
  await supabase.from('atanan_testler').upsert(test);
};

export const deleteAtananTest = async (id: string) => {
  await supabase.from('atanan_testler').delete().eq('id', id);
};

// --- DERS ICERIKLERI ---

export const getDersIcerikleri = async (): Promise<DersIcerigi[]> => {
  const { data } = await supabase.from('ders_icerikleri').select('*');
  return data || [];
};

export const saveDersIcerigi = async (icerik: DersIcerigi) => {
  await supabase.from('ders_icerikleri').upsert(icerik);
};

export const deleteDersIcerigi = async (id: string) => {
  await supabase.from('ders_icerikleri').delete().eq('id', id);
};

// --- TEST SONUCLARI ---

export const saveTestSonucu = async (sonuc: any) => {
  await supabase.from('test_sonuclari').upsert(sonuc);
};

export const saveTestGecmisi = async (ogrenciId: string, soruId: string, dogruMu: boolean) => {
  await supabase.from('test_gecmisi').upsert({ ogrenciId, soruId, dogruMu: dogruMu ? 1 : 0 });
};

// --- FORUM & LIG ---

export const saveTartis = async (tartis: any) => {
  await supabase.from('sinif_tartismalar').upsert(tartis);
};

export const saveCevap = async (cevap: any) => {
  await supabase.from('sinif_cevaplar').upsert(cevap);
};

export const upvoteCevap = async (tartisId: string, cevapId: string) => {
  const { data: cevap } = await supabase.from('sinif_cevaplar').select('begeniler').eq('id', cevapId).single();
  if (cevap) {
    await supabase.from('sinif_cevaplar').update({ begeniler: (cevap.begeniler || 0) + 1 }).eq('id', cevapId);
  }
};

export const upgradeToPremium = async (ogrenciId: string) => {
  await supabase.from('kullanicilar').update({ uyelikTipi: 'premium' }).eq('id', ogrenciId);
};

export const addXp = async (ogrenciId: string, xp: number) => {
  const { data: k } = await supabase.from('kullanicilar').select('toplamXp').eq('id', ogrenciId).single();
  if (k) {
    await supabase.from('kullanicilar').update({ toplamXp: (k.toplamXp || 0) + xp }).eq('id', ogrenciId);
  }
};

export const addRozet = async (ogrenciId: string, rozetId: string, baslik: string, ikon: string) => {
  const { data: k } = await supabase.from('kullanicilar').select('rozetler').eq('id', ogrenciId).single();
  if (k) {
    const rozetler = typeof k.rozetler === 'string' ? JSON.parse(k.rozetler) : (k.rozetler || []);
    if (!rozetler.find((r: any) => r.id === rozetId)) {
      rozetler.push({ id: rozetId, baslik, ikon, tarih: new Date().toISOString() });
      await supabase.from('kullanicilar').update({ rozetler: JSON.stringify(rozetler) }).eq('id', ogrenciId);
    }
  }
};

export const updateXp = async (ogrenciId: string, xpEkle: number) => {
  const { data: k } = await supabase.from('kullanicilar').select('toplamXp').eq('id', ogrenciId).single();
  if (k) {
    const newXp = (k.toplamXp || 0) + xpEkle;
    const lig = newXp >= 10000 ? 'Yıldızlar' : newXp >= 5000 ? 'Platin' : newXp >= 2000 ? 'Altın' : newXp >= 500 ? 'Gümüş' : 'Bronz';
    await supabase.from('kullanicilar').update({ toplamXp: newXp, lig }).eq('id', ogrenciId);
  }
};

export const generateVerifyCode = async (email: string): Promise<string | null> => {
  const kod = Math.floor(100000 + Math.random() * 900000).toString();
  await supabase.from('kullanicilar').update({ dogrulamaKodu: kod }).eq('email', email.toLowerCase().trim());
  
  try {
    fetch('/api/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        subject: 'Fizik Yıldızı - Doğrulama Kodun',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px; background: #fafafa;">
            <h2 style="color: #4f46e5; text-align: center;">Fizik Yıldızı'na Hoş Geldin! 🚀</h2>
            <p style="color: #333; font-size: 16px;">E-posta adresini doğrulamak için aşağıdaki kodu kullanabilirsin:</p>
            <div style="background: #e0e7ff; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; color: #4338ca; border-radius: 8px; margin: 20px 0;">
              ${kod}
            </div>
            <p style="color: #666; font-size: 14px; text-align: center;">Kodu girerek platformu kullanmaya başlayabilirsin.</p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
            <p style="color: #999; font-size: 12px; text-align: center;">Eğer bu kaydı sen yapmadıysan, lütfen bu e-postayı dikkate alma.</p>
          </div>
        `
      })
    });
  } catch (e) {
    console.error('Failed to dispatch email from db:', e);
  }

  return kod;
};

export const verifyEmailCode = async (email: string, kod: string): Promise<boolean> => {
  const { data } = await supabase.from('kullanicilar').select('dogrulamaKodu').eq('email', email.toLowerCase().trim()).single();
  if (data && data.dogrulamaKodu === kod) {
    await supabase.from('kullanicilar').update({ mailOnayli: 1, dogrulamaKodu: null }).eq('email', email.toLowerCase().trim());
    return true;
  }
  return false;
};
