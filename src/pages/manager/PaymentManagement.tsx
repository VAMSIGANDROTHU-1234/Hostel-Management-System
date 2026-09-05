import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Payment } from '../../types';
import { Table, Column } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Select';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { PaymentModal } from '../../components/manager/PaymentModal';
import { ReceiptModal } from '../../components/manager/ReceiptModal';
import { QrPaymentModal } from '../../components/common/QrPaymentModal';
import { exportPaymentsToCSV, exportPaymentsToExcel } from '../../utils/exportUtils';
import { Plus, Printer, Download, CreditCard, QrCode, FileSpreadsheet } from 'lucide-react';

export const PaymentManagement: React.FC = () => {
  const { payments, settings } = useData();

  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const [selectedReceiptPayment, setSelectedReceiptPayment] = useState<Payment | null>(null);

  const filteredPayments = payments.filter(p => {
    if (statusFilter === 'all') return true;
    return p.status === statusFilter;
  });

  const columns: Column<Payment>[] = [
    {
      key: 'receipt_no',
      header: 'Receipt No',
      sortable: true,
      render: p => <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">{p.receipt_no}</span>,
    },
    {
      key: 'tenant',
      header: 'Tenant Name & Room',
      sortable: true,
      render: p => (
        <div>
          <div className="font-bold text-slate-900 dark:text-slate-100">{p.tenant?.user?.name || 'Tenant'}</div>
          <div className="text-xs text-slate-400">
            Room {p.tenant?.room?.room_number || 'N/A'} (Bed {p.tenant?.bed?.bed_number || 'N/A'})
          </div>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount Paid',
      sortable: true,
      render: p => (
        <div>
          <span className="font-extrabold text-slate-900 dark:text-slate-100">{formatCurrency(p.amount)}</span>
          {p.late_fee > 0 && <div className="text-[10px] text-rose-500 font-semibold">+₹{p.late_fee} Late Fee</div>}
        </div>
      ),
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
      sortable: true,
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
    <div className="space-y-6 w-full">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Payment Ledger & Receipts</h1>
          <p className="text-xs text-slate-500 mt-1">Record rent transactions, track overdue payments, calculate late fees, and issue PDF receipts.</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<QrCode className="w-4 h-4 text-emerald-500" />}
            onClick={() => setIsQrModalOpen(true)}
          >
            Show UPI QR
          </Button>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<FileSpreadsheet className="w-4 h-4 text-emerald-600" />}
            onClick={() => exportPaymentsToExcel(filteredPayments)}
          >
            Export Excel
          </Button>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-4 h-4 text-indigo-500" />}
            onClick={() => exportPaymentsToCSV(filteredPayments)}
          >
            Export CSV
          </Button>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsRecordModalOpen(true)}
          >
            Record Payment
          </Button>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex items-center justify-between gap-4">
        <div className="w-48">
          <Select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            options={[
              { label: 'All Transactions', value: 'all' },
              { label: 'Cleared (Paid)', value: 'paid' },
              { label: 'Pending (Due)', value: 'pending' },
              { label: 'Overdue (Late)', value: 'overdue' },
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={filteredPayments}
        pageSize={8}
        searchKey={p => `${p.receipt_no} ${p.tenant?.user?.name || ''} ${p.tenant?.room?.room_number || ''}`}
        searchPlaceholder="Search receipt number, tenant name, room number..."
      />

      {/* Record Payment Modal */}
      <PaymentModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
      />

      {/* Receipt Printable View Modal */}
      <ReceiptModal
        isOpen={!!selectedReceiptPayment}
        onClose={() => setSelectedReceiptPayment(null)}
        payment={selectedReceiptPayment}
      />

      {/* UPI QR Payment Modal */}
      <QrPaymentModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        upiId={settings.upi_id}
        hostelName={settings.hostel_name}
        tenantName="Hostel Resident"
        amount={8500}
      />
    </div>
  );
};
