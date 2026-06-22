'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

const CW = 700;
const CH = 360;

// ─── Helpers ────────────────────────────────────────────────────────────────

function drawBackground(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#050a1a';
  ctx.fillRect(0, 0, CW, CH);
  // Grid
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x < CW; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CH); ctx.stroke(); }
  for (let y = 0; y < CH; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CW, y); ctx.stroke(); }
  ctx.restore();
}

function drawEquilibriumLine(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 1;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.moveTo(0, CH / 2);
  ctx.lineTo(CW, CH / 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '10px monospace';
  ctx.fillText('Denge Noktası', 6, CH / 2 - 6);
  ctx.restore();
}

interface WaveDrawParams {
  freq: number;
  amplitude: number;
  wavelength: number;
  phase: number;
  waveType: 'transverse' | 'longitudinal';
  showReflection: boolean;
  dopplerMode: boolean;
  dopplerPhase: number;
}

function drawWave(ctx: CanvasRenderingContext2D, p: WaveDrawParams) {
  const { freq, amplitude, wavelength, phase, waveType, showReflection, dopplerMode, dopplerPhase } = p;
  const centerY = CH / 2;

  if (waveType === 'transverse') {
    // Main wave — gradient stroke
    const grad = ctx.createLinearGradient(0, 0, CW, 0);
    grad.addColorStop(0, '#7c3aed');
    grad.addColorStop(0.4, '#06b6d4');
    grad.addColorStop(0.7, '#f59e0b');
    grad.addColorStop(1, '#7c3aed');

    ctx.save();
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#7c3aed';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    for (let x = 0; x < CW; x += 2) {
      const k = (2 * Math.PI) / wavelength;
      const y = centerY - amplitude * Math.sin(k * x - phase);
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();

    // Reflected wave (if enabled)
    if (showReflection) {
      ctx.save();
      ctx.strokeStyle = 'rgba(245,158,11,0.5)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      for (let x = 0; x < CW; x += 2) {
        const k = (2 * Math.PI) / wavelength;
        const y = centerY + amplitude * 0.7 * Math.sin(k * x + phase);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    // Doppler effect: show compressed/expanded waves from moving source
    if (dopplerMode) {
      const srcX = (CW / 2 + Math.sin(dopplerPhase) * CW * 0.3);
      // Circles emanating from source
      ctx.save();
      for (let i = 1; i <= 5; i++) {
        const r = (i * wavelength * 0.5) % (CW * 0.6);
        const frontR = r * 0.6; // compressed in front
        const backR = r * 1.2; // expanded behind
        const alpha = 1 - i * 0.15;
        ctx.strokeStyle = `rgba(6,182,212,${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(srcX, centerY, frontR, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();
        ctx.strokeStyle = `rgba(124,58,237,${alpha})`;
        ctx.beginPath();
        ctx.arc(srcX, centerY, backR, Math.PI / 2, Math.PI * 1.5);
        ctx.stroke();
      }
      // Source dot
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath(); ctx.arc(srcX, centerY, 8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#050a1a';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('S', srcX, centerY + 3);
      ctx.restore();
    }

    // Amplitude labels
    ctx.save();
    ctx.fillStyle = '#10b981';
    ctx.font = '11px monospace';
    ctx.fillText(`A = ${amplitude.toFixed(0)} px`, 8, centerY - amplitude - 8);
    ctx.strokeStyle = 'rgba(16,185,129,0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(0, centerY - amplitude); ctx.lineTo(CW * 0.15, centerY - amplitude); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, centerY + amplitude); ctx.lineTo(CW * 0.15, centerY + amplitude); ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // Wavelength bracket
    ctx.save();
    ctx.strokeStyle = 'rgba(245,158,11,0.6)';
    ctx.fillStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.font = '11px monospace';
    const lambdaX = 40;
    ctx.beginPath(); ctx.moveTo(lambdaX, centerY + amplitude + 18); ctx.lineTo(lambdaX + wavelength, centerY + amplitude + 18); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(lambdaX, centerY + amplitude + 12); ctx.lineTo(lambdaX, centerY + amplitude + 24); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(lambdaX + wavelength, centerY + amplitude + 12); ctx.lineTo(lambdaX + wavelength, centerY + amplitude + 24); ctx.stroke();
    ctx.fillText(`λ = ${wavelength.toFixed(0)} px`, lambdaX + wavelength / 2 - 25, centerY + amplitude + 35);
    ctx.restore();

  } else {
    // Longitudinal wave — density visualization
    const numParticles = 60;
    const baseSpacing = CW / numParticles;
    const k = (2 * Math.PI) / wavelength;

    ctx.save();
    for (let i = 0; i < numParticles; i++) {
      const baseX = i * baseSpacing + baseSpacing / 2;
      const displacement = amplitude * 0.3 * Math.sin(k * baseX - phase);
      const x = baseX + displacement;

      // Density-based alpha
      const densityFactor = Math.cos(k * baseX - phase);
      const alpha = 0.3 + Math.abs(densityFactor) * 0.7;

      const grad = ctx.createRadialGradient(x, centerY, 0, x, centerY, 8);
      grad.addColorStop(0, `rgba(6,182,212,${alpha})`);
      grad.addColorStop(1, `rgba(124,58,237,${alpha * 0.3})`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, centerY, 5 + densityFactor * 2, 0, Math.PI * 2);
      ctx.fill();

      // Connection line
      if (i > 0) {
        const prevBaseX = (i - 1) * baseSpacing + baseSpacing / 2;
        const prevDisp = amplitude * 0.3 * Math.sin(k * prevBaseX - phase);
        const prevX = prevBaseX + prevDisp;
        const gap = x - prevX;
        const lineAlpha = Math.max(0, Math.min(1, 1 - gap / (baseSpacing * 2)));
        ctx.strokeStyle = `rgba(124,58,237,${lineAlpha * 0.4})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(prevX + 5, centerY); ctx.lineTo(x - 5, centerY); ctx.stroke();
      }
    }
    ctx.restore();

    // Label
    ctx.save();
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px monospace';
    ctx.fillText('Sıkışma →          ← Genleşme', CW * 0.3, centerY - amplitude - 20);
    ctx.restore();
  }
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function DalgaHareketi() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const phaseRef = useRef(0);
  const dopplerPhaseRef = useRef(0);

  const [freq, setFreq] = useState(1.5);
  const [amplitude, setAmplitude] = useState(60);
  const [wavelengthPx, setWavelengthPx] = useState(150);
  const [waveType, setWaveType] = useState<'transverse' | 'longitudinal'>('transverse');
  const [showReflection, setShowReflection] = useState(false);
  const [dopplerMode, setDopplerMode] = useState(false);
  const [running, setRunning] = useState(true);

  // Physics derived values
  const waveSpeed = (freq * wavelengthPx).toFixed(1);
  const period = (1 / freq).toFixed(3);

  const loop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    drawBackground(ctx);
    drawEquilibriumLine(ctx);
    drawWave(ctx, {
      freq,
      amplitude,
      wavelength: wavelengthPx,
      phase: phaseRef.current,
      waveType,
      showReflection,
      dopplerMode,
      dopplerPhase: dopplerPhaseRef.current,
    });

    // Info overlay
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(waveType === 'transverse' ? 'ENİNE DALGA' : 'BOYUNA DALGA', CW - 10, 20);
    ctx.restore();

    phaseRef.current += freq * 0.1;
    dopplerPhaseRef.current += 0.02;
    animRef.current = requestAnimationFrame(loop);
  }, [freq, amplitude, wavelengthPx, waveType, showReflection, dopplerMode, waveSpeed]);

  useEffect(() => {
    if (running) {
      animRef.current = requestAnimationFrame(loop);
    } else {
      cancelAnimationFrame(animRef.current);
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [running, loop]);

  const sliderStyle: React.CSSProperties = { width: '100%', accentColor: '#7c3aed', cursor: 'pointer' };
  const toggleBtn = (active: boolean, label: string, onClick: () => void): React.CSSProperties => ({
    padding: '0.4rem 0.875rem', borderRadius: '8px', cursor: 'pointer',
    fontWeight: 600, fontSize: '0.8rem',
    background: active ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.06)',
    color: active ? '#a78bfa' : '#64748b',
    border: active ? '1px solid rgba(124,58,237,0.4)' : '1px solid rgba(255,255,255,0.08)',
    transition: 'all 0.2s',
  });

  return (
    <div style={{ background: '#050a1a', color: '#f8fafc', fontFamily: 'var(--font-outfit, Outfit, sans-serif)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.09)' }}>
      <h2 style={{ fontWeight: 800, fontSize: '1.3rem', marginBottom: '0.25rem', background: 'linear-gradient(135deg, #06b6d4, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
        🌊 Dalga Hareketi Simülasyonu
      </h2>
      <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: '1.25rem' }}>Enine ve boyuna dalgalar — sinüzoidal hareket</p>

      <canvas ref={canvasRef} width={CW} height={CH}
        style={{ borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', display: 'block', maxWidth: '100%', marginBottom: '1.25rem' }} />

      {/* Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
        {/* Sliders */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1.25rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem', color: '#a78bfa' }}>⚙️ Parametre Kontrolleri</div>

          <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>
            Frekans: <strong style={{ color: '#f8fafc' }}>{freq.toFixed(1)} Hz</strong>
          </label>
          <input type="range" min={0.1} max={5} step={0.1} value={freq} onChange={(e) => setFreq(+e.target.value)} style={{ ...sliderStyle, marginBottom: '0.875rem' }} />

          <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>
            Genlik: <strong style={{ color: '#f8fafc' }}>{amplitude} px</strong>
          </label>
          <input type="range" min={10} max={120} value={amplitude} onChange={(e) => setAmplitude(+e.target.value)} style={{ ...sliderStyle, marginBottom: '0.875rem' }} />

          <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>
            Dalga Boyu: <strong style={{ color: '#f8fafc' }}>{wavelengthPx} px</strong>
          </label>
          <input type="range" min={50} max={350} value={wavelengthPx} onChange={(e) => setWavelengthPx(+e.target.value)} style={{ ...sliderStyle }} />
        </div>

        {/* Wave Type & Options */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1.25rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem', color: '#67e8f9' }}>🔀 Dalga Türü & Seçenekler</div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {(['transverse', 'longitudinal'] as const).map((type) => (
              <button key={type} onClick={() => setWaveType(type)}
                style={toggleBtn(waveType === type, type, () => {})}>
                {type === 'transverse' ? '〰 Enine' : '⋯ Boyuna'}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.5rem', marginBottom: '1rem' }}>
            <button onClick={() => setShowReflection((p) => !p)} style={toggleBtn(showReflection, '', () => {})}>
              {showReflection ? '✓' : '○'} Yansıma Dalgası
            </button>
            <button onClick={() => setDopplerMode((p) => !p)} style={toggleBtn(dopplerMode, '', () => {})}>
              {dopplerMode ? '✓' : '○'} Doppler Etkisi
            </button>
          </div>

          <button onClick={() => setRunning((p) => !p)} style={{
            width: '100%', padding: '0.65rem', borderRadius: '9px', border: 'none', cursor: 'pointer', fontWeight: 700,
            background: running ? 'rgba(245,158,11,0.2)' : 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            color: running ? '#f59e0b' : 'white',
          }}>
            {running ? '⏸ Duraklat' : '▶ Devam'}
          </button>
        </div>

        {/* Physics Values */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1.25rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem', color: '#fcd34d' }}>📡 Dalga Değerleri</div>
          {[
            { label: 'Periyot (T)', value: `${period} s`, formula: 'T = 1/f', color: '#8b5cf6' },
            { label: 'Frekans (f)', value: `${freq.toFixed(1)} Hz`, formula: 'f = 1/T', color: '#06b6d4' },
            { label: 'Dalga Boyu (λ)', value: `${wavelengthPx} px`, formula: 'v = f·λ', color: '#f59e0b' },
            { label: 'Hız (v)', value: `${waveSpeed} px/s`, formula: 'v = λ·f', color: '#10b981' },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.45rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '0.25rem' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{item.label}</div>
                <div style={{ fontSize: '0.72rem', color: '#4b5563', fontFamily: 'monospace' }}>{item.formula}</div>
              </div>
              <span style={{ fontWeight: 700, color: item.color, fontFamily: 'monospace', fontSize: '0.9rem' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
