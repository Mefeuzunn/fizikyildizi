'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SimLayout, SimSlider, SimButton, AstroTutorObserver } from './ui';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

const CW = 800;
const CH = 380;

type CircuitType = 'Seri' | 'Paralel' | 'Karma';

export default function ElektrikDevresi() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  
  const [circuitType, setCircuitType] = useState<CircuitType>('Seri');
  const [voltage, setVoltage] = useState(12);
  const [r1, setR1] = useState(10);
  const [r2, setR2] = useState(10);
  const [r3, setR3] = useState(10);
  
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [aiType, setAiType] = useState<'info'|'warning'|'success'>('info');

  const [chartData, setChartData] = useState<{v: number, i: number}[]>([]);

  // Physics Calc
  let rTotal = 0;
  let iTotal = 0;
  let i1 = 0, i2 = 0, i3 = 0;
  let v1 = 0, v2 = 0, v3 = 0;

  if (circuitType === 'Seri') {
    rTotal = r1 + r2 + r3;
    iTotal = voltage / rTotal;
    i1 = i2 = i3 = iTotal;
    v1 = i1 * r1; v2 = i2 * r2; v3 = i3 * r3;
  } else if (circuitType === 'Paralel') {
    rTotal = 1 / (1/r1 + 1/r2 + 1/r3);
    v1 = v2 = v3 = voltage;
    i1 = v1 / r1; i2 = v2 / r2; i3 = v3 / r3;
    iTotal = i1 + i2 + i3;
  } else if (circuitType === 'Karma') {
    // R2 and R3 in parallel, in series with R1
    const r23 = 1 / (1/r2 + 1/r3);
    rTotal = r1 + r23;
    iTotal = voltage / rTotal;
    i1 = iTotal;
    v1 = i1 * r1;
    const v23 = voltage - v1;
    v2 = v3 = v23;
    i2 = v2 / r2;
    i3 = v3 / r3;
  }

  const isShortCircuit = rTotal < 0.1;

  useEffect(() => {
    // Generate I-V curve for current R_total
    const data = [];
    for (let v = 0; v <= 30; v += 2) {
      data.push({ v, i: Number((v / rTotal).toFixed(2)) });
    }
    setChartData(data);
  }, [rTotal]);

  useEffect(() => {
    if (isShortCircuit) {
      setAiMessage('Kısa Devre Tehlikesi! Direnç çok düşük, akım çok yüksek. Pil zarar görebilir!');
      setAiType('warning');
    } else if (circuitType === 'Seri') {
      setAiMessage('Seri devrede akım her dirençten aynı geçer, ancak potansiyel farklar dirençlerle orantılı olarak paylaşılır.');
      setAiType('info');
    } else if (circuitType === 'Paralel') {
      setAiMessage('Paralel devrede her dirence pilin tam gerilimi uygulanır, akımlar ise direncin büyüklüğüne göre kollara ayrılır.');
      setAiType('info');
    } else if (circuitType === 'Karma') {
      setAiMessage('Karma devrede R1 seri olduğu için ana akımı taşır. R2 ve R3 ise bu akımı aralarında paralel paylaşır.');
      setAiType('info');
    }
  }, [circuitType, isShortCircuit]);

  const offsetRef = useRef(0);

  const drawResistor = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, label: string, horizontal = true) => {
    ctx.save();
    const rW = 36, rH = 16;
    const rx = x + (w - rW) / 2;
    const ry = y - rH / 2;

    if (horizontal) {
      ctx.strokeStyle = '#52525b';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(rx, y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(rx + rW, y); ctx.lineTo(x + w, y); ctx.stroke();
      
      // Zigzag
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i <= 6; i++) {
        const xi = rx + (i / 6) * rW;
        const yi = y + (i % 2 === 0 ? -6 : 6);
        i === 0 ? ctx.moveTo(xi, yi) : ctx.lineTo(xi, yi);
      }
      ctx.stroke();

      ctx.fillStyle = '#f4f4f5';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(label, rx + rW / 2, ry - 8);
    } else {
      ctx.strokeStyle = '#52525b';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, ry); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, ry + rH); ctx.lineTo(x, y + w); ctx.stroke();
      
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i <= 6; i++) {
        const yi = ry + (i / 6) * rH;
        const xi = x + (i % 2 === 0 ? -6 : 6);
        i === 0 ? ctx.moveTo(xi, yi) : ctx.lineTo(xi, yi);
      }
      ctx.stroke();

      ctx.fillStyle = '#f4f4f5';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(label, x + 12, ry + rH / 2 + 4);
    }
    ctx.restore();
  };

  const drawSystem = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#050a1a';
    ctx.fillRect(0, 0, CW, CH);

    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < CW; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CH); ctx.stroke(); }
    for (let y = 0; y < CH; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CW, y); ctx.stroke(); }

    const electronSpeed = isShortCircuit ? 10 : Math.min(iTotal * 2, 8);
    offsetRef.current = (offsetRef.current + electronSpeed) % 2000;

    const drawElectronsOnLine = (x1: number, y1: number, x2: number, y2: number, speed: number) => {
      const len = Math.hypot(x2 - x1, y2 - y1);
      if (len === 0) return;
      const spacing = 40;
      const num = Math.floor(len / spacing) + 1;
      
      // Local offset for this segment based on global offset but scaled
      // We just use global offset and modulo
      const segmentOffset = (offsetRef.current * (speed / electronSpeed)) % spacing;

      ctx.fillStyle = '#38bdf8';
      ctx.shadowBlur = 5;
      ctx.shadowColor = '#38bdf8';
      for (let i = 0; i < num; i++) {
        const d = (i * spacing + segmentOffset) % len;
        const ex = x1 + (x2 - x1) * (d / len);
        const ey = y1 + (y2 - y1) * (d / len);
        ctx.beginPath(); ctx.arc(ex, ey, 3, 0, Math.PI * 2); ctx.fill();
      }
      ctx.shadowBlur = 0;
    };

    const wireParams = { strokeStyle: '#52525b', lineWidth: 4, lineCap: 'round', lineJoin: 'round' } as const;
    Object.assign(ctx, wireParams);

    const L = 150, R = 650;
    const T = 80, M = 180, B = 280;

    // Battery at left
    ctx.beginPath(); ctx.moveTo(L, T); ctx.lineTo(L, M - 20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(L, M + 20); ctx.lineTo(L, B); ctx.stroke();
    
    // Draw Battery symbol
    ctx.strokeStyle = '#10b981'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(L - 15, M - 20); ctx.lineTo(L + 15, M - 20); ctx.stroke();
    ctx.strokeStyle = '#f43f5e'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(L - 8, M + 20); ctx.lineTo(L + 8, M + 20); ctx.stroke();
    ctx.fillStyle = '#10b981'; ctx.font = '12px monospace'; ctx.fillText('+', L - 25, M - 15);
    ctx.fillStyle = '#f43f5e'; ctx.fillText('-', L - 25, M + 25);
    ctx.fillStyle = '#f8fafc'; ctx.fillText(`${voltage}V`, L - 35, M + 5);
    Object.assign(ctx, wireParams);

    if (circuitType === 'Seri') {
      ctx.beginPath(); ctx.moveTo(L, T); ctx.lineTo(R, T); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(L, B); ctx.lineTo(R, B); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(R, T); ctx.lineTo(R, T + 40); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(R, B); ctx.lineTo(R, B - 40); ctx.stroke();

      drawResistor(ctx, R, T + 40, 60, `R1=${r1}Ω`, false);
      drawResistor(ctx, R, T + 100, 60, `R2=${r2}Ω`, false);
      drawResistor(ctx, R, T + 160, 60, `R3=${r3}Ω`, false);
      
      // Wire connections between resistors
      ctx.beginPath(); ctx.moveTo(R, T + 100); ctx.lineTo(R, T + 100); ctx.stroke(); // implicit
      
      drawElectronsOnLine(L, M-20, L, T, iTotal);
      drawElectronsOnLine(L, T, R, T, iTotal);
      drawElectronsOnLine(R, T, R, B, iTotal); // Through resistors
      drawElectronsOnLine(R, B, L, B, iTotal);
      drawElectronsOnLine(L, B, L, M+20, iTotal);

    } else if (circuitType === 'Paralel') {
      ctx.beginPath(); ctx.moveTo(L, T); ctx.lineTo(R, T); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(L, B); ctx.lineTo(R, B); ctx.stroke();
      
      const p1 = 300, p2 = 450, p3 = 600;
      
      [p1, p2, p3].forEach((px, idx) => {
        ctx.beginPath(); ctx.moveTo(px, T); ctx.lineTo(px, T + 60); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(px, B - 60); ctx.lineTo(px, B); ctx.stroke();
      });

      drawResistor(ctx, p1, T + 60, 80, `R1=${r1}Ω`, false);
      drawResistor(ctx, p2, T + 60, 80, `R2=${r2}Ω`, false);
      drawResistor(ctx, p3, T + 60, 80, `R3=${r3}Ω`, false);

      // Main lines
      drawElectronsOnLine(L, M-20, L, T, iTotal);
      drawElectronsOnLine(L, T, p1, T, iTotal);
      drawElectronsOnLine(p1, T, p2, T, iTotal - i1);
      drawElectronsOnLine(p2, T, p3, T, i3);
      
      // Branches
      drawElectronsOnLine(p1, T, p1, B, i1);
      drawElectronsOnLine(p2, T, p2, B, i2);
      drawElectronsOnLine(p3, T, p3, B, i3);

      drawElectronsOnLine(p3, B, p2, B, i3);
      drawElectronsOnLine(p2, B, p1, B, i2 + i3);
      drawElectronsOnLine(p1, B, L, B, iTotal);
      drawElectronsOnLine(L, B, L, M+20, iTotal);

    } else if (circuitType === 'Karma') {
      ctx.beginPath(); ctx.moveTo(L, T); ctx.lineTo(300, T); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(L, B); ctx.lineTo(600, B); ctx.stroke();
      
      drawResistor(ctx, 300, T, 150, `R1=${r1}Ω`, true);
      
      ctx.beginPath(); ctx.moveTo(450, T); ctx.lineTo(500, T); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(500, T); ctx.lineTo(500, T + 40); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(500, T); ctx.lineTo(600, T); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(600, T); ctx.lineTo(600, T + 40); ctx.stroke();

      drawResistor(ctx, 500, T + 40, 120, `R2=${r2}Ω`, false);
      drawResistor(ctx, 600, T + 40, 120, `R3=${r3}Ω`, false);

      ctx.beginPath(); ctx.moveTo(500, B - 40); ctx.lineTo(500, B); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(600, B - 40); ctx.lineTo(600, B); ctx.stroke();
      
      // electrons
      drawElectronsOnLine(L, M-20, L, T, iTotal);
      drawElectronsOnLine(L, T, 500, T, iTotal); // through R1
      drawElectronsOnLine(500, T, 600, T, i3);
      drawElectronsOnLine(500, T, 500, B, i2);
      drawElectronsOnLine(600, T, 600, B, i3);
      drawElectronsOnLine(600, B, 500, B, i3);
      drawElectronsOnLine(500, B, L, B, iTotal);
      drawElectronsOnLine(L, B, L, M+20, iTotal);
    }
  }, [circuitType, voltage, r1, r2, r3, iTotal, i1, i2, i3, isShortCircuit]);

  useEffect(() => {
    let animId: number;
    const renderLoop = () => {
      drawSystem();
      animId = requestAnimationFrame(renderLoop);
    };
    renderLoop();
    return () => cancelAnimationFrame(animId);
  }, [drawSystem]);

  return (
    <SimLayout
      title="Elektrik Devreleri ve Ohm Kanunu"
      children={
        <div style={{ position: 'relative' }}>
          <canvas ref={canvasRef} width={CW} height={CH} style={{ width: '100%', height: 'auto', borderRadius: '8px', border: '1px solid #27272a' }} />
          <AstroTutorObserver message={aiMessage} type={aiType} />
        </div>
      }
      controls={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
           <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
              {(['Seri', 'Paralel', 'Karma'] as CircuitType[]).map(t => (
                <SimButton key={t} label={`${t} Devre`} variant={circuitType === t ? 'primary' : 'secondary'} onClick={() => setCircuitType(t)} />
              ))}
           </div>
           
           <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
             <div style={{ background: '#18181b', padding: '15px', borderRadius: '8px', borderTop: '3px solid #10b981' }}>
                <SimSlider label="Pil Gerilimi (V)" min={0} max={30} step={1} value={voltage} onChange={setVoltage} />
                <SimSlider label="R1 Direnci (Ω)" min={1} max={50} step={1} value={r1} onChange={setR1} />
                <SimSlider label="R2 Direnci (Ω)" min={1} max={50} step={1} value={r2} onChange={setR2} />
                <SimSlider label="R3 Direnci (Ω)" min={1} max={50} step={1} value={r3} onChange={setR3} />
             </div>
           </div>

           <div style={{ background: '#18181b', padding: '15px', borderRadius: '8px', border: '1px solid #27272a', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
             <div><span style={{ fontSize: '12px', color: '#a1a1aa' }}>Eşdeğer Direnç (Req):</span> <br/>
                <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{rTotal.toFixed(2)} Ω</span>
             </div>
             <div><span style={{ fontSize: '12px', color: '#a1a1aa' }}>Ana Kol Akımı (I):</span> <br/>
                <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>{iTotal.toFixed(2)} A</span>
             </div>
             <div><span style={{ fontSize: '12px', color: '#a1a1aa' }}>R1 Akımı / Gerilimi:</span> <br/>
                <span style={{ color: '#f8fafc', fontWeight: 'bold' }}>{i1.toFixed(2)} A / {v1.toFixed(2)} V</span>
             </div>
             <div><span style={{ fontSize: '12px', color: '#a1a1aa' }}>Toplam Güç (P):</span> <br/>
                <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{(voltage * iTotal).toFixed(2)} W</span>
             </div>
           </div>
        </div>
      }
      charts={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
          <div style={{ display: 'flex', gap: '0.5rem', background: '#18181b', padding: '4px', borderRadius: '8px' }}>
            <button style={{ flex: 1, padding: '8px', background: '#27272a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Devre: Akım vs Gerilim (I-V)</button>
          </div>
          <div style={{ flex: 1, minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
               <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="v" stroke="#a1a1aa" fontSize={12} label={{ value: 'Gerilim (V)', position: 'insideBottomRight', fill: '#a1a1aa' }} />
                  <YAxis stroke="#a1a1aa" fontSize={12} label={{ value: 'Akım (A)', angle: -90, position: 'insideLeft', fill: '#a1a1aa' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                  <ReferenceLine x={voltage} stroke="#f43f5e" strokeDasharray="3 3" label={{ position: 'top', value: 'Şu anki V', fill: '#f43f5e' }} />
                  <Line type="monotone" dataKey="i" name="Akım (A)" stroke="#38bdf8" strokeWidth={3} dot={false} isAnimationActive={false} />
                </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      }
    />
  );
}
