
import React from 'react';
import { COLORS } from '../constants';

// Fixed: Added key and made children optional in prop types to resolve TypeScript JSX mismatch errors
export const Button = ({ 
  onClick, 
  children, 
  variant = 'primary', 
  disabled, 
  className, 
  loading 
}: {
  onClick?: () => void;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  disabled?: boolean;
  className?: string;
  loading?: boolean;
  key?: React.Key;
}) => {
  const baseStyle = "h-[46px] px-6 rounded-xl flex items-center justify-center font-semibold transition-all active:scale-[0.96] disabled:opacity-40 disabled:active:scale-100";
  const variants = {
    primary: `bg-[${COLORS.primary}] text-white shadow-[0_4px_12px_rgba(255,107,157,0.3)]`,
    secondary: `bg-[#F2F2F7] text-black`,
    outline: `border border-[#E5E5EA] bg-white text-black`,
    ghost: `bg-transparent text-[#007AFF]`,
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled || loading}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      style={variant === 'primary' ? { backgroundColor: COLORS.primary } : {}}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : children}
    </button>
  );
};

// Fixed: Added key and made children optional in prop types to resolve TypeScript JSX mismatch errors
export const Card = ({ 
  children, 
  className, 
  onClick 
}: {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  key?: React.Key;
}) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-2xl ios-shadow border border-[#F2F2F7] overflow-hidden transition-all ${className} ${onClick ? 'active:opacity-80 active:scale-[0.98]' : ''}`}
  >
    {children}
  </div>
);

// Added key prop to resolve TS error when mapping components
export const Skeleton = ({ className, key }: { className?: string; key?: React.Key }) => (
  <div key={key} className={`bg-[#F2F2F7] animate-pulse rounded-lg ${className}`} />
);

export const SectionHeader = ({ 
  title, 
  subtitle, 
  actionLabel, 
  onAction 
}: { 
  title: string; 
  subtitle?: string; 
  actionLabel?: string; 
  onAction?: () => void 
}) => (
  <div className="flex justify-between items-end mb-5 px-5">
    <div className="flex-1">
      <h2 className="text-[30px] font-bold tracking-tight text-black leading-tight">{title}</h2>
      {subtitle && <p className="text-[14px] text-[#8E8E93] mt-1">{subtitle}</p>}
    </div>
    {actionLabel && (
      <button onClick={onAction} className="text-[#007AFF] text-[15px] font-semibold pb-1 hover:opacity-70 transition-opacity">{actionLabel}</button>
    )}
  </div>
);

export const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="w-full h-[3px] bg-[#F2F2F7] overflow-hidden fixed top-safe left-0 z-50">
    <div 
      className="h-full bg-gradient-to-r from-[#FF6B9D] to-[#FFD700] transition-all duration-700 ease-in-out"
      style={{ width: `${progress}%` }}
    />
  </div>
);