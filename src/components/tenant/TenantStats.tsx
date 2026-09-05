import React from 'react';
import { Tenant, Payment } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { BedDouble, Building2, Calendar, ShieldCheck, DollarSign, AlertCircle } from 'lucide-react';

interface TenantStatsProps {
  tenant: Tenant;
  latestPayment?: Payment;
}

export const TenantStats: React.FC<TenantStatsProps> = ({ tenant, latestPayment }) => {
  const isOverdue = latestPayment?.status === 'overdue';
  const isPending = latestPayment?.status === 'pending';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Card 1: My Room & Bed Info */}
      <Card className="p-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Room {tenant.room?.room_number || '102'}</h3>
              <p className="text-xs text-slate-500">Floor {tenant.room?.floor || 1} • {tenant.room?.room_type || 'Double Sharing'}</p>
            </div>
          </div>
          <Badge variant="info">Bed {tenant.bed?.bed_number || '102-A'}</Badge>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Joining Date:</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">{formatDate(tenant.joining_date)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Security Deposit:</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(tenant.deposit)}</span>
          </div>
        </div>
      </Card>

      {/* Card 2: Monthly Rent & Due Date */}
      <Card className="p-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Monthly Rent</h3>
              <p className="text-xs text-slate-500">Due on 5th of every month</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100">{formatCurrency(tenant.monthly_rent)}</span>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Next Due Date:</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {latestPayment ? formatDate(latestPayment.due_date) : '5th Next Month'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Late Fee Policy:</span>
            <span className="font-semibold text-amber-600 dark:text-amber-400">₹100 / day post due date</span>
          </div>
        </div>
      </Card>

      {/* Card 3: Current Payment Status Badge */}
      <Card className="p-6 flex flex-col justify-between">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Rent Status</span>
          <div className="mt-3">
            {isOverdue ? (
              <Badge variant="danger" className="text-sm px-3 py-1">
                <AlertCircle className="w-4 h-4 inline mr-1" /> OVERDUE PAYMENT
              </Badge>
            ) : isPending ? (
              <Badge variant="warning" className="text-sm px-3 py-1">
                <Calendar className="w-4 h-4 inline mr-1" /> RENT DUE
              </Badge>
            ) : (
              <Badge variant="success" className="text-sm px-3 py-1">
                <ShieldCheck className="w-4 h-4 inline mr-1" /> ALL RENT PAID
              </Badge>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          {isOverdue
            ? 'Your rent is overdue. Please pay online via Razorpay to clear late charges.'
            : isPending
            ? 'Rent due soon. Click Pay Rent to pay securely online.'
            : 'Thank you! Your rent account is up to date for this month.'}
        </p>
      </Card>
    </div>
  );
};
