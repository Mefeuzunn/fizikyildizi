'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SimLayout, SimSlider, SimButton, AstroTutorObserver, SimTimeController } from './ui';

const CW = 800;
const CH = 380;

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
  const [timeScale, setTimeScale] = useState(1);
  
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [aiType, setAiType] = useState<'info'|'warning'|'success'>('info');

  const waveSpeed = (freq * wavelengthPx).toFixed(1);
  const period = (1 / freq).toFixed(3);

  useEffect(() => {
    if (dopplerMode) {
      setAiMessage('Doppler Etkisi Aktif! Kaynak hareket ettiğinde önündeki dalgaların sıkıştığını (frekansın arttığını) gözlemle.');
      setAiType('warning');
    } else if (showReflection) {
      setAiMessage('Yansıma açık! Gelen dalga ile yansıyan dalga üst üste binerek durağan (standing) dalgalar oluşturabilir.');
      setAiType('info');
    } else {
      setAiMessage(null);
    }
  }, [dopplerMode, showReflection]);

  const drawSystem = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#050a1a';
    ctx.fillRect(0, 0, CW, CH);
    
    // Grid
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < CW; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CH); ctx.stroke(); }
    for (let y = 0; y < CH; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CW, y); ctx.stroke(); }
    ctx.restore();

    // Equilibrium line
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

    const centerY = CH / 2;
    const phase = phaseRef.current;

    if (waveType === 'transverse') {
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
        const k = (2 * Math.PI) / wavelengthPx;
        const y = centerY - amplitude * Math.sin(k * x - phase);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();

      if (showReflection) {
        ctx.save();
        ctx.strokeStyle = 'rgba(245,158,11,0.5)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        for (let x = 0; x < CW; x += 2) {
          const k = (2 * Math.PI) / wavelengthPx;
          const y = centerY + amplitude * 0.7 * Math.sin(k * x + phase);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }

      if (dopplerMode) {
        const srcX = (CW / 2 + Math.sin(dopplerPhaseRef.current) * CW * 0.3);
        ctx.save();
        for (let i = 1; i <= 5; i++) {
          const r = (i * wavelengthPx * 0.5) % (CW * 0.6);
          const frontR = r * 0.6; 
          const backR = r * 1.2; 
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
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath(); ctx.arc(srcX, centerY, 8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#050a1a';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('S', srcX, centerY + 3);
        ctx.restore();
      }

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

      ctx.save();
      ctx.strokeStyle = 'rgba(245,158,11,0.6)';
      ctx.fillStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.font = '11px monospace';
      const lambdaX = 40;
      ctx.beginPath(); ctx.moveTo(lambdaX, centerY + amplitude + 18); ctx.lineTo(lambdaX + wavelengthPx, centerY + amplitude + 18); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(lambdaX, centerY + amplitude + 12); ctx.lineTo(lambdaX, centerY + amplitude + 24); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(lambdaX + wavelengthPx, centerY + amplitude + 12); ctx.lineTo(lambdaX + wavelengthPx, centerY + amplitude + 24); ctx.stroke();
      ctx.fillText(`λ = ${wavelengthPx.toFixed(0)} px`, lambdaX + wavelengthPx / 2 - 25, centerY + amplitude + 35);
      ctx.restore();

    } else {
      // Longitudinal wave
      const numParticles = 60;
      const baseSpacing = CW / numParticles;
      const k = (2 * Math.PI) / wavelengthPx;

      ctx.save();
      for (let i = 0; i < numParticles; i++) {
        const baseX = i * baseSpacing + baseSpacing / 2;
        const displacement = amplitude * 0.3 * Math.sin(k * baseX - phase);
        const x = baseX + displacement;

        const densityFactor = Math.cos(k * baseX - phase);
        const alpha = 0.3 + Math.abs(densityFactor) * 0.7;

        const grad = ctx.createRadialGradient(x, centerY, 0, x, centerY, 8);
        grad.addColorStop(0, `rgba(6,182,212,${alpha})`);
        grad.addColorStop(1, `rgba(124,58,237,${alpha * 0.3})`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, centerY, 5 + densityFactor * 2, 0, Math.PI * 2);
        ctx.fill();

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

      ctx.save();
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px monospace';
      ctx.fillText('Sıkışma →          ← Genleşme', CW * 0.3, centerY - amplitude - 20);
      ctx.restore();
    }
  };

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    drawSystem(ctx);

    if (running) {
      phaseRef.current += freq * 0.1 * timeScale;
      dopplerPhaseRef.current += 0.02 * timeScale;
      animRef.current = requestAnimationFrame(drawFrame);
    }
  }, [freq, amplitude, wavelengthPx, waveType, showReflection, dopplerMode, timeScale, running]);

  useEffect(() => {
    if (!running) {
      drawFrame();
    }
  }, [freq, amplitude, wavelengthPx, waveType, showReflection, dopplerMode, drawFrame, running]);

  const handleStart = () => {
    if (!running) {
      setRunning(true);
      animRef.current = requestAnimationFrame(drawFrame);
    } else {
      setRunning(false);
    }
  };

  const handleStepForward = () => {
    setRunning(false);
    phaseRef.current += freq * 0.1 * 5; // skip a few frames
    dopplerPhaseRef.current += 0.02 * 5;
    drawFrame();
  };

  return (
    <SimLayout
      title="Dalga Hareketi (Enine ve Boyuna)"
      children={
        <div style={{ position: 'relative' }}>
          <canvas ref={canvasRef} width={CW} height={CH} style={{ width: '100%', height: 'auto', borderRadius: '8px', border: '1px solid #27272a' }} />
          <AstroTutorObserver message={aiMessage} type={aiType} />
        </div>
      }
      controls={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
             <div style={{ background: '#18181b', padding: '15px', borderRadius: '8px', borderTop: '3px solid #7c3aed' }}>
                <SimSlider label="Frekans (Hz)" min={0.1} max={5} step={0.1} value={freq} onChange={setFreq} />
                <SimSlider label="Genlik (px)" min={10} max={120} step={1} value={amplitude} onChange={setAmplitude} />
                <SimSlider label="Dalga Boyu (px)" min={50} max={350} step={5} value={wavelengthPx} onChange={setWavelengthPx} />
             </div>
           </div>
           
           <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
              <SimButton label="Enine Dalga" variant={waveType === 'transverse' ? 'primary' : 'secondary'} onClick={() => setWaveType('transverse')} />
              <SimButton label="Boyuna Dalga" variant={waveType === 'longitudinal' ? 'primary' : 'secondary'} onClick={() => setWaveType('longitudinal')} />
           </div>

           <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
              <SimButton label={showReflection ? "Yansıma: Açık" : "Yansıma: Kapalı"} variant={showReflection ? 'primary' : 'secondary'} onClick={() => setShowReflection(!showReflection)} />
              <SimButton label={dopplerMode ? "Doppler: Açık" : "Doppler: Kapalı"} variant={dopplerMode ? 'primary' : 'secondary'} onClick={() => setDopplerMode(!dopplerMode)} />
           </div>
           
           <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginTop: '1rem', alignItems: 'center' }}>
              <SimButton label={running ? 'Duraklat' : 'Başlat'} variant="primary" onClick={handleStart} />
              <SimTimeController disabled={false} timeScale={timeScale} setTimeScale={setTimeScale} onStepForward={handleStepForward} />
           </div>
        </div>
      }
      charts={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', background: '#18181b', padding: '15px', borderRadius: '8px', border: '1px solid #27272a' }}>
           <h4 style={{ color: '#fcd34d', margin: 0 }}>📡 Dalga Değerleri</h4>
           <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #27272a', paddingBottom: '5px' }}>
             <span style={{ color: '#a1a1aa', fontSize: '12px' }}>Periyot (T)</span>
             <span style={{ color: '#8b5cf6', fontWeight: 'bold' }}>{period} s</span>
           </div>
           <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #27272a', paddingBottom: '5px' }}>
             <span style={{ color: '#a1a1aa', fontSize: '12px' }}>Frekans (f)</span>
             <span style={{ color: '#06b6d4', fontWeight: 'bold' }}>{freq.toFixed(1)} Hz</span>
           </div>
           <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #27272a', paddingBottom: '5px' }}>
             <span style={{ color: '#a1a1aa', fontSize: '12px' }}>Dalga Boyu (λ)</span>
             <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{wavelengthPx} px</span>
           </div>
           <div style={{ display: 'flex', justifyContent: 'space-between' }}>
             <span style={{ color: '#a1a1aa', fontSize: '12px' }}>Hız (v = λ·f)</span>
             <span style={{ color: '#10b981', fontWeight: 'bold' }}>{waveSpeed} px/s</span>
           </div>
        </div>
      }
    />
  );
}
