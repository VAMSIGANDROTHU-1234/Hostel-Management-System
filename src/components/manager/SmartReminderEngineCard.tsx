import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../ui/Toast';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatCurrency } from '../../utils/formatters';
import { WhatsAppMessageType, Tenant } from '../../types';
import {
  MessageSquare,
  Clock,
  CalendarCheck,
  AlertTriangle,
  Flame,
  SendHorizontal,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const SmartReminderEngineCard: React.FC = () => {
  const { smartReminderBuckets, sendWhatsAppReminder } = useData();
  const { showToast } = useToast();
  const [loadingCategory, setLoadingCategory] = useState<string | null>(null);
  const [dispatchedCategory, setDispatchedCategory] = useState<string | null>(null);

  const { dueIn2Days, dueTomorrow, dueToday, overdue1to7, overdueMoreThan7 } = smartReminderBuckets;

  const handleOneClickDispatch = async (categoryKey: string, tenants: Tenant[]) => {
    if (tenants.length === 0) return;
    setLoadingCategory(categoryKey);

    let sentCount = 0;
    for (const t of tenants) {
      const res = await sendWhatsAppReminder(t.id, categoryKey);
      if (!res.success) {
        showToast(res.error || 'Failed to dispatch WhatsApp message.', 'warning');
      } else {
        sentCount++;
      }
    }

    setLoadingCategory(null);
    if (sentCount > 0) {
      setDispatchedCategory(categoryKey);
      showToast(`Opened WhatsApp for ${sentCount} tenant(s).`, 'success');
      setTimeout(() => setDispatchedCategory(null), 3000);
    }
  };

  const categories = [
    {
      key: 'dueIn2Days',
      title: 'Rent Due in 2 Days',
      description: 'Send gentle upcoming rent notices',
      tenants: dueIn2Days,
      messageType: 'upcoming' as WhatsAppMessageType,
      badgeVariant: 'crimson' as const,
      icon: Clock,
      colorClass: 'text-red-500 bg-red-500/10 border-red-500/20',
      buttonVariant: 'outline' as const,
    },
    {
      key: 'dueTomorrow',
      title: 'Rent Due Tomorrow',
      description: 'Urge tenants to pay by tomorrow',
      tenants: dueTomorrow,
      messageType: 'upcoming' as WhatsAppMessageType,
      badgeVariant: 'warning' as const,
      icon: CalendarCheck,
      colorClass: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      buttonVariant: 'secondary' as const,
    },
    {
      key: 'dueToday',
      title: 'Rent Due Today',
      description: 'High-priority due today reminders',
      tenants: dueToday,
      messageType: 'due' as WhatsAppMessageType,
      badgeVariant: 'warning' as const,
      icon: AlertTriangle,
      colorClass: 'text-amber-600 bg-amber-600/15 border-amber-600/30',
      buttonVariant: 'primary' as const,
    },
    {
      key: 'overdue1to7',
      title: 'Overdue by 1–7 Days',
      description: 'Mild overdue notices with initial late fee',
      tenants: overdue1to7,
      messageType: 'overdue' as WhatsAppMessageType,
      badgeVariant: 'danger' as const,
      icon: Flame,
      colorClass: 'text-red-600 bg-red-600/15 border-red-600/30',
      buttonVariant: 'danger' as const,
    },
    {
      key: 'overdueMoreThan7',
      title: 'Overdue > 7 Days',
      description: 'Critical payment default warnings',
      tenants: overdueMoreThan7,
      messageType: 'overdue' as WhatsAppMessageType,
      badgeVariant: 'danger' as const,
      icon: Flame,
      colorClass: 'text-rose-700 bg-rose-700/20 border-rose-700/40',
      buttonVariant: 'danger' as const,
    },
  ];

  return (
    <Card className="border-red-600/20 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-charcoal-800 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg font-extrabold text-slate-900 dark:text-slate-100">
            <Sparkles className="w-5 h-5 text-red-600" /> Smart WhatsApp Reminder Engine
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            Auto-categorized rent due dates with 1-click WhatsApp dispatches.
          </p>
        </div>
        <Badge variant="crimson" className="font-extrabold">
          5 Smart Buckets Active
        </Badge>
      </CardHeader>

      <CardContent className="pt-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {categories.map(cat => {
            const Icon = cat.icon;
            const totalAmount = cat.tenants.reduce((sum, t) => sum + t.monthly_rent, 0);
            const isSending = loadingCategory === cat.key;
            const isJustSent = dispatchedCategory === cat.key;

            return (
              <div
                key={cat.key}
                className="p-4 rounded-2xl bg-slate-50/80 dark:bg-charcoal-800/40 border border-slate-200/80 dark:border-charcoal-700 flex flex-col justify-between space-y-3 transition-all hover:border-red-500/40 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2.5 rounded-xl border ${cat.colorClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <Badge variant={cat.badgeVariant} size="sm">
                      {cat.tenants.length} Tenants
                    </Badge>
                  </div>

                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
                    {cat.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                    {cat.description}
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-charcoal-700/60 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Volume</span>
                    <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant={isJustSent ? 'success' : cat.buttonVariant}
                  className="w-full text-[11px] font-bold py-2"
                  isLoading={isSending}
                  disabled={cat.tenants.length === 0}
                  onClick={() => handleOneClickDispatch(cat.key, cat.tenants)}
                  leftIcon={isJustSent ? <CheckCircle2 className="w-3.5 h-3.5" /> : <SendHorizontal className="w-3.5 h-3.5" />}
                >
                  {isJustSent ? 'WhatsApp Sent!' : `Send WhatsApp (${cat.tenants.length})`}
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
