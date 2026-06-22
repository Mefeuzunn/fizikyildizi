import React from 'react';
import { Play, Pause, FastForward, StepForward } from 'lucide-react';

interface SimTimeControllerProps {
  timeScale: number;
  setTimeScale: (scale: number) => void;
  onStepForward: () => void;
  disabled?: boolean;
}

export const SimTimeController: React.FC<SimTimeControllerProps> = ({ timeScale, setTimeScale, onStepForward, disabled }) => {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: '0.5rem',
      background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '8px',
      border: '1px solid rgba(255,255,255,0.05)', opacity: disabled ? 0.5 : 1,
      pointerEvents: disabled ? 'none' : 'auto'
    }}>
      <span style={{ fontSize: '0.85rem', color: '#a1a1aa', fontWeight: 500 }}>Zaman Kontrolü</span>
      <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
        <button onClick={() => setTimeScale(0.25)} style={{ flex: 1, padding: '0.4rem', background: timeScale === 0.25 ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.05)', border: `1px solid ${timeScale === 0.25 ? '#6366f1' : 'transparent'}`, borderRadius: '6px', color: timeScale === 0.25 ? '#818cf8' : '#a1a1aa', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>0.25x</button>
        <button onClick={() => setTimeScale(0.5)} style={{ flex: 1, padding: '0.4rem', background: timeScale === 0.5 ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.05)', border: `1px solid ${timeScale === 0.5 ? '#6366f1' : 'transparent'}`, borderRadius: '6px', color: timeScale === 0.5 ? '#818cf8' : '#a1a1aa', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>0.5x</button>
        <button onClick={() => setTimeScale(1)} style={{ flex: 1, padding: '0.4rem', background: timeScale === 1 ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.05)', border: `1px solid ${timeScale === 1 ? '#6366f1' : 'transparent'}`, borderRadius: '6px', color: timeScale === 1 ? '#818cf8' : '#a1a1aa', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>1x</button>
        <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)', margin: '0 0.25rem' }} />
        <button onClick={onStepForward} title="Kare Kare İleri (+0.05s)" style={{ padding: '0.4rem', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '6px', color: '#34d399', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <StepForward size={14} />
        </button>
      </div>
    </div>
  );
};
