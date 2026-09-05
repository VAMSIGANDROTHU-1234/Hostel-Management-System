import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { TenantStats } from '../../components/tenant/TenantStats';
import { RazorpayModal } from '../../components/tenant/RazorpayModal';
import { RaiseComplaintModal } from '../../components/tenant/RaiseComplaintModal';
import { ReceiptModal } from '../../components/manager/ReceiptModal';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, Column } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Payment } from '../../types';
import { CreditCard, MessageSquareWarning, Printer, ShieldCheck, Sparkles } from 'lucide-react';

export const TenantDashboard: React.FC = () => {
  const { user } = useAuth();
  const { tenants, payments } = useData();

  const tenant = tenants.find(t => t.user_id === user?.id || t.user?.email.toLowerCase() === user?.email.toLowerCase()) || tenants[0];
  const myPayments = payments.filter(p => p.tenant_id === tenant.id);
  const latestPayment = myPayments[0];

  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [isComplaintOpen, setIsComplaintOpen] = useState(false);
  const [selectedReceiptPayment, setSelectedReceiptPayment] = useState<Payment | null>(null);

  const paymentColumns: Column<Payment>[] = [
    {
      key: 'receipt_no',
      header: 'Receipt No',
      render: p => <span className="font-mono text-xs font-bold text-red-600 dark:text-red-400">{p.receipt_no}</span>,
    },
    {
      key: 'amount',
      header: 'Amount',
      render: p => <span className="font-bold text-slate-900 dark:text-slate-100">{formatCurrency(p.amount)}</span>,
    },
    {
      key: 'due_date',
      header: 'Due Date',
      render: p => formatDate(p.due_date),
    },
    {
      key: 'payment_method',
      header: 'Method',
      render: p => <Badge variant="neutral">{p.payment_method}</Badge>,
    },
    {
      key: 'status',
      header: 'Status',
      render: p => (
        <Badge variant={p.status === 'paid' ? 'success' : p.status === 'pending' ? 'warning' : 'danger'}>
          {p.status.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Receipt',
      render: p => (
        <Button
          size="sm"
          variant="outline"
          leftIcon={<Printer className="w-3.5 h-3.5" />}
          onClick={() => setSelectedReceiptPayment(p)}
        >
          Receipt
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Luxury Red Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-red-950 via-crimson-900 to-charcoal-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xl border border-red-900/40">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight">Welcome back, {tenant.user?.name}!</h1>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-xs text-red-200 mt-1">
            Room {tenant.room?.room_number || '102'} • Bed {tenant.bed?.bed_number || '102-A'} • {tenant.room?.room_type || 'Double Sharing'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="success"
            size="lg"
            leftIcon={<CreditCard className="w-5 h-5" />}
            onClick={() => setIsRazorpayOpen(true)}
          >
            Pay Rent Online
          </Button>

          <Button
            variant="secondary"
            size="lg"
            leftIcon={<MessageSquareWarning className="w-5 h-5" />}
            onClick={() => setIsComplaintOpen(true)}
          >
            Raise Ticket
          </Button>
        </div>
      </div>

      {/* Tenant Stats Overview */}
      <TenantStats tenant={tenant} latestPayment={latestPayment} />

      {/* Payment History Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-red-600" /> My Payment Receipts & Ledger
          </CardTitle>
          <span className="text-xs text-slate-500 font-medium">Download receipts for tax / record proof</span>
        </CardHeader>
        <CardContent>
          <Table columns={paymentColumns} data={myPayments} pageSize={5} searchKey="receipt_no" />
        </CardContent>
      </Card>

      {/* Razorpay Online Payment Gateway Modal */}
      <RazorpayModal
        isOpen={isRazorpayOpen}
        onClose={() => setIsRazorpayOpen(false)}
        amount={tenant.monthly_rent}
        tenantId={tenant.id}
        onSuccess={() => {
          setIsRazorpayOpen(false);
        }}
      />

      {/* Raise Complaint Ticket Modal */}
      <RaiseComplaintModal
        isOpen={isComplaintOpen}
        onClose={() => setIsComplaintOpen(false)}
        tenantId={tenant.id}
      />

      {/* Printable Receipt Modal */}
      <ReceiptModal
        isOpen={!!selectedReceiptPayment}
        onClose={() => setSelectedReceiptPayment(null)}
        payment={selectedReceiptPayment}
      />
    </div>
  );
};
