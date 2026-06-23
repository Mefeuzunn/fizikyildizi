'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SimLayout, SimSlider, SimButton, AstroTutorObserver } from './ui';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

const CW = 800;
const CH = 380;
const MID_Y = CH / 2;
const MID_X = CW / 2;
const SCALE = 4; // Pixels per cm

export default function OptikMercek() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [f, setF] = useState(20);
  const [doDist, setDoDist] = useState(40);
  const [ho, setHo] = useState(20);
  const [lensType, setLensType] = useState<'convex' | 'concave'>('convex');
  
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [aiType, setAiType] = useState<'info'|'warning'|'success'>('info');

  const [chartData, setChartData] = useState<{doDist: number, magnification: number}[]>([]);

  // Physics Math
  let di = 0;
  let isInfinity = false;
  let isVirtual = false;

  if (lensType === 'convex') {
    if (Math.abs(doDist - f) < 0.1) {
      isInfinity = true;
    } else {
      di = 1 / (1 / f - 1 / doDist);
      isVirtual = di < 0;
    }
  } else {
    // Concave lens has negative focal length
    di = 1 / (-1 / f - 1 / doDist);
    isVirtual = true;
  }

  const magnification = isInfinity ? 0 : -di / doDist;
  const hi = ho * magnification;

  useEffect(() => {
    // Generate chart data for the current focal length
    const data = [];
    for (let d = 5; d <= 80; d += 2) {
      if (Math.abs(d - f) < 0.5 && lensType === 'convex') {
        data.push({ doDist: d, magnification: 0 }); // infinity
        continue;
      }
      let tempDi = 0;
      if (lensType === 'convex') tempDi = 1 / (1 / f - 1 / d);
      else tempDi = 1 / (-1 / f - 1 / d);
      
      let mag = -tempDi / d;
      // cap mag for chart readability
      if (mag > 10) mag = 10;
      if (mag < -10) mag = -10;
      data.push({ doDist: d, magnification: Number(mag.toFixed(2)) });
    }
    setChartData(data);
  }, [f, lensType]);

  useEffect(() => {
    if (isInfinity) {
      setAiMessage('Cisim tam odak noktasında (F). Kırılan ışınlar paralel gider, görüntü sonsuzda oluşur!');
      setAiType('warning');
    } else if (lensType === 'convex') {
      if (doDist < f) {
        setAiMessage('Cisim odak noktası ile mercek arasında. Görüntü sanal (zahiri), düz ve cisimden büyük (Büyüteç etkisi).');
        setAiType('info');
      } else if (Math.abs(doDist - 2 * f) < 0.5) {
        setAiMessage('Cisim 2F noktasında. Görüntü de diğer taraftaki 2F noktasında, ters ve cisimle aynı boyda.');
        setAiType('success');
      } else if (doDist > 2 * f) {
        setAiMessage('Cisim 2F\'nin ötesinde. Görüntü F ile 2F arasında, ters ve cisimden küçük.');
        setAiType('info');
      } else {
        setAiMessage('Cisim F ile 2F arasında. Görüntü 2F\'nin ötesinde, ters ve cisimden büyük.');
        setAiType('info');
      }
    } else {
      setAiMessage('Kalın kenarlı (ıraksak) mercekte görüntü her zaman sanal, düz ve cisimden küçüktür.');
      setAiType('info');
    }
  }, [doDist, f, lensType, isInfinity]);

  const drawSystem = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    // Clear
    ctx.fillStyle = '#050a1a';
    ctx.fillRect(0, 0, CW, CH);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < CW; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CH); ctx.stroke(); }
    for (let y = 0; y < CH; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CW, y); ctx.stroke(); }

    const scaleF = f * SCALE;
    const scaleDo = doDist * SCALE;
    const scaleHo = ho * SCALE;

    // 1. Draw Optical Axis
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, MID_Y);
    ctx.lineTo(CW, MID_Y);
    ctx.stroke();

    // 2. Draw Lens
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(MID_X, 40);
    ctx.lineTo(MID_X, CH - 40);
    ctx.stroke();

    ctx.fillStyle = '#06b6d4';
    if (lensType === 'convex') {
      ctx.beginPath(); ctx.moveTo(MID_X - 8, 48); ctx.lineTo(MID_X, 40); ctx.lineTo(MID_X + 8, 48); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(MID_X - 8, CH - 48); ctx.lineTo(MID_X, CH - 40); ctx.lineTo(MID_X + 8, CH - 48); ctx.stroke();
    } else {
      ctx.beginPath(); ctx.moveTo(MID_X - 8, 40); ctx.lineTo(MID_X, 48); ctx.lineTo(MID_X + 8, 40); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(MID_X - 8, CH - 40); ctx.lineTo(MID_X, CH - 48); ctx.lineTo(MID_X + 8, CH - 40); ctx.stroke();
    }

    // 3. Focal points
    const drawFocusPoint = (x: number, label: string) => {
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath(); ctx.arc(x, MID_Y, 4, 0, Math.PI * 2); ctx.fill();
      ctx.font = '10px monospace'; ctx.fillText(label, x - 6, MID_Y + 18);
    };

    drawFocusPoint(MID_X - scaleF, 'F1');
    drawFocusPoint(MID_X - 2 * scaleF, '2F1');
    drawFocusPoint(MID_X + scaleF, 'F2');
    drawFocusPoint(MID_X + 2 * scaleF, '2F2');

    // 4. Draw Object
    const objX = MID_X - scaleDo;
    const objY = MID_Y - scaleHo;

    ctx.strokeStyle = '#a78bfa';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(objX, MID_Y); ctx.lineTo(objX, objY); ctx.stroke();
    ctx.fillStyle = '#a78bfa';
    ctx.beginPath(); ctx.moveTo(objX - 6, objY + 8); ctx.lineTo(objX, objY); ctx.lineTo(objX + 6, objY + 8); ctx.fill();
    ctx.font = '11px monospace'; ctx.fillText('Nesne', objX - 18, objY - 10);

    const scaleDi = di * SCALE;
    const imgX = MID_X + scaleDi;
    const scaleHi = hi * SCALE;
    const imgY = MID_Y - scaleHi;

    // 5. Draw Rays
    ctx.lineWidth = 1.5;
    
    // Parallel Ray
    ctx.strokeStyle = 'rgba(250,204,21,0.6)';
    ctx.beginPath(); ctx.moveTo(objX, objY); ctx.lineTo(MID_X, objY); ctx.stroke();
    
    if (lensType === 'convex') {
      if (!isInfinity) {
        ctx.beginPath(); ctx.moveTo(MID_X, objY); ctx.lineTo(imgX, imgY); ctx.stroke();
        // Extrapolate Ray 1 past image
        const dx1 = imgX - MID_X;
        const dy1 = imgY - objY;
        ctx.beginPath(); ctx.moveTo(imgX, imgY); ctx.lineTo(imgX + dx1*2, imgY + dy1*2); ctx.stroke();
      } else {
        ctx.beginPath(); ctx.moveTo(MID_X, objY); ctx.lineTo(MID_X + scaleF, MID_Y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(MID_X + scaleF, MID_Y); ctx.lineTo(MID_X + scaleF*3, MID_Y + objY); ctx.stroke();
      }
      
      // Central Ray
      ctx.strokeStyle = 'rgba(239,68,68,0.6)';
      ctx.beginPath(); ctx.moveTo(objX, objY); ctx.lineTo(MID_X, MID_Y); ctx.stroke();
      if (!isInfinity) {
        ctx.beginPath(); ctx.moveTo(MID_X, MID_Y); ctx.lineTo(imgX, imgY); ctx.stroke();
        const dx2 = imgX - MID_X;
        const dy2 = imgY - MID_Y;
        ctx.beginPath(); ctx.moveTo(imgX, imgY); ctx.lineTo(imgX + dx2*2, imgY + dy2*2); ctx.stroke();
      } else {
        const dx = MID_X - objX;
        const dy = MID_Y - objY;
        ctx.beginPath(); ctx.moveTo(MID_X, MID_Y); ctx.lineTo(MID_X + dx*2, MID_Y + dy*2); ctx.stroke();
      }
      
      // Virtual extensions
      if (isVirtual && !isInfinity) {
         ctx.setLineDash([4, 4]);
         ctx.strokeStyle = 'rgba(250,204,21,0.4)';
         ctx.beginPath(); ctx.moveTo(MID_X, objY); ctx.lineTo(imgX, imgY); ctx.stroke();
         ctx.strokeStyle = 'rgba(239,68,68,0.4)';
         ctx.beginPath(); ctx.moveTo(MID_X, MID_Y); ctx.lineTo(imgX, imgY); ctx.stroke();
         ctx.setLineDash([]);
      }
    } else {
      // Concave Lens Rays
      // Parallel ray diverges from F1
      ctx.beginPath(); ctx.moveTo(MID_X, objY); ctx.lineTo(MID_X + scaleDo*2, objY - (objY - MID_Y)*(scaleDo*2)/scaleF); ctx.stroke();
      
      // Central Ray
      ctx.strokeStyle = 'rgba(239,68,68,0.6)';
      ctx.beginPath(); ctx.moveTo(objX, objY); ctx.lineTo(MID_X + scaleDo, MID_Y + (MID_Y - objY)); ctx.stroke();
      
      // Virtual extensions
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = 'rgba(250,204,21,0.4)';
      ctx.beginPath(); ctx.moveTo(MID_X, objY); ctx.lineTo(imgX, imgY); ctx.stroke();
      ctx.strokeStyle = 'rgba(239,68,68,0.4)';
      ctx.beginPath(); ctx.moveTo(MID_X, MID_Y); ctx.lineTo(imgX, imgY); ctx.stroke();
      ctx.setLineDash([]);
    }

    // 6. Draw Image
    if (!isInfinity) {
      ctx.save();
      ctx.strokeStyle = isVirtual ? '#f43f5e' : '#10b981';
      ctx.lineWidth = 3.5;
      if (isVirtual) ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(imgX, MID_Y); ctx.lineTo(imgX, imgY); ctx.stroke();

      ctx.fillStyle = isVirtual ? '#f43f5e' : '#10b981';
      ctx.beginPath();
      const headDir = imgY < MID_Y ? 1 : -1;
      ctx.moveTo(imgX - 6, imgY + 8 * headDir);
      ctx.lineTo(imgX, imgY);
      ctx.lineTo(imgX + 6, imgY + 8 * headDir);
      ctx.fill();

      ctx.font = '11px monospace';
      ctx.fillText('Görüntü', imgX - 22, imgY + (headDir > 0 ? -10 : 20));
      ctx.restore();
    }
  }, [f, doDist, ho, lensType, isInfinity, isVirtual, di, hi]);

  useEffect(() => {
    drawSystem();
  }, [drawSystem]);

  return (
    <SimLayout
      title="Optik Mercekler (İnce ve Kalın Kenarlı)"
      children={
        <div style={{ position: 'relative' }}>
          <canvas ref={canvasRef} width={CW} height={CH} style={{ width: '100%', height: 'auto', borderRadius: '8px', border: '1px solid #27272a' }} />
          <AstroTutorObserver message={aiMessage} type={aiType} />
        </div>
      }
      controls={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
           <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <SimButton label="İnce Kenarlı (Yakınsak)" variant={lensType === 'convex' ? 'primary' : 'secondary'} onClick={() => setLensType('convex')} />
              <SimButton label="Kalın Kenarlı (Iraksak)" variant={lensType === 'concave' ? 'primary' : 'secondary'} onClick={() => setLensType('concave')} />
           </div>
           
           <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
             <div style={{ background: '#18181b', padding: '15px', borderRadius: '8px', borderTop: '3px solid #06b6d4' }}>
                <SimSlider label="Odak Uzaklığı (f)" min={10} max={60} step={1} value={f} onChange={setF} />
                <SimSlider label="Cisim Uzaklığı (do)" min={5} max={80} step={1} value={doDist} onChange={setDoDist} />
                <SimSlider label="Cisim Boyu (ho)" min={5} max={40} step={1} value={ho} onChange={setHo} />
             </div>
           </div>

           <div style={{ background: '#18181b', padding: '15px', borderRadius: '8px', border: '1px solid #27272a', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
             <div><span style={{ fontSize: '12px', color: '#a1a1aa' }}>Görüntü Uzaklığı (di):</span> <br/>
                <span style={{ color: isInfinity ? '#f59e0b' : (isVirtual ? '#f43f5e' : '#10b981'), fontWeight: 'bold' }}>
                  {isInfinity ? 'Sonsuz' : `${di.toFixed(1)} cm`}
                </span>
             </div>
             <div><span style={{ fontSize: '12px', color: '#a1a1aa' }}>Büyütme (m):</span> <br/>
                <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>
                  {isInfinity ? '-' : `${magnification.toFixed(2)}x`}
                </span>
             </div>
             <div><span style={{ fontSize: '12px', color: '#a1a1aa' }}>Görüntü Boyu (hi):</span> <br/>
                <span style={{ color: '#8b5cf6', fontWeight: 'bold' }}>
                  {isInfinity ? '-' : `${hi.toFixed(1)} cm`}
                </span>
             </div>
             <div><span style={{ fontSize: '12px', color: '#a1a1aa' }}>Görüntü Türü:</span> <br/>
                <span style={{ color: '#f8fafc', fontWeight: 'bold' }}>
                  {isInfinity ? 'Yok' : (isVirtual ? 'Sanal (Zahiri)' : 'Gerçek')}
                </span>
             </div>
           </div>
        </div>
      }
      charts={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
          <div style={{ display: 'flex', gap: '0.5rem', background: '#18181b', padding: '4px', borderRadius: '8px' }}>
            <button style={{ flex: 1, padding: '8px', background: '#27272a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Büyütme vs Cisim Uzaklığı</button>
          </div>
          <div style={{ flex: 1, minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
               <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="doDist" stroke="#a1a1aa" fontSize={12} label={{ value: 'do (cm)', position: 'insideBottomRight', fill: '#a1a1aa' }} />
                  <YAxis stroke="#a1a1aa" fontSize={12} label={{ value: 'Büyütme', angle: -90, position: 'insideLeft', fill: '#a1a1aa' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                  <ReferenceLine y={0} stroke="#4b5563" />
                  <ReferenceLine x={f} stroke="#f59e0b" strokeDasharray="3 3" label={{ position: 'top', value: 'F', fill: '#f59e0b' }} />
                  {lensType === 'convex' && <ReferenceLine x={2*f} stroke="#f59e0b" strokeDasharray="3 3" label={{ position: 'top', value: '2F', fill: '#f59e0b' }} />}
                  <Line type="monotone" dataKey="magnification" name="Büyütme (m)" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      }
    />
  );
}
