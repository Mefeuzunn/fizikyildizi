import React, { useEffect, useState } from 'react';
import { Sparkles, AlertTriangle, Info } from 'lucide-react';

interface AstroTutorObserverProps {
  message: string | null;
  type?: 'info' | 'warning' | 'success';
}

export const AstroTutorObserver: React.FC<AstroTutorObserverProps> = ({ message, type = 'info' }) => {
  const [visible, setVisible] = useState(false);
  const [currentMsg, setCurrentMsg] = useState(message);

  useEffect(() => {
    if (message) {
      setCurrentMsg(message);
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 8000); // Hide after 8s
      return () => clearTimeout(t);
    }
  }, [message]);

  if (!visible || !currentMsg) return null;

  let borderColor = 'rgba(99,102,241,0.4)';
  let bg = 'rgba(17,24,39,0.8)';
  let Icon = Sparkles;
  let iconColor = '#818cf8';

  if (type === 'warning') {
    borderColor = 'rgba(245,158,11,0.4)';
    Icon = AlertTriangle;
    iconColor = '#fbbf24';
  } else if (type === 'success') {
    borderColor = 'rgba(16,185,129,0.4)';
    iconColor = '#34d399';
  }

  return (
    <div style={{
      position: 'absolute', bottom: 20, left: 20, maxWidth: '300px',
      background: bg, backdropFilter: 'blur(10px)',
      border: `1px solid ${borderColor}`, borderRadius: '12px',
      padding: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
      animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)', zIndex: 50
    }}>
      <style>{`
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      <div style={{ 
        width: '32px', height: '32px', borderRadius: '50%', 
        background: `rgba(255,255,255,0.05)`, border: `1px solid ${borderColor}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
      }}>
        <Icon size={16} color={iconColor} />
      </div>
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: iconColor, marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          AstroTutor Analizi
        </div>
        <div style={{ fontSize: '0.85rem', color: '#f3f4f6', lineHeight: 1.4 }}>
          {currentMsg}
        </div>
      </div>
    </div>
  );
};
