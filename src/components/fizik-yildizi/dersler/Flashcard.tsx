'use client';

import React, { useState } from 'react';
import { RotateCw, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export interface FlashcardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  onDifficultySelect?: (difficulty: 'hard' | 'medium' | 'easy') => void;
}

export const Flashcard: React.FC<FlashcardProps> = ({ front, back, onDifficultySelect }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleDifficulty = (e: React.MouseEvent, diff: 'hard' | 'medium' | 'easy') => {
    e.stopPropagation();
    if (onDifficultySelect) {
      onDifficultySelect(diff);
    }
  };

  return (
    <div style={{ perspective: '1000px', width: '100%', maxWidth: '400px', margin: '0 auto' }}>
      <div 
        onClick={handleFlip}
        style={{
          width: '100%',
          height: '250px',
          position: 'relative',
          transition: 'transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          cursor: 'pointer'
        }}
      >
        {/* Front Face */}
        <div style={{
          position: 'absolute', width: '100%', height: '100%',
          backfaceVisibility: 'hidden',
          background: 'linear-gradient(135deg, rgba(30,41,59,0.9), rgba(17,24,39,0.9))',
          border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: '16px',
          padding: '1.5rem',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
        }}>
          <div style={{ color: '#e4e4e7', fontSize: '1.25rem', textAlign: 'center', lineHeight: 1.5 }}>
            {front}
          </div>
          <div style={{ position: 'absolute', bottom: 16, color: '#6366f1', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            <RotateCw size={14} /> Cevabı görmek için dokun
          </div>
        </div>

        {/* Back Face */}
        <div style={{
          position: 'absolute', width: '100%', height: '100%',
          backfaceVisibility: 'hidden',
          background: 'linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.9))',
          border: '1px solid rgba(16,185,129,0.3)',
          borderRadius: '16px',
          padding: '1.5rem',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          transform: 'rotateY(180deg)',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
        }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontSize: '1.15rem', textAlign: 'center', lineHeight: 1.5, width: '100%' }}>
            {back}
          </div>
          
          <div style={{ width: '100%', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem', marginTop: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', textAlign: 'center', marginBottom: '0.5rem' }}>
              Hatırlamak ne kadar zordu?
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={(e) => handleDifficulty(e, 'hard')} style={{ flex: 1, padding: '0.5rem', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: '6px', color: '#f43f5e', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', cursor: 'pointer' }}>
                <AlertTriangle size={14} /> Zor (1dk)
              </button>
              <button onClick={(e) => handleDifficulty(e, 'medium')} style={{ flex: 1, padding: '0.5rem', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '6px', color: '#fbbf24', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', cursor: 'pointer' }}>
                <Clock size={14} /> Orta (10dk)
              </button>
              <button onClick={(e) => handleDifficulty(e, 'easy')} style={{ flex: 1, padding: '0.5rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '6px', color: '#34d399', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', cursor: 'pointer' }}>
                <CheckCircle2 size={14} /> Kolay (4g)
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
