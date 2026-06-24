'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, FileText, Lock } from 'lucide-react';
import styles from '../fizik.module.css'; // Assuming this has generic styles
import Link from 'next/link';

// Placeholder styles for this page - should be moved to css module
const derslerStyles = {
  container: { padding: '20px', paddingBottom: '100px' },
  title: { fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#fff' },
  list: { display: 'flex', flexDirection: 'column' as const, gap: '15px' },
  card: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '15px', border: '1px solid rgba(255,255,255,0.1)' },
  cardTitle: { fontSize: '18px', fontWeight: '600', color: '#fff', marginBottom: '8px' },
  cardDesc: { fontSize: '14px', color: '#aaa', marginBottom: '12px' },
  btnRow: { display: 'flex', gap: '10px' },
  btn: { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', borderRadius: '8px', backgroundColor: '#3b82f6', color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: '500' },
  btnLocked: { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#888', cursor: 'not-allowed', fontSize: '14px', fontWeight: '500' }
};

export default function DerslerPage() {
  const dersler = [
    { id: 1, title: 'Hareket ve Kuvvet', desc: 'Newton yasaları ve atış hareketleri konu anlatımı', type: 'video', isPremium: false },
    { id: 2, title: 'İş, Güç ve Enerji', desc: 'Kinetik ve potansiyel enerji korunumu problemleri', type: 'text', isPremium: false },
    { id: 3, title: 'Elektrik ve Manyetizma', desc: 'Elektrik devreleri ve manyetik alan etkileri', type: 'video', isPremium: true },
    { id: 4, title: 'Modern Fizik', desc: 'Kuantum fiziğine giriş ve fotoelektrik olay', type: 'video', isPremium: true },
  ];

  return (
    <div style={derslerStyles.container}>
      <h1 style={derslerStyles.title}>Dersler & Videolar</h1>
      
      <div style={derslerStyles.list}>
        {dersler.map(ders => (
          <motion.div 
            key={ders.id}
            style={derslerStyles.card}
            whileTap={{ scale: 0.98 }}
          >
            <div style={derslerStyles.cardTitle}>{ders.title}</div>
            <div style={derslerStyles.cardDesc}>{ders.desc}</div>
            <div style={derslerStyles.btnRow}>
              {ders.isPremium ? (
                <div style={derslerStyles.btnLocked}>
                  <Lock size={16} /> Premium
                </div>
              ) : (
                <Link href="#" style={derslerStyles.btn}>
                  {ders.type === 'video' ? <PlayCircle size={16} /> : <FileText size={16} />}
                  {ders.type === 'video' ? 'Videoyu İzle' : 'Dersi Oku'}
                </Link>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
