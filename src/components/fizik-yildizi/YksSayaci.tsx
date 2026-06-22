'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/app/fizik-yildizi/fizik.module.css';

export default function YksSayaci() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Target: YKS 2027 (Haziran ortası - Örn: 19 Haziran 2027 10:15:00)
    const targetDate = new Date('2027-06-19T10:15:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      background: 'linear-gradient(to right, rgba(99, 102, 241, 0.1), rgba(16, 185, 129, 0.1))',
      border: '1px solid rgba(99, 102, 241, 0.2)',
      borderRadius: '16px',
      padding: '1.5rem',
      marginBottom: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '1.5rem' }}>🎓</span>
        <h3 style={{ margin: 0, color: '#f4f4f5', fontWeight: 700, fontSize: '1.25rem' }}>YKS 2027 Sayacı</h3>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', width: '100%' }}>
        {[
          { label: 'Gün', value: timeLeft.days, color: '#6366f1' },
          { label: 'Saat', value: timeLeft.hours, color: '#10b981' },
          { label: 'Dakika', value: timeLeft.minutes, color: '#f59e0b' },
          { label: 'Saniye', value: timeLeft.seconds, color: '#f43f5e' }
        ].map((item, idx) => (
          <div key={idx} style={{
            background: '#18181b',
            border: `1px solid ${item.color}40`,
            borderRadius: '12px',
            padding: '1rem',
            minWidth: '80px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: `0 0 15px ${item.color}15`
          }}>
            <span style={{ 
              fontSize: '2rem', 
              fontWeight: 800, 
              color: item.color,
              fontFamily: 'monospace',
              lineHeight: 1
            }}>
              {item.value.toString().padStart(2, '0')}
            </span>
            <span style={{ 
              fontSize: '0.75rem', 
              color: '#a1a1aa', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              marginTop: '0.5rem'
            }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
