'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { sorular, Soru } from '@/data/fizik-yildizi/sorular';
import { updateXp } from '@/lib/fizik-yildizi/db';
import styles from '@/app/fizik-yildizi/fizik.module.css';

// ─── Types & Constants ───────────────────────────────────────────────────────
type DuelPhase = 'lobby' | 'matching' | 'active' | 'round_end' | 'finished';

interface Rival {
  ad: string;
  lig: string;
  avatarRenk: string;
  skill: number; // 0.0 - 1.0 (accuracy & speed factor)
}

const FALLBACK_RIVALS: Rival[] = [
  { ad: 'Elif Yıldız', lig: 'Altın', avatarRenk: '#3b82f6', skill: 0.8 },
  { ad: 'Zeynep Arslan', lig: 'Yıldızlar', avatarRenk: '#f59e0b', skill: 0.92 },
  { ad: 'Ahmet Kaya', lig: 'Altın', avatarRenk: '#10b981', skill: 0.78 },
  { ad: 'Mert Demir', lig: 'Gümüş', avatarRenk: '#8b5cf6', skill: 0.65 },
  { ad: 'Selin Çelik', lig: 'Gümüş', avatarRenk: '#ec4899', skill: 0.6 },
  { ad: 'Berk Şahin', lig: 'Bronz', avatarRenk: '#6b7280', skill: 0.5 },
  { ad: 'Dilara Aydın', lig: 'Bronz', avatarRenk: '#ef4444', skill: 0.45 },
  { ad: 'Ömer Bulut', lig: 'Gümüş', avatarRenk: '#06b6d4', skill: 0.72 },
  { ad: 'Esra Yılmaz', lig: 'Altın', avatarRenk: '#a855f7', skill: 0.82 },
];

interface DuelHistory {
  id: string;
  tarih: string;
  rakipAd: string;
  rakipAvatarRenk: string;
  skorCis: string; // e.g. "6 - 4"
  durum: 'galibiyet' | 'beraberlik' | 'maglubiyet';
  xpReward: number;
}

export default function AIDuel({ onExit }: { onExit: () => void }) {
  const router = useRouter();
  const [kullanici, setKullanici] = useState<any>(null);
  const [phase, setPhase] = useState<DuelPhase>('lobby');
  const [history, setHistory] = useState<DuelHistory[]>([]);
  
  // Real rivals loaded from API (falls back to FALLBACK_RIVALS)
  const [realRivals, setRealRivals] = useState<Rival[]>(FALLBACK_RIVALS);

  // Matchmaking State
  const [matchStatus, setMatchStatus] = useState('Lobiye bağlanılıyor...');
  const [matchedRival, setMatchedRival] = useState<Rival | null>(null);
  const matchmakingTimer = useRef<NodeJS.Timeout | null>(null);

  // Duel Active States
  const [duelQuestions, setDuelQuestions] = useState<Soru[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [rivalScore, setRivalScore] = useState(0);
  
  // Timer (15 seconds per round)
  const [timeLeft, setTimeLeft] = useState(15);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);
  const isTimeUp = timeLeft === 0;

  // Round Interactive States
  const [playerSelected, setPlayerSelected] = useState<string | null>(null); // 'A', 'B', 'C', 'D'
  const [playerAnswerTime, setPlayerAnswerTime] = useState<number | null>(null);
  
  const [rivalSelected, setRivalSelected] = useState<string | null>(null);
  const [rivalAnswerTime, setRivalAnswerTime] = useState<number | null>(null);
  const [rivalStatus, setRivalStatus] = useState<'thinking' | 'answered'>('thinking');

  const rivalThinkTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Feedback metrics for round end
  const [roundWinner, setRoundWinner] = useState<'player' | 'rival' | 'draw' | 'none'>('none');
  const [roundFeedback, setRoundFeedback] = useState('');

  // ─── Initialization ────────────────────────────────────────────────────────
  useEffect(() => {
    const kData = localStorage.getItem('fizik_kullanici');
    if (!kData) {
      router.push('/fizik-yildizi/giris');
      return;
    }
    const k = JSON.parse(kData);
    setKullanici(k);

    // Load history
    const storedHistory = JSON.parse(localStorage.getItem('fizik_duello_gecmisi') || '[]') as DuelHistory[];
    setHistory(storedHistory);

    // Fetch real classmates for matchmaking
    const initRivals = async () => {
      const kullanici = JSON.parse(localStorage.getItem('fizik_kullanici') || 'null');
      if (!kullanici || !kullanici.ogretmenId) {
        setRealRivals(FALLBACK_RIVALS);
        return;
      }
      try {
        const res = await fetch('/api/fizik-yildizi');
        const data = await res.json();
        if (data.success && data.kullanicilar) {
          const classmates = data.kullanicilar
            .filter((u: any) =>
              u.rol === 'ogrenci' &&
              u.ogretmenId === kullanici.ogretmenId &&
              u.onayDurumu === 'onaylandi' &&
              u.id !== kullanici.id
            )
            .map((u: any) => ({
              ad: `${u.ad} ${u.soyad}`,
              lig: u.lig || 'Bronz',
              avatarRenk: u.avatarRenk || '#6366f1',
              skill: 0.5 + Math.random() * 0.4, // Random skill 0.5–0.9
            }));
          if (classmates.length >= 3) {
            setRealRivals(classmates);
          } else {
            // Merge real classmates with fallback rivals
            setRealRivals([...classmates, ...FALLBACK_RIVALS].slice(0, 9));
          }
        } else {
          setRealRivals(FALLBACK_RIVALS);
        }
      } catch {
        setRealRivals(FALLBACK_RIVALS);
      }
    };
    initRivals();
  }, [router]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (matchmakingTimer.current) clearTimeout(matchmakingTimer.current);
      if (timerInterval.current) clearInterval(timerInterval.current);
      if (rivalThinkTimeout.current) clearTimeout(rivalThinkTimeout.current);
    };
  }, []);

  // ─── Matchmaking ────────────────────────────────────────────────────────────
  const startMatchmaking = () => {
    setPhase('matching');
    setMatchStatus('Uygun rakipler taranıyor...');
    
    // Step 1: Searching
    matchmakingTimer.current = setTimeout(() => {
      setMatchStatus('Seviyene uygun rakip aranıyor...');
      
      // Step 2: Found Match
      matchmakingTimer.current = setTimeout(() => {
        // Find a rival (preferably not matching student's own name, though unlikely)
        const possible = realRivals.filter(r => r.ad !== (kullanici?.ad + ' ' + kullanici?.soyad));
        const chosen = possible[Math.floor(Math.random() * possible.length)];
        setMatchedRival(chosen);
        setMatchStatus(`${chosen.ad} ile eşleşildi!`);

        // Step 3: Launch Game
        matchmakingTimer.current = setTimeout(() => {
          // Select 10 random questions
          const shuffled = [...sorular].sort(() => Math.random() - 0.5);
          const picked = shuffled.slice(0, 10);
          
          setDuelQuestions(picked);
          setPlayerScore(0);
          setRivalScore(0);
          setCurrentRound(0);
          setPhase('active');
          setupRound(0, chosen, picked);
        }, 1500);

      }, 2000);

    }, 1500);
  };

  const cancelMatchmaking = () => {
    if (matchmakingTimer.current) clearTimeout(matchmakingTimer.current);
    setPhase('lobby');
    setMatchedRival(null);
  };

  // ─── Round Setup ─────────────────────────────────────────────────────────────
  const setupRound = (roundIdx: number, rival: Rival, questions: Soru[]) => {
    // Reset round states
    setPlayerSelected(null);
    setPlayerAnswerTime(null);
    setRivalSelected(null);
    setRivalAnswerTime(null);
    setRivalStatus('thinking');
    setRoundWinner('none');
    setRoundFeedback('');
    setTimeLeft(15);

    const activeQ = questions[roundIdx];

    // Start countdown timer
    if (timerInterval.current) clearInterval(timerInterval.current);
    timerInterval.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerInterval.current) clearInterval(timerInterval.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Simulate Rival AI thinking delay and accuracy
    const isCorrect = Math.random() < rival.skill;
    // Delay based on difficulty & skill. Easy (1-2) is fast, Hard (4-5) is slow.
    const diffFactor = activeQ.zorluk; // 1 to 5
    const baseThinkDelay = (4 - rival.skill * 2) + (diffFactor * 1.2); 
    const finalDelay = Math.max(2.5, baseThinkDelay + Math.random() * 3) * 1000; // in ms

    if (rivalThinkTimeout.current) clearTimeout(rivalThinkTimeout.current);
    rivalThinkTimeout.current = setTimeout(() => {
      // Determine choice
      let choice = activeQ.dogruCevap;
      if (!isCorrect) {
        // Pick incorrect option
        const incorrects = ['A', 'B', 'C', 'D'].filter(x => x !== activeQ.dogruCevap);
        choice = incorrects[Math.floor(Math.random() * incorrects.length)];
      }

      setRivalSelected(choice);
      setRivalAnswerTime(Date.now());
      setRivalStatus('answered');

    }, finalDelay);
  };

  // ─── Player Selection ────────────────────────────────────────────────────────
  const handlePlayerSelect = (choice: string) => {
    if (playerSelected || isTimeUp) return;
    setPlayerSelected(choice);
    setPlayerAnswerTime(Date.now());
  };

  // ─── Evaluate Round ──────────────────────────────────────────────────────────
  const evaluateRound = useCallback(() => {
    if (timerInterval.current) clearInterval(timerInterval.current);
    if (rivalThinkTimeout.current) clearTimeout(rivalThinkTimeout.current);

    const activeQ = duelQuestions[currentRound];
    const correctAns = activeQ.dogruCevap;

    const pCorrect = playerSelected === correctAns;
    const rCorrect = rivalSelected === correctAns;

    let winner: 'player' | 'rival' | 'draw' | 'none' = 'none';
    let feedback = '';

    if (pCorrect && rCorrect) {
      // Both correct, compare timestamps
      const pTime = playerAnswerTime || 0;
      const rTime = rivalAnswerTime || 0;
      
      if (pTime < rTime) {
        winner = 'player';
        setPlayerScore(s => s + 1);
        feedback = 'Saniyelerle kazandın! Daha hızlıydın! ⚡';
      } else {
        winner = 'rival';
        setRivalScore(s => s + 1);
        feedback = 'Rakibin daha hızlı cevapladı! ⏱️';
      }
    } else if (pCorrect) {
      winner = 'player';
      setPlayerScore(s => s + 1);
      feedback = 'Doğru cevap! Rakibin yanlış cevapladı veya süreye yetişemedi!';
    } else if (rCorrect) {
      winner = 'rival';
      setRivalScore(s => s + 1);
      feedback = 'Rakibin doğru cevapladı!';
    } else {
      winner = 'none';
      feedback = 'İki taraf da yanlış cevapladı!';
    }

    setRoundWinner(winner);
    setRoundFeedback(feedback);
    setPhase('round_end');

    // Auto-advance after 3.5 seconds
    setTimeout(() => {
      if (currentRound < 9) {
        const next = currentRound + 1;
        setCurrentRound(next);
        setPhase('active');
        setupRound(next, matchedRival!, duelQuestions);
      } else {
        finishDuel();
      }
    }, 3500);
  }, [playerSelected, playerAnswerTime, rivalSelected, rivalAnswerTime, currentRound, duelQuestions, matchedRival]);

  // Trigger round evaluation when both answer, or time runs out
  useEffect(() => {
    if (phase === 'active') {
      const playerDone = playerSelected !== null;
      const rivalDone = rivalSelected !== null;

      if ((playerDone && rivalDone) || isTimeUp) {
        // Evaluate immediately
        evaluateRound();
      }
    }
  }, [playerSelected, rivalSelected, isTimeUp, phase, evaluateRound]);

  // ─── Finish Duel ─────────────────────────────────────────────────────────────
  const finishDuel = () => {
    setPhase('finished');
    if (timerInterval.current) clearInterval(timerInterval.current);
    
    let outcome: 'galibiyet' | 'beraberlik' | 'maglubiyet' = 'beraberlik';
    let xpReward = 50; // Draw

    if (playerScore > rivalScore) {
      outcome = 'galibiyet';
      xpReward = 150; // Win
    } else if (playerScore < rivalScore) {
      outcome = 'maglubiyet';
      xpReward = 20; // Loss
    }

    // Award XP
    updateXp(kullanici.id, xpReward);

    // Save history
    const record: DuelHistory = {
      id: `duel_${Date.now()}`,
      tarih: new Date().toISOString(),
      rakipAd: matchedRival!.ad,
      rakipAvatarRenk: matchedRival!.avatarRenk,
      skorCis: `${playerScore} - ${rivalScore}`,
      durum: outcome,
      xpReward
    };

    const newHistory = [record, ...history].slice(0, 50);
    setHistory(newHistory);
    localStorage.setItem('fizik_duello_gecmisi', JSON.stringify(newHistory));
  };

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  const getOutcomeText = (durum: 'galibiyet' | 'beraberlik' | 'maglubiyet') => {
    if (durum === 'galibiyet') return { text: 'ZAFER!', color: '#10b981', emoji: '🏆' };
    if (durum === 'beraberlik') return { text: 'BERABERLİK', color: '#f59e0b', emoji: '🤝' };
    return { text: 'MAĞLUBİYET', color: '#f43f5e', emoji: '💀' };
  };

  if (!kullanici) return null;

  // Calculate stats
  const totalPlayed = history.length;
  const wins = history.filter(h => h.durum === 'galibiyet').length;
  const winRate = totalPlayed > 0 ? Math.round((wins / totalPlayed) * 100) : 0;

  // Get current league metrics
  const xp = kullanici.toplamXp || 0;
  const lig = kullanici.lig || 'Bronz';
  const getXpBound = (l: string) => {
    if (l === 'Bronz') return { min: 0, max: 500 };
    if (l === 'Gümüş') return { min: 500, max: 2000 };
    if (l === 'Altın') return { min: 2000, max: 5000 };
    if (l === 'Platin') return { min: 5000, max: 10000 };
    return { min: 10000, max: 20000 };
  };
  const bounds = getXpBound(lig);
  const progressPercent = Math.min(100, Math.round(((xp - bounds.min) / (bounds.max - bounds.min)) * 100));

  return (
    <div style={{ background: '#09090b', minHeight: '100vh', color: '#f4f4f5', fontFamily: "'Inter', sans-serif" }}>

      {/* ─── PHASE: LOBBY ──────────────────────────────────────────────────────── */}
      {phase === 'lobby' && (
        <main style={{ maxWidth: '900px', margin: '0 auto', padding: '6rem 1.5rem 4rem' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative' }}>
            <button
              onClick={onExit}
              className={styles.btnSecondary}
              style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', padding: '0.5rem 1rem' }}
            >
              ← Geri Dön
            </button>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', background: 'linear-gradient(135deg, #6366f1, #f43f5e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ⚔️ AI Antrenman Düellosu
            </h1>
            <p style={{ color: '#a1a1aa', fontSize: '0.95rem' }}>
              Sanal rakiplerle antrenman yap!
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'start', marginBottom: '3rem' }}>
            
            {/* Left side: Queue area & Stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* League Progress */}
              <div className={styles.glassCardNohover} style={{ padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{
                  width: '72px', height: '72px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2rem', flexShrink: 0, boxShadow: '0 8px 24px rgba(99,102,241,0.25)'
                }}>🏆</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div>
                      <span className={styles.ligBadge} style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem' }}>{lig} Ligi</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#a1a1aa', fontWeight: 700 }}>
                      {xp} / {bounds.max} XP
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#27272a', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #a855f7)', borderRadius: '4px', transition: 'width 0.4s' }} />
                  </div>
                </div>
              </div>

              {/* Matchmaker Start card */}
              <div className={styles.glassCardNohover} style={{ padding: '2.5rem', textAlign: 'center', border: '1px solid rgba(99,102,241,0.25)', background: 'linear-gradient(180deg, rgba(99,102,241,0.02) 0%, transparent 100%)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem' }}>Birebir Düelloya Hazır mısın?</h2>
                <p style={{ color: '#a1a1aa', fontSize: '0.85rem', maxWidth: '400px', margin: '0 auto 2rem', lineHeight: 1.5 }}>
                  10 soruluk kapışmada rakibini doğru yanıtların ve hızınla alt et, liginde XP kazanıp üst sıralara yüksel!
                </p>

                <button
                  onClick={startMatchmaking}
                  className={styles.btnPrimary}
                  style={{
                    padding: '1rem 2.5rem', fontSize: '1.1rem', fontWeight: 800,
                    borderRadius: '14px', cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(99,102,241,0.4)',
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)'
                  }}
                >
                  ⚔️ Düello Eşleşmesi Bul
                </button>
              </div>

            </div>

            {/* Right side: Duel stats and History */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Stat board */}
              <div className={styles.glassCardNohover} style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Düello Karnesi</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ background: '#111113', border: '1px solid #27272a', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#6366f1' }}>{totalPlayed}</div>
                    <div style={{ fontSize: '0.72rem', color: '#71717a', marginTop: '0.25rem' }}>Toplam Düello</div>
                  </div>
                  <div style={{ background: '#111113', border: '1px solid #27272a', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#10b981' }}>%{winRate}</div>
                    <div style={{ fontSize: '0.72rem', color: '#71717a', marginTop: '0.25rem' }}>Kazanma Oranı</div>
                  </div>
                </div>
              </div>

              {/* History list */}
              <div className={styles.glassCardNohover} style={{ padding: '1.5rem', display: 'flex', flex: 1, flexDirection: 'column' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '1rem' }}>Son Karşılaşmalar</h3>
                
                {history.length === 0 ? (
                  <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', padding: '2rem', color: '#52525b', fontSize: '0.85rem' }}>
                    Henüz düello yapmadın.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    {history.map(h => {
                      const outcome = getOutcomeText(h.durum);
                      return (
                        <div key={h.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#111113', border: '1px solid #27272a', borderRadius: '10px', padding: '0.75rem 0.875rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                            <div style={{
                              width: '28px', height: '28px', borderRadius: '50%',
                              background: h.rakipAvatarRenk || '#6366f1',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '0.75rem', fontWeight: 800
                            }}>
                              {h.rakipAd[0]}
                            </div>
                            <div>
                              <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{h.rakipAd}</div>
                              <span style={{ fontSize: '0.7rem', color: outcome.color, fontWeight: 700 }}>{outcome.emoji} {outcome.text}</span>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 800, fontFamily: 'monospace' }}>{h.skorCis}</div>
                            <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>+{h.xpReward} XP</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

          </div>

        </main>
      )}

      {/* ─── PHASE: MATCHMAKING ───────────────────────────────────────────────── */}
      {phase === 'matching' && (
        <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className={styles.glassCardNohover} style={{ maxWidth: '420px', width: '100%', padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', border: '1px solid rgba(255,255,255,0.06)' }}>
            
            {/* Radar scanner graphics */}
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
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.35rem' }}>Eşleşme Aranıyor...</h3>
              <p style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>{matchStatus}</p>
            </div>

            {/* Avatar display on match */}
            {matchedRival && (
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginTop: '1rem', animation: 'scaleUp 0.3s ease' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 800 }}>
                    {kullanici.ad[0]}
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{kullanici.ad}</span>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f43f5e' }}>VS</div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: matchedRival.avatarRenk, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 800 }}>
                    {matchedRival.ad[0]}
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{matchedRival.ad}</span>
                </div>
              </div>
            )}

            <button
              onClick={cancelMatchmaking}
              className={styles.btnSecondary}
              style={{ padding: '0.625rem 1.5rem', fontSize: '0.82rem', marginTop: '1rem' }}
            >
              Eşleşmeyi İptal Et
            </button>
          </div>
        </div>
      )}

      {/* ─── PHASE: GAME ACTIVE & ROUND END ───────────────────────────────────── */}
      {(phase === 'active' || phase === 'round_end') && duelQuestions.length > 0 && (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '6rem 1.5rem 4rem' }}>
          
          {/* Competitors panel & Scores */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '2rem', alignItems: 'center', marginBottom: '2rem' }}>
            
            {/* Player Info (Left) */}
            <div className={styles.glassCardNohover} style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #6366f1' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 800, flexShrink: 0 }}>
                {kullanici.ad[0]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{kullanici.ad} {kullanici.soyad}</div>
                <div style={{ fontSize: '0.75rem', color: playerSelected ? '#10b981' : '#a1a1aa' }}>
                  {playerSelected ? '✓ Cevapladı' : '🤔 Düşünüyor...'}
                </div>
              </div>
            </div>

            {/* Score & Round (Center) */}
            <div style={{ textAlign: 'center', minWidth: '160px' }}>
              <div style={{ fontSize: '0.72rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                ROUND {currentRound + 1} / 10
              </div>
              <div style={{ fontSize: '2.25rem', fontWeight: 900, fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                <span style={{ color: '#6366f1' }}>{playerScore}</span>
                <span style={{ color: '#52525b', margin: '0 0.5rem' }}>-</span>
                <span style={{ color: '#f43f5e' }}>{rivalScore}</span>
              </div>
            </div>

            {/* Opponent Info (Right) */}
            <div className={styles.glassCardNohover} style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', gap: '1rem', borderRight: `4px solid ${matchedRival!.avatarRenk}`, textAlign: 'right' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: matchedRival!.avatarRenk, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 800, flexShrink: 0 }}>
                {matchedRival!.ad[0]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{matchedRival!.ad}</div>
                <div style={{ fontSize: '0.75rem', color: rivalStatus === 'answered' ? '#f43f5e' : '#a1a1aa' }}>
                  {rivalStatus === 'answered' ? '✓ Cevapladı' : '🤔 Düşünüyor...'}
                </div>
              </div>
            </div>

          </div>

          {/* Time & Feedback display */}
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            {phase === 'active' ? (
              // Timer progress bar
              <div style={{ width: '100%', height: '6px', background: '#18181b', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${(timeLeft / 15) * 100}%`,
                  background: timeLeft <= 4 ? '#f43f5e' : '#6366f1',
                  transition: 'width 1s linear', borderRadius: '3px'
                }} />
              </div>
            ) : (
              // Round End Banner
              <div style={{
                padding: '0.625rem', borderRadius: '8px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 700,
                background: roundWinner === 'player' ? 'rgba(16,185,129,0.1)' : roundWinner === 'rival' ? 'rgba(244,63,94,0.1)' : 'rgba(245,158,11,0.1)',
                border: `1px solid ${roundWinner === 'player' ? 'rgba(16,185,129,0.3)' : roundWinner === 'rival' ? 'rgba(244,63,94,0.3)' : 'rgba(245,158,11,0.3)'}`,
                color: roundWinner === 'player' ? '#10b981' : roundWinner === 'rival' ? '#f43f5e' : '#f59e0b',
                animation: 'scaleUp 0.2s ease'
              }}>
                {roundFeedback}
              </div>
            )}
            {phase === 'active' && (
              <span style={{ position: 'absolute', top: '10px', right: '0', fontSize: '0.85rem', fontFamily: 'monospace', color: timeLeft <= 4 ? '#f43f5e' : '#a1a1aa', fontWeight: 800 }}>
                ⏱️ {timeLeft} saniye
              </span>
            )}
          </div>

          {/* Question Text */}
          <div className={styles.glassCardNohover} style={{ padding: '2rem', marginBottom: '1.5rem', marginTop: '1.5rem' }}>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#f4f4f5' }}>
              {duelQuestions[currentRound].soru}
            </p>
          </div>

          {/* Options grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '2rem' }}>
            {duelQuestions[currentRound].secenekler && Object.entries(duelQuestions[currentRound].secenekler!).map(([letter, text]) => {
              const isSelected = playerSelected === letter;
              const isCorrect = duelQuestions[currentRound].dogruCevap === letter;
              
              // Colors on round end
              let borderCol = '#27272a';
              let bg = '#111113';
              let textCol = '#f4f4f5';

              if (phase === 'active') {
                if (isSelected) {
                  borderCol = '#6366f1';
                  bg = 'rgba(99,102,241,0.08)';
                  textCol = '#818cf8';
                }
              } else {
                // Round end colors
                const rivalPicked = rivalSelected === letter;
                if (isCorrect) {
                  borderCol = '#10b981';
                  bg = 'rgba(16,185,129,0.06)';
                  textCol = '#10b981';
                } else {
                  if (isSelected) {
                    borderCol = '#f43f5e';
                    bg = 'rgba(244,63,94,0.06)';
                    textCol = '#f43f5e';
                  }
                }
              }

              return (
                <div
                  key={letter}
                  onClick={() => handlePlayerSelect(letter)}
                  style={{
                    padding: '1.1rem 1.25rem', borderRadius: '14px',
                    border: `2px solid ${borderCol}`, background: bg, color: textCol,
                    cursor: phase === 'active' && !playerSelected ? 'pointer' : 'default',
                    transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '1rem',
                    position: 'relative', overflow: 'hidden'
                  }}
                  onMouseEnter={e => { if (phase === 'active' && !playerSelected) (e.currentTarget as HTMLElement).style.borderColor = '#3f3f46'; }}
                  onMouseLeave={e => { if (phase === 'active' && !playerSelected) (e.currentTarget as HTMLElement).style.borderColor = borderCol; }}
                >
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '50%',
                    background: isSelected ? '#6366f1' : (phase === 'round_end' && isCorrect) ? '#10b981' : '#18181b',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '0.8rem', flexShrink: 0,
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: isSelected || (phase === 'round_end' && isCorrect) ? 'white' : '#a1a1aa'
                  }}>
                    {letter}
                  </div>
                  <span style={{ fontSize: '0.92rem' }}>{text}</span>

                  {/* Rival indicator label */}
                  {phase === 'round_end' && rivalSelected === letter && (
                    <span style={{
                      position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                      fontSize: '0.65rem', padding: '0.2rem 0.5rem', borderRadius: '8px',
                      background: isCorrect ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)',
                      color: isCorrect ? '#10b981' : '#f43f5e', fontWeight: 800, border: '1px solid transparent'
                    }}>
                      RAKİP ⚔️
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Prompt warning when player answered, waiting for rival */}
          {phase === 'active' && playerSelected && (
            <div style={{ textAlign: 'center', color: '#71717a', fontSize: '0.82rem', animation: 'pulse 1.5s infinite' }}>
              Yanıtın kaydedildi, rakip bekleniyor...
            </div>
          )}

        </div>
      )}

      {/* ─── PHASE: DUEL FINISHED ──────────────────────────────────────────────── */}
      {phase === 'finished' && matchedRival && (
        <main style={{ maxWidth: '600px', margin: '0 auto', padding: '8rem 1.5rem 4rem', textAlign: 'center' }}>
          
          {/* Winner announcement header */}
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
            {matchedRival.ad} ile düello kapışması bitti
          </p>

          {/* Scoreboard block */}
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
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: matchedRival.avatarRenk, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 800 }}>
                  {matchedRival.ad[0]}
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>{matchedRival.ad}</span>
                <span style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'monospace', color: '#f43f5e' }}>{rivalScore}</span>
              </div>

            </div>

            {/* League points card reward details */}
            <div style={{
              width: '100%', borderTop: '1px solid #27272a', paddingTop: '1.5rem',
              display: 'flex', justifyItems: 'center', justifyContent: 'center', gap: '0.5rem', alignItems: 'center',
              fontSize: '0.95rem'
            }}>
              <span>Kazanılan Lig Puanı:</span>
              <strong style={{ color: '#10b981', fontSize: '1.1rem' }}>
                +{playerScore > rivalScore ? 150 : playerScore === rivalScore ? 50 : 20} XP
              </strong>
            </div>

          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={() => setPhase('lobby')}
              className={styles.btnSecondary}
              style={{ padding: '0.875rem 2rem', borderRadius: '12px', fontWeight: 700 }}
            >
              Lobiye Dön
            </button>
            <button
              onClick={() => router.push('/fizik-yildizi/ogrenci/ligler')}
              className={styles.btnPrimary}
              style={{
                padding: '0.875rem 2rem', borderRadius: '12px', fontWeight: 700,
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)'
              }}
            >
              Lig Sıralamasını Gör
            </button>
          </div>

        </main>
      )}

      {/* Styled animation styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.5; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-20px); }
          60% { transform: translateY(-10px); }
        }
      `}</style>

    </div>
  );
}
