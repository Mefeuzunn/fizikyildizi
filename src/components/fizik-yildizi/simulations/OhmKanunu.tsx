'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import styles from './OhmKanunu.module.css';

interface OhmKanunuParams {
  voltage: number;
  resistance: number;
}

interface OhmKanunuProps {
  initialParams?: Partial<OhmKanunuParams>;
  isLocked?: boolean;
  onParamsChange?: (params: OhmKanunuParams) => void;
}

const CANVAS_W = 600;
const CANVAS_H = 400;

export default function OhmKanunu({
  initialParams,
  isLocked = false,
  onParamsChange
}: OhmKanunuProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  // States
  const [voltage, setVoltage] = useState(initialParams?.voltage ?? 12);
  const [resistance, setResistance] = useState(initialParams?.resistance ?? 10);
  
  const current = voltage / resistance;

  // Notify parent on change
  useEffect(() => {
    if (onParamsChange) {
      onParamsChange({ voltage, resistance });
    }
  }, [voltage, resistance, onParamsChange]);

  // Animation state
  const stateRef = useRef({
    offset: 0,
    lastTime: 0
  });

  const getPathCoord = (d: number): [number, number] => {
    // Total path length = 1200
    d = ((d % 1200) + 1200) % 1200;
    if (d < 400) return [100 + d, 100];
    if (d < 600) return [500, 100 + (d - 400)];
    if (d < 1000) return [500 - (d - 600), 300];
    return [100, 300 - (d - 1000)];
  };

  const drawCircuit = useCallback((ctx: CanvasRenderingContext2D, v: number, r: number, i: number, offset: number) => {
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // Grid background
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < CANVAS_W; x += 20) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_H); ctx.stroke();
    }
    for (let y = 0; y < CANVAS_H; y += 20) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_W, y); ctx.stroke();
    }

    // Wires
    ctx.strokeStyle = '#52525b';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Top
    ctx.beginPath(); ctx.moveTo(100, 100); ctx.lineTo(500, 100); ctx.stroke();
    // Bottom
    ctx.beginPath(); ctx.moveTo(100, 300); ctx.lineTo(500, 300); ctx.stroke();
    // Left (Battery)
    ctx.beginPath(); ctx.moveTo(100, 100); ctx.lineTo(100, 190); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(100, 210); ctx.lineTo(100, 300); ctx.stroke();
    // Right (Resistor)
    ctx.beginPath(); ctx.moveTo(500, 100); ctx.lineTo(500, 160); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(500, 240); ctx.lineTo(500, 300); ctx.stroke();

    // Battery Symbol
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    // Positive terminal (long)
    ctx.beginPath(); ctx.moveTo(75, 190); ctx.lineTo(125, 190); ctx.stroke();
    // Negative terminal (short)
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(85, 210); ctx.lineTo(115, 210); ctx.stroke();
    
    // Battery Label
    ctx.fillStyle = '#f4f4f5';
    ctx.font = '14px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`${v.toFixed(1)} V`, 65, 205);
    ctx.fillStyle = '#3b82f6';
    ctx.fillText('+', 95, 180);
    ctx.fillStyle = '#f43f5e';
    ctx.fillText('-', 95, 230);

    // Resistor Symbol (Zigzag)
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(500, 160);
    ctx.lineTo(515, 170);
    ctx.lineTo(485, 183);
    ctx.lineTo(515, 196);
    ctx.lineTo(485, 210);
    ctx.lineTo(515, 223);
    ctx.lineTo(500, 240);
    ctx.stroke();

    // Resistor Label
    ctx.fillStyle = '#f4f4f5';
    ctx.textAlign = 'left';
    ctx.fillText(`${r.toFixed(1)} Ω`, 535, 205);

    // Ammeter Symbol (Top wire)
    ctx.fillStyle = '#18181b';
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(300, 100, 20, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#10b981';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.fillText('A', 300, 100);
    ctx.font = '12px monospace';
    ctx.fillText(`${i.toFixed(2)} A`, 300, 70);

    // Charge Carriers (Conventional Current)
    const numCarriers = 12;
    const spacing = 1200 / numCarriers;
    
    for (let j = 0; j < numCarriers; j++) {
      const d = offset + j * spacing;
      const [cx, cy] = getPathCoord(d);
      
      // Don't draw if inside battery or resistor
      const isInsideBattery = cx === 100 && cy > 185 && cy < 215;
      const isInsideResistor = cx === 500 && cy > 155 && cy < 245;
      const isInsideAmmeter = cy === 100 && cx > 280 && cx < 320;

      if (!isInsideBattery && !isInsideResistor && !isInsideAmmeter) {
        ctx.fillStyle = '#fcd34d';
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow
        ctx.fillStyle = 'rgba(252, 211, 77, 0.4)';
        ctx.beginPath();
        ctx.arc(cx, cy, 8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

  }, []);

  const animate = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const dt = timestamp - stateRef.current.lastTime;
    stateRef.current.lastTime = timestamp;

    if (dt < 100) { // ignore large jumps
      // Speed proportional to current
      const speed = current * 2; 
      stateRef.current.offset = (stateRef.current.offset + speed * (dt / 16)) % 1200;
    }

    drawCircuit(ctx, voltage, resistance, current, stateRef.current.offset);
    animRef.current = requestAnimationFrame(animate);
  }, [voltage, resistance, current, drawCircuit]);

  useEffect(() => {
    stateRef.current.lastTime = performance.now();
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [animate]);

  return (
    <div className={styles.container}>
      {isLocked && (
        <div className={styles.lockedMessage}>
          <span>🔒</span>
          Simülasyon şu an kilitli. Sadece izleme modundasınız.
        </div>
      )}

      <div className={styles.canvasContainer}>
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className={styles.canvas}
        />
      </div>

      <div className={styles.statsPanel}>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Gerilim (V)</span>
          <span className={`${styles.statValue} ${styles.voltage}`}>{voltage.toFixed(1)} V</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Direnç (R)</span>
          <span className={`${styles.statValue} ${styles.resistance}`}>{resistance.toFixed(1)} Ω</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Akım (I)</span>
          <span className={`${styles.statValue} ${styles.current}`}>{current.toFixed(2)} A</span>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <div className={styles.controlHeader}>
            <span className={styles.label}>Gerilim (Pil)</span>
            <span className={styles.value}>{voltage.toFixed(1)} V</span>
          </div>
          <input
            type="range"
            className={styles.slider}
            min="0"
            max="24"
            step="0.5"
            value={voltage}
            onChange={(e) => setVoltage(parseFloat(e.target.value))}
            disabled={isLocked}
          />
        </div>

        <div className={styles.controlGroup}>
          <div className={styles.controlHeader}>
            <span className={styles.label}>Direnç</span>
            <span className={styles.value}>{resistance.toFixed(1)} Ω</span>
          </div>
          <input
            type="range"
            className={styles.slider}
            min="1"
            max="100"
            step="1"
            value={resistance}
            onChange={(e) => setResistance(parseFloat(e.target.value))}
            disabled={isLocked}
          />
        </div>
      </div>
    </div>
  );
}
