"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./iletisim.module.css";

export default function Iletisim() {
  const [form, setForm] = useState({ ad: "", email: "", konu: "", mesaj: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className={styles.container}>
      <nav className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>Ana Sayfa</Link>
        <span>›</span>
        <span>İletişim</span>
      </nav>

      <h1 className={styles.title}>İletişim</h1>
      <p className={styles.subtitle}>
        Öneri, hata bildirimi veya iş birliği için bize ulaşın.
      </p>

      <div className={styles.grid}>
        {/* Contact Info */}
        <div className={styles.infoGroup}>
          {[
            { icon: "📧", title: "E-posta", value: "mefeuzunn@gmail.com" },
            { icon: "🕐", title: "Yanıt Süresi", value: "1-2 iş günü" },
            { icon: "🌍", title: "Hizmet Bölgesi", value: "Türkiye geneli" },
          ].map(c => (
            <div key={c.title} className={styles.infoCard}>
              <div className={styles.infoIcon}>{c.icon}</div>
              <div className={styles.infoTitle}>{c.title}</div>
              <div className={styles.infoValue}>{c.value}</div>
            </div>
          ))}

          <div className={styles.faqCard}>
            <h3 className={styles.faqTitle}>Sık Sorulan Sorular</h3>
            {[
              { q: "Araçlar ücretsiz mi?", a: "Evet, tüm araçlar tamamen ücretsizdir." },
              { q: "Verilerim kaydediliyor mu?", a: "Hayır, tüm veriler yalnızca tarayıcınızda (client-side) kalır." },
            ].map(faq => (
              <div key={faq.q} className={styles.faqItem}>
                <div className={styles.faqQ}>{faq.q}</div>
                <div className={styles.faqA}>{faq.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className={styles.formCard}>
          {sent ? (
            <div className={styles.successState}>
              <div className={styles.successIcon}>✅</div>
              <h2 className={styles.successTitle}>Mesajınız İletildi!</h2>
              <p className={styles.successText}>En kısa sürede size dönüş yapacağız.</p>
              <button onClick={() => { setSent(false); setForm({ ad: "", email: "", konu: "", mesaj: "" }); }} className="btn-secondary" style={{ marginTop: "1.5rem" }}>
                Yeni Mesaj
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.formGroup}>
              <h2 className={styles.formTitle}>Mesaj Gönderin</h2>
              {[
                { id: "ad", label: "Adınız", placeholder: "Adınız Soyadınız", type: "text" },
                { id: "email", label: "E-posta", placeholder: "ornek@email.com", type: "email" },
                { id: "konu", label: "Konu", placeholder: "Öneri / Hata Bildirimi / Diğer", type: "text" },
              ].map(f => (
                <div key={f.id} className={styles.inputField}>
                  <label htmlFor={f.id} className={styles.label}>{f.label}</label>
                  <input
                    id={f.id}
                    type={f.type}
                    required
                    placeholder={f.placeholder}
                    value={form[f.id as keyof typeof form]}
                    onChange={e => setForm(p => ({ ...p, [f.id]: e.target.value }))}
                    className={styles.input}
                  />
                </div>
              ))}
              <div className={styles.inputField}>
                <label htmlFor="mesaj" className={styles.label}>Mesajınız</label>
                <textarea
                  id="mesaj"
                  required
                  rows={5}
                  placeholder="Mesajınızı buraya yazın..."
                  value={form.mesaj}
                  onChange={e => setForm(p => ({ ...p, mesaj: e.target.value }))}
                  className={styles.textarea}
                />
              </div>
              <button type="submit" className="btn-primary" style={{ width: "100%" }}>
                Gönder →
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
