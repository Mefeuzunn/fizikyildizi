'use client';

import { useState, useRef, useEffect } from 'react';
import styles from '@/app/fizik-yildizi/fizik.module.css';

interface Message {
  role: 'user' | 'astro';
  text: string;
  time: string;
}

// Real API replaces this mock

interface AstroTutorProps {
  kullanici?: any;
  zayifKonu?: string;
}

export default function AstroTutor({ kullanici, zayifKonu }: AstroTutorProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [dailyCount, setDailyCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const DAILY_LIMIT = 8;

  useEffect(() => {
    // Load daily count from localStorage
    const today = new Date().toDateString();
    const stored = localStorage.getItem('fizik_astro_count');
    const parsed = stored ? JSON.parse(stored) : { date: today, count: 0 };
    if (parsed.date !== today) {
      localStorage.setItem('fizik_astro_count', JSON.stringify({ date: today, count: 0 }));
      setDailyCount(0);
    } else {
      setDailyCount(parsed.count);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prompt = localStorage.getItem('astrotutor_prompt');
      if (prompt) {
        localStorage.removeItem('astrotutor_prompt');
        setOpen(true);
        const greeting = kullanici
          ? `Merhaba **${kullanici.ad}**! Getirdiğin soruyu hemen inceleyelim. 🚀`
          : "Merhaba! Getirdiğin soruyu hemen inceleyelim.";
        
        const userMsg: Message = {
          role: 'user',
          text: prompt,
          time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages([
          {
            role: 'astro',
            text: greeting,
            time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
          },
          userMsg
        ]);
        
        setTyping(true);
        fetch('/api/fizik-yildizi/astro-tutor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, history: [] })
        })
        .then(res => res.json())
        .then(data => {
          setMessages(prev => [...prev, {
            role: 'astro',
            text: data.success ? data.text : "Üzgünüm, şu an bağlantı kuramıyorum.",
            time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
          }]);
          setTyping(false);
        })
        .catch(() => setTyping(false));
        return;
      }
    }

    if (open && messages.length === 0) {
      const userCoin = kullanici?.astroCoin || 0;
      let extraTip = '';
      if (userCoin >= 50) extraTip = `AstroCoin bakiyen ${userCoin} AC! Mağazadan yeni ses veya kozmetik alabilirsin. `;
      else if (zayifKonu) extraTip = `Son analizine göre **${zayifKonu}** konusunda eksiğin var. Sıvı Flashcardlar sayfasında tekrar yapıp coin kazanabilirsin! `;
      
      const greeting = kullanici
        ? `Merhaba **${kullanici.ad}**! Ben AstroTutor. ${extraTip}Bugün sana nasıl yardımcı olabilirim? 🚀`
        : 'Merhaba! Ben AstroTutor, senin fizik asistanın. Sana nasıl yardımcı olabilirim?';

      setTimeout(() => {
        setMessages([{
          role: 'astro',
          text: greeting,
          time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 400);
    }
    // Listen for custom events to trigger AstroTutor dynamically
    const handleAstroAsk = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setOpen(true);
        const prompt = customEvent.detail;
        
        const userMsg: Message = {
          role: 'user',
          text: prompt,
          time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, userMsg]);
        setTyping(true);

        fetch('/api/fizik-yildizi/astro-tutor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, history: [] }) // Note: we could pass history here
        })
        .then(res => res.json())
        .then(data => {
          setMessages(prev => [...prev, {
            role: 'astro',
            text: data.success ? data.text : "Üzgünüm, şu an bağlantı kuramıyorum.",
            time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
          }]);
          setTyping(false);
        })
        .catch(() => setTyping(false));
      }
    };

    window.addEventListener('astro_ask', handleAstroAsk);
    return () => window.removeEventListener('astro_ask', handleAstroAsk);
  }, [open, kullanici]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = async () => {
    if (!input.trim() || typing) return;

    if (dailyCount >= DAILY_LIMIT) return;

    const userMsg: Message = {
      role: 'user',
      text: input.trim(),
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    // Update daily count
    const newCount = dailyCount + 1;
    setDailyCount(newCount);
    const today = new Date().toDateString();
    localStorage.setItem('fizik_astro_count', JSON.stringify({ date: today, count: newCount }));

    // Call API
    try {
      const res = await fetch('/api/fizik-yildizi/astro-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg.text, history: messages })
      });
      const data = await res.json();
      
      const astroMsg: Message = {
        role: 'astro',
        text: data.success ? data.text : "Bir hata oluştu, lütfen tekrar dener misin?",
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, astroMsg]);
    } catch {
      setMessages(prev => [...prev, { role: 'astro', text: 'Bağlantı hatası.', time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) }]);
    }
    setTyping(false);
  };

  const formatText = (text: string) => {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  };

  const QUICK_QUESTIONS = ['Newton Yasaları', 'Mercek Bağıntısı', 'Enerji Korunumu', 'Ohm Yasası'];

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          boxShadow: '0 8px 32px rgba(99,102,241,0.45)',
          zIndex: 1000,
          transition: 'all 0.2s ease',
          transform: open ? 'scale(0.9) rotate(10deg)' : 'scale(1)',
        }}
        title="AstroTutor — Fizik Asistanın"
      >
        {open ? '✕' : '🤖'}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: '5rem',
            right: '1.5rem',
            width: '360px',
            height: '520px',
            background: '#111113',
            border: '1px solid #27272a',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1)',
            zIndex: 999,
            animation: 'fadeInUp 0.2s ease',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '1rem 1.25rem',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(79,70,229,0.08))',
            borderBottom: '1px solid #1c1c1f',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem', flexShrink: 0,
            }}>🤖</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f4f4f5' }}>AstroTutor</div>
              <div style={{ fontSize: '0.72rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%', display: 'inline-block' }} />
                Çevrimiçi · Fizik Asistanın
              </div>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#52525b', textAlign: 'right' }}>
              <div style={{ color: dailyCount >= DAILY_LIMIT ? '#f43f5e' : '#71717a' }}>
                {dailyCount}/{DAILY_LIMIT}
              </div>
              <div>günlük</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            scrollbarWidth: 'thin',
            scrollbarColor: '#27272a transparent',
          }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                  gap: '0.5rem',
                  alignItems: 'flex-end',
                }}
              >
                {msg.role === 'astro' && (
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', flexShrink: 0 }}>🤖</div>
                )}
                <div style={{
                  maxWidth: '78%',
                  padding: '0.625rem 0.875rem',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
                  background: msg.role === 'user' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : '#1c1c1f',
                  border: msg.role === 'astro' ? '1px solid #27272a' : 'none',
                  fontSize: '0.82rem',
                  color: '#f4f4f5',
                  lineHeight: 1.6,
                }}>
                  <div dangerouslySetInnerHTML={{ __html: formatText(msg.text) }} />
                  <div style={{ fontSize: '0.65rem', color: msg.role === 'user' ? 'rgba(255,255,255,0.5)' : '#52525b', marginTop: '0.25rem', textAlign: 'right' }}>
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}

            {typing && (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', flexShrink: 0 }}>🤖</div>
                <div style={{ padding: '0.75rem 1rem', background: '#1c1c1f', borderRadius: '4px 16px 16px 16px', border: '1px solid #27272a' }}>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{
                        width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1',
                        animation: `bounce 1.2s ${i * 0.2}s ease-in-out infinite`,
                      }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick questions */}
          {messages.length <= 1 && (
            <div style={{ padding: '0 1rem 0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {QUICK_QUESTIONS.map(q => (
                <button
                  key={q}
                  onClick={() => { setInput(q); inputRef.current?.focus(); }}
                  style={{
                    padding: '0.3rem 0.625rem', borderRadius: '20px',
                    border: '1px solid #27272a', background: '#18181b',
                    color: '#a1a1aa', fontSize: '0.72rem', cursor: 'pointer',
                    fontWeight: 500, transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = '#6366f1'; (e.target as HTMLElement).style.color = '#6366f1'; }}
                  onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = '#27272a'; (e.target as HTMLElement).style.color = '#a1a1aa'; }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid #1c1c1f' }}>
            {dailyCount >= DAILY_LIMIT ? (
              <div style={{ textAlign: 'center', padding: '0.75rem', background: 'rgba(244,63,94,0.08)', borderRadius: '10px', border: '1px solid rgba(244,63,94,0.2)', fontSize: '0.8rem', color: '#f87171' }}>
                Günlük limit doldu. Yarın tekrar görüşürüz! 🌙
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Fizik sorusu sor..."
                  style={{
                    flex: 1, padding: '0.625rem 0.875rem', borderRadius: '10px',
                    border: '1px solid #27272a', background: '#18181b',
                    color: '#f4f4f5', fontSize: '0.82rem', outline: 'none',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={e => { (e.target as HTMLElement).style.borderColor = '#6366f1'; }}
                  onBlur={e => { (e.target as HTMLElement).style.borderColor = '#27272a'; }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || typing}
                  style={{
                    width: '38px', height: '38px', borderRadius: '10px', border: 'none',
                    background: input.trim() && !typing ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : '#27272a',
                    color: 'white', cursor: input.trim() && !typing ? 'pointer' : 'not-allowed',
                    fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s', flexShrink: 0,
                  }}
                >
                  ➤
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
