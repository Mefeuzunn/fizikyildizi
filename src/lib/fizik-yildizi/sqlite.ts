import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { encrypt, decrypt, hashPassword } from './encryption';

const dbPath = path.resolve(process.cwd(), 'src/lib/fizik-yildizi/fizik.db');

// Ensure database directory exists
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

// Initialize database connection
export const db = new Database(dbPath);

// Enable WAL mode for high performance
db.pragma('journal_mode = WAL');

export interface Kullanici {
  id: string; ad: string; soyad: string; email: string;
  sifre: string; rol: 'ogrenci' | 'ogretmen'; sinif?: number;
  avatarRenk?: string; profilResmi?: string; onayDurumu?: string;
  ogretmenId?: string; ogretmenAdi?: string; kayitTarihi: string;
  rozetler?: string; veliKodu?: string; bagliOgrenciId?: string;
  astroCoin?: number; envanter?: string;
}

export interface OgretmenBildirimi {
  id: string; ogretmenId: string; ogrenciId: string;
  ogrenciAd: string; ogrenciSoyad: string; ogrenciSinif: number;
  ogrenciNo: string; okulIsmi: string; tarih: string;
  okundu: boolean; onayDurumu: 'bekliyor' | 'onaylandi' | 'reddedildi';
}

export interface AtananTest {
  id: string; ogretmenId: string; sinif: number;
  konuId: string; konuBaslik: string; aciklama?: string;
  soruSayisi?: number; sure?: number; tarih: string; sonTarih: string;
}

export interface DersIcerigi {
  id: string; ogretmenId: string; ogretmenAdi?: string; sinif: number;
  baslik: string; aciklama: string; dosyaAdi: string;
  dosyaIcerik: string; dosyaBoyutu?: string; tarih: string;
}

export interface TestSonucu {
  id: string; ogrenciId: string; konuBaslik: string;
  puan: number; dogru: number; yanlis: number; sure: number; tarih: string;
}

export interface TestGecmisi {
  ogrenciId: string; soruId: string; dogruMu: boolean;
}

// Initialize database schema
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS kullanicilar (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      ad TEXT,
      soyad TEXT,
      sifre TEXT,
      rol TEXT,
      sinif INTEGER,
      okulNo TEXT,
      okulIsmi TEXT,
      okulAdi TEXT,
      brans TEXT,
      avatarRenk TEXT,
      profilResmi TEXT,
      onayDurumu TEXT,
      ogretmenId TEXT,
      ogretmenAdi TEXT,
      kayitTarihi TEXT
    );

    CREATE TABLE IF NOT EXISTS bildirimler (
      id TEXT PRIMARY KEY,
      ogretmenId TEXT,
      ogrenciId TEXT,
      ogrenciAd TEXT,
      ogrenciSoyad TEXT,
      ogrenciSinif INTEGER,
      ogrenciNo TEXT,
      okulIsmi TEXT,
      tarih TEXT,
      okundu INTEGER DEFAULT 0,
      onayDurumu TEXT
    );

    CREATE TABLE IF NOT EXISTS atanan_testler (
      id TEXT PRIMARY KEY,
      ogretmenId TEXT,
      sinif INTEGER,
      konuId TEXT,
      konuBaslik TEXT,
      aciklama TEXT,
      soruSayisi INTEGER,
      sure INTEGER,
      tarih TEXT,
      sonTarih TEXT
    );

    CREATE TABLE IF NOT EXISTS ders_icerikleri (
      id TEXT PRIMARY KEY,
      ogretmenId TEXT,
      ogretmenAdi TEXT,
      sinif INTEGER,
      baslik TEXT,
      aciklama TEXT,
      dosyaAdi TEXT,
      dosyaIcerik TEXT,
      dosyaBoyutu TEXT,
      tarih TEXT
    );

    CREATE TABLE IF NOT EXISTS test_sonuclari (
      id TEXT PRIMARY KEY,
      ogrenciId TEXT,
      konuBaslik TEXT,
      puan INTEGER,
      dogru INTEGER,
      yanlis INTEGER,
      sure INTEGER,
      tarih TEXT
    );

    CREATE TABLE IF NOT EXISTS test_gecmisi (
      ogrenciId TEXT,
      soruId TEXT,
      dogruMu INTEGER,
      PRIMARY KEY (ogrenciId, soruId)
    );

    CREATE TABLE IF NOT EXISTS sinif_tartismalar (
      id TEXT PRIMARY KEY,
      ogrenciId TEXT,
      ogrenciAdi TEXT,
      ogrenciAvatarRenk TEXT,
      baslik TEXT,
      icerik TEXT,
      konuId TEXT,
      sinif INTEGER,
      ogretmenId TEXT,
      tarih TEXT,
      cevapSayisi INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS sinif_cevaplar (
      id TEXT PRIMARY KEY,
      tartisId TEXT,
      yazarId TEXT,
      yazarAdi TEXT,
      yazarRol TEXT,
      yazarAvatarRenk TEXT,
      icerik TEXT,
      simulasyonParametreleri TEXT,
      begeniler INTEGER DEFAULT 0,
      tarih TEXT
    );

    CREATE TABLE IF NOT EXISTS lig_puanlari (
      ogrenciId TEXT PRIMARY KEY,
      ogrenciAdi TEXT,
      toplamXp INTEGER DEFAULT 0,
      lig TEXT DEFAULT 'Bronz',
      testSayisi INTEGER DEFAULT 0,
      dogruCevapSayisi INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS duellolar (
      id TEXT PRIMARY KEY,
      status TEXT,
      lig TEXT,
      sinif INTEGER,
      p1_id TEXT,
      p1_data TEXT,
      p2_id TEXT,
      p2_data TEXT,
      sorular TEXT,
      p1_cevaplar TEXT,
      p2_cevaplar TEXT,
      current_question_idx INTEGER DEFAULT 0,
      olusturma_tarihi TEXT,
      guncelleme_tarihi TEXT
    );
  `);

  // Migration: add new columns if they don't exist
  try { db.exec("ALTER TABLE kullanicilar ADD COLUMN uyelikTipi TEXT DEFAULT 'standart'"); } catch {}
  try { db.exec("ALTER TABLE kullanicilar ADD COLUMN toplamXp INTEGER DEFAULT 0"); } catch {}
  try { db.exec("ALTER TABLE kullanicilar ADD COLUMN lig TEXT DEFAULT 'Bronz'"); } catch {}
  try { db.exec("ALTER TABLE kullanicilar ADD COLUMN dogrulamaKodu TEXT"); } catch {}
  try { db.exec("ALTER TABLE kullanicilar ADD COLUMN mailOnayli INTEGER DEFAULT 0"); } catch {}
  try { db.exec("ALTER TABLE kullanicilar ADD COLUMN astroCoin INTEGER DEFAULT 0"); } catch {}
  try { db.exec("ALTER TABLE kullanicilar ADD COLUMN envanter TEXT DEFAULT '[]'"); } catch {}
  try { db.exec("ALTER TABLE kullanicilar ADD COLUMN rozetler TEXT DEFAULT '[]'"); } catch {}
  try { db.exec("ALTER TABLE kullanicilar ADD COLUMN veliKodu TEXT"); } catch {}
  try { db.exec("ALTER TABLE kullanicilar ADD COLUMN bagliOgrenciId TEXT"); } catch {}
  
  // Create unique index to prevent duplicate entries in test_gecmisi with empty database
  // Real users are created via registration
}

// --- DB ACCESS FUNCTIONS (Encrypted) ---

export function getKullanicilarFromDb(): Kullanici[] {
  const rows = db.prepare('SELECT * FROM kullanicilar').all() as any[];
  return rows.map(u => ({
    ...u,
    email: decrypt(u.email),
    ad: decrypt(u.ad),
    soyad: decrypt(u.soyad),
    okulNo: u.okulNo ? decrypt(u.okulNo) : u.okulNo,
    okulIsmi: u.okulIsmi ? decrypt(u.okulIsmi) : u.okulIsmi,
    okulAdi: u.okulAdi ? decrypt(u.okulAdi) : u.okulAdi,
    brans: u.brans ? decrypt(u.brans) : u.brans,
  }));
}

export function saveKullaniciToDb(u: any) {
  // If the password is not yet hashed, hash it
  let hashed = u.sifre;
  if (u.sifre && u.sifre.length < 64) {
    hashed = hashPassword(u.sifre, u.email);
  }

  const stmt = db.prepare(`
    INSERT INTO kullanicilar (
      id, email, ad, soyad, sifre, rol, sinif, okulNo, okulIsmi, okulAdi, brans, avatarRenk, profilResmi, onayDurumu, ogretmenId, ogretmenAdi, kayitTarihi, rozetler, veliKodu, bagliOgrenciId
    ) VALUES (
      @id, @email, @ad, @soyad, @sifre, @rol, @sinif, @okulNo, @okulIsmi, @okulAdi, @brans, @avatarRenk, @profilResmi, @onayDurumu, @ogretmenId, @ogretmenAdi, @kayitTarihi, @rozetler, @veliKodu, @bagliOgrenciId
    )
    ON CONFLICT(id) DO UPDATE SET
      email=@email, ad=@ad, soyad=@soyad, sifre=@sifre, rol=@rol, sinif=@sinif, 
      okulNo=@okulNo, okulIsmi=@okulIsmi, okulAdi=@okulAdi, brans=@brans, 
      avatarRenk=@avatarRenk, profilResmi=@profilResmi, onayDurumu=@onayDurumu, 
      ogretmenId=@ogretmenId, ogretmenAdi=@ogretmenAdi, rozetler=@rozetler, veliKodu=@veliKodu, bagliOgrenciId=@bagliOgrenciId
  `);

  stmt.run({
    id: u.id,
    email: encrypt(u.email.toLowerCase().trim()),
    ad: encrypt(u.ad),
    soyad: encrypt(u.soyad),
    sifre: hashed,
    rol: u.rol,
    sinif: u.sinif || null,
    okulNo: u.okulNo ? encrypt(u.okulNo) : null,
    okulIsmi: u.okulIsmi ? encrypt(u.okulIsmi) : null,
    okulAdi: u.okulAdi ? encrypt(u.okulAdi) : null,
    brans: u.brans ? encrypt(u.brans) : null,
    avatarRenk: u.avatarRenk || '#06b6d4',
    profilResmi: u.profilResmi || null,
    onayDurumu: u.onayDurumu || null,
    ogretmenId: u.ogretmenId || null,
    ogretmenAdi: u.ogretmenAdi || null,
    kayitTarihi: u.kayitTarihi || new Date().toISOString(),
    rozetler: u.rozetler || '[]',
    veliKodu: u.veliKodu || (u.rol === 'ogrenci' ? Math.random().toString(36).substring(2, 8).toUpperCase() : null),
    bagliOgrenciId: u.bagliOgrenciId || null
  });
}

export function deleteKullaniciFromDb(kullaniciId: string) {
  // Delete user
  db.prepare('DELETE FROM kullanicilar WHERE id = ?').run(kullaniciId);
  // Clean test results
  db.prepare('DELETE FROM test_sonuclari WHERE ogrenciId = ?').run(kullaniciId);
  // Clean test history
  db.prepare('DELETE FROM test_gecmisi WHERE ogrenciId = ?').run(kullaniciId);
  // Clean notifications
  db.prepare('DELETE FROM bildirimler WHERE ogrenciId = ? OR ogretmenId = ?').run(kullaniciId, kullaniciId);
  // Clean assigned tests
  db.prepare('DELETE FROM atanan_testler WHERE ogretmenId = ?').run(kullaniciId);
  // Clean shared contents
  db.prepare('DELETE FROM ders_icerikleri WHERE ogretmenId = ?').run(kullaniciId);
}

export function getBildirimlerFromDb(): OgretmenBildirimi[] {
  const rows = db.prepare('SELECT * FROM bildirimler').all() as any[];
  return rows.map(b => ({
    ...b,
    ogrenciAd: decrypt(b.ogrenciAd),
    ogrenciSoyad: decrypt(b.ogrenciSoyad),
    ogrenciNo: decrypt(b.ogrenciNo),
    okulIsmi: decrypt(b.okulIsmi),
    okundu: b.okundu === 1,
  }));
}

export function saveBildirimToDb(b: any) {
  const stmt = db.prepare(`
    INSERT INTO bildirimler (
      id, ogretmenId, ogrenciId, ogrenciAd, ogrenciSoyad, ogrenciSinif, ogrenciNo, okulIsmi, tarih, okundu, onayDurumu
    ) VALUES (
      @id, @ogretmenId, @ogrenciId, @ogrenciAd, @ogrenciSoyad, @ogrenciSinif, @ogrenciNo, @okulIsmi, @tarih, @okundu, @onayDurumu
    )
    ON CONFLICT(id) DO UPDATE SET
      okundu=@okundu, onayDurumu=@onayDurumu
  `);

  stmt.run({
    id: b.id,
    ogretmenId: b.ogretmenId,
    ogrenciId: b.ogrenciId,
    ogrenciAd: encrypt(b.ogrenciAd),
    ogrenciSoyad: encrypt(b.ogrenciSoyad),
    ogrenciSinif: b.ogrenciSinif,
    ogrenciNo: encrypt(b.ogrenciNo),
    okulIsmi: encrypt(b.okulIsmi),
    tarih: b.tarih || new Date().toISOString(),
    okundu: b.okundu ? 1 : 0,
    onayDurumu: b.onayDurumu
  });
}

export function getAtananTestlerFromDb(): AtananTest[] {
  return db.prepare('SELECT * FROM atanan_testler').all() as AtananTest[];
}

export function saveAtananTestToDb(t: any) {
  const stmt = db.prepare(`
    INSERT INTO atanan_testler (id, ogretmenId, sinif, konuId, konuBaslik, aciklama, soruSayisi, sure, tarih, sonTarih)
    VALUES (@id, @ogretmenId, @sinif, @konuId, @konuBaslik, @aciklama, @soruSayisi, @sure, @tarih, @sonTarih)
    ON CONFLICT(id) DO UPDATE SET
      sinif=@sinif, konuId=@konuId, konuBaslik=@konuBaslik, aciklama=@aciklama, soruSayisi=@soruSayisi, sure=@sure, sonTarih=@sonTarih
  `);
  stmt.run({
    id: t.id,
    ogretmenId: t.ogretmenId,
    sinif: t.sinif,
    konuId: t.konuId || '',
    konuBaslik: t.konuBaslik,
    aciklama: t.aciklama || null,
    soruSayisi: t.soruSayisi || null,
    sure: t.sure || null,
    tarih: t.tarih || new Date().toISOString(),
    sonTarih: t.sonTarih || new Date().toISOString()
  });
}

export function deleteAtananTestFromDb(id: string) {
  db.prepare('DELETE FROM atanan_testler WHERE id = ?').run(id);
}

export function getDersIcerikleriFromDb(): DersIcerigi[] {
  const rows = db.prepare('SELECT * FROM ders_icerikleri').all() as any[];
  return rows.map(d => ({
    ...d,
    dosyaIcerik: decrypt(d.dosyaIcerik) // Content is GCM encrypted
  }));
}

export function saveDersIcerigiToDb(d: any) {
  const stmt = db.prepare(`
    INSERT INTO ders_icerikleri (id, ogretmenId, ogretmenAdi, sinif, baslik, aciklama, dosyaAdi, dosyaIcerik, dosyaBoyutu, tarih)
    VALUES (@id, @ogretmenId, @ogretmenAdi, @sinif, @baslik, @aciklama, @dosyaAdi, @dosyaIcerik, @dosyaBoyutu, @tarih)
    ON CONFLICT(id) DO UPDATE SET
      sinif=@sinif, ogretmenAdi=@ogretmenAdi, baslik=@baslik, aciklama=@aciklama, dosyaAdi=@dosyaAdi, dosyaIcerik=@dosyaIcerik, dosyaBoyutu=@dosyaBoyutu
  `);
  stmt.run({
    id: d.id,
    ogretmenId: d.ogretmenId,
    ogretmenAdi: d.ogretmenAdi || '',
    sinif: d.sinif,
    baslik: d.baslik,
    aciklama: d.aciklama,
    dosyaAdi: d.dosyaAdi,
    dosyaIcerik: encrypt(d.dosyaIcerik),
    dosyaBoyutu: d.dosyaBoyutu || '0 KB',
    tarih: d.tarih || new Date().toISOString()
  });
}

export function deleteDersIcerigiFromDb(id: string) {
  db.prepare('DELETE FROM ders_icerikleri WHERE id = ?').run(id);
}

export function getTestSonuclariFromDb(): TestSonucu[] {
  return db.prepare('SELECT * FROM test_sonuclari').all() as TestSonucu[];
}

export function saveTestSonucuToDb(s: any) {
  const stmt = db.prepare(`
    INSERT INTO test_sonuclari (id, ogrenciId, konuBaslik, puan, dogru, yanlis, sure, tarih)
    VALUES (@id, @ogrenciId, @konuBaslik, @puan, @dogru, @yanlis, @sure, @tarih)
    ON CONFLICT(id) DO UPDATE SET
      puan=@puan, dogru=@dogru, yanlis=@yanlis, sure=@sure
  `);
  stmt.run(s);
}

export function getTestGecmisiFromDb(): TestGecmisi[] {
  const rows = db.prepare('SELECT * FROM test_gecmisi').all() as any[];
  return rows.map(r => ({
    ...r,
    dogruMu: r.dogruMu === 1
  }));
}

export function saveTestGecmisiToDb(ogrenciId: string, soruId: string, dogruMu: boolean) {
  const stmt = db.prepare(`
    INSERT INTO test_gecmisi (ogrenciId, soruId, dogruMu)
    VALUES (?, ?, ?)
    ON CONFLICT(ogrenciId, soruId) DO UPDATE SET dogruMu=excluded.dogruMu
  `);
  stmt.run(ogrenciId, soruId, dogruMu ? 1 : 0);
}

// --- Sinif Forum & League Interfaces ---

export interface SinifTartismasi {
  id: string;
  ogrenciId: string;
  ogrenciAdi: string;
  ogrenciAvatarRenk: string;
  baslik: string;
  icerik: string;
  konuId: string;
  sinif: number;
  ogretmenId: string;
  tarih: string;
  cevapSayisi: number;
}

export interface SinifCevabi {
  id: string;
  tartisId: string;
  yazarId: string;
  yazarAdi: string;
  yazarRol: string;
  yazarAvatarRenk: string;
  icerik: string;
  simulasyonParametreleri?: string;
  begeniler: number;
  tarih: string;
}

export interface LigPuani {
  ogrenciId: string;
  ogrenciAdi: string;
  toplamXp: number;
  lig: string;
  testSayisi: number;
  dogruCevapSayisi: number;
}

export function getSinifTartismalariFromDb(sinif: number, ogretmenId: string): SinifTartismasi[] {
  return db.prepare('SELECT * FROM sinif_tartismalar WHERE sinif = ? AND ogretmenId = ? ORDER BY tarih DESC').all(sinif, ogretmenId) as SinifTartismasi[];
}

export function saveSinifTartismaToDb(t: any) {
  const stmt = db.prepare(`
    INSERT INTO sinif_tartismalar (id, ogrenciId, ogrenciAdi, ogrenciAvatarRenk, baslik, icerik, konuId, sinif, ogretmenId, tarih, cevapSayisi)
    VALUES (@id, @ogrenciId, @ogrenciAdi, @ogrenciAvatarRenk, @baslik, @icerik, @konuId, @sinif, @ogretmenId, @tarih, @cevapSayisi)
    ON CONFLICT(id) DO UPDATE SET cevapSayisi = @cevapSayisi
  `);
  stmt.run({ ...t, cevapSayisi: t.cevapSayisi || 0 });
}

export function getSinifCevaplariFromDb(tartisId: string): SinifCevabi[] {
  return db.prepare('SELECT * FROM sinif_cevaplar WHERE tartisId = ? ORDER BY begeniler DESC, tarih ASC').all(tartisId) as SinifCevabi[];
}

export function saveSinifCevabiToDb(c: any) {
  const stmt = db.prepare(`
    INSERT INTO sinif_cevaplar (id, tartisId, yazarId, yazarAdi, yazarRol, yazarAvatarRenk, icerik, simulasyonParametreleri, begeniler, tarih)
    VALUES (@id, @tartisId, @yazarId, @yazarAdi, @yazarRol, @yazarAvatarRenk, @icerik, @simulasyonParametreleri, @begeniler, @tarih)
    ON CONFLICT(id) DO UPDATE SET begeniler = @begeniler, icerik = @icerik
  `);
  stmt.run({ ...c, begeniler: c.begeniler || 0, simulasyonParametreleri: c.simulasyonParametreleri || null });
}

export function getLigPuanlariFromDb(ogretmenId: string, sinif: number): LigPuani[] {
  // Get from kullanicilar joined with test_sonuclari aggregated
  const rows = db.prepare(`
    SELECT k.id as ogrenciId, k.ad as ogrenciAdi_enc, k.toplamXp, k.lig,
      COUNT(DISTINCT ts.id) as testSayisi,
      SUM(CASE WHEN ts.dogru IS NOT NULL THEN ts.dogru ELSE 0 END) as dogruCevapSayisi
    FROM kullanicilar k
    LEFT JOIN test_sonuclari ts ON ts.ogrenciId = k.id
    WHERE k.ogretmenId = ? AND k.sinif = ? AND k.rol = 'ogrenci' AND k.onayDurumu = 'onaylandi'
    GROUP BY k.id
    ORDER BY k.toplamXp DESC
    LIMIT 50
  `).all(ogretmenId, sinif) as any[];

  return rows.map(r => ({
    ogrenciId: r.ogrenciId,
    ogrenciAdi: decrypt(r.ogrenciAdi_enc || 'Öğrenci'),
    toplamXp: r.toplamXp || 0,
    lig: r.lig || 'Bronz',
    testSayisi: r.testSayisi || 0,
    dogruCevapSayisi: r.dogruCevapSayisi || 0,
  }));
}

export function updateKullaniciXpAndLig(ogrenciId: string, xpEkle: number) {
  const user = db.prepare('SELECT toplamXp, astroCoin FROM kullanicilar WHERE id = ?').get(ogrenciId) as any;
  if (!user) return;
  const newXp = (user.toplamXp || 0) + xpEkle;
  const lig = newXp >= 10000 ? 'Yıldızlar' : newXp >= 5000 ? 'Platin' : newXp >= 2000 ? 'Altın' : newXp >= 500 ? 'Gümüş' : 'Bronz';
  
  // Her 10 XP için 1 AstroCoin ver
  const kazanilanCoin = Math.floor(xpEkle / 10);
  const newCoin = (user.astroCoin || 0) + kazanilanCoin;
  
  db.prepare('UPDATE kullanicilar SET toplamXp = ?, lig = ?, astroCoin = ? WHERE id = ?').run(newXp, lig, newCoin, ogrenciId);
}

export function satinAlimYap(ogrenciId: string, fiyat: number, itemId: string): boolean {
  const user = db.prepare('SELECT astroCoin, envanter FROM kullanicilar WHERE id = ?').get(ogrenciId) as any;
  if (!user) return false;
  
  const currentCoin = user.astroCoin || 0;
  if (currentCoin < fiyat) return false;
  
  let envanter: string[] = [];
  try { envanter = JSON.parse(user.envanter || '[]'); } catch {}
  
  if (envanter.includes(itemId)) return false; // Zaten sahip
  envanter.push(itemId);
  
  db.prepare('UPDATE kullanicilar SET astroCoin = ?, envanter = ? WHERE id = ?')
    .run(currentCoin - fiyat, JSON.stringify(envanter), ogrenciId);
    
  return true;
}

export function setDogrulamaKodu(email: string, kod: string) {
  db.prepare("UPDATE kullanicilar SET dogrulamaKodu = ? WHERE email = ?").run(kod, encrypt(email.toLowerCase().trim()));
}

export function verifyEmailKodu(email: string, kod: string): boolean {
  const user = db.prepare('SELECT dogrulamaKodu, mailOnayli FROM kullanicilar WHERE email = ?').get(encrypt(email.toLowerCase().trim())) as any;
  if (!user) return false;
  if (user.dogrulamaKodu === kod) {
    db.prepare("UPDATE kullanicilar SET mailOnayli = 1, dogrulamaKodu = NULL WHERE email = ?").run(encrypt(email.toLowerCase().trim()));
    return true;
  }
  return false;
}

export function addRozetToKullanici(ogrenciId: string, rozetId: string, baslik: string, ikon: string) {
  const user = db.prepare('SELECT rozetler FROM kullanicilar WHERE id = ?').get(ogrenciId) as any;
  if (!user) return;
  const currentRozetler = JSON.parse(user.rozetler || '[]');
  if (!currentRozetler.find((r: any) => r.id === rozetId)) {
    currentRozetler.push({ id: rozetId, baslik, ikon, tarih: new Date().toISOString() });
    db.prepare('UPDATE kullanicilar SET rozetler = ? WHERE id = ?').run(JSON.stringify(currentRozetler), ogrenciId);
  }
}

export function approveTeacherInDb(teacherId: string) {
  db.prepare("UPDATE kullanicilar SET onayDurumu = 'onaylandi' WHERE id = ?").run(teacherId);
}

export function getAdminStatsFromDb() {
  const ogrenciSayisi = (db.prepare("SELECT COUNT(*) as count FROM kullanicilar WHERE rol = 'ogrenci'").get() as any).count;
  const ogretmenSayisi = (db.prepare("SELECT COUNT(*) as count FROM kullanicilar WHERE rol = 'ogretmen'").get() as any).count;
  const bekleyenOgretmenler = db.prepare("SELECT * FROM kullanicilar WHERE rol = 'ogretmen' AND onayDurumu = 'bekliyor'").all().map((u: any) => ({
    id: u.id,
    ad: decrypt(u.ad_enc),
    soyad: decrypt(u.soyad_enc),
    email: decrypt(u.email_enc),
    okulIsmi: decrypt(u.okulIsmi_enc),
    kayitTarihi: u.kayitTarihi
  }));
  const atananTestSayisi = (db.prepare("SELECT COUNT(*) as count FROM atanan_testler").get() as any).count;
  const toplamXp = (db.prepare("SELECT SUM(toplamXp) as total FROM kullanicilar WHERE rol = 'ogrenci'").get() as any).total || 0;

  return {
    ogrenciSayisi,
    ogretmenSayisi,
    bekleyenOgretmenler,
    atananTestSayisi,
    toplamXp
  };
}

export function getVeliDashboardData(veliId: string) {
  // Find veli
  const veli = db.prepare("SELECT bagliOgrenciId FROM kullanicilar WHERE id = ?").get(veliId) as any;
  if (!veli || !veli.bagliOgrenciId) return { error: 'Veli veya bağlantı kodu bulunamadı' };
  
  // Find student by veliKodu
  const ogrenci = db.prepare("SELECT id, ad_enc, soyad_enc, toplamXp, lig, rozetler, avatarRenk FROM kullanicilar WHERE veliKodu = ? AND rol = 'ogrenci'").get(veli.bagliOgrenciId) as any;
  if (!ogrenci) return { error: 'Bu koda sahip bir öğrenci bulunamadı. Lütfen öğrencinizin kodunu kontrol edip tekrar kayıt olun veya destekle iletişime geçin.' };

  const ogrenciId = ogrenci.id;

  // Get test stats
  const testResults = db.prepare("SELECT * FROM test_sonuclari WHERE ogrenciId = ?").all(ogrenciId) as any[];
  const toplamSoru = testResults.reduce((sum, t) => sum + t.dogru + t.yanlis, 0);
  const toplamDogru = testResults.reduce((sum, t) => sum + t.dogru, 0);
  const basariYuzdesi = toplamSoru > 0 ? Math.round((toplamDogru / toplamSoru) * 100) : 0;
  
  // Get latest 5 tests
  const sonTestler = db.prepare("SELECT * FROM test_sonuclari WHERE ogrenciId = ? ORDER BY tarih DESC LIMIT 5").all(ogrenciId) as any[];

  // Get homeworks
  const odevler = db.prepare(`
    SELECT o.*, 
      (SELECT COUNT(*) FROM test_sonuclari t WHERE t.odevId = o.id AND t.ogrenciId = ?) as cozuldu
    FROM atanan_testler o
    JOIN kullanicilar k ON k.ogretmenId = o.ogretmenId
    WHERE k.id = ? AND o.sinif = k.sinif
    ORDER BY o.tarih DESC LIMIT 10
  `).all(ogrenciId, ogrenciId) as any[];

  return {
    ogrenci: {
      ad: decrypt(ogrenci.ad_enc),
      soyad: decrypt(ogrenci.soyad_enc),
      toplamXp: ogrenci.toplamXp || 0,
      lig: ogrenci.lig || 'Bronz',
      avatarRenk: ogrenci.avatarRenk,
      rozetler: JSON.parse(ogrenci.rozetler || '[]')
    },
    istatistikler: {
      cozulenTestSayisi: testResults.length,
      toplamSoru,
      basariYuzdesi
    },
    sonTestler,
    odevler
  };
}

export interface DuelSession {
  id: string;
  status: 'waiting' | 'active' | 'finished';
  lig: string;
  sinif: number;
  p1_id: string;
  p1_data: string;
  p2_id: string | null;
  p2_data: string | null;
  sorular: string;
  p1_cevaplar: string;
  p2_cevaplar: string;
  current_question_idx: number;
  olusturma_tarihi: string;
  guncelleme_tarihi: string;
}

export function getWaitingDuel(lig: string, sinif: number, p1_id: string): DuelSession | null {
  return db.prepare('SELECT * FROM duellolar WHERE status = ? AND lig = ? AND sinif = ? AND p1_id != ? ORDER BY olusturma_tarihi ASC LIMIT 1').get('waiting', lig, sinif, p1_id) as DuelSession | null;
}

export function getDuel(id: string): DuelSession | null {
  return db.prepare('SELECT * FROM duellolar WHERE id = ?').get(id) as DuelSession | null;
}

export function saveDuel(duel: DuelSession) {
  const stmt = db.prepare(`
    INSERT INTO duellolar (id, status, lig, sinif, p1_id, p1_data, p2_id, p2_data, sorular, p1_cevaplar, p2_cevaplar, current_question_idx, olusturma_tarihi, guncelleme_tarihi)
    VALUES (@id, @status, @lig, @sinif, @p1_id, @p1_data, @p2_id, @p2_data, @sorular, @p1_cevaplar, @p2_cevaplar, @current_question_idx, @olusturma_tarihi, @guncelleme_tarihi)
    ON CONFLICT(id) DO UPDATE SET
      status=@status, p2_id=@p2_id, p2_data=@p2_data, sorular=@sorular, p1_cevaplar=@p1_cevaplar, p2_cevaplar=@p2_cevaplar, current_question_idx=@current_question_idx, guncelleme_tarihi=@guncelleme_tarihi
  `);
  stmt.run({ ...duel, guncelleme_tarihi: new Date().toISOString() });
}

export function deleteDuel(id: string) {
  db.prepare('DELETE FROM duellolar WHERE id = ?').run(id);
}

export function getYanlisSoruIdleriFromDb(ogrenciId: string): string[] {
  const rows = db.prepare('SELECT soruId FROM test_gecmisi WHERE ogrenciId = ? AND dogruMu = 0').all(ogrenciId) as any[];
  return rows.map(r => r.soruId);
}
