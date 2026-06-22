'use client';

import React, { useState } from 'react';
import { Eye, ChevronRight, PlayCircle, BrainCircuit } from 'lucide-react';

export interface StepByStepProps {
  steps: React.ReactNode[];
}

export const StepByStep: React.FC<StepByStepProps> = ({ steps }) => {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1rem', margin: '1.5rem 0' }}>
      <div style={{ color: '#fbbf24', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Eye size={16} /> Adım Adım Çözüm
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {steps.map((step, index) => (
          <div 
            key={index} 
            style={{ 
              opacity: index <= currentStep ? 1 : 0.3,
              filter: index <= currentStep ? 'none' : 'blur(4px)',
              pointerEvents: index <= currentStep ? 'auto' : 'none',
              transition: 'all 0.4s ease',
              borderLeft: index <= currentStep ? '3px solid #6366f1' : '3px solid transparent',
              paddingLeft: '1rem'
            }}
          >
            {step}
          </div>
        ))}
      </div>

      {currentStep < steps.length - 1 && (
        <button 
          onClick={() => setCurrentStep(prev => prev + 1)}
          style={{ 
            marginTop: '1.5rem', width: '100%', padding: '0.75rem', 
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', 
            borderRadius: '8px', color: '#818cf8', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            fontWeight: 500
          }}
        >
          Sonraki Adımı Gör <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
};

export interface AIParagrafProps {
  children: React.ReactNode;
  contextData: string;
  onAskTutor: (context: string) => void;
}

export const AIParagraf: React.FC<AIParagrafProps> = ({ children, contextData, onAskTutor }) => {
  return (
    <div style={{ position: 'relative', margin: '1.5rem 0', padding: '1rem', background: 'rgba(99,102,241,0.03)', borderRadius: '8px', borderLeft: '4px solid #4f46e5' }}>
      <div style={{ color: '#e4e4e7', lineHeight: 1.7 }}>
        {children}
      </div>
      <button 
        onClick={() => onAskTutor(contextData)}
        style={{
          position: 'absolute', top: -12, right: 16,
          background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '20px',
          padding: '0.3rem 0.8rem', fontSize: '0.75rem', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(79,70,229,0.4)'
        }}
      >
        <BrainCircuit size={12} /> AstroTutor'a Sor
      </button>
    </div>
  );
};

export interface VideoPlayerProps {
  youtubeId: string;
  title: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ youtubeId, title }) => {
  return (
    <div style={{ margin: '2rem 0', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: '#000' }}>
      <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e4e4e7', fontSize: '0.9rem', fontWeight: 500 }}>
        <PlayCircle size={18} color="#ef4444" /> {title}
      </div>
      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
        <iframe 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          src={`https://www.youtube.com/embed/${youtubeId}?rel=0`} 
          title={title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
        />
      </div>
    </div>
  );
};
