import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, history } = await req.json();

    if (!prompt) {
      return NextResponse.json({ success: false, error: 'Prompt is required' }, { status: 400 });
    }

    // Gelişmiş simüle edilmiş AstroTutor yanıt motoru
    // Gerçek bir senaryoda burada Google Gemini API veya OpenAI API çağrısı yapılabilir.
    
    // Basit gecikme simülasyonu
    await new Promise(resolve => setTimeout(resolve, 1500));

    const lower = prompt.toLowerCase();
    let responseText = '';

    if (lower.includes('newton') || lower.includes('ivme') || lower.includes('net kuvvet')) {
      responseText = "Mekanik konularında takıldığını görüyorum. Newton'ın 2. Hareket Yasası şöyledir:\n\n**F_net = m × a**\n\nBurada **F_net** cisme etki eden toplam kuvveti (Newton), **m** cismin kütlesini (kg) ve **a** ise ivmeyi (m/s²) belirtir. Sorudaki kütle ve kuvvet değerlerini yerine koyarak ivmeyi bulabilirsin. Dikkat: Sürtünme kuvveti varsa onu da hesaba katmalısın (F_net = F_uygulanan - F_surtunme).";
    } else if (lower.includes('enerji') || lower.includes('iş') || lower.includes('potansiyel')) {
      responseText = "Enerji dönüşümlerinde temel mantık şudur: Dışarıdan sisteme bir iş (W) yapılmıyorsa ve sürtünme yoksa mekanik enerji korunur.\n\n**E_ilk = E_son**\n\n- Kinetik Enerji: **E_k = ½ m v²**\n- Yere Göre Potansiyel Enerji: **E_p = m g h**\n\nSoruda cismin düştüğü yüksekliği potansiyel enerji formülünde kullanıp kinetik enerjiye eşitleyebilirsin.";
    } else if (lower.includes('hız') || lower.includes('zaman') || lower.includes('konum')) {
      responseText = "Kinematik (Hareket) sorularında sana hangi değişkenlerin verildiğine dikkat et. Eğer ivme (a) sabitse şu 3 temel denklemi kullanabilirsin:\n\n1. **v = v₀ + a·t** (Hız denklemi)\n2. **x = v₀·t + ½ a·t²** (Konum denklemi)\n3. **v² = v₀² + 2a·x** (Zamansız hız denklemi)\n\nHangi formülde sadece 1 bilinmeyen kalıyorsa onu tercih et.";
    } else if (lower.includes('elektrik') || lower.includes('akım') || lower.includes('direnç')) {
      responseText = "Elektrik devrelerinde en büyük yardımcımız Ohm Yasası'dır:\n\n**V = I × R** (V: Gerilim, I: Akım, R: Direnç)\n\nEğer devre **seri** ise akımlar her yerde aynıdır, gerilimler toplanır. Eğer devre **paralel** ise gerilimler aynıdır, ana kol akımı ayrılan kollara dağılır. Dirençlerin eşdeğerini (R_eş) bulmakla işe başlayabilirsin.";
    } else if (lower.includes('merhaba') || lower.includes('selam')) {
      responseText = "Merhaba! Ben AstroTutor, senin dijital Fizik asistanınım. 🚀 Bir test sorusunda takıldın mı veya bir konuyu anlamadın mı? Soruyu bana sor, sana doğrudan cevabı söylemek yerine mantığını açıklayarak nasıl çözeceğini göstereyim.";
    } else {
      responseText = "Bu ilginç bir soru. Bunu Fizik kuralları çerçevesinde şöyle düşünebiliriz: Öncelikle problemde senden istenen niceliğin ne olduğunu ve elinde hangi veriler olduğunu listele. Bir şekil (serbest cisim diyagramı) çizmek işleri her zaman kolaylaştırır. Formülleri doğrudan ezberlemek yerine birbirleriyle olan ilişkilerine odaklan!";
    }

    return NextResponse.json({
      success: true,
      text: responseText
    });

  } catch (error: any) {
    console.error('AstroTutor API Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
