'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

// ─── Circuit Types ───────────────────────────────────────────────────────────

type CircuitType = 'Seri' | 'Paralel' | 'Karma' | 'RC' | 'RL';

interface CircuitResult {
  I_total: number;
  I1: number;
  I2: number;
  I3: number;
  V1: number;
  V2: number;
  V3: number;
  P_total: number;
  R_total: number;
  shortCircuit: boolean;
}

// ─── Canvas dimensions ───────────────────────────────────────────────────────

const CW = 560;
const CH = 380;

// ─── Physics Calc ────────────────────────────────────────────────────────────

function calculate(type: CircuitType, V: number, R1: number, R2: number, R3: number): CircuitResult {
  const short = R1 <= 0.01 || R2 <= 0.01 || R3 <= 0.01;

  if (type === 'Seri') {
    const R_total = R1 + R2 + R3;
    const I = V / R_total;
    return { I_total: I, I1: I, I2: I, I3: I, V1: I * R1, V2: I * R2, V3: I * R3, P_total: V * I, R_total, shortCircuit: short };
  }
  if (type === 'Paralel') {
    const R_total = 1 / (1 / R1 + 1 / R2 + 1 / R3);
    const I1 = V / R1, I2 = V / R2, I3 = V / R3;
    const I_total = I1 + I2 + I3;
    return { I_total, I1, I2, I3, V1: V, V2: V, V3: V, P_total: V * I_total, R_total, shortCircuit: short };
  }
  if (type === 'Karma') {
    // R2 || R3 in series with R1
    const R23 = 1 / (1 / R2 + 1 / R3);
    const R_total = R1 + R23;
    const I_total = V / R_total;
    const V1 = I_total * R1;
    const V23 = V - V1;
    const I2 = V23 / R2, I3 = V23 / R3;
    return { I_total, I1: I_total, I2, I3, V1, V2: V23, V3: V23, P_total: V * I_total, R_total, shortCircuit: short };
  }
  if (type === 'RC' || type === 'RL') {
    // Simplified: treat as series with R2=capacitor/inductor reactance
    const X = R2; // treat R2 as reactance slider
    const Z = Math.sqrt(R1 * R1 + X * X);
    const I = V / Z;
    return { I_total: I, I1: I, I2: I, I3: 0, V1: I * R1, V2: I * X, V3: 0, P_total: V * I * (R1 / Z), R_total: Z, shortCircuit: short };
  }
  return { I_total: 0, I1: 0, I2: 0, I3: 0, V1: 0, V2: 0, V3: 0, P_total: 0, R_total: 0, shortCircuit: false };
}

// ─── Canvas Drawing ──────────────────────────────────────────────────────────

interface DrawOpts {
  type: CircuitType;
  result: CircuitResult;
  V: number;
  R1: number; R2: number; R3: number;
  dotOffset: number;
}

function drawBattery(ctx: CanvasRenderingContext2D, x: number, y: number, w: number) {
  ctx.save();
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;
  // Long plate
  ctx.beginPath(); ctx.moveTo(x + w * 0.4, y - 14); ctx.lineTo(x + w * 0.4, y + 14); ctx.stroke();
  // Short plate
  ctx.beginPath(); ctx.moveTo(x + w * 0.6, y - 8); ctx.lineTo(x + w * 0.6, y + 8); ctx.stroke();
  // Labels
  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 11px monospace';
  ctx.fillText('+', x + w * 0.3, y + 5);
  ctx.fillText('-', x + w * 0.6 + 6, y + 5);
  ctx.restore();
}

function drawResistor(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, label: string, horizontal = true) {
  ctx.save();
  const rW = 36, rH = 16;
  const rx = x + (w - rW) / 2;
  const ry = y - rH / 2;

  if (horizontal) {
    // Wire in
    ctx.strokeStyle = 'rgba(6,182,212,0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(rx, y); ctx.stroke();
    // Box
    ctx.strokeStyle = '#7c3aed';
    ctx.lineWidth = 2;
    ctx.fillStyle = 'rgba(124,58,237,0.15)';
    ctx.fillRect(rx, ry, rW, rH);
    ctx.strokeRect(rx, ry, rW, rH);
    // Zigzag
    ctx.strokeStyle = '#a78bfa';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i <= 6; i++) {
      const xi = rx + (i / 6) * rW;
      const yi = y + (i % 2 === 0 ? -4 : 4);
      i === 0 ? ctx.moveTo(xi, yi) : ctx.lineTo(xi, yi);
    }
    ctx.stroke();
    // Wire out
    ctx.strokeStyle = 'rgba(6,182,212,0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(rx + rW, y); ctx.lineTo(x + w, y); ctx.stroke();
    // Label
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(label, rx + rW / 2, ry - 6);
  }
  ctx.restore();
}

function drawCapacitor(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, label: string) {
  ctx.save();
  const cx = x + w / 2;
  ctx.strokeStyle = 'rgba(6,182,212,0.6)';
  ctx.lineWidth = 2;
  // Wires
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(cx - 10, y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + 10, y); ctx.lineTo(x + w, y); ctx.stroke();
  // Plates
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(cx - 10, y - 14); ctx.lineTo(cx - 10, y + 14); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + 10, y - 14); ctx.lineTo(cx + 10, y + 14); ctx.stroke();
  ctx.fillStyle = '#67e8f9';
  ctx.font = 'bold 11px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(label, cx, y - 22);
  ctx.restore();
}

function drawInductor(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, label: string) {
  ctx.save();
  const cx = x + w / 2;
  ctx.strokeStyle = 'rgba(6,182,212,0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(cx - 30, y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + 30, y); ctx.lineTo(x + w, y); ctx.stroke();
  // Coil arcs
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.arc(cx - 18 + i * 12, y, 6, Math.PI, 0);
    ctx.stroke();
  }
  ctx.fillStyle = '#fcd34d';
  ctx.font = 'bold 11px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(label, cx, y - 18);
  ctx.restore();
}

function drawCurrentDots(ctx: CanvasRenderingContext2D, points: [number, number][], offset: number, color: string, reverse = false) {
  if (points.length < 2) return;
  ctx.save();
  // Total path length
  let totalLen = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i][0] - points[i - 1][0];
    const dy = points[i][1] - points[i - 1][1];
    totalLen += Math.sqrt(dx * dx + dy * dy);
  }

  const numDots = 5;
  const spacing = totalLen / numDots;

  for (let d = 0; d < numDots; d++) {
    let targetDist = ((d * spacing + offset) % totalLen + totalLen) % totalLen;
    let traveled = 0;
    for (let i = 1; i < points.length; i++) {
      const dx = points[i][0] - points[i - 1][0];
      const dy = points[i][1] - points[i - 1][1];
      const segLen = Math.sqrt(dx * dx + dy * dy);
      if (traveled + segLen >= targetDist) {
        const t = (targetDist - traveled) / segLen;
        const px = points[i - 1][0] + dx * t;
        const py = points[i - 1][1] + dy * t;
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.fill();
        break;
      }
      traveled += segLen;
    }
  }
  ctx.restore();
}

function drawCircuit(ctx: CanvasRenderingContext2D, opts: DrawOpts) {
  ctx.fillStyle = '#050a1a';
  ctx.fillRect(0, 0, CW, CH);

  // Grid
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x < CW; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CH); ctx.stroke(); }
  for (let y = 0; y < CH; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CW, y); ctx.stroke(); }
  ctx.restore();

  const { type, result, dotOffset } = opts;
  const wireColor = result.shortCircuit ? '#ef4444' : 'rgba(6,182,212,0.7)';

  ctx.save();
  ctx.strokeStyle = wireColor;
  ctx.lineWidth = 2;

  if (type === 'Seri') {
    // Battery: left side vertical
    // Top wire → R1 → R2 → R3 → right side → bottom → battery
    const bx = 60, by = CH / 2;
    const topY = 80, botY = CH - 80;
    const r1x = 140, r2x = 280, r3x = 420;

    // Battery vertical wire
    ctx.beginPath(); ctx.moveTo(bx + 30, topY); ctx.lineTo(bx + 30, botY); ctx.stroke();
    drawBattery(ctx, bx, by, 60);
    // Top horizontal
    ctx.beginPath(); ctx.moveTo(bx + 30, topY); ctx.lineTo(CW - 60, topY); ctx.stroke();
    // Right vertical
    ctx.beginPath(); ctx.moveTo(CW - 60, topY); ctx.lineTo(CW - 60, botY); ctx.stroke();
    // Bottom horizontal
    ctx.beginPath(); ctx.moveTo(bx + 30, botY); ctx.lineTo(CW - 60, botY); ctx.stroke();

    drawResistor(ctx, r1x, topY, 100, `R1=${opts.R1}Ω`);
    drawResistor(ctx, r2x, topY, 100, `R2=${opts.R2}Ω`);
    drawResistor(ctx, r3x, topY, 100, `R3=${opts.R3}Ω`);

    // Voltage labels
    ctx.fillStyle = '#f59e0b';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    if (!result.shortCircuit) {
      ctx.fillText(`${result.V1.toFixed(1)}V`, r1x + 50, topY + 30);
      ctx.fillText(`${result.V2.toFixed(1)}V`, r2x + 50, topY + 30);
      ctx.fillText(`${result.V3.toFixed(1)}V`, r3x + 50, topY + 30);
    }

    // Dots path: top wire + bottom wire (simplified)
    const pathTop: [number, number][] = [[bx + 30, topY], [r1x, topY], [r1x + 100, topY], [r2x, topY], [r2x + 100, topY], [r3x, topY], [r3x + 100, topY], [CW - 60, topY]];
    const pathBot: [number, number][] = [[CW - 60, topY], [CW - 60, botY], [bx + 30, botY], [bx + 30, topY]];
    const fullPath = [...pathTop, ...pathBot];
    drawCurrentDots(ctx, fullPath, dotOffset, '#10b981');

  } else if (type === 'Paralel') {
    const lx = 60, rx_edge = CW - 60;
    const topY = 60, botY = CH - 60;
    const branch1Y = CH / 2 - 80, branch2Y = CH / 2, branch3Y = CH / 2 + 80;

    // Left/right rails
    ctx.beginPath(); ctx.moveTo(lx, topY); ctx.lineTo(lx, botY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(rx_edge, topY); ctx.lineTo(rx_edge, botY); ctx.stroke();
    // Top/bottom connections
    ctx.beginPath(); ctx.moveTo(lx, topY); ctx.lineTo(rx_edge, topY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(lx, botY); ctx.lineTo(rx_edge, botY); ctx.stroke();

    drawBattery(ctx, lx - 35, CH / 2, 70);

    // Branches
    [[branch1Y, opts.R1, 'R1'], [branch2Y, opts.R2, 'R2'], [branch3Y, opts.R3, 'R3']].forEach(([by, rv, name], i) => {
      const bY = by as number;
      ctx.strokeStyle = wireColor;
      ctx.beginPath(); ctx.moveTo(lx, bY); ctx.lineTo(rx_edge, bY); ctx.stroke();
      drawResistor(ctx, lx, bY, rx_edge - lx, `${name}=${rv}Ω`);
      // Current label
      if (!result.shortCircuit) {
        const currents = [result.I1, result.I2, result.I3];
        ctx.fillStyle = '#06b6d4';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${currents[i].toFixed(2)}A`, (lx + rx_edge) / 2, bY + 28);
      }
      // Dots per branch
      const pathBranch: [number, number][] = [[lx, bY], [(lx + rx_edge) / 2, bY], [rx_edge, bY]];
      drawCurrentDots(ctx, pathBranch, (dotOffset + i * 30) % 200, ['#10b981', '#06b6d4', '#8b5cf6'][i]);
    });

  } else if (type === 'Karma') {
    const topY = 80, botY = CH - 80;
    const lx = 50, rx_edge = CW - 50;
    const splitX = CW * 0.55;

    ctx.beginPath(); ctx.moveTo(lx + 40, topY); ctx.lineTo(rx_edge, topY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(lx + 40, botY); ctx.lineTo(rx_edge, botY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(lx + 40, topY); ctx.lineTo(lx + 40, botY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(rx_edge, topY); ctx.lineTo(rx_edge, botY); ctx.stroke();
    drawBattery(ctx, lx, CH / 2, 80);

    // R1 series on top
    drawResistor(ctx, 120, topY, 160, `R1=${opts.R1}Ω`);

    // R2, R3 parallel on right half
    const p2Y = CH / 2 - 60, p3Y = CH / 2 + 60;
    ctx.strokeStyle = wireColor;
    ctx.beginPath(); ctx.moveTo(splitX, topY); ctx.lineTo(splitX, p2Y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(splitX, botY); ctx.lineTo(splitX, p3Y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(splitX, p2Y); ctx.lineTo(rx_edge, p2Y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(splitX, p3Y); ctx.lineTo(rx_edge, p3Y); ctx.stroke();
    drawResistor(ctx, splitX, p2Y, rx_edge - splitX, `R2=${opts.R2}Ω`);
    drawResistor(ctx, splitX, p3Y, rx_edge - splitX, `R3=${opts.R3}Ω`);

    if (!result.shortCircuit) {
      ctx.fillStyle = '#f59e0b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`I=${result.I_total.toFixed(2)}A`, 200, topY - 15);
      ctx.fillText(`${result.I2.toFixed(2)}A`, (splitX + rx_edge) / 2, p2Y + 28);
      ctx.fillText(`${result.I3.toFixed(2)}A`, (splitX + rx_edge) / 2, p3Y + 28);
    }

    const pathSimple: [number, number][] = [[lx + 40, topY], [rx_edge, topY], [rx_edge, botY], [lx + 40, botY], [lx + 40, topY]];
    drawCurrentDots(ctx, pathSimple, dotOffset, '#10b981');

  } else if (type === 'RC' || type === 'RL') {
    const topY = 100, botY = CH - 100;
    const lx = 60, rx_edge = CW - 60;
    ctx.beginPath(); ctx.moveTo(lx + 40, topY); ctx.lineTo(rx_edge, topY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(lx + 40, botY); ctx.lineTo(rx_edge, botY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(lx + 40, topY); ctx.lineTo(lx + 40, botY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(rx_edge, topY); ctx.lineTo(rx_edge, botY); ctx.stroke();
    drawBattery(ctx, lx, CH / 2, 80);

    const midX = (lx + 40 + rx_edge) / 2;
    drawResistor(ctx, lx + 40, topY, midX - lx - 40, `R=${opts.R1}Ω`);
    if (type === 'RC') {
      drawCapacitor(ctx, midX, topY, rx_edge - midX, `C (X=${opts.R2}Ω)`);
    } else {
      drawInductor(ctx, midX, topY, rx_edge - midX, `L (X=${opts.R2}Ω)`);
    }

    if (!result.shortCircuit) {
      ctx.fillStyle = '#06b6d4';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`I=${result.I_total.toFixed(2)}A`, (lx + rx_edge) / 2, topY - 15);
      ctx.fillText(`Z=${result.R_total.toFixed(1)}Ω`, (lx + rx_edge) / 2, topY + 45);
    }

    const pathRC: [number, number][] = [[lx + 40, topY], [rx_edge, topY], [rx_edge, botY], [lx + 40, botY], [lx + 40, topY]];
    drawCurrentDots(ctx, pathRC, dotOffset, '#06b6d4');
  }

  // Short circuit warning
  if (result.shortCircuit) {
    ctx.save();
    ctx.fillStyle = 'rgba(239,68,68,0.15)';
    ctx.fillRect(0, 0, CW, CH);
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 22px var(--font-outfit, Outfit, sans-serif)';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ KISA DEVRE TEHLİKESİ!', CW / 2, CH / 2);
    ctx.font = '14px monospace';
    ctx.fillStyle = '#fca5a5';
    ctx.fillText('Direnç sıfıra yakın — sonsuz akım!', CW / 2, CH / 2 + 30);
    ctx.restore();
  }

  // V label
  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 12px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`${opts.V}V`, 80, CH / 2 + 5);
  ctx.restore();
}

// ─── Component ───────────────────────────────────────────────────────────────

const CIRCUITS: CircuitType[] = ['Seri', 'Paralel', 'Karma', 'RC', 'RL'];

export default function ElektrikDevresi() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const dotOffsetRef = useRef(0);

  const [circuitType, setCircuitType] = useState<CircuitType>('Seri');
  const [V, setV] = useState(12);
  const [R1, setR1] = useState(10);
  const [R2, setR2] = useState(20);
  const [R3, setR3] = useState(30);

  const result = calculate(circuitType, V, R1, R2, R3);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    dotOffsetRef.current = (dotOffsetRef.current + 1.5) % 300;
    drawCircuit(ctx, { type: circuitType, result, V, R1, R2, R3, dotOffset: dotOffsetRef.current });
    animRef.current = requestAnimationFrame(draw);
  }, [circuitType, result, V, R1, R2, R3]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  const sliderStyle: React.CSSProperties = { width: '100%', accentColor: '#7c3aed', cursor: 'pointer' };
  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '0.4rem 0.875rem', borderRadius: '8px', cursor: 'pointer',
    fontWeight: 600, fontSize: '0.82rem', transition: 'all 0.2s',
    background: active ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.05)',
    color: active ? '#a78bfa' : '#64748b',
    border: active ? '1px solid rgba(124,58,237,0.4)' : '1px solid transparent',
  });

  const getR3Label = () => {
    if (circuitType === 'RC') return 'C Reaktansı (Xc)';
    if (circuitType === 'RL') return 'L Reaktansı (XL)';
    return 'R3';
  };

  return (
    <div style={{ background: '#050a1a', color: '#f8fafc', fontFamily: 'var(--font-outfit, Outfit, sans-serif)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.09)' }}>
      <h2 style={{ fontWeight: 800, fontSize: '1.3rem', marginBottom: '0.25rem', background: 'linear-gradient(135deg, #10b981, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
        ⚡ Elektrik Devresi Simülasyonu
      </h2>
      <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: '1.25rem' }}>İnteraktif devre analizi — gerçek zamanlı hesaplama</p>

      {/* Circuit selector */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
        {CIRCUITS.map((c) => (
          <button key={c} onClick={() => setCircuitType(c)} style={tabStyle(circuitType === c)}>{c} Devre</button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' as const }}>
        {/* Canvas */}
        <div style={{ flex: '1 1 400px' }}>
          <canvas ref={canvasRef} width={CW} height={CH}
            style={{ borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', maxWidth: '100%', display: 'block' }} />

          {result.shortCircuit && (
            <div style={{ marginTop: '0.75rem', padding: '0.75rem 1rem', borderRadius: '10px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', fontSize: '0.85rem' }}>
              ⚠️ <strong>Uyarı:</strong> Direnç değeri çok düşük! Kısa devre tehlikesi. Gerçek devreler zarar görebilir.
            </div>
          )}
        </div>

        {/* Controls + Results */}
        <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column' as const, gap: '1rem' }}>
          {/* Sliders */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem', color: '#a78bfa' }}>⚙️ Değerler</div>

            {[
              { label: 'Gerilim (V)', value: V, min: 1, max: 24, step: 1, unit: 'V', setter: setV, color: '#10b981' },
              { label: 'R1 (Ω)', value: R1, min: 1, max: 100, step: 1, unit: 'Ω', setter: setR1, color: '#7c3aed' },
              { label: circuitType === 'RC' ? 'R (Ω)' : circuitType === 'RL' ? 'R (Ω)' : 'R2 (Ω)', value: R2, min: 1, max: 100, step: 1, unit: 'Ω', setter: setR2, color: '#06b6d4' },
              ...(circuitType !== 'RC' && circuitType !== 'RL' ? [{ label: 'R3 (Ω)', value: R3, min: 1, max: 100, step: 1, unit: 'Ω', setter: setR3, color: '#f59e0b' }] : [{ label: getR3Label(), value: R2, min: 1, max: 100, step: 1, unit: 'Ω', setter: setR2, color: '#f59e0b' }]),
            ].map((item) => (
              <div key={item.label} style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{item.label}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: item.color, fontFamily: 'monospace' }}>{item.value}{item.unit}</span>
                </div>
                <input type="range" min={item.min} max={item.max} step={item.step} value={item.value} onChange={(e) => item.setter(+e.target.value)} style={{ ...sliderStyle }} />
              </div>
            ))}
          </div>

          {/* Results */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem', color: '#67e8f9' }}>📊 Hesaplama Sonuçları</div>
            {[
              { label: 'Toplam Direnç', value: result.shortCircuit ? '—' : `${result.R_total.toFixed(2)} Ω`, color: '#8b5cf6' },
              { label: 'Toplam Akım', value: result.shortCircuit ? '∞' : `${result.I_total.toFixed(3)} A`, color: '#06b6d4' },
              { label: circuitType === 'Seri' ? 'Akım (I1=I2=I3)' : 'Akım I1', value: result.shortCircuit ? '∞' : `${result.I1.toFixed(3)} A`, color: '#7c3aed' },
              ...(circuitType !== 'Seri' ? [
                { label: 'Akım I2', value: result.shortCircuit ? '∞' : `${result.I2.toFixed(3)} A`, color: '#06b6d4' },
                { label: 'Akım I3', value: result.shortCircuit ? '∞' : `${result.I3.toFixed(3)} A`, color: '#0ea5e9' },
              ] : []),
              { label: 'Toplam Güç', value: result.shortCircuit ? '∞' : `${result.P_total.toFixed(2)} W`, color: '#f59e0b' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{item.label}</span>
                <span style={{ fontWeight: 700, color: item.color, fontFamily: 'monospace', fontSize: '0.9rem' }}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Formulas */}
          <div style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem', color: '#a78bfa' }}>📐 Formüller</div>
            {[
              'V = I · R (Ohm Yasası)',
              circuitType === 'Seri' ? 'R_t = R1+R2+R3' : circuitType === 'Paralel' ? '1/R_t = 1/R1+1/R2+1/R3' : circuitType === 'RC' ? 'Z = √(R²+Xc²)' : circuitType === 'RL' ? 'Z = √(R²+XL²)' : 'R_t = R1 + R2||R3',
              'P = V · I = I²·R',
            ].map((f) => (
              <div key={f} style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#e2e8f0', marginBottom: '0.35rem', padding: '0.25rem 0.5rem', background: 'rgba(255,255,255,0.04)', borderRadius: '5px' }}>{f}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
