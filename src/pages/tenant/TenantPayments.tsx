import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Table, Column } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ReceiptModal } from '../../components/manager/ReceiptModal';
import { RazorpayModal } from '../../components/tenant/RazorpayModal';
import { Payment } from '../../types';
import { CreditCard, Printer, ShieldCheck } from 'lucide-react';

export const TenantPayments: React.FC = () => {
  const { user } = useAuth();
  const { tenants, payments } = useData();

  const tenant = tenants.find(t => t.user_id === user?.id || t.user?.email.toLowerCase() === user?.email.toLowerCase()) || tenants[0];
  const myPayments = payments.filter(p => p.tenant_id === tenant.id);

  const [selectedReceiptPayment, setSelectedReceiptPayment] = useState<Payment | null>(null);
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);

  const columns: Column<Payment>[] = [
    {
      key: 'receipt_no',
      header: 'Receipt No',
      sortable: true,
      render: p => <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">{p.receipt_no}</span>,
    },
    {
      key: 'amount',
      header: 'Amount Paid',
      sortable: true,
      render: p => <span className="font-bold text-slate-900 dark:text-slate-100">{formatCurrency(p.amount)}</span>,
    },
    {
      key: 'due_date',
      header: 'Due Date',
      sortable: true,
      render: p => formatDate(p.due_date),
    },
    {
      key: 'payment_date',
      header: 'Payment Date',
      render: p => p.payment_date ? formatDate(p.payment_date) : <span className="text-slate-400 font-normal">Pending</span>,
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-indigo-600" /> My Payments & Receipts
          </h1>
          <p className="text-xs text-slate-500 mt-1">View transaction history, print official receipts, or pay rent online.</p>
        </div>

        <Button
          variant="success"
          leftIcon={<CreditCard className="w-4 h-4" />}
          onClick={() => setIsRazorpayOpen(true)}
        >
          Pay Rent Online
        </Button>
      </div>

      <Table
        columns={columns}
        data={myPayments}
        pageSize={8}
        searchKey="receipt_no"
        searchPlaceholder="Search receipt number..."
      />

      <ReceiptModal
        isOpen={!!selectedReceiptPayment}
        onClose={() => setSelectedReceiptPayment(null)}
        payment={selectedReceiptPayment}
      />

      <RazorpayModal
        isOpen={isRazorpayOpen}
        onClose={() => setIsRazorpayOpen(false)}
        amount={tenant.monthly_rent}
        tenantId={tenant.id}
        onSuccess={() => setIsRazorpayOpen(false)}
      />
    </div>
  );
};
