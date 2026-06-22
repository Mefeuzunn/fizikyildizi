'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { SimSlider, SimButton, SimLayout } from './ui';
import { SimTimeController } from './ui/SimTimeController';
import { AstroTutorObserver } from './ui/AstroTutorObserver';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CW = 640;
const CH = 320;
const EQUILIBRIUM_X = CW / 2;
const BLOCK_Y = CH / 2;
const SCALE = 200; // pixels per metre

function drawGrid(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x < CW; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CH); ctx.stroke(); }
  for (let y = 0; y < CH; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CW, y); ctx.stroke(); }
  ctx.restore();
}

function drawSystem(ctx: CanvasRenderingContext2D, x_m: number, v_m: number, a_m: number, mass: number, k: number) {
  const wallX = 60;
  const blockX = EQUILIBRIUM_X + x_m * SCALE;
  const blockW = 60 + mass * 10;
  const blockH = 60 + mass * 10;

  // Equilibrium line
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.setLineDash([4, 4]);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(EQUILIBRIUM_X, BLOCK_Y - 80);
  ctx.lineTo(EQUILIBRIUM_X, BLOCK_Y + 80);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '12px monospace';
  ctx.fillText('Denge (x=0)', EQUILIBRIUM_X - 35, BLOCK_Y - 90);

  // Floor
  ctx.strokeStyle = '#27272a';
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(wallX - 20, BLOCK_Y + blockH/2 + 2); ctx.lineTo(CW, BLOCK_Y + blockH/2 + 2); ctx.stroke();

  // Wall
  ctx.fillStyle = '#27272a';
  ctx.fillRect(wallX - 20, BLOCK_Y - 100, 20, 100 + blockH/2 + 4);

  // Spring
  const springStartX = wallX;
  const springEndX = blockX - blockW / 2;
  const coils = 12;
  const dx = (springEndX - springStartX) / coils;
  
  ctx.strokeStyle = Math.abs(x_m) > 0.1 ? (x_m > 0 ? '#6366f1' : '#f43f5e') : '#a1a1aa';
  ctx.lineWidth = 3;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(springStartX, BLOCK_Y);
  for (let i = 1; i <= coils; i++) {
    const py = BLOCK_Y + (i % 2 === 0 ? 15 : -15);
    const px = springStartX + i * dx;
    ctx.lineTo(px, py);
  }
  ctx.stroke();

  // Block
  ctx.shadowColor = '#06b6d4';
  ctx.shadowBlur = Math.abs(v_m) * 5;
  ctx.fillStyle = '#18181b';
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 2;
  ctx.fillRect(blockX - blockW/2, BLOCK_Y - blockH/2, blockW, blockH);
  ctx.strokeRect(blockX - blockW/2, BLOCK_Y - blockH/2, blockW, blockH);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#06b6d4';
  ctx.fillText(`${mass.toFixed(1)}kg`, blockX - 15, BLOCK_Y + 5);

  // Vectors
  // Velocity Vector (Blue)
  if (Math.abs(v_m) > 0.05) {
    const vLen = v_m * 40; // visual scale
    drawArrow(ctx, blockX, BLOCK_Y - blockH/2 - 15, blockX + vLen, BLOCK_Y - blockH/2 - 15, '#3b82f6', `v=${Math.abs(v_m).toFixed(1)}`);
  }

  // Force/Acceleration Vector (Red)
  if (Math.abs(a_m) > 0.1) {
    const aLen = a_m * 10; // visual scale
    drawArrow(ctx, blockX, BLOCK_Y - blockH/2 - 35, blockX + aLen, BLOCK_Y - blockH/2 - 35, '#ef4444', `F_geri`);
  }
}

function drawArrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, label: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  
  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - 8 * Math.cos(angle - Math.PI/6), y2 - 8 * Math.sin(angle - Math.PI/6));
  ctx.lineTo(x2 - 8 * Math.cos(angle + Math.PI/6), y2 - 8 * Math.sin(angle + Math.PI/6));
  ctx.fill();
  
  ctx.font = '10px monospace';
  ctx.fillText(label, x1 + (x2-x1)/2 - 10, y1 - 8);
  ctx.restore();
}

export default function SpringSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  
  const [k, setK] = useState(20); // N/m
  const [mass, setMass] = useState(1); // kg
  const [damping, setDamping] = useState(0); // Ns/m
  const [startAmp, setStartAmp] = useState(0.2); // m

  const [running, setRunning] = useState(false);
  const [timeScale, setTimeScale] = useState(1);
  const [activeChart, setActiveChart] = useState<'x_vs_t' | 'v_vs_t' | 'energy_vs_t'>('x_vs_t');
  
  const [chartData, setChartData] = useState<{t: number, x: number, v: number, ke: number, pe: number}[]>([]);
  const chartUpdateCounter = useRef(0);
  const [display, setDisplay] = useState({ x: 0, v: 0, t: 0, ke: 0, pe: 0 });
  const [aiMessage, setAiMessage] = useState<{text: string, type: 'info'|'warning'|'success'} | null>(null);

  const stateRef = useRef({
    x: startAmp,
    v: 0,
    t: 0,
    lastTs: 0,
    running: false
  });

  const stepPhysics = (dt: number) => {
    const st = stateRef.current;
    st.t += dt;
    const a = (-k * st.x - damping * st.v) / mass;
    st.v += a * dt;
    st.x += st.v * dt;

    if (Math.abs(st.v) < 0.05 && Math.abs(st.x) > 0.05) {
       // max amplitude
       if (Math.random() < 0.02) setAiMessage({ text: `Uç noktada hız anlık sıfır! Kinetik enerji 0, potansiyel maksimum.`, type: 'info' });
    } else if (Math.abs(st.x) < 0.02 && Math.abs(st.v) > 0.5) {
       if (Math.random() < 0.02) setAiMessage({ text: `Denge noktasından geçiliyor! Geri çağırıcı kuvvet anlık sıfır, hız maksimum.`, type: 'success' });
    }
  };

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const st = stateRef.current;

    ctx.fillStyle = '#050a1a';
    ctx.fillRect(0, 0, CW, CH);
    drawGrid(ctx);

    if (st.running) {
      const now = performance.now();
      const realDt = st.lastTs ? (now - st.lastTs) / 1000 : 0.016;
      st.lastTs = now;
      const simDt = Math.min(realDt, 0.05) * timeScale;
      stepPhysics(simDt);
    }

    const a = (-k * st.x - damping * st.v) / mass;
    const ke = 0.5 * mass * st.v * st.v;
    const pe = 0.5 * k * st.x * st.x;

    drawSystem(ctx, st.x, st.v, a, mass, k);

    setDisplay({ x: st.x, v: st.v, t: st.t, ke, pe });

    if (st.running) {
      chartUpdateCounter.current++;
      if (chartUpdateCounter.current % 5 === 0) {
        setChartData(prev => {
          const newData = [...prev, { t: Number(st.t.toFixed(2)), x: Number(st.x.toFixed(2)), v: Number(st.v.toFixed(2)), ke: Number(ke.toFixed(2)), pe: Number(pe.toFixed(2)) }];
          if (newData.length > 200) return newData.slice(newData.length - 200);
          return newData;
        });
      }
      animRef.current = requestAnimationFrame(drawFrame);
    }
  }, [running, timeScale, k, mass, damping]);

  useEffect(() => {
    if (!running) {
      stateRef.current.x = startAmp;
      stateRef.current.v = 0;
      drawFrame();
    }
  }, [startAmp, running, drawFrame]);

  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  const handleStart = () => {
    if (!running) {
      if (stateRef.current.t === 0) {
        stateRef.current.x = startAmp;
        stateRef.current.v = 0;
      }
      stateRef.current.lastTs = performance.now();
      stateRef.current.running = true;
      setRunning(true);
      setAiMessage(null);
      animRef.current = requestAnimationFrame(drawFrame);
    } else {
      stateRef.current.running = false;
      setRunning(false);
    }
  };

  const handleReset = () => {
    cancelAnimationFrame(animRef.current);
    stateRef.current = { x: startAmp, v: 0, t: 0, lastTs: 0, running: false };
    setRunning(false);
    setChartData([]);
    setAiMessage(null);
    drawFrame();
  };

  const handleStepForward = () => {
    stateRef.current.running = false;
    setRunning(false);
    stepPhysics(0.05);
    drawFrame();
  };

  const handleExport = () => {
    const csv = "data:text/csv;charset=utf-8,Zaman(s),Konum(m),Hiz(m/s),KinetikEnerji(J),PotansiyelEnerji(J)\n"
      + chartData.map(e => `${e.t},${e.x},${e.v},${e.ke},${e.pe}`).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "yay_sistemi_verileri.csv";
    link.click();
  };

  const controls = (
    <>
      <SimSlider label="Yay Sabiti (k)" value={k} min={5} max={100} step={5} unit="N/m" onChange={(val) => { setK(val); handleReset(); }} />
      <SimSlider label="Kütle (m)" value={mass} min={0.5} max={5} step={0.5} unit="kg" onChange={(val) => { setMass(val); handleReset(); }} />
      <SimSlider label="Sürtünme / Sönümleme" value={damping} min={0} max={2} step={0.1} unit="Ns/m" onChange={(val) => { setDamping(val); handleReset(); }} />
      <SimSlider label="Başlangıç Çekilmesi" value={startAmp} min={0} max={0.4} step={0.05} unit="m" onChange={(val) => { setStartAmp(val); handleReset(); }} />
      
      <SimTimeController timeScale={timeScale} setTimeScale={setTimeScale} onStepForward={handleStepForward} />
      
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <SimButton label={running ? 'Duraklat' : stateRef.current.t > 0 ? 'Devam Et' : 'Bırak (Başla)'} onClick={handleStart} variant="primary" />
        <SimButton label="Sıfırla" onClick={handleReset} variant="secondary" />
      </div>
    </>
  );

  const charts = (
    <div style={{ height: '240px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h4 style={{ margin: 0, color: '#a1a1aa', fontSize: '0.85rem' }}>Dinamik Analiz</h4>
        <select 
          value={activeChart} onChange={(e: any) => setActiveChart(e.target.value)}
          style={{ background: 'rgba(255,255,255,0.05)', color: '#f4f4f5', border: '1px solid #3f3f46', borderRadius: '4px', fontSize: '0.75rem', padding: '0.2rem' }}
        >
          <option value="x_vs_t">Konum (x vs t)</option>
          <option value="v_vs_t">Hız (v vs t)</option>
          <option value="energy_vs_t">Enerji (Ek, Ep vs t)</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis dataKey="t" stroke="#a1a1aa" fontSize={12} tickFormatter={(v) => v + 's'} />
          <YAxis stroke="#a1a1aa" fontSize={12} />
          <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }} />
          {activeChart === 'x_vs_t' && <Line type="monotone" dataKey="x" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />}
          {activeChart === 'v_vs_t' && <Line type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />}
          {activeChart === 'energy_vs_t' && (
            <>
              <Line type="monotone" dataKey="ke" name="Kinetik" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="pe" name="Potansiyel" stroke="#ec4899" strokeWidth={2} dot={false} isAnimationActive={false} />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <SimLayout 
      title="Yay Sistemi (SHM)"
      controls={controls}
      charts={charts}
      onExport={handleExport}
      mission={{ text: 'Sürtünmesiz ortamda kinetik enerjinin nasıl potansiyele dönüştüğünü analiz et.', isCompleted: stateRef.current.t > 5 && damping === 0 }}
    >
      <canvas
        ref={canvasRef}
        width={CW}
        height={CH}
        style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }}
      />
      <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,0.6)', padding: '1rem', borderRadius: '12px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div>Zaman: <span style={{color: '#e4e4e7', fontFamily: 'monospace'}}>{display.t.toFixed(2)} s</span></div>
        <div>Konum: <span style={{color: '#10b981', fontFamily: 'monospace'}}>{display.x.toFixed(3)} m</span></div>
        <div>Hız: <span style={{color: '#3b82f6', fontFamily: 'monospace'}}>{display.v.toFixed(3)} m/s</span></div>
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />
        <div>Kinetik E.: <span style={{color: '#f59e0b', fontFamily: 'monospace'}}>{display.ke.toFixed(2)} J</span></div>
        <div>Yay Potansiyel E.: <span style={{color: '#ec4899', fontFamily: 'monospace'}}>{display.pe.toFixed(2)} J</span></div>
        <div>Toplam Enerji: <span style={{color: '#fff', fontFamily: 'monospace'}}>{(display.ke + display.pe).toFixed(2)} J</span></div>
      </div>
      <AstroTutorObserver message={aiMessage?.text || null} type={aiMessage?.type} />
    </SimLayout>
  );
}
