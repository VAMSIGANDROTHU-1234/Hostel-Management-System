import React, { useState } from 'react';
import { Plus, X, UserPlus, CreditCard, BedDouble, MessageSquareWarning, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FloatingActionButtonProps {
  onOpenTenantModal: () => void;
  onOpenPaymentModal: () => void;
  onOpenVisitorModal: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onOpenTenantModal,
  onOpenPaymentModal,
  onOpenVisitorModal,
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      label: 'Provision Tenant',
      icon: UserPlus,
      color: 'bg-red-600 hover:bg-red-700 text-white',
      onClick: () => {
        onOpenTenantModal();
        setIsOpen(false);
      },
    },
    {
      label: 'Record Payment',
      icon: CreditCard,
      color: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      onClick: () => {
        onOpenPaymentModal();
        setIsOpen(false);
      },
    },
    {
      label: 'Assign Bed',
      icon: BedDouble,
      color: 'bg-blue-600 hover:bg-blue-700 text-white',
      onClick: () => {
        navigate('/manager/empty-beds');
        setIsOpen(false);
      },
    },
    {
      label: 'Send WhatsApp',
      icon: MessageSquare,
      color: 'bg-emerald-500 hover:bg-emerald-600 text-white',
      onClick: () => {
        navigate('/manager/whatsapp-reminders');
        setIsOpen(false);
      },
    },
    {
      label: 'Check-In Visitor',
      icon: MessageSquareWarning,
      color: 'bg-amber-600 hover:bg-amber-700 text-white',
      onClick: () => {
        onOpenVisitorModal();
        setIsOpen(false);
      },
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Speed Dial Menu items */}
      {isOpen && (
        <div className="mb-3 space-y-2 flex flex-col items-end animate-in slide-in-from-bottom-5 duration-200">
          {actions.map((act, idx) => {
            const Icon = act.icon;
            return (
              <div key={idx} className="flex items-center gap-2 group">
                <span className="text-xs font-extrabold px-2.5 py-1 rounded-xl bg-charcoal-900 text-white border border-charcoal-700 shadow-xl opacity-90 group-hover:opacity-100 transition-opacity">
                  {act.label}
                </span>
                <button
                  onClick={act.onClick}
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-xl transition-transform hover:scale-110 active:scale-95 ${act.color}`}
                >
                  <Icon className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-300 ${
          isOpen
            ? 'bg-charcoal-900 text-white rotate-45 border border-charcoal-700'
            : 'bg-gradient-to-tr from-red-600 via-crimson-600 to-rose-500 text-white shadow-glow-red hover:scale-105 active:scale-95'
        }`}
        title="Quick Action Menu"
      >
        <Plus className="w-7 h-7" />
      </button>
    </div>
  );
};
