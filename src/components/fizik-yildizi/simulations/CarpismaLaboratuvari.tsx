import React, { useState, useEffect, useRef } from 'react';

const CarpismaLaboratuvari: React.FC = () => {
  const [m1, setM1] = useState(2);
  const [v1Init, setV1Init] = useState(3);
  const [m2, setM2] = useState(2);
  const [v2Init, setV2Init] = useState(-2);
  const [isElastic, setIsElastic] = useState(true);
  
  const [x1, setX1] = useState(100);
  const [x2, setX2] = useState(500);
  const [v1, setV1] = useState(3);
  const [v2, setV2] = useState(-2);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasCollided, setHasCollided] = useState(false);

  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const blockWidth = 60;
  const trackWidth = 800;

  const reset = () => {
    setIsPlaying(false);
    setHasCollided(false);
    setX1(100);
    setX2(500);
    setV1(v1Init);
    setV2(v2Init);
  };

    const updatePhysics = (time: number) => {
    if (lastTimeRef.current != null) {
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.05);
      const speedScale = 50;
      
      let curV1 = 0; let curV2 = 0;
      setV1(v => { curV1 = v; return v; });
      setV2(v => { curV2 = v; return v; });

      setX1((prevX1) => {
        let nX1 = prevX1;
        setX2((prevX2) => {
          let nextX1 = prevX1 + curV1 * speedScale * dt;
          let nextX2 = prevX2 + curV2 * speedScale * dt;
          let nextV1 = curV1;
          let nextV2 = curV2;

          setHasCollided(collided => {
            if (!collided && nextX1 + blockWidth >= nextX2) {
              if (isElastic) {
                nextV1 = ((m1 - m2) * curV1 + 2 * m2 * curV2) / (m1 + m2);
                nextV2 = ((m2 - m1) * curV2 + 2 * m1 * curV1) / (m1 + m2);
              } else {
                const finalV = (m1 * curV1 + m2 * curV2) / (m1 + m2);
                nextV1 = finalV;
                nextV2 = finalV;
              }
              nextX1 = nextX2 - blockWidth;
              return true;
            }
            return collided;
          });

          if (nextX1 < 0) { nextX1 = 0; nextV1 = -nextV1; }
          if (nextX2 > trackWidth - blockWidth) { nextX2 = trackWidth - blockWidth; nextV2 = -nextV2; }

          setV1(nextV1);
          setV2(nextV2);
          
          nX1 = nextX1;
          return nextX2;
        });
        return nX1;
      });
    }
    lastTimeRef.current = time;
    if (isPlaying) {
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
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, m1, m2, isElastic]);

  const p1 = m1 * v1;
  const p2 = m2 * v2;
  const pTotal = p1 + p2;
  const ke1 = 0.5 * m1 * v1 * v1;
  const ke2 = 0.5 * m2 * v2 * v2;
  const keTotal = ke1 + ke2;

  return (
    <div style={{ padding: '30px', background: '#09090b', color: 'white', borderRadius: '16px', fontFamily: 'sans-serif', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px' }}>Çarpışma Laboratuvarı <span style={{color: '#8b5cf6'}}>(Momentum)</span></h2>
      
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '25px', gap: '20px' }}>
        <div style={{ background: '#1e1e2f', padding: '20px', borderRadius: '12px', flex: 1, borderTop: '4px solid #ef4444' }}>
          <h3 style={{ color: '#ef4444', marginBottom: '15px', fontWeight: '600' }}>Kırmızı Blok (Sol)</h3>
          <label style={{ display: 'block', fontSize: '14px', color: '#d1d5db' }}>Kütle (m1): <strong style={{color: 'white'}}>{m1} kg</strong>
            <input type="range" min="1" max="10" value={m1} onChange={e => setM1(Number(e.target.value))} style={{ width: '100%', marginTop: '8px' }} disabled={isPlaying} />
          </label>
          <label style={{ display: 'block', marginTop: '15px', fontSize: '14px', color: '#d1d5db' }}>İlk Hız (v1): <strong style={{color: 'white'}}>{v1Init} m/s</strong>
            <input type="range" min="-10" max="10" value={v1Init} onChange={e => {setV1Init(Number(e.target.value)); setV1(Number(e.target.value));}} style={{ width: '100%', marginTop: '8px' }} disabled={isPlaying} />
          </label>
        </div>

        <div style={{ background: '#1e1e2f', padding: '20px', borderRadius: '12px', flex: 1, borderTop: '4px solid #3b82f6' }}>
          <h3 style={{ color: '#3b82f6', marginBottom: '15px', fontWeight: '600' }}>Mavi Blok (Sağ)</h3>
          <label style={{ display: 'block', fontSize: '14px', color: '#d1d5db' }}>Kütle (m2): <strong style={{color: 'white'}}>{m2} kg</strong>
            <input type="range" min="1" max="10" value={m2} onChange={e => setM2(Number(e.target.value))} style={{ width: '100%', marginTop: '8px' }} disabled={isPlaying} />
          </label>
          <label style={{ display: 'block', marginTop: '15px', fontSize: '14px', color: '#d1d5db' }}>İlk Hız (v2): <strong style={{color: 'white'}}>{v2Init} m/s</strong>
            <input type="range" min="-10" max="10" value={v2Init} onChange={e => {setV2Init(Number(e.target.value)); setV2(Number(e.target.value));}} style={{ width: '100%', marginTop: '8px' }} disabled={isPlaying} />
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '35px' }}>
        <button onClick={() => setIsElastic(true)} style={{ padding: '12px 24px', background: isElastic ? '#10b981' : '#374151', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: isElastic ? 'bold' : 'normal', transition: 'all 0.2s' }}>Esnek Çarpışma</button>
        <button onClick={() => setIsElastic(false)} style={{ padding: '12px 24px', background: !isElastic ? '#10b981' : '#374151', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: !isElastic ? 'bold' : 'normal', transition: 'all 0.2s' }}>Esnek Olmayan</button>
        <div style={{ width: '2px', background: '#374151', margin: '0 10px' }}></div>
        <button onClick={() => setIsPlaying(!isPlaying)} style={{ padding: '12px 30px', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)', transition: 'all 0.2s' }}>{isPlaying ? 'Duraklat' : 'Başlat'}</button>
        <button onClick={reset} style={{ padding: '12px 24px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }}>Sıfırla</button>
      </div>

      {/* Simulation Area */}
      <div style={{ position: 'relative', width: '800px', height: '160px', background: '#1e1e2f', margin: '0 auto', borderRadius: '12px', overflow: 'hidden', borderBottom: '6px solid #4b5563', boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.5)' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '100%', background: 'linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '50px 100%' }}></div>
        <div style={{ position: 'absolute', left: x1, bottom: 0, width: blockWidth, height: blockWidth, background: 'linear-gradient(135deg, #f87171, #ef4444)', borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px', boxShadow: '2px -2px 10px rgba(239,68,68,0.3), inset 0 2px 5px rgba(255,255,255,0.3)' }}>m1</div>
        <div style={{ position: 'absolute', left: x2, bottom: 0, width: blockWidth, height: blockWidth, background: 'linear-gradient(135deg, #60a5fa, #3b82f6)', borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px', boxShadow: '-2px -2px 10px rgba(59,130,246,0.3), inset 0 2px 5px rgba(255,255,255,0.3)' }}>m2</div>
      </div>

      {/* Charts Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '35px', gap: '20px' }}>
        <div style={{ flex: 1, background: '#1e1e2f', padding: '20px', borderRadius: '12px' }}>
          <h4 style={{ color: '#9ca3af', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px', marginBottom: '10px' }}>Momentum (p = m*v)</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '14px' }}>
             <span>Sol: {p1.toFixed(1)}</span>
             <span>Sağ: {p2.toFixed(1)}</span>
          </div>
          <p style={{ fontWeight: 'bold', color: '#10b981', fontSize: '18px' }}>Toplam: {pTotal.toFixed(1)} kg·m/s</p>
          <div style={{ height: '24px', background: '#09090b', borderRadius: '12px', overflow: 'hidden', marginTop: '15px', position: 'relative', border: '1px solid #374151' }}>
             <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', background: '#6b7280', zIndex: 10 }}></div>
             <div style={{ height: '100%', width: `${Math.min(100, Math.abs(pTotal)*2)}%`, background: pTotal >= 0 ? '#10b981' : '#ef4444', marginLeft: pTotal >= 0 ? '50%' : `calc(50% - ${Math.min(50, Math.abs(pTotal)*2)}%)`, transition: 'all 0.1s ease-out' }}></div>
          </div>
        </div>
        <div style={{ flex: 1, background: '#1e1e2f', padding: '20px', borderRadius: '12px' }}>
          <h4 style={{ color: '#9ca3af', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px', marginBottom: '10px' }}>Kinetik Enerji (KE = 1/2*m*v²)</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '14px' }}>
             <span>Sol: {ke1.toFixed(1)}</span>
             <span>Sağ: {ke2.toFixed(1)}</span>
          </div>
          <p style={{ fontWeight: 'bold', color: '#f59e0b', fontSize: '18px' }}>Toplam: {keTotal.toFixed(1)} J</p>
          <div style={{ height: '24px', background: '#09090b', borderRadius: '12px', overflow: 'hidden', marginTop: '15px', border: '1px solid #374151' }}>
             <div style={{ height: '100%', width: `${Math.min(100, keTotal/2)}%`, background: 'linear-gradient(90deg, #f59e0b, #fbbf24)', transition: 'all 0.1s ease-out' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarpismaLaboratuvari;
