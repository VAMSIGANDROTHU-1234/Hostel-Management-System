import React from 'react';
import { Card } from '../ui/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  onClick,
}) => {
  return (
    <Card
      onClick={onClick}
      className="p-5 relative overflow-hidden bg-white dark:bg-charcoal-900 border border-slate-200/80 dark:border-charcoal-800 rounded-2xl shadow-xs transition-all hover:border-slate-300 dark:hover:border-charcoal-700"
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1.5 tracking-tight">
            {value}
          </div>
        </div>

        {icon && (
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-charcoal-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-charcoal-700">
            {icon}
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-charcoal-800/60 flex items-center justify-between text-xs">
          {subtitle && <span className="text-slate-400 dark:text-slate-500 font-medium">{subtitle}</span>}
          {trend && (
            <span
              className={`inline-flex items-center gap-1 font-bold ${
                trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {trend.isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {trend.value}
            </span>
          )}
        </div>
      )}
    </Card>
  );
};
