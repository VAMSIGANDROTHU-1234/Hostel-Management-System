import React from 'react';
import { Drawer } from '../ui/Drawer';
import { formatDateTime } from '../../utils/formatters';
import { CreditCard, Users, BedDouble, MessageSquareWarning, UserCheck, Activity } from 'lucide-react';

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  type: 'payment' | 'tenant' | 'room' | 'visitor' | 'complaint' | 'whatsapp';
  timestamp: string;
}

interface ActivityFeedProps {
  isOpen: boolean;
  onClose: () => void;
  activities?: ActivityItem[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ isOpen, onClose, activities = [] }) => {
  const safeActivities = Array.isArray(activities) ? activities : [];

  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'payment':
        return <CreditCard className="w-4 h-4 text-emerald-500" />;
      case 'tenant':
        return <Users className="w-4 h-4 text-red-500" />;
      case 'room':
        return <BedDouble className="w-4 h-4 text-blue-500" />;
      case 'visitor':
        return <UserCheck className="w-4 h-4 text-amber-500" />;
      case 'complaint':
        return <MessageSquareWarning className="w-4 h-4 text-rose-500" />;
      default:
        return <Activity className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Live Hostel Activity Feed" subtitle="Real-time audit log of operations, dispatches, and check-ins." size="md">
      <div className="space-y-4 pt-2">
        {safeActivities.length > 0 ? (
          <div className="relative border-l-2 border-slate-200 dark:border-charcoal-800 ml-3 pl-4 space-y-6">
            {safeActivities.map(item => (
              <div key={item.id} className="relative group">
                {/* Node icon dot */}
                <div className="absolute -left-[25px] top-0.5 p-1.5 rounded-full bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-700 shadow-sm group-hover:scale-110 transition-transform">
                  {getIcon(item.type)}
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-charcoal-800/60 border border-slate-200/80 dark:border-charcoal-700/80 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100">
                    <span>{item.title}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">{formatDateTime(item.timestamp)}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-400">
            No activity events recorded yet.
          </div>
        )}
      </div>
    </Drawer>
  );
};
