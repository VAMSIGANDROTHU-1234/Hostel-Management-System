import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Building, ShieldCheck, UserCheck, Lock, Mail, Sparkles, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginAsManager, loginAsTenant } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const res = login(email, password);
      setIsLoading(false);

      if (res.success) {
        if (email.toLowerCase().includes('manager')) {
          navigate('/manager/dashboard');
        } else {
          navigate('/tenant/dashboard');
        }
      } else {
        setError(res.error || 'Invalid credentials');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-charcoal-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Crimson Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 via-crimson-600 to-rose-500 flex items-center justify-center text-white mx-auto shadow-glow-red font-extrabold">
            <Building className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">HostelSphere SaaS</h1>
          <p className="text-xs text-red-400 font-semibold uppercase tracking-wider">Luxury Crimson Red Edition</p>
        </div>

        {/* Quick Demo Credentials Panel */}
        <div className="p-4 rounded-2xl bg-charcoal-900/90 border border-charcoal-800 shadow-2xl space-y-3 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5 text-red-400">
              <Sparkles className="w-4 h-4" /> Quick Demo Login Portals
            </span>
            <span className="text-[10px] text-slate-500 uppercase">1-Click Access</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                loginAsManager();
                navigate('/manager/dashboard');
              }}
              className="p-3 rounded-xl bg-charcoal-800/80 border border-charcoal-700 hover:border-red-500 text-left transition-all group"
            >
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-red-400" /> Manager</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1 truncate">manager@hostelsphere.com</p>
            </button>

            <button
              type="button"
              onClick={() => {
                loginAsTenant();
                navigate('/tenant/dashboard');
              }}
              className="p-3 rounded-xl bg-charcoal-800/80 border border-charcoal-700 hover:border-emerald-500 text-left transition-all group"
            >
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span className="flex items-center gap-1"><UserCheck className="w-3.5 h-3.5 text-emerald-400" /> Tenant</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1 truncate">tenant@hostelsphere.com</p>
            </button>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="p-8 rounded-3xl bg-charcoal-900/80 border border-charcoal-800 shadow-2xl backdrop-blur-xl space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="manager@hostelsphere.com"
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
              required
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded border-charcoal-700 text-red-600 focus:ring-red-500 bg-charcoal-800"
                />
                Remember me
              </label>

              <Link to="/forgot-password" className="text-red-400 hover:underline font-semibold">
                Forgot password?
              </Link>
            </div>

            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

            <Button type="submit" variant="primary" className="w-full py-3.5 text-sm font-bold" isLoading={isLoading}>
              Sign In to Portal
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
};
