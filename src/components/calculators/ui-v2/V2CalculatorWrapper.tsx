"use client";

import React from "react";

interface V2CalculatorWrapperProps {
  children: React.ReactNode;
  title?: string;
  icon?: string;
  infoText?: string;
  results?: React.ReactNode;
  className?: string;
}

export const V2CalculatorWrapper: React.FC<V2CalculatorWrapperProps> = ({
  children,
  title,
  icon,
  infoText,
  results,
  className = "",
}) => {
  return (
    <div className={`calc-wrapper max-w-2xl mx-auto px-1 md:px-0 ${className}`}>
      {/* INPUTS SECTION */}
      <div className="space-y-6 md:space-y-8">
        {children}
      </div>

      {/* RESULTS SECTION */}
      {results && (
        <div className="mt-8 md:mt-12 calc-result-panel-v2 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden">
          {title && (
            <div className="calc-result-header-v2 py-4 px-6 md:py-6 md:px-10">
               {icon && <span className="text-xl">{icon}</span>}
               <span className="text-xs font-black uppercase tracking-[0.2em]">{title}</span>
            </div>
          )}
          
          <div className="p-4 md:p-10">
            {results}
          </div>
        </div>
      )}

      {/* INFO BOX */}
      {infoText && (
        <div className="mt-10 p-5 md:p-8 rounded-[1.5rem] md:rounded-3xl bg-blue-500/5 border border-blue-500/10 flex gap-4 items-start">
           <span className="text-xl md:text-2xl mt-0.5">📌</span>
           <p className="text-[11px] md:text-xs font-medium text-muted leading-relaxed opacity-80 italic">
              {infoText}
           </p>
        </div>
      )}
    </div>
  );
};
