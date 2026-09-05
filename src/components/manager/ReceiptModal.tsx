import React from 'react';
import { Payment } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useData } from '../../context/DataContext';
import { generatePaymentPDFReceipt } from '../../utils/pdfGenerator';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Printer, Download, CheckCircle2, Building, ShieldCheck } from 'lucide-react';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, payment }) => {
  const { settings } = useData();

  if (!payment) return null;

  const handlePrint = () => {
    generatePaymentPDFReceipt(payment, settings);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Official Rent Receipt" maxWidth="md">
      <div className="space-y-6">
        {/* Receipt Container Card */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <Building className="w-4 h-4" /> {settings.hostel_name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">{settings.address}</p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Receipt No</span>
              <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100">{payment.receipt_no}</span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">Tenant Billed</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm block mt-0.5">
                {payment.tenant?.user?.name || 'Tenant'}
              </span>
              <span className="text-slate-500">
                Room {payment.tenant?.room?.room_number || 'N/A'} (Bed {payment.tenant?.bed?.bed_number || 'N/A'})
              </span>
            </div>

            <div className="text-right">
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">Payment Status</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-extrabold mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> CLEARED & PAID
              </span>
              <div className="text-slate-500 mt-0.5">Method: {payment.payment_method}</div>
            </div>
          </div>

          {/* Summary Table */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden text-xs">
            <div className="bg-slate-100 dark:bg-slate-800 p-2.5 flex justify-between font-semibold text-slate-600 dark:text-slate-300">
              <span>Item Description</span>
              <span>Amount</span>
            </div>
            <div className="p-3 flex justify-between border-b border-slate-100 dark:border-slate-800">
              <span>Hostel Monthly Accommodation Rent</span>
              <span className="font-semibold">{formatCurrency(payment.amount - (payment.late_fee || 0))}</span>
            </div>
            {payment.late_fee > 0 && (
              <div className="p-3 flex justify-between border-b border-slate-100 dark:border-slate-800">
                <span>Overdue Late Charge Fee</span>
                <span className="font-semibold text-rose-500">{formatCurrency(payment.late_fee)}</span>
              </div>
            )}
            <div className="p-3 bg-indigo-500/10 flex justify-between font-extrabold text-indigo-900 dark:text-indigo-300 text-sm">
              <span>Total Paid</span>
              <span className="text-indigo-600 dark:text-indigo-400">{formatCurrency(payment.amount)}</span>
            </div>
          </div>

          <div className="text-[11px] text-center text-slate-400 pt-1 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" /> Computer generated official transaction receipt.
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" className="flex-1" leftIcon={<Printer className="w-4 h-4" />} onClick={handlePrint}>
            Print / Save PDF
          </Button>
        </div>
      </div>
    </Modal>
  );
};
