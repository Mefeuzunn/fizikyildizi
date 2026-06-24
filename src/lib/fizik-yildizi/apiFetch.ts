import { supabase } from './supabase';

export const apiFetch = async (url: string, options?: RequestInit): Promise<Response> => {
  // Polyfill for fetch('/api/fizik-yildizi')
  if (url.startsWith('/api/fizik-yildizi')) {
    
    // Handle GET requests (e.g. ?tartisId=xxx or just /api/fizik-yildizi)
    if (!options || !options.method || options.method === 'GET') {
      const searchParams = new URLSearchParams(url.split('?')[1] || '');
      const tartisId = searchParams.get('tartisId');
      
      if (tartisId) {
        // Fetch class answers for a discussion
        const { data } = await supabase.from('sinif_cevaplar').select('*').eq('tartisId', tartisId).order('begeniler', { ascending: false });
        return new Response(JSON.stringify({ success: true, sinifCevaplari: data || [] }));
      } else {
        // Dashboard sync: fetch all data
        const { data: kullanicilar } = await supabase.from('kullanicilar').select('*');
        const { data: bildirimler } = await supabase.from('bildirimler').select('*');
        return new Response(JSON.stringify({ success: true, kullanicilar, bildirimler }));
      }
    }

    // Handle POST requests
    if (options.method === 'POST') {
      try {
        const body = JSON.parse(options.body as string);
        const { action, data } = body;
        
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
          case 'saveAtananTest':
            await supabase.from('atanan_testler').upsert(data);
            break;
          case 'deleteAtananTest':
            await supabase.from('atanan_testler').delete().eq('id', data.id);
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
            // Also increment cevapSayisi in tartismalar
            const { data: tartis } = await supabase.from('sinif_tartismalar').select('cevapSayisi').eq('id', data.tartisId).single();
            if (tartis) {
                await supabase.from('sinif_tartismalar').update({ cevapSayisi: (tartis.cevapSayisi || 0) + 1 }).eq('id', data.tartisId);
            }
            break;
          case 'upvoteCevap':
            const { data: cevap } = await supabase.from('sinif_cevaplar').select('begeniler').eq('id', data.cevapId).single();
            if (cevap) {
              await supabase.from('sinif_cevaplar').update({ begeniler: (cevap.begeniler || 0) + 1 }).eq('id', data.cevapId);
            }
            break;
          case 'upgradeToPremium':
            await supabase.from('kullanicilar').update({ uyelikTipi: 'premium' }).eq('id', data.ogrenciId);
            break;
          case 'addRozet': {
            const { data: k } = await supabase.from('kullanicilar').select('rozetler').eq('id', data.ogrenciId).single();
            if (k) {
                let rozetler = typeof k.rozetler === 'string' ? JSON.parse(k.rozetler) : (k.rozetler || []);
                if (!rozetler.find((r:any) => r.id === data.rozetId)) {
                    rozetler.push({ id: data.rozetId, baslik: data.baslik, ikon: data.ikon, tarih: new Date().toISOString() });
                    await supabase.from('kullanicilar').update({ rozetler: JSON.stringify(rozetler) }).eq('id', data.ogrenciId);
                }
            }
            break;
          }
          case 'addXp':
          case 'updateXp': {
            const { data: k } = await supabase.from('kullanicilar').select('toplamXp, astroCoin').eq('id', data.ogrenciId).single();
            if (k) {
                const newXp = (k.toplamXp || 0) + (data.xp || data.xpEkle);
                const lig = newXp >= 10000 ? 'Yıldızlar' : newXp >= 5000 ? 'Platin' : newXp >= 2000 ? 'Altın' : newXp >= 500 ? 'Gümüş' : 'Bronz';
                const kazanilanCoin = Math.floor((data.xp || data.xpEkle) / 10);
                const newCoin = (k.astroCoin || 0) + kazanilanCoin;
                await supabase.from('kullanicilar').update({ toplamXp: newXp, lig, astroCoin: newCoin }).eq('id', data.ogrenciId);
            }
            break;
          }
          case 'generateVerifyCode':
            const kod = Math.floor(100000 + Math.random() * 900000).toString();
            await supabase.from('kullanicilar').update({ dogrulamaKodu: kod }).eq('email', data.email.toLowerCase().trim());
            return new Response(JSON.stringify({ success: true, kod }));
          case 'verifyEmail':
            const { data: vk } = await supabase.from('kullanicilar').select('dogrulamaKodu').eq('email', data.email.toLowerCase().trim()).single();
            if (vk && vk.dogrulamaKodu === data.kod) {
                await supabase.from('kullanicilar').update({ mailOnayli: 1, dogrulamaKodu: null }).eq('email', data.email.toLowerCase().trim());
                return new Response(JSON.stringify({ success: true }));
            }
            return new Response(JSON.stringify({ success: false, error: 'Geçersiz kod' }));
          
          case 'getWaitingDuel': {
            const { data: wd } = await supabase.from('duellolar')
                .select('*')
                .eq('status', 'waiting')
                .eq('lig', data.lig)
                .eq('sinif', data.sinif)
                .neq('p1_id', data.p1_id)
                .order('olusturma_tarihi', { ascending: true })
                .limit(1)
                .single();
            return new Response(JSON.stringify({ success: true, duel: wd || null }));
          }
          case 'createDuel':
            await supabase.from('duellolar').insert(data.duel);
            return new Response(JSON.stringify({ success: true }));
          case 'joinDuel':
            await supabase.from('duellolar').update({
                status: 'active',
                p2_id: data.p2_id,
                p2_data: data.p2_data,
                guncelleme_tarihi: new Date().toISOString()
            }).eq('id', data.duelId);
            return new Response(JSON.stringify({ success: true }));
          case 'getDuel': {
            const { data: gd } = await supabase.from('duellolar').select('*').eq('id', data.id).single();
            return new Response(JSON.stringify({ success: true, duel: gd || null }));
          }
          case 'cancelDuel':
            await supabase.from('duellolar').delete().eq('id', data.id);
            return new Response(JSON.stringify({ success: true }));
          case 'submitDuelAnswer': {
            const { data: sda } = await supabase.from('duellolar').select('*').eq('id', data.duelId).single();
            if (sda) {
                const p1_answers = JSON.parse(sda.p1_cevaplar || '[]');
                const p2_answers = JSON.parse(sda.p2_cevaplar || '[]');
                if (data.playerId === sda.p1_id) p1_answers.push(data.answer);
                if (data.playerId === sda.p2_id) p2_answers.push(data.answer);
                
                let nextIdx = sda.current_question_idx;
                if (p1_answers.length > nextIdx && p2_answers.length > nextIdx) {
                    nextIdx += 1;
                }
                
                const isFinished = nextIdx >= 3; // 3 questions per duel
                await supabase.from('duellolar').update({
                    p1_cevaplar: JSON.stringify(p1_answers),
                    p2_cevaplar: JSON.stringify(p2_answers),
                    current_question_idx: nextIdx,
                    status: isFinished ? 'finished' : sda.status,
                    guncelleme_tarihi: new Date().toISOString()
                }).eq('id', data.duelId);
            }
            return new Response(JSON.stringify({ success: true }));
          }
          case 'timeoutDuel': {
             await supabase.from('duellolar').update({ status: 'finished', guncelleme_tarihi: new Date().toISOString() }).eq('id', data.duelId);
             return new Response(JSON.stringify({ success: true }));
          }
          case 'getAdminStats': {
             // Mock admin stats since it requires aggregates
             return new Response(JSON.stringify({ success: true, data: { ogrenciSayisi: 0, ogretmenSayisi: 0, bekleyenOgretmenler: [], atananTestSayisi: 0, toplamXp: 0 } }));
          }
          case 'getYanlisSoruIdleri': {
              const { data: yanlislar } = await supabase.from('test_gecmisi').select('soruId').eq('ogrenciId', data.ogrenciId).eq('dogruMu', 0);
              const ids = (yanlislar || []).map(y => y.soruId);
              return new Response(JSON.stringify({ success: true, yanlisSoruIdleri: ids }));
          }
          default:
            return new Response(JSON.stringify({ success: true }));
        }

        return new Response(JSON.stringify({ success: true }));
      } catch (e) {
        console.error('apiFetch polyfill error:', e);
        return new Response(JSON.stringify({ success: false, error: e }));
      }
    }
  }
  
  // Fallback to real fetch if not intercepted
  return fetch(url, options);
};
