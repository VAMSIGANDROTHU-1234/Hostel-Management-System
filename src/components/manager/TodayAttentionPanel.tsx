import React from 'react';
import { useData } from '../../context/DataContext';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Flame, BedDouble, UserCheck, MessageSquareWarning, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TodayAttentionPanel: React.FC = () => {
  const navigate = useNavigate();
  const { smartReminderBuckets, occupancyStats, visitors, complaints } = useData();

  const dueToday = smartReminderBuckets?.dueToday || [];
  const overdue1to7 = smartReminderBuckets?.overdue1to7 || [];
  const overdueMoreThan7 = smartReminderBuckets?.overdueMoreThan7 || [];
  const totalOverdue = overdue1to7.length + overdueMoreThan7.length;
  const visitorsInside = (visitors || []).filter(v => v && v.status === 'inside');
  const openComplaints = (complaints || []).filter(c => c && c.status === 'open');
  const vacantBedsCount = occupancyStats?.vacantBeds || 0;

  const items = [
    {
      title: 'Payments Due Today',
      count: dueToday.length + totalOverdue,
      detail: `${dueToday.length} Due Today • ${totalOverdue} Overdue`,
      icon: Flame,
      colorDot: 'bg-red-500',
      action: () => navigate('/manager/whatsapp-reminders'),
    },
    {
      title: 'Complaints Pending',
      count: openComplaints.length,
      detail: 'Requires maintenance action',
      icon: MessageSquareWarning,
      colorDot: 'bg-rose-500',
      action: () => navigate('/manager/complaints'),
    },
    {
      title: 'Empty Beds Available',
      count: vacantBedsCount,
      detail: 'Ready for tenant onboarding',
      icon: BedDouble,
      colorDot: 'bg-emerald-500',
      action: () => navigate('/manager/empty-beds'),
    },
    {
      title: 'Visitors Waiting Inside',
      count: visitorsInside.length,
      detail: 'Currently checked-in guests',
      icon: UserCheck,
      colorDot: 'bg-amber-500',
      action: () => navigate('/manager/visitors'),
    },
  ];

  return (
    <Card className="border border-slate-200/80 dark:border-charcoal-800 bg-white dark:bg-charcoal-900 rounded-2xl shadow-xs">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-charcoal-800/80">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Needs Attention
          </CardTitle>
          <span className="text-xs text-slate-400 font-medium">Operational Action Matrix</span>
        </div>
      </CardHeader>

      <CardContent className="pt-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {items.map((item, idx) => (
            <div
              key={idx}
              onClick={item.action}
              className="p-4 rounded-xl border border-slate-200/80 dark:border-charcoal-800/80 bg-slate-50/50 dark:bg-charcoal-800/30 hover:border-slate-300 dark:hover:border-charcoal-700 cursor-pointer transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full ${item.colorDot} shrink-0`} />
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-red-600 transition-colors">
                    {item.count} {item.title}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium mt-0.5">{item.detail}</div>
                </div>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 group-hover:text-red-600 transition-all shrink-0" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
