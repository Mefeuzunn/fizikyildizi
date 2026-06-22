import React, { useState, useEffect, useRef } from 'react';

const MekanikEnerjiKorunumu: React.FC = () => {
  const [mass, setMass] = useState(50);
  const [gravity, setGravity] = useState(9.8);
  const [friction, setFriction] = useState(0.01);
  
  const [theta, setTheta] = useState(Math.PI / 3); // starts at 60 degrees
  const [omega, setOmega] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const trackRadius = 250;
  const pivotX = 400;
  const pivotY = 80;

  const reset = () => {
    setIsPlaying(false);
    setTheta(Math.PI / 3);
    setOmega(0);
  };

  const physicsState = useRef({ theta: Math.PI/3, omega: 0, totalThermal: 0 });
  
  useEffect(() => { 
    physicsState.current.theta = Math.PI/3; 
    physicsState.current.omega = 0; 
    physicsState.current.totalThermal = 0; 
  }, [gravity, mass]);

  const updatePhysicsRef = (time: number) => {
    if (lastTimeRef.current != undefined) {
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.05); 
      const L = trackRadius / 100; // in meters, say 2.5m
      const s = physicsState.current;
      
      const v = s.omega * L;
      const dragForce = friction * mass * v * Math.abs(v); 
      const dragAccel = dragForce / mass;
      const signOmega = s.omega > 0 ? 1 : (s.omega < 0 ? -1 : 0);
      
      const alpha = -(gravity / L) * Math.sin(s.theta) - (signOmega * dragAccel / L);
      
      s.omega += alpha * dt;
      s.theta += s.omega * dt;
      
      const thermalGained = Math.abs(dragForce * v * dt);
      s.totalThermal += thermalGained;

      setTheta(s.theta);
      setOmega(s.omega);
    }
    lastTimeRef.current = time;
    if (isPlaying) requestRef.current = requestAnimationFrame(updatePhysicsRef);
  };

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(updatePhysicsRef);
    } else {
      lastTimeRef.current = null;
    }
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [isPlaying, gravity, friction, mass]);

  const skaterX = pivotX + trackRadius * Math.sin(theta);
  const skaterY = pivotY + trackRadius * Math.cos(theta);

  const L = trackRadius / 100;
  const height = L * (1 - Math.cos(theta));
  const max_height = L * (1 - Math.cos(Math.PI/3));
  
  const PE = mass * gravity * height;
  const KE = 0.5 * mass * Math.pow(physicsState.current.omega * L, 2);
  const TE = physicsState.current.totalThermal;
  const InitialE = mass * gravity * max_height;
  
  const scale = 100 / InitialE;

  return (
    <div style={{ padding: '30px', background: '#09090b', color: 'white', borderRadius: '16px', fontFamily: 'sans-serif', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px' }}>Mekanik Enerji Korunumu</h2>
      
      <div style={{ display: 'flex', gap: '30px', marginBottom: '30px' }}>
        <div style={{ flex: 1, background: '#1e1e2f', padding: '25px', borderRadius: '12px', borderLeft: '4px solid #8b5cf6' }}>
          <label style={{ display: 'block', marginBottom: '20px', color: '#d1d5db' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Kütle (m)</span>
              <strong style={{color: 'white'}}>{mass} kg</strong>
            </div>
            <input type="range" min="10" max="100" value={mass} onChange={e => {setMass(Number(e.target.value)); reset();}} style={{ width: '100%' }} disabled={isPlaying} />
          </label>
          <label style={{ display: 'block', marginBottom: '20px', color: '#d1d5db' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Yerçekimi İvmesi (g)</span>
              <strong style={{color: 'white'}}>{gravity} m/s²</strong>
            </div>
            <input type="range" min="1" max="20" step="0.1" value={gravity} onChange={e => {setGravity(Number(e.target.value)); reset();}} style={{ width: '100%' }} disabled={isPlaying} />
          </label>
          <label style={{ display: 'block', color: '#d1d5db' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Sürtünme Katsayısı</span>
              <strong style={{color: 'white'}}>{friction}</strong>
            </div>
            <input type="range" min="0" max="0.1" step="0.005" value={friction} onChange={e => {setFriction(Number(e.target.value)); reset();}} style={{ width: '100%' }} disabled={isPlaying} />
          </label>
        </div>
        
        <div style={{ width: '300px', background: '#1e1e2f', padding: '25px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h4 style={{ color: '#9ca3af', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px', marginBottom: '5px' }}>Enerji Grafiği</h4>
          <div>
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}><span>Potansiyel (PE)</span><span>{PE.toFixed(0)} J</span></div>
             <div style={{ height: '12px', background: '#09090b', borderRadius: '6px', overflow: 'hidden' }}><div style={{ height: '100%', width: `${Math.min(100, PE * scale)}%`, background: '#3b82f6', transition: 'width 0.1s ease-out' }}></div></div>
          </div>
          <div>
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}><span>Kinetik (KE)</span><span>{KE.toFixed(0)} J</span></div>
             <div style={{ height: '12px', background: '#09090b', borderRadius: '6px', overflow: 'hidden' }}><div style={{ height: '100%', width: `${Math.min(100, KE * scale)}%`, background: '#10b981', transition: 'width 0.1s ease-out' }}></div></div>
          </div>
          <div>
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}><span>Isı / Sürtünme</span><span>{TE.toFixed(0)} J</span></div>
             <div style={{ height: '12px', background: '#09090b', borderRadius: '6px', overflow: 'hidden' }}><div style={{ height: '100%', width: `${Math.min(100, TE * scale)}%`, background: '#ef4444', transition: 'width 0.1s ease-out' }}></div></div>
          </div>
          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #374151' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px', fontWeight: 'bold', color: '#f59e0b' }}><span>Toplam Enerji</span><span>{(PE+KE+TE).toFixed(0)} J</span></div>
             <div style={{ height: '12px', background: '#09090b', borderRadius: '6px', overflow: 'hidden' }}><div style={{ height: '100%', width: `${Math.min(100, (PE+KE+TE) * scale)}%`, background: '#f59e0b', transition: 'width 0.1s ease-out' }}></div></div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '30px' }}>
        <button onClick={() => setIsPlaying(!isPlaying)} style={{ padding: '12px 36px', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)', transition: 'all 0.2s' }}>{isPlaying ? 'Duraklat' : 'Başlat'}</button>
        <button onClick={() => {reset(); physicsState.current={theta:Math.PI/3, omega:0, totalThermal:0};}} style={{ padding: '12px 36px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }}>Sıfırla</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', background: '#1e1e2f', padding: '20px', borderRadius: '12px', boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.5)' }}>
        <svg width="800" height="380" style={{ background: '#09090b', borderRadius: '8px', border: '1px solid #374151' }}>
          {/* Background Grid */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1f2937" strokeWidth="1"/>
          </pattern>
          <rect width="800" height="380" fill="url(#grid)" />

          {/* Half Pipe */}
          <path d={`M ${pivotX - trackRadius} ${pivotY} A ${trackRadius} ${trackRadius} 0 0 0 ${pivotX + trackRadius} ${pivotY}`} fill="none" stroke="#4b5563" strokeWidth="12" strokeLinecap="round" />
          
          {/* Skater */}
          <g transform={`translate(${skaterX}, ${skaterY}) rotate(${-theta * (180/Math.PI)})`}>
             <circle cx="0" cy="-20" r="12" fill="#f59e0b" />
             <rect x="-15" y="-5" width="30" height="8" fill="#10b981" rx="4" />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default MekanikEnerjiKorunumu;
