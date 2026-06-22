'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { SimSlider, SimToggle, SimButton, SimLayout } from './ui';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


// ─── Types ─────────────────────────────────────────────────────────────────

interface Planet {
  name: string;
  g: number;
  color: string;
  emoji: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────

const PLANETS: Planet[] = [
  { name: 'Dünya', g: 9.81, color: '#06b6d4', emoji: '🌍' },
  { name: 'Ay', g: 1.62, color: '#94a3b8', emoji: '🌙' },
  { name: 'Mars', g: 3.72, color: '#ef4444', emoji: '🔴' },
];

const CANVAS_W = 600;
const CANVAS_H = 420;
const GROUND_Y = CANVAS_H - 50;
const BALL_R = 14;

// Pixels per meter
const PIXELS_PER_METER = (CANVAS_H - 100) / 100;

// ─── Drawing Helpers ────────────────────────────────────────────────────────

function drawGrid(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for (let x = 0; x < CANVAS_W; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_H); ctx.stroke();
  }
  for (let y = 0; y < CANVAS_H; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_W, y); ctx.stroke();
  }
  ctx.restore();
}

function drawGround(ctx: CanvasRenderingContext2D) {
  ctx.save();
  const grad = ctx.createLinearGradient(0, GROUND_Y, 0, CANVAS_H);
  grad.addColorStop(0, 'rgba(16,185,129,0.25)');
  grad.addColorStop(1, 'rgba(16,185,129,0.05)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, GROUND_Y, CANVAS_W, CANVAS_H - GROUND_Y);
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, GROUND_Y); ctx.lineTo(CANVAS_W, GROUND_Y); ctx.stroke();
  ctx.fillStyle = '#10b981';
  ctx.font = '11px monospace';
  ctx.fillText('Zemin (y = 0)', 8, GROUND_Y - 8);
  ctx.restore();
}

function drawHeightIndicator(ctx: CanvasRenderingContext2D, startY: number, currentY: number, h: number) {
  ctx.save();
  ctx.strokeStyle = 'rgba(245,158,11,0.4)';
  ctx.setLineDash([4, 4]);
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(30, startY); ctx.lineTo(30, GROUND_Y); ctx.stroke();
  // Arrow
  ctx.setLineDash([]);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(30, startY); ctx.lineTo(30, Math.min(currentY, GROUND_Y)); ctx.stroke();
  // h label
  const midY = (startY + Math.min(currentY, GROUND_Y)) / 2;
  ctx.fillStyle = '#fcd34d';
  ctx.font = 'bold 11px monospace';
  ctx.fillText(`h = ${h.toFixed(1)}m`, 35, midY);
  ctx.restore();
}

function drawBall(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, bouncing: boolean) {
  ctx.save();
  // Shadow
  const shadowY = Math.min(y + BALL_R * 2, GROUND_Y - 2);
  const shadowOpacity = Math.max(0.05, 0.4 - (shadowY - y) / 300);
  ctx.beginPath();
  ctx.ellipse(x, shadowY, BALL_R * 1.2, BALL_R * 0.35, 0, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(0,0,0,${shadowOpacity})`;
  ctx.fill();

  // Glow
  const glow = ctx.createRadialGradient(x, y, 0, x, y, BALL_R * 2.5);
  glow.addColorStop(0, `${color}55`);
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.beginPath(); ctx.arc(x, y, BALL_R * 2.5, 0, Math.PI * 2); ctx.fill();

  // Ball
  const grad = ctx.createRadialGradient(x - 4, y - 4, 1, x, y, BALL_R);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.3, color);
  grad.addColorStop(1, `${color}88`);
  ctx.beginPath(); ctx.arc(x, y, BALL_R, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  if (bouncing) {
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  ctx.restore();
}

function drawTrajectory(ctx: CanvasRenderingContext2D, points: [number, number][]) {
  if (points.length < 2) return;
  ctx.save();
  ctx.strokeStyle = 'rgba(124,58,237,0.5)';
  ctx.lineWidth = 2;
  ctx.setLineDash([3, 5]);
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  points.slice(1).forEach(([px, py]) => ctx.lineTo(px, py));
  ctx.stroke();
  ctx.restore();
}

interface SerbrestDusmeProps {
  initialParams?: {
    height?: number;
    planetIdx?: number;
    airResistance?: boolean;
    mass?: number;
    area?: number;
    dragCoeff?: number;
  };
  isLocked?: boolean;
}

export default function SerbrestDusme({ initialParams, isLocked = false }: SerbrestDusmeProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  
  // Physics parameters as states
  const [height, setHeight] = useState(initialParams?.height ?? 50);
  const [planetIdx, setPlanetIdx] = useState(initialParams?.planetIdx ?? 0);
  const [running, setRunning] = useState(false);
  const [hit, setHit] = useState(false);
  const [chartData, setChartData] = useState<{t: number, v: number, y: number}[]>([]);
  const chartUpdateCounter = useRef(0);

  
  // Air Resistance states
  const [airResistance, setAirResistance] = useState(initialParams?.airResistance ?? false);
  const [mass, setMass] = useState(initialParams?.mass ?? 1.0); // kg
  const [area, setArea] = useState(initialParams?.area ?? 0.2); // m²
  const [dragCoeff, setDragCoeff] = useState(initialParams?.dragCoeff ?? 0.24); // k value in Fd = k * A * v²
  
  const [display, setDisplay] = useState({
    v: 0,
    t: 0,
    dist: 0,
    ke: 0,
    acc: 0,
    netForce: 0,
    dragForce: 0,
    terminalV: 0
  });

  const planet = PLANETS[planetIdx];
  const startY = GROUND_Y - height * PIXELS_PER_METER;
  const ballX = CANVAS_W / 2;

  // Use a stateRef to avoid closure problems in requestAnimationFrame
  const stateRef = useRef({
    t: 0,
    y: 0, // position in meters (downward)
    v: 0, // velocity in m/s
    acc: 0, // acceleration in m/s²
    running: false,
    bounced: false,
    bounceTimer: 0,
    trajectory: [] as [number, number][],
    lastTimestamp: 0,
  });

  // Calculate terminal velocity: v = sqrt(m * g / (k * A))
  const terminalV = airResistance ? Math.sqrt((mass * planet.g) / (dragCoeff * area)) : Infinity;

  const draw = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const st = stateRef.current;

    // Background
    ctx.fillStyle = '#050a1a';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    drawGrid(ctx);

    const g = planet.g;
    
    // Physics loop logic (Numerical integration using Euler's method)
    if (st.running) {
      const now = performance.now();
      let dt = st.lastTimestamp ? (now - st.lastTimestamp) / 1000 : 0.016;
      st.lastTimestamp = now;
      
      // Cap dt to avoid huge coordinate jumps on tab switch
      if (dt > 0.05) dt = 0.016;

      const Fg = mass * g;
      const Fd = airResistance ? dragCoeff * area * st.v * st.v : 0;
      const Fnet = Math.max(0, Fg - Fd);
      
      st.acc = Fnet / mass;
      st.v += st.acc * dt;
      st.y += st.v * dt;
      st.t += dt;

      // Update trajectory
      const currentBallY = startY + st.y * PIXELS_PER_METER;
      if (st.trajectory.length === 0 || Math.abs(currentBallY - st.trajectory[st.trajectory.length - 1][1]) > 5) {
        st.trajectory.push([ballX, currentBallY]);
      }

      // Check ground collision
      if (st.y >= height) {
        st.y = height;
        st.running = false;
        st.bounced = true;
        st.bounceTimer = 0;
        setRunning(false);
        setHit(true);

        // Bounce animation
        let bFrame = 0;
        const bounceAnim = () => {
          st.bounceTimer = bFrame++;
          if (bFrame < 60) requestAnimationFrame(bounceAnim);
        };
        requestAnimationFrame(bounceAnim);
      }
    }

    const clampedY = startY + st.y * PIXELS_PER_METER;
    const currentHeight = Math.max(0, height - st.y);
    const ke = 0.5 * mass * st.v * st.v;
    const dragForce = airResistance ? dragCoeff * area * st.v * st.v : 0;
    const netForce = (mass * g) - dragForce;

    // Draw elements
    drawHeightIndicator(ctx, startY, clampedY, currentHeight);
    drawTrajectory(ctx, st.trajectory);
    drawGround(ctx);
    drawBall(ctx, ballX, clampedY, planet.color, st.bounced);

    // Hit message
    if (st.bounced) {
      ctx.save();
      ctx.font = 'bold 20px var(--font-outfit, Outfit, sans-serif)';
      ctx.textAlign = 'center';
      const alpha = Math.max(0, 1 - st.bounceTimer / 60);
      ctx.fillStyle = `rgba(239,68,68,${alpha})`;
      ctx.fillText('💥 Yere Çarptı!', CANVAS_W / 2, GROUND_Y - 30);
      ctx.restore();
    }

    // Update displays
    
      setDisplay({
        v: st.v,
        t: st.t,
        dist: st.y,
        ke,
        acc: st.acc,
        netForce: netForce,
        dragForce: dragForce,
        terminalV: airResistance ? Math.sqrt((mass * planet.g) / (dragCoeff * area)) : Infinity
      });
      
      chartUpdateCounter.current++;
      if (chartUpdateCounter.current % 5 === 0) {
         setChartData(prev => [...prev, { t: Number(st.t.toFixed(2)), v: Number(st.v.toFixed(2)), y: Number(st.y.toFixed(2)) }]);
      }


    if (st.running) {
      animRef.current = requestAnimationFrame(draw);
    }
  }, [height, planet, startY, ballX, airResistance, mass, area, dragCoeff, terminalV]);

  // Draw static frame when not running
  useEffect(() => {
    if (!running) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#050a1a';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      drawGrid(ctx);
      drawHeightIndicator(ctx, startY, startY, height);
      drawTrajectory(ctx, stateRef.current.trajectory);
      drawGround(ctx);
      drawBall(ctx, ballX, startY, planet.color, false);
    }
  }, [height, planetIdx, running, startY, ballX, planet.color]);

  const handleStart = () => {
    const st = stateRef.current;
    if (running) {
      st.running = false;
      cancelAnimationFrame(animRef.current);
      setRunning(false);
    } else {
      // If we are starting from scratch or re-launching after hitting zemin
      if (st.y >= height || hit) {
        st.y = 0;
        st.v = 0;
        st.t = 0;
        st.acc = planet.g;
        st.trajectory = [];
        st.bounced = false;
        st.bounceTimer = 0;
      }
      st.running = true;
      st.lastTimestamp = performance.now();
      setRunning(true);
      setHit(false);
    setChartData([]);
    chartUpdateCounter.current = 0;
      animRef.current = requestAnimationFrame(draw);
    }
  };

  const handleReset = () => {
    cancelAnimationFrame(animRef.current);
    stateRef.current = {
      t: 0,
      y: 0,
      v: 0,
      acc: planet.g,
      running: false,
      bounced: false,
      bounceTimer: 0,
      trajectory: [],
      lastTimestamp: 0
    };
    setRunning(false);
    setHit(false);
    setDisplay({
      v: 0,
      t: 0,
      dist: 0,
      ke: 0,
      acc: planet.g,
      netForce: mass * planet.g,
      dragForce: 0,
      terminalV
    });
  };

  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  const inputStyle: React.CSSProperties = {
    WebkitAppearance: 'none', appearance: 'none',
    width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)',
    borderRadius: '3px', outline: 'none', cursor: 'pointer',
    accentColor: '#7c3aed',
  };

  
  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Zaman(s),Hiz(m/s),Mesafe(m)\n"
        + chartData.map(e => `${e.t},${e.v},${e.y}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "serbest_dusme_raporu.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const controls = (
    <>
      <SimSlider label="Yükseklik" value={height} min={10} max={100} step={1} unit="m" onChange={(val) => { handleReset(); setHeight(val); }} />
      <SimToggle label="Hava Direnci" checked={airResistance} onChange={(val) => { handleReset(); setAirResistance(val); }} />
      {airResistance && (
        <div style={{ paddingLeft: '1rem', borderLeft: '2px solid #3f3f46', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <SimSlider label="Kütle (m)" value={mass} min={0.2} max={10} step={0.1} unit="kg" onChange={(val) => { handleReset(); setMass(val); }} />
          <SimSlider label="Kesit (A)" value={area} min={0.05} max={1} step={0.05} unit="m²" onChange={(val) => { handleReset(); setArea(val); }} />
          <SimSlider label="Direnç (k)" value={dragCoeff} min={0.05} max={0.5} step={0.01} onChange={(val) => { handleReset(); setDragCoeff(val); }} />
        </div>
      )}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <SimButton label={running ? 'Duraklat' : hit ? 'Tekrar' : 'Başlat'} onClick={handleStart} variant="primary" />
        <SimButton label="Sıfırla" onClick={handleReset} variant="secondary" />
      </div>
    </>
  );

  const charts = (
    <div style={{ height: '200px' }}>
      <h4 style={{ margin: '0 0 1rem 0', color: '#a1a1aa', fontSize: '0.85rem' }}>Hız - Zaman Grafiği</h4>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis dataKey="t" stroke="#a1a1aa" fontSize={12} tickFormatter={(val) => val + 's'} />
          <YAxis stroke="#a1a1aa" fontSize={12} tickFormatter={(val) => val + 'm/s'} />
          <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }} />
          <Line type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <SimLayout 
      title="Serbest Düşme Laboratuvarı"
      controls={controls}
      charts={charts}
      onExport={handleExport}
      mission={{ text: 'Hava direnci varken, 100m yükseklikten atılan cismin limit hızını bul ve raporu indir.', isCompleted: airResistance && hit && height === 100 }}
    >
       <canvas
         ref={canvasRef}
         width={CANVAS_W}
         height={CANVAS_H}
         style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }}
       />
       {/* Overlay Display */}
       <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,0.6)', padding: '1rem', borderRadius: '12px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div>Hız: <span style={{color: '#6366f1', fontFamily: 'monospace'}}>{display.v.toFixed(2)} m/s</span></div>
          <div>Mesafe: <span style={{color: '#10b981', fontFamily: 'monospace'}}>{display.dist.toFixed(2)} m</span></div>
          <div>Kinetik Enerji: <span style={{color: '#f59e0b', fontFamily: 'monospace'}}>{display.ke.toFixed(0)} J</span></div>
          {airResistance && <div>Limit Hız: <span style={{color: '#ec4899', fontFamily: 'monospace'}}>{display.terminalV.toFixed(2)} m/s</span></div>}
       </div>
    </SimLayout>
  );

}
