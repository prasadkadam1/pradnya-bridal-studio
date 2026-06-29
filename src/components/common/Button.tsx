import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  loading = false,
  disabled,
  ...props
}) => {
  const baseStyle = "relative inline-flex items-center justify-center font-sans text-xs tracking-widest uppercase font-semibold transition-all duration-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-gold/50 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden active:scale-[0.98] hover:scale-[1.01] transform";
  
  const variants = {
    primary: "text-brand-green-dark gold-luxury-button hover:brightness-105 shadow-md py-3.5 px-7",
    secondary: "text-brand-ivory bg-brand-green hover:bg-brand-green-dark border border-brand-green shadow-md py-3.5 px-7",
    outline: "text-brand-green-dark bg-transparent border border-brand-gold/60 hover:border-brand-gold hover:bg-brand-gold/5 py-3.2 px-6.5",
    text: "text-brand-green hover:text-brand-green-dark hover:underline bg-transparent py-2 px-4"
  };

  const currentVariantStyle = variants[variant] || variants.primary;

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyle} ${currentVariantStyle} ${className}`}
      {...props}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading...</span>
        </div>
      ) : children}
    </button>
  );
};
