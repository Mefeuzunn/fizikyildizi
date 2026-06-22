'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { SimSlider, SimButton, SimLayout } from './ui';
import { SimTimeController } from './ui/SimTimeController';
import { AstroTutorObserver } from './ui/AstroTutorObserver';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CW = 640;
const CH = 460;
const PIVOT_X = CW / 2;
const PIVOT_Y = 40;

function drawGrid(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x < CW; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CH); ctx.stroke(); }
  for (let y = 0; y < CH; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CW, y); ctx.stroke(); }
  ctx.restore();
}

function drawSystem(
  ctx: CanvasRenderingContext2D, 
  theta: number, omega: number, alpha: number, 
  length: number, mass: number, g: number, 
  isGhost: boolean = false
) {
  const scale = 150; // pixels per metre
  const L_px = length * scale;
  const bobX = PIVOT_X + Math.sin(theta) * L_px;
  const bobY = PIVOT_Y + Math.cos(theta) * L_px;
  const bobR = Math.max(12, mass * 10);

  ctx.save();

  if (!isGhost) {
    // Ceiling
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(PIVOT_X - 60, PIVOT_Y - 3); ctx.lineTo(PIVOT_X + 60, PIVOT_Y - 3); ctx.stroke();

    // Equilibrium line
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.setLineDash([4, 6]);
    ctx.beginPath(); ctx.moveTo(PIVOT_X, PIVOT_Y); ctx.lineTo(PIVOT_X, PIVOT_Y + L_px + 50); ctx.stroke();
    ctx.setLineDash([]);
  }

  // String
  ctx.strokeStyle = isGhost ? 'rgba(255,255,255,0.1)' : '#a1a1aa';
  ctx.lineWidth = isGhost ? 1 : 2;
  ctx.beginPath();
  ctx.moveTo(PIVOT_X, PIVOT_Y);
  ctx.lineTo(bobX, bobY);
  ctx.stroke();

  // Bob
  ctx.fillStyle = isGhost ? 'rgba(124,58,237,0.3)' : '#8b5cf6';
  ctx.beginPath();
  ctx.arc(bobX, bobY, bobR, 0, Math.PI * 2);
  ctx.fill();

  if (!isGhost) {
    ctx.shadowColor = '#8b5cf6';
    ctx.shadowBlur = Math.abs(omega) * 5;
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Draw Vectors
    // Tangential Velocity
    if (Math.abs(omega) > 0.1) {
      const v_tan = length * omega; // m/s
      const v_px = v_tan * 20; // visual scale
      // unit tangent vector: (cos(theta), -sin(theta))
      const vx = v_px * Math.cos(theta);
      const vy = v_px * -Math.sin(theta);
      drawArrow(ctx, bobX, bobY, bobX + vx, bobY + vy, '#3b82f6', `v`);
    }

    // Tangential Acceleration (Restoring force direction)
    if (Math.abs(alpha) > 0.1) {
      const a_tan = length * alpha; 
      const a_px = a_tan * 5; // visual scale
      const ax = a_px * Math.cos(theta);
      const ay = a_px * -Math.sin(theta);
      drawArrow(ctx, bobX, bobY, bobX + ax, bobY + ay, '#ef4444', `a_t`);
    }
  }

  ctx.restore();
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
  ctx.fillText(label, x2 + 5, y2 + 5);
  ctx.restore();
}

export default function PendulumSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  const [length, setLength] = useState(1.5); // m
  const [mass, setMass] = useState(1); // kg
  const [g, setG] = useState(9.81); // m/s²
  const [damping, setDamping] = useState(0); // drag
  const [startAngleDeg, setStartAngleDeg] = useState(45);

  const [running, setRunning] = useState(false);
  const [timeScale, setTimeScale] = useState(1);
  const [activeChart, setActiveChart] = useState<'theta_vs_t' | 'energy_vs_t'>('theta_vs_t');
  
  const [chartData, setChartData] = useState<{t: number, theta: number, ke: number, pe: number}[]>([]);
  const chartUpdateCounter = useRef(0);
  const [display, setDisplay] = useState({ theta: 0, omega: 0, t: 0, ke: 0, pe: 0 });
  const [aiMessage, setAiMessage] = useState<{text: string, type: 'info'|'warning'|'success'} | null>(null);

  // Ghost tracks logic
  const [ghost, setGhost] = useState<{theta: number, omega: number, L: number, m: number, g: number} | null>(null);

  const stateRef = useRef({
    theta: (startAngleDeg * Math.PI) / 180,
    omega: 0,
    t: 0,
    lastTs: 0,
    running: false
  });

  const stepPhysics = (dt: number, state: any, L: number, grav: number, damp: number, isGhost: boolean = false) => {
    // d2(theta)/dt2 + (g/L)*sin(theta) = 0
    const alpha = -(grav / L) * Math.sin(state.theta) - damp * state.omega;
    state.omega += alpha * dt;
    state.theta += state.omega * dt;
    if (!isGhost) state.t += dt;

    if (!isGhost) {
      if (Math.abs(state.omega) < 0.05 && Math.abs(state.theta) > 0.1) {
         if (Math.random() < 0.02) setAiMessage({ text: `Kenarlarda sarkaç anlık durur. Tüm kinetik enerji potansiyele dönüştü.`, type: 'info' });
      } else if (Math.abs(state.theta) < 0.05 && Math.abs(state.omega) > 0.5) {
         if (Math.random() < 0.02) setAiMessage({ text: `Denge noktasından maksimum hızla geçiliyor! Kinetik enerji zirvede.`, type: 'success' });
      }
    }
    return alpha;
  };

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const st = stateRef.current;

    ctx.fillStyle = '#050a1a';
    ctx.fillRect(0, 0, CW, CH);
    drawGrid(ctx);

    let alpha = 0;

    if (st.running) {
      const now = performance.now();
      const realDt = st.lastTs ? (now - st.lastTs) / 1000 : 0.016;
      st.lastTs = now;
      const simDt = Math.min(realDt, 0.05) * timeScale;
      
      // Step ghost if exists
      if (ghost) {
        stepPhysics(simDt, ghost, ghost.L, ghost.g, 0, true);
        drawSystem(ctx, ghost.theta, ghost.omega, 0, ghost.L, ghost.m, ghost.g, true);
      }

      alpha = stepPhysics(simDt, st, length, g, damping);
    } else {
      alpha = -(g / length) * Math.sin(st.theta) - damping * st.omega;
      if (ghost) {
        drawSystem(ctx, ghost.theta, ghost.omega, 0, ghost.L, ghost.m, ghost.g, true);
      }
    }

    const h = length - length * Math.cos(st.theta);
    const pe = mass * g * h;
    const v = length * st.omega;
    const ke = 0.5 * mass * v * v;

    drawSystem(ctx, st.theta, st.omega, alpha, length, mass, g, false);

    setDisplay({ theta: (st.theta * 180) / Math.PI, omega: st.omega, t: st.t, ke, pe });

    if (st.running) {
      chartUpdateCounter.current++;
      if (chartUpdateCounter.current % 5 === 0) {
        setChartData(prev => {
          const newData = [...prev, { t: Number(st.t.toFixed(2)), theta: Number((st.theta * 180 / Math.PI).toFixed(1)), ke: Number(ke.toFixed(2)), pe: Number(pe.toFixed(2)) }];
          if (newData.length > 200) return newData.slice(newData.length - 200);
          return newData;
        });
      }
      animRef.current = requestAnimationFrame(drawFrame);
    }
  }, [running, timeScale, length, mass, g, damping, ghost]);

  useEffect(() => {
    if (!running) {
      stateRef.current.theta = (startAngleDeg * Math.PI) / 180;
      stateRef.current.omega = 0;
      drawFrame();
    }
  }, [startAngleDeg, length, g, running, drawFrame]);

  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  const handleStart = () => {
    if (!running) {
      if (stateRef.current.t === 0) {
        stateRef.current.theta = (startAngleDeg * Math.PI) / 180;
        stateRef.current.omega = 0;
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
    // save as ghost
    if (stateRef.current.t > 0) {
      setGhost({ theta: stateRef.current.theta, omega: stateRef.current.omega, L: length, m: mass, g: g });
    }
    
    stateRef.current = { theta: (startAngleDeg * Math.PI) / 180, omega: 0, t: 0, lastTs: 0, running: false };
    setRunning(false);
    setChartData([]);
    setAiMessage(null);
    drawFrame();
  };

  const handleClearGhost = () => {
    setGhost(null);
    drawFrame();
  };

  const handleStepForward = () => {
    stateRef.current.running = false;
    setRunning(false);
    stepPhysics(0.05, stateRef.current, length, g, damping);
    if (ghost) stepPhysics(0.05, ghost, ghost.L, ghost.g, 0, true);
    drawFrame();
  };

  const handleExport = () => {
    const csv = "data:text/csv;charset=utf-8,Zaman(s),Aci(deg),KinetikEnerji(J),PotansiyelEnerji(J)\n"
      + chartData.map(e => `${e.t},${e.theta},${e.ke},${e.pe}`).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "sarkac_verileri.csv";
    link.click();
  };

  const controls = (
    <>
      <SimSlider label="İp Boyu (L)" value={length} min={0.5} max={2.5} step={0.1} unit="m" onChange={(val) => { setLength(val); handleReset(); }} />
      <SimSlider label="Kütle (m)" value={mass} min={0.5} max={5} step={0.5} unit="kg" onChange={(val) => { setMass(val); handleReset(); }} />
      <SimSlider label="Yerçekimi (g)" value={g} min={1.6} max={25} step={0.1} unit="m/s²" onChange={(val) => { setG(val); handleReset(); }} />
      <SimSlider label="Hava Direnci" value={damping} min={0} max={0.5} step={0.05} unit="" onChange={(val) => { setDamping(val); handleReset(); }} />
      <SimSlider label="Başlangıç Açısı" value={startAngleDeg} min={10} max={90} step={5} unit="°" onChange={(val) => { setStartAngleDeg(val); handleReset(); }} />
      
      <SimTimeController timeScale={timeScale} setTimeScale={setTimeScale} onStepForward={handleStepForward} />
      
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <SimButton label={running ? 'Duraklat' : stateRef.current.t > 0 ? 'Devam Et' : 'Bırak (Başla)'} onClick={handleStart} variant="primary" />
        <SimButton label="Sıfırla" onClick={handleReset} variant="secondary" />
      </div>
      {ghost && (
        <SimButton label="Hayalet İzi Temizle" onClick={handleClearGhost} variant="danger" />
      )}
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
          <option value="theta_vs_t">Açı (θ vs t)</option>
          <option value="energy_vs_t">Enerji (Ek, Ep vs t)</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis dataKey="t" stroke="#a1a1aa" fontSize={12} tickFormatter={(v) => v + 's'} />
          <YAxis stroke="#a1a1aa" fontSize={12} />
          <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }} />
          {activeChart === 'theta_vs_t' && <Line type="monotone" dataKey="theta" stroke="#8b5cf6" strokeWidth={2} dot={false} isAnimationActive={false} />}
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
      title="Basit Sarkaç Laboratuvarı"
      controls={controls}
      charts={charts}
      onExport={handleExport}
      mission={{ text: 'Farklı gezegenlerde (Yerçekimi g değişirken) periyodun nasıl etkilendiğini grafik üzerinden incele.', isCompleted: g !== 9.81 && stateRef.current.t > 3 }}
    >
      <canvas
        ref={canvasRef}
        width={CW}
        height={CH}
        style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }}
      />
      <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,0.6)', padding: '1rem', borderRadius: '12px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div>Zaman: <span style={{color: '#e4e4e7', fontFamily: 'monospace'}}>{display.t.toFixed(2)} s</span></div>
        <div>Açı: <span style={{color: '#8b5cf6', fontFamily: 'monospace'}}>{display.theta.toFixed(1)}°</span></div>
        <div>Açısal Hız: <span style={{color: '#3b82f6', fontFamily: 'monospace'}}>{display.omega.toFixed(2)} rad/s</span></div>
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />
        <div>Kinetik E.: <span style={{color: '#f59e0b', fontFamily: 'monospace'}}>{display.ke.toFixed(2)} J</span></div>
        <div>Potansiyel E.: <span style={{color: '#ec4899', fontFamily: 'monospace'}}>{display.pe.toFixed(2)} J</span></div>
        <div>Toplam Enerji: <span style={{color: '#fff', fontFamily: 'monospace'}}>{(display.ke + display.pe).toFixed(2)} J</span></div>
      </div>
      <AstroTutorObserver message={aiMessage?.text || null} type={aiMessage?.type} />
    </SimLayout>
  );
}
