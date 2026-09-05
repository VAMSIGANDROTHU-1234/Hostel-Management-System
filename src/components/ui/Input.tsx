import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, className = '', ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-slate-400 pointer-events-none">{leftIcon}</div>
          )}
          <input
            ref={ref}
            className={`w-full bg-slate-50 dark:bg-charcoal-800/80 border text-slate-900 dark:text-slate-100 text-sm rounded-xl px-3.5 py-2.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
              error
                ? 'border-red-600 focus:ring-red-600'
                : 'border-slate-200 dark:border-charcoal-700 hover:border-red-500/50 dark:hover:border-red-500/50'
            } ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''} ${className}`}
            {...props}
          />
          {rightIcon && <div className="absolute right-3.5 text-slate-400">{rightIcon}</div>}
        </div>
        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
