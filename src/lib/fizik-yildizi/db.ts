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

// --- SUPABASE BACKGROUND SYNC UTILITY ---
const postToSupabase = async (action: string, data: any) => {
  if (typeof window === 'undefined') return;
  try {
    switch (action) {
      case 'saveKullanici':
        await supabase.from('kullanicilar').upsert(data);
        break;
      case 'kullaniciSil':
        await supabase.from('kullanicilar').delete().eq('id', data.id);
        break;
      case 'saveBildirim':
        await supabase.from('bildirimler').upsert(data);
        break;
      case 'bildirimOnayla':
      case 'bildirimReddet':
        // Zaten client tarafında okundu ve onayDurumu güncellenip saveBildirim çağrılıyor. 
        // Ekstra bir işlem gerekmeyebilir ama garanti olsun diye update geçebiliriz:
        await supabase.from('bildirimler').update({ okundu: 1, onayDurumu: data.onayDurumu }).eq('id', data.id);
        break;
      case 'saveAtananTest':
        await supabase.from('atanan_testler').upsert(data);
        break;
      case 'deleteAtananTest':
        await supabase.from('atanan_testler').delete().eq('id', data.id);
        break;
      case 'saveDersIcerigi':
        await supabase.from('ders_icerikleri').upsert(data);
        break;
      case 'deleteDersIcerigi':
        await supabase.from('ders_icerikleri').delete().eq('id', data.id);
        break;
      case 'saveTestSonucu':
        await supabase.from('test_sonuclari').upsert(data);
        break;
      case 'saveTestGecmisi':
        await supabase.from('test_gecmisi').upsert({
          ogrenciId: data.ogrenciId,
          soruId: data.soruId,
          dogruMu: data.dogruMu ? 1 : 0
        });
        break;
      case 'saveTartis':
        await supabase.from('sinif_tartismalar').upsert(data);
        break;
      case 'saveCevap':
        await supabase.from('sinif_cevaplar').upsert(data);
        break;
      case 'upvoteCevap': {
        const { data: cevap } = await supabase.from('sinif_cevaplar').select('begeniler').eq('id', data.cevapId).single();
        if (cevap) {
          await supabase.from('sinif_cevaplar').update({ begeniler: (cevap.begeniler || 0) + 1 }).eq('id', data.cevapId);
        }
        break;
      }
      case 'upgradeToPremium':
        await supabase.from('kullanicilar').update({ uyelikTipi: 'premium' }).eq('id', data.ogrenciId);
        break;
      case 'addRozet':
      case 'updateXp': {
        // Since localstorage is already updated, we can just upsert the whole user profile or just the specific fields.
        // It's safer to get the fresh local user and upsert it:
        const userStr = localStorage.getItem('fizik_kullanici');
        if (userStr) {
          const u = JSON.parse(userStr);
          await supabase.from('kullanicilar').update({ 
            toplamXp: u.toplamXp, 
            lig: u.lig, 
            rozetler: JSON.stringify(u.rozetler) 
          }).eq('id', data.ogrenciId);
        }
        break;
      }
    }
  } catch (err) {
    console.error(`Failed to sync action ${action} to Supabase:`, err);
  }
};

// --- SYNCHRONIZATION FUNCTION FOR DASHBOARD MOUNTING ---
export const syncWithServer = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  try {
    const { data: kullanicilar } = await supabase.from('kullanicilar').select('*');
    const { data: bildirimler } = await supabase.from('bildirimler').select('*');
    const { data: atananTestler } = await supabase.from('atanan_testler').select('*');
    const { data: dersIcerikleri } = await supabase.from('ders_icerikleri').select('*');
    const { data: testSonuclari } = await supabase.from('test_sonuclari').select('*');
    const { data: sinifTartismalari } = await supabase.from('sinif_tartismalar').select('*');
    const { data: testGecmisi } = await supabase.from('test_gecmisi').select('*');

    if (kullanicilar) {
      // Parse JSON fields back
      const parsedKullanicilar = kullanicilar.map(k => ({
        ...k,
        rozetler: typeof k.rozetler === 'string' ? JSON.parse(k.rozetler) : k.rozetler,
        envanter: typeof k.envanter === 'string' ? JSON.parse(k.envanter) : k.envanter,
      }));
      localStorage.setItem('fizik_kullanicilar', JSON.stringify(parsedKullanicilar));
    }
    
    if (bildirimler) {
      const parsedBildirimler = bildirimler.map(b => ({ ...b, okundu: b.okundu === 1 || b.okundu === true }));
      localStorage.setItem('fizik_ogretmen_bildirimleri', JSON.stringify(parsedBildirimler));
    }

    if (atananTestler) localStorage.setItem('fizik_atanan_testler', JSON.stringify(atananTestler));
    if (dersIcerikleri) localStorage.setItem('fizik_ders_icerikleri', JSON.stringify(dersIcerikleri));
    if (testSonuclari) localStorage.setItem('fizik_test_sonuclari', JSON.stringify(testSonuclari));
    if (sinifTartismalari) localStorage.setItem('fizik_sinif_tartismalar', JSON.stringify(sinifTartismalari));

    if (testGecmisi) {
      const gecmisMap: Record<string, Record<string, boolean>> = {};
      testGecmisi.forEach((g: any) => {
        if (!gecmisMap[g.ogrenciId]) gecmisMap[g.ogrenciId] = {};
        gecmisMap[g.ogrenciId][g.soruId] = g.dogruMu === 1 || g.dogruMu === true;
      });
      localStorage.setItem('fizik_test_gecmisi', JSON.stringify(gecmisMap));
    }

    // Synchronize the logged-in session profile as well
    const activeSessionStr = localStorage.getItem('fizik_kullanici');
    if (activeSessionStr && kullanicilar) {
      const sessionUser = JSON.parse(activeSessionStr);
      const freshUser = kullanicilar.find((u: any) => u.id === sessionUser.id);
      if (freshUser) {
        freshUser.rozetler = typeof freshUser.rozetler === 'string' ? JSON.parse(freshUser.rozetler) : freshUser.rozetler;
        freshUser.envanter = typeof freshUser.envanter === 'string' ? JSON.parse(freshUser.envanter) : freshUser.envanter;
        if (JSON.stringify(freshUser) !== JSON.stringify(sessionUser)) {
          localStorage.setItem('fizik_kullanici', JSON.stringify(freshUser));
        }
      }
    }
    return true;
  } catch (e) {
    console.error('Failed to sync state with Supabase database:', e);
    return false;
  }
};

// --- DATA ACCESS METHODS (Uses LocalStorage and syncs to Supabase) ---

export const getOgretmenBildirimleri = (ogretmenId: string): OgretmenBildirimi[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('fizik_ogretmen_bildirimleri');
  return stored ? JSON.parse(stored).filter((b: OgretmenBildirimi) => b.ogretmenId === ogretmenId) : [];
};

export const saveOgretmenBildirimleri = (bildirimler: OgretmenBildirimi[]) => {
  localStorage.setItem('fizik_ogretmen_bildirimleri', JSON.stringify(bildirimler));
};

export const saveOgretmenBildirimi = (bildirim: OgretmenBildirimi) => {
  if (typeof window === 'undefined') return;
  const stored = localStorage.getItem('fizik_ogretmen_bildirimleri');
  const bildirimler: OgretmenBildirimi[] = stored ? JSON.parse(stored) : [];
  const index = bildirimler.findIndex(b => b.id === bildirim.id);
  if (index !== -1) bildirimler[index] = bildirim;
  else bildirimler.push(bildirim);
  
  saveOgretmenBildirimleri(bildirimler);
  postToSupabase('saveBildirim', { ...bildirim, okundu: bildirim.okundu ? 1 : 0 });
};

export const getKullanicilar = (): Kullanici[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('fizik_kullanicilar');
  if (!stored) {
    localStorage.setItem('fizik_kullanicilar', JSON.stringify([]));
    return [];
  }
  try { return JSON.parse(stored); } catch { return []; }
};

export const saveKullanici = (kullanici: Kullanici) => {
  const kullanicilar = getKullanicilar();

  if (kullanici.rol === 'ogretmen') {
    const teacherName = `${kullanici.ad} ${kullanici.soyad}`.toLowerCase().trim();
    kullanicilar.forEach(u => {
      if (u.rol === 'ogrenci' && !u.ogretmenId && u.ogretmenAdi) {
        if (u.ogretmenAdi.toLowerCase().trim() === teacherName) {
          u.ogretmenId = kullanici.id;
          u.onayDurumu = 'bekliyor';
          
          const bId = `notif_${u.id}_${kullanici.id}`;
          const newNotif: OgretmenBildirimi = {
            id: bId,
            ogretmenId: kullanici.id,
            ogrenciId: u.id,
            ogrenciAd: u.ad,
            ogrenciSoyad: u.soyad,
            ogrenciSinif: u.sinif || 9,
            ogrenciNo: u.okulNo || '',
            okulIsmi: u.okulIsmi || u.okulAdi || '',
            tarih: new Date().toISOString(),
            okundu: false,
            onayDurumu: 'bekliyor'
          };
          saveOgretmenBildirimi(newNotif);
        }
      }
    });
  } else if (kullanici.rol === 'ogrenci') {
    if (!kullanici.ogretmenId && kullanici.ogretmenAdi) {
      const studentTeacherName = kullanici.ogretmenAdi.toLowerCase().trim();
      const teachers = kullanicilar.filter(u => u.rol === 'ogretmen');
      const foundTeacher = teachers.find(t => `${t.ad} ${t.soyad}`.toLowerCase().trim() === studentTeacherName);
      if (foundTeacher) {
        kullanici.ogretmenId = foundTeacher.id;
        kullanici.onayDurumu = 'bekliyor';
      }
    }

    if (kullanici.ogretmenId && kullanici.onayDurumu === 'bekliyor') {
      const bId = `notif_${kullanici.id}_${kullanici.ogretmenId}`;
      const newNotif: OgretmenBildirimi = {
        id: bId,
        ogretmenId: kullanici.ogretmenId,
        ogrenciId: kullanici.id,
        ogrenciAd: kullanici.ad,
        ogrenciSoyad: kullanici.soyad,
        ogrenciSinif: kullanici.sinif || 9,
        ogrenciNo: kullanici.okulNo || '',
        okulIsmi: kullanici.okulIsmi || kullanici.okulAdi || '',
        tarih: new Date().toISOString(),
        okundu: false,
        onayDurumu: 'bekliyor'
      };
      saveOgretmenBildirimi(newNotif);
    }
  }

  const index = kullanicilar.findIndex(u => u.id === kullanici.id);
  if (index !== -1) kullanicilar[index] = kullanici;
  else kullanicilar.push(kullanici);
  
  localStorage.setItem('fizik_kullanicilar', JSON.stringify(kullanicilar));
  
  // Convert rozetler/envanter objects to strings for Supabase JSONB
  const dbKullanici = { ...kullanici };
  if (dbKullanici.rozetler) dbKullanici.rozetler = JSON.stringify(dbKullanici.rozetler) as any;
  if (dbKullanici.envanter) dbKullanici.envanter = JSON.stringify(dbKullanici.envanter) as any;

  postToSupabase('saveKullanici', dbKullanici);
};

export const getOgretmenler = (): Kullanici[] => getKullanicilar().filter(u => u.rol === 'ogretmen');
export const getOgretmenOgrencileri = (ogretmenId: string): Kullanici[] => getKullanicilar().filter(u => u.rol === 'ogrenci' && u.ogretmenId === ogretmenId);
export const getOnayBekleyenOgrenciler = (ogretmenId: string): Kullanici[] => getKullanicilar().filter(u => u.rol === 'ogrenci' && u.ogretmenId === ogretmenId && u.onayDurumu === 'bekliyor');
export const getOnayliOgrenciler = (ogretmenId: string): Kullanici[] => getKullanicilar().filter(u => u.rol === 'ogrenci' && u.ogretmenId === ogretmenId && u.onayDurumu === 'onaylandi');

export const ogrenciOnayla = (ogrenciId: string) => {
  const kullanicilar = getKullanicilar();
  const index = kullanicilar.findIndex(u => u.id === ogrenciId);
  if (index !== -1) {
    kullanicilar[index].onayDurumu = 'onaylandi';
    localStorage.setItem('fizik_kullanicilar', JSON.stringify(kullanicilar));
    postToSupabase('saveKullanici', kullanicilar[index]);
  }
};

export const ogrenciReddet = (ogrenciId: string) => {
  const kullanicilar = getKullanicilar();
  const index = kullanicilar.findIndex(u => u.id === ogrenciId);
  if (index !== -1) {
    kullanicilar[index].onayDurumu = 'reddedildi';
    kullanicilar[index].ogretmenId = undefined;
    kullanicilar[index].ogretmenAdi = undefined;
    localStorage.setItem('fizik_kullanicilar', JSON.stringify(kullanicilar));
    postToSupabase('saveKullanici', kullanicilar[index]);
  }
};

export const kullaniciSil = (kullaniciId: string) => {
  if (typeof window === 'undefined') return;
  const kullanicilar = getKullanicilar();
  localStorage.setItem('fizik_kullanicilar', JSON.stringify(kullanicilar.filter(u => u.id !== kullaniciId)));

  const sonuclar = localStorage.getItem('fizik_test_sonuclari');
  if (sonuclar) {
    try { localStorage.setItem('fizik_test_sonuclari', JSON.stringify(JSON.parse(sonuclar).filter((r: any) => r && r.ogrenciId !== kullaniciId))); } catch (e) {}
  }

  const bildirimler = localStorage.getItem('fizik_ogretmen_bildirimleri');
  if (bildirimler) {
    try { localStorage.setItem('fizik_ogretmen_bildirimleri', JSON.stringify(JSON.parse(bildirimler).filter((b: any) => b && b.ogrenciId !== kullaniciId))); } catch (e) {}
  }
  
  postToSupabase('kullaniciSil', { id: kullaniciId });
};

export const bildirimOnayla = (bildirimId: string) => {
  if (typeof window === 'undefined') return;
  const stored = localStorage.getItem('fizik_ogretmen_bildirimleri');
  const bildirimler: OgretmenBildirimi[] = stored ? JSON.parse(stored) : [];
  const index = bildirimler.findIndex(b => b.id === bildirimId);
  if (index !== -1) {
    bildirimler[index].onayDurumu = 'onaylandi';
    bildirimler[index].okundu = true;
    saveOgretmenBildirimleri(bildirimler);
    ogrenciOnayla(bildirimler[index].ogrenciId);
    
    postToSupabase('bildirimOnayla', { id: bildirimId, onayDurumu: 'onaylandi' });
  }
};

export const bildirimReddet = (bildirimId: string) => {
  if (typeof window === 'undefined') return;
  const stored = localStorage.getItem('fizik_ogretmen_bildirimleri');
  const bildirimler: OgretmenBildirimi[] = stored ? JSON.parse(stored) : [];
  const index = bildirimler.findIndex(b => b.id === bildirimId);
  if (index !== -1) {
    bildirimler[index].onayDurumu = 'reddedildi';
    bildirimler[index].okundu = true;
    saveOgretmenBildirimleri(bildirimler);
    ogrenciReddet(bildirimler[index].ogrenciId);

    postToSupabase('bildirimReddet', { id: bildirimId, onayDurumu: 'reddedildi' });
  }
};

// --- Test Assignment Helpers ---
export const getAtananTestler = (): AtananTest[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('fizik_atanan_testler');
  return stored ? JSON.parse(stored) : [];
};

export const saveAtananTest = (test: AtananTest) => {
  const testler = getAtananTestler();
  testler.push(test);
  localStorage.setItem('fizik_atanan_testler', JSON.stringify(testler));
  postToSupabase('saveAtananTest', test);
};

export const deleteAtananTest = (id: string) => {
  localStorage.setItem('fizik_atanan_testler', JSON.stringify(getAtananTestler().filter(t => t.id !== id)));
  postToSupabase('deleteAtananTest', { id });
};

// --- Content Sharing Helpers ---
export const getDersIcerikleri = (): DersIcerigi[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('fizik_ders_icerikleri');
  return stored ? JSON.parse(stored) : [];
};

export const saveDersIcerigi = (icerik: DersIcerigi) => {
  const icerikler = getDersIcerikleri();
  icerikler.push(icerik);
  localStorage.setItem('fizik_ders_icerikleri', JSON.stringify(icerikler));
  postToSupabase('saveDersIcerigi', icerik);
};

export const deleteDersIcerigi = (id: string) => {
  localStorage.setItem('fizik_ders_icerikleri', JSON.stringify(getDersIcerikleri().filter(i => i.id !== id)));
  postToSupabase('deleteDersIcerigi', { id });
};

// --- Test Result Sync Helpers ---
export const saveTestSonucu = (sonuc: any) => {
  if (typeof window === 'undefined') return;
  const mevcutSonuclar = JSON.parse(localStorage.getItem('fizik_test_sonuclari') || '[]');
  mevcutSonuclar.push(sonuc);
  localStorage.setItem('fizik_test_sonuclari', JSON.stringify(mevcutSonuclar));
  postToSupabase('saveTestSonucu', sonuc);
};

export const saveTestGecmisi = (ogrenciId: string, soruId: string, dogruMu: boolean) => {
  if (typeof window === 'undefined') return;
  const gecmis = JSON.parse(localStorage.getItem('fizik_test_gecmisi') || '{}');
  if (!gecmis[ogrenciId]) gecmis[ogrenciId] = {};
  gecmis[ogrenciId][soruId] = dogruMu;
  localStorage.setItem('fizik_test_gecmisi', JSON.stringify(gecmis));
  postToSupabase('saveTestGecmisi', { ogrenciId, soruId, dogruMu });
};

// --- Class Forum & League Helpers ---
export const saveTartis = (tartis: any) => {
  if (typeof window === 'undefined') return;
  const tartismalar = JSON.parse(localStorage.getItem('fizik_sinif_tartismalar') || '[]');
  tartismalar.unshift(tartis);
  localStorage.setItem('fizik_sinif_tartismalar', JSON.stringify(tartismalar));
  postToSupabase('saveTartis', tartis);
};

export const saveCevap = (cevap: any) => {
  if (typeof window === 'undefined') return;
  postToSupabase('saveCevap', cevap);
};

export const upvoteCevap = (tartisId: string, cevapId: string) => {
  postToSupabase('upvoteCevap', { tartisId, cevapId });
};

export const upgradeToPremium = (ogrenciId: string) => {
  postToSupabase('upgradeToPremium', { ogrenciId });
};

export const addXp = (ogrenciId: string, xp: number) => {
  postToSupabase('addXp', { ogrenciId, xp });
};

export const addRozet = (ogrenciId: string, rozetId: string, baslik: string, ikon: string) => {
  if (typeof window === 'undefined') return;
  const kData = localStorage.getItem('fizik_kullanici');
  if (kData) {
    const k = JSON.parse(kData);
    if (k.id === ogrenciId) {
      const rozetler = k.rozetler ? (typeof k.rozetler === 'string' ? JSON.parse(k.rozetler) : k.rozetler) : [];
      if (!rozetler.find((r: any) => r.id === rozetId)) {
        rozetler.push({ id: rozetId, baslik, ikon, tarih: new Date().toISOString() });
        k.rozetler = rozetler;
        localStorage.setItem('fizik_kullanici', JSON.stringify(k));
      }
    }
  }
  postToSupabase('addRozet', { ogrenciId, rozetId, baslik, ikon });
};

export const updateXp = (ogrenciId: string, xpEkle: number) => {
  if (typeof window === 'undefined') return;
  const kData = localStorage.getItem('fizik_kullanici');
  if (kData) {
    const k = JSON.parse(kData);
    if (k.id === ogrenciId) {
      k.toplamXp = (k.toplamXp || 0) + xpEkle;
      k.lig = k.toplamXp >= 10000 ? 'Yıldızlar' : k.toplamXp >= 5000 ? 'Platin' : k.toplamXp >= 2000 ? 'Altın' : k.toplamXp >= 500 ? 'Gümüş' : 'Bronz';
      localStorage.setItem('fizik_kullanici', JSON.stringify(k));
    }
  }
  postToSupabase('updateXp', { ogrenciId, xpEkle });
};

export const generateVerifyCode = async (email: string): Promise<string | null> => {
  // Can't reliably generate and send emails purely client-side without edge functions safely, 
  // but we can generate the code and save it to Supabase for the user.
  const kod = Math.floor(100000 + Math.random() * 900000).toString();
  await supabase.from('kullanicilar').update({ dogrulamaKodu: kod }).eq('email', email.toLowerCase().trim());
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
