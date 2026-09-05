import React from 'react';
import { useData } from '../../context/DataContext';
import { Card } from '../ui/Card';
import { SendHorizontal, Calendar, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

export const ReminderAnalyticsCards: React.FC = () => {
  const { reminderAnalytics } = useData();
  const { todaysMessages, thisWeeksMessages, delivered, failed, pending } = reminderAnalytics;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 1. Today's Messages */}
      <Card className="p-4 flex items-center justify-between border-red-600/20 bg-gradient-to-br from-white to-red-600/5 dark:from-charcoal-900 dark:to-red-950/20">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Today's Messages
          </span>
          <div className="text-2xl font-extrabold text-red-600 dark:text-red-400 mt-1 tracking-tight">
            {todaysMessages}
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">Dispatched today</span>
        </div>
        <div className="p-3 rounded-2xl bg-red-600/10 text-red-600 dark:text-red-400 border border-red-600/20">
          <SendHorizontal className="w-5 h-5" />
        </div>
      </Card>

      {/* 2. This Week */}
      <Card className="p-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            This Week
          </span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1 tracking-tight">
            {thisWeeksMessages}
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">Last 7 days total</span>
        </div>
        <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
          <Calendar className="w-5 h-5" />
        </div>
      </Card>

      {/* 3. Delivered */}
      <Card className="p-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Delivered
          </span>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 tracking-tight">
            {delivered}
          </div>
          <span className="text-[10px] text-emerald-600/80 font-semibold">Successful delivery</span>
        </div>
        <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </Card>

      {/* 4. Failed */}
      <Card className="p-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Failed
          </span>
          <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1 tracking-tight">
            {failed}
          </div>
          <span className="text-[10px] text-rose-600/80 font-semibold">Retry queue items</span>
        </div>
        <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
          <AlertTriangle className="w-5 h-5" />
        </div>
      </Card>

      {/* 5. Pending */}
      <Card className="p-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Pending / Queued
          </span>
          <div className="text-2xl font-extrabold text-amber-500 mt-1 tracking-tight">
            {pending}
          </div>
          <span className="text-[10px] text-amber-500/80 font-semibold">In dispatch queue</span>
        </div>
        <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
          <Clock className="w-5 h-5" />
        </div>
      </Card>
    </div>
  );
};
