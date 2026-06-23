'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SimLayout, SimSlider, SimButton, AstroTutorObserver } from './ui';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

const CW = 800;
const CH = 380;
const HC = 1240; // eV*nm

const METALS = [
  { name: 'Sodyum (Na)', workFunction: 2.28, color: '#d1d5db' },
  { name: 'Potasyum (K)', workFunction: 2.30, color: '#9ca3af' },
  { name: 'Çinko (Zn)', workFunction: 4.30, color: '#6b7280' },
  { name: 'Bakır (Cu)', workFunction: 4.70, color: '#b45309' },
  { name: 'Platin (Pt)', workFunction: 6.35, color: '#e5e7eb' },
];

export default function FotoelektrikEtki() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  
  const [wavelength, setWavelength] = useState(400); // nm
  const [intensity, setIntensity] = useState(50); // %
  const [metalIndex, setMetalIndex] = useState(0);
  const [running, setRunning] = useState(true);

  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [aiType, setAiType] = useState<'info'|'warning'|'success'>('info');
  const [chartData, setChartData] = useState<{energy: number, ke: number}[]>([]);

  const metal = METALS[metalIndex];
  const photonEnergy = HC / wavelength;
  const isEmitting = photonEnergy > metal.workFunction;
  const maxKe = isEmitting ? photonEnergy - metal.workFunction : 0;

  const electronsRef = useRef<{x: number, y: number, vx: number, vy: number}[]>([]);
  const lastEmitRef = useRef<number>(0);

  useEffect(() => {
    if (!isEmitting) {
      setAiMessage(`Foton enerjisi (${photonEnergy.toFixed(2)} eV), ${metal.name} metalinin bağlanma (eşik) enerjisinden (${metal.workFunction} eV) küçük. Elektron koparılamıyor!`);
      setAiType('warning');
    } else {
      setAiMessage(`Fotonlar yüzeye çarpıp elektron koparıyor. Kalan enerji (${maxKe.toFixed(2)} eV) elektronlara kinetik enerji olarak aktarılıyor.`);
      setAiType('success');
    }

    // Chart data: KE vs Frequency (1/wavelength)
    // Actually standard graph is KE vs Frequency (f = c/lambda)
    // To make it simple, we can plot KE vs Photon Energy
    const data = [];
    for (let e = 1; e <= 8; e += 0.5) {
      const ke = e > metal.workFunction ? e - metal.workFunction : 0;
      data.push({ energy: e, ke: Number(ke.toFixed(2)) });
    }
    setChartData(data);
  }, [photonEnergy, metal, isEmitting, maxKe]);

  const getWavelengthColor = (wl: number) => {
    if (wl < 380) return '#9d4edd'; // UV
    if (wl >= 380 && wl < 450) return '#5c21d0';
    if (wl >= 450 && wl < 495) return '#0077b6';
    if (wl >= 495 && wl < 570) return '#2a9d8f';
    if (wl >= 570 && wl < 590) return '#e9c46a';
    if (wl >= 590 && wl < 620) return '#f4a261';
    if (wl >= 620 && wl < 750) return '#e76f51';
    return '#8b0000'; // IR
  };

  const drawSystem = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#050a1a';
    ctx.fillRect(0, 0, CW, CH);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < CW; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CH); ctx.stroke(); }
    for (let y = 0; y < CH; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CW, y); ctx.stroke(); }

    // Metal Plate
    ctx.fillStyle = metal.color;
    ctx.fillRect(100, 40, 40, 300);
    ctx.shadowBlur = 15;
    ctx.shadowColor = metal.color;
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.fillRect(105, 45, 10, 290);
    ctx.shadowBlur = 0;

    // Light Beam
    if (running) {
      const color = getWavelengthColor(wavelength);
      ctx.fillStyle = color;
      ctx.globalAlpha = (intensity / 100) * 0.5;
      ctx.beginPath();
      ctx.moveTo(400, -50); // Source
      ctx.lineTo(140, 40);
      ctx.lineTo(140, 340);
      ctx.lineTo(500, -50);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }

    // Electrons
    if (running && isEmitting) {
      const emitDelay = 1000 / (intensity * 0.8); 
      if (time - lastEmitRef.current > emitDelay) {
        lastEmitRef.current = time;
        const speed = Math.sqrt(maxKe) * 3;
        electronsRef.current.push({
          x: 140,
          y: 40 + Math.random() * 300,
          vx: speed + Math.random() * speed * 0.2, // Move right
          vy: (Math.random() - 0.5) * speed * 0.3,
        });
      }
    }

    ctx.fillStyle = '#60a5fa'; // blue-400
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#60a5fa';
    
    electronsRef.current.forEach(e => {
      if (running) {
        e.x += e.vx;
        e.y += e.vy;
      }
      ctx.beginPath();
      ctx.arc(e.x, e.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    // Filter off-screen
    if (running) {
      electronsRef.current = electronsRef.current.filter(e => e.x < CW + 10 && e.y > -10 && e.y < CH + 10);
    }

  }, [metal, wavelength, intensity, isEmitting, maxKe, running]);

  useEffect(() => {
    let animId: number;
    const renderLoop = (time: number) => {
      drawSystem(time);
      animId = requestAnimationFrame(renderLoop);
    };
    animId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animId);
  }, [drawSystem]);

  const handleReset = () => {
    electronsRef.current = [];
  };

  return (
    <SimLayout
      title="Fotoelektrik Etki"
      children={
        <div style={{ position: 'relative' }}>
          <canvas ref={canvasRef} width={CW} height={CH} style={{ width: '100%', height: 'auto', borderRadius: '8px', border: '1px solid #27272a' }} />
          <AstroTutorObserver message={aiMessage} type={aiType} />
        </div>
      }
      controls={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
           <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
              {METALS.map((m, idx) => (
                <SimButton key={m.name} label={m.name} variant={metalIndex === idx ? 'primary' : 'secondary'} onClick={() => {setMetalIndex(idx); handleReset();}} />
              ))}
           </div>
           
           <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
             <div style={{ background: '#18181b', padding: '15px', borderRadius: '8px', borderTop: `3px solid ${getWavelengthColor(wavelength)}` }}>
                <SimSlider label={`Dalgaboyu: ${wavelength} nm (Renk)`} min={200} max={800} step={10} value={wavelength} onChange={setWavelength} />
             </div>
             <div style={{ background: '#18181b', padding: '15px', borderRadius: '8px', borderTop: '3px solid #eab308' }}>
                <SimSlider label="Işık Şiddeti (%)" min={0} max={100} step={1} value={intensity} onChange={setIntensity} />
             </div>
           </div>

           <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginTop: '1rem', alignItems: 'center' }}>
              <SimButton label={running ? 'Işığı Kapat' : 'Işığı Aç'} variant="primary" onClick={() => setRunning(!running)} />
              <SimButton label="Temizle" variant="danger" onClick={handleReset} />
           </div>

           <div style={{ background: '#18181b', padding: '15px', borderRadius: '8px', border: '1px solid #27272a', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
             <div><span style={{ fontSize: '12px', color: '#a1a1aa' }}>Foton Enerjisi:</span> <br/>
                <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>{photonEnergy.toFixed(2)} eV</span>
             </div>
             <div><span style={{ fontSize: '12px', color: '#a1a1aa' }}>Bağlanma (Eşik) Enerjisi:</span> <br/>
                <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{metal.workFunction.toFixed(2)} eV</span>
             </div>
             <div style={{ gridColumn: 'span 2' }}><span style={{ fontSize: '12px', color: '#a1a1aa' }}>Maksimum Kinetik Enerji (Ek):</span> <br/>
                <span style={{ color: isEmitting ? '#10b981' : '#ef4444', fontWeight: 'bold', fontSize: '16px' }}>{maxKe.toFixed(2)} eV</span>
             </div>
           </div>
        </div>
      }
      charts={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
          <div style={{ display: 'flex', gap: '0.5rem', background: '#18181b', padding: '4px', borderRadius: '8px' }}>
            <button style={{ flex: 1, padding: '8px', background: '#27272a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Ek vs Foton Enerjisi</button>
          </div>
          <div style={{ flex: 1, minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
               <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="energy" stroke="#a1a1aa" fontSize={12} label={{ value: 'Foton Enerjisi (eV)', position: 'insideBottomRight', fill: '#a1a1aa' }} />
                  <YAxis stroke="#a1a1aa" fontSize={12} label={{ value: 'Kinetik Enerji (eV)', angle: -90, position: 'insideLeft', fill: '#a1a1aa' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                  <ReferenceLine x={metal.workFunction} stroke="#f59e0b" strokeDasharray="3 3" label={{ position: 'top', value: 'Eşik (Φ)', fill: '#f59e0b' }} />
                  <ReferenceLine x={photonEnergy} stroke="#38bdf8" label={{ position: 'top', value: 'Şu An', fill: '#38bdf8' }} />
                  <Line type="monotone" dataKey="ke" name="Kinetik Enerji" stroke="#10b981" strokeWidth={3} dot={false} isAnimationActive={false} />
                </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      }
    />
  );
}
