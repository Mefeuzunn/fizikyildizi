const fs = require('fs');
const path = require('path');

const dir = 'src/components/fizik-yildizi/simulations';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const p = path.join(dir, file);
  let content = fs.readFileSync(p, 'utf8');
  
  // Fix useRef<number>()
  content = content.replace(/useRef<number>\(\)/g, 'useRef<number | null>(null)');
  
  // Fix lastTimeRef.current = undefined
  content = content.replace(/lastTimeRef\.current = undefined;/g, 'lastTimeRef.current = null;');

  fs.writeFileSync(p, content);
}
