import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, title?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info', title?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastMessage = { id, type, title, message };

    setToasts(prev => [...prev.slice(-4), newToast]); // Keep max 5 toasts

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => {
          let bgColor = 'bg-white dark:bg-charcoal-900 border-slate-200 dark:border-charcoal-800 text-slate-900 dark:text-slate-100';
          let Icon = Info;
          let iconColor = 'text-blue-500';

          if (toast.type === 'success') {
            bgColor = 'bg-white dark:bg-charcoal-900 border-emerald-500/30 text-slate-900 dark:text-slate-100';
            Icon = CheckCircle2;
            iconColor = 'text-emerald-500';
          } else if (toast.type === 'error') {
            bgColor = 'bg-white dark:bg-charcoal-900 border-rose-500/30 text-slate-900 dark:text-slate-100';
            Icon = AlertCircle;
            iconColor = 'text-rose-500';
          } else if (toast.type === 'warning') {
            bgColor = 'bg-white dark:bg-charcoal-900 border-amber-500/30 text-slate-900 dark:text-slate-100';
            Icon = AlertTriangle;
            iconColor = 'text-amber-500';
          }

          return (
            <div
              key={toast.id}
              className={`p-3.5 rounded-2xl border shadow-xl backdrop-blur-md flex items-start gap-3 pointer-events-auto transition-all animate-in slide-in-from-top-3 duration-300 ${bgColor}`}
            >
              <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
              <div className="flex-1 min-w-0">
                {toast.title && <div className="text-xs font-bold mb-0.5">{toast.title}</div>}
                <div className="text-xs text-slate-600 dark:text-slate-300 leading-snug">{toast.message}</div>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
