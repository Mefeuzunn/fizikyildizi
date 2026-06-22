'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SimLayout, SimSlider, SimButton, AstroTutorObserver, SimTimeController } from './ui';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CW = 800;
const CH = 300;

export default function CarpismaLaboratuvari() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  
  const [m1, setM1] = useState(2);
  const [v1Init, setV1Init] = useState(3);
  const [m2, setM2] = useState(2);
  const [v2Init, setV2Init] = useState(-2);
  const [isElastic, setIsElastic] = useState(true);

  const [running, setRunning] = useState(false);
  const [timeScale, setTimeScale] = useState(1);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [aiType, setAiType] = useState<'info'|'warning'|'success'>('info');
  
  const [activeChart, setActiveChart] = useState<'momentum_vs_t' | 'energy_vs_t'>('momentum_vs_t');
  const [chartData, setChartData] = useState<{t: number, p1: number, p2: number, pTotal: number, keTotal: number}[]>([]);
  const chartUpdateCounter = useRef(0);

  const [display, setDisplay] = useState({ v1: 0, v2: 0, pTotal: 0, keTotal: 0, t: 0 });

  const stateRef = useRef({
    x1: 150,
    x2: 650,
    v1: v1Init,
    v2: v2Init,
    t: 0,
    lastTs: 0,
    running: false,
    hasCollided: false
  });

  const blockW = 60;

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 1;
    for (let x = 0; x <= CW; x += 50) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CH); ctx.stroke(); }
    for (let y = 0; y <= CH; y += 50) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CW, y); ctx.stroke(); }
  };

  const drawVector = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, label: string) => {
    if (Math.abs(x2 - x1) < 1) return;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    const angle = Math.atan2(y2 - y1, x2 - x1);
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - 8 * Math.cos(angle - Math.PI/6), y2 - 8 * Math.sin(angle - Math.PI/6));
    ctx.lineTo(x2 - 8 * Math.cos(angle + Math.PI/6), y2 - 8 * Math.sin(angle + Math.PI/6));
    ctx.fill();
    ctx.font = '12px monospace';
    ctx.fillText(label, x2 + (x2 > x1 ? 5 : -25), y2 - 5);
    ctx.restore();
  };

  const drawSystem = (ctx: CanvasRenderingContext2D, x1: number, x2: number, curV1: number, curV2: number) => {
    // Floor
    ctx.fillStyle = '#4b5563';
    ctx.fillRect(0, CH - 50, CW, 50);
    
    // M1
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(x1, CH - 50 - blockW, blockW, blockW);
    ctx.fillStyle = '#fff';
    ctx.font = '16px monospace';
    ctx.fillText(`m1=${m1}`, x1 + 5, CH - 50 - blockW/2 + 5);
    drawVector(ctx, x1 + blockW/2, CH - 50 - blockW/2, x1 + blockW/2 + curV1 * 10, CH - 50 - blockW/2, '#60a5fa', 'v1');

    // M2
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(x2, CH - 50 - blockW, blockW, blockW);
    ctx.fillStyle = '#fff';
    ctx.fillText(`m2=${m2}`, x2 + 5, CH - 50 - blockW/2 + 5);
    drawVector(ctx, x2 + blockW/2, CH - 50 - blockW/2, x2 + blockW/2 + curV2 * 10, CH - 50 - blockW/2, '#ef4444', 'v2');
  };

  const stepPhysics = (dt: number) => {
    const st = stateRef.current;
    const speedScale = 50;

    let nextX1 = st.x1 + st.v1 * speedScale * dt;
    let nextX2 = st.x2 + st.v2 * speedScale * dt;

    if (!st.hasCollided && nextX1 + blockW >= nextX2) {
       st.hasCollided = true;
       if (isElastic) {
         const newV1 = ((m1 - m2) * st.v1 + 2 * m2 * st.v2) / (m1 + m2);
         const newV2 = ((m2 - m1) * st.v2 + 2 * m1 * st.v1) / (m1 + m2);
         st.v1 = newV1;
         st.v2 = newV2;
         setAiMessage('Esnek çarpışma gerçekleşti! Toplam kinetik enerji korundu.');
         setAiType('success');
       } else {
         const finalV = (m1 * st.v1 + m2 * st.v2) / (m1 + m2);
         st.v1 = finalV;
         st.v2 = finalV;
         setAiMessage('Kenetlenme (esnek olmayan çarpışma) gerçekleşti! Kinetik enerjinin bir kısmı ısıya dönüştü.');
         setAiType('warning');
       }
       nextX1 = nextX2 - blockW; // Prevent overlap
    }

    // Walls bounce
    if (nextX1 < 0) { nextX1 = 0; st.v1 = -st.v1; st.hasCollided = false; }
    if (nextX2 > CW - blockW) { nextX2 = CW - blockW; st.v2 = -st.v2; st.hasCollided = false; }

    st.x1 = nextX1;
    st.x2 = nextX2;
    st.t += dt;
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

    drawSystem(ctx, st.x1, st.x2, st.v1, st.v2);

    const p1 = m1 * st.v1;
    const p2 = m2 * st.v2;
    const pTotal = p1 + p2;
    const keTotal = 0.5 * m1 * st.v1 * st.v1 + 0.5 * m2 * st.v2 * st.v2;

    setDisplay({ v1: st.v1, v2: st.v2, pTotal, keTotal, t: st.t });

    if (st.running) {
      chartUpdateCounter.current++;
      if (chartUpdateCounter.current % 5 === 0) {
        setChartData(prev => {
          const newData = [...prev, { t: Number(st.t.toFixed(2)), p1: Number(p1.toFixed(2)), p2: Number(p2.toFixed(2)), pTotal: Number(pTotal.toFixed(2)), keTotal: Number(keTotal.toFixed(2)) }];
          if (newData.length > 200) return newData.slice(newData.length - 200);
          return newData;
        });
      }
      animRef.current = requestAnimationFrame(drawFrame);
    }
  }, [timeScale, m1, m2, isElastic]);

  useEffect(() => {
    if (!running) {
      stateRef.current.v1 = v1Init;
      stateRef.current.v2 = v2Init;
      drawFrame();
    }
  }, [v1Init, v2Init, m1, m2, isElastic, drawFrame, running]);

  const handleStart = () => {
    if (!running) {
      if (stateRef.current.t === 0) {
        stateRef.current.x1 = 150;
        stateRef.current.x2 = 650;
        stateRef.current.v1 = v1Init;
        stateRef.current.v2 = v2Init;
        stateRef.current.hasCollided = false;
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
    stateRef.current = { x1: 150, x2: 650, v1: v1Init, v2: v2Init, t: 0, lastTs: 0, running: false, hasCollided: false };
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
      title="Çarpışma Laboratuvarı"
      children={
        <div style={{ position: 'relative' }}>
          <canvas ref={canvasRef} width={CW} height={CH} style={{ width: '100%', height: 'auto', borderRadius: '8px', border: '1px solid #27272a' }} />
          <AstroTutorObserver message={aiMessage} type={aiType} />
        </div>
      }
      controls={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
             <div style={{ background: '#18181b', padding: '15px', borderRadius: '8px', borderTop: '3px solid #ef4444' }}>
                <SimSlider label="M1 Kütlesi (kg)" min={1} max={10} step={1} value={m1} onChange={setM1} />
                <SimSlider label="V1 İlk Hız (m/s)" min={-10} max={10} step={1} value={v1Init} onChange={setV1Init} />
             </div>
             <div style={{ background: '#18181b', padding: '15px', borderRadius: '8px', borderTop: '3px solid #3b82f6' }}>
                <SimSlider label="M2 Kütlesi (kg)" min={1} max={10} step={1} value={m2} onChange={setM2} />
                <SimSlider label="V2 İlk Hız (m/s)" min={-10} max={10} step={1} value={v2Init} onChange={setV2Init} />
             </div>
           </div>
           
           <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <SimButton label="Esnek (Enerji Korunur)" variant={isElastic ? 'primary' : 'secondary'} onClick={() => {setIsElastic(true); handleReset();}} />
              <SimButton label="Kenetlenme (Esnek Olmayan)" variant={!isElastic ? 'primary' : 'secondary'} onClick={() => {setIsElastic(false); handleReset();}} />
           </div>
           
           <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem', alignItems: 'center' }}>
              <SimButton label={running ? 'Duraklat' : 'Başlat'} variant="primary" onClick={handleStart} />
              <SimTimeController disabled={false} timeScale={timeScale} setTimeScale={setTimeScale} onStepForward={handleStepForward} />
              <SimButton label="Sıfırla" variant="danger" onClick={handleReset} />
           </div>

           <div style={{ background: '#18181b', padding: '15px', borderRadius: '8px', border: '1px solid #27272a', display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
             <div>
                <div style={{ fontSize: '12px', color: '#a1a1aa' }}>Zaman</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f4f4f5' }}>{display.t.toFixed(2)} s</div>
             </div>
             <div>
                <div style={{ fontSize: '12px', color: '#a1a1aa' }}>P Toplam</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>{display.pTotal.toFixed(1)} kg·m/s</div>
             </div>
             <div>
                <div style={{ fontSize: '12px', color: '#a1a1aa' }}>Ek Toplam</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f59e0b' }}>{display.keTotal.toFixed(1)} J</div>
             </div>
           </div>
        </div>
      }
      charts={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
          <div style={{ display: 'flex', gap: '0.5rem', background: '#18181b', padding: '4px', borderRadius: '8px' }}>
            <button onClick={() => setActiveChart('momentum_vs_t')} style={{ flex: 1, padding: '8px', background: activeChart === 'momentum_vs_t' ? '#27272a' : 'transparent', color: activeChart === 'momentum_vs_t' ? '#fff' : '#a1a1aa', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Momentum</button>
            <button onClick={() => setActiveChart('energy_vs_t')} style={{ flex: 1, padding: '8px', background: activeChart === 'energy_vs_t' ? '#27272a' : 'transparent', color: activeChart === 'energy_vs_t' ? '#fff' : '#a1a1aa', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Enerji</button>
          </div>
          <div style={{ flex: 1, minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              {activeChart === 'momentum_vs_t' ? (
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="t" stroke="#a1a1aa" fontSize={12} tickFormatter={(val) => `${val}s`} />
                  <YAxis stroke="#a1a1aa" fontSize={12} domain={['auto', 'auto']} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                  <Legend />
                  <Line type="monotone" dataKey="p1" name="P1 (Sol)" stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="p2" name="P2 (Sağ)" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="pTotal" name="P Toplam" stroke="#10b981" strokeWidth={3} dot={false} isAnimationActive={false} />
                </LineChart>
              ) : (
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="t" stroke="#a1a1aa" fontSize={12} tickFormatter={(val) => `${val}s`} />
                  <YAxis stroke="#a1a1aa" fontSize={12} domain={[0, 'auto']} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                  <Legend />
                  <Line type="monotone" dataKey="keTotal" name="Kinetik Enerji" stroke="#f59e0b" strokeWidth={3} dot={false} isAnimationActive={false} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      }
    />
  );
}
