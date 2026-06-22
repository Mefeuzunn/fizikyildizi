import React from 'react';

interface SimSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
}

export const SimSlider: React.FC<SimSliderProps> = ({
  label, value, min, max, step = 1, unit = '', onChange
}) => {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: '0.5rem',
      background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '8px',
      border: '1px solid rgba(255,255,255,0.05)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: '#a1a1aa', fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: '0.85rem', color: '#f4f4f5', fontFamily: 'monospace', background: 'rgba(99,102,241,0.2)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(99,102,241,0.3)' }}>
          {value.toFixed(step < 1 ? 2 : 0)} {unit}
        </span>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step} 
        value={value} 
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{
          width: '100%', cursor: 'pointer', accentColor: '#6366f1'
        }}
      />
    </div>
  );
};
