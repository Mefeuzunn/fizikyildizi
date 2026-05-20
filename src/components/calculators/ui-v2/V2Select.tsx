"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

interface V2SelectProps<T extends string = string> {
  label?: string;
  value: T;
  onChange: (value: T) => void;
  options?: { value: T; label: string }[];
  children?: React.ReactNode;
  className?: string;
  fieldClassName?: string;
}

export function V2Select<T extends string = string>({
  label,
  value,
  onChange,
  options,
  children,
  className = "",
  fieldClassName = "",
}: V2SelectProps<T>) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="calc-input-label">{label}</label>}
      <div className="calc-input-key relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          className={`calc-input-field appearance-none pr-10 cursor-pointer ${fieldClassName}`}
        >
          {children ? children : options?.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ background: "var(--surface)", color: "var(--text-primary)" }}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
