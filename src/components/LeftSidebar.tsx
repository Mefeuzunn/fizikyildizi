"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories } from "@/data/calculators";
import { CategoryIcon } from "@/components/CategoryIcon";
import styles from "./LeftSidebar.module.css";

export function LeftSidebar() {
  const pathname = usePathname();

  return (
    <aside className="left-sidebar sticky-sidebar">
      <div className={styles.sidebar}>
        <h3 className={styles.title}>
          Kategoriler
        </h3>
        <nav className={styles.nav}>
          {categories.map((cat) => {
            const isActive = pathname === `/kategori/${cat.slug}`;
            return (
              <Link
                key={cat.id}
                href={`/kategori/${cat.slug}`}
                className={`${styles.link} ${isActive ? styles.linkActive : ""}`}
                style={{
                  "--link-color": cat.color || "var(--accent-primary)",
                  "--link-bg": isActive ? `${cat.color}18` : "transparent",
                } as React.CSSProperties}
              >
                <CategoryIcon id={cat.id} size={18} color={isActive ? (cat.color || "var(--accent-primary)") : "var(--text-muted)"} strokeWidth={isActive ? 2.5 : 2} />
                {cat.name}
              </Link>
            );
          })}
        </nav>

        <div className={styles.separator} />

        <h3 className={styles.title}>
          Araçlar
        </h3>
        <nav className={styles.nav}>
          {[
            { href: "/calculator", label: "🔢 Hesap Makinesi" },
            { href: "/notepad", label: "📝 Not Defteri" },
            { href: "/calendar", label: "📅 Takvim" },
            { href: "/counters", label: "⏱️ Kronometre" },
            { href: "/password-generator", label: "🔐 Şifre Oluşturucu" },
          ].map(t => {
            const isActive = pathname === t.href;
            return (
              <Link key={t.href} href={t.href}
                className={`${styles.toolLink} ${isActive ? styles.toolLinkActive : ""}`}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
