import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'crimson';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = true,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-[11px] font-bold gap-1.5',
    md: 'px-3 py-1 text-xs font-bold gap-1.5',
  };

  const variantStyles = {
    success: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25',
    warning: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25',
    danger: 'bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/30',
    crimson: 'bg-red-600/15 text-red-600 dark:text-red-400 border border-red-600/30 shadow-xs',
    info: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/25',
    neutral: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/25',
  };

  const dotColors = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-600',
    crimson: 'bg-red-600',
    info: 'bg-blue-500',
    neutral: 'bg-slate-400',
  };

  return (
    <span className={`inline-flex items-center rounded-full transition-colors tracking-wide ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      <span>{children}</span>
    </span>
  );
};
