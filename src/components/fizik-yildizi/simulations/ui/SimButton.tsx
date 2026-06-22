import React from 'react';

interface SimButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: React.ReactNode;
}

export const SimButton: React.FC<SimButtonProps> = ({ label, onClick, variant = 'primary', icon }) => {
  let bg = 'rgba(99,102,241,0.2)';
  let border = 'rgba(99,102,241,0.4)';
  let hoverBg = 'rgba(99,102,241,0.3)';
  let color = '#818cf8';

  if (variant === 'secondary') {
    bg = 'rgba(255,255,255,0.05)';
    border = 'rgba(255,255,255,0.1)';
    hoverBg = 'rgba(255,255,255,0.1)';
    color = '#d4d4d8';
  } else if (variant === 'danger') {
    bg = 'rgba(244,63,94,0.15)';
    border = 'rgba(244,63,94,0.3)';
    hoverBg = 'rgba(244,63,94,0.25)';
    color = '#fb7185';
  }

  return (
    <button 
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
        padding: '0.6rem 1rem', borderRadius: '8px', cursor: 'pointer',
        background: bg, border: `1px solid ${border}`, color: color,
        fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s',
        width: '100%'
      }}
      onMouseOver={(e) => (e.currentTarget.style.background = hoverBg)}
      onMouseOut={(e) => (e.currentTarget.style.background = bg)}
    >
      {icon}
      {label}
    </button>
  );
};
