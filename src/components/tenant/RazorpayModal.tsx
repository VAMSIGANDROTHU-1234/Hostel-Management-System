import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { formatCurrency } from '../../utils/formatters';
import { ShieldCheck, CreditCard, QrCode, Building, CheckCircle2, Loader2, Lock } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  tenantId: string;
  onSuccess: () => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  isOpen,
  onClose,
  amount,
  tenantId,
  onSuccess,
}) => {
  const { settings, recordPayment } = useData();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('user@okaxis');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const handlePayNow = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);

      // Record successful payment in state & database
      const nextMonthDueDate = new Date();
      nextMonthDueDate.setMonth(nextMonthDueDate.getMonth() + 1);
      nextMonthDueDate.setDate(settings.rent_due_day || 5);

      recordPayment({
        tenant_id: tenantId,
        amount,
        due_date: nextMonthDueDate.toISOString().split('T')[0],
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: 'Razorpay',
        status: 'paid',
        late_fee: 0,
      });

      onSuccess();
    }, 2000);
  };

  const handleCloseAll = () => {
    setIsPaid(false);
    setIsProcessing(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCloseAll} maxWidth="md">
      {!isPaid ? (
        <div className="space-y-4">
          {/* Razorpay Header Branding */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between shadow-md">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-wide">Razorpay</span>
                <span className="text-[10px] bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded-full font-bold uppercase">Test Mode</span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5">{settings.hostel_name} - Monthly Rent</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-blue-300 uppercase block font-semibold">Total Amount</span>
              <span className="text-xl font-extrabold text-white">{formatCurrency(amount)}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-indigo-600 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <QrCode className="w-5 h-5" /> UPI / QR Code
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-indigo-600 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <CreditCard className="w-5 h-5" /> Debit / Credit Card
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  paymentMethod === 'netbanking'
                    ? 'border-indigo-600 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Building className="w-5 h-5" /> Netbanking
              </button>
            </div>
          </div>

          {/* Form details per method */}
          {paymentMethod === 'upi' && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-3">
              <Input
                label="Enter Virtual Payment Address (VPA / UPI ID)"
                value={upiId}
                onChange={e => setUpiId(e.target.value)}
                placeholder="username@upi or gpay/phonepe"
              />
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Instant verification with 256-bit SSL encryption.
              </p>
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-3">
              <Input label="Card Number" placeholder="4532 •••• •••• 8899" defaultValue="4532 9988 1122 8899" />
              <div className="grid grid-cols-2 gap-2">
                <Input label="Expiry Date" placeholder="MM/YY" defaultValue="12/28" />
                <Input label="CVV" placeholder="•••" defaultValue="888" type="password" />
              </div>
            </div>
          )}

          {paymentMethod === 'netbanking' && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2 text-xs">
              <p className="text-slate-600 dark:text-slate-400">Popular Banks: HDFC, ICICI, SBI, Axis Bank, Kotak</p>
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 font-semibold">
                Test mode simulated netbanking integration ready.
              </div>
            </div>
          )}

          <Button
            variant="primary"
            className="w-full py-3.5 text-base font-bold"
            isLoading={isProcessing}
            onClick={handlePayNow}
            leftIcon={<Lock className="w-4 h-4" />}
          >
            {isProcessing ? 'Securing Transaction...' : `Pay ${formatCurrency(amount)} via Razorpay`}
          </Button>

          <p className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" /> Powered by Razorpay Gateway Integration Architecture
          </p>
        </div>
      ) : (
        /* Success Screen */
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Payment Successful!</h3>
            <p className="text-xs text-slate-500 mt-1">
              Your rent payment of <strong>{formatCurrency(amount)}</strong> was processed successfully.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
            Payment receipt generated & account balance updated.
          </div>

          <Button variant="success" className="w-full" onClick={handleCloseAll}>
            View Receipt & Return
          </Button>
        </div>
      )}
    </Modal>
  );
};
