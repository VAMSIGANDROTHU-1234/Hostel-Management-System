import React, { useState, useEffect } from 'react';
import { Payment } from '../../types';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useData } from '../../context/DataContext';
import { formatCurrency } from '../../utils/formatters';
import { DollarSign, Calendar, CreditCard, ShieldCheck } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTenantId?: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  initialTenantId,
}) => {
  const { tenants, recordPayment } = useData();

  const activeTenants = tenants.filter(t => t.status === 'active');

  const [tenantId, setTenantId] = useState('');
  const [amount, setAmount] = useState(10000);
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<Payment['payment_method']>('UPI');
  const [status, setStatus] = useState<Payment['status']>('paid');
  const [lateFee, setLateFee] = useState(0);

  useEffect(() => {
    if (initialTenantId) {
      setTenantId(initialTenantId);
      const t = activeTenants.find(x => x.id === initialTenantId);
      if (t) setAmount(t.monthly_rent);
    } else if (activeTenants.length > 0) {
      setTenantId(activeTenants[0].id);
      setAmount(activeTenants[0].monthly_rent);
    }
  }, [initialTenantId, isOpen, tenants]);

  // When tenant changes, update rent amount
  const handleTenantChange = (tId: string) => {
    setTenantId(tId);
    const t = activeTenants.find(x => x.id === tId);
    if (t) setAmount(t.monthly_rent);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId) return;

    recordPayment({
      tenant_id: tenantId,
      amount: Number(amount) + Number(lateFee),
      due_date: dueDate,
      payment_date: status === 'paid' ? paymentDate : undefined,
      payment_method: paymentMethod,
      status,
      late_fee: Number(lateFee),
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Rent Payment"
      description="Manually record rent collection, calculate late fees, and auto-generate receipt."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Select Tenant *"
          value={tenantId}
          onChange={e => handleTenantChange(e.target.value)}
          options={activeTenants.map(t => ({
            label: `${t.user?.name || 'Tenant'} (Room ${t.room?.room_number || 'N/A'} - Bed ${t.bed?.bed_number || 'N/A'})`,
            value: t.id,
          }))}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Base Rent Amount (₹) *"
            type="number"
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            leftIcon={<DollarSign className="w-4 h-4 text-slate-400" />}
            required
          />

          <Input
            label="Late Fee (₹)"
            type="number"
            value={lateFee}
            onChange={e => setLateFee(Number(e.target.value))}
            placeholder="0"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Rent Due Date *"
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            leftIcon={<Calendar className="w-4 h-4 text-slate-400" />}
            required
          />

          <Select
            label="Payment Status *"
            value={status}
            onChange={e => setStatus(e.target.value as Payment['status'])}
            options={[
              { label: 'Paid (Cleared)', value: 'paid' },
              { label: 'Pending (Due)', value: 'pending' },
              { label: 'Overdue (Late)', value: 'overdue' },
            ]}
          />
        </div>

        {status === 'paid' && (
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Payment Date *"
              type="date"
              value={paymentDate}
              onChange={e => setPaymentDate(e.target.value)}
              required
            />

            <Select
              label="Payment Method *"
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value as Payment['payment_method'])}
              options={[
                { label: 'UPI / GPay / PhonePe', value: 'UPI' },
                { label: 'Razorpay Online Gateway', value: 'Razorpay' },
                { label: 'Cash Payment', value: 'Cash' },
                { label: 'Bank Transfer (IMPS/NEFT)', value: 'Bank Transfer' },
              ]}
            />
          </div>
        )}

        <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between text-xs font-bold text-indigo-900 dark:text-indigo-300">
          <span>Total Collection Amount:</span>
          <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">
            {formatCurrency(Number(amount) + Number(lateFee))}
          </span>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="flex-1" leftIcon={<ShieldCheck className="w-4 h-4" />}>
            Record & Issue Receipt
          </Button>
        </div>
      </form>
    </Modal>
  );
};
