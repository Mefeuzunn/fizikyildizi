const fs = require('fs');
const file = 'src/components/fizik-yildizi/simulations/SerbrestDusme.tsx';
let content = fs.readFileSync(file, 'utf8');

// We will inject imports for SimUI and recharts
const importsToAdd = `
import { SimSlider, SimToggle, SimButton, SimLayout } from './ui';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
`;
content = content.replace("import { useRef, useEffect, useState, useCallback } from 'react';", "import { useRef, useEffect, useState, useCallback } from 'react';" + importsToAdd);

// Also we need to collect chartData in state to render.
// Since draw() updates display, we can also update chartData there, but it's 60fps, we don't want to re-render charts 60fps.
// Actually, doing it every 10 frames or so is better.
const chartStateAdd = `
  const [chartData, setChartData] = useState<{t: number, v: number, y: number}[]>([]);
  const chartUpdateCounter = useRef(0);
`;
content = content.replace("const [hit, setHit] = useState(false);", "const [hit, setHit] = useState(false);" + chartStateAdd);

// Inside handleReset
content = content.replace("setHit(false);", "setHit(false);\n    setChartData([]);\n    chartUpdateCounter.current = 0;");

// Inside draw()
const drawUpdateAdd = `
      setDisplay({
        v: st.v,
        t: st.t,
        dist: st.y,
        ke,
        acc: st.acc,
        netForce: Fnet,
        dragForce: Fdrag,
        terminalV: v_term
      });
      
      chartUpdateCounter.current++;
      if (chartUpdateCounter.current % 5 === 0) {
         setChartData(prev => [...prev, { t: Number(st.t.toFixed(2)), v: Number(st.v.toFixed(2)), y: Number(st.y.toFixed(2)) }]);
      }
`;
content = content.replace(/setDisplay\(\{[\s\S]*?terminalV\s*\}\);/, drawUpdateAdd);

// Replace the return block
const newReturn = `
  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Zaman(s),Hiz(m/s),Mesafe(m)\\n"
        + chartData.map(e => \`\${e.t},\${e.v},\${e.y}\`).join("\\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "serbest_dusme_raporu.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const controls = (
    <>
      <SimSlider label="Yükseklik" value={height} min={10} max={100} step={1} unit="m" onChange={(val) => { handleReset(); setHeight(val); }} />
      <SimToggle label="Hava Direnci" checked={airResistance} onChange={(val) => { handleReset(); setAirResistance(val); }} />
      {airResistance && (
        <div style={{ paddingLeft: '1rem', borderLeft: '2px solid #3f3f46', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <SimSlider label="Kütle (m)" value={mass} min={0.2} max={10} step={0.1} unit="kg" onChange={(val) => { handleReset(); setMass(val); }} />
          <SimSlider label="Kesit (A)" value={area} min={0.05} max={1} step={0.05} unit="m²" onChange={(val) => { handleReset(); setArea(val); }} />
          <SimSlider label="Direnç (k)" value={dragCoeff} min={0.05} max={0.5} step={0.01} onChange={(val) => { handleReset(); setDragCoeff(val); }} />
        </div>
      )}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <SimButton label={running ? 'Duraklat' : hit ? 'Tekrar' : 'Başlat'} onClick={handleStart} variant="primary" />
        <SimButton label="Sıfırla" onClick={handleReset} variant="secondary" />
      </div>
    </>
  );

  const charts = (
    <div style={{ height: '200px' }}>
      <h4 style={{ margin: '0 0 1rem 0', color: '#a1a1aa', fontSize: '0.85rem' }}>Hız - Zaman Grafiği</h4>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis dataKey="t" stroke="#a1a1aa" fontSize={12} tickFormatter={(val) => val + 's'} />
          <YAxis stroke="#a1a1aa" fontSize={12} tickFormatter={(val) => val + 'm/s'} />
          <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }} />
          <Line type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <SimLayout 
      title="Serbest Düşme Laboratuvarı"
      controls={controls}
      charts={charts}
      onExport={handleExport}
      mission={{ text: 'Hava direnci varken, 100m yükseklikten atılan cismin limit hızını bul ve raporu indir.', isCompleted: airResistance && hit && height === 100 }}
    >
       <canvas
         ref={canvasRef}
         width={CANVAS_W}
         height={CANVAS_H}
         style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }}
       />
       {/* Overlay Display */}
       <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,0.6)', padding: '1rem', borderRadius: '12px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div>Hız: <span style={{color: '#6366f1', fontFamily: 'monospace'}}>{display.v.toFixed(2)} m/s</span></div>
          <div>Mesafe: <span style={{color: '#10b981', fontFamily: 'monospace'}}>{display.dist.toFixed(2)} m</span></div>
          <div>Kinetik Enerji: <span style={{color: '#f59e0b', fontFamily: 'monospace'}}>{display.ke.toFixed(0)} J</span></div>
          {airResistance && <div>Limit Hız: <span style={{color: '#ec4899', fontFamily: 'monospace'}}>{display.terminalV.toFixed(2)} m/s</span></div>}
       </div>
    </SimLayout>
  );
`;

content = content.replace(/return \([\s\S]*?\);\n\}/m, newReturn + '\n}');

fs.writeFileSync(file, content);
