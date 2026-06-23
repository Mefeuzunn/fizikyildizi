'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SimLayout, SimSlider, SimButton, AstroTutorObserver } from './ui';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

const CW = 800;
const CH = 380;

export default function OhmKanunu() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  
  const [voltage, setVoltage] = useState(12);
  const [resistance, setResistance] = useState(10);
  const [running, setRunning] = useState(true);

  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [aiType, setAiType] = useState<'info'|'warning'|'success'>('info');
  const [chartData, setChartData] = useState<{v: number, i: number}[]>([]);

  const current = voltage / resistance;
  
  useEffect(() => {
    // Check states for AI
    if (voltage === 0) {
      setAiMessage('Gerilim (Voltaj) 0 olduğu için devreden akım geçemiyor. Elektronları itecek kuvvet yok.');
      setAiType('warning');
    } else if (resistance < 2) {
      setAiMessage('Dikkat! Direnç çok düşük, akım çok yüksek. Gerçek bir devrede bu kısa devreye ve ısınmaya neden olabilir.');
      setAiType('warning');
    } else {
      setAiMessage('Ohm Kanunu (V = I · R): Gerilim arttıkça akım artar, direnç arttıkça akım azalır. Grafikteki doğrunun eğimi (1/R) direncin tersini verir.');
      setAiType('info');
    }

    // Chart data (V vs I)
    const data = [];
    for (let v = 0; v <= 30; v += 2) {
      data.push({ v, i: Number((v / resistance).toFixed(2)) });
    }
    setChartData(data);
  }, [voltage, resistance]);

  const offsetRef = useRef(0);

  const getPathCoord = (d: number): [number, number] => {
    d = ((d % 1200) + 1200) % 1200;
    if (d < 400) return [200 + d, 100];
    if (d < 600) return [600, 100 + (d - 400)];
    if (d < 1000) return [600 - (d - 600), 300];
    return [200, 300 - (d - 1000)];
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

    ctx.strokeStyle = '#52525b';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Top
    ctx.beginPath(); ctx.moveTo(200, 100); ctx.lineTo(600, 100); ctx.stroke();
    // Bottom
    ctx.beginPath(); ctx.moveTo(200, 300); ctx.lineTo(600, 300); ctx.stroke();
    // Left (Battery)
    ctx.beginPath(); ctx.moveTo(200, 100); ctx.lineTo(200, 190); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(200, 210); ctx.lineTo(200, 300); ctx.stroke();
    // Right (Resistor)
    ctx.beginPath(); ctx.moveTo(600, 100); ctx.lineTo(600, 160); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(600, 240); ctx.lineTo(600, 300); ctx.stroke();

    // Battery Symbol
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(175, 190); ctx.lineTo(225, 190); ctx.stroke();
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(185, 210); ctx.lineTo(215, 210); ctx.stroke();
    
    ctx.fillStyle = '#f4f4f5';
    ctx.font = '14px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`${voltage.toFixed(1)} V`, 165, 205);
    ctx.fillStyle = '#10b981'; ctx.fillText('+', 195, 180);
    ctx.fillStyle = '#f43f5e'; ctx.fillText('-', 195, 230);

    // Resistor Symbol
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(600, 160);
    ctx.lineTo(615, 170); ctx.lineTo(585, 183); ctx.lineTo(615, 196);
    ctx.lineTo(585, 210); ctx.lineTo(615, 223); ctx.lineTo(600, 240);
    ctx.stroke();

    ctx.fillStyle = '#f4f4f5';
    ctx.textAlign = 'left';
    ctx.fillText(`${resistance.toFixed(1)} Ω`, 635, 205);

    // Ammeter
    ctx.fillStyle = '#18181b';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(400, 100, 25, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = 'bold 20px Inter, sans-serif'; ctx.fillText('A', 400, 100);
    ctx.font = '12px monospace'; ctx.fillText(`${current.toFixed(2)} A`, 400, 60);

    // Electrons
    if (running) {
      offsetRef.current += current * 2;
    }
    const numCarriers = 15;
    const spacing = 1200 / numCarriers;
    
    ctx.fillStyle = '#38bdf8';
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#38bdf8';
    for (let j = 0; j < numCarriers; j++) {
      const d = offsetRef.current + j * spacing;
      const [cx, cy] = getPathCoord(d);
      
      const isInsideBattery = cx === 200 && cy > 185 && cy < 215;
      const isInsideResistor = cx === 600 && cy > 155 && cy < 245;
      const isInsideAmmeter = cy === 100 && cx > 375 && cx < 425;

      if (!isInsideBattery && !isInsideResistor && !isInsideAmmeter) {
        ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.shadowBlur = 0;
  }, [voltage, resistance, current, running]);

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
      title="Ohm Kanunu (V = I · R)"
      children={
        <div style={{ position: 'relative' }}>
          <canvas ref={canvasRef} width={CW} height={CH} style={{ width: '100%', height: 'auto', borderRadius: '8px', border: '1px solid #27272a' }} />
          <AstroTutorObserver message={aiMessage} type={aiType} />
        </div>
      }
      controls={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
             <div style={{ background: '#18181b', padding: '15px', borderRadius: '8px', borderTop: '3px solid #10b981' }}>
                <SimSlider label="Gerilim (V)" min={0} max={30} step={1} value={voltage} onChange={setVoltage} />
             </div>
             <div style={{ background: '#18181b', padding: '15px', borderRadius: '8px', borderTop: '3px solid #f59e0b' }}>
                <SimSlider label="Direnç (R) [Ω]" min={1} max={50} step={1} value={resistance} onChange={setResistance} />
             </div>
           </div>

           <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginTop: '1rem', alignItems: 'center' }}>
              <SimButton label={running ? 'Duraklat' : 'Başlat'} variant="primary" onClick={() => setRunning(!running)} />
           </div>

           <div style={{ background: '#18181b', padding: '15px', borderRadius: '8px', border: '1px solid #27272a', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
             <div style={{ textAlign: 'center' }}>
               <span style={{ fontSize: '12px', color: '#a1a1aa' }}>Devre Akımı (I)</span><br/>
               <span style={{ color: '#38bdf8', fontSize: '24px', fontWeight: 'bold' }}>{current.toFixed(2)} A</span>
             </div>
             <div style={{ textAlign: 'center' }}>
               <span style={{ fontSize: '12px', color: '#a1a1aa' }}>Ohm Kanunu</span><br/>
               <span style={{ color: '#6366f1', fontSize: '16px', fontWeight: 'bold', fontFamily: 'monospace' }}>I = V / R</span>
             </div>
           </div>
        </div>
      }
      charts={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
          <div style={{ display: 'flex', gap: '0.5rem', background: '#18181b', padding: '4px', borderRadius: '8px' }}>
            <button style={{ flex: 1, padding: '8px', background: '#27272a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Akım vs Gerilim Grafiği</button>
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
