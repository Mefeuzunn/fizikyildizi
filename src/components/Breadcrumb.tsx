import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        marginBottom: "1rem",
        fontSize: "0.75rem",
        color: "var(--text-muted)",
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
        flexWrap: "wrap",
      }}
    >
      <ol
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          flexWrap: "wrap",
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
        {items.map((item, index) => (
          <li
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            {index > 0 && (
              <span style={{ opacity: 0.5 }} aria-hidden="true">
                ›
              </span>
            )}
            {item.href ? (
              <Link href={item.href} style={{ color: "var(--text-muted)" }}>
                {item.label}
              </Link>
            ) : (
              <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
