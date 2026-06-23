'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SimLayout, SimSlider, SimButton, AstroTutorObserver } from './ui';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

const CW = 800;
const CH = 380;
const GM = 500000;
const SUN_RADIUS = 25;
const ESCAPE_RADIUS = 1500;

export default function KeplerYorungeler() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  
  const [distance, setDistance] = useState(200); // 50 to 400
  const [velocity, setVelocity] = useState(40); // 10 to 100
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState<string>('Hazır');

  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [aiType, setAiType] = useState<'info'|'warning'|'success'>('info');
  const [chartData, setChartData] = useState<{t: number, speed: number}[]>([]);

  const stateRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    path: [] as {x: number, y: number}[],
    t: 0
  });

  const resetSimulation = useCallback(() => {
    setRunning(false);
    setStatus('Hazır');
    if (animRef.current) cancelAnimationFrame(animRef.current);
    
    stateRef.current = {
      x: 0,
      y: -distance,
      vx: velocity,
      vy: 0,
      path: [],
      t: 0
    };
    setChartData([]);
    
    // Check initial conditions for AI message
    const initialV = velocity;
    // Circular velocity: v = sqrt(GM/r)
    const vCircular = Math.sqrt(GM / distance);
    const vEscape = Math.sqrt(2 * GM / distance);
    
    if (initialV > vEscape) {
      setAiMessage(`Hız çok yüksek! (${initialV.toFixed(1)} > Kaçış Hızı ${vEscape.toFixed(1)}). Gezegen hiperbolik bir yörüngeyle sistemi terk edecek.`);
      setAiType('warning');
    } else if (Math.abs(initialV - vCircular) < 2) {
      setAiMessage('Hız tam dairesel yörünge hızında! Gezegen güneşe hep aynı uzaklıkta, sabit hızla dönecek.');
      setAiType('success');
    } else {
      setAiMessage(`Elips Yörünge: Gezegen Güneş'e yaklaştıkça yerçekimi potansiyel enerjisi azalır, kinetik enerjisi (hızı) artar. Uzaklaştıkça yavaşlar.`);
      setAiType('info');
    }
  }, [distance, velocity]);

  useEffect(() => {
    resetSimulation();
  }, [distance, velocity, resetSimulation]);

  const drawSystem = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#050a1a';
    ctx.fillRect(0, 0, CW, CH);
    const cx = CW / 2;
    const cy = CH / 2;

    const state = stateRef.current;

    // Draw Sun
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, SUN_RADIUS * 2);
    gradient.addColorStop(0, '#fef08a');
    gradient.addColorStop(0.3, '#eab308');
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.beginPath(); ctx.arc(cx, cy, SUN_RADIUS * 2, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#facc15';
    ctx.beginPath(); ctx.arc(cx, cy, SUN_RADIUS, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 20; ctx.shadowColor = '#eab308';

    // Draw Orbit Path
    if (state.path.length > 0) {
      ctx.beginPath();
      ctx.moveTo(cx + state.path[0].x, cy + state.path[0].y);
      for (let i = 1; i < state.path.length; i++) {
        ctx.lineTo(cx + state.path[i].x, cy + state.path[i].y);
      }
      ctx.strokeStyle = 'rgba(167, 139, 250, 0.5)';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 0;
      ctx.stroke();
    }

    // Draw Planet
    ctx.beginPath();
    ctx.arc(cx + state.x, cy + state.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#38bdf8';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#38bdf8';
    ctx.fill();
    ctx.shadowBlur = 0;
  }, []);

  const updatePhysics = useCallback(() => {
    const state = stateRef.current;
    const dt = 0.05;

    if (running) {
      const r_sq = state.x * state.x + state.y * state.y;
      const r = Math.sqrt(r_sq);

      if (r <= SUN_RADIUS) {
        setStatus('Çarpıştı!');
        setRunning(false);
        setAiMessage('Gezegen Güneş\'e çarptı! Hız çok düşüktü veya başlangıç mesafesi çok yakındı.');
        setAiType('warning');
        return;
      }

      if (r > ESCAPE_RADIUS) {
        setStatus('Yörüngeden Çıktı!');
        setRunning(false);
        setAiMessage('Gezegen sistemden kaçtı! Çekim kuvveti onu yörüngede tutmaya yetmedi.');
        setAiType('info');
        return;
      }

      const ax = -GM * state.x / (r * r_sq);
      const ay = -GM * state.y / (r * r_sq);

      state.vx += ax * dt;
      state.vy += ay * dt;
      state.x += state.vx * dt;
      state.y += state.vy * dt;
      state.t += dt;

      if (state.path.length === 0 || Math.hypot(state.path[state.path.length - 1].x - state.x, state.path[state.path.length - 1].y - state.y) > 2) {
        state.path.push({ x: state.x, y: state.y });
      }

      if (state.path.length > 1500) state.path.shift();

      // Chart update
      if (Math.random() < 0.1) {
        const speed = Math.sqrt(state.vx * state.vx + state.vy * state.vy);
        setChartData(prev => {
          const newData = [...prev, { t: Number(state.t.toFixed(1)), speed: Number(speed.toFixed(1)) }];
          if (newData.length > 100) return newData.slice(newData.length - 100);
          return newData;
        });
      }
    }

    drawSystem();
    if (running) {
      animRef.current = requestAnimationFrame(updatePhysics);
    }
  }, [running, drawSystem]);

  useEffect(() => {
    if (running) {
      setStatus('Yörüngede...');
      animRef.current = requestAnimationFrame(updatePhysics);
    } else {
      drawSystem();
    }
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [running, updatePhysics, drawSystem]);

  return (
    <SimLayout
      title="Kepler Yörüngeleri"
      children={
        <div style={{ position: 'relative' }}>
          <canvas ref={canvasRef} width={CW} height={CH} style={{ width: '100%', height: 'auto', borderRadius: '8px', border: '1px solid #27272a' }} />
          <AstroTutorObserver message={aiMessage} type={aiType} />
        </div>
      }
      controls={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
             <div style={{ background: '#18181b', padding: '15px', borderRadius: '8px', borderTop: '3px solid #38bdf8' }}>
                <SimSlider label="Başlangıç Uzaklığı (r)" min={50} max={300} step={5} value={distance} onChange={(v) => {setDistance(v); setRunning(false);}} />
             </div>
             <div style={{ background: '#18181b', padding: '15px', borderRadius: '8px', borderTop: '3px solid #f43f5e' }}>
                <SimSlider label="Fırlatma Hızı (v)" min={10} max={100} step={1} value={velocity} onChange={(v) => {setVelocity(v); setRunning(false);}} />
             </div>
           </div>

           <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginTop: '1rem', alignItems: 'center' }}>
              <SimButton label={running ? 'Durdur' : 'Fırlat!'} variant="primary" onClick={() => setRunning(!running)} />
              <SimButton label="Sıfırla" variant="danger" onClick={resetSimulation} />
           </div>

           <div style={{ background: '#18181b', padding: '15px', borderRadius: '8px', border: '1px solid #27272a', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
             <div style={{ textAlign: 'center' }}>
               <span style={{ fontSize: '12px', color: '#a1a1aa' }}>Durum</span><br/>
               <span style={{ color: status === 'Çarpıştı!' ? '#ef4444' : status === 'Yörüngede...' ? '#10b981' : '#f59e0b', fontSize: '20px', fontWeight: 'bold' }}>{status}</span>
             </div>
             <div style={{ textAlign: 'center' }}>
               <span style={{ fontSize: '12px', color: '#a1a1aa' }}>Kaçış Hızı</span><br/>
               <span style={{ color: '#8b5cf6', fontSize: '16px', fontWeight: 'bold', fontFamily: 'monospace' }}>{Math.sqrt(2 * GM / distance).toFixed(1)} birim</span>
             </div>
           </div>
        </div>
      }
      charts={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
          <div style={{ display: 'flex', gap: '0.5rem', background: '#18181b', padding: '4px', borderRadius: '8px' }}>
            <button style={{ flex: 1, padding: '8px', background: '#27272a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Gezegen Hızı vs Zaman</button>
          </div>
          <div style={{ flex: 1, minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
               <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="t" stroke="#a1a1aa" fontSize={12} label={{ value: 'Zaman', position: 'insideBottomRight', fill: '#a1a1aa' }} />
                  <YAxis stroke="#a1a1aa" fontSize={12} label={{ value: 'Hız (v)', angle: -90, position: 'insideLeft', fill: '#a1a1aa' }} domain={['auto', 'auto']} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                  <Line type="monotone" dataKey="speed" name="Anlık Hız" stroke="#f43f5e" strokeWidth={3} dot={false} isAnimationActive={false} />
                </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      }
    />
  );
}
