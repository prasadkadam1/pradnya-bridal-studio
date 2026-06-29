import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  dark?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hoverEffect = true,
  dark = false,
  onClick,
}) => {
  const cardClasses = `${
    dark ? 'luxury-glass-dark text-brand-ivory' : 'luxury-glass text-brand-charcoal'
  } rounded-lg p-6 ${onClick ? 'cursor-pointer' : ''} ${className}`;

  if (hoverEffect) {
    return (
      <motion.div
        whileHover={{ 
          y: -6, 
          boxShadow: "0 12px 30px -10px rgba(197, 168, 128, 0.35)",
          borderColor: "rgba(197, 168, 128, 0.5)"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onClick={onClick}
        className={cardClasses}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div onClick={onClick} className={cardClasses}>
      {children}
    </div>
  );
};
