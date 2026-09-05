import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    // Only primary action is filled Crimson Red
    primary:
      'bg-red-600 hover:bg-red-700 text-white shadow-xs active:scale-[0.98]',
    // Secondary is clean neutral fill
    secondary:
      'bg-slate-100 dark:bg-charcoal-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-charcoal-700 active:scale-[0.98]',
    // Outline style for secondary action items
    outline:
      'border border-slate-200/80 dark:border-charcoal-700 bg-transparent text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-charcoal-800 active:scale-[0.98]',
    ghost:
      'bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-charcoal-800',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-xs active:scale-[0.98]',
    success:
      'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-xs gap-2',
    lg: 'px-5 py-2.5 text-sm gap-2.5',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
