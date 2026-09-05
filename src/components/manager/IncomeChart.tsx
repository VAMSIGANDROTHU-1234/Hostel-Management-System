import React from 'react';

export const IncomeChart: React.FC = () => {
  const data = [
    { month: 'Feb', target: 80000, collected: 78000 },
    { month: 'Mar', target: 85000, collected: 82000 },
    { month: 'Apr', target: 90000, collected: 89000 },
    { month: 'May', target: 95000, collected: 91000 },
    { month: 'Jun', target: 100000, collected: 98000 },
    { month: 'Jul', target: 105000, collected: 102000 },
  ];

  const maxVal = 120000;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-red-600" />
            <span className="text-slate-700 dark:text-slate-300">Revenue Collected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-slate-300 dark:bg-charcoal-700" />
            <span className="text-slate-500">Target Monthly Rent</span>
          </div>
        </div>
      </div>

      {/* Modern Bar Graph Visualizer with Red Gradient Bars */}
      <div className="h-56 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-slate-100 dark:border-charcoal-800">
        {data.map((item, idx) => {
          const collectedHeight = Math.round((item.collected / maxVal) * 100);
          const targetHeight = Math.round((item.target / maxVal) * 100);

          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
              {/* Tooltip */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-charcoal-950 text-white text-[11px] font-bold py-1 px-2 rounded-lg pointer-events-none z-10 whitespace-nowrap shadow-xl border border-red-950">
                ₹{item.collected.toLocaleString()} / ₹{item.target.toLocaleString()}
              </div>

              <div className="w-full max-w-[40px] flex items-end justify-center gap-1.5 h-full">
                {/* Collected Bar in Crimson Red */}
                <div
                  style={{ height: `${collectedHeight}%` }}
                  className="w-1/2 bg-gradient-to-t from-red-700 via-crimson-600 to-rose-500 rounded-t-lg transition-all duration-500 group-hover:brightness-125 shadow-glow-red"
                />
                {/* Target Bar */}
                <div
                  style={{ height: `${targetHeight}%` }}
                  className="w-1/2 bg-slate-200 dark:bg-charcoal-800 rounded-t-lg transition-all duration-500"
                />
              </div>

              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{item.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
