import React, { useState, useEffect, useRef } from 'react';

const ArsimedKuvveti: React.FC = () => {
  const [liquidDensity, setLiquidDensity] = useState(1000);
  const [blockDensity, setBlockDensity] = useState(400);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const blockVolume = 0.001; // m^3
  const blockMass = blockDensity * blockVolume;
  
  const [y, setY] = useState(50); 
  const [v, setV] = useState(0);

  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const waterTop = 200;
  const tankBottom = 450;
  const pixelToMeter = 0.01; 

  const reset = () => {
    setIsPlaying(false);
    setY(50);
    setV(0);
  };

    const updatePhysics = (time: number) => {
    if (lastTimeRef.current != null) {
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.05);

      setY((prevY) => {
        let nextY = prevY;
        setV((prevV) => {
          let currentV = prevV;
          let newY = nextY + currentV * dt * (1/pixelToMeter);
          
          const blockBottom = newY + 60;
          let submergedFraction = 0;
          if (blockBottom > waterTop) {
            if (newY >= waterTop) submergedFraction = 1;
            else submergedFraction = (blockBottom - waterTop) / 60;
          }

          const Fg = blockMass * 9.81;
          const Fb = liquidDensity * (blockVolume * submergedFraction) * 9.81;
          const drag = currentV !== 0 ? -0.5 * liquidDensity * currentV * Math.abs(currentV) * 0.01 * (submergedFraction > 0 ? 5 : 0.1) : 0; 
          const Fnet = Fg - Fb + drag;
          const a = Fnet / blockMass;
          
          currentV += a * dt;
          
          if (blockBottom >= tankBottom) {
             if (currentV > 0) currentV = -currentV * 0.3; 
             if (Math.abs(currentV) < 0.1) currentV = 0;
          }
          
          nextY = prevY + prevV * dt * (1/pixelToMeter);
          if (nextY + 60 >= tankBottom) nextY = tankBottom - 60;

          return currentV;
        });
        return nextY;
      });
    }
    lastTimeRef.current = time;
    if (requestRef.current !== undefined) {
       requestRef.current = requestAnimationFrame(updatePhysics);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(updatePhysics);
    } else {
      lastTimeRef.current = null;
    }
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [isPlaying, liquidDensity, blockDensity, blockMass]);

  let submergedFractionDisplay = 0;
  if (y + 60 > waterTop) {
    if (y >= waterTop) submergedFractionDisplay = 1;
    else submergedFractionDisplay = (y + 60 - waterTop) / 60;
  }
  const Fg_disp = blockMass * 9.81;
  const Fb_disp = liquidDensity * (blockVolume * submergedFractionDisplay) * 9.81;

  let liquidColor = '#3b82f6';
  let liquidName = 'Su';
  if (liquidDensity === 800) { liquidColor = '#fcd34d'; liquidName = 'Zeytinyağı'; }
  if (liquidDensity === 1400) { liquidColor = '#d97706'; liquidName = 'Bal'; }

  let blockColor = '#b45309'; 
  let blockName = 'Ahşap';
  if (blockDensity === 2700) { blockColor = '#9ca3af'; blockName = 'Alüminyum'; }
  if (blockDensity === 11340) { blockColor = '#4b5563'; blockName = 'Kurşun'; }

  return (
    <div style={{ padding: '30px', background: '#09090b', color: 'white', borderRadius: '16px', fontFamily: 'sans-serif', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px' }}>Arşimet Prensibi <span style={{color: '#10b981'}}>(Kaldırma Kuvveti)</span></h2>
      
      <div style={{ display: 'flex', gap: '30px', marginBottom: '30px' }}>
        <div style={{ flex: 1, background: '#1e1e2f', padding: '20px', borderRadius: '12px', borderTop: `4px solid ${liquidColor}` }}>
          <h3 style={{ marginBottom: '15px', color: '#d1d5db', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Sıvı Seçimi</h3>
          <select value={liquidDensity} onChange={(e) => setLiquidDensity(Number(e.target.value))} style={{ width: '100%', padding: '12px', background: '#374151', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', outline: 'none' }}>
            <option value={1000}>💧 Su (1000 kg/m³)</option>
            <option value={800}>🫒 Zeytinyağı (800 kg/m³)</option>
            <option value={1400}>🍯 Bal (1400 kg/m³)</option>
          </select>
        </div>
        
        <div style={{ flex: 1, background: '#1e1e2f', padding: '20px', borderRadius: '12px', borderTop: `4px solid ${blockColor}` }}>
          <h3 style={{ marginBottom: '15px', color: '#d1d5db', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Cisim Seçimi</h3>
          <select value={blockDensity} onChange={(e) => {setBlockDensity(Number(e.target.value)); reset();}} style={{ width: '100%', padding: '12px', background: '#374151', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', outline: 'none' }}>
            <option value={400}>🪵 Ahşap (400 kg/m³)</option>
            <option value={2700}>⚙️ Alüminyum (2700 kg/m³)</option>
            <option value={11340}>🧱 Kurşun (11340 kg/m³)</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '30px' }}>
        <button onClick={() => setIsPlaying(!isPlaying)} style={{ padding: '12px 36px', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)', transition: 'all 0.2s' }}>{isPlaying ? 'Duraklat' : 'Bırak'}</button>
        <button onClick={reset} style={{ padding: '12px 36px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }}>Başa Dön</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '30px' }}>
        <div style={{ width: '320px', height: '500px', background: '#1e1e2f', position: 'relative', borderRadius: '12px 12px 24px 24px', overflow: 'hidden', margin: '0 auto', border: '4px solid #4b5563', borderTop: 'none', boxShadow: 'inset 0 10px 30px rgba(0,0,0,0.5)' }}>
           {/* Background Grid */}
           <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
           
           {/* Liquid */}
           <div style={{ position: 'absolute', top: waterTop, bottom: 0, left: 0, right: 0, background: `linear-gradient(180deg, ${liquidColor}88, ${liquidColor})`, backdropFilter: 'blur(4px)', borderTop: `2px solid ${liquidColor}`, transition: 'background 0.3s' }}>
             <div style={{ position: 'absolute', top: '-2px', left: 0, width: '100%', height: '4px', background: 'rgba(255,255,255,0.3)', filter: 'blur(1px)' }}></div>
           </div>
           
           {/* Block */}
           <div style={{ position: 'absolute', left: '130px', top: y, width: '60px', height: '60px', background: blockColor, borderRadius: '6px', boxShadow: 'inset 0 0 15px rgba(0,0,0,0.6), 0 5px 15px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
             {blockName.charAt(0)}
             
             {/* Gravity Vector */}
             <div style={{ position: 'absolute', left: '28px', top: '30px', width: '4px', height: `${Math.min(180, Fg_disp * 5)}px`, background: '#ef4444', zIndex: 10 }}>
               <div style={{ position: 'absolute', bottom: '-6px', left: '-4px', width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid #ef4444' }}></div>
             </div>
             
             {/* Buoyancy Vector */}
             <div style={{ position: 'absolute', left: '28px', bottom: '30px', width: '4px', height: `${Math.min(180, Fb_disp * 5)}px`, background: '#10b981', zIndex: 10, transform: 'rotate(180deg)', transformOrigin: 'bottom center' }}>
               <div style={{ position: 'absolute', bottom: '-6px', left: '-4px', width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid #10b981' }}></div>
             </div>
           </div>
        </div>

        <div style={{ flex: 1, background: '#1e1e2f', padding: '30px', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ borderBottom: '2px solid #374151', paddingBottom: '15px', marginBottom: '20px', color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '1px' }}>Kuvvet Analizi</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', padding: '15px', background: '#09090b', borderRadius: '8px', borderLeft: '4px solid #ef4444' }}>
            <span style={{ fontSize: '16px', color: '#d1d5db' }}>Yerçekimi Kuvveti (G)</span>
            <strong style={{ color: '#ef4444', fontSize: '20px' }}>{Fg_disp.toFixed(2)} N</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', padding: '15px', background: '#09090b', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
            <span style={{ fontSize: '16px', color: '#d1d5db' }}>Kaldırma Kuvveti (F<sub>b</sub>)</span>
            <strong style={{ color: '#10b981', fontSize: '20px' }}>{Fb_disp.toFixed(2)} N</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', padding: '15px', background: '#09090b', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
            <span style={{ fontSize: '16px', color: '#d1d5db', fontWeight: 'bold' }}>Net Kuvvet</span>
            <strong style={{ color: '#f59e0b', fontSize: '20px' }}>{Math.abs(Fb_disp - Fg_disp).toFixed(2)} N {(Fb_disp - Fg_disp) > 0 ? '(↑)' : '(↓)'}</strong>
          </div>
          
          <div style={{ padding: '20px', background: '#374151', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
            <h4 style={{ marginBottom: '10px', color: '#60a5fa' }}>Arşimet Prensibi</h4>
            <p style={{ color: '#d1d5db', fontSize: '14px', lineHeight: '1.6' }}>
              Bir sıvıya daldırılan cisme sıvı tarafından uygulanan kaldırma kuvveti, cismin yerini değiştirdiği sıvının ağırlığına eşittir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArsimedKuvveti;
