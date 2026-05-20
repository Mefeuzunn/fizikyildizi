"use client";

import Link from "next/link";
import styles from "./Navbar.module.css";
import ThemeToggle from "./ThemeToggle";
import { useState, useEffect, useRef } from "react";
import { calculators } from "@/data/calculators";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof calculators>([]);
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    const q = query.toLowerCase();
    const found = calculators.filter(c =>
      c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    ).slice(0, 6);
    setResults(found);
    setOpen(found.length > 0);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // CMD + K or CTRL + K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (showMobileSearch) {
      mobileInputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [showMobileSearch]);

  const handleSelect = (slug: string) => {
    setQuery("");
    setOpen(false);
    router.push(`/hesapla/${slug}`);
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.navContainer}`}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M7 6v12M17 6l-7 6 7 6" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className={styles.logoText}>Kalkula</span>
        </Link>
        <div className={styles.searchMiddle}>
          {/* Mobile Search Trigger Button (The one circled by user) */}
          <button 
            className={styles.mobileSearchTrigger}
            onClick={() => setShowMobileSearch(true)}
            aria-label="Ara"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>

        {/* Desktop search */}
        <div className={styles.searchWrapper} ref={searchRef}>
          <div className={styles.searchBox}>
            <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder="Hesaplama aracı ara... (Cmd + K)"
              className={styles.searchInput}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => results.length > 0 && setOpen(true)}
            />
            {query ? (
              <button className={styles.searchClear} onClick={() => { setQuery(""); setOpen(false); }}>
                ×
              </button>
            ) : (
               <div className={styles.cmdBadge}>
                  ⌘K
               </div>
            )}
          </div>

          {open && (
            <div className={styles.searchDropdown}>
              {results.map(r => (
                <button key={r.id} className={styles.searchResult} onClick={() => handleSelect(r.slug)}>
                  <div className={styles.searchResultIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="4" y="2" width="16" height="20" rx="2"></rect>
                      <line x1="8" y1="8" x2="16" y2="8"></line>
                      <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                  </div>
                  <div>
                    <div className={styles.searchResultTitle}>{r.title}</div>
                    <div className={styles.searchResultDesc}>{r.description.slice(0, 60)}...</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop nav actions */}
        <div className={styles.navActions}>
          <Link href="/converter" className={styles.navLink}>
            Dönüştürücü
          </Link>
          <Link href="/calculator" className={styles.navLink}>
            Hesaplayıcı
          </Link>
          <ThemeToggle />
          {/* Mobile menu toggle */}
          <button
            className={styles.mobileMenuButton}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menü"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile search overlay */}
      {showMobileSearch && (
        <div className={styles.mobileSearchOverlay}>
          <div className={styles.mobileSearchHeader}>
            <div className={`${styles.searchBox} ${styles.mobileInputWrapper}`}>
              <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                ref={mobileInputRef}
                type="text"
                placeholder="Araç ara..."
                className={styles.searchInput}
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
            <button className={styles.mobileSearchClose} onClick={() => { setShowMobileSearch(false); setQuery(""); }}>
              Vazgeç
            </button>
          </div>
          
          <div className={styles.mobileSearchResults}>
            {results.length > 0 ? (
              results.map(r => (
                <button key={r.id} className={styles.searchResult} onClick={() => { handleSelect(r.slug); setShowMobileSearch(false); }}>
                  <div className={styles.searchResultIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="4" y="2" width="16" height="20" rx="2"></rect>
                    </svg>
                  </div>
                  <div>
                    <div className={styles.searchResultTitle}>{r.title}</div>
                    <div className={styles.searchResultDesc}>{r.description.slice(0, 50)}...</div>
                  </div>
                </button>
              ))
            ) : query.length > 1 ? (
              <div className="p-8 text-center text-muted font-medium italic">Sonuç bulunamadı...</div>
            ) : (
              <div className="p-8 text-center text-muted text-xs uppercase font-black tracking-widest opacity-30">Hesaplama aracı ismini yazın</div>
            )}
          </div>
        </div>
      )}

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileSearchWrapper}>
            <div className={`${styles.searchBox} ${styles.mobileMenuSearchBox}`}>
              <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Araç ara..."
                className={styles.searchInput}
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
            {open && (
              <div className={styles.searchDropdown}>
                {results.map(r => (
                  <button key={r.id} className={styles.searchResult} onClick={() => { handleSelect(r.slug); setMobileMenuOpen(false); }}>
                    <div className={styles.searchResultTitle}>{r.title}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <nav className={styles.mobileNav}>
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className={styles.mobileNavLink}>Ana Sayfa</Link>
            <Link href="/converter" onClick={() => setMobileMenuOpen(false)} className={styles.mobileNavLink}>Belge Dönüştürücü</Link>
            <Link href="/calculator" onClick={() => setMobileMenuOpen(false)} className={styles.mobileNavLink}>Hesap Makinesi</Link>
            <Link href="/notepad" onClick={() => setMobileMenuOpen(false)} className={styles.mobileNavLink}>Not Defteri</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
