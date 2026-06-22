import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { hashPassword } from '@/lib/fizik-yildizi/encryption';


import {
  initDatabase,
  getKullanicilarFromDb,
  saveKullaniciToDb,
  deleteKullaniciFromDb,
  getBildirimlerFromDb,
  saveBildirimToDb,
  getAtananTestlerFromDb,
  saveAtananTestToDb,
  deleteAtananTestFromDb,
  getDersIcerikleriFromDb,
  saveDersIcerigiToDb,
  deleteDersIcerigiFromDb,
  getTestSonuclariFromDb,
  saveTestSonucuToDb,
  getTestGecmisiFromDb,
  saveTestGecmisiToDb,
  getSinifTartismalariFromDb,
  saveSinifTartismaToDb,
  getSinifCevaplariFromDb,
  saveSinifCevabiToDb,
  updateKullaniciXpAndLig,
  setDogrulamaKodu,
  verifyEmailKodu,
  satinAlimYap,
  addRozetToKullanici,
  approveTeacherInDb,
  getAdminStatsFromDb,
  getVeliDashboardData,
  getWaitingDuel,
  getDuel,
  saveDuel,
  deleteDuel,
  getYanlisSoruIdleriFromDb,
  getLigPuanlariFromDb
} from '@/lib/fizik-yildizi/sqlite';

// Soru havuzu
import { sorular } from '@/data/fizik-yildizi/sorular';

// Sync state endpoint + question generation endpoint
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');
    const tartisId = url.searchParams.get('tartisId');

    if (tartisId) {
      initDatabase();
      return NextResponse.json({
        success: true,
        sinifCevaplari: getSinifCevaplariFromDb(tartisId)
      });
    }

    // ─── Soru Motoru Endpoint ─────────────────────────────
    if (action === 'sorular') {
      const { filtreliSoruUret, tumSablonlarSenkron } = await import('@/lib/fizik-yildizi/soru-motoru');
      const sablonlar = tumSablonlarSenkron();

      const sinifParam = url.searchParams.get('sinif');
      const konuId = url.searchParams.get('konuId') || undefined;
      const altKonuId = url.searchParams.get('altKonuId') || undefined;
      const adet = Math.min(parseInt(url.searchParams.get('adet') || '20'), 200);
      const seed = parseInt(url.searchParams.get('seed') || '0');
      const tyt = url.searchParams.get('tyt') === 'true' ? true : undefined;
      const ayt = url.searchParams.get('ayt') === 'true' ? true : undefined;

      const siniflar = sinifParam
        ? sinifParam.split(',').map(Number).filter(n => [9,10,11,12].includes(n)) as (9|10|11|12)[]
        : undefined;

      const sorular = filtreliSoruUret(sablonlar, {
        sinif: siniflar,
        konuId,
        altKonuId,
        adet,
        seed,
        tytMi: tyt,
        aytMi: ayt,
      });

      return NextResponse.json({ success: true, sorular, toplam: sorular.length });
    }

    // ─── İstatistik Endpoint ──────────────────────────────
    if (action === 'soru-istatistik') {
      const { tumSablonlarSenkron, zorlukDagilimiyleUret, istatistikHesapla } = await import('@/lib/fizik-yildizi/soru-motoru');
      const sablonlar = tumSablonlarSenkron();
      const ornekSorular = zorlukDagilimiyleUret(sablonlar, 10); // 10 per template for stats
      const istatistik = istatistikHesapla(ornekSorular);
      return NextResponse.json({ success: true, istatistik, sablonSayisi: sablonlar.length });
    }

    // ─── Ana Sync Endpoint ────────────────────────────────
    initDatabase();
    
    if (action === 'getLigPuanlari') {
      return NextResponse.json({
        success: true,
        ligPuanlari: getLigPuanlariFromDb('', 0)
      });
    }

    return NextResponse.json({
      success: true,
      kullanicilar: getKullanicilarFromDb(),
      bildirimler: getBildirimlerFromDb(),
      atananTestler: getAtananTestlerFromDb(),
      dersIcerikleri: getDersIcerikleriFromDb(),
      testSonuclari: getTestSonuclariFromDb(),
      testGecmisi: getTestGecmisiFromDb(),
      sinifTartismalari: getSinifTartismalariFromDb(0, '')
    });
  } catch (e: any) {
    console.error('Fizik Yildizi API GET error:', e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    initDatabase();
    const body = await req.json();
    const { action, data } = body;

    // 1. Secure server-side authentication
    if (action === 'login') {
      const { email, sifre, rol } = data;
      const users = getKullanicilarFromDb();
      
      const user = users.find(
        u => u.email.toLowerCase().trim() === email.toLowerCase().trim() && u.rol === rol
      );

      if (!user) {
        return NextResponse.json({ success: false, message: 'Hatalı e-posta veya şifre.' }, { status: 401 });
      }

      // Check if password matches (either hashed or legacy cleartext)
      const hashedInput = hashPassword(sifre, user.email);
      const isLegacyMatch = user.sifre === sifre;

      if (user.sifre !== hashedInput && !isLegacyMatch) {
        return NextResponse.json({ success: false, message: 'Hatalı e-posta veya şifre.' }, { status: 401 });
      }

      // Generate base64 simple auth token
      const token = btoa(`${user.id}:${Date.now()}:fizik_yildizi`);
      
      return NextResponse.json({
        success: true,
        kullanici: user,
        token
      });
    }

    // 2. Database mutation actions
    switch (action) {
      case 'saveKullanici':
        saveKullaniciToDb(data);
        break;
      
      case 'kullaniciSil':
        deleteKullaniciFromDb(data.id);
        break;

      case 'saveBildirim':
        saveBildirimToDb(data);
        break;

      case 'bildirimOnayla': {
        const bildirimler = getBildirimlerFromDb();
        const b = bildirimler.find(x => x.id === data.id);
        if (b) {
          b.onayDurumu = 'onaylandi';
          b.okundu = true;
          saveBildirimToDb(b);

          // Find student and update approval status to onaylandi
          const users = getKullanicilarFromDb();
          const student = users.find(u => u.id === b.ogrenciId);
          if (student) {
            student.onayDurumu = 'onaylandi';
            saveKullaniciToDb(student);
          }
        }
        break;
      }

      case 'bildirimReddet': {
        const bildirimler = getBildirimlerFromDb();
        const b = bildirimler.find(x => x.id === data.id);
        if (b) {
          b.onayDurumu = 'reddedildi';
          b.okundu = true;
          saveBildirimToDb(b);

          // Find student, set status to rejected and clear teacher link
          const users = getKullanicilarFromDb();
          const student = users.find(u => u.id === b.ogrenciId);
          if (student) {
            student.onayDurumu = 'reddedildi';
            student.ogretmenId = undefined;
            student.ogretmenAdi = undefined;
            saveKullaniciToDb(student);
          }
        }
        break;
      }

      case 'saveAtananTest':
        saveAtananTestToDb(data);
        break;

      case 'deleteAtananTest':
        deleteAtananTestFromDb(data.id);
        break;

      case 'saveDersIcerigi':
        saveDersIcerigiToDb(data);
        break;

      case 'deleteDersIcerigi':
        deleteDersIcerigiFromDb(data.id);
        break;

      case 'saveTestSonucu':
        saveTestSonucuToDb(data);
        break;

      case 'saveTestGecmisi':
        saveTestGecmisiToDb(data.ogrenciId, data.soruId, data.dogruMu);
        break;

      case 'saveTartis':
        saveSinifTartismaToDb(data);
        break;

      case 'saveCevap':
        saveSinifCevabiToDb(data);
        // Award XP for posting an answer
        updateKullaniciXpAndLig(data.yazarId, 50);
        break;
      case 'satinAlim': {
        const result = satinAlimYap(data.ogrenciId, data.fiyat, data.itemId);
        return NextResponse.json({ success: result });
      }
      case 'upvoteCevap': {
        const cevaplar = getSinifCevaplariFromDb(data.tartisId);
        const c = cevaplar.find(x => x.id === data.cevapId);
        if (c) {
          c.begeniler = (c.begeniler || 0) + 1;
          saveSinifCevabiToDb(c);
          updateKullaniciXpAndLig(c.yazarId, 100);
        }
        break;
      }

      case 'verifyEmail': {
        const ok = verifyEmailKodu(data.email, data.kod);
        return NextResponse.json({ success: ok, message: ok ? 'E-posta doğrulandı!' : 'Yanlış kod.' });
      }

      case 'generateVerifyCode': {
        const kod = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Fix for race condition: Wait briefly to ensure the user is inserted into the DB 
        // by the concurrent 'saveKullanici' request before we try to update their verification code.
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setDogrulamaKodu(data.email, kod);
        
        try {
          const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');
          await resend.emails.send({
            from: 'Fizik Yıldızı <onboarding@resend.dev>',
            to: data.email,
            subject: 'Fizik Yıldızı - E-posta Doğrulama Kodunuz',
            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; background-color: #09090b; color: #f4f4f5; border-radius: 8px; border: 1px solid #27272a;">
                <h2 style="color: #6366f1; text-align: center;">Fizik Yıldızı'na Hoş Geldiniz!</h2>
                <p style="font-size: 16px;">Güvenliğiniz için doğrulama kodunuz aşağıdadır:</p>
                <div style="background-color: #18181b; padding: 15px; text-align: center; border-radius: 6px; margin: 20px 0; border: 1px solid #3f3f46;">
                  <h1 style="margin: 0; color: #10b981; letter-spacing: 5px;">${kod}</h1>
                </div>
                <p style="color: #a1a1aa; font-size: 14px;">Bu kodu kimseyle paylaşmayın. Fizik Yıldızı ekibi sizden asla şifrenizi istemez.</p>
              </div>
            `
          });
          return NextResponse.json({ success: true, message: "E-posta başarıyla gönderildi." });
        } catch (error) {
          console.error("Resend error:", error);
          return NextResponse.json({ success: false, message: "E-posta gönderilirken bir hata oluştu." }, { status: 500 });
        }
      }

      case 'upgradeToPremium': {
        const users = getKullanicilarFromDb();
        const user = users.find(u => u.id === data.ogrenciId);
        if (user) {
          (user as any).uyelikTipi = 'premium';
          saveKullaniciToDb(user);
        }
        break;
      }

      case 'getYanlisSorular': {
        const ids = getYanlisSoruIdleriFromDb(data.ogrenciId);
        // Find matching questions from the pool
        const yanlisSorular = ids.map(id => sorular.find(s => s.id === id)).filter(Boolean);
        return NextResponse.json({ success: true, sorular: yanlisSorular });
      }

      // --- DUELLO (GERÇEK ZAMANLI) ---
      case 'joinDuel': {
        // data: { id, ad, avatarRenk, lig, sinif }
        const p1Data = JSON.stringify({ ad: data.ad, avatarRenk: data.avatarRenk });
        
        // 1. Bekleyen var mı?
        const waiting = getWaitingDuel(data.lig, data.sinif, data.id);
        
        if (waiting) {
          // Join existing
          waiting.status = 'active';
          waiting.p2_id = data.id;
          waiting.p2_data = p1Data;
          saveDuel(waiting);
          return NextResponse.json({ success: true, duelId: waiting.id, isCreator: false, duel: waiting });
        } else {
          // 2. Yoksa yeni oluştur
          // Rastgele 10 soru seç
          const shuffled = [...sorular].sort(() => 0.5 - Math.random());
          const selectedQuestions = shuffled.slice(0, 10);
          
          const newDuel = {
            id: `duel_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            status: 'waiting' as const,
            lig: data.lig,
            sinif: data.sinif,
            p1_id: data.id,
            p1_data: p1Data,
            p2_id: null,
            p2_data: null,
            sorular: JSON.stringify(selectedQuestions),
            p1_cevaplar: '{}',
            p2_cevaplar: '{}',
            current_question_idx: 0,
            olusturma_tarihi: new Date().toISOString(),
            guncelleme_tarihi: new Date().toISOString()
          };
          saveDuel(newDuel);
          return NextResponse.json({ success: true, duelId: newDuel.id, isCreator: true, duel: newDuel });
        }
      }

      case 'pollDuel': {
        const duel = getDuel(data.duelId);
        if (!duel) return NextResponse.json({ success: false, error: 'Not found' });
        return NextResponse.json({ success: true, duel });
      }

      case 'submitDuelAnswer': {
        const duel = getDuel(data.duelId);
        if (!duel) return NextResponse.json({ success: false });

        const p1Ans = JSON.parse(duel.p1_cevaplar);
        const p2Ans = JSON.parse(duel.p2_cevaplar);
        
        if (data.playerId === duel.p1_id) {
          p1Ans[data.qIdx] = { secim: data.secim, sure: data.sure, puan: data.puan };
          duel.p1_cevaplar = JSON.stringify(p1Ans);
        } else if (data.playerId === duel.p2_id) {
          p2Ans[data.qIdx] = { secim: data.secim, sure: data.sure, puan: data.puan };
          duel.p2_cevaplar = JSON.stringify(p2Ans);
        }

        // Eğer iki taraf da cevapladıysa ve current_question_idx hala data.qIdx ise, bir sonraki soruya geç
        if (p1Ans[data.qIdx] && p2Ans[data.qIdx] && duel.current_question_idx === data.qIdx) {
          if (data.qIdx < 9) {
            duel.current_question_idx += 1;
          } else {
            duel.status = 'finished';
          }
        }

        saveDuel(duel);
        return NextResponse.json({ success: true, duel });
      }
      
      case 'advanceDuelQuestion': {
         // Auto-advance mechanism explicitly called when timeout occurs
         const duel = getDuel(data.duelId);
         if (!duel || duel.status !== 'active') return NextResponse.json({ success: false });
         
         if (duel.current_question_idx === data.qIdx) {
            if (data.qIdx < 9) {
              duel.current_question_idx += 1;
            } else {
              duel.status = 'finished';
            }
            saveDuel(duel);
         }
         return NextResponse.json({ success: true, duel });
      }

      case 'cancelDuel': {
        const duel = getDuel(data.duelId);
        if (duel && duel.status === 'waiting') {
          deleteDuel(data.duelId);
        }
        return NextResponse.json({ success: true });
      }

      case 'updateXp': {
        updateKullaniciXpAndLig(data.ogrenciId, data.xpEkle);
        break;
      }

      case 'addXp': {
        updateKullaniciXpAndLig(data.ogrenciId, data.xp);
        break;
      }

      case 'saveOdev':
        saveAtananTestToDb(data);
        break;

      case 'addRozet':
        addRozetToKullanici(data.ogrenciId, data.rozetId, data.baslik, data.ikon);
        break;

      case 'adminStats':
        return NextResponse.json({ success: true, data: getAdminStatsFromDb() });

      case 'veliDashboard':
        const vData = getVeliDashboardData(data.veliId);
        if (vData.error) return NextResponse.json({ success: false, error: vData.error }, { status: 400 });
        return NextResponse.json({ success: true, data: vData });

      case 'approveTeacher':
        approveTeacherInDb(data.teacherId);
        break;

      default:
        return NextResponse.json({ success: false, error: `Bilinmeyen eylem: ${action}` }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('Fizik Yildizi API POST error:', e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
