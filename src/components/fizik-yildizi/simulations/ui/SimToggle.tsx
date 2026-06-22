import React from 'react';

interface SimToggleProps {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}

export const SimToggle: React.FC<SimToggleProps> = ({ label, checked, onChange }) => {
  return (
    <label style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '8px',
      border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer'
    }}>
      <span style={{ fontSize: '0.85rem', color: '#a1a1aa', fontWeight: 500 }}>{label}</span>
      <div style={{
        width: '36px', height: '20px', borderRadius: '10px',
        background: checked ? '#6366f1' : 'rgba(255,255,255,0.1)',
        position: 'relative', transition: 'background 0.2s'
      }}>
        <div style={{
          position: 'absolute', top: '2px', left: checked ? '18px' : '2px',
          width: '16px', height: '16px', borderRadius: '50%', background: '#fff',
          transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
        }} />
      </div>
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={(e) => onChange(e.target.checked)} 
        style={{ display: 'none' }} 
      />
    </label>
  );
};
