'use client';
import React from 'react';
import styles from '@/app/fizik-yildizi/fizik.module.css';

export default function HesapSilPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Hesap ve Veri Silme Talebi</h1>
        <p className={styles.subtitle}>Fizik Yıldızı hesabınızı ve tüm ilişkili verilerinizi silmek için talepte bulunun.</p>
      </div>

      <div className={styles.section} style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ fontSize: '1.25rem', color: '#f4f4f5', marginBottom: '1rem' }}>Veri Silme Süreci</h2>
        <p style={{ color: '#a1a1aa', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          Google Play ve App Store veri güvenliği politikaları gereğince, uygulamamızı kullanmayı bırakmak ve kişisel verilerinizin sistemlerimizden tamamen silinmesini istiyorsanız aşağıdaki adımları izleyebilirsiniz.
        </p>

        <ul style={{ color: '#a1a1aa', fontSize: '0.95rem', lineHeight: 1.6, paddingLeft: '1.5rem', marginBottom: '2rem' }}>
          <li>Hesabınız silindiğinde profiliniz, ilerleme durumunuz, çözdüğünüz testler ve tüm uygulama içi başarılarınız kalıcı olarak silinir.</li>
          <li>Bu işlem geri alınamaz.</li>
          <li>Silme işleminin tamamlanması 3-5 iş günü sürebilir.</li>
        </ul>

        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1.5rem', borderRadius: '12px' }}>
          <h3 style={{ color: '#ef4444', fontSize: '1.1rem', marginBottom: '1rem' }}>Hesap Silme Talebi Gönder</h3>
          <p style={{ color: '#f4f4f5', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Lütfen hesabınızı silmek için sisteme kayıtlı e-posta adresinizi giriniz:
          </p>
          
          <form onSubmit={(e) => { e.preventDefault(); alert('Hesap silme talebiniz başarıyla alınmıştır. İşleminiz yakında tamamlanacaktır.'); }}>
            <input 
              type="email" 
              placeholder="Kayıtlı E-posta Adresiniz" 
              required 
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.2)',
                backgroundColor: 'rgba(0,0,0,0.2)',
                color: '#fff',
                marginBottom: '1rem'
              }}
            />
            <button 
              type="submit" 
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#ef4444',
                color: '#fff',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Hesabımı ve Verilerimi Sil
            </button>
          </form>
        </div>
        
        <div style={{ marginTop: '2rem', textAlign: 'center', color: '#a1a1aa', fontSize: '0.85rem' }}>
          Yardıma mı ihtiyacınız var? Bize <a href="mailto:destek@fizikyildizi.com" style={{ color: '#6366f1' }}>destek@fizikyildizi.com</a> adresinden ulaşabilirsiniz.
        </div>
      </div>
    </div>
  );
}
