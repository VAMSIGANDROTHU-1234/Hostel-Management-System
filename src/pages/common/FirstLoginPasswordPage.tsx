import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Building, ShieldCheck, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

export const FirstLoginPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, changePassword } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    const res = changePassword(currentPassword, newPassword);
    if (!res.success) {
      setError(res.error || 'Failed to update password.');
      return;
    }

    setIsSuccess(true);
    setTimeout(() => {
      navigate('/tenant/dashboard', { replace: true });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold text-xl mx-auto shadow-lg shadow-red-600/20">
            <Building className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">Set Permanent Password</h1>
          <p className="text-xs text-slate-400">
            Welcome {user?.name || 'Tenant'}! For security, please update your temporary password before accessing the portal.
          </p>
        </div>

        <Card className="p-6 bg-charcoal-900 border border-charcoal-800 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Temporary Password *"
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              placeholder="Enter current temp password..."
              leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
              required
            />

            <Input
              label="New Permanent Password *"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="At least 6 characters..."
              leftIcon={<ShieldCheck className="w-4 h-4 text-slate-400" />}
              required
            />

            <Input
              label="Confirm New Password *"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password..."
              leftIcon={<ShieldCheck className="w-4 h-4 text-slate-400" />}
              required
            />

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {isSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Password set successfully! Redirecting to dashboard...</span>
              </div>
            )}

            <Button type="submit" variant="primary" className="w-full" size="lg">
              Save Password & Enter Portal
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
