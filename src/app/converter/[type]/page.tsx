"use client";

import styles from "../converter.module.css";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { mergePdfs, splitPdf, convertToWebP, resizeImage } from "@/utils/documentProcessor";

const typeMap: Record<string, { title: string; from: string; to: string; accept: string; multi?: boolean }> = {
  "pdf-merge": { title: "PDF Birleştirici", from: "PDF", to: "PDF (.pdf)", accept: ".pdf", multi: true },
  "pdf-split": { title: "PDF Sayfa Ayıklayıcı", from: "PDF", to: "PDF (.pdf)", accept: ".pdf" },
  "to-webp": { title: "WebP Dönüştürücü", from: "Görsel", to: "WebP (.webp)", accept: "image/*" },
  "image-resize": { title: "Resim Boyutlandırıcı", from: "Görsel", to: "Resim", accept: "image/*" },
  "word-to-pdf": { title: "Word'den PDF'e Dönüştürücü", from: "Word", to: "PDF (.pdf)", accept: ".doc,.docx" },
  "excel-to-pdf": { title: "Excel'den PDF'e Dönüştürücü", from: "Excel", to: "PDF (.pdf)", accept: ".xls,.xlsx" },
};

export default function ConverterType() {
  const params = useParams();
  const rawType = params?.type;
  const typeStr = Array.isArray(rawType) ? rawType[0] : rawType || "pdf-merge";
  
  const [files, setFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [splitRange, setSplitRange] = useState("1-1");
  const [resizeWidth, setResizeWidth] = useState(1200);

  const info = typeMap[typeStr] || typeMap["pdf-merge"];

  useEffect(() => {
    setFiles([]);
    setIsConverting(false);
    setProgress(0);
    setIsCompleted(false);
    setResultBlob(null);
  }, [typeStr]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => info.multi ? [...prev, ...newFiles] : [newFiles[0]]);
      setIsCompleted(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => info.multi ? [...prev, ...newFiles] : [newFiles[0]]);
      setIsCompleted(false);
    }
  };

  const executeProcessing = async () => {
    if (files.length === 0) return;
    setIsConverting(true);
    setProgress(10);

    try {
      let result: Uint8Array | Blob;

      switch (typeStr) {
        case "pdf-merge":
          setProgress(30);
          result = await mergePdfs(files);
          setProgress(90);
          setResultBlob(new Blob([result as any], { type: "application/pdf" }));
          break;
        case "pdf-split":
          setProgress(40);
          result = await splitPdf(files[0], splitRange);
          setResultBlob(new Blob([result as any], { type: "application/pdf" }));
          break;
        case "to-webp":
          setProgress(50);
          result = await convertToWebP(files[0]);
          setResultBlob(result);
          break;
        case "image-resize":
          setProgress(50);
          result = await resizeImage(files[0], resizeWidth);
          setResultBlob(result);
          break;
        default:
          // Simulate for placeholders
          await new Promise(r => setTimeout(r, 1500));
          setResultBlob(new Blob(["Simulated content"], { type: "text/plain" }));
      }

      setProgress(100);
      setIsCompleted(true);
    } catch (err) {
      console.error(err);
      alert("Hata oluştu: " + (err as Error).message);
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement("a");
    a.href = url;
    const ext = typeStr.includes("pdf") ? ".pdf" : typeStr === "to-webp" ? ".webp" : files[0].name.split('.').pop();
    a.download = `kalkula_${typeStr}_${Date.now()}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div style={{ marginBottom: "1rem" }}>
          <Link href="/converter" className="btn-secondary" style={{ padding: "0.25rem 0.75rem", fontSize: "0.875rem" }}>
            &larr; Geri Dön
          </Link>
        </div>
        <h1 className={styles.title}>{info.title}</h1>
        <p className={styles.subtitle}>Tamamen tarayıcıda, güvenli ve yüksek hızlı belge işleme.</p>
      </div>

      <div className={`panel ${styles.card}`}>
        {!isCompleted && !isConverting && (
          <>
            <div 
              className={styles.uploadArea}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className={styles.uploadIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </div>
              <h3 className={styles.uploadTitle}>{info.from} Dosyalarınızı Seçin</h3>
              <input 
                type="file" 
                id="file-upload" 
                accept={info.accept} 
                multiple={info.multi}
                className={styles.fileInput} 
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload" className={styles.uploadButton}>
                {info.multi ? "Dosyaları Ekle" : "Dosya Seç"}
              </label>
            </div>

            {files.length > 0 && (
              <div style={{ marginTop: "2rem", textAlign: "left" }}>
                <h4 style={{ marginBottom: "1rem" }}>Seçili Dosyalar ({files.length})</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {files.map((f, i) => (
                    <div key={i} className="flex-between p-2 bg-secondary rounded-lg text-sm">
                      <span className="truncate">{f.name}</span>
                      <span className="opacity-50">{(f.size / 1024).toFixed(1)} KB</span>
                    </div>
                  ))}
                </div>

                {typeStr === "pdf-split" && (
                  <div style={{ marginTop: "1.5rem" }}>
                    <label className="label">Sayfa Aralığı (Örn: 1-3, 5):</label>
                    <input 
                      type="text" 
                      className="input" 
                      value={splitRange} 
                      onChange={(e) => setSplitRange(e.target.value)}
                    />
                  </div>
                )}

                {typeStr === "image-resize" && (
                  <div style={{ marginTop: "1.5rem" }}>
                    <label className="label">Hedef Genişlik (px):</label>
                    <input 
                      type="number" 
                      className="input" 
                      value={resizeWidth} 
                      onChange={(e) => setResizeWidth(Number(e.target.value))}
                    />
                  </div>
                )}

                <button 
                  className="btn-primary" 
                  style={{ width: "100%", marginTop: "2rem", padding: "1rem" }}
                  onClick={executeProcessing}
                >
                  İşlemi Başlat
                </button>
              </div>
            )}
          </>
        )}

        {isConverting && (
          <div className={styles.conversionArea}>
            <div className="animate-spin mb-4" style={{ color: "var(--accent-primary)" }}>
              <Calculator size={48} />
            </div>
            <h3 className={styles.conversionTitle}>Belgeniz İşleniyor...</h3>
            <div className={styles.progressBarWrapper}>
              <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}

        {isCompleted && (
          <div className={styles.successArea}>
            <div style={{ color: "#22c55e", marginBottom: "1rem" }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <h3 className={styles.successTitle}>İşlem Tamamlandı!</h3>
            <p className={styles.successDesc}>Belgeniz tarayıcıda başarıyla işlendi ve indirmeye hazır.</p>
            <div className="flex gap-2 justify-center mt-6">
              <button className="btn-primary" onClick={handleDownload} style={{ padding: "0.8rem 2rem" }}>Hemen İndir</button>
              <button 
                className="btn-secondary" 
                onClick={() => {
                  setFiles([]);
                  setIsCompleted(false);
                }}
              >Yeniden Başla</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Calculator({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
      <line x1="8" y1="6" x2="16" y2="6"></line>
      <line x1="16" y1="14" x2="16" y2="18"></line>
      <path d="M16 10h.01"></path>
      <path d="M12 10h.01"></path>
      <path d="M8 10h.01"></path>
      <path d="M12 14h.01"></path>
      <path d="M8 14h.01"></path>
      <path d="M12 18h.01"></path>
      <path d="M8 18h.01"></path>
    </svg>
  );
}


