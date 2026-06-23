const fs = require('fs');
const file = 'src/components/fizik-yildizi/simulations/AtisHareketi.tsx';
let content = fs.readFileSync(file, 'utf8');

const importsToAdd = `
import { SimSlider, SimToggle, SimButton, SimLayout } from './ui';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
`;
content = content.replace("import { useRef, useEffect, useState } from 'react';", "import { useRef, useEffect, useState } from 'react';" + importsToAdd);

const chartStateAdd = `
  const [chartData, setChartData] = useState<{t: number, x: number, y: number}[]>([]);
  const chartUpdateCounter = useRef(0);
`;
content = content.replace("const [hit, setHit] = useState(false);", "const [hit, setHit] = useState(false);" + chartStateAdd);

content = content.replace("setHit(false);", "setHit(false);\n    setChartData([]);\n    chartUpdateCounter.current = 0;");

const drawUpdateAdd = `
      setDisplay({
        vx: st.vx,
        vy: st.vy,
        t: st.t,
        distX: st.x,
        distY: st.y,
        ke,
        acc: st.acc,
        netForceY: FnetY,
        netForceX: FnetX,
        dragForceY: FdragY,
        dragForceX: FdragX
      });
      
      chartUpdateCounter.current++;
      if (chartUpdateCounter.current % 5 === 0) {
         setChartData(prev => [...prev, { t: Number(st.t.toFixed(2)), x: Number(st.x.toFixed(2)), y: Number(st.y.toFixed(2)) }]);
      }
`;
content = content.replace(/setDisplay\(\{[\s\S]*?dragForceX: FdragX\s*\}\);/, drawUpdateAdd);

const newReturn = `
  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Zaman(s),Menzil X(m),Yukseklik Y(m)\\n"
        + chartData.map(e => \`\${e.t},\${e.x},\${e.y}\`).join("\\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "egik_atis_raporu.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const controls = (
    <>
      <SimSlider label="Atış Hızı" value={velocity} min={5} max={80} step={1} unit="m/s" onChange={(val) => { handleReset(); setVelocity(val); }} />
      <SimSlider label="Açı" value={angle} min={0} max={90} step={1} unit="°" onChange={(val) => { handleReset(); setAngle(val); }} />
      <SimSlider label="Başlangıç Yüksekliği" value={height} min={0} max={100} step={1} unit="m" onChange={(val) => { handleReset(); setHeight(val); }} />
      <SimToggle label="Hava Direnci" checked={airResistance} onChange={(val) => { handleReset(); setAirResistance(val); }} />
      {airResistance && (
        <div style={{ paddingLeft: '1rem', borderLeft: '2px solid #3f3f46', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <SimSlider label="Kütle (m)" value={mass} min={0.2} max={10} step={0.1} unit="kg" onChange={(val) => { handleReset(); setMass(val); }} />
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
      <h4 style={{ margin: '0 0 1rem 0', color: '#a1a1aa', fontSize: '0.85rem' }}>Yörünge (Yükseklik vs Menzil)</h4>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis dataKey="x" stroke="#a1a1aa" fontSize={12} tickFormatter={(val) => val + 'm'} />
          <YAxis stroke="#a1a1aa" fontSize={12} tickFormatter={(val) => val + 'm'} />
          <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }} />
          <Line type="monotone" dataKey="y" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <SimLayout 
      title="Eğik Atış Laboratuvarı"
      controls={controls}
      charts={charts}
      onExport={handleExport}
      mission={{ text: 'Maksimum menzile ulaşmak için sürtünmesiz ortamda doğru açıyı bul (İpucu: 45°).', isCompleted: !airResistance && hit && angle === 45 }}
    >
       <canvas
         ref={canvasRef}
         width={CANVAS_W}
         height={CANVAS_H}
         style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }}
       />
       {/* Overlay Display */}
       <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,0.6)', padding: '1rem', borderRadius: '12px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div>Hız X: <span style={{color: '#6366f1', fontFamily: 'monospace'}}>{display.vx.toFixed(2)} m/s</span></div>
          <div>Hız Y: <span style={{color: '#8b5cf6', fontFamily: 'monospace'}}>{display.vy.toFixed(2)} m/s</span></div>
          <div>Menzil X: <span style={{color: '#10b981', fontFamily: 'monospace'}}>{display.distX.toFixed(2)} m</span></div>
          <div>Yükseklik Y: <span style={{color: '#f59e0b', fontFamily: 'monospace'}}>{display.distY.toFixed(2)} m</span></div>
       </div>
    </SimLayout>
  );
`;

content = content.replace(/return \([\s\S]*?\);\n\}/m, newReturn + '\n}');

fs.writeFileSync(file, content);
