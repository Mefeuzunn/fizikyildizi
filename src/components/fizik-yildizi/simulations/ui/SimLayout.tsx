import React, { useState, useRef } from 'react';
import { Maximize, Minimize, Download, Target } from 'lucide-react';
import styles from '@/app/fizik-yildizi/fizik.module.css';

interface SimLayoutProps {
  title: string;
  children: React.ReactNode;
  controls: React.ReactNode;
  charts?: React.ReactNode;
  onExport?: () => void;
  mission?: { text: string; isCompleted: boolean };
}

export const SimLayout: React.FC<SimLayoutProps> = ({ title, children, controls, charts, onExport, mission }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`${styles.simLayoutContainer} ${isFullscreen ? styles.isFullscreen : ''}`}
      style={!isFullscreen ? { background: 'transparent' } : undefined}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: '#f4f4f5', fontWeight: 600, fontSize: '1.25rem' }}>{title}</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {onExport && (
            <button onClick={onExport} title="Laboratuvar Verisini İndir (CSV)" style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#d4d4d8', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer'
            }}>
              <Download size={18} />
            </button>
          )}
          <button onClick={toggleFullscreen} title="Tam Ekran" style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            color: '#d4d4d8', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer'
          }}>
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
        </div>
      </div>

      {mission && (
        <div style={{
          background: mission.isCompleted ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
          border: `1px solid ${mission.isCompleted ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
          padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem'
        }}>
          <Target size={24} color={mission.isCompleted ? '#10b981' : '#f59e0b'} />
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: mission.isCompleted ? '#10b981' : '#f59e0b', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {mission.isCompleted ? 'Görev Tamamlandı!' : 'Aktif Görev'}
            </div>
            <div style={{ color: '#f4f4f5', fontSize: '0.9rem', marginTop: '0.25rem' }}>{mission.text}</div>
          </div>
        </div>
      )}

      <div className={`${styles.simLayoutRow} ${isFullscreen ? styles.isFullscreen : ''}`}>
        <div className={styles.simCanvasContainer}>
          {children}
        </div>
        
        <div className={`${styles.simLayoutSidebar} ${isFullscreen ? styles.isFullscreen : ''}`}>
          <div style={{ 
            background: 'rgba(255,255,255,0.02)', border: '1px solid #27272a',
            borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem'
          }}>
            <h4 style={{ margin: 0, color: '#e4e4e7', fontSize: '0.9rem', borderBottom: '1px solid #27272a', paddingBottom: '0.5rem' }}>Kontrol Paneli</h4>
            {controls}
          </div>
          
          {charts && (
            <div style={{ 
              background: 'rgba(255,255,255,0.02)', border: '1px solid #27272a',
              borderRadius: '12px', padding: '1rem'
            }}>
              {charts}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
