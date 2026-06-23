'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SimLayout, SimSlider, SimButton, AstroTutorObserver, SimTimeController } from './ui';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CW = 800;
const CH = 380;

export default function ArsimedKuvveti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  const [liquidDensity, setLiquidDensity] = useState(1000);
  const [blockDensity, setBlockDensity] = useState(400);
  
  const [running, setRunning] = useState(false);
  const [timeScale, setTimeScale] = useState(1);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [aiType, setAiType] = useState<'info'|'warning'|'success'>('info');

  const [chartData, setChartData] = useState<{t: number, fg: number, fb: number, v: number}[]>([]);
  const chartUpdateCounter = useRef(0);

  const [display, setDisplay] = useState({ fb: 0, fg: 0, submerged: 0, v: 0, t: 0 });

  const waterTop = 150;
  const tankBottom = 350;
  const blockSize = 60; // pixels
  const pixelToMeter = 0.01; // 1 pixel = 1 cm
  const blockVolume = Math.pow(blockSize * pixelToMeter, 3); // m^3
  
  const stateRef = useRef({
    y: 50,
    v: 0,
    t: 0,
    lastTs: 0,
    running: false,
    hasSettled: false
  });

  const getLiquidColor = (density: number) => {
    if (density < 900) return '#fcd34d'; // oil
    if (density < 1100) return '#3b82f6'; // water
    if (density < 1300) return '#0ea5e9'; // salt water
    return '#d97706'; // honey/syrup
  };

  const getBlockColor = (density: number) => {
    if (density < 600) return '#b45309'; // wood
    if (density < 1200) return '#fbbf24'; // plastic
    if (density < 3000) return '#9ca3af'; // aluminum
    if (density < 8000) return '#4b5563'; // iron
    return '#1f2937'; // lead
  };

  const drawVector = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, label: string) => {
    if (Math.abs(x2 - x1) < 1 && Math.abs(y2 - y1) < 1) return;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    const angle = Math.atan2(y2 - y1, x2 - x1);
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - 10 * Math.cos(angle - Math.PI/6), y2 - 10 * Math.sin(angle - Math.PI/6));
    ctx.lineTo(x2 - 10 * Math.cos(angle + Math.PI/6), y2 - 10 * Math.sin(angle + Math.PI/6));
    ctx.fill();
    ctx.font = 'bold 12px monospace';
    // Offset label slightly
    ctx.fillText(label, x2 + 8, y2 + (y2 > y1 ? 12 : -4));
    ctx.restore();
  };

  const drawSystem = (ctx: CanvasRenderingContext2D, y: number, v: number, fgDisp: number, fbDisp: number) => {
    ctx.fillStyle = '#050a1a';
    ctx.fillRect(0, 0, CW, CH);

    // Tank background
    const tankLeft = CW / 2 - 150;
    const tankWidth = 300;
    ctx.fillStyle = '#1e1e2f';
    ctx.fillRect(tankLeft, waterTop - 20, tankWidth, tankBottom - waterTop + 20);

    // Water
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = getLiquidColor(liquidDensity);
    ctx.fillRect(tankLeft, waterTop, tankWidth, tankBottom - waterTop);
    ctx.globalAlpha = 1.0;

    // Tank lines
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(tankLeft, waterTop - 20);
    ctx.lineTo(tankLeft, tankBottom);
    ctx.lineTo(tankLeft + tankWidth, tankBottom);
    ctx.lineTo(tankLeft + tankWidth, waterTop - 20);
    ctx.stroke();

    // Block
    const blockX = CW / 2 - blockSize / 2;
    ctx.fillStyle = getBlockColor(blockDensity);
    ctx.fillRect(blockX, y, blockSize, blockSize);
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 2;
    ctx.strokeRect(blockX, y, blockSize, blockSize);

    // Vectors
    const cx = blockX + blockSize / 2;
    const cy = y + blockSize / 2;
    
    // Scale forces for display
    const scale = 20; 
    drawVector(ctx, cx + 10, cy, cx + 10, cy + Math.min(120, fgDisp * scale), '#ef4444', 'G');
    if (fbDisp > 0) {
      drawVector(ctx, cx - 10, cy, cx - 10, cy - Math.min(120, fbDisp * scale), '#10b981', 'Fb');
    }
  };

  const stepPhysics = (dt: number) => {
    const s = stateRef.current;
    
    const blockMass = blockDensity * blockVolume;
    const blockBottom = s.y + blockSize;
    
    let submergedFraction = 0;
    if (blockBottom > waterTop) {
      if (s.y >= waterTop) submergedFraction = 1;
      else submergedFraction = (blockBottom - waterTop) / blockSize;
    }

    const Fg = blockMass * 9.81;
    const Fb = liquidDensity * (blockVolume * submergedFraction) * 9.81;
    
    // Drag
    const signV = s.v > 0 ? 1 : (s.v < 0 ? -1 : 0);
    const dragCoeff = submergedFraction > 0 ? 15 : 0.1; // air vs water drag
    const dragForce = -0.5 * liquidDensity * s.v * s.v * dragCoeff * signV * (submergedFraction > 0 ? 1 : 0.001); 

    const Fnet = Fg - Fb + dragForce;
    const a = Fnet / blockMass;
    
    s.v += a * dt;
    s.y += s.v * dt * (1 / pixelToMeter); // pixel/s
    
    // Floor collision
    if (s.y + blockSize >= tankBottom) {
       s.y = tankBottom - blockSize;
       if (s.v > 0) s.v = -s.v * 0.2; 
       if (Math.abs(s.v) < 0.05) s.v = 0;
    }
    
    // Surface bounce (simple hack to prevent popping out too fast)
    if (s.y < waterTop - blockSize && s.v < 0 && blockDensity < liquidDensity) {
      // Allow it to jump out a bit
    }

    s.t += dt;

    // AI Check
    if (!s.hasSettled && s.t > 1 && Math.abs(s.v) < 0.05) {
      s.hasSettled = true;
      if (blockDensity < liquidDensity) {
        setAiMessage(`Cisim yüzüyor! Yoğunluğu sıvıdan küçük (${blockDensity} < ${liquidDensity}). Kaldırma kuvveti, cismin ağırlığına eşitlendi.`);
        setAiType('success');
      } else if (blockDensity === liquidDensity) {
        setAiMessage('Cisim askıda kaldı! Yoğunluklar eşit. Cisim sıvı içinde nerede bırakılırsa orada kalır.');
        setAiType('info');
      } else {
        setAiMessage(`Cisim battı! Yoğunluğu sıvıdan büyük (${blockDensity} > ${liquidDensity}). Kaldırma kuvveti ağırlığı dengelemeye yetmedi.`);
        setAiType('warning');
      }
    }
  };

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const st = stateRef.current;

    if (st.running) {
      const now = performance.now();
      const realDt = st.lastTs ? (now - st.lastTs) / 1000 : 0.016;
      st.lastTs = now;
      const simDt = Math.min(realDt, 0.05) * timeScale;
      stepPhysics(simDt);
    }

    const blockMass = blockDensity * blockVolume;
    let submergedFraction = 0;
    if (st.y + blockSize > waterTop) {
      if (st.y >= waterTop) submergedFraction = 1;
      else submergedFraction = (st.y + blockSize - waterTop) / blockSize;
    }

    const Fg = blockMass * 9.81;
    const Fb = liquidDensity * (blockVolume * submergedFraction) * 9.81;

    drawSystem(ctx, st.y, st.v, Fg, Fb);
    setDisplay({ fb: Fb, fg: Fg, submerged: submergedFraction * 100, v: st.v, t: st.t });

    if (st.running) {
      chartUpdateCounter.current++;
      if (chartUpdateCounter.current % 5 === 0) {
        setChartData(prev => {
          const newData = [...prev, { t: Number(st.t.toFixed(2)), fg: Number(Fg.toFixed(2)), fb: Number(Fb.toFixed(2)), v: Number(st.v.toFixed(2)) }];
          if (newData.length > 200) return newData.slice(newData.length - 200);
          return newData;
        });
      }
      animRef.current = requestAnimationFrame(drawFrame);
    }
  }, [liquidDensity, blockDensity, timeScale, blockVolume]);

  useEffect(() => {
    if (!running) {
      drawFrame();
    }
  }, [liquidDensity, blockDensity, drawFrame, running]);

  const handleStart = () => {
    if (!running) {
      if (stateRef.current.y === tankBottom - blockSize) {
        stateRef.current.y = 50; // auto reset if at bottom
        stateRef.current.t = 0;
        stateRef.current.v = 0;
        stateRef.current.hasSettled = false;
        setChartData([]);
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
    stateRef.current = { y: 50, v: 0, t: 0, lastTs: 0, running: false, hasSettled: false };
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

  return (
    <SimLayout
      title="Arşimet Prensibi (Kaldırma Kuvveti)"
      children={
        <div style={{ position: 'relative' }}>
          <canvas ref={canvasRef} width={CW} height={CH} style={{ width: '100%', height: 'auto', borderRadius: '8px', border: '1px solid #27272a' }} />
          <AstroTutorObserver message={aiMessage} type={aiType} />
        </div>
      }
      controls={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
             <div style={{ background: '#18181b', padding: '15px', borderRadius: '8px', borderTop: `3px solid ${getLiquidColor(liquidDensity)}` }}>
                <SimSlider label="Sıvı Yoğunluğu (kg/m³)" min={500} max={2000} step={100} value={liquidDensity} onChange={(v) => {setLiquidDensity(v); handleReset();}} />
             </div>
             <div style={{ background: '#18181b', padding: '15px', borderRadius: '8px', borderTop: `3px solid ${getBlockColor(blockDensity)}` }}>
                <SimSlider label="Cisim Yoğunluğu (kg/m³)" min={100} max={8000} step={100} value={blockDensity} onChange={(v) => {setBlockDensity(v); handleReset();}} />
             </div>
           </div>
           
           <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem', alignItems: 'center' }}>
              <SimButton label={running ? 'Duraklat' : 'Bırak'} variant="primary" onClick={handleStart} />
              <SimTimeController disabled={false} timeScale={timeScale} setTimeScale={setTimeScale} onStepForward={handleStepForward} />
              <SimButton label="Başa Dön" variant="danger" onClick={handleReset} />
           </div>

           <div style={{ background: '#18181b', padding: '15px', borderRadius: '8px', border: '1px solid #27272a', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
             <div><span style={{ fontSize: '12px', color: '#a1a1aa' }}>Ağırlık (G):</span> <br/><span style={{ color: '#ef4444', fontWeight: 'bold' }}>{display.fg.toFixed(2)} N</span></div>
             <div><span style={{ fontSize: '12px', color: '#a1a1aa' }}>Kaldırma Kuvveti (Fb):</span> <br/><span style={{ color: '#10b981', fontWeight: 'bold' }}>{display.fb.toFixed(2)} N</span></div>
             <div><span style={{ fontSize: '12px', color: '#a1a1aa' }}>Batan Kısım:</span> <br/><span style={{ color: '#3b82f6', fontWeight: 'bold' }}>%{display.submerged.toFixed(0)}</span></div>
             <div><span style={{ fontSize: '12px', color: '#a1a1aa' }}>Hız:</span> <br/><span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{display.v.toFixed(2)} m/s</span></div>
           </div>
        </div>
      }
      charts={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
          <div style={{ display: 'flex', gap: '0.5rem', background: '#18181b', padding: '4px', borderRadius: '8px' }}>
            <button style={{ flex: 1, padding: '8px', background: '#27272a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Kuvvetler vs Zaman</button>
          </div>
          <div style={{ flex: 1, minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
               <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="t" stroke="#a1a1aa" fontSize={12} tickFormatter={(val) => `${val}s`} />
                  <YAxis stroke="#a1a1aa" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                  <Legend />
                  <Line type="monotone" dataKey="fg" name="Ağırlık (G)" stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="fb" name="Kaldırma K. (Fb)" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      }
    />
  );
}
