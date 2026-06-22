'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

const CW = 640;
const CH = 380;
const MID_Y = CH / 2;
const MID_X = CW / 2;

// Pixels per cm
const SCALE = 4;

interface OpticalParams {
  f: number;
  doDist: number;
  ho: number;
  lensType: 'convex' | 'concave';
}

function drawOpticsDiagram(ctx: CanvasRenderingContext2D, p: OpticalParams) {
  const { f, doDist, ho, lensType } = p;
  
  // Clear and draw background
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

  // 2. Draw Lens in Center
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(MID_X, 40);
  ctx.lineTo(MID_X, CH - 40);
  ctx.stroke();

  // Lens arrows / markers
  ctx.fillStyle = '#06b6d4';
  if (lensType === 'convex') {
    // Arrow heads pointing outwards
    ctx.beginPath();
    ctx.moveTo(MID_X - 8, 48); ctx.lineTo(MID_X, 40); ctx.lineTo(MID_X + 8, 48);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(MID_X - 8, CH - 48); ctx.lineTo(MID_X, CH - 40); ctx.lineTo(MID_X + 8, CH - 48);
    ctx.stroke();
  } else {
    // Arrow heads pointing inwards
    ctx.beginPath();
    ctx.moveTo(MID_X - 8, 40); ctx.lineTo(MID_X, 48); ctx.lineTo(MID_X + 8, 40);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(MID_X - 8, CH - 40); ctx.lineTo(MID_X, CH - 48); ctx.lineTo(MID_X + 8, CH - 40);
    ctx.stroke();
  }

  // 3. Focal points (F) and 2F
  const drawFocusPoint = (x: number, label: string) => {
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(x, MID_Y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '10px monospace';
    ctx.fillText(label, x - 6, MID_Y + 18);
  };

  drawFocusPoint(MID_X - scaleF, 'F1');
  drawFocusPoint(MID_X - 2 * scaleF, '2F1');
  drawFocusPoint(MID_X + scaleF, 'F2');
  drawFocusPoint(MID_X + 2 * scaleF, '2F2');

  // 4. Draw Object (Arrow) on Left
  const objX = MID_X - scaleDo;
  const objY = MID_Y - scaleHo;

  ctx.strokeStyle = '#a78bfa';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(objX, MID_Y);
  ctx.lineTo(objX, objY);
  ctx.stroke();

  // Object Arrow Head
  ctx.fillStyle = '#a78bfa';
  ctx.beginPath();
  ctx.moveTo(objX - 6, objY + 8);
  ctx.lineTo(objX, objY);
  ctx.lineTo(objX + 6, objY + 8);
  ctx.fill();

  ctx.font = '11px monospace';
  ctx.fillText('Nesne', objX - 18, objY - 10);

  // 5. Physics Math
  // 1/f = 1/do + 1/di
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

  const scaleDi = di * SCALE;
  const imgX = MID_X + scaleDi;
  const magnification = isInfinity ? 0 : -di / doDist;
  const scaleHi = scaleHo * magnification;
  const imgY = MID_Y - scaleHi;

  // 6. Draw Image (Arrow) if not at infinity
  if (!isInfinity) {
    ctx.save();
    ctx.strokeStyle = isVirtual ? '#f43f5e' : '#10b981';
    ctx.lineWidth = 3.5;
    if (isVirtual) {
      ctx.setLineDash([4, 4]); // virtual image is dashed
    }
    ctx.beginPath();
    ctx.moveTo(imgX, MID_Y);
    ctx.lineTo(imgX, imgY);
    ctx.stroke();

    // Image Arrow Head
    ctx.fillStyle = isVirtual ? '#f43f5e' : '#10b981';
    ctx.beginPath();
    const arrowDir = scaleHi > 0 ? 1 : -1;
    ctx.moveTo(imgX - 5, imgY + 8 * arrowDir);
    ctx.lineTo(imgX, imgY);
    ctx.lineTo(imgX + 5, imgY + 8 * arrowDir);
    ctx.fill();

    ctx.font = '11px monospace';
    ctx.fillText(isVirtual ? 'Sanal Grnt.' : 'Gerçek Grnt.', imgX - 35, imgY - 10 * arrowDir);
    ctx.restore();
  } else {
    ctx.fillStyle = '#64748b';
    ctx.font = '12px monospace';
    ctx.fillText('Görüntü Sonsuzda (Paralel Işınlar)', MID_X + 60, MID_Y - 40);
  }

  // 7. Ray Tracing (Only draw if do > 0.5)
  if (doDist > 1) {
    ctx.save();

    // --- RAY 1: Parallel to Optical Axis, then through Focus F2 (or diverging from F1) ---
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.25;
    
    // Ray to lens
    ctx.beginPath();
    ctx.moveTo(objX, objY);
    ctx.lineTo(MID_X, objY);
    ctx.stroke();

    // Refracted ray
    ctx.beginPath();
    ctx.moveTo(MID_X, objY);
    if (lensType === 'convex') {
      // Goes through F2
      const dx = MID_X + scaleF - MID_X;
      const dy = MID_Y - objY;
      const t = CW / dx;
      ctx.lineTo(MID_X + dx * t, objY + dy * t);
    } else {
      // Diverges as if coming from F1 (left focus)
      const dx = MID_X - (MID_X - scaleF);
      const dy = objY - MID_Y;
      const t = CW / dx;
      ctx.lineTo(MID_X + dx * t, objY + dy * t);

      // Dashed virtual projection back to F1
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(239,68,68,0.4)';
      ctx.setLineDash([3, 3]);
      ctx.moveTo(MID_X, objY);
      ctx.lineTo(MID_X - scaleF, MID_Y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = '#ef4444';
    }
    ctx.stroke();

    // --- RAY 2: Straight through the optical center ---
    ctx.strokeStyle = '#10b981';
    ctx.beginPath();
    ctx.moveTo(objX, objY);
    const centerT = CW / (MID_X - objX);
    ctx.lineTo(objX + (MID_X - objX) * centerT, objY + (MID_Y - objY) * centerT);
    ctx.stroke();

    // --- RAY 3: Through Focus F1 to lens, then parallel (or aligned with F2) ---
    ctx.strokeStyle = '#3b82f6';
    
    if (lensType === 'convex') {
      // Goes through F1 (left focus)
      const f1X = MID_X - scaleF;
      const dx = MID_X - objX;
      const dy = MID_Y - objY; // slope through F1
      // Calculate where it hits the lens
      const lensIntersectY = objY + ((MID_X - objX) / (f1X - objX)) * (MID_Y - objY);
      
      // Ray to lens
      ctx.beginPath();
      ctx.moveTo(objX, objY);
      ctx.lineTo(MID_X, lensIntersectY);
      ctx.stroke();

      // Refracted parallel ray
      ctx.beginPath();
      ctx.moveTo(MID_X, lensIntersectY);
      ctx.lineTo(CW, lensIntersectY);
      ctx.stroke();
    } else {
      // Aligned with F2 (right focus)
      const f2X = MID_X + scaleF;
      const lensIntersectY = MID_Y + ((MID_X - f2X) / (f2X - objX)) * (objY - MID_Y);

      // Ray to lens
      ctx.beginPath();
      ctx.moveTo(objX, objY);
      ctx.lineTo(MID_X, lensIntersectY);
      ctx.stroke();

      // Refracted parallel ray
      ctx.beginPath();
      ctx.moveTo(MID_X, lensIntersectY);
      ctx.lineTo(CW, lensIntersectY);
      ctx.stroke();

      // Dashed projection to F2
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(59,130,246,0.4)';
      ctx.setLineDash([3, 3]);
      ctx.moveTo(MID_X, lensIntersectY);
      ctx.lineTo(f2X, MID_Y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // --- Virtual image projections (if image is virtual) ---
    if (isVirtual && !isInfinity) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      // Projection 1 (Parallel ray back to image)
      ctx.beginPath();
      ctx.moveTo(MID_X, objY);
      ctx.lineTo(imgX, imgY);
      ctx.stroke();
      // Projection 2 (Center ray back to image)
      ctx.beginPath();
      ctx.moveTo(MID_X, MID_Y);
      ctx.lineTo(imgX, imgY);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }
}

export default function OptikMercek() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [f, setF] = useState(20);
  const [doDist, setDoDist] = useState(35);
  const [lensType, setLensType] = useState<'convex' | 'concave'>('convex');
  
  const ho = 25; // fixed height for better visual layout

  // Mathematical outputs
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
    di = 1 / (-1 / f - 1 / doDist);
    isVirtual = true;
  }

  const magnification = isInfinity ? 0 : -di / doDist;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    drawOpticsDiagram(ctx, { f, doDist, ho, lensType });
  }, [f, doDist, lensType]);

  useEffect(() => {
    draw();
  }, [draw]);

  const sliderStyle: React.CSSProperties = { width: '100%', accentColor: '#7c3aed', cursor: 'pointer' };

  return (
    <div style={{ background: '#050a1a', color: '#f8fafc', fontFamily: 'var(--font-outfit, Outfit, sans-serif)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.09)' }}>
      <h2 style={{ fontWeight: 800, fontSize: '1.3rem', marginBottom: '0.25rem', background: 'linear-gradient(135deg, #f59e0b, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
        🔍 Mercek Optiği Simülasyonu
      </h2>
      <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: '1.25rem' }}>İnce ve kalın kenarlı merceklerde ışın çizimi ve görüntü analizi</p>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' as const }}>
        {/* Canvas */}
        <div style={{ flex: '1 1 400px' }}>
          <canvas ref={canvasRef} width={CW} height={CH}
            style={{ borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', maxWidth: '100%', display: 'block' }} />
          
          {/* Ray legends */}
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '0.75rem', fontSize: '0.78rem', color: '#94a3b8' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ width: 10, height: 10, background: '#ef4444', borderRadius: '50%' }} /> Paralel Işın
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ width: 10, height: 10, background: '#10b981', borderRadius: '50%' }} /> Merkez Işın
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ width: 10, height: 10, background: '#3b82f6', borderRadius: '50%' }} /> Odak Işın
            </span>
          </div>
        </div>

        {/* Controls */}
        <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column' as const, gap: '1rem' }}>
          {/* Lens Type Selection */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '0.25rem' }}>
            {(['convex', 'concave'] as const).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setLensType(type);
                  // Safeguard object distance for concave
                  if (type === 'concave') {
                    setDoDist(Math.max(15, doDist));
                  }
                }}
                style={{
                  padding: '0.5rem', borderRadius: '7px', border: 'none', cursor: 'pointer',
                  fontSize: '0.8rem', fontWeight: 700, transition: 'all 0.2s',
                  background: lensType === type ? 'linear-gradient(135deg, #7c3aed, #06b6d4)' : 'transparent',
                  color: lensType === type ? 'white' : '#64748b',
                }}
              >
                {type === 'convex' ? '🔍 Yakınsak (İnce)' : '🔍 Iraksak (Kalın)'}
              </button>
            ))}
          </div>

          {/* Sliders */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem', color: '#a78bfa' }}>⚙️ Değerler</div>

            <div style={{ marginBottom: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.8rem' }}>
                <span style={{ color: '#94a3b8' }}>Odak Uzaklığı (f)</span>
                <span style={{ fontWeight: 700, color: '#f59e0b', fontFamily: 'monospace' }}>{f} cm</span>
              </div>
              <input type="range" min={10} max={45} step={1} value={f} onChange={(e) => setF(+e.target.value)} style={sliderStyle} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.8rem' }}>
                <span style={{ color: '#94a3b8' }}>Nesne Uzaklığı (do)</span>
                <span style={{ fontWeight: 700, color: '#a78bfa', fontFamily: 'monospace' }}>{doDist} cm</span>
              </div>
              <input type="range" min={5} max={90} step={1} value={doDist} onChange={(e) => setDoDist(+e.target.value)} style={sliderStyle} />
            </div>
          </div>

          {/* Math Results */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem', color: '#67e8f9' }}>📊 Optik Sonuçlar</div>
            {[
              { label: 'Odak Türü', value: lensType === 'convex' ? 'Gerçek (+f)' : 'Sanal (-f)', color: '#f59e0b' },
              { label: 'Görüntü Uzaklığı (di)', value: isInfinity ? '∞ (Sonsuzda)' : `${di.toFixed(1)} cm`, color: isVirtual ? '#f43f5e' : '#10b981' },
              { label: 'Görüntü Tipi', value: isInfinity ? '—' : isVirtual ? 'Sanal (Düz)' : 'Gerçek (Ters)', color: isVirtual ? '#f43f5e' : '#10b981' },
              { label: 'Büyütme oranı (m)', value: isInfinity ? '—' : `${magnification.toFixed(2)}x`, color: '#a78bfa' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{item.label}</span>
                <span style={{ fontWeight: 700, color: item.color, fontFamily: 'monospace', fontSize: '0.85rem' }}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Physics formula box */}
          <div style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem', color: '#a78bfa' }}>📐 İnce Kenarlı Mercek Formülü</div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#e2e8f0', padding: '0.35rem', background: 'rgba(255,255,255,0.04)', borderRadius: '5px', textAlign: 'center', marginBottom: '0.5rem' }}>
              1/f = 1/do + 1/di
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.4 }}>
              * di &gt; 0 ise görüntü gerçektir ve lensin diğer tarafında oluşur.<br />
              * di &lt; 0 ise görüntü sanaldır ve cisimle aynı tarafta oluşur.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
