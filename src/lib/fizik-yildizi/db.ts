'use client';

const API_URL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/fizik-yildizi` : "/api/fizik-yildizi";

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
}

export interface AtananTest {
  id: string;
  ogretmenId: string;
  sinif: number; // 9 | 10 | 11 | 12
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
  sinif: number; // 9 | 10 | 11 | 12
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


// --- BACKGROUND SYNC UTILITY ---
const postToApi = (action: string, data: any) => {
  if (typeof window === 'undefined') return;
  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, data })
  }).then(res => res.json())
    .then(resData => {
      if (!resData.success) {
        console.error(`Error in background API action ${action}:`, resData.error);
      }
    }).catch(err => {
      console.error(`Failed to sync action ${action} to server SQLite database:`, err);
    });
};

// --- SYNCHRONIZATION FUNCTION FOR DASHBOARD MOUNTING ---
export const syncWithServer = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('fizik_kullanicilar', JSON.stringify(data.kullanicilar));
      localStorage.setItem('fizik_ogretmen_bildirimleri', JSON.stringify(data.bildirimler));
      localStorage.setItem('fizik_atanan_testler', JSON.stringify(data.atananTestler));
      localStorage.setItem('fizik_ders_icerikleri', JSON.stringify(data.dersIcerikleri));
      localStorage.setItem('fizik_test_sonuclari', JSON.stringify(data.testSonuclari));
      if (data.sinifTartismalari) {
        localStorage.setItem('fizik_sinif_tartismalar', JSON.stringify(data.sinifTartismalari));
      }

      const gecmisMap: Record<string, Record<string, boolean>> = {};
      data.testGecmisi.forEach((g: any) => {
        if (!gecmisMap[g.ogrenciId]) gecmisMap[g.ogrenciId] = {};
        gecmisMap[g.ogrenciId][g.soruId] = g.dogruMu;
      });
      localStorage.setItem('fizik_test_gecmisi', JSON.stringify(gecmisMap));

      // Synchronize the logged-in session profile as well
      const activeSessionStr = localStorage.getItem('fizik_kullanici');
      if (activeSessionStr) {
        const sessionUser = JSON.parse(activeSessionStr);
        const freshUser = data.kullanicilar.find((u: any) => u.id === sessionUser.id);
        if (freshUser && JSON.stringify(freshUser) !== JSON.stringify(sessionUser)) {
          localStorage.setItem('fizik_kullanici', JSON.stringify(freshUser));
        }
      }
      return true;
    }
    return false;
  } catch (e) {
    console.error('Failed to sync state with server database:', e);
    return false;
  }
};

// --- DATA ACCESS METHODS ---

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
  if (index !== -1) {
    bildirimler[index] = bildirim;
  } else {
    bildirimler.push(bildirim);
  }
  saveOgretmenBildirimleri(bildirimler);
  postToApi('saveBildirim', bildirim);
};

export const getKullanicilar = (): Kullanici[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('fizik_kullanicilar');
  let users: Kullanici[];
  if (!stored) {
    users = [];
    localStorage.setItem('fizik_kullanicilar', JSON.stringify([]));
  } else {
    try {
      users = JSON.parse(stored);
    } catch {
      users = [];
    }
  }

  return users;
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
  if (index !== -1) {
    kullanicilar[index] = kullanici;
  } else {
    kullanicilar.push(kullanici);
  }
  localStorage.setItem('fizik_kullanicilar', JSON.stringify(kullanicilar));
  
  postToApi('saveKullanici', kullanici);
};

export const getOgretmenler = (): Kullanici[] => {
  return getKullanicilar().filter(u => u.rol === 'ogretmen');
};

export const getOgretmenOgrencileri = (ogretmenId: string): Kullanici[] => {
  return getKullanicilar().filter(u => u.rol === 'ogrenci' && u.ogretmenId === ogretmenId);
};

export const getOnayBekleyenOgrenciler = (ogretmenId: string): Kullanici[] => {
  return getKullanicilar().filter(u => u.rol === 'ogrenci' && u.ogretmenId === ogretmenId && u.onayDurumu === 'bekliyor');
};

export const getOnayliOgrenciler = (ogretmenId: string): Kullanici[] => {
  return getKullanicilar().filter(u => u.rol === 'ogrenci' && u.ogretmenId === ogretmenId && u.onayDurumu === 'onaylandi');
};

export const ogrenciOnayla = (ogrenciId: string) => {
  const kullanicilar = getKullanicilar();
  const index = kullanicilar.findIndex(u => u.id === ogrenciId);
  if (index !== -1) {
    kullanicilar[index].onayDurumu = 'onaylandi';
    localStorage.setItem('fizik_kullanicilar', JSON.stringify(kullanicilar));
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
  }
};

export const kullaniciSil = (kullaniciId: string) => {
  if (typeof window === 'undefined') return;
  const kullanicilar = getKullanicilar();
  const filteredUsers = kullanicilar.filter(u => u.id !== kullaniciId);
  localStorage.setItem('fizik_kullanicilar', JSON.stringify(filteredUsers));

  const sonuclar = localStorage.getItem('fizik_test_sonuclari');
  if (sonuclar) {
    try {
      const parsed = JSON.parse(sonuclar);
      const filteredResults = parsed.filter((r: any) => r && r.ogrenciId !== kullaniciId);
      localStorage.setItem('fizik_test_sonuclari', JSON.stringify(filteredResults));
    } catch (e) {}
  }

  const bildirimler = localStorage.getItem('fizik_ogretmen_bildirimleri');
  if (bildirimler) {
    try {
      const parsed = JSON.parse(bildirimler);
      const filteredNotifs = parsed.filter((b: any) => b && b.ogrenciId !== kullaniciId);
      localStorage.setItem('fizik_ogretmen_bildirimleri', JSON.stringify(filteredNotifs));
    } catch (e) {}
  }
  
  postToApi('kullaniciSil', { id: kullaniciId });
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
    
    postToApi('bildirimOnayla', { id: bildirimId });
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

    postToApi('bildirimReddet', { id: bildirimId });
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
  
  postToApi('saveAtananTest', test);
};

export const deleteAtananTest = (id: string) => {
  const testler = getAtananTestler();
  const filtered = testler.filter(t => t.id !== id);
  localStorage.setItem('fizik_atanan_testler', JSON.stringify(filtered));

  postToApi('deleteAtananTest', { id });
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

  postToApi('saveDersIcerigi', icerik);
};

export const deleteDersIcerigi = (id: string) => {
  const icerikler = getDersIcerikleri();
  const filtered = icerikler.filter(i => i.id !== id);
  localStorage.setItem('fizik_ders_icerikleri', JSON.stringify(filtered));

  postToApi('deleteDersIcerigi', { id });
};

// --- Test Result Sync Helpers ---
export const saveTestSonucu = (sonuc: any) => {
  if (typeof window === 'undefined') return;
  const mevcutSonuclar = JSON.parse(localStorage.getItem('fizik_test_sonuclari') || '[]');
  mevcutSonuclar.push(sonuc);
  localStorage.setItem('fizik_test_sonuclari', JSON.stringify(mevcutSonuclar));

  postToApi('saveTestSonucu', sonuc);
};

export const saveTestGecmisi = (ogrenciId: string, soruId: string, dogruMu: boolean) => {
  if (typeof window === 'undefined') return;
  const gecmis = JSON.parse(localStorage.getItem('fizik_test_gecmisi') || '{}');
  if (!gecmis[ogrenciId]) gecmis[ogrenciId] = {};
  gecmis[ogrenciId][soruId] = dogruMu;
  localStorage.setItem('fizik_test_gecmisi', JSON.stringify(gecmis));

  postToApi('saveTestGecmisi', { ogrenciId, soruId, dogruMu });
};

// --- Class Forum & League Helpers ---
export const saveTartis = (tartis: any) => {
  if (typeof window === 'undefined') return;
  const tartismalar = JSON.parse(localStorage.getItem('fizik_sinif_tartismalar') || '[]');
  tartismalar.unshift(tartis);
  localStorage.setItem('fizik_sinif_tartismalar', JSON.stringify(tartismalar));
  postToApi('saveTartis', tartis);
};

export const saveCevap = (cevap: any) => {
  if (typeof window === 'undefined') return;
  postToApi('saveCevap', cevap);
};

export const upvoteCevap = (tartisId: string, cevapId: string) => {
  postToApi('upvoteCevap', { tartisId, cevapId });
};

export const upgradeToPremium = (ogrenciId: string) => {
  postToApi('upgradeToPremium', { ogrenciId });
};

export const addXp = (ogrenciId: string, xp: number) => {
  postToApi('addXp', { ogrenciId, xp });
};

export const addRozet = (ogrenciId: string, rozetId: string, baslik: string, ikon: string) => {
  if (typeof window === 'undefined') return;
  
  const kullaniciStr = localStorage.getItem('fizik_kullanici');
  if (kullaniciStr) {
    const k = JSON.parse(kullaniciStr);
    if (k.id === ogrenciId) {
      const rozetler = k.rozetler ? (typeof k.rozetler === 'string' ? JSON.parse(k.rozetler) : k.rozetler) : [];
      if (!rozetler.find((r: any) => r.id === rozetId)) {
        rozetler.push({ id: rozetId, baslik, ikon, tarih: new Date().toISOString() });
        k.rozetler = rozetler;
        localStorage.setItem('fizik_kullanici', JSON.stringify(k));
      }
    }
  }

  postToApi('addRozet', { ogrenciId, rozetId, baslik, ikon });
};

export const generateVerifyCode = async (email: string): Promise<string | null> => {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'generateVerifyCode', data: { email } })
    });
    const d = await res.json();
    return d.success ? d.kod : null;
  } catch { return null; }
};

export const verifyEmailCode = async (email: string, kod: string): Promise<boolean> => {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verifyEmail', data: { email, kod } })
    });
    const d = await res.json();
    return d.success;
  } catch { return false; }
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
  postToApi('updateXp', { ogrenciId, xpEkle });
};
