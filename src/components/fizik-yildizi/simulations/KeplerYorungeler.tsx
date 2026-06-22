import React, { useState, useEffect, useRef } from 'react';

const GM = 500000;
const SUN_RADIUS = 25;
const ESCAPE_RADIUS = 1500;

export default function KeplerYorungeler() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  
  const [distance, setDistance] = useState(200); // 50 to 400
  const [velocity, setVelocity] = useState(40); // 10 to 100
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState<string>('Hazır');

  // Physics state
  const stateRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    path: [] as {x: number, y: number}[],
  });

  const resetSimulation = () => {
    setIsRunning(false);
    setStatus('Hazır');
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    
    stateRef.current = {
      x: 0,
      y: -distance,
      vx: velocity,
      vy: 0,
      path: [],
    };
    draw(stateRef.current);
  };

  useEffect(() => {
    resetSimulation();
  }, [distance, velocity]);

  const draw = (state: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Draw Sun
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, SUN_RADIUS * 2);
    gradient.addColorStop(0, '#fef08a'); // yellow-200
    gradient.addColorStop(0.3, '#eab308'); // yellow-500
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, SUN_RADIUS * 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(cx, cy, SUN_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#eab308';

    // Draw orbit path
    if (state.path.length > 0) {
      ctx.beginPath();
      ctx.moveTo(cx + state.path[0].x, cy + state.path[0].y);
      for (let i = 1; i < state.path.length; i++) {
        ctx.lineTo(cx + state.path[i].x, cy + state.path[i].y);
      }
      ctx.strokeStyle = 'rgba(167, 139, 250, 0.5)'; // violet-400
      ctx.lineWidth = 2;
      ctx.shadowBlur = 0;
      ctx.stroke();
    }

    // Draw Planet
    ctx.beginPath();
    ctx.arc(cx + state.x, cy + state.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#38bdf8'; // sky-400
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#38bdf8';
    ctx.fill();
    ctx.shadowBlur = 0;
  };

  const updatePhysics = () => {
    const state = stateRef.current;
    const dt = 0.05;

    const r_sq = state.x * state.x + state.y * state.y;
    const r = Math.sqrt(r_sq);

    if (r <= SUN_RADIUS) {
      setStatus('Çarpıştı!');
      setIsRunning(false);
      draw(state);
      return;
    }

    if (r > ESCAPE_RADIUS) {
      setStatus('Yörüngeden Çıktı!');
      setIsRunning(false);
      draw(state);
      return;
    }

    const ax = -GM * state.x / (r * r_sq);
    const ay = -GM * state.y / (r * r_sq);

    state.vx += ax * dt;
    state.vy += ay * dt;
    state.x += state.vx * dt;
    state.y += state.vy * dt;

    if (state.path.length === 0 || Math.hypot(state.path[state.path.length - 1].x - state.x, state.path[state.path.length - 1].y - state.y) > 2) {
      state.path.push({ x: state.x, y: state.y });
    }

    // Keep path manageable
    if (state.path.length > 1000) {
      state.path.shift();
    }

    draw(state);

    if (isRunning) {
      requestRef.current = requestAnimationFrame(updatePhysics);
    }
  };

  useEffect(() => {
    if (isRunning) {
      setStatus('Yörüngede...');
      requestRef.current = requestAnimationFrame(updatePhysics);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isRunning]);

  return (
    <div style={{ background: '#09090b', padding: '1.5rem', borderRadius: '24px', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>Kepler ve Yörüngeler</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>Gezegenin yörünge hareketini gözlemleyin.</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600, color: status === 'Çarpıştı!' ? '#ef4444' : status === 'Yörüngeden Çıktı!' ? '#f97316' : '#10b981' }}>
          Durum: {status}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' }}>
        <div style={{ background: '#000', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <canvas
            ref={canvasRef}
            width={600}
            height={500}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#e2e8f0' }}>Kontroller</h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                <span>Başlangıç Mesafesi</span>
                <span>{distance} birim</span>
              </div>
              <input 
                type="range" 
                min="50" max="350" step="10"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                disabled={isRunning}
                style={{ width: '100%', accentColor: '#38bdf8' }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                <span>Teğetsel Hız</span>
                <span>{velocity} birim/s</span>
              </div>
              <input 
                type="range" 
                min="10" max="100" step="1"
                value={velocity}
                onChange={(e) => setVelocity(Number(e.target.value))}
                disabled={isRunning}
                style={{ width: '100%', accentColor: '#38bdf8' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => setIsRunning(!isRunning)}
                style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none', background: isRunning ? '#ef4444' : '#3b82f6', color: '#fff', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
              >
                {isRunning ? 'Durdur' : 'Başlat'}
              </button>
              <button 
                onClick={resetSimulation}
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#fff', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
              >
                Sıfırla
              </button>
            </div>
          </div>
          
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
             <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', color: '#e2e8f0' }}>Bilgi</h3>
             <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
               Cisim yörüngede kalabilmek için yeterli merkezcil hıza sahip olmalıdır. Hız çok düşükse kütleçekim baskın gelir ve cisim yıldıza çarpar. Hız çok yüksekse kütleçekim cismi tutamaz ve sistemden kaçar. Uygun hızlarda eliptik veya dairesel yörünge oluşur.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
