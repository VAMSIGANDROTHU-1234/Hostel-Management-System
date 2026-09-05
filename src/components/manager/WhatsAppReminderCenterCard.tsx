import React from 'react';
import { useData } from '../../context/DataContext';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { MessageSquare, ArrowRight, CheckCircle2, Clock, AlertTriangle, SendHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const WhatsAppReminderCenterCard: React.FC = () => {
  const navigate = useNavigate();
  const { reminderAnalytics } = useData();

  const todaysMessages = reminderAnalytics?.todaysMessages || 0;
  const delivered = reminderAnalytics?.delivered || 0;
  const pending = reminderAnalytics?.pending || 0;
  const failed = reminderAnalytics?.failed || 0;

  return (
    <Card className="border border-slate-200/80 dark:border-charcoal-800 bg-white dark:bg-charcoal-900 rounded-2xl shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100 dark:border-charcoal-800/80">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-emerald-500" />
          <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            WhatsApp Reminder Center
          </CardTitle>
        </div>

        <button
          onClick={() => navigate('/manager/whatsapp-reminders')}
          className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
        >
          Open Details <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </CardHeader>

      <CardContent className="pt-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50/50 dark:bg-charcoal-800/30 border border-slate-200/60 dark:border-charcoal-800/60 flex items-center justify-between">
            <div>
              <span className="text-slate-400 font-medium block text-[10px] uppercase">Today's Messages</span>
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">{todaysMessages}</span>
            </div>
            <SendHorizontal className="w-4 h-4 text-slate-400" />
          </div>

          <div className="p-3 rounded-xl bg-slate-50/50 dark:bg-charcoal-800/30 border border-slate-200/60 dark:border-charcoal-800/60 flex items-center justify-between">
            <div>
              <span className="text-slate-400 font-medium block text-[10px] uppercase">Delivered</span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">{delivered}</span>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>

          <div className="p-3 rounded-xl bg-slate-50/50 dark:bg-charcoal-800/30 border border-slate-200/60 dark:border-charcoal-800/60 flex items-center justify-between">
            <div>
              <span className="text-slate-400 font-medium block text-[10px] uppercase">Pending</span>
              <span className="text-lg font-bold text-amber-500 mt-0.5 block">{pending}</span>
            </div>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>

          <div className="p-3 rounded-xl bg-slate-50/50 dark:bg-charcoal-800/30 border border-slate-200/60 dark:border-charcoal-800/60 flex items-center justify-between">
            <div>
              <span className="text-slate-400 font-medium block text-[10px] uppercase">Failed</span>
              <span className="text-lg font-bold text-rose-600 dark:text-rose-400 mt-0.5 block">{failed}</span>
            </div>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
