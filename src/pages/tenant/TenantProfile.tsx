import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency, formatDate, maskIdNumber } from '../../utils/formatters';
import { User, ShieldCheck, Lock, FileText, Phone, Mail, CheckCircle2, AlertCircle, Edit3, MessageSquare } from 'lucide-react';

export const TenantProfile: React.FC = () => {
  const { user } = useAuth();
  const { tenants, requestProfileCorrection } = useData();

  const tenant = tenants.find(t => t.user_id === user?.id || t.user?.email.toLowerCase() === user?.email.toLowerCase()) || tenants[0];

  const maskedId = maskIdNumber(tenant.id_type, tenant.id_proof_number || tenant.masked_id_number);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordSuccess, setIsPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Request profile correction modal state
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
  const [fieldName, setFieldName] = useState('phone');
  const [requestedValue, setRequestedValue] = useState('');
  const [reason, setReason] = useState('');
  const [isCorrectionSubmitted, setIsCorrectionSubmitted] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setIsPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setIsPasswordSuccess(false), 3000);
  };

  const handleCorrectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestedValue.trim() || !reason.trim()) return;

    requestProfileCorrection(tenant.id, fieldName, requestedValue, reason);
    setIsCorrectionSubmitted(true);
    setTimeout(() => {
      setIsCorrectionSubmitted(false);
      setIsCorrectionModalOpen(false);
      setRequestedValue('');
      setReason('');
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-red-600" /> My Profile & Verified Identity
        </h1>
        <p className="text-xs text-slate-500 mt-1">View room allocation, verified identity credentials, and security settings.</p>
      </div>

      {/* Top Dossier Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 dark:border-charcoal-800 pb-6 mb-6">
          <div className="flex items-center gap-4">
            <img
              src={tenant.live_photo_url || tenant.user?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'}
              alt={tenant.user?.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{tenant.user?.name}</h3>
                <Badge variant="success">VERIFIED TENANT</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{tenant.user?.email} • {tenant.user?.phone}</p>
              <div className="text-xs text-red-600 dark:text-red-400 font-bold mt-1">
                Room {tenant.room?.room_number || '102'} (Bed {tenant.bed?.bed_number || '102-A'}) • {tenant.room?.room_type || 'Double Sharing'}
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Edit3 className="w-4 h-4 text-amber-500" />}
            onClick={() => setIsCorrectionModalOpen(true)}
          >
            Request Profile Correction
          </Button>
        </div>

        {/* Read-Only Identity & Accommodation Specs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-charcoal-800/60 border border-slate-200 dark:border-charcoal-700">
            <span className="text-slate-400 font-semibold uppercase text-[10px] block">Verified ID Type & Masked No</span>
            <span className="text-sm font-mono font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">
              {(tenant.id_type || 'aadhaar').toUpperCase()}: {maskedId}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-charcoal-800/60 border border-slate-200 dark:border-charcoal-700">
            <span className="text-slate-400 font-semibold uppercase text-[10px] block">Monthly Rent</span>
            <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100 mt-1 block">
              {formatCurrency(tenant.monthly_rent)}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-charcoal-800/60 border border-slate-200 dark:border-charcoal-700">
            <span className="text-slate-400 font-semibold uppercase text-[10px] block">Security Deposit</span>
            <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100 mt-1 block">
              {formatCurrency(tenant.deposit)}
            </span>
          </div>
        </div>

        {/* Manager Editing Restriction Banner */}
        <div className="mt-4 p-3 rounded-xl bg-slate-100 dark:bg-charcoal-800/80 border border-slate-200 dark:border-charcoal-700 text-xs text-slate-500 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Identity documents and photos are manager-managed for security. Use "Request Profile Correction" to submit updates.</span>
        </div>
      </Card>

      {/* Change Password Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-600" /> Security & Account Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
            <Input
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
            />

            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />

            {passwordError && <p className="text-xs text-red-500 font-medium">{passwordError}</p>}

            {isPasswordSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Password updated successfully!
              </div>
            )}

            <Button type="submit" variant="primary">
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Request Profile Correction Modal */}
      <Modal
        isOpen={isCorrectionModalOpen}
        onClose={() => setIsCorrectionModalOpen(false)}
        title="Request Profile Correction"
        description="Submit correction details to the Hostel Manager for verification and approval."
        maxWidth="md"
      >
        <form onSubmit={handleCorrectionSubmit} className="space-y-4">
          <Select
            label="Field Needing Correction *"
            value={fieldName}
            onChange={e => setFieldName(e.target.value)}
            options={[
              { label: 'Mobile Phone Number', value: 'phone' },
              { label: 'Emergency Contact Person', value: 'emergency_name' },
              { label: 'Emergency Contact Phone', value: 'emergency_phone' },
              { label: 'Full Legal Name Spelling', value: 'name' },
            ]}
          />

          <Input
            label="Corrected New Value *"
            value={requestedValue}
            onChange={e => setRequestedValue(e.target.value)}
            placeholder="Enter the correct information..."
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Reason for Correction *
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Explain why this correction is required..."
              className="w-full bg-slate-50 dark:bg-charcoal-800/80 border border-slate-200 dark:border-charcoal-700 rounded-xl p-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-600"
              required
            />
          </div>

          {isCorrectionSubmitted && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Request submitted to Manager!
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-charcoal-800">
            <Button type="button" variant="secondary" onClick={() => setIsCorrectionModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Submit Correction Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
