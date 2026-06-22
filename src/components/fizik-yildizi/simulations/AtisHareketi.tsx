'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { SimSlider, SimToggle, SimButton, SimLayout } from './ui';
import { SimTimeController } from './ui/SimTimeController';
import { AstroTutorObserver } from './ui/AstroTutorObserver';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// ─── Canvas dimensions ──────────────────────────────────────────────────────
const CW = 640;
const CH = 420;
const GROUND_Y = CH - 60;
const ORIGIN_X = 80;
const ORIGIN_Y = GROUND_Y;

const G = 9.81; // m/s²
const SCALE = 4; // pixels per meter

type ThrowMode = 'egik' | 'yatay' | 'dusey';

// ─── Drawing helpers ────────────────────────────────────────────────────────

function drawGrid(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x < CW; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CH); ctx.stroke(); }
  for (let y = 0; y < CH; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CW, y); ctx.stroke(); }
  ctx.restore();
}

function drawAxes(ctx: CanvasRenderingContext2D, mode: ThrowMode, height: number) {
  ctx.save();
  // Ground
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, GROUND_Y); ctx.lineTo(CW, GROUND_Y); ctx.stroke();

  // Y axis
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(ORIGIN_X, 10); ctx.lineTo(ORIGIN_X, GROUND_Y); ctx.stroke();
  ctx.setLineDash([]);

  // Tower/Platform for high launches
  if ((mode === 'yatay' || mode === 'dusey') && height > 0) {
    const platformY = GROUND_Y - height * SCALE;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fillRect(ORIGIN_X - 15, platformY, 30, height * SCALE);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(ORIGIN_X - 15, platformY, 30, height * SCALE);
    
    // Draw height indicator
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 3]);
    ctx.beginPath(); ctx.moveTo(ORIGIN_X - 25, platformY); ctx.lineTo(ORIGIN_X - 25, GROUND_Y); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#fbbf24';
    ctx.font = '9px monospace';
    ctx.fillText(`${height}m`, ORIGIN_X - 55, platformY + (height * SCALE) / 2);
  }

  // Labels
  ctx.fillStyle = '#10b981';
  ctx.font = '11px monospace';
  ctx.fillText('Zemin', 8, GROUND_Y - 8);

  // Distance markers
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.font = '10px monospace';
  for (let m = 0; m * SCALE <= CW - ORIGIN_X; m += 20) {
    const px = ORIGIN_X + m * SCALE;
    ctx.fillText(`${m}m`, px - 6, GROUND_Y + 18);
    ctx.beginPath();
    ctx.moveTo(px, GROUND_Y);
    ctx.lineTo(px, GROUND_Y + 5);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.restore();
}

function drawTrajectory(ctx: CanvasRenderingContext2D, points: [number, number][], isGhost = false) {
  if (points.length < 2) return;
  ctx.save();
  ctx.strokeStyle = isGhost ? 'rgba(255,255,255,0.15)' : 'rgba(124,58,237,0.6)';
  ctx.lineWidth = isGhost ? 1 : 2;
  ctx.setLineDash([4, 6]);
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  points.slice(1).forEach(([px, py]) => ctx.lineTo(px, py));
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function drawProjectile(ctx: CanvasRenderingContext2D, px: number, py: number, vx: number, vy: number, mass: number) {
  ctx.save();
  // Glow
  const radius = Math.min(20, 8 + mass);
  const glow = ctx.createRadialGradient(px, py, 0, px, py, radius * 2);
  glow.addColorStop(0, 'rgba(245,158,11,0.4)');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.beginPath(); ctx.arc(px, py, radius * 2, 0, Math.PI * 2); ctx.fill();

  // Ball
  const grad = ctx.createRadialGradient(px - radius*0.3, py - radius*0.3, 1, px, py, radius);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.3, '#f59e0b');
  grad.addColorStop(1, '#d97706');
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.arc(px, py, radius, 0, Math.PI * 2); ctx.fill();

  // Dynamic Velocity Vector arrow (Hyper-professional feature)
  const velMag = Math.sqrt(vx*vx + vy*vy);
  if (velMag > 0.1) {
    const arrowScale = 1.0;
    const ax = px + vx * arrowScale;
    const ay = py - vy * arrowScale; // canvas y inverted
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(ax, ay); ctx.stroke();
    
    // Draw arrow head
    const angle = Math.atan2(-vy, vx);
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(ax - 8 * Math.cos(angle - Math.PI / 6), ay - 8 * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(ax, ay);
    ctx.lineTo(ax - 8 * Math.cos(angle + Math.PI / 6), ay - 8 * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
    
    // Vector Label
    ctx.fillStyle = '#06b6d4';
    ctx.font = '10px monospace';
    ctx.fillText(`v=${velMag.toFixed(1)}`, ax + 5, ay - 5);
  }
  ctx.restore();
}

function drawMarkers(ctx: CanvasRenderingContext2D, maxH: number, maxHX: number, range: number, mode: ThrowMode) {
  ctx.save();
  if (maxH > 0.5 && mode !== 'yatay') {
    const mhY = ORIGIN_Y - maxH * SCALE;
    const mhX = ORIGIN_X + maxHX * SCALE;
    ctx.setLineDash([3, 5]);
    ctx.strokeStyle = 'rgba(16,185,129,0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(ORIGIN_X, mhY); ctx.lineTo(mhX, mhY); ctx.stroke();
    if (mode === 'egik') {
      ctx.beginPath(); ctx.moveTo(mhX, mhY); ctx.lineTo(mhX, GROUND_Y); ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(`Hmax: ${maxH.toFixed(1)}m`, mode === 'dusey' ? ORIGIN_X + 15 : mhX - 30, mhY - 6);
  }

  if (range > 0.5 && mode !== 'dusey') {
    const rx = ORIGIN_X + range * SCALE;
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(`Menzil: ${range.toFixed(1)}m`, Math.min(rx - 30, CW - 110), GROUND_Y - 10);
    ctx.beginPath(); ctx.arc(rx, GROUND_Y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();
  }
  ctx.restore();
}

interface AtisHareketiProps {
  initialParams?: {
    mode?: ThrowMode;
    v0?: number;
    angleDeg?: number;
    height?: number;
  };
  isLocked?: boolean;
}

export default function AtisHareketi({ initialParams, isLocked = false }: AtisHareketiProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  // States
  const [mode, setMode] = useState<ThrowMode>(initialParams?.mode ?? 'egik');
  const [v0, setV0] = useState(initialParams?.v0 ?? 30);
  const [angleDeg, setAngleDeg] = useState(initialParams?.angleDeg ?? 45);
  const [height, setHeight] = useState(initialParams?.height ?? 30);
  const [airResistance, setAirResistance] = useState(false);
  const [mass, setMass] = useState(1); 
  
  const [running, setRunning] = useState(false);
  const [launched, setLaunched] = useState(false);
  
  // Phase 8 Hyper-pro features
  const [timeScale, setTimeScale] = useState(1);
  const [aiMessage, setAiMessage] = useState<{text: string, type: 'info'|'warning'|'success'} | null>(null);
  const [ghostTrails, setGhostTrails] = useState<[number, number][][]>([]);
  const [activeChart, setActiveChart] = useState<'y_vs_x' | 'vy_vs_t' | 'y_vs_t'>('y_vs_x');

  const [chartData, setChartData] = useState<{t: number, x: number, y: number, vy: number}[]>([]);
  const chartUpdateCounter = useRef(0);
  
  const [display, setDisplay] = useState({ x: 0, y: 0, vx: 0, vy: 0, t: 0 });

  const angleRad = (angleDeg * Math.PI) / 180;

  // Resolve starting physics parameters
  let startX_m = 0;
  let startY_m = mode === 'egik' ? 0 : height;
  let vx0 = 0;
  let vy0 = 0;

  if (mode === 'egik') {
    vx0 = v0 * Math.cos(angleRad);
    vy0 = v0 * Math.sin(angleRad);
  } else if (mode === 'yatay') {
    vx0 = v0;
    vy0 = 0;
  } else if (mode === 'dusey') {
    vx0 = 0;
    vy0 = v0; 
  }

  const stateRef = useRef({
    t: 0,
    running: false,
    trajectory: [] as [number, number][],
    maxH: 0,
    maxHX: 0,
    range: 0,
    lastTs: 0,
    x: 0,
    y: 0,
    vx: vx0,
    vy: vy0
  });

  const stepPhysics = (dt: number) => {
    const st = stateRef.current;
    st.t += dt;

    if (airResistance) {
      const v = Math.sqrt(st.vx * st.vx + st.vy * st.vy);
      const k = 0.05; // Drag coeff
      const Fd = k * v * v;
      const ax = -(Fd / mass) * (st.vx / v);
      const ay = -G - (Fd / mass) * (st.vy / v);
      st.vx += ax * dt;
      st.vy += ay * dt;
      st.x += st.vx * dt;
      st.y += st.vy * dt;
    } else {
      st.x = vx0 * st.t;
      st.y = startY_m + vy0 * st.t - 0.5 * G * st.t * st.t;
      st.vy = vy0 - G * st.t;
    }

    if (st.y <= 0 && st.t > 0) {
      st.y = 0;
      st.running = false;
      st.range = st.x;
      setRunning(false);
      setGhostTrails(prev => [...prev.slice(-2), st.trajectory]); // keep last 2 ghosts
      
      if (airResistance && mode === 'egik' && angleDeg === 45) {
        setAiMessage({ text: 'Sürtünme varken 45° açısı maksimum menzili vermez. Daha düşük bir açıyı dene!', type: 'info' });
      } else if (!airResistance && mode === 'egik' && angleDeg === 45) {
        setAiMessage({ text: 'Harika! Sürtünmesiz ortamda 45° açısı teorik maksimum menzile ulaştı.', type: 'success' });
      }
    }
    
    if (st.vy < 0 && st.vy > -G * dt * 2 && st.y > st.maxH) {
      // Reached max height
      if (st.y > 10) setAiMessage({ text: `Cisim maksimum yüksekliğe ulaştı (${st.y.toFixed(1)}m). Düşey hız anlık sıfır!`, type: 'warning' });
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
    drawAxes(ctx, mode, height);

    // Draw ghost trails
    ghostTrails.forEach(trail => drawTrajectory(ctx, trail, true));

    if (st.running) {
      const now = performance.now();
      const realDt = st.lastTs ? (now - st.lastTs) / 1000 : 0.016;
      st.lastTs = now;
      
      // Time scale application
      const simDt = Math.min(realDt, 0.05) * timeScale;
      stepPhysics(simDt);
    }

    const px = ORIGIN_X + st.x * SCALE;
    const py = ORIGIN_Y - st.y * SCALE;

    if (st.running || launched) {
      if (st.trajectory.length === 0 || Math.abs(px - st.trajectory[st.trajectory.length - 1][0]) > 3) {
        st.trajectory.push([px, py]);
      }
      if (st.y > st.maxH) { st.maxH = st.y; st.maxHX = st.x; }
      
      drawTrajectory(ctx, st.trajectory);
      drawMarkers(ctx, st.maxH, st.maxHX, st.range, mode);
      drawProjectile(ctx, Math.min(px, CW - 15), Math.max(py, 15), st.vx, st.vy, mass);
    } else {
      // Pre-launch vectors
      const startBallY = ORIGIN_Y - startY_m * SCALE;
      if (mode === 'egik') {
        const arrowLen = 50;
        const arrowX = ORIGIN_X + Math.cos(angleRad) * arrowLen;
        const arrowY = ORIGIN_Y - Math.sin(angleRad) * arrowLen;
        ctx.save();
        ctx.strokeStyle = '#7c3aed';
        ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(ORIGIN_X, ORIGIN_Y); ctx.lineTo(arrowX, arrowY); ctx.stroke();
        ctx.fillStyle = '#7c3aed';
        ctx.beginPath(); ctx.arc(arrowX, arrowY, 5, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(124,58,237,0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(ORIGIN_X, ORIGIN_Y, 30, -angleRad, 0); ctx.stroke();
        ctx.fillStyle = '#a78bfa';
        ctx.font = '11px monospace';
        ctx.fillText(`${angleDeg}°`, ORIGIN_X + 35, ORIGIN_Y - 10);
        ctx.restore();
      }
      drawProjectile(ctx, ORIGIN_X, startBallY, vx0, vy0, mass);
    }

    setDisplay({ x: st.x, y: st.y, vx: st.vx, vy: st.vy, t: st.t });

    if (st.running) {
      chartUpdateCounter.current++;
      if (chartUpdateCounter.current % 5 === 0) {
        setChartData(prev => [...prev, { t: Number(st.t.toFixed(2)), x: Number(st.x.toFixed(2)), y: Number(st.y.toFixed(2)), vy: Number(st.vy.toFixed(2)) }]);
      }
      animRef.current = requestAnimationFrame(drawFrame);
    }
  }, [mode, height, vx0, vy0, startY_m, angleDeg, angleRad, launched, running, timeScale, airResistance, mass, ghostTrails]);

  useEffect(() => {
    if (!running && !launched) {
      stateRef.current.x = startX_m;
      stateRef.current.y = startY_m;
      stateRef.current.vx = vx0;
      stateRef.current.vy = vy0;
      drawFrame();
    }
  }, [mode, height, v0, angleDeg, angleRad, startY_m, running, launched, drawFrame, vx0, vy0, startX_m]);

  const handleLaunch = () => {
    stateRef.current = {
      t: 0, running: true, trajectory: [], maxH: startY_m, maxHX: 0, range: 0, lastTs: performance.now(),
      x: startX_m, y: startY_m, vx: vx0, vy: vy0
    };
    setChartData([]);
    setRunning(true);
    setLaunched(true);
    setAiMessage(null);
    animRef.current = requestAnimationFrame(drawFrame);
  };

  const handleStepForward = () => {
    if (!launched) handleLaunch();
    setRunning(false); // pause
    stepPhysics(0.05); // step 50ms
    drawFrame();
  };

  const handleReset = () => {
    cancelAnimationFrame(animRef.current);
    stateRef.current = { t: 0, running: false, trajectory: [], maxH: 0, maxHX: 0, range: 0, lastTs: 0, x: startX_m, y: startY_m, vx: vx0, vy: vy0 };
    setRunning(false);
    setLaunched(false);
    setChartData([]);
    setDisplay({ x: 0, y: 0, vx: 0, vy: 0, t: 0 });
    setAiMessage(null);
  };

  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8,Zaman(s),Menzil X(m),Yukseklik Y(m),Hiz Y(m/s)\n"
        + chartData.map(e => `${e.t},${e.x},${e.y},${e.vy}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "egik_atis_raporu.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const controls = (
    <>
      <SimSlider label="Atış Hızı" value={v0} min={5} max={80} step={1} unit="m/s" onChange={(val) => { handleReset(); setV0(val); }} />
      <SimSlider label="Açı" value={angleDeg} min={0} max={90} step={1} unit="°" onChange={(val) => { handleReset(); setAngleDeg(val); }} />
      <SimSlider label="Başlangıç Yüksekliği" value={height} min={0} max={100} step={1} unit="m" onChange={(val) => { handleReset(); setHeight(val); }} />
      <SimToggle label="Hava Direnci" checked={airResistance} onChange={(val) => { handleReset(); setAirResistance(val); }} />
      {airResistance && (
        <div style={{ paddingLeft: '1rem', borderLeft: '2px solid #3f3f46', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <SimSlider label="Kütle (m)" value={mass} min={0.2} max={10} step={0.1} unit="kg" onChange={(val) => { handleReset(); setMass(val); }} />
        </div>
      )}
      <SimTimeController timeScale={timeScale} setTimeScale={setTimeScale} onStepForward={handleStepForward} />
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <SimButton label={running ? 'Duraklat' : launched ? 'Devam Et' : 'Başlat'} onClick={() => {
          if (!launched) handleLaunch();
          else { stateRef.current.lastTs = performance.now(); setRunning(!running); if(!running) drawFrame(); }
        }} variant="primary" />
        <SimButton label="Sıfırla" onClick={handleReset} variant="secondary" />
      </div>
      {ghostTrails.length > 0 && (
         <SimButton label="Hayalet İzleri Temizle" onClick={() => setGhostTrails([])} variant="danger" />
      )}
    </>
  );

  const charts = (
    <div style={{ height: '240px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h4 style={{ margin: 0, color: '#a1a1aa', fontSize: '0.85rem' }}>Laboratuvar Grafikleri</h4>
        <select 
          value={activeChart} onChange={(e: any) => setActiveChart(e.target.value)}
          style={{ background: 'rgba(255,255,255,0.05)', color: '#f4f4f5', border: '1px solid #3f3f46', borderRadius: '4px', fontSize: '0.75rem', padding: '0.2rem' }}
        >
          <option value="y_vs_x">Yörünge (Y vs X)</option>
          <option value="vy_vs_t">Düşey Hız (Vy vs T)</option>
          <option value="y_vs_t">Yükseklik (Y vs T)</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis dataKey={activeChart === 'y_vs_x' ? 'x' : 't'} stroke="#a1a1aa" fontSize={12} tickFormatter={(val) => val + (activeChart === 'y_vs_x' ? 'm' : 's')} />
          <YAxis stroke="#a1a1aa" fontSize={12} tickFormatter={(val) => val + (activeChart === 'vy_vs_t' ? 'm/s' : 'm')} />
          <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }} />
          <Line 
            type="monotone" 
            dataKey={activeChart === 'y_vs_x' ? 'y' : activeChart === 'vy_vs_t' ? 'vy' : 'y'} 
            stroke={activeChart === 'vy_vs_t' ? '#ec4899' : '#10b981'} 
            strokeWidth={2} dot={false} isAnimationActive={false} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <SimLayout 
      title="Eğik Atış Laboratuvarı (Hyper-Pro)"
      controls={controls}
      charts={charts}
      onExport={handleExport}
      mission={{ text: 'Maksimum menzile ulaşmak için sürtünmesiz ortamda doğru açıyı bul (İpucu: 45°).', isCompleted: !airResistance && launched && angleDeg === 45 }}
    >
       <canvas
         ref={canvasRef}
         width={CW}
         height={CH}
         style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }}
       />
       {/* Overlay Display */}
       <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,0.6)', padding: '1rem', borderRadius: '12px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div>Zaman T: <span style={{color: '#e4e4e7', fontFamily: 'monospace'}}>{display.t.toFixed(2)} s</span></div>
          <div>Hız X: <span style={{color: '#6366f1', fontFamily: 'monospace'}}>{display.vx.toFixed(2)} m/s</span></div>
          <div>Hız Y: <span style={{color: '#8b5cf6', fontFamily: 'monospace'}}>{display.vy.toFixed(2)} m/s</span></div>
          <div>Menzil X: <span style={{color: '#10b981', fontFamily: 'monospace'}}>{display.x.toFixed(2)} m</span></div>
          <div>Yükseklik Y: <span style={{color: '#f59e0b', fontFamily: 'monospace'}}>{display.y.toFixed(2)} m</span></div>
       </div>
       <AstroTutorObserver message={aiMessage?.text || null} type={aiMessage?.type} />
    </SimLayout>
  );
}
