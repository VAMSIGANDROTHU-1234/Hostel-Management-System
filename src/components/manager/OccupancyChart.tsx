import React from 'react';
import { useData } from '../../context/DataContext';

export const OccupancyChart: React.FC = () => {
  const { occupancyStats } = useData();
  const { occupiedBeds, vacantBeds, totalBeds, occupancyRate } = occupancyStats;

  const strokeDasharray = 251.2; // 2 * pi * 40
  const strokeDashoffset = strokeDasharray - (strokeDasharray * occupancyRate) / 100;

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="relative w-44 h-44 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background Circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            className="stroke-slate-100 dark:stroke-charcoal-800"
            strokeWidth="12"
            fill="transparent"
          />
          {/* Occupied Circle Segment in Crimson Red */}
          <circle
            cx="50"
            cy="50"
            r="40"
            className="stroke-red-600 transition-all duration-1000 ease-out"
            strokeWidth="12"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {occupancyRate}%
          </span>
          <span className="text-[11px] font-bold text-red-500 uppercase tracking-wider mt-0.5">
            Occupied
          </span>
        </div>
      </div>

      <div className="w-full grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-100 dark:border-charcoal-800 text-center">
        <div className="p-3 rounded-2xl bg-red-600/10 border border-red-600/20">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Occupied Beds</div>
          <div className="text-xl font-extrabold text-red-600 dark:text-red-400 mt-1">{occupiedBeds}</div>
        </div>
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Vacant Beds</div>
          <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{vacantBeds}</div>
        </div>
      </div>
    </div>
  );
};
