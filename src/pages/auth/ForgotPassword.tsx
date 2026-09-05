import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        <div className="space-y-2">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-indigo-400 font-semibold mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
          <h2 className="text-xl font-bold text-white">Reset Password</h2>
          <p className="text-xs text-slate-400">Enter your registered email address to receive password recovery instructions.</p>
        </div>

        {!isSent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="user@example.com"
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
              required
            />

            <Button type="submit" variant="primary" className="w-full">
              Send Password Reset Link
            </Button>
          </form>
        ) : (
          <div className="text-center py-4 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="text-sm font-bold text-white">Reset Link Dispatched</h4>
            <p className="text-xs text-slate-400">We have sent password reset instructions to <strong>{email}</strong>.</p>
            <Link to="/login">
              <Button variant="outline" className="w-full mt-4">Return to Login</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
