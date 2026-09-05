import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { QrCode, Copy, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { useToast } from '../ui/Toast';

interface QrPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  upiId: string;
  hostelName: string;
  tenantName: string;
  amount: number;
}

export const QrPaymentModal: React.FC<QrPaymentModalProps> = ({
  isOpen,
  onClose,
  upiId,
  hostelName,
  tenantName,
  amount,
}) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const cleanUpiId = upiId || 'havenstays@upi';
  const upiDeepLink = `upi://pay?pa=${cleanUpiId}&pn=${encodeURIComponent(hostelName)}&am=${amount}&tn=${encodeURIComponent(tenantName)}_Rent`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiDeepLink)}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(cleanUpiId);
    setCopied(true);
    showToast('UPI ID copied to clipboard.', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Instant UPI Payment QR Code"
      description="Scan using PhonePe, Google Pay, Paytm, or BHIM UPI app to complete rent payment."
      maxWidth="md"
    >
      <div className="flex flex-col items-center justify-center space-y-4 text-center py-2">
        {/* QR Image Container */}
        <div className="p-4 rounded-3xl bg-white dark:bg-charcoal-900 border-2 border-red-600/30 shadow-2xl relative group">
          <img
            src={qrCodeUrl}
            alt="UPI QR Code"
            className="w-56 h-56 object-contain rounded-2xl"
          />
          <div className="absolute top-2 right-2 p-1.5 rounded-full bg-emerald-500 text-white shadow-md">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        {/* Payment Amount & Recipient Badge */}
        <div>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(amount)}
          </span>
          <p className="text-xs text-slate-500 mt-0.5">
            Rent Payment for <strong className="text-slate-700 dark:text-slate-300">{tenantName}</strong>
          </p>
        </div>

        {/* UPI ID Copy Chip */}
        <div className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-charcoal-800/80 border border-slate-200 dark:border-charcoal-700 flex items-center justify-between font-mono text-xs">
          <div className="text-left">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Official Hostel UPI VPA</span>
            <span className="font-bold text-slate-900 dark:text-slate-100">{cleanUpiId}</span>
          </div>

          <button
            onClick={handleCopyUpi}
            className="px-3 py-1.5 rounded-xl bg-red-600/10 text-red-600 dark:text-red-400 hover:bg-red-600/20 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy UPI'}
          </button>
        </div>

        <p className="text-[11px] text-slate-400 italic">
          Payments scanned via this QR are automatically credited to {hostelName} bank account.
        </p>

        <Button variant="secondary" className="w-full" onClick={onClose}>
          Close QR Window
        </Button>
      </div>
    </Modal>
  );
};
