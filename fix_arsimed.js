const fs = require('fs');
const file = 'src/components/fizik-yildizi/simulations/ArsimedKuvveti.tsx';
let content = fs.readFileSync(file, 'utf8');

const updatePhysicsReplacement = `  const updatePhysics = (time: number) => {
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
  };`;

// replace from `  const updatePhysics = (time: number) => {` up to `    lastTimeRef.current = time;\n    if (isPlaying) requestRef.current = requestAnimationFrame(updatePhysics);\n  };`
// Wait, we can just replace the whole function using regex
content = content.replace(/const updatePhysics = \(time: number\) => \{[\s\S]*?requestAnimationFrame\(updatePhysics\);\s*\}\s*;/m, updatePhysicsReplacement);
fs.writeFileSync(file, content);
