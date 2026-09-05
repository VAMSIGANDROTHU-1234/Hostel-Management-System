import React, { useState } from 'react';
import { Tenant } from '../../types';
import { useData } from '../../context/DataContext';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { KeyRound, Sparkles, CheckCircle2, Lock } from 'lucide-react';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant | null;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
  tenant,
}) => {
  const { resetTenantPassword } = useData();
  const [newTempPassword, setNewTempPassword] = useState('Hostel@1234');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!tenant) return null;

  const handleGenerate = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@#';
    let pass = 'H';
    for (let i = 0; i < 9; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewTempPassword(pass);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTempPassword.trim()) return;

    resetTenantPassword(tenant.id, newTempPassword);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Reset Login Password - ${tenant.user?.name}`}
      description="Issue a new temporary login password for this tenant. Mandatory password change will be enforced on next login."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Input
              label="New Temporary Password *"
              value={newTempPassword}
              onChange={e => setNewTempPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
              required
            />
          </div>
          <Button type="button" variant="outline" size="md" leftIcon={<Sparkles className="w-4 h-4" />} onClick={handleGenerate}>
            Generate
          </Button>
        </div>

        {isSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-1.5 font-bold">
            <CheckCircle2 className="w-4 h-4" /> Password reset successfully!
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-charcoal-800">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" leftIcon={<KeyRound className="w-4 h-4" />}>
            Reset Password
          </Button>
        </div>
      </form>
    </Modal>
  );
};
