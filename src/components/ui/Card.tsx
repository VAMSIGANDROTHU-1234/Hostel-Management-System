import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({
  children,
  className = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-charcoal-900 border border-slate-200/80 dark:border-red-950/40 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:border-red-500/40 hover:-translate-y-0.5 hover:shadow-glow-red' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-6 pb-3 border-b border-slate-100 dark:border-charcoal-800/80 ${className}`}>{children}</div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h3 className={`text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight ${className}`}>{children}</h3>
);

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`text-xs text-slate-500 dark:text-slate-400 mt-1 ${className}`}>{children}</p>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-6 pt-3 border-t border-slate-100 dark:border-charcoal-800/80 flex items-center justify-between ${className}`}>{children}</div>
);
