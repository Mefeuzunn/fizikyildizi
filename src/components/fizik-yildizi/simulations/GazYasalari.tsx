'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SimLayout, SimSlider, SimButton, AstroTutorObserver, SimTimeController } from './ui';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CW = 800;
const CH = 380;

export default function GazYasalari() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  const [temperature, setTemperature] = useState(300); // Kelvin
  const [volume, setVolume] = useState(500); // representation of width
  
  const [running, setRunning] = useState(true);
  const [timeScale, setTimeScale] = useState(1);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [aiType, setAiType] = useState<'info'|'warning'|'success'>('info');

  const [chartData, setChartData] = useState<{t: number, pressure: number}[]>([]);
  const chartUpdateCounter = useRef(0);

  const [display, setDisplay] = useState({ pressure: 0, t: 0 });

  const numParticles = 200;
  const radius = 4;
  const canvasHeight = 300;
  const paddingY = (CH - canvasHeight) / 2; // center vertically
  const paddingX = 50;

  const particlesRef = useRef<Array<{x: number, y: number, vx: number, vy: number}>>([]);
  const stateRef = useRef({
    t: 0,
    lastTs: 0,
    running: true
  });

  // Initialize particles
  useEffect(() => {
    const particles = [];
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * (volume - 2 * radius) + radius,
        y: Math.random() * (canvasHeight - 2 * radius) + radius,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2
      });
    }
    particlesRef.current = particles;
  }, []); // Run once

  // When volume changes, adjust particles that might be outside
  useEffect(() => {
    particlesRef.current.forEach(p => {
      if (p.x > volume - radius) p.x = volume - radius * 2;
    });
    
    if (volume < 300 && temperature > 600) {
      setAiMessage('Dikkat! Hacim çok küçük ve sıcaklık çok yüksek. Basınç tehlikeli seviyelere ulaştı! (P = nRT/V)');
      setAiType('warning');
    } else if (volume > 600 && temperature < 200) {
      setAiMessage('Hacim arttı, sıcaklık düştü. Taneciklerin çeperlere çarpma hızı ve sıklığı azaldığı için basınç çok düştü.');
      setAiType('info');
    }
  }, [volume, temperature]);

  const getParticleColor = (temp: number) => {
    if (temp > 500) return '#ef4444'; // red
    if (temp < 200) return '#3b82f6'; // blue
    return '#10b981'; // green
  };

  const drawSystem = (ctx: CanvasRenderingContext2D, currentTemp: number, currentVol: number) => {
    ctx.fillStyle = '#050a1a';
    ctx.fillRect(0, 0, CW, CH);

    ctx.save();
    ctx.translate(paddingX, paddingY);

    // Draw container boundaries
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 6;
    ctx.lineJoin = 'round';
    ctx.strokeRect(3, 3, currentVol, canvasHeight - 6);
    
    // Draw movable piston
    ctx.fillStyle = '#9ca3af';
    ctx.fillRect(currentVol, 0, 24, canvasHeight);
    
    // Piston details
    ctx.fillStyle = '#4b5563';
    ctx.fillRect(currentVol + 24, canvasHeight/2 - 10, 100, 20); // Handle

    // Draw particles
    const pColor = getParticleColor(currentTemp);
    
    particlesRef.current.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = pColor;
      ctx.shadowBlur = 4;
      ctx.shadowColor = pColor;
      ctx.fill();
    });

    ctx.restore();
  };

  const stepPhysics = (dt: number) => {
    const s = stateRef.current;
    
    // Speed scaling based on temperature (Kinetic Energy proportional to T)
    // v_rms = sqrt(3RT/M) -> speed is proportional to sqrt(T)
    const speedScale = Math.sqrt(temperature / 300) * 3.5;
    
    // Time scaling for visual speed
    const visualDt = dt * 60; // 60fps baseline

    particlesRef.current.forEach(p => {
      const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (currentSpeed !== 0) {
        p.vx = (p.vx / currentSpeed) * speedScale;
        p.vy = (p.vy / currentSpeed) * speedScale;
      }

      p.x += p.vx * visualDt;
      p.y += p.vy * visualDt;

      // Wall collisions
      if (p.x - radius < 3) {
        p.x = radius + 3;
        p.vx *= -1;
      }
      if (p.x + radius > volume) {
        p.x = volume - radius;
        p.vx *= -1;
      }
      if (p.y - radius < 3) {
        p.y = radius + 3;
        p.vy *= -1;
      }
      if (p.y + radius > canvasHeight - 3) {
        p.y = canvasHeight - 3 - radius;
        p.vy *= -1;
      }
    });

    s.t += dt;
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

    drawSystem(ctx, temperature, volume);
    
    // Ideal Gas Law: PV = nRT -> P = (nR)T/V
    // Arbitrary constant for display: nR = 100
    const calculatedPressure = (100 * temperature) / volume;
    setDisplay({ pressure: calculatedPressure, t: st.t });

    if (st.running) {
      chartUpdateCounter.current++;
      if (chartUpdateCounter.current % 5 === 0) {
        setChartData(prev => {
          const newData = [...prev, { t: Number(st.t.toFixed(2)), pressure: Number(calculatedPressure.toFixed(1)) }];
          if (newData.length > 200) return newData.slice(newData.length - 200);
          return newData;
        });
      }
      animRef.current = requestAnimationFrame(drawFrame);
    }
  }, [temperature, volume, timeScale]);

  useEffect(() => {
    if (!running) {
      drawFrame();
    }
  }, [temperature, volume, drawFrame, running]);

  const handleStart = () => {
    if (!running) {
      stateRef.current.lastTs = performance.now();
      stateRef.current.running = true;
      setRunning(true);
      animRef.current = requestAnimationFrame(drawFrame);
    } else {
      stateRef.current.running = false;
      setRunning(false);
    }
  };

  const handleReset = () => {
    // Keep particles, just reset charts and time?
    // Actually, maybe reset temp/vol too
    setTemperature(300);
    setVolume(500);
    stateRef.current.t = 0;
    setChartData([]);
    setAiMessage(null);
    if (!running) drawFrame();
  };

  const handleStepForward = () => {
    stateRef.current.running = false;
    setRunning(false);
    stepPhysics(0.05);
    drawFrame();
  };

  return (
    <SimLayout
      title="İdeal Gaz Yasaları (P, V, T)"
      children={
        <div style={{ position: 'relative' }}>
          <canvas ref={canvasRef} width={CW} height={CH} style={{ width: '100%', height: 'auto', borderRadius: '8px', border: '1px solid #27272a' }} />
          <AstroTutorObserver message={aiMessage} type={aiType} />
        </div>
      }
      controls={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
             <div style={{ background: '#18181b', padding: '15px', borderRadius: '8px', borderTop: '3px solid #ef4444' }}>
                <SimSlider label="Sıcaklık (Kelvin)" min={50} max={800} step={10} value={temperature} onChange={setTemperature} />
             </div>
             <div style={{ background: '#18181b', padding: '15px', borderRadius: '8px', borderTop: '3px solid #10b981' }}>
                <SimSlider label="Hacim (Birim)" min={200} max={600} step={10} value={volume} onChange={setVolume} />
             </div>
           </div>
           
           <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem', alignItems: 'center' }}>
              <SimButton label={running ? 'Duraklat' : 'Başlat'} variant="primary" onClick={handleStart} />
              <SimTimeController disabled={false} timeScale={timeScale} setTimeScale={setTimeScale} onStepForward={handleStepForward} />
              <SimButton label="Sıfırla" variant="danger" onClick={handleReset} />
           </div>

           <div style={{ background: '#18181b', padding: '15px', borderRadius: '8px', border: '1px solid #27272a', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
             <div style={{ textAlign: 'center' }}>
               <span style={{ fontSize: '12px', color: '#a1a1aa' }}>Basınç (P)</span><br/>
               <span style={{ color: '#f59e0b', fontSize: '24px', fontWeight: 'bold' }}>{display.pressure.toFixed(1)} atm</span>
             </div>
             <div style={{ textAlign: 'center' }}>
               <span style={{ fontSize: '12px', color: '#a1a1aa' }}>Durum Denklemi</span><br/>
               <span style={{ color: '#6366f1', fontSize: '16px', fontWeight: 'bold', fontFamily: 'monospace' }}>P · V = n · R · T</span>
             </div>
           </div>
        </div>
      }
      charts={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
          <div style={{ display: 'flex', gap: '0.5rem', background: '#18181b', padding: '4px', borderRadius: '8px' }}>
            <button style={{ flex: 1, padding: '8px', background: '#27272a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Basınç vs Zaman</button>
          </div>
          <div style={{ flex: 1, minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
               <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="t" stroke="#a1a1aa" fontSize={12} tickFormatter={(val) => `${val}s`} />
                  <YAxis stroke="#a1a1aa" fontSize={12} domain={[0, 'auto']} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                  <Legend />
                  <Line type="monotone" dataKey="pressure" name="Basınç (atm)" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      }
    />
  );
}
