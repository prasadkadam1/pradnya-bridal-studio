import React from 'react';

interface DividerProps {
  className?: string;
  variant?: 'simple' | 'mandala' | 'dots';
}

export const Divider: React.FC<DividerProps> = ({ className = '', variant = 'mandala' }) => {
  if (variant === 'simple') {
    return (
      <div className={`w-full flex items-center justify-center py-4 ${className}`}>
        <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-brand-gold to-transparent" />
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={`flex justify-center items-center space-x-2 py-4 ${className}`}>
        <div className="w-1.5 h-1.5 rounded-full bg-brand-gold/40" />
        <div className="w-2.5 h-2.5 rounded-full bg-brand-gold" />
        <div className="w-1.5 h-1.5 rounded-full bg-brand-gold/40" />
      </div>
    );
  }

  return (
    <div className={`w-full flex items-center justify-center py-8 ${className}`}>
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-brand-gold/40 to-brand-gold/70" />
      
      {/* Central SVG Mandala Pattern */}
      <div className="mx-4 text-brand-gold shrink-0">
        <svg
          viewBox="0 0 100 100"
          className="w-10 h-10 fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Mandala SVG Drawing */}
          <circle cx="50" cy="50" r="8" className="fill-none stroke-current" strokeWidth="2" />
          <circle cx="50" cy="50" r="3" />
          {/* 8 Petals */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <path
              key={angle}
              d="M 50 42 C 48 35, 52 35, 50 42"
              transform={`rotate(${angle} 50 50)`}
              className="stroke-current fill-none"
              strokeWidth="1.5"
            />
          ))}
          {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle) => (
            <circle
              key={angle}
              cx="50"
              cy="28"
              r="1.5"
              transform={`rotate(${angle} 50 50)`}
            />
          ))}
          <circle cx="50" cy="50" r="28" className="fill-none stroke-current opacity-30" strokeWidth="0.5" />
        </svg>
      </div>
      
      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-brand-gold/40 to-brand-gold/70" />
    </div>
  );
};
