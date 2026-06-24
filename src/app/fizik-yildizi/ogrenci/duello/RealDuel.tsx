'use client';
import { apiFetch } from '@/lib/fizik-yildizi/apiFetch';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { updateXp } from '@/lib/fizik-yildizi/db';
import styles from '@/app/fizik-yildizi/fizik.module.css';

interface DuelData {
  id: number;
  player1_id: number;
  player2_id: number | null;
  status: string; // 'waiting', 'active', 'finished'
  sorular: string; // JSON string of 10 Soru objects
  p1_cevaplar: string; // JSON string e.g. ["A", "B", null, "D"] for each answered round
  p2_cevaplar: string; // JSON string
  current_question_idx: number;
  created_at: string;
}

interface UserInfo {
  id: number;
  ad: string;
  avatarRenk: string;
  lig: string;
  sinif: string;
}

export default function RealDuel({ onExit, onAutoBot }: { onExit: () => void, onAutoBot: () => void }) {
  const router = useRouter();
  const [kullanici, setKullanici] = useState<any>(null);
  const [duel, setDuel] = useState<DuelData | null>(null);
  const [rival, setRival] = useState<UserInfo | null>(null);
  
  // Local state for UI
  const [timeLeft, setTimeLeft] = useState(15);
  const [playerSelected, setPlayerSelected] = useState<string | null>(null);
  const [waitingElapsed, setWaitingElapsed] = useState(0);

  // Phases
  const phase = duel?.status || 'joining'; // joining, waiting, active, finished

  const pollInterval = useRef<NodeJS.Timeout | null>(null);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const kData = localStorage.getItem('fizik_kullanici');
    if (!kData) {
      router.push('/fizik-yildizi/giris');
      return;
    }
    const k = JSON.parse(kData);
    setKullanici(k);

    // Join
    joinDuel(k);

    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
  }, [router]);

  const joinDuel = async (k: any) => {
    try {
      const res = await apiFetch('/api/fizik-yildizi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'joinDuel',
          data: { id: k.id, ad: k.ad, avatarRenk: k.avatarRenk, lig: k.lig, sinif: k.sinif || '10A' }
        })
      });
      const data = await res.json();
      if (data.success && data.duel) {
        setDuel(data.duel);
        startPolling(data.duel.id, k.id);
      } else {
        alert("Bağlantı hatası");
        onExit();
      }
    } catch {
      alert("Bağlantı hatası");
      onExit();
    }
  };

  const startPolling = (duelId: number, userId: number) => {
    pollInterval.current = setInterval(async () => {
      try {
        const res = await apiFetch('/api/fizik-yildizi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'pollDuel', data: { duelId, userId } })
        });
        const data = await res.json();
        if (data.success) {
          if (data.duel) setDuel(data.duel);
          if (data.rival) setRival(data.rival);
        }
      } catch {}
    }, 1000);
  };

  // Handle waiting time
  useEffect(() => {
    if (phase === 'waiting') {
      const interval = setInterval(() => {
        setWaitingElapsed(prev => {
          if (prev >= 20) {
            clearInterval(interval);
            handleTimeout();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [phase]);

  const handleTimeout = async () => {
    if (duel) {
      await apiFetch('/api/fizik-yildizi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancelDuel', data: { duelId: duel.id } })
      });
    }
    alert("Oyuncu bulunamadı, AI moduna aktarılıyorsunuz.");
    onAutoBot();
  };

  const cancelMatchmaking = async () => {
    if (duel) {
      await apiFetch('/api/fizik-yildizi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancelDuel', data: { duelId: duel.id } })
      });
    }
    onExit();
  };

  // Handle Question Timer
  useEffect(() => {
    if (phase === 'active' && duel) {
      setTimeLeft(15);
      setPlayerSelected(null);
      if (timerInterval.current) clearInterval(timerInterval.current);
      timerInterval.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (timerInterval.current) clearInterval(timerInterval.current);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [duel?.current_question_idx, phase]);

  const handleTimeUp = async () => {
    // Both players might call this, backend should be idempotent
    if (duel) {
      await apiFetch('/api/fizik-yildizi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'advanceDuelQuestion', data: { duelId: duel.id } })
      });
    }
  };

  const handlePlayerSelect = async (choice: string) => {
    if (playerSelected || timeLeft <= 0 || !duel || !kullanici) return;
    setPlayerSelected(choice);
    await apiFetch('/api/fizik-yildizi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'submitDuelAnswer',
        data: { duelId: duel.id, userId: kullanici.id, answer: choice, questionIdx: duel.current_question_idx }
      })
    });
  };

  if (!kullanici) return null;

  if (phase === 'joining') {
    return (
      <div style={{ background: '#09090b', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '4rem' }}>
        <div style={{ color: '#f4f4f5', fontSize: '1.2rem' }}>Sunucuya bağlanılıyor...</div>
      </div>
    );
  }

  if (phase === 'waiting') {
    return (
      <div style={{ background: '#09090b', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', color: '#f4f4f5' }}>
        <div className={styles.glassCardNohover} style={{ maxWidth: '420px', width: '100%', padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              position: 'absolute', width: '100%', height: '100%',
              borderRadius: '50%', border: '2px solid rgba(99,102,241,0.15)',
              animation: 'pulse 2s infinite'
            }} />
            <div style={{
              position: 'absolute', width: '70%', height: '70%',
              borderRadius: '50%', border: '2px dashed rgba(99,102,241,0.3)',
              animation: 'spin 4s linear infinite'
            }} />
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.25rem', boxShadow: '0 0 20px rgba(99,102,241,0.4)'
            }}>⚔️</div>
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.35rem' }}>Gerçek Eşleşme Aranıyor...</h3>
            <p style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>{20 - waitingElapsed} saniye içinde rakip bulunmazsa bot ile eşleştirileceksiniz.</p>
          </div>
          <button
            onClick={cancelMatchmaking}
            className={styles.btnSecondary}
            style={{ padding: '0.625rem 1.5rem', fontSize: '0.82rem', marginTop: '1rem' }}
          >
            İptal Et
          </button>
        </div>
      </div>
    );
  }

  // Active or Finished
  const sorular = duel ? JSON.parse(duel.sorular) : [];
  const currentQ = sorular[duel!.current_question_idx] || sorular[0];
  const p1Cevaplar = duel ? JSON.parse(duel.p1_cevaplar || '[]') : [];
  const p2Cevaplar = duel ? JSON.parse(duel.p2_cevaplar || '[]') : [];

  // Determine who is who
  const isPlayer1 = duel?.player1_id === kullanici.id;
  const myCevaplar = isPlayer1 ? p1Cevaplar : p2Cevaplar;
  const rivalCevaplar = isPlayer1 ? p2Cevaplar : p1Cevaplar;

  let playerScore = 0;
  let rivalScore = 0;
  for (let i = 0; i < sorular.length; i++) {
    if (myCevaplar[i] && myCevaplar[i] === sorular[i].dogruCevap) playerScore++;
    if (rivalCevaplar[i] && rivalCevaplar[i] === sorular[i].dogruCevap) rivalScore++;
  }

  const rivalAnsweredCurrent = rivalCevaplar[duel!.current_question_idx] !== undefined && rivalCevaplar[duel!.current_question_idx] !== null;
  const myAnswerCurrent = myCevaplar[duel!.current_question_idx] || playerSelected;

  if (phase === 'finished') {
    return (
      <div style={{ background: '#09090b', color: '#f4f4f5' }}>
        <main style={{ maxWidth: '600px', margin: '0 auto', padding: '8rem 1.5rem 4rem', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem', animation: 'bounce 1s ease' }}>
            {playerScore > rivalScore ? '🎉' : playerScore === rivalScore ? '🤝' : '💀'}
          </div>
          <h1 style={{
            fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem',
            color: playerScore > rivalScore ? '#10b981' : playerScore === rivalScore ? '#f59e0b' : '#f43f5e'
          }}>
            {playerScore > rivalScore ? 'DÜELLO ZAFERİ!' : playerScore === rivalScore ? 'DÜELLO BERABERE!' : 'MAĞLUBİYET!'}
          </h1>
          <p style={{ color: '#a1a1aa', fontSize: '0.95rem', marginBottom: '2.5rem' }}>
            {rival?.ad} ile düello kapışması bitti
          </p>
          <div className={styles.glassCardNohover} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 800 }}>
                  {kullanici.ad[0]}
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>{kullanici.ad}</span>
                <span style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'monospace', color: '#6366f1' }}>{playerScore}</span>
              </div>
              <div style={{ fontSize: '1.5rem', color: '#3f3f46', fontWeight: 800 }}>VS</div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: rival?.avatarRenk || '#f43f5e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 800 }}>
                  {rival?.ad[0] || '?'}
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>{rival?.ad || 'Rakip'}</span>
                <span style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'monospace', color: '#f43f5e' }}>{rivalScore}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={onExit} className={styles.btnSecondary} style={{ padding: '0.875rem 2rem', borderRadius: '12px', fontWeight: 700 }}>
              Lobiye Dön
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ background: '#09090b', color: '#f4f4f5', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '6rem 1.5rem 4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '2rem', alignItems: 'center', marginBottom: '2rem' }}>
          
          <div className={styles.glassCardNohover} style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #6366f1' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 800, flexShrink: 0 }}>
              {kullanici.ad[0]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{kullanici.ad}</div>
              <div style={{ fontSize: '0.75rem', color: myAnswerCurrent ? '#10b981' : '#a1a1aa' }}>
                {myAnswerCurrent ? '✓ Cevapladı' : '🤔 Düşünüyor...'}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', minWidth: '160px' }}>
            <div style={{ fontSize: '0.72rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
              ROUND {duel!.current_question_idx + 1} / 10
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: 900, fontFamily: 'monospace', letterSpacing: '0.05em' }}>
              <span style={{ color: '#6366f1' }}>{playerScore}</span>
              <span style={{ color: '#52525b', margin: '0 0.5rem' }}>-</span>
              <span style={{ color: '#f43f5e' }}>{rivalScore}</span>
            </div>
          </div>

          <div className={styles.glassCardNohover} style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', gap: '1rem', borderRight: `4px solid ${rival?.avatarRenk || '#f43f5e'}`, textAlign: 'right' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: rival?.avatarRenk || '#f43f5e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 800, flexShrink: 0 }}>
              {rival?.ad?.[0] || '?'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rival?.ad || 'Rakip'}</div>
              <div style={{ fontSize: '0.75rem', color: rivalAnsweredCurrent ? '#f43f5e' : '#a1a1aa' }}>
                {rivalAnsweredCurrent ? '✓ Cevapladı' : '🤔 Düşünüyor...'}
              </div>
            </div>
          </div>
        </div>

        {/* Competitive Progress Bars */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1.5rem', padding: '0 1rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6366f1' }}>Senin İlerlemen</span>
              <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>{playerScore} / 10 Doğru</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: '#18181b', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${(playerScore / 10) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #818cf8)', transition: 'width 0.5s ease' }} />
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>{rivalScore} / 10 Doğru</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f43f5e' }}>Rakibin İlerlemesi</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: '#18181b', borderRadius: '4px', overflow: 'hidden', display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ width: `${(rivalScore / 10) * 100}%`, height: '100%', background: 'linear-gradient(270deg, #f43f5e, #fb7185)', transition: 'width 0.5s ease' }} />
            </div>
          </div>
        </div>

        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
          <div style={{ width: '100%', height: '6px', background: '#18181b', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${(timeLeft / 15) * 100}%`,
              background: timeLeft <= 4 ? '#f43f5e' : '#6366f1',
              transition: 'width 1s linear', borderRadius: '3px'
            }} />
          </div>
          <span style={{ position: 'absolute', top: '10px', right: '0', fontSize: '0.85rem', fontFamily: 'monospace', color: timeLeft <= 4 ? '#f43f5e' : '#a1a1aa', fontWeight: 800 }}>
            ⏱️ {timeLeft} saniye
          </span>
        </div>

        <div className={styles.glassCardNohover} style={{ padding: '2rem', marginBottom: '1.5rem', marginTop: '1.5rem' }}>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#f4f4f5' }}>
            {currentQ?.soru}
          </p>
        </div>

        {currentQ?.secenekler && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '2rem' }}>
            {Object.entries(currentQ.secenekler).map(([letter, text]) => {
              const isSelected = myAnswerCurrent === letter;
              let borderCol = isSelected ? '#6366f1' : '#27272a';
              let bg = isSelected ? 'rgba(99,102,241,0.08)' : '#111113';
              let textCol = isSelected ? '#818cf8' : '#f4f4f5';

              return (
                <div
                  key={letter}
                  onClick={() => handlePlayerSelect(letter)}
                  style={{
                    padding: '1.1rem 1.25rem', borderRadius: '14px',
                    border: `2px solid ${borderCol}`, background: bg, color: textCol,
                    cursor: !myAnswerCurrent ? 'pointer' : 'default',
                    transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '1rem',
                  }}
                >
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '50%',
                    background: isSelected ? '#6366f1' : '#18181b',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '0.8rem', flexShrink: 0,
                    color: isSelected ? 'white' : '#a1a1aa'
                  }}>
                    {letter}
                  </div>
                  <span style={{ fontSize: '0.92rem' }}>{text as string}</span>
                </div>
              );
            })}
          </div>
        )}

        {myAnswerCurrent && (
          <div style={{ textAlign: 'center', color: '#71717a', fontSize: '0.82rem', animation: 'pulse 1.5s infinite' }}>
            Yanıtın kaydedildi, süre dolması veya rakibin cevaplaması bekleniyor...
          </div>
        )}
      </div>
      <style>{`
        @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.5; } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
