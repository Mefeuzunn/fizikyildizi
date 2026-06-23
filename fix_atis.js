const fs = require('fs');
const file = 'src/components/fizik-yildizi/simulations/AtisHareketi.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add chartData state after launched state
content = content.replace("const [launched, setLaunched] = useState(false);", "const [launched, setLaunched] = useState(false);\n  const [chartData, setChartData] = useState<{t: number, x: number, y: number}[]>([]);\n  const chartUpdateCounter = useRef(0);");

// Fix references in the JSX
content = content.replace(/value=\{velocity\}/g, "value={v0}");
content = content.replace(/setVelocity/g, "setV0");
content = content.replace(/value=\{angle\}/g, "value={angleDeg}");
content = content.replace(/setAngle/g, "setAngleDeg");
content = content.replace(/hit \? 'Tekrar'/g, "launched ? 'Tekrar'");
content = content.replace(/hit && angle === 45/g, "launched && angleDeg === 45");

// Fix airResistance (it wasn't in the state)
// Let's add it if missing
if (!content.includes("const [airResistance, setAirResistance] = useState")) {
  content = content.replace("const [height, setHeight] = useState(initialParams?.height ?? 30);", "const [height, setHeight] = useState(initialParams?.height ?? 30);\n  const [airResistance, setAirResistance] = useState(false);\n  const [mass, setMass] = useState(1);");
}

fs.writeFileSync(file, content);
