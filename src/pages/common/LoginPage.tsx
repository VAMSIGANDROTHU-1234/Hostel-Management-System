import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Building, ShieldCheck, Mail, Lock, AlertCircle, ArrowRight, UserCheck, KeyRound } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    const result = login(email, password);

    if (!result.success) {
      setError(result.error || 'Invalid credentials.');
      return;
    }

    // Role-Based Navigation Redirection
    if (result.user?.role === 'manager') {
      navigate('/manager/dashboard', { replace: true });
    } else {
      if (result.user?.must_change_password) {
        navigate('/tenant/change-password', { replace: true });
      } else {
        navigate('/tenant/dashboard', { replace: true });
      }
    }
  };

  const handleAutofillManager = () => {
    setEmail('vamsigandrothu@gmail.com');
    setPassword('vamsigandu');
    setError(null);
  };

  const handleAutofillTenant = () => {
    setEmail('tenant@hostelsphere.com');
    setPassword('Tenant@1234');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-charcoal-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden select-none">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center font-extrabold text-2xl mx-auto shadow-xl shadow-red-600/20 border border-red-500/30">
            <Building className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">HostelSphere SaaS</h1>
          <p className="text-xs text-slate-400 font-medium">Enterprise Property Management & Resident Portal</p>
        </div>

        {/* Login Form Card */}
        <Card className="p-6 bg-charcoal-900 border border-charcoal-800 shadow-2xl rounded-3xl space-y-5">
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <Input
              label="Email Address *"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="vamsigandrothu@gmail.com"
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
              required
            />

            <Input
              label="Password *"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••••"
              leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
              required
            />

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" variant="primary" className="w-full py-3" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Sign In to Portal
            </Button>
          </form>

          {/* Quick Demo Autofill Controls */}
          <div className="pt-4 border-t border-charcoal-800 space-y-2.5">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">
              Quick Demo Input Autofill
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleAutofillManager}
                className="p-2.5 rounded-xl bg-charcoal-800/80 hover:bg-charcoal-800 border border-charcoal-700 text-left text-xs font-semibold text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-1.5 text-red-400 font-bold text-[11px]">
                  <UserCheck className="w-3.5 h-3.5" /> Manager Account
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">vamsigandrothu@gmail.com</div>
              </button>

              <button
                type="button"
                onClick={handleAutofillTenant}
                className="p-2.5 rounded-xl bg-charcoal-800/80 hover:bg-charcoal-800 border border-charcoal-700 text-left text-xs font-semibold text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                  <KeyRound className="w-3.5 h-3.5" /> Tenant Account
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">tenant@hostelsphere.com</div>
              </button>
            </div>
          </div>
        </Card>

        <div className="text-center text-xs text-slate-500">
          Single Permanent Manager: <span className="font-mono text-slate-400 font-bold">vamsigandrothu@gmail.com</span>
        </div>
      </div>
    </div>
  );
};
