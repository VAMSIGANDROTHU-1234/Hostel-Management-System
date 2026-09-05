import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-charcoal-800 rounded-xl ${className}`}
    />
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-charcoal-800 bg-white dark:bg-charcoal-900 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-xl" />
      </div>
      <Skeleton className="h-7 w-32" />
      <Skeleton className="h-3 w-40" />
    </div>
  );
};

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="border border-slate-200/80 dark:border-charcoal-800 rounded-2xl bg-white dark:bg-charcoal-900 overflow-hidden space-y-4 p-4">
      <div className="flex items-center justify-between pb-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 dark:border-charcoal-800/60">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
};
