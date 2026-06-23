const fs = require('fs');
const file = 'src/components/fizik-yildizi/simulations/CarpismaLaboratuvari.tsx';
let content = fs.readFileSync(file, 'utf8');

const replacement = `  const updatePhysics = (time: number) => {
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
  };`;

content = content.replace(/const updatePhysics = \(time: number\) => \{[\s\S]*?if \(isPlaying\) \{\s*requestRef.current = requestAnimationFrame\(updatePhysics\);\s*\}\s*\};/m, replacement);
fs.writeFileSync(file, content);
