import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string | number }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full bg-slate-50 dark:bg-charcoal-800/80 border text-slate-900 dark:text-slate-100 text-sm rounded-xl px-3.5 py-2.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent ${
            error
              ? 'border-red-600 focus:ring-red-600'
              : 'border-slate-200 dark:border-charcoal-700 hover:border-red-500/50 dark:hover:border-red-500/50'
          } ${className}`}
          {...props}
        >
          {options.map((opt, idx) => (
            <option key={idx} value={opt.value} className="bg-white dark:bg-charcoal-900 text-slate-900 dark:text-slate-100">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
