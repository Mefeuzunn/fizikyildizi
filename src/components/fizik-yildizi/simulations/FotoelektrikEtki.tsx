import React, { useState, useEffect, useRef } from 'react';

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
  const requestRef = useRef<number | null>(null);
  
  const [wavelength, setWavelength] = useState(400); // 200 to 800 nm
  const [intensity, setIntensity] = useState(50); // 10 to 100
  const [metalIndex, setMetalIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  const metal = METALS[metalIndex];
  const photonEnergy = HC / wavelength;
  const isEmitting = photonEnergy > metal.workFunction;
  const maxKe = isEmitting ? photonEnergy - metal.workFunction : 0;

  // Electrons state
  const electronsRef = useRef<{x: number, y: number, vx: number, vy: number, id: number}[]>([]);
  const lastEmitRef = useRef<number>(0);

  const getWavelengthColor = (wl: number) => {
    // Very rough approximation of visible spectrum
    if (wl < 380) return '#9d4edd'; // UV - violet
    if (wl >= 380 && wl < 450) return '#5c21d0';
    if (wl >= 450 && wl < 495) return '#0077b6';
    if (wl >= 495 && wl < 570) return '#2a9d8f';
    if (wl >= 570 && wl < 590) return '#e9c46a';
    if (wl >= 590 && wl < 620) return '#f4a261';
    if (wl >= 620 && wl < 750) return '#e76f51';
    return '#8b0000'; // IR
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Metal Plate
    ctx.fillStyle = metal.color;
    ctx.fillRect(50, 100, 30, 300);
    ctx.shadowBlur = 10;
    ctx.shadowColor = metal.color;
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillRect(55, 105, 10, 290);
    ctx.shadowBlur = 0;

    // Draw Light Beam
    if (isRunning) {
      const color = getWavelengthColor(wavelength);
      ctx.fillStyle = color;
      ctx.globalAlpha = intensity / 100 * 0.5;
      ctx.beginPath();
      ctx.moveTo(300, 0); // Source
      ctx.lineTo(80, 100);
      ctx.lineTo(80, 400);
      ctx.lineTo(400, 0);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }

    // Draw Electrons
    ctx.fillStyle = '#60a5fa'; // blue-400
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#60a5fa';
    electronsRef.current.forEach(e => {
      ctx.beginPath();
      ctx.arc(e.x, e.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.shadowBlur = 0;
  };

  const updatePhysics = (time: number) => {
    const dt = 16; // rough ms

    if (isRunning && isEmitting) {
      // Emit probability based on intensity
      const emitDelay = 1000 / (intensity * 0.5); 
      if (time - lastEmitRef.current > emitDelay) {
        lastEmitRef.current = time;
        // speed proportional to sqrt(KE)
        const speed = Math.sqrt(maxKe) * 2;
        electronsRef.current.push({
          x: 80,
          y: 100 + Math.random() * 300,
          vx: speed + Math.random() * speed * 0.2, // Move right
          vy: (Math.random() - 0.5) * speed * 0.5,
          id: Math.random()
        });
      }
    }

    // Update electron positions
    electronsRef.current.forEach(e => {
      e.x += e.vx;
      e.y += e.vy;
    });

    // Remove electrons that are off screen
    electronsRef.current = electronsRef.current.filter(e => e.x < 600 && e.y > 0 && e.y < 500);

    draw();
    if (isRunning) {
      requestRef.current = requestAnimationFrame(updatePhysics);
    }
  };

  useEffect(() => {
    if (isRunning) {
      requestRef.current = requestAnimationFrame(updatePhysics);
    } else {
      draw(); // Draw static state
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isRunning, wavelength, intensity, metalIndex]);

  return (
    <div style={{ background: '#09090b', padding: '1.5rem', borderRadius: '24px', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>Fotoelektrik Etki</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>Işığın metale çarpmasıyla elektron koparılmasını inceleyin.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
            Foton Enerjisi: <span style={{ color: '#38bdf8' }}>{photonEnergy.toFixed(2)} eV</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
            Maks Kinetik Enerji: <span style={{ color: isEmitting ? '#10b981' : '#ef4444' }}>{maxKe.toFixed(2)} eV</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' }}>
        <div style={{ background: '#000', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <canvas
            ref={canvasRef}
            width={600}
            height={500}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#e2e8f0' }}>Kontroller</h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.5rem' }}>Hedef Metal</label>
              <select 
                value={metalIndex}
                onChange={(e) => setMetalIndex(Number(e.target.value))}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                {METALS.map((m, i) => (
                  <option key={i} value={i}>{m.name} (W: {m.workFunction} eV)</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                <span>Dalga Boyu (λ)</span>
                <span>{wavelength} nm</span>
              </div>
              <input 
                type="range" 
                min="200" max="800" step="5"
                value={wavelength}
                onChange={(e) => setWavelength(Number(e.target.value))}
                style={{ width: '100%', accentColor: getWavelengthColor(wavelength) }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                <span>Işık Şiddeti</span>
                <span>%{intensity}</span>
              </div>
              <input 
                type="range" 
                min="0" max="100" step="5"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#facc15' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => setIsRunning(!isRunning)}
                style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none', background: isRunning ? '#ef4444' : '#3b82f6', color: '#fff', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
              >
                {isRunning ? 'Işığı Kapat' : 'Işığı Aç'}
              </button>
            </div>
          </div>
          
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
             <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', color: '#e2e8f0' }}>Bilgi</h3>
             <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
               Foton enerjisi E = hc / λ formülü ile hesaplanır. Eğer E &gt; Bağlanma Enerjisi (W) ise metalden elektron kopar. Kopan elektronların maksimum kinetik enerjisi K.E. = E - W kadardır.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
