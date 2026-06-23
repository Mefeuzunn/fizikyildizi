'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SimLayout, SimSlider, SimButton, AstroTutorObserver, SimTimeController } from './ui';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CW = 800;
const CH = 380;

export default function MekanikEnerjiKorunumu() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  const [mass, setMass] = useState(50);
  const [gravity, setGravity] = useState(9.8);
  const [friction, setFriction] = useState(0.01);
  
  const [running, setRunning] = useState(false);
  const [timeScale, setTimeScale] = useState(1);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [aiType, setAiType] = useState<'info'|'warning'|'success'>('info');

  const [chartData, setChartData] = useState<{t: number, pe: number, ke: number, te: number, total: number}[]>([]);
  const chartUpdateCounter = useRef(0);

  const [display, setDisplay] = useState({ theta: 0, pe: 0, ke: 0, te: 0, total: 0, t: 0 });

  const trackRadius = 250;
  const pivotX = 400;
  const pivotY = 80;
  const startAngle = Math.PI / 3;

  const stateRef = useRef({
    theta: startAngle,
    omega: 0,
    totalThermal: 0,
    t: 0,
    lastTs: 0,
    running: false
  });

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 1;
    for (let x = 0; x <= CW; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CH); ctx.stroke(); }
    for (let y = 0; y <= CH; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CW, y); ctx.stroke(); }
  };

  const drawVector = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, label: string) => {
    if (Math.abs(x2 - x1) < 1 && Math.abs(y2 - y1) < 1) return;
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
    ctx.fillText(label, x2 + 5, y2 - 5);
    ctx.restore();
  };

  const drawSystem = (ctx: CanvasRenderingContext2D, theta: number, omega: number) => {
    // Half Pipe
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, trackRadius, 0, Math.PI, false);
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();

    const skaterX = pivotX + trackRadius * Math.sin(theta);
    const skaterY = pivotY + trackRadius * Math.cos(theta);

    // Skater
    ctx.save();
    ctx.translate(skaterX, skaterY);
    ctx.rotate(-theta);
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(0, -20, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.roundRect(-15, -5, 30, 8, 4);
    ctx.fill();
    ctx.restore();

    // Vektorler
    const vx = omega * trackRadius * Math.cos(theta);
    const vy = -omega * trackRadius * Math.sin(theta);
    drawVector(ctx, skaterX, skaterY, skaterX + vx * 10, skaterY + vy * 10, '#60a5fa', 'v');
  };

  const stepPhysics = (dt: number) => {
    const s = stateRef.current;
    const L = trackRadius / 100;
    
    const v = s.omega * L;
    const dragForce = friction * mass * v * Math.abs(v); 
    const dragAccel = dragForce / mass;
    const signOmega = s.omega > 0 ? 1 : (s.omega < 0 ? -1 : 0);
    
    const alpha = -(gravity / L) * Math.sin(s.theta) - (signOmega * dragAccel / L);
    
    s.omega += alpha * dt;
    s.theta += s.omega * dt;
    
    const thermalGained = Math.abs(dragForce * v * dt);
    s.totalThermal += thermalGained;
    s.t += dt;

    if (Math.abs(s.omega) < 0.05 && Math.abs(s.theta) > 0.5) {
       if (Math.random() < 0.02) { setAiMessage('Kinetik enerji sıfırlandı, tüm enerji potansiyelde!'); setAiType('info'); }
    } else if (Math.abs(s.theta) < 0.05 && Math.abs(s.omega) > 1) {
       if (Math.random() < 0.02) { setAiMessage('Denge konumundan geçerken kinetik enerji maksimum!'); setAiType('success'); }
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

    drawSystem(ctx, st.theta, st.omega);

    const L = trackRadius / 100;
    const height = L * (1 - Math.cos(st.theta));
    const PE = mass * gravity * height;
    const KE = 0.5 * mass * Math.pow(st.omega * L, 2);
    const TE = st.totalThermal;
    const Total = PE + KE + TE;

    setDisplay({ theta: st.theta, pe: PE, ke: KE, te: TE, total: Total, t: st.t });

    if (st.running) {
      chartUpdateCounter.current++;
      if (chartUpdateCounter.current % 5 === 0) {
        setChartData(prev => {
          const newData = [...prev, { t: Number(st.t.toFixed(2)), pe: Number(PE.toFixed(1)), ke: Number(KE.toFixed(1)), te: Number(TE.toFixed(1)), total: Number(Total.toFixed(1)) }];
          if (newData.length > 200) return newData.slice(newData.length - 200);
          return newData;
        });
      }
      animRef.current = requestAnimationFrame(drawFrame);
    }
  }, [mass, gravity, friction, timeScale]);

  useEffect(() => {
    if (!running) {
      drawFrame();
    }
  }, [mass, gravity, friction, drawFrame, running]);

  const handleStart = () => {
    if (!running) {
      if (stateRef.current.t === 0) {
        stateRef.current.theta = startAngle;
        stateRef.current.omega = 0;
        stateRef.current.totalThermal = 0;
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
    stateRef.current = { theta: startAngle, omega: 0, totalThermal: 0, t: 0, lastTs: 0, running: false };
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
      title="Mekanik Enerji Korunumu"
      children={
        <div style={{ position: 'relative' }}>
          <canvas ref={canvasRef} width={CW} height={CH} style={{ width: '100%', height: 'auto', borderRadius: '8px', border: '1px solid #27272a' }} />
          <AstroTutorObserver message={aiMessage} type={aiType} />
        </div>
      }
      controls={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
             <div style={{ background: '#18181b', padding: '15px', borderRadius: '8px', borderTop: '3px solid #8b5cf6' }}>
                <SimSlider label="Kütle (kg)" min={10} max={100} step={5} value={mass} onChange={(v) => {setMass(v); handleReset();}} />
                <SimSlider label="Yerçekimi (m/s²)" min={1} max={20} step={0.5} value={gravity} onChange={(v) => {setGravity(v); handleReset();}} />
                <SimSlider label="Sürtünme Katsayısı" min={0} max={0.1} step={0.005} value={friction} onChange={(v) => {setFriction(v); handleReset();}} />
             </div>
           </div>
           
           <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginTop: '1rem', alignItems: 'center' }}>
              <SimButton label={running ? 'Duraklat' : 'Başlat'} variant="primary" onClick={handleStart} />
              <SimTimeController disabled={false} timeScale={timeScale} setTimeScale={setTimeScale} onStepForward={handleStepForward} />
              <SimButton label="Sıfırla" variant="danger" onClick={handleReset} />
           </div>

           <div style={{ background: '#18181b', padding: '15px', borderRadius: '8px', border: '1px solid #27272a', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
             <div><span style={{ fontSize: '12px', color: '#a1a1aa' }}>Potansiyel:</span> <br/><span style={{ color: '#3b82f6', fontWeight: 'bold' }}>{display.pe.toFixed(0)} J</span></div>
             <div><span style={{ fontSize: '12px', color: '#a1a1aa' }}>Kinetik:</span> <br/><span style={{ color: '#10b981', fontWeight: 'bold' }}>{display.ke.toFixed(0)} J</span></div>
             <div><span style={{ fontSize: '12px', color: '#a1a1aa' }}>Isı (Sürtünme):</span> <br/><span style={{ color: '#ef4444', fontWeight: 'bold' }}>{display.te.toFixed(0)} J</span></div>
             <div><span style={{ fontSize: '12px', color: '#a1a1aa' }}>Toplam:</span> <br/><span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{display.total.toFixed(0)} J</span></div>
           </div>
        </div>
      }
      charts={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
          <div style={{ display: 'flex', gap: '0.5rem', background: '#18181b', padding: '4px', borderRadius: '8px' }}>
            <button style={{ flex: 1, padding: '8px', background: '#27272a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Enerji vs Zaman</button>
          </div>
          <div style={{ flex: 1, minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
               <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="t" stroke="#a1a1aa" fontSize={12} tickFormatter={(val) => `${val}s`} />
                  <YAxis stroke="#a1a1aa" fontSize={12} domain={[0, 'auto']} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                  <Legend />
                  <Line type="monotone" dataKey="pe" name="Potansiyel" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="ke" name="Kinetik" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="te" name="Isı (Sürtünme)" stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="total" name="Toplam E." stroke="#f59e0b" strokeWidth={3} dot={false} isAnimationActive={false} />
                </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      }
    />
  );
}
