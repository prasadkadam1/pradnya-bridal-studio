import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
  label: string;
  error?: string;
  type?: string;
  as?: 'input' | 'textarea' | 'select';
  options?: { value: string; label: string }[];
  rows?: number;
}

export const Input = forwardRef<HTMLInputElement & HTMLTextAreaElement & HTMLSelectElement, InputProps>(
  ({ label, error, type = 'text', as = 'input', options = [], rows = 4, className = '', ...props }, ref) => {
    const inputStyle = `w-full px-4 py-3 bg-brand-ivory text-brand-charcoal border ${
      error ? 'border-red-500 focus:ring-red-200' : 'border-brand-gold/30 focus:border-brand-gold focus:ring-brand-gold-champagne/30'
    } rounded focus:outline-none focus:ring-2 transition-all font-sans text-sm ${className}`;

    return (
      <div className="flex flex-col space-y-1.5 w-full">
        <label className="font-sans text-xs tracking-wider uppercase font-semibold text-brand-green/80">
          {label}
        </label>
        
        {as === 'textarea' && (
          <textarea
            ref={ref}
            rows={rows}
            className={inputStyle}
            {...props as React.TextareaHTMLAttributes<HTMLTextAreaElement>}
          />
        )}

        {as === 'select' && (
          <select
            ref={ref}
            className={inputStyle}
            {...props as React.SelectHTMLAttributes<HTMLSelectElement>}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {as === 'input' && (
          <input
            ref={ref}
            type={type}
            className={inputStyle}
            {...props as React.InputHTMLAttributes<HTMLInputElement>}
          />
        )}

        {error && (
          <span className="font-sans text-xs text-red-500 mt-1">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
