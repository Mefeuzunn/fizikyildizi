import React, { useState, useEffect, useRef } from 'react';

const GazYasalari: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [temperature, setTemperature] = useState(300); // Kelvin
  const [volume, setVolume] = useState(500); // representation of width
  const [pressure, setPressure] = useState(0);

  const particlesRef = useRef<Array<{x: number, y: number, vx: number, vy: number}>>([]);
  const requestRef = useRef<number | null>(null);
  
  const numParticles = 200;
  const radius = 4;
  const canvasHeight = 350;

  // Initialize particles
  useEffect(() => {
    const particles = [];
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * (volume - 2 * radius) + radius,
        y: Math.random() * (canvasHeight - 2 * radius) + radius,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2
      });
    }
    particlesRef.current = particles;
  }, []); // Run once

  // Simulation Loop
  const updateParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw container boundaries
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 6;
    ctx.lineJoin = 'round';
    ctx.strokeRect(3, 3, volume, canvasHeight - 6);
    
    // Draw movable piston
    ctx.fillStyle = '#9ca3af';
    ctx.fillRect(volume, 0, 24, canvasHeight);
    
    // Piston details
    ctx.fillStyle = '#4b5563';
    ctx.fillRect(volume + 24, canvasHeight/2 - 10, 100, 20); // Handle

    // Speed scaling based on temperature (Kinetic Energy proportional to T)
    const speedScale = Math.sqrt(temperature / 300) * 3.5;

    particlesRef.current.forEach(p => {
      // Normalize velocity vector
      const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (currentSpeed !== 0) {
        p.vx = (p.vx / currentSpeed) * speedScale;
        p.vy = (p.vy / currentSpeed) * speedScale;
      }

      p.x += p.vx;
      p.y += p.vy;

      // Wall collisions
      if (p.x - radius < 3) {
        p.x = radius + 3;
        p.vx *= -1;
      }
      if (p.x + radius > volume) {
        p.x = volume - radius;
        p.vx *= -1;
      }
      if (p.y - radius < 3) {
        p.y = radius + 3;
        p.vy *= -1;
      }
      if (p.y + radius > canvasHeight - 3) {
        p.y = canvasHeight - 3 - radius;
        p.vy *= -1;
      }

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      
      // Color gradient based on temperature
      if (temperature > 400) {
        ctx.fillStyle = '#ef4444';
      } else if (temperature < 200) {
        ctx.fillStyle = '#3b82f6';
      } else {
        ctx.fillStyle = '#10b981';
      }
      
      ctx.shadowBlur = 4;
      ctx.shadowColor = ctx.fillStyle;
      ctx.fill();
      ctx.shadowBlur = 0; // reset
    });

    // P = nRT/V (Ideal gas law calculation for UI)
    const calculatedPressure = (100 * temperature) / volume;
    setPressure(calculatedPressure);

    requestRef.current = requestAnimationFrame(updateParticles);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateParticles);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [temperature, volume]);

  return (
    <div style={{ padding: '30px', background: '#09090b', color: 'white', borderRadius: '16px', fontFamily: 'sans-serif', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px' }}>İdeal Gaz Yasaları <span style={{color: '#f59e0b'}}>(Termodinamik)</span></h2>
      
      <div style={{ display: 'flex', gap: '30px', marginBottom: '30px' }}>
        <div style={{ flex: 1, background: '#1e1e2f', padding: '25px', borderRadius: '12px', borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
             <h3 style={{ color: '#d1d5db', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Sıcaklık (T): <strong style={{color: '#ef4444', fontSize: '22px', marginLeft: '10px'}}>{temperature} K</strong></h3>
             <div style={{ display: 'flex', gap: '10px' }}>
               <button onClick={() => setTemperature(t => Math.min(t + 50, 800))} style={{ padding: '8px 20px', background: 'linear-gradient(135deg, #f87171, #ef4444)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(239, 68, 68, 0.3)' }}>Isıt (+)</button>
               <button onClick={() => setTemperature(t => Math.max(t - 50, 50))} style={{ padding: '8px 20px', background: 'linear-gradient(135deg, #60a5fa, #3b82f6)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)' }}>Soğut (-)</button>
             </div>
          </div>
          
          <div style={{ marginTop: '30px', borderTop: '1px solid #374151', paddingTop: '20px' }}>
             <h3 style={{ color: '#d1d5db', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>Hacim (V): <strong style={{color: '#10b981', fontSize: '22px', marginLeft: '10px'}}>{volume} Birim</strong></h3>
             <input type="range" min="200" max="750" value={volume} onChange={(e) => {
               const newVol = Number(e.target.value);
               particlesRef.current.forEach(p => {
                  if (p.x > newVol - radius - 3) p.x = newVol - radius * 2 - 3;
               });
               setVolume(newVol);
             }} style={{ width: '100%', cursor: 'pointer', accentColor: '#10b981' }} />
          </div>
        </div>

        <div style={{ width: '280px', background: '#1e1e2f', padding: '25px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderLeft: '4px solid #8b5cf6' }}>
          <h3 style={{ marginBottom: '25px', color: '#d1d5db', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Basınç Ölçer (P)</h3>
          
          <div style={{ position: 'relative', width: '140px', height: '140px', borderRadius: '50%', background: 'linear-gradient(135deg, #1f2937, #111827)', border: '6px solid #4b5563', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.5), 0 5px 15px rgba(0,0,0,0.3)' }}>
            {/* Tick marks */}
            {[0, 45, 90, 135, 180].map((deg, i) => (
              <div key={i} style={{ position: 'absolute', width: '2px', height: '10px', background: '#9ca3af', top: '4px', transformOrigin: 'bottom center', transform: `rotate(${deg - 90}deg) translateY(60px)` }}></div>
            ))}
            
            <div style={{ position: 'absolute', bottom: '25px', fontSize: '20px', fontWeight: 'bold', color: '#f59e0b' }}>{pressure.toFixed(1)} atm</div>
            
            {/* Needle */}
            <div style={{ position: 'absolute', width: '4px', height: '60px', background: '#ef4444', bottom: '50%', transformOrigin: 'bottom center', transform: `rotate(${-90 + Math.min(pressure * 1.5, 180)}deg)`, borderRadius: '2px', transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 0 5px rgba(239, 68, 68, 0.5)' }}></div>
            
            <div style={{ position: 'absolute', width: '16px', height: '16px', background: '#fff', borderRadius: '50%', boxShadow: '0 2px 5px rgba(0,0,0,0.5)' }}></div>
          </div>
          
          <div style={{ marginTop: '25px', padding: '10px 20px', background: '#09090b', borderRadius: '8px', border: '1px solid #374151' }}>
            <p style={{ fontSize: '16px', color: '#9ca3af', fontWeight: 'bold', letterSpacing: '2px' }}>P = <span style={{color: 'white'}}>nRT</span> / <span style={{color: '#10b981'}}>V</span></p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', background: '#1e1e2f', padding: '25px', borderRadius: '12px', boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.5)' }}>
        <canvas 
          ref={canvasRef} 
          width={880} 
          height={canvasHeight} 
          style={{ background: '#09090b', borderRadius: '8px', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)' }} 
        />
      </div>
    </div>
  );
};

export default GazYasalari;
