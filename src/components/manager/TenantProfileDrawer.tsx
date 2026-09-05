import React, { useState } from 'react';
import { Tenant, Payment, Complaint, Visitor } from '../../types';
import { useData } from '../../context/DataContext';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { formatCurrency, formatDate, formatDateTime, maskIdNumber } from '../../utils/formatters';
import { generateWhatsAppWebLink } from '../../services/whatsappService';
import { generatePoliceVerificationPDF } from '../../utils/pdfGenerator';
import { ResetPasswordModal } from './ResetPasswordModal';
import {
  Phone,
  MessageSquare,
  Building2,
  BedDouble,
  ShieldCheck,
  CreditCard,
  MessageSquareWarning,
  UserCheck,
  FileText,
  Printer,
  ExternalLink,
  Calendar,
  AlertCircle,
  FileCheck,
  History,
  Camera,
  CheckCircle2,
  KeyRound,
  UserX,
  UserCheck2
} from 'lucide-react';
import { ReceiptModal } from './ReceiptModal';

interface TenantProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant | null;
}

export const TenantProfileDrawer: React.FC<TenantProfileDrawerProps> = ({
  isOpen,
  onClose,
  tenant,
}) => {
  const { payments, complaints, visitors, settings, auditLogs, deactivateTenant, activateTenant } = useData();

  const [selectedReceiptPayment, setSelectedReceiptPayment] = useState<Payment | null>(null);
  const [isAadhaarModalOpen, setIsAadhaarModalOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'audit'>('profile');

  if (!tenant) return null;

  const isDeactivated = tenant.user?.is_deactivated;

  const tenantPayments = payments.filter(p => p.tenant_id === tenant.id);
  const tenantComplaints = complaints.filter(c => c.tenant_id === tenant.id);
  const tenantVisitors = visitors.filter(v => v.tenant_id === tenant.id);
  const tenantAuditLogs = auditLogs.filter(a => a.tenant_id === tenant.id);

  const maskedId = maskIdNumber(tenant.id_type, tenant.id_proof_number || tenant.masked_id_number);

  const handleWhatsApp = () => {
    const text = `Hello ${tenant.user?.name},\n\nHope you are having a comfortable stay at our hostel!`;
    const link = generateWhatsAppWebLink(tenant.user?.phone || '', text);
    window.open(link, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${tenant.user?.phone}`, '_self');
  };

  const handlePolicePDF = () => {
    generatePoliceVerificationPDF(tenant, settings);
  };

  const handleToggleDeactivation = () => {
    if (isDeactivated) {
      activateTenant(tenant.id);
    } else {
      deactivateTenant(tenant.id);
    }
  };

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        title={`Tenant Dossier - ${tenant.user?.name}`}
        subtitle={`Room ${tenant.room?.room_number || '102'} • Bed ${tenant.bed?.bed_number || '102-A'}`}
        size="lg"
      >
        <div className="space-y-6 pt-2">
          {/* Top Profile Card Header */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-red-950 via-crimson-900 to-charcoal-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl border border-red-900/40">
            <div className="flex items-center gap-4">
              <img
                src={tenant.live_photo_url || tenant.user?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250'}
                alt={tenant.user?.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-red-500 shadow-md"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold tracking-tight">{tenant.user?.name}</h3>
                  {tenant.live_photo_url && (
                    <span className="p-1 rounded-full bg-emerald-500 text-white" title="Live Photo Captured">
                      <Camera className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-red-200 mt-0.5">{tenant.user?.email} • {tenant.user?.phone}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={isDeactivated ? 'danger' : tenant.status === 'active' ? 'success' : 'neutral'}>
                    {isDeactivated ? 'ACCOUNT DEACTIVATED' : tenant.status.toUpperCase()}
                  </Badge>
                  <span className="text-[11px] text-red-300 font-semibold">Joined: {formatDate(tenant.joining_date)}</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<KeyRound className="w-4 h-4 text-amber-400" />}
                onClick={() => setIsResetPasswordOpen(true)}
              >
                Reset Password
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={isDeactivated ? <UserCheck2 className="w-4 h-4 text-emerald-400" /> : <UserX className="w-4 h-4 text-rose-400" />}
                onClick={handleToggleDeactivation}
              >
                {isDeactivated ? 'Activate' : 'Deactivate'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<FileCheck className="w-4 h-4 text-red-400" />}
                onClick={handlePolicePDF}
              >
                Police PDF
              </Button>
              <Button
                variant="success"
                size="sm"
                leftIcon={<MessageSquare className="w-4 h-4" />}
                onClick={handleWhatsApp}
              >
                WhatsApp
              </Button>
            </div>
          </div>

          {/* Sub-Tabs: Profile Dossier vs Audit Log */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-charcoal-800 pb-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'profile'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-charcoal-800'
              }`}
            >
              Profile & Documents
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'audit'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-charcoal-800'
              }`}
            >
              <History className="w-3.5 h-3.5" /> Identity Audit Log ({tenantAuditLogs.length})
            </button>
          </div>

          {/* TAB 1: PROFILE & DOCUMENTS */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Quick Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-charcoal-800/60 border border-slate-200 dark:border-charcoal-700">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Room / Bed</span>
                  <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                    {tenant.room?.room_number} ({tenant.bed?.bed_number})
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-charcoal-800/60 border border-slate-200 dark:border-charcoal-700">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Monthly Rent</span>
                  <span className="text-sm font-extrabold text-red-600 dark:text-red-400">
                    {formatCurrency(tenant.monthly_rent)}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-charcoal-800/60 border border-slate-200 dark:border-charcoal-700">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Identity Document</span>
                  <span className="text-xs font-mono font-extrabold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                    {maskedId}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-charcoal-800/60 border border-slate-200 dark:border-charcoal-700 flex flex-col justify-between">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Verified ID Proof</span>
                  <button
                    onClick={() => setIsAadhaarModalOpen(true)}
                    className="text-xs font-extrabold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" /> View Document
                  </button>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-800/40 border border-slate-200 dark:border-charcoal-700 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Emergency Contact</span>
                  <div className="font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">{tenant.emergency_name}</div>
                </div>
                <div className="font-extrabold text-slate-900 dark:text-slate-100">{tenant.emergency_phone}</div>
              </div>

              {/* Payment Timeline Ledger */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-500" /> Payment History & Ledger ({tenantPayments.length})
                </h4>

                {tenantPayments.length > 0 ? (
                  <div className="space-y-2">
                    {tenantPayments.map(pay => (
                      <div
                        key={pay.id}
                        className="p-3.5 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2 font-mono font-bold text-slate-900 dark:text-slate-100">
                            <span>{pay.receipt_no}</span>
                            <Badge variant={pay.status === 'paid' ? 'success' : pay.status === 'pending' ? 'warning' : 'danger'}>
                              {pay.status.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">Due: {formatDate(pay.due_date)} • Method: {pay.payment_method}</div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">{formatCurrency(pay.amount)}</span>
                          <button
                            onClick={() => setSelectedReceiptPayment(pay)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-charcoal-700 hover:bg-slate-100 dark:hover:bg-charcoal-800"
                            title="Print Receipt"
                          >
                            <Printer className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400 border border-dashed rounded-xl">
                    No payment transactions recorded yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: AUDIT LOG */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-charcoal-800/40 border border-slate-200 dark:border-charcoal-700 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>All identity uploads, camera captures, and room updates are logged for compliance.</span>
              </div>

              {tenantAuditLogs.length > 0 ? (
                <div className="space-y-3">
                  {tenantAuditLogs.map(log => (
                    <div key={log.id} className="p-3.5 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-100">
                        <Badge variant="crimson">{log.action_type.replace('_', ' ')}</Badge>
                        <span className="text-[10px] text-slate-400">{formatDateTime(log.timestamp)}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">{log.details}</p>
                      <div className="text-[10px] text-slate-400 font-semibold pt-1 border-t border-slate-100 dark:border-charcoal-800">
                        Actor: {log.actor_name}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-400 border border-dashed rounded-xl">
                  No specific audit logs recorded for this tenant yet.
                </div>
              )}
            </div>
          )}
        </div>
      </Drawer>

      {/* ID Document Preview Modal */}
      <Modal isOpen={isAadhaarModalOpen} onClose={() => setIsAadhaarModalOpen(false)} title="Verified Identity Proof Document" maxWidth="lg">
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-charcoal-800 text-xs font-mono font-bold flex items-center justify-between">
            <span>Document Type: {(tenant.id_type || 'aadhaar').toUpperCase()} CARD</span>
            <span className="text-red-600 dark:text-red-400">Masked ID: {maskedId}</span>
          </div>
          <img
            src={tenant.id_proof_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800'}
            alt="Verified Identity Proof"
            className="w-full h-80 object-cover rounded-2xl border shadow-md"
          />
          <Button variant="secondary" className="w-full" onClick={() => setIsAadhaarModalOpen(false)}>
            Close Document Preview
          </Button>
        </div>
      </Modal>

      {/* Reset Password Modal */}
      <ResetPasswordModal
        isOpen={isResetPasswordOpen}
        onClose={() => setIsResetPasswordOpen(false)}
        tenant={tenant}
      />

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={!!selectedReceiptPayment}
        onClose={() => setSelectedReceiptPayment(null)}
        payment={selectedReceiptPayment}
      />
    </>
  );
};
